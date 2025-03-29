
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from '@/hooks/use-toast';

export interface VendorPreferences {
  notificationSettings?: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
  defaultOrderSettings?: {
    autoAccept: boolean;
    preparationTimeMinutes: number;
  };
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  businessDescription: string;
  logo: string;
  coverImage: string;
  cuisineTypes: string[];
  joinDate: string;
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
  preferences?: VendorPreferences;
}

// Mock vendor data for demonstration
const mockVendor: Vendor = {
  id: 'v1',
  name: 'Jane Smith',
  email: 'jane@greenfeast.com',
  phone: '555-123-4567',
  businessName: 'Green Feast Catering',
  businessAddress: '123 Main St, Anytown, USA',
  businessDescription: 'Organic farm-to-table meals prepared with love and care',
  logo: 'https://placehold.co/200x200/9ee7b5/1e293b?text=GF',
  coverImage: 'https://placehold.co/1200x400/9ee7b5/1e293b?text=Green+Feast',
  cuisineTypes: ['Organic', 'Vegan', 'Gluten-Free'],
  joinDate: '2022-04-15',
  averageRating: 4.8,
  totalReviews: 156,
  isVerified: true,
  preferences: {
    notificationSettings: {
      email: true,
      sms: true,
      app: true
    },
    defaultOrderSettings: {
      autoAccept: false,
      preparationTimeMinutes: 45
    }
  }
};

interface VendorAuthState {
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateVendorProfile: (updates: Partial<Vendor>) => Promise<boolean>;
  updateVendorPreferences: (updates: Partial<VendorPreferences>) => Promise<boolean>;
}

const VendorAuthContext = createContext<VendorAuthState | null>(null);

export const VendorAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved vendor session
    const savedVendor = localStorage.getItem('vendor');
    if (savedVendor) {
      setVendor(JSON.parse(savedVendor));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would be an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any email with 'vendor' 
      // and any password with length >= 6
      if (email.includes('vendor') && password.length >= 6) {
        setVendor(mockVendor);
        setIsAuthenticated(true);
        localStorage.setItem('vendor', JSON.stringify(mockVendor));
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockVendor.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try using an email with 'vendor' and a password with 6+ characters.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setVendor(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vendor');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateVendorProfile = async (updates: Partial<Vendor>) => {
    try {
      // This would be an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (vendor) {
        const updatedVendor = { ...vendor, ...updates };
        setVendor(updatedVendor);
        localStorage.setItem('vendor', JSON.stringify(updatedVendor));
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateVendorPreferences = async (updates: Partial<VendorPreferences>) => {
    try {
      // This would be an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (vendor) {
        const updatedPreferences = { ...vendor.preferences, ...updates };
        const updatedVendor = { ...vendor, preferences: updatedPreferences };
        setVendor(updatedVendor);
        localStorage.setItem('vendor', JSON.stringify(updatedVendor));
        toast({
          title: "Preferences updated",
          description: "Your preferences have been updated successfully.",
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update preferences. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const authContextValue = {
    vendor,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateVendorProfile,
    updateVendorPreferences,
  };

  return (
    <VendorAuthContext.Provider value={authContextValue}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
};
