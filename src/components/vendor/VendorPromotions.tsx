
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Vendor } from '@/hooks/useVendorAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PlusCircle,
  Edit,
  Trash2,
  Tag,
  Percent,
  Users,
  Calendar as CalendarIcon,
  Package
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';

interface VendorPromotionsProps {
  vendor: Vendor;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'bogo' | 'bundle' | 'special';
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minOrderValue?: number;
  minOrderQuantity?: number;
  applicableProducts?: string[];
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

// Mock promotions data
const mockPromotions: Promotion[] = [
  {
    id: 'promo1',
    title: 'Summer Family Pack Special',
    description: 'Get 15% off when ordering 3+ Family Meal Bundles',
    type: 'discount',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 0,
    minOrderQuantity: 3,
    applicableProducts: ['Family Meal Bundle'],
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31'),
    usageLimit: 0,
    usageCount: 45,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
  },
  {
    id: 'promo2',
    title: 'Vegetarian Bundle Deal',
    description: 'Purchase 2 Vegetarian Weekly Packs and get $20 off',
    type: 'discount',
    discountType: 'fixed',
    discountValue: 20,
    minOrderValue: 0,
    minOrderQuantity: 2,
    applicableProducts: ['Vegetarian Weekly Pack'],
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-10-31'),
    usageLimit: 100,
    usageCount: 37,
    isActive: true,
    createdAt: '2023-06-20T14:15:00Z',
  },
  {
    id: 'promo3',
    title: 'Fall Seasonal Special',
    description: 'Limited time fall-themed meal bundles with seasonal ingredients',
    type: 'special',
    startDate: new Date('2023-09-15'),
    endDate: new Date('2023-11-30'),
    usageLimit: 0,
    usageCount: 12,
    isActive: true,
    createdAt: '2023-08-30T09:45:00Z',
  },
  {
    id: 'promo4',
    title: 'Protein Power Pack Bundle',
    description: 'Buy 2 Protein Power Packs, get 1 Breakfast Essentials free',
    type: 'bundle',
    minOrderQuantity: 2,
    applicableProducts: ['Protein Power Pack', 'Breakfast Essentials'],
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-10-15'),
    usageLimit: 50,
    usageCount: 28,
    isActive: true,
    createdAt: '2023-07-25T11:20:00Z',
  },
  {
    id: 'promo5',
    title: 'Summer Flash Sale',
    description: '20% off all meal packages for 48 hours only',
    type: 'discount',
    discountType: 'percentage',
    discountValue: 20,
    startDate: new Date('2023-07-15'),
    endDate: new Date('2023-07-17'),
    usageLimit: 0,
    usageCount: 76,
    isActive: false,
    createdAt: '2023-07-10T08:30:00Z',
  },
];

const promotionFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  type: z.enum(['discount', 'bogo', 'bundle', 'special'], {
    required_error: 'Please select a promotion type',
  }),
  discountType: z.enum(['percentage', 'fixed']).optional(),
  discountValue: z.coerce.number().min(0).optional(),
  minOrderValue: z.coerce.number().min(0).optional(),
  minOrderQuantity: z.coerce.number().int().min(0).optional(),
  applicableProducts: z.string().optional(),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  usageLimit: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
});

type PromotionFormValues = z.infer<typeof promotionFormSchema>;

const VendorPromotions: React.FC<VendorPromotionsProps> = ({ vendor }) => {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'discount',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      minOrderQuantity: 0,
      applicableProducts: '',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      usageLimit: 0,
      isActive: true,
    },
  });
  
  const watchPromoType = form.watch('type');
  
  const openAddDialog = () => {
    form.reset({
      title: '',
      description: '',
      type: 'discount',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      minOrderQuantity: 0,
      applicableProducts: '',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      usageLimit: 0,
      isActive: true,
    });
    setEditingPromotion(null);
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (promo: Promotion) => {
    form.reset({
      title: promo.title,
      description: promo.description,
      type: promo.type,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minOrderValue: promo.minOrderValue,
      minOrderQuantity: promo.minOrderQuantity,
      applicableProducts: promo.applicableProducts?.join(', '),
      startDate: promo.startDate,
      endDate: promo.endDate,
      usageLimit: promo.usageLimit,
      isActive: promo.isActive,
    });
    setEditingPromotion(promo);
    setIsDialogOpen(true);
  };
  
  const onSubmit = (data: PromotionFormValues) => {
    if (editingPromotion) {
      // Update existing promotion
      const updatedPromotions = promotions.map(promo => 
        promo.id === editingPromotion.id 
          ? {
              ...promo,
              title: data.title,
              description: data.description,
              type: data.type,
              discountType: data.discountType,
              discountValue: data.discountValue,
              minOrderValue: data.minOrderValue,
              minOrderQuantity: data.minOrderQuantity,
              applicableProducts: data.applicableProducts ? data.applicableProducts.split(',').map(p => p.trim()) : undefined,
              startDate: data.startDate,
              endDate: data.endDate,
              usageLimit: data.usageLimit,
              isActive: data.isActive,
            }
          : promo
      );
      setPromotions(updatedPromotions);
      toast({
        title: "Promotion updated",
        description: `${data.title} has been updated successfully.`,
      });
    } else {
      // Create new promotion
      const newPromotion: Promotion = {
        id: `promo${Date.now()}`,
        title: data.title,
        description: data.description,
        type: data.type,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue,
        minOrderQuantity: data.minOrderQuantity,
        applicableProducts: data.applicableProducts ? data.applicableProducts.split(',').map(p => p.trim()) : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        usageLimit: data.usageLimit,
        usageCount: 0,
        isActive: data.isActive,
        createdAt: new Date().toISOString(),
      };
      setPromotions([...promotions, newPromotion]);
      toast({
        title: "Promotion created",
        description: `${data.title} has been created successfully.`,
      });
    }
    setIsDialogOpen(false);
  };
  
  const deletePromotion = (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      const filteredPromotions = promotions.filter(promo => promo.id !== id);
      setPromotions(filteredPromotions);
      toast({
        title: "Promotion deleted",
        description: "The promotion has been removed.",
      });
    }
  };
  
  const togglePromotionStatus = (id: string) => {
    const updatedPromotions = promotions.map(promo => 
      promo.id === id 
        ? { ...promo, isActive: !promo.isActive }
        : promo
    );
    setPromotions(updatedPromotions);
    
    const promo = updatedPromotions.find(p => p.id === id);
    toast({
      title: promo?.isActive ? "Promotion activated" : "Promotion deactivated",
      description: `${promo?.title} is now ${promo?.isActive ? 'active' : 'inactive'}.`,
    });
  };
  
  // Get the promo type icon
  const getPromoTypeIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'discount':
        return <Percent className="h-5 w-5 text-green-500" />;
      case 'bogo':
        return <Tag className="h-5 w-5 text-blue-500" />;
      case 'bundle':
        return <Package className="h-5 w-5 text-amber-500" />;
      case 'special':
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };
  
  // Format promotion date range for display
  const formatDateRange = (startDate: Date, endDate: Date) => {
    return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
  };
  
  // Check if a promotion is active and current (between start and end dates)
  const isPromotionCurrent = (promo: Promotion) => {
    const now = new Date();
    return promo.isActive && promo.startDate <= now && promo.endDate >= now;
  };
  
  // Calculate remaining days for a promotion
  const getRemainingDays = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Get a description of the promotion for display
  const getPromotionDescription = (promo: Promotion) => {
    switch (promo.type) {
      case 'discount':
        if (promo.discountType === 'percentage') {
          return `${promo.discountValue}% off`;
        } else {
          return `$${promo.discountValue} off`;
        }
      case 'bogo':
        return 'Buy One Get One';
      case 'bundle':
        return 'Bundle Deal';
      case 'special':
        return 'Special Offer';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-mealstock-brown">Promotions</h2>
          <p className="text-muted-foreground">Manage special offers and promotional campaigns</p>
        </div>
        <Button 
          onClick={openAddDialog}
          className="bg-mealstock-green hover:bg-mealstock-green/90"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> 
          Create Promotion
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id} className={`overflow-hidden ${!promo.isActive && 'opacity-70'}`}>
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                {isPromotionCurrent(promo) ? (
                  <Badge className="bg-green-500">Active</Badge>
                ) : !promo.isActive ? (
                  <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Inactive</Badge>
                ) : new Date() < promo.startDate ? (
                  <Badge variant="outline" className="border-blue-500 text-blue-500">Upcoming</Badge>
                ) : (
                  <Badge variant="outline" className="border-red-500 text-red-500">Expired</Badge>
                )}
              </div>
              
              <div className="p-6 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  {getPromoTypeIcon(promo.type)}
                  <div className="text-sm font-medium">
                    {promo.type.charAt(0).toUpperCase() + promo.type.slice(1)}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{promo.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{promo.description}</p>
              </div>
            </div>
            
            <CardContent className="p-6 pt-2 space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDateRange(promo.startDate, promo.endDate)}</span>
                </div>
                
                {isPromotionCurrent(promo) && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">
                      {getRemainingDays(promo.endDate)} days remaining
                    </span>
                  </div>
                )}
                
                {(promo.minOrderQuantity || 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Min. quantity: {promo.minOrderQuantity}</span>
                  </div>
                )}
                
                {(promo.minOrderValue || 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>Min. order: ${promo.minOrderValue}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Used {promo.usageCount} times</span>
                </div>
                
                <div className="pt-2">
                  <Badge variant="secondary" className="rounded-md font-normal">
                    {getPromotionDescription(promo)}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePromotionStatus(promo.id)}
                >
                  {promo.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(promo)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => deletePromotion(promo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
            <DialogDescription>
              {editingPromotion 
                ? 'Update the promotion details below' 
                : 'Fill in the details to create a new promotion'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Special Offer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your promotion"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Type</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value="discount">Discount</option>
                        <option value="bogo">Buy One Get One</option>
                        <option value="bundle">Bundle Deal</option>
                        <option value="special">Special Offer</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {watchPromoType === 'discount' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ($)</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                              (form.getValues('startDate') && date < form.getValues('startDate'))
                            }
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minOrderValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Value ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minOrderQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="applicableProducts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applicable Products</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter comma-separated product names or leave blank for all products" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit (0 for unlimited)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Make this promotion available to customers
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorPromotions;
