
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/uploads/ImageUpload';
import { Separator } from '@/components/ui/separator';

export function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatarUrl || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const success = await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        avatarUrl: formData.avatar
      });
      
      if (!success) {
        throw new Error("Failed to update profile");
      }
      
      toast.success("Profile updated", {
        description: "Your profile information has been saved."
      });
    } catch (error) {
      toast.error("Update failed", {
        description: (error as Error).message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }));
  };
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Please sign in to view your profile settings.</p>
        <Button className="mt-4" onClick={() => window.location.href = '/login'}>
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <ImageUpload
          onImageUploaded={handleImageUploaded}
          initialImage={formData.avatar}
          bucketType="avatar"
          shape="circle"
          size="lg"
          showLabel={true}
          label="Profile Photo"
        />
        
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold mb-1">{user.name || 'User'}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-sm mt-2">Member since: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <Separator />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  disabled 
                  placeholder="Your email address"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Your delivery address"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
