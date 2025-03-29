
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { checkPasswordStrength } from '@/utils/passwordUtils';
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Create form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    }
  });

  // Watch password to calculate strength
  const password = form.watch("password");
  
  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  // Redirect after successful password reset after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setError(null);
    
    if (passwordStrength <= 1) {
      setError("Please use a stronger password for better security");
      return;
    }
    
    try {
      const success = await updatePassword(values.password);
      
      if (success) {
        setSuccess(true);
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error?.message || "Failed to reset password. Please try again.");
    }
  };
  
  // Get color based on password strength
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center justify-center">
              <Lock className="mr-2" size={24} />
              Reset your password
            </CardTitle>
            <CardDescription className="text-center">
              Enter a new password for your MealStock account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-start mb-4 text-sm border border-destructive">
                <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-destructive">{error}</span>
              </div>
            )}
            
            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800">Password reset successful!</h3>
                  <p className="text-green-700 text-sm mt-1">
                    Your password has been reset. You will be redirected to the login page shortly.
                  </p>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              {...field}
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
                        
                        {/* Password strength indicator */}
                        {field.value && (
                          <div className="mt-2">
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getStrengthColor()}`} 
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {passwordStrength <= 1 && "Weak password"}
                              {passwordStrength > 1 && passwordStrength <= 3 && "Medium password"}
                              {passwordStrength > 3 && "Strong password"}
                            </p>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {success && (
              <Button
                variant="link"
                onClick={() => navigate('/login')}
                className="text-mealstock-green"
              >
                Back to Login
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default ResetPassword;
