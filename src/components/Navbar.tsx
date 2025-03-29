
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVendorAuth } from '@/hooks/useVendorAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import Logo from './Logo';
import NotificationBell from './notifications/NotificationBell';
import { DataSaverDialog } from './ui/data-saver-dialog';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { vendor, logout } = useVendorAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();
  
  const handleSignOut = async () => {
    if (user) {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/login');
    } else if (vendor) {
      await logout();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/vendor/login');
    }
  };

  return (
    <nav className="bg-background border-b border-border py-2.5">
      <div className="container-custom flex flex-wrap items-center justify-between mx-auto">
        <Link to="/" className="flex items-center">
          <Logo size="md" withText={true} />
        </Link>
        
        <div className="flex items-center md:order-2">
          <div className="flex items-center gap-2">
            {/* Add the Data Saver Dialog */}
            <DataSaverDialog />
            
            <NotificationBell />
            
            {user || vendor ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt="user-avatar"/>
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {user && <span className="text-sm font-medium leading-none">{user.email}</span>}
                      {vendor && <span className="text-sm font-medium leading-none">{vendor.email}</span>}
                      <span className="text-xs leading-none text-muted-foreground">
                        {user ? 'Customer' : 'Vendor'}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(user ? '/profile' : '/vendor/profile')}>
                    Profile
                  </DropdownMenuItem>
                  {vendor && (
                    <DropdownMenuItem onClick={() => navigate('/vendor/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate(user ? '/orders' : '/vendor/orders')}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="mr-2">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button>
                    Register
                  </Button>
                </Link>
              </>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
        
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:font-medium md:border-0 bg-background">
            <li>
              <Link to="/" className="block py-2 pl-3 pr-4 text-foreground rounded hover:text-mealstock-green md:p-0" aria-current="page">Home</Link>
            </li>
            <li>
              <Link to="/discovery" className="block py-2 pl-3 pr-4 text-foreground rounded hover:text-mealstock-green md:p-0">Discovery</Link>
            </li>
            <li>
              <Link to="/meal-planner" className="block py-2 pl-3 pr-4 text-foreground rounded hover:text-mealstock-green md:p-0">Meal Planner</Link>
            </li>
            <li>
              <Link to="/contact" className="block py-2 pl-3 pr-4 text-foreground rounded hover:text-mealstock-green md:p-0">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
