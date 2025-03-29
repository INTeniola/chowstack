
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, UseFormWatch } from "react-hook-form";
import { RegisterFormValues } from '@/types/auth';

interface AccountInfoStepProps {
  form: UseFormReturn<RegisterFormValues>;
  passwordStrength: number;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleSuggestPassword: () => void;
  handleBackClick: () => void;
  isLoading: boolean;
}

const AccountInfoStep: React.FC<AccountInfoStepProps> = ({
  form,
  passwordStrength,
  showPassword,
  setShowPassword,
  handleSuggestPassword,
  handleBackClick,
  isLoading
}) => {
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
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
      
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleBackClick}
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
    </div>
  );
};

export default AccountInfoStep;
