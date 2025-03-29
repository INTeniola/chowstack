
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Process the OAuth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error.message);
        toast.error("Authentication failed", {
          description: error.message
        });
        navigate('/login');
        return;
      }
      
      if (data?.session) {
        // Update the users table if this is a new user from OAuth
        const user = data.session.user;
        
        // Check if user is already in the database
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (!existingUser) {
          // Create a new user record
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              { 
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata.full_name || user.user_metadata.name || 'User',
                is_vendor: false
              }
            ]);
            
          if (insertError) {
            console.error("User record creation error:", insertError);
          }
        }
        
        toast.success("Login successful", {
          description: "Welcome to MealStock!"
        });
        navigate('/');
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-16 h-16 border-4 border-mealstock-green border-t-transparent rounded-full animate-spin"></div>
      <h2 className="mt-4 text-xl font-medium">Completing authentication...</h2>
      <p className="mt-2 text-muted-foreground">You will be redirected shortly.</p>
    </div>
  );
};

export default AuthCallback;
