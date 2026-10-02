
import AuthLayout from "@/components/layout/AuthLayout";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import {Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {

  const navigate = useNavigate();

  const { login, isLoading } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!form.username || !form.password) {
      alert("Username and password are required");
      return;
    }

    try {

      const response = await login(
        form.username,
        form.password,
        form.username
      );
      /* =========================
   2FA LOGIN FLOW
========================= */

if (response?.requires_2fa) {

  localStorage.setItem(
    "verification_email",
    response?.email || form.username
  );

  localStorage.setItem(
    "login_2fa",
    "true"
  );


  alert("OTP sent to your email");

  navigate("/verify-email");

  return;
}

      

      console.log("Login + Email success");

      const params = new URLSearchParams(
        window.location.search
      );

      const redirectUrl = params.get("redirect");

      if (redirectUrl) {

        window.location.href = redirectUrl;

      } else {

        navigate("/neon");

      }

    } catch (err: any) {

      alert(err.message || "Login failed");

    }
  };

  return (

    <AuthLayout>

      <div
        className="
          relative
          w-full
          min-h-[calc(100vh-140px)]
          flex
          items-center
          justify-center
          overflow-hidden
          px-4
          py-10
        "
      >

        {/* BACKGROUND DOTS */}
        <div className="absolute inset-0 dot-pattern opacity-20" />

        {/* SUBTLE GREEN GLOW */}
        <div className="dashboard-glow opacity-10" />

        {/* LOGIN CARD */}
        <Card
          className="
            relative
            z-10
            w-full
            max-w-[350px]
            border
            border-[#77B900]/20
            bg-[#0B1208]/92
            backdrop-blur-xl
            rounded-[22px]
            shadow-[0_0_30px_rgba(119,185,0,0.10)]
          "
        >

          {/* HEADER */}
          <CardHeader className="space-y-3 pb-4">

            {/* LOGO */}
            <div className="flex justify-center">

              <img
                src="/Kore Value Logo.png"
                alt="logo"
                className="
                  w-[56px]
                  h-[56px]
                  object-contain
                  glow-green
                "
              />

            </div>

            {/* TITLE */}
            <CardTitle
              className="
                text-center
                text-[30px]
                font-semibold
                text-white
              "
            >
              Welcome Back
            </CardTitle>

            {/* SUBTITLE */}
            <p
              className="
                text-center
                text-[#A3A3A3]
                text-sm
                leading-[22px]
              "
            >
              Sign in to continue to your cloud platform
            </p>

          </CardHeader>

          {/* CONTENT */}
          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off"
            >

              {/* USERNAME / USER ID */}
              <div className="space-y-2">

                <Label className="text-[#D1D5DB]">
                  User ID
                </Label>

                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your user ID"
                  autoComplete="username"
                  className="
                    h-[44px]
                    bg-black/40
                    border-[#77B900]/15
                    focus:border-[#77B900]
                    text-white
                  "
                />

              </div>

              {/* PASSWORD */}
              <div className="space-y-2">

                <Label className="text-[#D1D5DB]">
                  Password
                </Label>

                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="
                    h-[44px]
                    bg-black/40
                    border-[#77B900]/15
                    focus:border-[#77B900]
                    text-white
                  "
                />

                <Link
                  to="/forgot-password"
                  className="
                    text-right
                    block
                    text-sm
                    text-[#77B900]
                    mt-1
                    hover:text-[#9fdc00]
                    transition
                  "
                >
                  Forgot Password?
                </Link>

              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={isLoading}
                className="
                  w-full
                  h-[46px]
                  bg-[#77B900]
                  hover:bg-[#8ED000]
                  text-black
                  font-semibold
                  rounded-xl
                  transition-all
                  duration-300
                  hover:shadow-[0_0_20px_rgba(119,185,0,0.35)]
                "
              >
                {isLoading
                  ? "Signing in..."
                  : "Sign In"}
              </Button>

            </form>

            {/* FOOTER */}
            <p
              className="
                text-center
                text-sm
                text-[#A3A3A3]
                mt-5
              "
            >
              New to Seynova?

              <Link
                to="/signup"
                className="
                  text-[#77B900]
                  ml-1
                  hover:text-[#9fdc00]
                  transition
                "
              >
                Create Account →
              </Link>

            </p>

          </CardContent>

        </Card>

      </div>

    </AuthLayout>
  );
}