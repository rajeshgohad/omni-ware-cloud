import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StorageLocations from "./pages/StorageLocations";
import Articles from "./pages/Articles";
import TransportOrders from "./pages/TransportOrders";
import Requests from "./pages/Requests";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { TenantProvider } from "./contexts/TenantContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/storage-locations" element={<Layout><StorageLocations /></Layout>} />
            <Route path="/articles" element={<Layout><Articles /></Layout>} />
            <Route path="/transport-orders" element={<Layout><TransportOrders /></Layout>} />
            <Route path="/requests" element={<Layout><Requests /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TenantProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
