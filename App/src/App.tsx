import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider, NotificationsContainer } from "@/context/NotificationContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LoginPage from "./pages/Login";
import  SignupPage from "@/pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";
import { ProfilePage } from "@/pages/Profile";

import Dashboard from "@/pages/Dashboard";
import FeatureShowcase from "@/pages/FeatureShowcase";
import AgentOps from "@/pages/AgentOps";
import LLMOps from "@/pages/LLMOps";
import TokenOPS from "@/pages/TokenOPS";
import CostAnalyzer from "@/pages/CostAnalyzer";
import Categories from "@/pages/Categories";
import Kubernetes from "@/pages/Kubernetes";
import Recommendations from "@/pages/Recommendations";
import Anomalies from "@/pages/Anomalies";
import Reports from "@/pages/Reports";
import VirtualTags from "@/pages/VirtualTags";
import CostAllocation from "@/pages/CostAllocation";
import UnitEconomics from "@/pages/UnitEconomics";
import Forecasting from "@/pages/Forecasting";
import Budgeting from "@/pages/Budgeting";
import PaymentReceipts from "@/pages/PaymentReceipts";
import NotFound from "@/pages/NotFound";


import UserDashboard from "@/pages/UserDashboard";
import PlansBilling from "./pages/PlansBilling";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import ContactSales from "./pages/ContactSales";
import Billing from "./pages/Billing";
import MultiCloud from "@/pages/MultiCloud";
import HardwareOrchestration from "@/pages/HardwareOrchestration";
import Docker from "@/pages/Docker";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        
          <NotificationProvider>
            <TooltipProvider>
              <SubscriptionProvider>
              <AppProvider>
                <Toaster />
                <Sonner />
                <NotificationsContainer />

              <BrowserRouter>
                <Routes>

                  {/* 🔓 Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-email" element={<EmailVerification />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Redirect /neon to main dashboard */}
                  <Route path="/neon" element={<Navigate to="/dashboard" replace />} />
                  <Route
  path="/user-dashboard"
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  }
/>

                  {/* 🔐 Main App with Layout */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="multi-cloud" element={<MultiCloud />} />
                    <Route path="hardware-orchestration" element={<HardwareOrchestration />} />
                    <Route path="docker" element={<Docker />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="features" element={<FeatureShowcase />} />
                    <Route path="agent-ops" element={<AgentOps />} />
                    <Route path="llm-ops" element={<LLMOps />} />
                    <Route path="token-ops" element={<TokenOPS />} />
                    <Route path="cost-analyzer" element={<CostAnalyzer />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="kubernetes" element={<Kubernetes />} />
                    <Route path="recommendations" element={<Recommendations />} />
                    <Route path="anomalies" element={<Anomalies />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="virtual-tags" element={<VirtualTags />} />
                    <Route
  path="cost-allocation"
  element={
    <ProtectedRoute
      allowedPlans={[
        "platform-plus",
        "enterprise",
        "datacenter",
      ]}
    >
      <CostAllocation />
    </ProtectedRoute>
  }
/>
                    <Route path="unit-economics" element={<UnitEconomics />} />
                    <Route
  path="forecasting"
  element={
    <ProtectedRoute
      allowedPlans={[
        "platform",
        "platform-plus",
        "enterprise",
        "datacenter",
      ]}
    >
      <Forecasting />
    </ProtectedRoute>
  }
/>
                    <Route
  path="budgeting"
  element={
    <ProtectedRoute
      allowedPlans={[
        "platform",
        "platform-plus",
        "enterprise",
        "datacenter",
      ]}
    >
      <Budgeting />
    </ProtectedRoute>
  }
/>
                    <Route
  path="payment-receipts"
  element={
    <ProtectedRoute>
      <PaymentReceipts />
    </ProtectedRoute>
  }
/>
                    <Route path="/plans-billing" element={<PlansBilling />} />
                    <Route path="/contact-sales" element={<ContactSales />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                </Routes>
              </BrowserRouter>

            </AppProvider>
            </SubscriptionProvider>
          </TooltipProvider>
          
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;