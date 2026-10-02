import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const platformLayers = [
  {
    title: "Startup adaptive layer — simplicity first",

    sections: [
      {
        heading: "KPIs surfaced",

        items: [
          "Monthly spend total",
          "Waste % of spend",
          "Savings achieved",
          "GPU utilization",
        ],
      },

      {
        heading: "Auto-actions enabled",

        items: [
          "Idle GPU shutdown",
          "Spot job scheduling",
          "Pod rightsizing",
          "Budget email alert",
        ],
      },

      {
        heading: "UX principles",

        items: [
          "3-click max to action",
          "Plain English alerts",
          "No tagging required",
          "Setup under 1 hour",
        ],
      },
    ],
  },

  {
    title: "Enterprise adaptive layer — governance and scale",

    sections: [
      {
        heading: "KPIs surfaced",

        items: [
          "Cost by team / BU",
          "Chargeback accuracy",
          "Policy compliance %",
          "RI utilization rate",
        ],
      },

      {
        heading: "Auto-actions enabled",

        items: [
          "Policy enforcement",
          "RI rebalancing",
          "Anomaly escalation",
          "Multi-cloud arbitrage",
        ],
      },

      {
        heading: "UX principles",

        items: [
          "Role-based views",
          "Approval workflows",
          "Executive summary mode",
          "Audit trail on all actions",
        ],
      },
    ],
  },

  {
    title: "Data center adaptive layer — infrastructure depth",

    sections: [
      {
        heading: "KPIs surfaced",

        items: [
          "PUE per site",
          "Rack utilization %",
          "Power cost per kWh",
          "Carbon tCO₂e/mo",
        ],
      },

      {
        heading: "Auto-actions enabled",

        items: [
          "Rack consolidation",
          "Cooling anomaly alert",
          "Renewable scheduling",
          "Depreciation modelling",
        ],
      },

      {
        heading: "UX principles",

        items: [
          "DCIM data integration",
          "Site-level drill-down",
          "ESG export reports",
          "Multi-site comparison",
        ],
      },
    ],
  },
];
const leftGraphData = [
  {
    label: "First insight",
    startup: 2,
    enterprise: 4,
    datacenter: 6,
  },

  {
    label: "First\nSaving",
    startup: 3,
    enterprise: 10,
    datacenter: 14,
  },

  {
    label: "Full\ndeployment",
    startup: 5,
    enterprise: 22,
    datacenter: 36,
  },

  {
    label: "Self-\noptimizing",
    startup: 18,
    enterprise: 58,
    datacenter: 85,
  },
];

const rightGraphData = [
  {
    name: "Startup",
    feature: 42,
    simplicity: 95,
  },

  {
    name: "Enterprise",
    feature: 75,
    simplicity: 68,
  },

  {
    name: "Data Center",
    feature: 95,
    simplicity: 50,
  },
];
export default function PlatformStrategyView() {
  return (
    <div className="w-full mt-[6px]">

      {/* PAGE TITLE */}

      <h1 className="text-[15px] font-semibold text-white leading-none">
        Platform strategy dashboard
      </h1>

      {/* SUBTITLE */}

      <p className="text-[11px] text-[#B8B8B8] mt-[4px]">
        How the platform adapts its intelligence layer per persona — same core engine, different surface
      </p>

      {/* SECTION TITLE */}

      <h2 className="text-[13px] text-white mt-[14px] mb-[10px]">
        Adaptive intelligence architecture
      </h2>

      {/* MAIN LAYERS */}

      <div className="flex flex-col gap-[18px]">

        {platformLayers.map((layer, index) => (

          <div
            key={index}
            className="
              relative
              rounded-[22px]
              border
              border-[#6FA500]
              bg-[#071007]
              px-[16px]
              py-[12px]
              overflow-hidden
              shadow-[0_0_18px_rgba(119,185,0,0.10)]
            "
          >

            {/* INNER GLOW */}

            <div
              className="
                absolute
                inset-0
                rounded-[22px]
                bg-gradient-to-r
                from-[#77B900]/[0.04]
                via-transparent
                to-transparent
                pointer-events-none
              "
            />

            <div className="relative z-10">

              {/* LAYER TITLE */}

              <h3 className="text-[12px] text-white font-medium mb-[10px]">
                {layer.title}
              </h3>

              {/* GRID */}

              <div className="grid grid-cols-3 gap-[14px]">

                {layer.sections.map((section, sectionIndex) => (

                  <div
                    key={sectionIndex}
                    className="
                      rounded-[8px]
                      bg-black
                      border
                      border-[#161616]
                      px-[14px]
                      py-[10px]
                      min-h-[96px]
                    "
                  >

                    {/* HEADING */}

                    <h4 className="text-[11px] text-white font-semibold mb-[8px]">
                      {section.heading}
                    </h4>

                    {/* ITEMS */}

                    <ul className="space-y-[2px]">

                      {section.items.map((item, itemIndex) => (

                        <li
                          key={itemIndex}
                          className="
                            text-[10px]
                            text-[#F1F1F1]
                            leading-[14px]
                            flex
                            items-start
                            gap-[6px]
                          "
                        >

                          <span className="text-[#A3E635] mt-[1px]">
                            •
                          </span>

                          <span>{item}</span>

                        </li>

                      ))}

                    </ul>

                  </div>

                ))}

              </div>

            </div>

          </div>

        ))}

      </div>
      {/* PLATFORM STRATEGY METRICS */}

<div className="mt-[16px]">

  {/* TITLE */}

  <h3 className="text-[12px] text-[#F1F1F1] mb-[10px]">
    Platform strategy metrics
  </h3>

  {/* GRID */}

  <div className="grid grid-cols-2 gap-[22px]">

    {/* LEFT GRAPH */}

    <div
      className="
        relative
        rounded-[22px]
        border
        border-[#6FA500]
        bg-[#060B06]
        h-[242px]
        px-[16px]
        pt-[12px]
        pb-[10px]
        overflow-hidden
        shadow-[0_0_16px_rgba(119,185,0,0.08)]
      "
    >

      {/* INNER GLOW */}

      <div
        className="
          absolute
          inset-0
          rounded-[22px]
          bg-gradient-to-br
          from-[#77B900]/[0.02]
          via-transparent
          to-transparent
        "
      />

      <div className="relative z-10">

        {/* TITLE */}

        <h2 className="text-[11px] text-[#F5F5F5]">
          Time-to-value by persona (days)
        </h2>

        {/* LEGEND */}

        <div className="flex items-center gap-[10px] mt-[5px]">

          <div className="flex items-center gap-[4px]">

            <div className="w-[9px] h-[9px] bg-[#4F7300]" />

            <span className="text-[10px] text-[#ECECEC]">
              Startup
            </span>

          </div>

          <div className="flex items-center gap-[4px]">

            <div className="w-[9px] h-[9px] bg-[#8FD400]" />

            <span className="text-[10px] text-[#ECECEC]">
              Enterprise
            </span>

          </div>

          <div className="flex items-center gap-[4px]">

            <div className="w-[9px] h-[9px] bg-[#355000]" />

            <span className="text-[10px] text-[#ECECEC]">
              Data Center
            </span>

          </div>

        </div>

        {/* CHART */}

        <div className="w-full h-[172px] mt-[2px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={leftGraphData}
              margin={{
                top: 8,
                right: 0,
                left: -28,
                bottom: 0,
              }}
              barGap={2}
              barCategoryGap="28%"
            >

              <XAxis
                dataKey="label"
                tick={{
                  fill: "#62676C",
                  fontSize: 9,
                }}
                tickLine={false}
                axisLine={{
                  stroke: "#43484B",
                }}
                interval={0}
              />

              <YAxis
                ticks={[0, 20, 40, 60, 80]}
                tickFormatter={(v) => `${v}d`}
                tick={{
                  fill: "#62676C",
                  fontSize: 9,
                }}
                tickLine={false}
                axisLine={{
                  stroke: "#43484B",
                }}
              />

              <Bar
                dataKey="startup"
                fill="#4F7300"
                barSize={18}
                radius={[0, 0, 0, 0]}
              />

              <Bar
                dataKey="enterprise"
                fill="#8FD400"
                barSize={18}
                radius={[0, 0, 0, 0]}
              />

              <Bar
                dataKey="datacenter"
                fill="#355000"
                barSize={18}
                radius={[0, 0, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

    {/* RIGHT GRAPH */}

    <div
      className="
        relative
        rounded-[22px]
        border
        border-[#6FA500]
        bg-[#060B06]
        h-[242px]
        px-[16px]
        pt-[12px]
        pb-[10px]
        overflow-hidden
        shadow-[0_0_16px_rgba(119,185,0,0.08)]
      "
    >

      {/* INNER GLOW */}

      <div
        className="
          absolute
          inset-0
          rounded-[22px]
          bg-gradient-to-br
          from-[#77B900]/[0.02]
          via-transparent
          to-transparent
        "
      />

      <div className="relative z-10">

        {/* TITLE */}

        <h2 className="text-[11px] text-[#F5F5F5]">
          Platform feature depth vs simplicity score
        </h2>

        {/* LEGEND */}

        <div className="flex items-center gap-[10px] mt-[5px]">

          <div className="flex items-center gap-[4px]">

            <div className="w-[9px] h-[9px] bg-[#557A00]" />

            <span className="text-[10px] text-[#ECECEC]">
              Feature depth
            </span>

          </div>

          <div className="flex items-center gap-[4px]">

            <div className="w-[9px] h-[9px] bg-[#8FD400]" />

            <span className="text-[10px] text-[#ECECEC]">
              Simplicity score
            </span>

          </div>

        </div>

        {/* CHART */}

        <div className="w-full h-[172px] mt-[2px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={rightGraphData}
              margin={{
                top: 8,
                right: 0,
                left: -20,
                bottom: 0,
              }}
              barGap={2}
              barCategoryGap="24%"
            >

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#62676C",
                  fontSize: 9,
                }}
                tickLine={false}
                axisLine={{
                  stroke: "#43484B",
                }}
              />

              <YAxis
                ticks={[0, 20, 40, 60, 80, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{
                  fill: "#62676C",
                  fontSize: 9,
                }}
                tickLine={false}
                axisLine={{
                  stroke: "#43484B",
                }}
              />

              <Bar
                dataKey="feature"
                fill="#557A00"
                barSize={28}
                radius={[0, 0, 0, 0]}
              />

              <Bar
                dataKey="simplicity"
                fill="#8FD400"
                barSize={28}
                radius={[0, 0, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  </div>

</div>

    </div>
  );
}