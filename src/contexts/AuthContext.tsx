
import { useState, useEffect, createContext } from 'react';
import { User, transformUser, authUtils } from '@/utils/authUtils';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  completeOnboarding: (data: any) => Promise<boolean>;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address?: string;
  isVendor?: boolean;
  termsAccepted: boolean;
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
          const appUser = transformUser(currentSession.user);
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
        const appUser = transformUser(currentSession.user);
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

  const login = async (email: string, password: string, rememberMe: boolean = true): Promise<boolean> => {
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

  const signUp = async (data: SignUpData): Promise<boolean> => {
    if (!data.termsAccepted) {
      toast.error("Terms of Service", {
        description: "You must accept the Terms of Service to create an account."
      });
      return false;
    }

    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        phone: data.phone,
        options: {
          data: {
            full_name: data.name,
            phone_number: data.phone,
            address: data.address || '',
            is_vendor: !!data.isVendor,
            is_admin: false,
            onboarding_completed: false
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
      
      if (authData.user) {
        // Create a new user record in the public.users table
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            { 
              id: authData.user.id,
              email: authData.user.email || '',
              full_name: data.name,
              phone_number: data.phone,
              address: data.address || '',
              is_vendor: !!data.isVendor,
              dietary_preferences: null
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
      const result = await authUtils.updateUserProfile(user.id, updates);
      
      if (!result.success) {
        throw new Error(result.error);
      }

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

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      const result = await authUtils.requestPasswordReset(email);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success("Password reset email sent", {
        description: "Please check your email for instructions to reset your password."
      });
      return true;
    } catch (error: any) {
      toast.error("Password reset failed", {
        description: error.message || "Failed to send password reset email. Please try again."
      });
      return false;
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const result = await authUtils.updatePassword(password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success("Password updated", {
        description: "Your password has been successfully updated."
      });
      return true;
    } catch (error: any) {
      toast.error("Password update failed", {
        description: error.message || "Failed to update password. Please try again."
      });
      return false;
    }
  };

  const completeOnboarding = async (data: any): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Create updates object based on user role
      const updates: Partial<User> = {
        onboardingCompleted: true
      };
      
      if (user.role === 'customer') {
        updates.dietaryPreferences = data.dietaryPreferences;
        updates.address = data.address;
      } else if (user.role === 'vendor') {
        updates.businessInfo = {
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          description: data.description
        };
      }
      
      const success = await updateUserProfile(updates);
      return success;
    } catch (error: any) {
      toast.error("Failed to complete onboarding", {
        description: error.message || "Please try again."
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
    requestPasswordReset,
    updatePassword,
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
