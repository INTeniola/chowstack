
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileMenu: React.FC = () => {
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
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
