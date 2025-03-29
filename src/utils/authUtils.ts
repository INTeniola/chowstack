
import { User as SupabaseUser } from '@supabase/supabase-js';

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
