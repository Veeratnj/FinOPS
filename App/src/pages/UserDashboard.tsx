import StartupView from "@/components/user-dashboard/StartupView";
import EnterpriseView from "@/components/user-dashboard/EnterpriseView";
import DataCenterView from "@/components/user-dashboard/DataCenterView";
import BusinessRequirementsView from "@/components/user-dashboard/BusinessRequirementsView";
import PlatformStrategyView from "@/components/user-dashboard/PlatformStrategyView";
import GTMSalesView from "@/components/user-dashboard/GTMSalesView";
import { useState } from "react";

import {
  LayoutDashboard,
  BadgeDollarSign,
  Layers3,
  Boxes,
  Lightbulb,
  AlertTriangle,
  FileText,
  Tags,
  PieChart,
  TrendingUp,
  LineChart,
  Wallet,
  Bell,
  Moon,
  User,
  Search,
} from "lucide-react";

const UserDashboard = () => {
  /* ================= STATES ================= */

  const [activeTab, setActiveTab] = useState("product-ux");

  const [activeUserType, setActiveUserType] =
    useState("startup");

  const [activeSidebar, setActiveSidebar] =
    useState("Dashboard");

  /* ================= SIDEBAR ================= */

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: BadgeDollarSign, label: "Cost Analyzer" },
    { icon: Layers3, label: "Categories" },
    { icon: Boxes, label: "Kubernetes" },
    { icon: Lightbulb, label: "Recommendation" },
    { icon: AlertTriangle, label: "Anomalies" },
    { icon: FileText, label: "Reports" },
    { icon: Tags, label: "Virtual Tags" },
    { icon: PieChart, label: "Cost Allocation" },
    { icon: TrendingUp, label: "Unit Economics" },
    { icon: LineChart, label: "Forecasting" },
    { icon: Wallet, label: "Budgeting" },
    { icon: Wallet, label: "Payment Receipts" },
  ];

  /* ================= TOP TABS ================= */

  const topTabs = [
    {
      id: "product-ux",
      title: "Product / UX",
      subtitle: "Persona experience",
    },
    {
      id: "business",
      title: "Business requirements",
      subtitle: "Functional needs",
    },
    {
      id: "platform",
      title: "Platform strategy",
      subtitle: "Adaptive intelligence",
    },
    {
      id: "gtm",
      title: "GTM / Sales",
      subtitle: "Buyer personas",
    },
  ];

  /* ================= USER TYPES ================= */

  const userTypes = [
    { id: "startup", label: "Startup" },
    { id: "enterprise", label: "Enterprise" },
    { id: "datacenter", label: "Data center" },
  ];
  

  return (
    <div className="h-screen w-full bg-[#0A0F0B] flex overflow-hidden text-white">

      {/* ================= SIDEBAR ================= */}

      <div className="w-[230px] bg-[#050A08] overflow-y-auto scrollbar-hide flex-shrink-0">

        {/* LOGO */}

        <div className="px-6 pt-5 pb-4">
          <img
            src="/Kore Value Logo.png"
            alt="logo"
            className="w-[60px] object-contain"
          />
        </div>

        {/* MENU */}

        <div className="px-4 pb-6 flex flex-col gap-[5px]">

          {sidebarItems.map((item, index) => {
            const Icon = item.icon;

            const active =
              activeSidebar === item.label;

            return (
              <button
                key={index}
                onClick={() =>
                  setActiveSidebar(item.label)
                }
                className={`
                  h-[46px]
                  rounded-[12px]
                  flex
                  items-center
                  gap-3
                  px-4
                  text-left
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-[#253900]/50 border border-[#77B900]/40 text-[#77B900]"
                      : "text-[#8C8C8C] hover:bg-[#131814]"
                  }
                `}
              >
                <Icon
                  size={16}
                  strokeWidth={1.9}
                />

                <span className="text-[13px] font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN ================= */}

      <div className="flex-1 overflow-y-auto scrollbar-hide">

        {/* ================= TOP BAR ================= */}

        <div className="h-[58px] flex items-center justify-between px-6">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
            />

            <input
              type="text"
              placeholder="Search resources, costs, teams..."
              className="
                w-[260px]
                h-[28px]
                bg-[#0E1510]
                border
                border-[#2A3822]
                rounded-[5px]
                pl-9
                pr-3
                text-[11px]
                text-white
                placeholder:text-[#666]
                outline-none
                focus:border-[#77B900]
              "
            />
          </div>

          {/* ICONS */}

          <div className="flex items-center gap-5 text-[#77B900]">

            <Bell size={14} strokeWidth={2} />

            <Moon size={14} strokeWidth={2} />

            <div className="w-[28px] h-[28px] rounded-full bg-[#77B900] flex items-center justify-center text-black">

              <User
                size={15}
                strokeWidth={2.5}
              />

            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="px-6 pt-4 pb-8 max-w-[1180px]">

          {/* TITLE */}

          <h1 className="text-[18px] font-semibold leading-none">
            Dashboard Overview
          </h1>

          <p className="text-[10px] text-[#777] mt-[5px]">
            Real-time cloud cost intelligence and optimization insights
          </p>

          {/* ================= TOP TABS ================= */}

          <div className="mt-4 grid grid-cols-4 border border-[#77B900]/40">

            {topTabs.map((tab, index) => {

              /* ================= ACTIVE LOGIC ================= */

              const active =
                tab.id === "product-ux"
                  ? activeTab === "product-ux" &&
                    activeUserType === "startup"
                  : activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`
                    h-[54px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    transition-all
                    duration-200

                    ${
                      index !== topTabs.length - 1
                        ? "border-r border-[#77B900]/40"
                        : ""
                    }

                    ${
                      active
                        ? "bg-[#253900]/50"
                        : "bg-[#131814]"
                    }
                  `}
                >

                  <span className="text-[11px] font-medium text-white leading-none">
                    {tab.title}
                  </span>

                  <span className="text-[9px] text-[#999] mt-[5px] leading-none">
                    {tab.subtitle}
                  </span>

                </button>
              );
            })}
          </div>
{/* ================= SECTION TITLE ================= */}

{activeTab === "product-ux" && (

  <div className="mt-4">

    <h2 className="text-[14px] font-semibold">
      Product / UX dashboard
    </h2>

    <p className="text-[10px] text-[#8A8A8A] mt-[2px]">
      Persona-adaptive interface — select your user type to see their tailored experience
    </p>

  </div>

)}

{/* ================= USER TYPE BUTTONS ================= */}

{activeTab === "product-ux" && (

  <div className="flex gap-3 mt-4">

    {userTypes.map((type) => {

      const active =
        activeUserType === type.id;

      return (
        <button
          key={type.id}
          onClick={() =>
            setActiveUserType(type.id)
          }
          className={`
            min-w-[112px]
            h-[30px]
            rounded-full
            border
            text-[11px]
            font-medium
            transition-all
            duration-200

            ${
              active
                ? "bg-[#253900] border-[#77B900] text-white"
                : "bg-[#131814] border-[#2B3B22] text-[#BFBFBF]"
            }
          `}
        >
          {type.label}
        </button>
      );
    })}

  </div>

)}

{/* ================= DYNAMIC VIEWS ================= */}

<div className="mt-5">

  {/* PRODUCT UX */}

  {activeTab === "product-ux" && (
    <>
      {activeUserType === "startup" && (
        <StartupView />
      )}

      {activeUserType === "enterprise" && (
        <EnterpriseView />
      )}

      {activeUserType === "datacenter" && (
        <DataCenterView />
      )}
    </>
  )}

  {/* BUSINESS REQUIREMENTS */}

  {activeTab === "business" && (
    <BusinessRequirementsView />
  )}

  {/* PLATFORM STRATEGY */}

  {activeTab === "platform" && (
  <PlatformStrategyView />
)}

  {/* GTM */}

  {/* GTM */}

{activeTab === "gtm" && (
  <GTMSalesView />
)}

</div>

          {/* ================= FOOTER ================= */}

          

<div className="mt-8">

  {/* TEXT */}

  <p className="text-[10px] text-[#6F6F6F] text-right mb-[10px]">
    © 2026 KoreValue. AI-Powered Cloud Intelligence Platform
  </p>

  {/* DIVIDER */}

  <div className="border-t border-[#3A3A3A]" />

</div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;