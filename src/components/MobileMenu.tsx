
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const MobileMenu: React.FC = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-center">Menu</DrawerTitle>
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>
        <div className="py-4">
          <nav className="grid gap-2 px-4">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
