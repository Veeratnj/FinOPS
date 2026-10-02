import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const enterpriseCards = [
  {
    title: "Monthly AI spend",
    value: "$348,000",
    subtitle: "8 cost centers tracked",
  },
  {
    title: "Waste detected",
    value: "$92,400",
    subtitle: "26.5% of total spend",
  },
  {
    title: "Teams onboarded",
    value: "24",
    subtitle: "Chargeback active",
  },
  {
    title: "Compliance score",
    value: "94%",
    subtitle: "SOC2 aligned",
  },
  {
    title: "Savings YTD",
    value: "$1.2M",
    subtitle: "vs $880K target",
  },
];
const enterpriseAlerts = [
  {
    title: "Budget breach — Research team Q3",
    desc: "Research namespace 112% of budget · Governance rule triggered",
    badge: "Critical",
    amount: "+$48K over",
  },
  {
    title: "Reserved instance utilisation low — AWS us-east-1",
    desc: "3 × H100 RIs at 41% utilisation · Recommend reassignment",
    badge: "Warning",
    amount: "$22K/mo at risk",
  },
  {
    title: "Multi-cloud arbitrage opportunity",
    desc: "Move LLM training batch to CoreWeave · 31% cheaper than AWS today",
    badge: "Opportunity",
    amount: "Save $38K/mo",
  },
];
const spendByTeam = [
  {
    month: "Jan",
    ml: 42000,
    research: 31000,
    inference: 28000,
    platform: 19000,
  },
  {
    month: "Feb",
    ml: 41000,
    research: 30000,
    inference: 29000,
    platform: 18000,
  },
  {
    month: "Mar",
    ml: 43000,
    research: 32000,
    inference: 30000,
    platform: 20000,
  },
  {
    month: "Apr",
    ml: 42000,
    research: 31000,
    inference: 29500,
    platform: 19500,
  },
  {
    month: "May",
    ml: 43000,
    research: 31500,
    inference: 30500,
    platform: 20000,
  },
  {
    month: "Jun",
    ml: 44000,
    research: 34000,
    inference: 32000,
    platform: 22000,
  },
];

const governanceData = [
  {
    team: "ML Eng",
    compliant: 98,
    breach: 4,
  },
  {
    team: "Research",
    compliant: 88,
    breach: 30,
  },
  {
    team: "Inference",
    compliant: 93,
    breach: 5,
  },
  {
    team: "Platform",
    compliant: 100,
    breach: 0,
  },
  {
    team: "DevOps",
    compliant: 87,
    breach: 10,
  },
];
const EnterpriseView = () => {
  return (
    <div className="mt-4">

      {/* ================= KPI CARDS ================= */}
      <div className="flex gap-3">

        {enterpriseCards.map((card, index) => (
          <div
            key={index}
            className="
              w-[184px]
              h-[88px]

              rounded-[14px]

              bg-[#131814]

              border
              border-[#77B900]/70

              shadow-[0px_4px_4px_rgba(119,185,0,0.30)]

              flex
              flex-col
              items-center
              justify-center

              transition-all
              duration-300

              hover:shadow-[0px_0px_14px_rgba(119,185,0,0.45)]
            "
          >
            {/* TITLE */}
            <p className="text-[10px] text-[#F1F1F1] leading-none">
              {card.title}
            </p>

            {/* VALUE */}
            <h3 className="text-[19px] font-semibold text-[#77B900] mt-[8px] leading-none">
              {card.value}
            </h3>

            {/* SUBTITLE */}
            <p className="text-[10px] text-[#D4D4D4] mt-[10px] leading-none">
              {card.subtitle}
            </p>
          </div>
        ))}

      </div>
      {/* ================= COMMAND CENTER ================= */}
<div className="mt-5">

  {/* TITLE */}
  <h2 className="text-[14px] text-[#F2F2F2] mb-3">
    Enterprise command center
  </h2>

  {/* ALERTS */}
  <div className="flex flex-col gap-[8px]">

    {enterpriseAlerts.map((alert, index) => (
      <div
        key={index}
        className="
          h-[44px]

          bg-[#131814]

          border
          border-[#77B900]/55

          px-[16px]

          flex
          items-center
          justify-between
        "
      >
        {/* LEFT */}
        <div className="flex flex-col justify-center">

          {/* TITLE + BADGE */}
          <div className="flex items-center gap-[6px]">

            <h3 className="text-[10px] text-[#F1F1F1] leading-none">
              {alert.title}
            </h3>

            {/* BADGE */}
            <div
              className="
                h-[15px]
                px-[10px]

                rounded-[20px]

                bg-[#77B900]/30

                flex
                items-center
                justify-center
              "
            >
              <span className="text-[9px] text-[#F4F4F4] leading-none">
                {alert.badge}
              </span>
            </div>

          </div>

          {/* DESCRIPTION */}
          <p className="text-[10px] text-[#D0D0D0] mt-[4px] leading-none">
            {alert.desc}
          </p>

        </div>

        {/* RIGHT VALUE */}
        <div className="text-[10px] text-[#F3F3F3] whitespace-nowrap">
          {alert.amount}
        </div>

      </div>
    ))}

  </div>
  {/* ================= ENTERPRISE CHARTS ================= */}
<div className="grid grid-cols-2 gap-5 mt-5">

  {/* ================= LEFT CHART ================= */}
  {/* ================= LEFT CHART ================= */}
<div
  className="
    h-[215px]

    rounded-[20px]

    bg-[#131814]

    border
    border-[#77B900]/70

    px-[16px]
    pt-[12px]
  "
>
  {/* TITLE */}
  <h3 className="text-[11px] text-[#F2F2F2]">
    Spend by team / cost center ($K)
  </h3>

  {/* LEGENDS */}
  <div className="flex items-center gap-4 mt-[6px] ml-[2px]">

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#77B900]" />
      <span className="text-[9px] text-[#D8D8D8]">
        MLEng
      </span>
    </div>

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#416600]" />
      <span className="text-[9px] text-[#D8D8D8]">
        Research
      </span>
    </div>

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#182500]" />
      <span className="text-[9px] text-[#D8D8D8]">
        Inference
      </span>
    </div>

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#283E00]" />
      <span className="text-[9px] text-[#D8D8D8]">
        Platform
      </span>
    </div>

  </div>

  {/* CHART */}
  <div className="w-full h-[150px] mt-[8px]">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart
        data={[
          {
            month: "Jan",
            ml: 56000,
            research: 40000,
            inference: 28000,
            platform: 16000,
          },
          {
            month: "Feb",
            ml: 62000,
            research: 38000,
            inference: 30000,
            platform: 10000,
          },
          {
            month: "Mar",
            ml: 56000,
            research: 52000,
            inference: 42000,
            platform: 15000,
          },
          {
            month: "Apr",
            ml: 56000,
            research: 50000,
            inference: 43000,
            platform: 15000,
          },
          {
            month: "May",
            ml: 56000,
            research: 52000,
            inference: 44000,
            platform: 17000,
          },
          {
            month: "Jun",
            ml: 56000,
            research: 60000,
            inference: 50000,
            platform: 22000,
          },
        ]}
        margin={{
          top: 5,
          right: 0,
          left: -25,
          bottom: -10,
        }}
        barGap={0}
        barCategoryGap={18}
      >

        {/* GRID */}
        <CartesianGrid
          vertical={false}
          horizontal={false}
        />

        {/* X AXIS */}
        <XAxis
          dataKey="month"
          tick={{
            fill: "#6F6F6F",
            fontSize: 9,
          }}
          tickLine={false}
          axisLine={{
            stroke: "#707070",
          }}
        />

        {/* Y AXIS */}
        <YAxis
          domain={[0, 160000]}
          ticks={[0, 40000, 80000, 120000, 160000]}
          tickFormatter={(v) => `$${v / 1000}K`}
          tick={{
            fill: "#6F6F6F",
            fontSize: 8,
          }}
          tickLine={false}
          axisLine={{
            stroke: "#707070",
          }}
        />

        {/* STACKED BARS */}
        <Bar
          dataKey="ml"
          stackId="a"
          fill="#77B900"
          barSize={48}
        />

        <Bar
          dataKey="research"
          stackId="a"
          fill="#416600"
          barSize={48}
        />

        <Bar
          dataKey="inference"
          stackId="a"
          fill="#182500"
          barSize={48}
        />

        <Bar
          dataKey="platform"
          stackId="a"
          fill="#283E00"
          barSize={48}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>
</div>

  {/* ================= RIGHT CHART ================= */}
   {/* ================= RIGHT CHART ================= */}
<div
  className="
    h-[215px]

    rounded-[20px]

    bg-[#131814]

    border
    border-[#77B900]/70

    px-[18px]
    pt-[14px]
  "
>
  {/* TITLE */}
  <h3 className="text-[11px] text-[#F5F5F5] leading-none">
    Governance compliance by team (%)
  </h3>

  {/* LEGENDS */}
  <div className="flex items-center gap-[18px] mt-[10px]">

    {/* COMPLIANT */}
    <div className="flex items-center gap-[6px]">
      <div className="w-[9px] h-[9px] bg-[#77B900]" />
      <span className="text-[9px] text-[#E4E4E4]">
        Compliant
      </span>
    </div>

    {/* BREACH */}
    <div className="flex items-center gap-[6px]">
      <div className="w-[9px] h-[9px] bg-[#416600]" />
      <span className="text-[9px] text-[#E4E4E4]">
        Breach
      </span>
    </div>

  </div>

  {/* CHART */}
  <div className="w-full h-[150px] mt-[8px]">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart
        layout="vertical"
        data={[
          {
            team: "ML Eng",
            compliant: 98,
            breach: 4,
          },
          {
            team: "Research",
            compliant: 88,
            breach: 28,
          },
          {
            team: "Inference",
            compliant: 93,
            breach: 6,
          },
          {
            team: "Platform",
            compliant: 100,
            breach: 0,
          },
          {
            team: "DevOps",
            compliant: 87,
            breach: 12,
          },
        ]}
        margin={{
          top: 2,
          right: 5,
          left: 0,
          bottom: -6,
        }}
        barCategoryGap={8}
      >

        {/* X AXIS */}
        <XAxis
          type="number"
          domain={[0, 100]}
          ticks={[0,10,20,30,40,50,60,70,80,90,100]}
          tickFormatter={(value) => `${value}%`}
          tick={{
            fill: "#5E5E5E",
            fontSize: 8,
          }}
          tickLine={false}
          axisLine={{
            stroke: "#626262",
            strokeWidth: 1,
          }}
        />

        {/* Y AXIS */}
        <YAxis
          type="category"
          dataKey="team"
          width={82}
          tick={{
            fill: "#6D6D6D",
            fontSize: 9,
          }}
          tickLine={false}
          axisLine={{
            stroke: "#626262",
            strokeWidth: 1,
          }}
        />

        {/* COMPLIANT */}
        <Bar
  dataKey="compliant"
  fill="#77B900"
  radius={[0, 0, 0, 0]}
  barSize={14}
/>

<Bar
  dataKey="breach"
  fill="#416600"
  radius={[0, 0, 0, 0]}
  barSize={14}
/>

      </BarChart>

    </ResponsiveContainer>

  </div>
</div>
  

</div>
</div>

    </div>
  );
};

export default EnterpriseView;