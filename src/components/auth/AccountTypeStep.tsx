
import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from '@/types/auth';

interface AccountTypeStepProps {
  form: UseFormReturn<RegisterFormValues>;
  handleContinueClick: () => void;
}

const AccountTypeStep: React.FC<AccountTypeStepProps> = ({ 
  form, 
  handleContinueClick 
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AccountTypeStep;
