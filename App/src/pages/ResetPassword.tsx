import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
  verificationCode: "",
  password: "",
  confirmPassword: "",
});

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {

  e.preventDefault();

  if (
  !form.verificationCode ||
  !form.password ||
  !form.confirmPassword
  ) {

    alert("Fill all fields");
    return;
  }

  if (form.password !== form.confirmPassword) {

    alert("Passwords do not match");
    return;
  }

  try {

    const email = localStorage.getItem(
      "reset_email"
    );

    if (!email) {

      alert("Email not found");
      return;
    }

    await resetPassword({
      email,
      verification_code: form.verificationCode,
      new_password: form.password,
      confirm_password: form.confirmPassword,
    });

    alert("Password reset successful");

    navigate("/login");

  } catch (error: any) {

    alert(
      error.message || "Reset password failed"
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
          Set New Password
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Create a strong password for your account
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OTP */}
<div>
  <label className="text-sm text-gray-300">
    Verification Code
  </label>

  <input
    type="text"
    name="verificationCode"
    placeholder="Enter OTP"
    value={form.verificationCode}
    onChange={handleChange}
    required
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
  />
</div>
          {/* NEW PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">
              New Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={handleChange}
              required
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
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}