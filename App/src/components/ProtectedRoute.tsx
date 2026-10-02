
import { Navigate } from 'react-router-dom';
import { useState } from "react";

import { useAuth } from '@/context/AuthContext';
import { useSubscription } from "@/context/SubscriptionContext";

import UpgradeModal from "@/components/modals/UpgradeModal";

interface ProtectedRouteProps {
  children: React.ReactNode;

  requiredRole?: string[];

  allowedPlans?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedPlans
}) => {

  const { isAuthenticated, user, isLoading } =
    useAuth();

  const {
  selectedPlan,
  subscriptionStatus,
  trialEndsAt,
  setSubscriptionStatus,
  setSelectedPlan,
  setIsTrialActive,
  setUserRole,
} = useSubscription();

if (
  trialEndsAt &&
  new Date() > new Date(trialEndsAt)
) {

  localStorage.clear();

  setSubscriptionStatus("inactive");

  setSelectedPlan("free");

  setIsTrialActive(false);

  setUserRole("free");

  return <Navigate to="/plans-billing" replace />;
}
 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  console.log(
  "ProtectedRoute",
  {
    selectedPlan,
    subscriptionStatus,
    pathname:
      window.location.pathname
  }
);
  

  if (
  subscriptionStatus !== "active" &&
  subscriptionStatus !== "trial" &&
  window.location.pathname !== "/billing"
) {
  return <Navigate to="/billing" replace />;
}

  if (
  allowedPlans &&
  !allowedPlans.includes(selectedPlan)
) {
  return (
    <UpgradeModal
      open={true}
      onClose={() => {}}
      requiredPlan="Platform+"
    />
  );
}

  return <>{children}</>;
};