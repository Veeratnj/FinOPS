import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifyEmail,
  verifyLoginOtp,
  resendVerification
} from "@/services/authService";
export default function EmailVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleVerify = async (e: any) => {

  e.preventDefault();

  try {

    const email = localStorage.getItem(
      "verification_email"
    );

    if (!email) {

      alert("Email not found");
      return;
    }

    /* =========================
       CHECK LOGIN 2FA FLOW
    ========================= */

    const isLogin2FA = localStorage.getItem(
      "login_2fa"
    );

    /* =========================
       LOGIN OTP VERIFICATION
    ========================= */

    if (isLogin2FA === "true") {

      const result = await verifyLoginOtp({
        email,
        verification_code: code,
      });

      /* SAVE TOKENS */

localStorage.setItem(
  "access_token",
  result.access_token
);

localStorage.setItem(
  "refresh_token",
  result.refresh_token
);

localStorage.setItem(
  "user",
  JSON.stringify(result.user)
);

localStorage.removeItem(
  "login_2fa"
);

alert("Login successful");


window.location.href = "/neon";

      return;
    }

    /* =========================
       NORMAL EMAIL VERIFICATION
    ========================= */

    await verifyEmail({
      email,
      verification_code: code,
    });

    alert("Email verified successfully");

    
window.location.href = "/neon";

  } catch (error: any) {

    alert(
      error.message || "Verification failed"
    );
  }
};

  const handleResend = async () => {

  try {

    const email = localStorage.getItem(
      "verification_email"
    );

    if (!email) {

      alert("Email not found");
      return;
    }

    await resendVerification({
      email,
    });

    alert(
      "Verification code resent successfully"
    );

  } catch (error: any) {

    alert(
      error.message || "Failed to resend code"
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
          Email Verification
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Enter the verification code sent to your email
        </p>

        {/* FORM */}
        <form onSubmit={handleVerify} className="space-y-5">

          {/* VERIFICATION CODE */}
          <div>
            <label className="text-sm text-gray-300">
              Verification Code
            </label>

            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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

          {/* VERIFY BUTTON */}
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
            Verify
          </button>
        </form>

        {/* RESEND */}
        <p className="text-center text-sm mt-6 text-gray-400">
          Didn’t receive the email?

          <span
            onClick={handleResend}
            className="text-[#77B900] ml-1 cursor-pointer"
          >
            Click to resend
          </span>
        </p>
      </div>
    </div>
  );
}