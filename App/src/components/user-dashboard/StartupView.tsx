import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const statCards = [
  {
    title: "Monthly AI spend",
    value: "$14,200",
    subtitle: "+12% vs last month",
  },
  {
    title: "Waste detected",
    value: "$3,840",
    subtitle: "27% of total spend",
  },
  {
    title: "GPU utilization",
    value: "61%",
    subtitle: "Target: 80%",
  },
  {
    title: "Savings this month",
    value: "$1,920",
    subtitle: "Auto-optimize",
  },
];
const actions = [
  {
    title: "Idle GPU detected — ml-dev namespace",
    desc: "3 GPUs idle for 14h · Auto-shutdown available · Est. saving $420/mo",
    tag: "Critical",
    save: "Save $420",
  },
  {
    title: "Switch inference to spot instances",
    desc: "Inference workload suitable for spot · 68% cost reduction",
    tag: "Recommended",
    save: "Save $680",
  },
  {
    title: "Rightsize over-provisioned training pod",
    desc: "Pod using 34% of requested memory · Downsize request safely",
    tag: "Suggested",
    save: "Save $210",
  },
];
const spendData = [
  { month: "Jan", spend: 7800, savings: 200 },
  { month: "Feb", spend: 8600, savings: 350 },
  { month: "Mar", spend: 10200, savings: 900 },
  { month: "Apr", spend: 11800, savings: 1200 },
  { month: "May", spend: 12700, savings: 1700 },
  { month: "Jun", spend: 13800, savings: 1900 },
];

const donutData = [
  { name: "Over-prov 34%", value: 34, color: "#77B900" },
  { name: "Idle 46%", value: 46, color: "#416600" },
  { name: "Orphan 20%", value: 20, color: "#1B2A00" },
];
const StartupView = () => {
  return (
    <div className="mt-4">
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="
              w-[230px]
              h-[88px]

              rounded-[12px]

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
            <p className="text-[10px] text-[#EAEAEA] leading-none">
              {card.title}
            </p>

            {/* VALUE */}
            <h3 className="text-[20px] font-semibold text-[#77B900] mt-[8px] leading-none">
              {card.value}
            </h3>

            {/* SUBTITLE */}
            <p className="text-[10px] text-[#CFCFCF] mt-[9px] leading-none">
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>
      {/* ================= TOP ACTIONS ================= */}
<div className="mt-5">
  <h2 className="text-[18px] text-white font-medium mb-3">
    Top Actions — Startup Mode
  </h2>

  <div className="flex flex-col gap-[8px]">
    {actions.map((item, index) => (
      <div
        key={index}
        className="
          w-full
          h-[46px]

          bg-[#131814]

          border
          border-[#77B900]/45

          px-[24px]

          flex
          items-center
          justify-between
        "
      >
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-[8px]">
            <p className="text-[11px] text-[#F3F3F3] leading-none">
              {item.title}
            </p>

            {/* TAG */}
            <div
              className="
                h-[15px]
                px-[12px]

                rounded-[20px]

                bg-[#77B900]/30

                flex
                items-center
                justify-center
              "
            >
              <span className="text-[10px] text-[#EAEAEA] leading-none">
                {item.tag}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-[10px] text-[#D5D5D5] mt-[5px] leading-none">
            {item.desc}
          </p>
        </div>

        {/* SAVE */}
        <p className="text-[11px] text-[#F3F3F3]">
          {item.save}
        </p>
      </div>
    ))}
  </div>
  {/* ================= CHARTS ================= */}
<div className="grid grid-cols-2 gap-5 mt-5">

  {/* ================= LEFT GRAPH ================= */}
  <div
    className="
      h-[230px]
      rounded-[20px]
      bg-[#131814]
      border
      border-[#77B900]/70
      px-[18px]
      pt-[14px]
    "
  >
    {/* TITLE */}
    <h3 className="text-[13px] text-[#F5F5F5] mb-[8px]">
      Spend trend — last 6 months ($K)
    </h3>

    {/* LEGEND */}
    <div className="flex items-center gap-4 mb-[4px] ml-[6px]">
      <div className="flex items-center gap-[6px]">
        <div className="w-[10px] h-[10px] bg-[#77B900]" />
        <span className="text-[11px] text-[#EAEAEA]">
          Spend
        </span>
      </div>

      <div className="flex items-center gap-[6px]">
        <div className="w-[10px] h-[10px] bg-[#416600]" />
        <span className="text-[11px] text-[#EAEAEA]">
          Savings
        </span>
      </div>
    </div>

    {/* GRAPH */}
    <div className="w-full h-[155px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={spendData}
          margin={{
            top: 8,
            right: 12,
            left: -10,
            bottom: -5,
          }}
        >
          {/* AXIS */}
          <XAxis
            dataKey="month"
            axisLine={{
              stroke: "#6B6B6B",
              strokeWidth: 1,
            }}
            tickLine={false}
            tick={{
              fill: "#696969",
              fontSize: 11,
            }}
          />
           <YAxis
  domain={[0, 14000]}
  ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000]}
  tickFormatter={(v) => {
    if (v === 0) return "$0K";
    return `$${v / 1000}K`;
  }}
  axisLine={{
    stroke: "#6B6B6B",
    strokeWidth: 1,
  }}
  tickLine={false}
  tick={{
    fill: "#696969",
    fontSize: 11,
  }}
/>
          

          {/* SPEND */}
          <Line
            type="monotone"
            dataKey="spend"
            stroke="#77B900"
            strokeWidth={1.8}
            strokeDasharray="3 3"
            dot={{
              r: 2.2,
              fill: "#77B900",
              strokeWidth: 0,
            }}
            activeDot={false}
          />

          {/* SAVINGS */}
          <Line
            type="monotone"
            dataKey="savings"
            stroke="#416600"
            strokeWidth={1.6}
            dot={{
              r: 2,
              fill: "#416600",
              strokeWidth: 0,
            }}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* ================= DONUT ================= */}
  <div
    className="
      h-[230px]
      rounded-[20px]
      bg-[#131814]
      border
      border-[#77B900]/70

      px-[26px]
      pt-[18px]

      flex
      items-start
      justify-between
    "
  >
    {/* LEFT */}
    <div>
      <h3 className="text-[13px] text-[#F5F5F5] mb-[8px]">
        Waste breakdown
      </h3>

      <PieChart width={170} height={170}>
        <Pie
          data={donutData}
          dataKey="value"
          innerRadius={42}
          outerRadius={72}
          paddingAngle={0}
          stroke="none"
        >
          {donutData.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.color}
            />
          ))}
        </Pie>
      </PieChart>
    </div>

    {/* RIGHT LEGEND */}
    <div className="flex flex-col gap-5 mt-[58px] mr-[6px]">

      {donutData.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-5"
        >
          {/* LEFT */}
          <div className="flex items-center gap-[10px] min-w-[120px]">
            <div
              className="w-[9px] h-[9px] rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />

            <span className="text-[12px] text-[#8A8A8A] whitespace-nowrap">
              {item.name}
            </span>
          </div>

          {/* VALUE */}
          <span className="text-[12px] text-[#8A8A8A]">
            {item.value}%
          </span>
        </div>
      ))}
    </div>
  </div>
</div>
</div>
    </div>
  );
};

export default StartupView;