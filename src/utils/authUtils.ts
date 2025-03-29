
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// User types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: 'customer' | 'vendor' | 'admin';
  address?: string;
  dietaryPreferences?: Record<string, any>;
  businessInfo?: {
    businessName?: string;
    businessAddress?: string;
    description?: string;
  };
  onboardingCompleted?: boolean;
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
    role: supabaseUser.user_metadata?.is_admin 
      ? 'admin' 
      : (supabaseUser.user_metadata?.is_vendor ? 'vendor' : 'customer'),
    address: supabaseUser.user_metadata?.address || '',
    dietaryPreferences: supabaseUser.user_metadata?.dietary_preferences,
    businessInfo: supabaseUser.user_metadata?.business_info,
    onboardingCompleted: supabaseUser.user_metadata?.onboarding_completed || false
  };
};

// Export authUtils object with utility functions
export const authUtils = {
  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create user metadata updates
      const metadataUpdates: Record<string, any> = {};
      
      if (updates.name) metadataUpdates.full_name = updates.name;
      if (updates.phone) metadataUpdates.phone_number = updates.phone;
      if (updates.address) metadataUpdates.address = updates.address;
      if (updates.dietaryPreferences) metadataUpdates.dietary_preferences = updates.dietaryPreferences;
      if (updates.businessInfo) metadataUpdates.business_info = updates.businessInfo;
      if (updates.onboardingCompleted !== undefined) metadataUpdates.onboarding_completed = updates.onboardingCompleted;

      // Update the user's metadata in Supabase Auth
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: metadataUpdates
      });

      if (authUpdateError) throw authUpdateError;

      // Create updates for the users table
      const dbUpdates: Record<string, any> = {};
      
      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.phone) dbUpdates.phone_number = updates.phone;
      if (updates.address) dbUpdates.address = updates.address;
      if (updates.dietaryPreferences) dbUpdates.dietary_preferences = updates.dietaryPreferences;
      
      // Also update the users table record
      const { error: dbUpdateError } = await supabase
        .from('users')
        .update(dbUpdates)
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
  },
  
  // Request password reset
  requestPasswordReset: async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: error.message || "Failed to request password reset"
      };
    }
  },
  
  // Update password
  updatePassword: async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: error.message || "Failed to update password"
      };
    }
  }
};
