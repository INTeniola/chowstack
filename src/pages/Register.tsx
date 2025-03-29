
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { generateSecurePassword, checkPasswordStrength } from '@/utils/passwordUtils';
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpData } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { registerSchema, RegisterFormValues } from '@/types/auth';
import AccountTypeStep from '@/components/auth/AccountTypeStep';
import AccountInfoStep from '@/components/auth/AccountInfoStep';

import {
  Form
} from "@/components/ui/form";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("accountType");
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      accountType: "customer",
      termsAccepted: false
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const password = form.watch("password");
  
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    
    if (passwordStrength <= 1) {
      setError("Please use a stronger password for better security");
      return;
    }
    
    try {
      const signUpData: SignUpData = {
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone,
        address: "", // We're no longer collecting address at registration
        isVendor: values.accountType === "vendor",
        termsAccepted: values.termsAccepted
      };
      
      const success = await signUp(signUpData);
      
      if (success) {
        toast.success("Account created successfully", {
          description: "Welcome to ChowStack!"
        });
        navigate('/login');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error?.message || "Failed to create account. Please try again.");
    }
  };
  
  const handleSuggestPassword = () => {
    const newPassword = generateSecurePassword();
    form.setValue("password", newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
    toast.success("Secure password suggested! Make sure to save it somewhere safe.");
  };

  const handleContinueClick = () => {
    const termsAccepted = form.getValues("termsAccepted");
    
    if (!termsAccepted) {
      form.setError("termsAccepted", { 
        message: "You must accept the Terms of Service" 
      });
      return;
    }
    
    form.clearErrors("termsAccepted");
    setActiveTab("account");
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-3xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center justify-center">
              <User className="mr-2" size={24} />
              Create your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to sign up for a ChowStack account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-start mb-4 text-sm border border-destructive">
                <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-destructive">{error}</span>
              </div>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="accountType">Account Type</TabsTrigger>
                <TabsTrigger value="account">Account Information</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="accountType" className="space-y-4">
                    <AccountTypeStep 
                      form={form} 
                      handleContinueClick={handleContinueClick} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="account" className="space-y-4">
                    <AccountInfoStep 
                      form={form}
                      passwordStrength={passwordStrength}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      handleSuggestPassword={handleSuggestPassword}
                      handleBackClick={() => setActiveTab("accountType")}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
            
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-mealstock-green hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Register;
