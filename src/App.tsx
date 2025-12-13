import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider } from "@/contexts/ShopContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index";
import Academy from "./pages/Academy";
import Journal from "./pages/Journal";
import Bazaar from "./pages/Bazaar";
import Dashboard from "./pages/Dashboard";
import Oracle from "./pages/Oracle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ShopProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/bazaar" element={<Bazaar />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/oracle" element={<Oracle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ShopProvider>
  </QueryClientProvider>
);

export default App;
