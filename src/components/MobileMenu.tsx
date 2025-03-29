
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileMenu: React.FC = () => {
  const { setTheme, theme } = useTheme();
  
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
          
          <div className="border-t my-2"></div>
          
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
