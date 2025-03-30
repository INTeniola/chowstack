
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogIn, UserPlus, ShoppingCart, Package, User, Heart, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';

const MobileMenu: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle className="text-center">Menu</SheetTitle>
        </SheetHeader>
        
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={user.avatarUrl || ''} alt={user.name || 'User'} />
              <AvatarFallback className="bg-mealstock-green text-white">
                {user.name
                  ? user.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                  : 'U'
                }
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )}
        
        <nav className="flex flex-col gap-2">
          <Link 
            to="/" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
          >
            Home
          </Link>
          <Link 
            to="/discovery" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
          >
            Discovery
          </Link>
          <Link 
            to="/meal-planner" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
          >
            Meal Planner
          </Link>
          <Link 
            to="/contact" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
          >
            Contact
          </Link>
          
          <Separator className="my-2" />
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link 
                to="/orders" 
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
              >
                <Package className="mr-2 h-4 w-4" />
                Order History
              </Link>
              <Link 
                to="/checkout" 
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
              </Link>
              <Link 
                to="/favorites" 
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
              >
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted text-red-600 w-full text-left"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
              <Link 
                to="/register" 
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Link>
            </>
          )}
          
          <Separator className="my-2" />
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="w-full justify-start px-4 py-3"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-2">{theme === "dark" ? "Light" : "Dark"} Mode</span>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
