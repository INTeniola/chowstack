
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional()
});

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, requestPasswordReset } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true
    }
  });

  // Create password reset form
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: ""
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page the user was trying to access, or to the home page
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (values: LoginFormValues) => {
    setError(null); // Clear any previous errors
    
    try {
      const success = await login(values.email, values.password, values.rememberMe);
      
      if (success) {
        toast.success("Login successful", {
          description: "Welcome back to MealStock!"
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Authentication failed. Please check your credentials and try again.");
    }
  };

  const handleForgotPassword = async (values: ResetFormValues) => {
    setIsResetting(true);
    try {
      const success = await requestPasswordReset(values.email);
      if (success) {
        setShowResetDialog(false);
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setError(error.message);
        toast.error("Social login failed", {
          description: error.message
        });
      }
    } catch (error: any) {
      console.error("Social login error:", error);
      setError(error?.message || "Failed to login with social provider");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center justify-center">
              <LogIn className="mr-2" size={24} />
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your MealStock account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-start mb-4 text-sm border border-destructive">
                <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-destructive">{error}</span>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            placeholder="name@example.com" 
                            {...field} 
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••" 
                            {...field} 
                            className="pl-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm text-mealstock-green"
                    onClick={() => setShowResetDialog(true)}
                  >
                    Forgot password?
                  </Button>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-mealstock-green hover:underline font-medium">
                Sign up
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('google')}
              >
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('facebook')}
              >
                Facebook
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Password Reset Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reset your password</DialogTitle>
              <DialogDescription>
                Enter your email address and we'll send you a link to reset your password.
              </DialogDescription>
            </DialogHeader>
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isResetting}>
                    {isResetting ? "Sending..." : "Send Reset Link"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </>
  );
};

export default Login;
