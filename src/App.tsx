
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Templates from "./pages/Templates";
import NotFound from "./pages/NotFound";
import { DesignProvider } from "./contexts/DesignContext";
import { UserProvider } from "./contexts/UserContext";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";
import { CollaborationProvider } from "./contexts/CollaborationContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Marketplace from "./pages/Marketplace";
import MarketplaceItem from "./pages/MarketplaceItem";
import MyDesigns from "./pages/MyDesigns";
import SellDesign from "./pages/SellDesign";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <DesignProvider>
        <MarketplaceProvider>
          <CollaborationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/editor/:id?" element={<Editor />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/marketplace/:id" element={<MarketplaceItem />} />
                  <Route path="/my-designs" element={<MyDesigns />} />
                  <Route path="/sell-design/:id" element={<SellDesign />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CollaborationProvider>
        </MarketplaceProvider>
      </DesignProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
