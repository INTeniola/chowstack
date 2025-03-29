
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Discovery from "./pages/Discovery";
import MealPlanner from "./pages/MealPlanner";
import CommunityHub from "./pages/CommunityHub";
import VendorPortal from "./pages/VendorPortal";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import { OfflineIndicator } from "./components/ui/offline-indicator";
import { useConnectivity } from "./contexts/ConnectivityContext";

// New pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OurChefs from "./pages/OurChefs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import HelpCenter from "./pages/HelpCenter";
import Blog from "./pages/Blog";
import FAQs from "./pages/FAQs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Settings from "./pages/Settings";

const App = () => {
  const { isOnline, lowBandwidthMode } = useConnectivity();
  
  return (
    <>
      <TooltipProvider>
        <Sonner />
        <div className={lowBandwidthMode ? "low-bandwidth-mode" : ""}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/vendor" element={<VendorPortal />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* New Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/our-chefs" element={<OurChefs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <OfflineIndicator />
        </div>
      </TooltipProvider>
    </>
  );
};

export default App;
