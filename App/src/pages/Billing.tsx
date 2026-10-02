import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/context/SubscriptionContext";
import { useState } from "react";
declare global {
  interface Window {
    Razorpay: any;
  }
}
import {
  CreditCard,
  Wallet,
  Landmark,
  ShieldCheck,
  Lock,
  CheckCircle2,
} from "lucide-react";


const Billing = () => {
  const navigate = useNavigate();

  const {
    selectedPlan,
    billingCycle,

    loadSubscription,

    setPaymentMethod,
    setCardLast4,
    setPaymentProvider,
    setAutoRenew,
  } = useSubscription();

  const [loading, setLoading] =
    useState(false);

  const [paymentSuccess, setPaymentSuccess] =
  useState(false);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
  useState("card");

  const [cardNumber, setCardNumber] =
  useState("");

const [autoRenewEnabled, setAutoRenewEnabled] =
  useState(true); 

const handlePayment = async () => {
  const token =
    localStorage.getItem("access_token"); 
    
  try {

    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/payments/create-order`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          amount: getPlanPrice(),
          plan: selectedPlan,
        }),
      }
    );

    const orderData =
      await response.json();
    console.log(orderData);
    const options = {

      key:
        import.meta.env
          .VITE_RAZORPAY_KEY_ID,

      amount: orderData.order.amount,

      currency:
        orderData.order.currency,

      name: "FinOps AI",

      description:
        `${selectedPlan} Subscription`,

      order_id: orderData.order.id,

      handler: async function (
  response: any
) {

  const verifyResponse =
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/payments/verify`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          razorpay_order_id:
            response.razorpay_order_id,

          razorpay_payment_id:
            response.razorpay_payment_id,

          razorpay_signature:
            response.razorpay_signature,
        }),
      }
    );

  const verifyData =
    await verifyResponse.json();

  if (!verifyData.success) {

    alert(
      "Payment verification failed"
    );

    return;
  }

  const last4 =
    cardNumber.slice(-4);
        setPaymentMethod(
          selectedPaymentMethod
        );

        setCardLast4(last4);

        setPaymentProvider(
          "Razorpay"
        );

        setAutoRenew(
          autoRenewEnabled
        );

        localStorage.setItem(
          "paymentMethod",
          selectedPaymentMethod
        );

        localStorage.setItem(
          "cardLast4",
          last4
        );

        localStorage.setItem(
          "paymentProvider",
          "Razorpay"
        );

        localStorage.setItem(
          "autoRenew",
          autoRenewEnabled.toString()
        );

        setPaymentSuccess(true);

await loadSubscription();

setTimeout(() => {
  navigate("/dashboard");
}, 2200);
      },

      theme: {
        color: "#84cc16",
      },
    };

    const razorpay =
      new window.Razorpay(options);

    razorpay.open();

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};

  
  const getPlanPrice = () => {
  if (selectedPlan === "platform") {
    return billingCycle === "monthly"
      ? 299
      : 239;
  }

  if (selectedPlan === "platform-plus") {
    return billingCycle === "monthly"
      ? 999
      : 799;
  }

  return 0;
};

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Billing
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-sm font-medium">

  Active Plan:
  <span className="capitalize">
    {selectedPlan}
  </span>

</div>

          <p className="text-zinc-400 mt-3">
            Secure checkout for your AI FinOps subscription
          </p>
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}

<div className="lg:col-span-2 bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">

          {/* PLAN SUMMARY */}

          <div className="mb-8 border-b border-zinc-800 pb-6">

            <h2 className="text-2xl font-semibold mb-4">
              Plan Summary
            </h2>

            <div className="space-y-2">

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Selected Plan
                </span>

                <span className="capitalize text-lime-400 font-medium">
                  {selectedPlan}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Billing Cycle
                </span>

                <span className="capitalize">
                  {billingCycle}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Trial Duration
                </span>

                <div className="text-right">

  <span>
    14 Days
  </span>

  <p className="text-xs text-lime-400 mt-1">
    Trial starts immediately
  </p>

</div>
              </div>

            </div>
          </div>
          {/* PAYMENT METHODS */}

<div className="mb-6">

  <h2 className="text-2xl font-semibold mb-4">
    Select Payment Method
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

    <button
      onClick={() => setSelectedPaymentMethod("card")}
        className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
        selectedPaymentMethod === "card"
          ? "bg-lime-500 text-black border-lime-500"
          : "bg-zinc-800 border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
  <CreditCard size={18} />
  Card
</div>
    </button>

    <button
      onClick={() => setSelectedPaymentMethod("upi")}
      className={`p-4 rounded-xl border transition ${
        selectedPaymentMethod === "upi"
          ? "bg-lime-500 text-black border-lime-500"
          : "bg-zinc-800 border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
  <Wallet size={18} />
  UPI
</div>
    </button>

    <button
      onClick={() => setSelectedPaymentMethod("bank")}
      className={`p-4 rounded-xl border transition ${
        selectedPaymentMethod === "bank"
          ? "bg-lime-500 text-black border-lime-500"
          : "bg-zinc-800 border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
  <Landmark size={18} />
  Net Banking
</div>
    </button>

    <button
      onClick={() => setSelectedPaymentMethod("wallet")}
      className={`p-4 rounded-xl border transition ${
        selectedPaymentMethod === "wallet"
          ? "bg-lime-500 text-black border-lime-500"
          : "bg-zinc-800 border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
  <Wallet size={18} />
  Wallet
</div>
    </button>

  </div>
</div>

          {/* PAYMENT FORM */}

          <div className="space-y-5">

            <h2 className="text-2xl font-semibold">
              Payment Details
            </h2>

            {/* CARD */}

{selectedPaymentMethod === "card" && (
  <div className="space-y-4">

    <input
      type="text"
      placeholder="Card Holder Name"
      className="w-full p-4 rounded-2xl bg-zinc-800/70 border border-zinc-700 focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
    />

    <div className="relative">

  <CreditCard
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
  />

    <input
  type="text"
  placeholder="Card Number"
  value={cardNumber}
  onChange={(e) =>
    setCardNumber(e.target.value)
  }
    className="w-full pl-12 p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
  />
</div>

    <div className="grid grid-cols-2 gap-4">

      <input
        type="text"
        placeholder="MM/YY"
        className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl placeholder:text-zinc-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
      />

      <input
        type="text"
        placeholder="CVV"
        className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl placeholder:text-zinc-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
      />

    </div>
  </div>
)}

{/* UPI */}

{selectedPaymentMethod === "upi" && (
  <div className="space-y-4">

    <input
      type="text"
      placeholder="Enter UPI ID"
      className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl focus:border-lime-400 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
    />

    <div className="grid grid-cols-2 gap-4">

      <button className="p-4 bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl flex items-center justify-center gap-2 hover:border-lime-400 transition-all">
  <Wallet size={18} />
  Google Pay
</button>

      <button className="p-4 bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl flex items-center justify-center gap-2 hover:border-lime-400 transition-all">
  <Wallet size={18} />
  PhonePe
</button>

    </div>
  </div>
)}

{/* NET BANKING */}

{selectedPaymentMethod === "bank" && (
  <select className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700">

    <option>Select Bank</option>

    <option>HDFC Bank</option>

    <option>ICICI Bank</option>

    <option>SBI</option>

    <option>Axis Bank</option>

  </select>
)}

{/* WALLET */}

{selectedPaymentMethod === "wallet" && (
  <div className="grid grid-cols-3 gap-4">

    <button className="p-4 bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl flex items-center justify-center gap-2 hover:border-lime-400 transition-all">
      Paytm
    </button>

    <button className="p-4 bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl flex items-center justify-center gap-2 hover:border-lime-400 transition-all">
      Amazon Pay
    </button>

    <button className="p-4 bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-xl flex items-center justify-center gap-2 hover:border-lime-400 transition-all">
      Mobikwik
    </button>

  </div>
)}

            </div>

            <div className="flex items-center gap-3 mt-5 opacity-70">

  <img
    src="https://cdn-icons-png.flaticon.com/512/349/349221.png"
    className="h-7"
  />

  <img
    src="https://cdn-icons-png.flaticon.com/512/349/349228.png"
    className="h-7"
  />

  <img
    src="https://cdn-icons-png.flaticon.com/512/5968/5968144.png"
    className="bg-white p-2 rounded-lg h-7"
  />

</div>

            </div>
            {/* RIGHT SIDE */}

<div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-8 h-fit sticky top-10">

  <div className="flex items-center gap-2 mb-6">
    <ShieldCheck className="text-lime-400" size={22} />

    <h2 className="text-1xl font-bold">
      Order Summary
    </h2>
  </div>

  <div className="space-y-5">

    <div className="flex items-start justify-between">
      <span className="text-zinc-400">
        Selected Plan
      </span>

      <span className="capitalize text-lime-400 font-semibold">
        {selectedPlan}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-zinc-400">
        Billing Cycle
      </span>

      <span className="capitalize">
        {billingCycle}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-zinc-400">
        Trial Period
      </span>

      <span>
        14 Days
      </span>
    </div>

    <div className="border-t border-zinc-800 pt-5">

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>

        <span className="text-lime-400">
          ${getPlanPrice().toFixed(2)}
        </span>
      </div>

      <p className="text-sm text-zinc-500 mt-2">
        Taxes included where applicable.
      </p>

    </div>

    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 mb-5">

  <div>
    <h3 className="font-medium">
      Auto Renewal
    </h3>

    <p className="text-xs text-zinc-400 mt-1">
      Automatically renew subscription after trial
    </p>
  </div>

  <button
    onClick={() =>
      setAutoRenewEnabled(
        !autoRenewEnabled
      )
    }
    className={`w-14 h-8 rounded-full transition-all ${
      autoRenewEnabled
        ? "bg-lime-400"
        : "bg-zinc-700"
    }`}
  >
    <div
      className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
        autoRenewEnabled
          ? "translate-x-7"
          : "translate-x-1"
      }`}
    />
  </button>

</div>

    <div className="space-y-3 pt-4">

      <div className="flex items-center gap-3 text-sm text-zinc-300">
        <CheckCircle2 size={18} className="text-lime-400" />
        14-day free trial included
      </div>

      <div className="flex items-start gap-3 text-sm text-yellow-400">

  <ShieldCheck size={18} />

  <p>
    Your subscription will automatically renew
    after the trial period unless cancelled.
  </p>

</div>

      <div className="flex items-center gap-3 text-sm text-zinc-300">
        <CheckCircle2 size={18} className="text-lime-400" />
        Cancel anytime
      </div>

      <div className="flex items-center gap-3 text-sm text-zinc-300">
        <CheckCircle2 size={18} className="text-lime-400" />
        Secure encrypted checkout
      </div>

    </div>

    <button
      onClick={handlePayment}
      className="w-full mt-8 bg-lime-400 hover:bg-lime-300 text-black font-bold py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
    >
      <Lock size={18} />

      {loading
        ? "Processing..."
        : "Start Free Trial"}
    </button>

    <p className="text-xs text-zinc-500 text-center mt-4">
      Payments secured by 256-bit SSL encryption
    </p>

  </div>
</div>
{paymentSuccess && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

    <div className="bg-zinc-900 border border-lime-500/20 rounded-3xl p-10 animate-in zoom-in duration-300 w-[420px] text-center shadow-2xl">

      <div className="w-20 h-20 rounded-full bg-lime-400 text-black flex items-center justify-center text-4xl font-bold mx-auto mb-6">
        ✓
      </div>

      <h2 className="text-3xl font-bold mb-3">
        Payment Successful
      </h2>

      <p className="text-zinc-400">
        Your {selectedPlan} plan trial is now active.
Redirecting to dashboard...
      </p>

    </div>

  </div>
)}
            

            

           

          
        </div>
      </div>
      </div>
      
    
  );
};

export default Billing;