
import { useState, useEffect, createContext } from 'react';
import { User, authUtils } from '@/utils/authUtils';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
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
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const user = await authUtils.getCurrentUser();
          setUser(user);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        authUtils.getCurrentUser().then(user => {
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
          }
        });
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { success, error, user } = await authUtils.signInWithEmail(email, password);
      
      if (success && user) {
        setUser(user);
        setIsAuthenticated(true);
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: error || "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true);
    try {
      const { success, error } = await authUtils.signUpWithEmail(email, password, phone, name);
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: error || "Could not create account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    const { success } = await authUtils.signOut();
    if (success) {
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return false;

    try {
      // Update the user's metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;

      // Also update the profiles table if needed
      if (updates.name || updates.phone) {
        const result = await authUtils.updateUserProfile(user.id, updates);
        if (!result.success) throw new Error(result.error);
      }

      // Update the local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
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
