import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


type Role = "viewer" | "admin" | "manager" | "analyst";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState<{
  username: string;
  companyName: string;

  email: string;
  password: string;
  confirmPassword: string;
}>({
  username: "",
  companyName: "",

  email: "",
  password: "",
  confirmPassword: "",
});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // VALIDATION
  const validateForm = () => {
    if (!formData.username.trim())
  return "Username is required";
    if (!formData.companyName.trim())
  return "Company name is required";
    
    if (!formData.email.includes("@"))
      return "Valid email is required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";

    return "";
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // ✅ Step 1: create user
      await signup(
  formData.username,
  formData.companyName,
  formData.email,
  formData.password,
  formData.confirmPassword
);

      localStorage.setItem(
  "verification_email",
  formData.email
);

      // ✅ Step 3: go to verification page
      navigate("/verify-email");

    } catch (err: any) {

  console.error(err);

  let errorMessage =
    "Unable to create account. Please try again.";

  if (err?.message) {

    if (
      err.message.includes("Failed to fetch")
    ) {

      errorMessage =
        "Server is temporarily unavailable.";

    } else {

      errorMessage = err.message;
    }
  }

  setError(errorMessage);
}
    finally {
      setIsSubmitting(false);
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
        <h2 className="text-center text-3xl font-semibold text-white mb-2">
          Create Account
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Create your account to continue
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-300">
              Username
            </label>

            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your name"
              className="
                w-full
                mt-1
                p-3
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
          

         <div>
  <label className="text-sm text-gray-300">
    Company Name
  </label>

  <input
    name="companyName"
    value={formData.companyName}
    onChange={handleChange}
    placeholder="Enter your company name"
    className="
      w-full
      mt-1
      p-3
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

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-300">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="
                w-full
                mt-1
                p-3
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

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="
                w-full
                mt-1
                p-3
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
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="
                w-full
                mt-1
                p-3
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
            disabled={isSubmitting || isLoading}
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
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?

          <Link
            to="/login"
            className="text-[#77B900] ml-1"
          >
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );
}