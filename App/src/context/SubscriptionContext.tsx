import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { subscriptionService }
from "../services/subscriptionService";

type BillingCycle = "monthly" | "annual";

type SubscriptionStatus =
  | "inactive"
  | "trial"
  | "active";

type PlanType =
  | "free"
  | "platform"
  | "platform-plus"
  | "enterprise"
  | "datacenter";

type UserRole =
  | "free"
  | "platform"
  | "platform-plus"
  | "enterprise"
  | "datacenter";

interface SubscriptionContextType {
  selectedPlan: PlanType;
  billingCycle: BillingCycle;
  subscriptionStatus: SubscriptionStatus;
  
  loadSubscription: () => Promise<void>;
  setSelectedPlan: (plan: PlanType) => void;
  setBillingCycle: (cycle: BillingCycle) => void;
  setSubscriptionStatus: (
    status: SubscriptionStatus
  ) => void;

  trialEndsAt: string | null;
trialStartsAt: string | null;

isTrialActive: boolean;

userRole: UserRole;

setTrialEndsAt: (
  date: string | null
) => void;

setTrialStartsAt: (
  date: string | null
) => void;

setIsTrialActive: (
  active: boolean
) => void;

setUserRole: (
  role: UserRole
) => void;
paymentMethod: string;

cardLast4: string;

paymentProvider: string;

autoRenew: boolean;

setPaymentMethod: (
  method: string
) => void;

setCardLast4: (
  last4: string
) => void;

setPaymentProvider: (
  provider: string
) => void;

setAutoRenew: (
  renew: boolean
) => void;
}




const SubscriptionContext =
  createContext<SubscriptionContextType | null>(
    null
  );

export const SubscriptionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedPlan, setSelectedPlan] =
    useState<PlanType>("enterprise");

  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("monthly");

  const [
    subscriptionStatus,
    setSubscriptionStatus,
  ] = useState<SubscriptionStatus>("active");

  const [trialEndsAt, setTrialEndsAt] =
  useState<string | null>(null);

  const [trialStartsAt, setTrialStartsAt] =
  useState<string | null>(null);

const [isTrialActive, setIsTrialActive] =
  useState(false);

const [userRole, setUserRole] =
  useState<UserRole>("free");

const [paymentMethod, setPaymentMethod] =
  useState("");

const [cardLast4, setCardLast4] =
  useState("");

const [paymentProvider, setPaymentProvider] =
  useState("");

const [autoRenew, setAutoRenew] =
  useState(true);

const loadSubscription = async () => {

  try {

    const response =
      await subscriptionService
        .getCurrentSubscription();

    if (response.success) {

      setSelectedPlan(
        response.plan_name
      );

      setSubscriptionStatus(
        response.status as SubscriptionStatus
      );

      setTrialEndsAt(
        response.trial_end_date ?? null
      );

      setAutoRenew(
        Boolean(response.auto_renew)
      );

    }

  } catch (error) {

    console.error(
      "Failed to load subscription",
      error
    );

  }

};

useEffect(() => {
  loadSubscription();
  const savedPlan =
    localStorage.getItem(
      "selectedPlan"
    ) as PlanType | null;

  const savedStatus =
    localStorage.getItem(
      "subscriptionStatus"
    ) as SubscriptionStatus | null;

  const savedTrialEndsAt =
    localStorage.getItem(
      "trialEndsAt"
    );

  const savedTrialActive =
    localStorage.getItem(
      "isTrialActive"
    );

  const savedUserRole =
    localStorage.getItem(
      "userRole"
    ) as UserRole | null;

  const savedPaymentMethod =
  localStorage.getItem(
    "paymentMethod"
  );

const savedCardLast4 =
  localStorage.getItem(
    "cardLast4"
  );

const savedPaymentProvider =
  localStorage.getItem(
    "paymentProvider"
  );

const savedAutoRenew =
  localStorage.getItem(
    "autoRenew"
  );

  /*if (savedPlan) {
    setSelectedPlan(savedPlan);
  }

  if (savedStatus) {
    setSubscriptionStatus(savedStatus);
  }*/

  if (savedTrialEndsAt) {
    setTrialEndsAt(savedTrialEndsAt);
  }

  if (savedTrialActive) {
    setIsTrialActive(
      savedTrialActive === "true"
    );
  }

  if (savedUserRole) {
    setUserRole(savedUserRole);
  }

  if (
  savedTrialEndsAt &&
  savedStatus === "trial"
) 

{

  const now = new Date();

  const expiry =
    new Date(savedTrialEndsAt);

  if (now > expiry) {

    setSelectedPlan("free");

    setSubscriptionStatus(
      "inactive"
    );

    setIsTrialActive(false);

    setUserRole("free");

    setTrialEndsAt(null);

    setTrialStartsAt(null);

    localStorage.setItem(
      "selectedPlan",
      "free"
    );

    localStorage.setItem(
      "subscriptionStatus",
      "inactive"
    );

    localStorage.setItem(
      "isTrialActive",
      "false"
    );

    localStorage.setItem(
      "userRole",
      "free"
    );

    localStorage.removeItem(
      "trialEndsAt"
    );

    localStorage.removeItem(
      "trialStartsAt"
    );

  }

}
if (savedPaymentMethod) {
  setPaymentMethod(
    savedPaymentMethod
  );
}

if (savedCardLast4) {
  setCardLast4(
    savedCardLast4
  );
}

if (savedPaymentProvider) {
  setPaymentProvider(
    savedPaymentProvider
  );
}

if (savedAutoRenew) {
  setAutoRenew(
    savedAutoRenew === "true"
  );
}

}, []);

  return (
    <SubscriptionContext.Provider
      value={{
        selectedPlan,
        billingCycle,
        subscriptionStatus,
        loadSubscription,
        trialEndsAt,
        trialStartsAt,
        isTrialActive,
        userRole,

        paymentMethod,
cardLast4,
paymentProvider,
autoRenew,

        setSelectedPlan,
        setBillingCycle,
        setSubscriptionStatus,

        setTrialEndsAt,
        setTrialStartsAt,
        setIsTrialActive,
        setUserRole,

        setPaymentMethod,
setCardLast4,
setPaymentProvider,
setAutoRenew,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(
    SubscriptionContext
  );

  if (!context) {
    throw new Error(
      "useSubscription must be used inside SubscriptionProvider"
    );
  }

  return context;
};