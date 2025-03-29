
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Building, Utensils, Apple, Fish, Carrot, Beef, Milk, Wheat, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from '@/utils/authUtils';

// Schema for Customer Onboarding
const customerSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  dietaryPreferences: z.object({
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    pescatarian: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    dairyFree: z.boolean().optional(),
    lowCarb: z.boolean().optional(),
    other: z.string().optional(),
  }),
});

// Schema for Vendor Onboarding
const vendorSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessAddress: z.string().min(5, "Business address must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cuisineTypes: z.array(z.string()).min(1, "Select at least one cuisine type"),
  servicesOffered: z.array(z.string()).min(1, "Select at least one service"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;
type VendorFormValues = z.infer<typeof vendorSchema>;

interface OnboardingFlowProps {
  user: User;
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [isVendorLoading, setIsVendorLoading] = useState(false);
  
  // Customer form
  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      address: user.address || '',
      dietaryPreferences: {
        vegetarian: false,
        vegan: false,
        pescatarian: false,
        glutenFree: false,
        dairyFree: false,
        lowCarb: false,
        other: '',
      },
    },
  });
  
  // Vendor form
  const vendorForm = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: user.businessInfo?.businessName || '',
      businessAddress: user.businessInfo?.businessAddress || '',
      description: user.businessInfo?.description || '',
      cuisineTypes: [],
      servicesOffered: [],
    },
  });

  const onCustomerSubmit = async (values: CustomerFormValues) => {
    setIsCustomerLoading(true);
    try {
      const success = await completeOnboarding({
        address: values.address,
        dietaryPreferences: values.dietaryPreferences,
      });
      
      if (success) {
        toast.success("Profile complete!", {
          description: "Your preferences have been saved successfully."
        });
        navigate('/');
      }
    } catch (error: any) {
      toast.error("Failed to save preferences", {
        description: error.message || "Please try again."
      });
    } finally {
      setIsCustomerLoading(false);
    }
  };

  const onVendorSubmit = async (values: VendorFormValues) => {
    setIsVendorLoading(true);
    try {
      const success = await completeOnboarding({
        businessName: values.businessName,
        businessAddress: values.businessAddress,
        description: values.description,
        cuisineTypes: values.cuisineTypes,
        servicesOffered: values.servicesOffered,
      });
      
      if (success) {
        toast.success("Business profile complete!", {
          description: "Your business information has been saved."
        });
        navigate('/vendor');
      }
    } catch (error: any) {
      toast.error("Failed to save business information", {
        description: error.message || "Please try again."
      });
    } finally {
      setIsVendorLoading(false);
    }
  };

  const cuisineTypes = [
    { id: "italian", label: "Italian" },
    { id: "mexican", label: "Mexican" },
    { id: "chinese", label: "Chinese" },
    { id: "indian", label: "Indian" },
    { id: "japanese", label: "Japanese" },
    { id: "thai", label: "Thai" },
    { id: "american", label: "American" },
    { id: "mediterranean", label: "Mediterranean" },
    { id: "african", label: "African" },
  ];

  const servicesOffered = [
    { id: "meal_prep", label: "Meal Preparation" },
    { id: "bulk_orders", label: "Bulk Orders" },
    { id: "catering", label: "Catering" },
    { id: "specialty_diets", label: "Specialty Diets" },
    { id: "cooking_classes", label: "Cooking Classes" },
  ];

  return (
    <div className="container-custom py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-mealstock-brown">Complete Your Profile</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Just a few more details to get you started with MealStock
        </p>
      </div>
      
      {user.role === 'customer' ? (
        <Card>
          <CardHeader>
            <CardTitle>Customer Preferences</CardTitle>
            <CardDescription>
              Let us know your dietary preferences and delivery details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...customerForm}>
              <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-6">
                <FormField
                  control={customerForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your full delivery address" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This is where your meals will be delivered
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Dietary Preferences</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <FormField
                      control={customerForm.control}
                      name="dietaryPreferences.vegetarian"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-muted/20 p-3 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center cursor-pointer">
                              <Carrot className="h-4 w-4 mr-1" />
                              Vegetarian
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={customerForm.control}
                      name="dietaryPreferences.vegan"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-muted/20 p-3 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center cursor-pointer">
                              <Apple className="h-4 w-4 mr-1" />
                              Vegan
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={customerForm.control}
                      name="dietaryPreferences.pescatarian"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-muted/20 p-3 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center cursor-pointer">
                              <Fish className="h-4 w-4 mr-1" />
                              Pescatarian
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={customerForm.control}
                      name="dietaryPreferences.glutenFree"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-muted/20 p-3 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center cursor-pointer">
                              <Wheat className="h-4 w-4 mr-1" />
                              Gluten Free
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={customerForm.control}
                      name="dietaryPreferences.dairyFree"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-muted/20 p-3 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center cursor-pointer">
                              <Milk className="h-4 w-4 mr-1" />
                              Dairy Free
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={customerForm.control}
                      name="dietaryPreferences.lowCarb"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-muted/20 p-3 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center cursor-pointer">
                              <Beef className="h-4 w-4 mr-1" />
                              Low Carb
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={customerForm.control}
                    name="dietaryPreferences.other"
                    render={({ field }) => (
                      <FormItem className="mt-3">
                        <FormLabel>Other Dietary Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any allergies or other dietary requirements" 
                            className="min-h-[60px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isCustomerLoading}
                >
                  {isCustomerLoading ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Complete Setup
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>
              Set up your vendor profile to start selling on MealStock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...vendorForm}>
              <form onSubmit={vendorForm.handleSubmit(onVendorSubmit)} className="space-y-6">
                <FormField
                  control={vendorForm.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            placeholder="Your restaurant or business name" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={vendorForm.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your business address" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={vendorForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell customers about your business, cuisine, and specialties" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed on your vendor profile
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={vendorForm.control}
                  name="cuisineTypes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Cuisine Types</FormLabel>
                        <FormDescription>
                          Select the cuisines you specialize in
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {cuisineTypes.map((item) => (
                          <FormField
                            key={item.id}
                            control={vendorForm.control}
                            name="cuisineTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 bg-muted/20 p-3 rounded-md"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={vendorForm.control}
                  name="servicesOffered"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Services Offered</FormLabel>
                        <FormDescription>
                          Select the services you provide
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {servicesOffered.map((item) => (
                          <FormField
                            key={item.id}
                            control={vendorForm.control}
                            name="servicesOffered"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 bg-muted/20 p-3 rounded-md"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isVendorLoading}
                >
                  {isVendorLoading ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Complete Vendor Setup
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
