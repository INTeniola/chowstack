
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

const App = () => (
  <TooltipProvider>
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/discovery" element={<Discovery />} />
      <Route path="/meal-planner" element={<MealPlanner />} />
      <Route path="/community" element={<CommunityHub />} />
      <Route path="/vendor" element={<VendorPortal />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/notifications" element={<Notifications />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
