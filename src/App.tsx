
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
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { BroadcastBar } from "./components/realtime/BroadcastBar";
import { useAuth } from "./hooks/useAuth";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";

// Other pages
import About from "./pages/About";
import Contact from "./pages/Contact";
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
  const { user } = useAuth();
  
  return (
    <>
      <TooltipProvider>
        <Sonner />
        <div className={lowBandwidthMode ? "low-bandwidth-mode" : ""}>
          {/* Show broadcast bar for authenticated users */}
          {user && <BroadcastBar />}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/our-chefs" element={<OurChefs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/discovery" element={<Discovery />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Require Authentication */}
            <Route 
              path="/meal-planner" 
              element={
                <ProtectedRoute>
                  <MealPlanner />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <CommunityHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-confirmation" 
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Vendor Routes - Require Vendor Role */}
            <Route 
              path="/vendor" 
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorPortal />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes - Require Admin Role */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <OfflineIndicator />
        </div>
      </TooltipProvider>
    </>
  );
};

export default App;
