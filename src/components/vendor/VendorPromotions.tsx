
import React, { useState } from 'react';
import { Vendor } from '@/hooks/useVendorAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { Promotion, PromotionFormValues } from './types/promotionTypes';
import PromotionCard from './PromotionCard';
import PromotionForm from './PromotionForm';
import { mockPromotions } from './data/mockPromotions';

interface VendorPromotionsProps {
  vendor: Vendor;
}

const VendorPromotions: React.FC<VendorPromotionsProps> = ({ vendor }) => {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  
  const openAddDialog = () => {
    setEditingPromotion(null);
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (promo: Promotion) => {
    setEditingPromotion(promo);
    setIsDialogOpen(true);
  };
  
  const getInitialFormValues = (): PromotionFormValues => {
    if (editingPromotion) {
      return {
        title: editingPromotion.title,
        description: editingPromotion.description,
        type: editingPromotion.type,
        discountType: editingPromotion.discountType,
        discountValue: editingPromotion.discountValue,
        minOrderValue: editingPromotion.minOrderValue,
        minOrderQuantity: editingPromotion.minOrderQuantity,
        applicableProducts: editingPromotion.applicableProducts?.join(', '),
        startDate: editingPromotion.startDate,
        endDate: editingPromotion.endDate,
        usageLimit: editingPromotion.usageLimit,
        isActive: editingPromotion.isActive,
      };
    } else {
      return {
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
      };
    }
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
          <PromotionCard
            key={promo.id}
            promotion={promo}
            onEdit={openEditDialog}
            onDelete={deletePromotion}
            onToggleStatus={togglePromotionStatus}
          />
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
          
          <PromotionForm
            initialValues={getInitialFormValues()}
            onSubmit={onSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isEditing={!!editingPromotion}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorPromotions;
