
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
export const transformUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.full_name || '',
    phone: supabaseUser.phone || supabaseUser.user_metadata?.phone_number || '',
    role: supabaseUser.user_metadata?.is_vendor ? 'vendor' : 'customer'
  };
};

// Export authUtils object with utility functions
export const authUtils = {
  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
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
        .eq('id', userId);

      if (dbUpdateError) throw dbUpdateError;

      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.message || "Failed to update profile" 
      };
    }
  }
};
