import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { generateSecurePassword, checkPasswordStrength } from '@/utils/passwordUtils';
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpData } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accountType: z.enum(["customer", "vendor"]),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the Terms of Service"
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

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

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
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
                    <FormField
                      control={form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Account Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-3"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <RadioGroupItem value="customer" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  <div className="font-medium">Customer</div>
                                  <div className="text-sm text-muted-foreground">
                                    I want to order meals and food packages
                                  </div>
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <RadioGroupItem value="vendor" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  <div className="font-medium">Vendor</div>
                                  <div className="text-sm text-muted-foreground">
                                    I want to sell meals and food packages
                                  </div>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              I agree to the{" "}
                              <Link to="/terms" className="text-mealstock-green underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link to="/privacy-policy" className="text-mealstock-green underline">
                                Privacy Policy
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="button"
                      onClick={handleContinueClick}
                      className="w-full"
                    >
                      Continue
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="account" className="space-y-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input 
                                  placeholder="John Doe" 
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input 
                                  placeholder="name@example.com" 
                                  type="email" 
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input 
                                  placeholder="+123 456 7890" 
                                  type="tel" 
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
                            <FormLabel className="flex justify-between items-center">
                              <span>Password</span>
                              <Button 
                                type="button" 
                                variant="link" 
                                size="sm"
                                className="h-auto p-0 text-mealstock-green text-xs"
                                onClick={handleSuggestPassword}
                              >
                                Suggest secure password
                              </Button>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  placeholder="••••••••"
                                  type={showPassword ? "text" : "password"}
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
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("accountType")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                      </Button>
                    </div>
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
