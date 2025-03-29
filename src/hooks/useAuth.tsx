
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from '@/hooks/use-toast';

export interface UserPreferences {
  notificationSettings?: {
    email: boolean;
    sms: boolean;
    app: boolean;
    voice: boolean;
  };
  deliveryPreferences?: {
    timeSlot: string;
    instructions: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: string;
  preferences?: UserPreferences;
}

// Mock user data for demonstration
const mockUser: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-987-6543',
  address: '456 Oak St, Anytown, USA',
  joinDate: '2023-01-10',
  preferences: {
    notificationSettings: {
      email: true,
      sms: true,
      app: true,
      voice: false
    },
    deliveryPreferences: {
      timeSlot: 'evening',
      instructions: 'Leave at the door'
    }
  }
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  updateUserPreferences: (updates: Partial<UserPreferences>) => Promise<boolean>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would be an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any email and password with length >= 6
      if (email.length > 0 && password.length >= 6) {
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try using an email and a password with 6+ characters.",
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

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    try {
      // This would be an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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

  const updateUserPreferences = async (updates: Partial<UserPreferences>) => {
    try {
      // This would be an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (user) {
        const updatedPreferences = { ...user.preferences, ...updates };
        const updatedUser = { ...user, preferences: updatedPreferences };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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
    user,
    isAuthenticated,
    isLoading,
    login,
    signOut,
    updateUserProfile,
    updateUserPreferences,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
