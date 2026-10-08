import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";

import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated, user, logout } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load remembered username if present
  useEffect(() => {
    const savedUser = localStorage.getItem("remembered_username");
    if (savedUser) {
      setForm((prev) => ({ ...prev, username: savedUser }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFillDemo = () => {
    setForm({
      username: "testuser@finops.com",
      password: "admin@123",
    });
    toast.info("Demo credentials loaded", {
      description: "Click 'Sign In' to access the FinOps dashboard.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameTrimmed = form.username.trim();
    if (!usernameTrimmed || !form.password) {
      toast.error("Required fields missing", {
        description: "Please enter your email/username and password.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(
        usernameTrimmed,
        form.password,
        usernameTrimmed
      );

      // Handle 2FA if future backend requirement
      if (response?.requires_2fa) {
        localStorage.setItem("verification_email", response?.email || usernameTrimmed);
        localStorage.setItem("login_2fa", "true");
        toast.info("Security verification required", {
          description: "OTP has been sent to your registered email.",
        });
        navigate("/verify-email");
        return;
      }

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem("remembered_username", usernameTrimmed);
      } else {
        localStorage.removeItem("remembered_username");
      }

      toast.success("Welcome back!", {
        description: "Successfully signed in to your account.",
      });

      // Redirect user to destination or fallback
      const params = new URLSearchParams(location.search);
      const redirectUrl = params.get("redirect") || "/dashboard";
      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      const errorMsg = err?.message || "Invalid credentials. Please check your details.";
      toast.error("Sign in failed", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadingState = isLoading || isSubmitting;

  return (
    <AuthLayout>
      <div className="relative w-full min-h-[calc(100vh-140px)] flex items-center justify-center overflow-hidden px-4 py-8">
        {/* BACKGROUND AMBIENT GLOW & DOTS */}
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <div className="absolute w-[450px] h-[450px] bg-[#77B900]/10 rounded-full blur-[100px] pointer-events-none -top-20 -left-20" />
        <div className="absolute w-[350px] h-[350px] bg-[#77B900]/8 rounded-full blur-[90px] pointer-events-none -bottom-10 -right-10" />

        {/* LOGIN CARD */}
        <Card
          className="
            relative
            z-10
            w-full
            max-w-[420px]
            border
            border-[#77B900]/25
            bg-[#0B1208]/92
            backdrop-blur-xl
            rounded-[24px]
            shadow-[0_0_35px_rgba(119,185,0,0.12)]
            overflow-hidden
          "
        >
          {/* TOP ACCENT LINE */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#77B900] to-transparent" />

          {/* HEADER */}
          <CardHeader className="space-y-3 pt-6 pb-2 px-6 sm:px-8 text-center">
            {/* LOGO */}
            <div className="flex justify-center">
              <div className="relative p-2 rounded-2xl bg-black/40 border border-[#77B900]/30 shadow-[0_0_20px_rgba(119,185,0,0.2)]">
                <img
                  src="/Kore Value Logo.png"
                  alt="Seynova Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>

            {/* TITLE */}
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </CardTitle>

            {/* SUBTITLE */}
            <p className="text-[#A3A3A3] text-sm leading-relaxed">
              Sign in to manage your AI & Cloud FinOps workloads
            </p>
          </CardHeader>

          {/* CONTENT */}
          <CardContent className="px-6 sm:px-8 pt-4 pb-7">
            {isAuthenticated && (
              <div className="mb-4 p-3 rounded-xl bg-[#77B900]/10 border border-[#77B900]/30 text-xs text-white flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#A3A3A3]">Active session:</span>
                  <span className="font-semibold text-[#77B900] truncate max-w-[190px]">
                    {user?.name || user?.email || "Signed In"}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams(location.search);
                      navigate(params.get("redirect") || "/dashboard");
                    }}
                    className="flex-1 h-8 text-xs bg-[#77B900] hover:bg-[#8ED000] text-black font-semibold"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      logout();
                      toast.info("Signed out successfully");
                    }}
                    className="h-8 text-xs border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* USERNAME / EMAIL */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                  Work Email / Username
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77B900]/70">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="name@company.com or testuser@finops.com"
                    autoComplete="username"
                    disabled={loadingState}
                    className="
                      h-11
                      pl-10
                      pr-3
                      bg-black/50
                      border-[#77B900]/20
                      focus:border-[#77B900]
                      focus:ring-[#77B900]/20
                      text-white
                      placeholder:text-gray-500
                      rounded-xl
                      transition-all
                    "
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#77B900] hover:text-[#9fdc00] transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77B900]/70">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loadingState}
                    className="
                      h-11
                      pl-10
                      pr-10
                      bg-black/50
                      border-[#77B900]/20
                      focus:border-[#77B900]
                      focus:ring-[#77B900]/20
                      text-white
                      placeholder:text-gray-500
                      rounded-xl
                      transition-all
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#77B900]" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME & HELPER */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="border-[#77B900]/40 data-[state=checked]:bg-[#77B900] data-[state=checked]:text-black"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-xs text-gray-400 cursor-pointer select-none hover:text-gray-300 transition"
                  >
                    Remember me
                  </label>
                </div>

                {/* DEMO FILL PILL */}
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="
                    text-xs
                    text-[#77B900]/90
                    hover:text-[#77B900]
                    flex
                    items-center
                    gap-1
                    py-0.5
                    px-2
                    rounded-md
                    bg-[#77B900]/10
                    border
                    border-[#77B900]/20
                    hover:bg-[#77B900]/20
                    transition
                  "
                >
                  <Sparkles className="w-3 h-3" />
                  Fill Demo
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                disabled={loadingState}
                className="
                  w-full
                  h-11
                  mt-2
                  bg-[#77B900]
                  hover:bg-[#8ED000]
                  text-black
                  font-semibold
                  rounded-xl
                  transition-all
                  duration-300
                  hover:shadow-[0_0_20px_rgba(119,185,0,0.4)]
                  disabled:opacity-60
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {loadingState ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* FOOTER */}
            <div className="mt-6 pt-5 border-t border-[#77B900]/15 text-center">
              <p className="text-sm text-[#A3A3A3]">
                New to Seynova?{" "}
                <Link
                  to="/signup"
                  className="text-[#77B900] font-medium hover:text-[#9fdc00] transition inline-flex items-center gap-1 hover:underline"
                >
                  Create Account →
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}