
import React from 'react';
import Logo from './Logo';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone 
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-mealstock-brown text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo withText={false} />
            <h3 className="text-xl font-bold mt-2 text-white">MealStock</h3>
            <p className="mt-2 text-white/80">
              Bulk meal delivery for busy Nigerians. Plan, order, and enjoy.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white/80 hover:text-mealstock-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-mealstock-orange transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-mealstock-orange transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Our Chefs</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Press</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-mealstock-orange" />
                <span className="text-white/80">Lagos, Nigeria</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={18} className="mt-1 flex-shrink-0 text-mealstock-orange" />
                <span className="text-white/80">+234 123 456 7890</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={18} className="mt-1 flex-shrink-0 text-mealstock-orange" />
                <span className="text-white/80">info@mealstock.ng</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} MealStock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
