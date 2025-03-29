
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/uploads/ImageUpload';
import { DocumentUpload } from '@/components/uploads/DocumentUpload';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingVendorInfoProps {
  onNext: () => void;
  onBack: () => void;
  onDataSubmit: (data: VendorOnboardingData) => void;
  initialData?: Partial<VendorOnboardingData>;
  userId: string;
}

export interface VendorOnboardingData {
  businessName: string;
  businessAddress: string;
  businessDescription: string;
  logoUrl: string;
  coverImageUrl: string;
  businessDocUrl: string;
}

export const OnboardingVendorInfo: React.FC<OnboardingVendorInfoProps> = ({
  onNext,
  onBack,
  onDataSubmit,
  initialData,
  userId
}) => {
  const [formData, setFormData] = useState<VendorOnboardingData>({
    businessName: initialData?.businessName || '',
    businessAddress: initialData?.businessAddress || '',
    businessDescription: initialData?.businessDescription || '',
    logoUrl: initialData?.logoUrl || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    businessDocUrl: initialData?.businessDocUrl || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleLogoUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, logoUrl: url }));
    if (errors.logoUrl) {
      setErrors(prev => ({ ...prev, logoUrl: '' }));
    }
  };
  
  const handleCoverUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, coverImageUrl: url }));
    if (errors.coverImageUrl) {
      setErrors(prev => ({ ...prev, coverImageUrl: '' }));
    }
  };
  
  const handleDocUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, businessDocUrl: url }));
    if (errors.businessDocUrl) {
      setErrors(prev => ({ ...prev, businessDocUrl: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required';
    }
    
    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = 'Business description is required';
    }
    
    if (!formData.logoUrl) {
      newErrors.logoUrl = 'Business logo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      onDataSubmit(formData);
      onNext();
    } catch (error) {
      console.error('Error submitting vendor data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Business Information</CardTitle>
        <CardDescription>
          Tell us about your business so customers can find and recognize you
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your business name"
                className={errors.businessName ? 'border-destructive' : ''}
              />
              {errors.businessName && (
                <p className="text-sm text-destructive">{errors.businessName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Input
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Your business address"
                className={errors.businessAddress ? 'border-destructive' : ''}
              />
              {errors.businessAddress && (
                <p className="text-sm text-destructive">{errors.businessAddress}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description</Label>
            <Textarea
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              placeholder="Describe your business, cuisine specialties, and what makes you unique"
              className={`min-h-[120px] ${errors.businessDescription ? 'border-destructive' : ''}`}
            />
            {errors.businessDescription && (
              <p className="text-sm text-destructive">{errors.businessDescription}</p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label>Business Logo</Label>
              <ImageUpload
                onImageUploaded={handleLogoUploaded}
                initialImage={formData.logoUrl}
                bucketType="logo"
                shape="square"
                size="md"
                showLabel={false}
              />
              {errors.logoUrl && (
                <p className="text-sm text-destructive mt-1">{errors.logoUrl}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Upload a square logo that represents your business
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload
                onImageUploaded={handleCoverUploaded}
                initialImage={formData.coverImageUrl}
                bucketType="meal"
                shape="square"
                size="md"
                showLabel={false}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a banner image that showcases your food (optional)
              </p>
            </div>
          </div>
          
          <DocumentUpload
            onDocumentUploaded={handleDocUploaded}
            title="Business Verification"
            description="Upload a document to verify your business (business registration, food license, etc.)"
            className="mt-8"
            userId={userId}
            docType="verification"
          />
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Continue'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};
