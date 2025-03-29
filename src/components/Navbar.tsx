
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, ShoppingCart, Users } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onOpenAuth?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="container-custom mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="z-50">
            <Logo size="md" />
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/discovery" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
            >
              Discover
            </Link>
            <Link 
              to="/meal-planner" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
            >
              Meal Planner
            </Link>
            <Link 
              to="/community" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
            >
              Community
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link 
              to="/about" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
            >
              About
            </Link>
          </nav>
          
          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="rounded-full flex items-center" 
              onClick={onOpenAuth}
            >
              <User className="h-4 w-4 mr-2" />
              <span>Sign In</span>
            </Button>
            <Button 
              className="rounded-full bg-mealstock-orange hover:bg-mealstock-orange/90 flex items-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span>Cart</span>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-mealstock-brown" />
            ) : (
              <Menu className="h-6 w-6 text-mealstock-brown" />
            )}
          </button>
          
          {/* Mobile Menu */}
          <div 
            className={`fixed inset-0 bg-white flex flex-col p-8 transform transition-transform duration-300 ease-in-out z-40 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } md:hidden`}
          >
            <div className="h-12 mb-8">
              {/* Empty space for the logo and close button */}
            </div>
            
            <nav className="flex flex-col space-y-6 text-center">
              <Link 
                to="/" 
                className="text-xl text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/discovery" 
                className="text-xl text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Discover
              </Link>
              <Link 
                to="/meal-planner" 
                className="text-xl text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Meal Planner
              </Link>
              <Link 
                to="/community" 
                className="text-xl text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-xl text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/about" 
                className="text-xl text-mealstock-brown hover:text-mealstock-green transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
            
            <div className="mt-auto flex flex-col space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenAuth && onOpenAuth();
                }}
              >
                <User className="h-4 w-4 mr-2" />
                <span>Sign In</span>
              </Button>
              <Button 
                className="w-full bg-mealstock-orange hover:bg-mealstock-orange/90"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span>Cart</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
