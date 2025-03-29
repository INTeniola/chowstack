
import { supabase } from '@/integrations/supabase/client';
import { AuthError, AuthResponse, User as SupabaseUser } from '@supabase/supabase-js';

// User types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: 'customer' | 'vendor';
}

// Auth state types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Transform Supabase user to our User type
const transformUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || '',
    phone: supabaseUser.phone || supabaseUser.user_metadata?.phone || '',
    role: 'customer' // Default role
  };
};

// Supabase auth utils
export const authUtils = {
  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    try {
      const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { 
        success: true, 
        user: data.user ? transformUser(data.user) : null 
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: (error as AuthError).message,
        user: null 
      };
    }
  },
  
  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string, phone: string, name: string) => {
    try {
      const { data, error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });
      
      if (error) throw error;
      
      return { 
        success: true, 
        user: data.user ? transformUser(data.user) : null 
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: (error as AuthError).message,
        user: null 
      };
    }
  },
  
  // Sign in with social provider
  signInWithSocial: async (provider: 'facebook' | 'twitter' | 'google') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      return { success: true, user: null };
    } catch (error) {
      console.error('Social sign in error:', error);
      return { 
        success: false, 
        error: (error as AuthError).message,
        user: null 
      };
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { 
        success: false, 
        error: (error as AuthError).message 
      };
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user ? transformUser(user) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<User>) => {
    try {
      // Update the user's profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          phone: updates.phone
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { 
        success: false, 
        error: (error as any).message 
      };
    }
  }
};
