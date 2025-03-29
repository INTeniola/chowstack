
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
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import Logo from './Logo';
import NotificationBell from './notifications/NotificationBell';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { vendor, logout } = useVendorAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const currentTheme = useTheme().theme;
  
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
    <nav className="bg-white border-b border-gray-200 py-2.5 dark:bg-gray-900 dark:border-gray-700">
      <div className="container-custom flex flex-wrap items-center justify-between mx-auto">
        <Link to="/" className="flex items-center">
          <Logo size="md" withText={true} />
        </Link>
        
        <div className="flex items-center md:order-2">
          <div className="flex items-center gap-4">
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
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            >
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
        
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:font-medium md:border-0 md:bg-white dark:bg-gray-800 dark:border-gray-700 md:dark:bg-gray-900">
            <li>
              <Link to="/" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-mealstock-green md:p-0 dark:text-gray-200 dark:hover:text-white" aria-current="page">Home</Link>
            </li>
            <li>
              <Link to="/discovery" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-mealstock-green md:p-0 dark:text-gray-200 dark:hover:text-white">Discovery</Link>
            </li>
            
            <li className="relative group">
              <button className="flex items-center py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-mealstock-green md:p-0 dark:text-gray-200 dark:hover:text-white">
                About 
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block dark:bg-gray-800">
                <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">About Us</Link>
                <Link to="/our-chefs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Our Chefs</Link>
                <Link to="/careers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Careers</Link>
                <Link to="/press" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Press</Link>
              </div>
            </li>
            
            <li>
              <Link to="/contact" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-mealstock-green md:p-0 dark:text-gray-200 dark:hover:text-white">Contact</Link>
            </li>
            
            <li className="relative group">
              <button className="flex items-center py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-mealstock-green md:p-0 dark:text-gray-200 dark:hover:text-white">
                Resources
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block dark:bg-gray-800">
                <Link to="/help-center" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Help Center</Link>
                <Link to="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Blog</Link>
                <Link to="/faqs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">FAQs</Link>
                <Link to="/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Privacy Policy</Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
