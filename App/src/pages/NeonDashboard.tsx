import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import Individual from "./Individual";
import Startup from "./Startup";

const NeonDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [profile, setProfile] = useState("individual");

  // =================================================
  // PERFECT INITIALS LOGIC
  // =================================================
  const getInitials = (name?: string) => {
    if (!name) return "U";

    const cleanName = name.trim();

    if (!cleanName) return "U";

    const parts = cleanName.split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (
      parts[0][0] + parts[1][0]
    ).toUpperCase();
  };

  // =================================================
  // EXISTING MENU LOGIC
  // =================================================
  const menuItem = (
    path: string,
    label: string
  ) => {
    const active = location.pathname === path;

    return (
      <Link to={path}>
        <div
          className={`
            flex items-center gap-4 px-2 h-[41px]
            rounded-md transition-all duration-300
            ${
              active
                ? "bg-[#77B900]/10 text-[#77B900]"
                : "text-[#7E7E7E] hover:bg-[#77B900]/10 hover:text-[#77B900]"
            }
          `}
        >
          <span
            className={`${
              active
                ? "text-[#77B900]"
                : "text-[#7E7E7E]"
            }`}
          >
            •
          </span>

          <span className="text-sm">
            {label}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0A0F0B]">

      {/* ================= SIDEBAR ================= */}
      <div
        className="
          w-[280px]
          flex flex-col justify-between
          bg-[#1A2E00]
          border-r border-[#1A2E00]
          flex-shrink-0
        "
      >

        {/* ================= TOP ================= */}
        <div>

          {/* HOME BUTTON */}
          <div className="px-5 py-3 border-b border-[#558501]">

            <button
              onClick={() => {
                window.location.href =
                  "http://CtrlS.co";
              }}
              className="
                w-full
                flex items-center justify-center gap-2
                py-2
                rounded-md
                border border-[#77B900]
                text-[#77B900]
                hover:bg-[#77B900]/10
                transition
              "
            >
              ⬅ Home
            </button>

          </div>

          {/* LOGO */}
          <div className="px-5 py-5 border-b border-[#558501]">

            <h1
              className="
                text-2xl
                font-semibold
                text-[#77B900]
              "
            >
              AI FinOps
            </h1>

            <p
              className="
                text-[#D9D9D9]
                text-xs
                mt-1
              "
            >
              Cost Intelligence Platform
            </p>

          </div>

          {/* PROFILE */}
          <div className="px-5 py-5 border-b border-[#558501]">

            {/* AVATAR */}
            <div
              className="
                w-10 h-10
                rounded-full
                border border-[#77B900]
                flex items-center justify-center
                text-[#77B900]
                text-sm font-semibold
              "
            >
              {getInitials(user?.name)}
            </div>

            {/* NAME */}
            <h2
              className="
                mt-3
                text-[#77B900]
                text-lg
                font-medium
              "
            >
              {user?.name || "User"}
            </h2>

            {/* PROFILE TYPE */}
            <div
              className="
                mt-2
                inline-block
                px-2 py-[2px]
                text-xs
                rounded-full
                border border-[#77B900]
                text-[#7E7E7E]
              "
            >
              {profile === "individual"
                ? "Individual"
                : "Startup"}
            </div>

          </div>

          {/* ================= MENU ================= */}
          <div className="px-3 py-5 space-y-5">

            {/* OVERVIEW */}
            <div>

              <p
                className="
                  text-[#D9D9D9]
                  text-xs
                  mb-2
                "
              >
                OVERVIEW
              </p>

              <div className="space-y-1">

                {/* USER DASHBOARD */}
                <Link to="/user-dashboard">

                  <div
                    className="
                      flex items-center gap-4
                      px-2 h-[41px]
                      rounded-md
                      transition-all duration-300
                      text-[#7E7E7E]
                      hover:bg-[#77B900]/10
                      hover:text-[#77B900]
                    "
                  >
                    <span>•</span>

                    <span className="text-sm">
                      User Dashboard
                    </span>
                  </div>

                </Link>

                {/* SAMPLE DASHBOARD */}
                {menuItem("/", " Sample Dashboard")}

                {/* SETTINGS */}
                {menuItem(
                  "/profile",
                  "Profile & Settings"
                )}

              </div>
            </div>

            {/* FINOPS */}
            <div>

              <p
                className="
                  text-[#D9D9D9]
                  text-xs
                  mb-2
                "
              >
                FINOPS
              </p>

              <div className="space-y-1">

                {menuItem(
                  "/spend",
                  "Spend Monitoring"
                )}

                {menuItem(
                  "/optimization",
                  "Optimization"
                )}

                {menuItem(
                  "/orchestration",
                  "Orchestration"
                )}

                {menuItem(
                  "/waste",
                  "Waste Elimination"
                )}

              </div>
            </div>

            {/* REPORTING */}
            <div>

              <p
                className="
                  text-[#D9D9D9]
                  text-xs
                  mb-2
                "
              >
                REPORTING
              </p>

              <div className="space-y-1">

                {menuItem(
                  "/cost",
                  "Cost Allocation"
                )}

                {menuItem(
                  "/forecast",
                  "Forecasting"
                )}

                {menuItem(
                  "/audit",
                  "Audit Logs"
                )}

              </div>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="px-5 py-5 border-t border-[#558501]">

          <p
            className="
              text-[#D9D9D9]
              text-xs
              mb-3
            "
          >
            SWITCH PROFILE TYPE
          </p>

          <div className="flex gap-2">

            {/* INDIVIDUAL */}
            <button
              onClick={() =>
                setProfile("individual")
              }
              className={`px-2 py-[1px] text-[11px] rounded-full ${
                profile === "individual"
                  ? "bg-[#77B900] text-black shadow-[0_0_6px_#77B900]"
                  : "border border-[#558501] text-[#D9D9D9]"
              }`}
            >
              Individual
            </button>

            {/* STARTUP */}
            <button
              onClick={() =>
                setProfile("startup")
              }
              className={`px-2 py-[1px] text-[11px] rounded-full ${
                profile === "startup"
                  ? "bg-[#77B900] text-black shadow-[0_0_6px_#77B900]"
                  : "border border-[#558501] text-[#D9D9D9]"
              }`}
            >
              Startup
            </button>

            {/* BUSINESS */}
            <button
              className="
                px-2 py-[1px]
                text-[11px]
                rounded-full
                border border-[#558501]
                text-[#D9D9D9]
              "
            >
              Business
            </button>

            {/* DC */}
            <button
              className="
                px-2 py-[1px]
                text-[11px]
                rounded-full
                border border-[#558501]
                text-[#D9D9D9]
              "
            >
              DC
            </button>

          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div
        className="
          flex-1
          bg-[#0A0F0B]
          text-white
          overflow-y-auto
        "
      >

        {profile === "individual" && (
          <Individual />
        )}

        {profile === "startup" && (
          <Startup />
        )}

      </div>
    </div>
  );
};

export default NeonDashboard;