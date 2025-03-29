
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onOpenAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-mealstock-brown hover:text-mealstock-green transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-mealstock-brown hover:text-mealstock-green transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-mealstock-brown hover:text-mealstock-green transition-colors">
              Pricing
            </a>
            <Button 
              onClick={onOpenAuth}
              className="bg-mealstock-green hover:bg-mealstock-green/90 text-white"
            >
              Sign In
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-mealstock-brown"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-4">
            <a 
              href="#how-it-works" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#features" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-mealstock-brown hover:text-mealstock-green transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <Button 
              onClick={() => {
                setIsMenuOpen(false);
                onOpenAuth();
              }}
              className="bg-mealstock-green hover:bg-mealstock-green/90 text-white w-full"
            >
              Sign In
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
