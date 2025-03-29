
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { Edit, PlusCircle, Trash2 } from 'lucide-react';

interface VendorInventoryProps {
  vendor: Vendor;
}

interface MealPackage {
  id: string;
  name: string;
  description: string;
  regularPrice: number;
  bulkPrice: number;
  minimumOrderQuantity: number;
  category: string;
  ingredients: string[];
  nutritionInfo: string;
  dietary: string[];
  image: string;
  status: 'active' | 'draft' | 'out-of-stock';
  stockLevel: number;
  createdAt: string;
}

// Mock data for meal packages
const mockMealPackages: MealPackage[] = [
  {
    id: 'mp1',
    name: 'Family Meal Bundle',
    description: 'A week of healthy meals for a family of four',
    regularPrice: 89.99,
    bulkPrice: 79.99,
    minimumOrderQuantity: 5,
    category: 'Family',
    ingredients: ['Organic vegetables', 'Free-range chicken', 'Brown rice', 'Quinoa'],
    nutritionInfo: 'Calories: 450-550 per serving',
    dietary: ['Gluten-Free Option'],
    image: 'https://placehold.co/300x200/9ee7b5/1e293b?text=Family+Bundle',
    status: 'active',
    stockLevel: 28,
    createdAt: '2023-06-15',
  },
  {
    id: 'mp2',
    name: 'Vegetarian Weekly Pack',
    description: 'Plant-based meals for a whole week',
    regularPrice: 75.99,
    bulkPrice: 67.99,
    minimumOrderQuantity: 3,
    category: 'Vegetarian',
    ingredients: ['Seasonal vegetables', 'Tofu', 'Legumes', 'Whole grains'],
    nutritionInfo: 'Calories: 380-450 per serving',
    dietary: ['Vegetarian', 'Vegan Option'],
    image: 'https://placehold.co/300x200/9ee7b5/1e293b?text=Vegetarian+Pack',
    status: 'active',
    stockLevel: 15,
    createdAt: '2023-08-22',
  },
  {
    id: 'mp3',
    name: 'Protein Power Pack',
    description: 'High-protein meals for active lifestyles',
    regularPrice: 95.99,
    bulkPrice: 85.99,
    minimumOrderQuantity: 4,
    category: 'Fitness',
    ingredients: ['Lean meats', 'Eggs', 'Greek yogurt', 'Nuts and seeds'],
    nutritionInfo: 'Calories: 500-600 per serving, Protein: 35-45g',
    dietary: ['High-Protein', 'Low-Carb'],
    image: 'https://placehold.co/300x200/9ee7b5/1e293b?text=Protein+Pack',
    status: 'active',
    stockLevel: 22,
    createdAt: '2023-09-05',
  },
  {
    id: 'mp4',
    name: 'Breakfast Essentials',
    description: 'Quick and nutritious breakfast options',
    regularPrice: 59.99,
    bulkPrice: 52.99,
    minimumOrderQuantity: 5,
    category: 'Breakfast',
    ingredients: ['Oats', 'Fruit', 'Yogurt', 'Granola'],
    nutritionInfo: 'Calories: 250-350 per serving',
    dietary: ['Vegetarian'],
    image: 'https://placehold.co/300x200/9ee7b5/1e293b?text=Breakfast',
    status: 'draft',
    stockLevel: 0,
    createdAt: '2023-10-12',
  },
];

const packageFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  regularPrice: z.coerce.number().positive({ message: 'Price must be positive' }),
  bulkPrice: z.coerce.number().positive({ message: 'Bulk price must be positive' }),
  minimumOrderQuantity: z.coerce.number().int().positive({ message: 'Quantity must be a positive integer' }),
  category: z.string().min(1, { message: 'Category is required' }),
  ingredients: z.string().min(3, { message: 'Ingredients are required' }),
  nutritionInfo: z.string().optional(),
  dietary: z.string().optional(),
  stockLevel: z.coerce.number().int({ message: 'Stock must be an integer' }),
  status: z.enum(['active', 'draft', 'out-of-stock'], {
    required_error: 'Status is required',
  }),
});

type MealPackageFormValues = z.infer<typeof packageFormSchema>;

const VendorInventory: React.FC<VendorInventoryProps> = ({ vendor }) => {
  const [packages, setPackages] = useState<MealPackage[]>(mockMealPackages);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<MealPackage | null>(null);
  
  const form = useForm<MealPackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: '',
      description: '',
      regularPrice: 0,
      bulkPrice: 0,
      minimumOrderQuantity: 1,
      category: '',
      ingredients: '',
      nutritionInfo: '',
      dietary: '',
      stockLevel: 0,
      status: 'draft',
    },
  });
  
  const openAddDialog = () => {
    form.reset({
      name: '',
      description: '',
      regularPrice: 0,
      bulkPrice: 0,
      minimumOrderQuantity: 1,
      category: '',
      ingredients: '',
      nutritionInfo: '',
      dietary: '',
      stockLevel: 0,
      status: 'draft',
    });
    setEditingPackage(null);
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (pkg: MealPackage) => {
    form.reset({
      name: pkg.name,
      description: pkg.description,
      regularPrice: pkg.regularPrice,
      bulkPrice: pkg.bulkPrice,
      minimumOrderQuantity: pkg.minimumOrderQuantity,
      category: pkg.category,
      ingredients: pkg.ingredients.join(', '),
      nutritionInfo: pkg.nutritionInfo,
      dietary: pkg.dietary.join(', '),
      stockLevel: pkg.stockLevel,
      status: pkg.status,
    });
    setEditingPackage(pkg);
    setIsAddDialogOpen(true);
  };
  
  const onSubmit = (data: MealPackageFormValues) => {
    if (editingPackage) {
      // Update existing package
      const updatedPackages = packages.map(pkg => 
        pkg.id === editingPackage.id 
          ? {
              ...pkg,
              name: data.name,
              description: data.description,
              regularPrice: data.regularPrice,
              bulkPrice: data.bulkPrice,
              minimumOrderQuantity: data.minimumOrderQuantity,
              category: data.category,
              ingredients: data.ingredients.split(',').map(item => item.trim()),
              nutritionInfo: data.nutritionInfo || '',
              dietary: data.dietary ? data.dietary.split(',').map(item => item.trim()) : [],
              stockLevel: data.stockLevel,
              status: data.status,
            }
          : pkg
      );
      setPackages(updatedPackages);
      toast({
        title: "Package updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Add new package
      const newPackage: MealPackage = {
        id: `mp${Date.now()}`,
        name: data.name,
        description: data.description,
        regularPrice: data.regularPrice,
        bulkPrice: data.bulkPrice,
        minimumOrderQuantity: data.minimumOrderQuantity,
        category: data.category,
        ingredients: data.ingredients.split(',').map(item => item.trim()),
        nutritionInfo: data.nutritionInfo || '',
        dietary: data.dietary ? data.dietary.split(',').map(item => item.trim()) : [],
        image: `https://placehold.co/300x200/9ee7b5/1e293b?text=${encodeURIComponent(data.name)}`,
        status: data.status,
        stockLevel: data.stockLevel,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPackages([...packages, newPackage]);
      toast({
        title: "Package created",
        description: `${data.name} has been added to your inventory.`,
      });
    }
    setIsAddDialogOpen(false);
  };
  
  const deletePackage = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      const filteredPackages = packages.filter(pkg => pkg.id !== id);
      setPackages(filteredPackages);
      toast({
        title: "Package deleted",
        description: "The meal package has been removed from your inventory.",
      });
    }
  };
  
  const getStatusBadge = (status: MealPackage['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Draft</Badge>;
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-mealstock-brown">Meal Packages</h2>
          <p className="text-muted-foreground">Manage your meal packages and inventory</p>
        </div>
        <Button 
          onClick={openAddDialog}
          className="bg-mealstock-green hover:bg-mealstock-green/90"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> 
          Add Package
        </Button>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-base font-medium">All Packages ({packages.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Regular Price</TableHead>
                  <TableHead>Bulk Price</TableHead>
                  <TableHead>Min. Quantity</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{pkg.category}</TableCell>
                    <TableCell>${pkg.regularPrice.toFixed(2)}</TableCell>
                    <TableCell>${pkg.bulkPrice.toFixed(2)}</TableCell>
                    <TableCell>{pkg.minimumOrderQuantity}</TableCell>
                    <TableCell>{pkg.stockLevel}</TableCell>
                    <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(pkg)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => deletePackage(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? 'Edit Meal Package' : 'Add New Meal Package'}</DialogTitle>
            <DialogDescription>
              {editingPackage 
                ? 'Update the information for this meal package' 
                : 'Fill in the details to create a new meal package'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Package name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Family, Vegetarian, Fitness" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your meal package" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="regularPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bulkPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bulk Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minimumOrderQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min. Order Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients</FormLabel>
                      <FormControl>
                        <Input placeholder="Comma-separated list" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dietary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Options</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Vegan, Gluten-Free" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="nutritionInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nutrition Information</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Calories, protein content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Level</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          {...field}
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="out-of-stock">Out of Stock</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPackage ? 'Update Package' : 'Add Package'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventory;
