
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-background border-b border-border py-2.5 sticky top-0 z-50">
      <div className="container-custom flex flex-wrap items-center justify-between mx-auto px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo size="md" withText={true} />
          </Link>
        </div>
        
        <div className="flex items-center md:order-2">
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
        
        <div className="hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
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
