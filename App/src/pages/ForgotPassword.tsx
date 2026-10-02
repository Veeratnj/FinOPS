import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {

  e.preventDefault();

  try {

    await forgotPassword({
      email,
    });

    localStorage.setItem(
      "reset_email",
      email
    );

    alert(
      "Verification code sent successfully"
    );

    navigate("/reset-password");

  } catch (error: any) {

    alert(
      error.message || "Failed to send code"
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F0B] relative px-4">

      {/* LOGO */}
      <div className="absolute top-6 left-6">
        <img
          src="/Kore Value Logo.png"
          alt="Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* CARD */}
      <div className="w-full max-w-[420px] bg-[#131814] border border-[#2A3416] rounded-xl p-8">

        {/* TITLE */}
        <h2 className="text-3xl font-semibold text-center text-white mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Enter your email to receive verification code
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                mt-2
                px-4
                py-3
                rounded-md
                bg-[#0A0F0B]
                border
                border-[#2A3416]
                text-white
                placeholder:text-gray-500
                focus:outline-none
                focus:border-[#77B900]
              "
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-md
              bg-[#77B900]
              text-black
              font-semibold
              hover:opacity-90
              transition
            "
          >
            Send Code
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-6 text-gray-400">
          Remember your password?

          <span
            onClick={() => navigate("/login")}
            className="text-[#77B900] ml-1 cursor-pointer"
          >
            Sign In →
          </span>
        </p>
      </div>
    </div>
  );
}