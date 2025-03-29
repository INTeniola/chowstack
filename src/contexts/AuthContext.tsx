
import { useState, useEffect, createContext } from 'react';
import { User, authUtils } from '@/utils/authUtils';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Convert Supabase user to our app User type
          const appUser: User = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: currentSession.user.user_metadata?.full_name || '',
            phone: currentSession.user.phone || currentSession.user.user_metadata?.phone_number || '',
            role: currentSession.user.user_metadata?.is_vendor ? 'vendor' : 'customer'
          };
          
          setUser(appUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        // Only set loading to false after we've handled the auth state change
        if (event === 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        // Convert Supabase user to our app User type
        const appUser: User = {
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          name: currentSession.user.user_metadata?.full_name || '',
          phone: currentSession.user.phone || currentSession.user.user_metadata?.phone_number || '',
          role: currentSession.user.user_metadata?.is_vendor ? 'vendor' : 'customer'
        };
        
        setUser(appUser);
        setSession(currentSession);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error("Login failed", {
          description: error.message
        });
        return false;
      }
      
      if (data.user) {
        // Success is handled by onAuthStateChange
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast.error("Login error", {
        description: "An unexpected error occurred. Please try again."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone_number: phone,
            is_vendor: false
          }
        }
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        toast.error("Registration failed", {
          description: error.message
        });
        return false;
      }
      
      if (data.user) {
        // Create a new user record in the public.users table
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            { 
              id: data.user.id,
              email: data.user.email || '',
              full_name: name,
              phone_number: phone,
              is_vendor: false
            }
          ]);
          
        if (insertError) {
          console.error("User record creation error:", insertError);
          // Don't fail the signup since auth record is created
        }
        
        toast.success("Account created successfully", {
          description: "Please check your email to verify your account."
        });
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      toast.error("Registration error", {
        description: "An unexpected error occurred. Please try again."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        toast.error("Logout failed", {
          description: error.message
        });
        return;
      }
      
      // Reset auth state (handled by onAuthStateChange)
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Unexpected logout error:", error);
      toast.error("Logout error", {
        description: "An unexpected error occurred during logout."
      });
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      // Update the user's metadata in Supabase Auth
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          phone_number: updates.phone
        }
      });

      if (authUpdateError) throw authUpdateError;

      // Also update the users table record
      const { error: dbUpdateError } = await supabase
        .from('users')
        .update({ 
          full_name: updates.name,
          phone_number: updates.phone
        })
        .eq('id', user.id);

      if (dbUpdateError) throw dbUpdateError;

      // Update the local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);

      toast.success("Profile updated", {
        description: "Your profile information has been updated successfully."
      });
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error("Update failed", {
        description: error.message || "Failed to update profile. Please try again later."
      });
      return false;
    }
  };

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    session,
    login,
    signOut,
    signUp,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
