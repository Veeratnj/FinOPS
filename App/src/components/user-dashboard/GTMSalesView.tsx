import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import React from "react";

const buyerProfiles = [
  {
    title: "Startup",
    value: "$34K",

    items: [
      "Avg annual contract value",
      "Buyer: CTO / Founding engineer",
      "Pain: Surprise GPU bills eating runway",
      "Win trigger: Free trial ROI in 48h",
      "Avg sales cycle: 8 days",
      "Deal risk: Budget constraint",
    ],
  },

  {
    title: "Enterprise",
    value: "$280K",

    items: [
      "Avg annual contract value",
      "Pain: No visibility across 20+ AI teams",
      "Win trigger: Compliance + chargeback demo",
      "Avg sales cycle: 74 days",
      "Deal risk: Security review delay",
    ],
  },

  {
    title: "Data center",
    value: "$620K",

    items: [
      "Avg annual contract value",
      "Buyer: DC Ops Lead / CIO",
      "Pain: Hidden on-prem TCO, PUE waste",
      "Win trigger: Live TCO audit on their data",
      "Avg sales cycle: 140 days",
      "Deal risk: DCIM integration complexity",
    ],
  },
];
const funnelSections = [
  {
    title: "Sales funnel by persona",

    items: [
      {
        label: "Trial signups",
        value: "1,240",
        width: "100%",
        color: "rgba(119,185,0,0.25)",
      },

      {
        label: "Activated (48h ROI)",
        value: "892",
        width: "72%",
        color: "rgba(119,185,0,0.40)",
      },

      {
        label: "Converted to paid",
        value: "471",
        width: "41%",
        color: "rgba(119,185,0,0.60)",
      },

      {
        label: "Expanded (6mo)",
        value: "273",
        width: "27%",
        color: "#77B900",
      },
    ],
  },

  {
    title: "Enterprise funnel",

    items: [
      {
        label: "MQL generated",
        value: "284",
        width: "100%",
        color: "rgba(119,185,0,0.25)",
      },

      {
        label: "Demo completed",
        value: "173",
        width: "67%",
        color: "rgba(119,185,0,0.40)",
      },

      {
        label: "POC started",
        value: "80",
        width: "39%",
        color: "rgba(119,185,0,0.60)",
      },

      {
        label: "Contract signed",
        value: "40",
        width: "19%",
        color: "#77B900",
      },
    ],
  },

  {
    title: "Data center funnel",

    items: [
      {
        label: "Outbound targeted",
        value: "88",
        width: "100%",
        color: "rgba(119,185,0,0.25)",
      },

      {
        label: "Discovery call",
        value: "46",
        width: "60%",
        color: "rgba(119,185,0,0.40)",
      },

      {
        label: "TCO audit delivered",
        value: "25",
        width: "39%",
        color: "rgba(119,185,0,0.60)",
      },

      {
        label: "Enterprise deal closed",
        value: "11",
        width: "18%",
        color: "#77B900",
      },
    ],
  },
];
const arrData = [
  {
    month: "Jan",
    startup: 2,
    enterprise: 2,
    datacenter: 1,
  },

  {
    month: "Feb",
    startup: 2,
    enterprise: 3,
    datacenter: 2,
  },

  {
    month: "Mar",
    startup: 3,
    enterprise: 4,
    datacenter: 2,
  },

  {
    month: "Apr",
    startup: 4,
    enterprise: 5,
    datacenter: 3,
  },

  {
    month: "May",
    startup: 4,
    enterprise: 6,
    datacenter: 4,
  },

  {
    month: "Jun",
    startup: 5,
    enterprise: 7,
    datacenter: 5,
  },
];

const winRateData = [
  {
    month: "Jan",
    startup: 10,
    enterprise: 22,
    datacenter: 40,
  },

  {
    month: "Feb",
    startup: 11,
    enterprise: 23,
    datacenter: 41,
  },

  {
    month: "Mar",
    startup: 12,
    enterprise: 26,
    datacenter: 42,
  },

  {
    month: "Apr",
    startup: 14,
    enterprise: 28,
    datacenter: 43,
  },

  {
    month: "May",
    startup: 15,
    enterprise: 30,
    datacenter: 44,
  },

  {
    month: "Jun",
    startup: 18,
    enterprise: 33,
    datacenter: 46,
  },
];

export default function GTMSalesView() {
  return (
    <div className="w-full mt-[6px]">

      {/* TITLE */}

      <h1 className="text-[15px] font-semibold text-white leading-none">
        GTM / Sales dashboard
      </h1>

      {/* SUBTITLE */}

      <p className="text-[11px] text-[#B8B8B8] mt-[4px]">
        Buyer persona intelligence — deal signals, objection handling, and pipeline metrics per segment
      </p>

      {/* SECTION TITLE */}

      <h2 className="text-[13px] text-white mt-[14px] mb-[10px]">
        Buyer persona profiles
      </h2>

      {/* PROFILE GRID */}

      <div className="grid grid-cols-3 gap-[28px]">

        {buyerProfiles.map((profile, index) => (

          <div
            key={index}
            className="
              relative
              rounded-[18px]
              border
              border-[#6FA500]
              bg-[#131814]
              min-h-[160px]
              px-[18px]
              py-[12px]
              overflow-hidden
              shadow-[0_0_16px_rgba(119,185,0,0.08)]
            "
          >

            {/* INNER GLOW */}

            <div
              className="
                absolute
                inset-0
                rounded-[18px]
                bg-gradient-to-br
                from-[#77B900]/[0.03]
                via-transparent
                to-transparent
                pointer-events-none
              "
            />

            <div className="relative z-10">

              {/* TITLE */}

              <h3 className="text-[13px] text-white font-medium">
                {profile.title}
              </h3>

              {/* VALUE */}

              <p className="text-[18px] text-[#F1F1F1] mt-[4px] leading-none">
                {profile.value}
              </p>

              {/* CONTENT */}

              <div className="mt-[12px] space-y-[10px]">

                {profile.items.map((item, itemIndex) => (

                  <p
                    key={itemIndex}
                    className="
                      text-[11px]
                      text-[#E5E5E5]
                      leading-[15px]
                    "
                  >
                    {item}
                  </p>

                ))}

              </div>

            </div>

          </div>

        ))}

      </div>
      {/* FUNNEL SECTIONS */}

<div className="mt-[14px]">

  {funnelSections.map((section, sectionIndex) => (

    <div
      key={sectionIndex}
      className="mb-[6px]"
    >

      {/* SECTION TITLE */}

      <h3 className="text-[11px] text-white mb-[3px]">
        {section.title}
      </h3>

      {/* ROWS */}

      <div className="w-full">

        {section.items.map((item, index) => (

          <div
            key={index}
            className="
              flex
              items-center

              h-[29px]

              border-b
              border-[#77B90055]

              bg-[#131814]
            "
          >

            {/* LABEL */}

            <div className="w-[148px] pl-[18px]">

              <span className="text-[9px] text-[#ECECEC]">
                {item.label}
              </span>

            </div>

            {/* BAR AREA */}

            <div className="flex-1 pr-[12px]">

              <div className="flex items-center gap-[10px]">

                {/* BAR */}

                <div className="flex-1">

                  <div
                    className="
                      h-[10px]
                      transition-all
                      duration-500
                    "
                    style={{
                      width: item.width,
                      background: item.color,
                    }}
                  />

                </div>

                {/* VALUE */}

                <span
                  className="
                    text-[9px]
                    text-[#ECECEC]
                    w-[32px]
                    text-right
                  "
                >
                  {item.value}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  ))}

</div>
{/* GTM PERFORMANCE METRICS */}

<div className="mt-[10px]">

  {/* TITLE */}

  <h2 className="text-[12px] text-white mb-[8px]">
    GTM performance metrics
  </h2>

  {/* GRID */}

  <div className="grid grid-cols-2 gap-[20px]">

    {/* LEFT GRAPH */}

    <div
      className="
        relative
        rounded-[18px]
        border
        border-[#77B900B3]
        bg-[#131814]
        h-[235px]
        px-[14px]
        pt-[10px]
        pb-[10px]
        overflow-hidden
      "
    >

      {/* INNER GLOW */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,rgba(119,185,0,0.08),transparent_45%)]
        "
      />

      <div className="relative z-10">

        {/* TITLE */}

        <h3 className="text-[11px] text-[#ECECEC]">
          ARR by persona segment ($M)
        </h3>

        {/* LEGEND */}

        <div className="flex items-center gap-[8px] mt-[4px]">

          <div className="flex items-center gap-[3px]">
            <div className="w-[9px] h-[9px] bg-[#77B900]" />
            <span className="text-[9px] text-[#ECECEC]">
              Startup
            </span>
          </div>

          <div className="flex items-center gap-[3px]">
            <div className="w-[9px] h-[9px] bg-[#416600]" />
            <span className="text-[9px] text-[#ECECEC]">
              Enterprise
            </span>
          </div>

          <div className="flex items-center gap-[3px]">
            <div className="w-[9px] h-[9px] bg-[#283E00]" />
            <span className="text-[9px] text-[#ECECEC]">
              Data Center
            </span>
          </div>

        </div>

        {/* CHART */}

        <div className="w-full h-[165px] mt-[2px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={arrData}
              margin={{
                top: 8,
                right: 0,
                left: -22,
                bottom: 0,
              }}
              barCategoryGap="8%"
            >

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#6E7478",
                  fontSize: 9,
                }}
                tickLine={false}
                axisLine={{
                  stroke: "#43484B",
                }}
              />

              <YAxis
                ticks={[0, 4, 8, 12, 16]}
                tickFormatter={(v) => `$${v}M`}
                tick={{
                  fill: "#6E7478",
                  fontSize: 9,
                }}
                tickLine={false}
                axisLine={{
                  stroke: "#43484B",
                }}
              />

              <Bar
                dataKey="startup"
                stackId="a"
                fill="#77B900"
                barSize={48}
              />

              <Bar
                dataKey="enterprise"
                stackId="a"
                fill="#416600"
                barSize={48}
              />

              <Bar
                dataKey="datacenter"
                stackId="a"
                fill="#283E00"
                barSize={48}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

    {/* RIGHT GRAPH */}

   
    {/* RIGHT GRAPH */}

<div
  className="
    relative
    rounded-[18px]
    border
    border-[#77B900B3]
    bg-[#131814]
    h-[235px]
    px-[14px]
    pt-[10px]
    pb-[10px]
    overflow-hidden
  "
>

  {/* INNER GLOW */}

  <div
    className="
      absolute
      inset-0
      bg-[radial-gradient(circle_at_top_left,rgba(119,185,0,0.08),transparent_45%)]
    "
  />

  <div className="relative z-10">

    {/* TITLE */}

    <h3 className="text-[11px] text-[#ECECEC]">
      Win rate by persona (%)
    </h3>

    {/* LEGENDS */}

    <div className="flex items-center gap-[8px] mt-[4px]">

      <div className="flex items-center gap-[3px]">
        <div className="w-[9px] h-[9px] bg-[#6E9E00]" />
        <span className="text-[9px] text-[#ECECEC]">
          Startup
        </span>
      </div>

      <div className="flex items-center gap-[3px]">
        <div className="w-[9px] h-[9px] bg-[#9BE000]" />
        <span className="text-[9px] text-[#ECECEC]">
          Enterprise
        </span>
      </div>

      <div className="flex items-center gap-[3px]">
        <div className="w-[9px] h-[9px] bg-[#5C8700]" />
        <span className="text-[9px] text-[#ECECEC]">
          Data Center
        </span>
      </div>

    </div>

    {/* CHART */}

    <div className="w-full h-[170px] mt-[2px]">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart
          data={winRateData}
          margin={{
            top: 8,
            right: 0,
            left: -22,
            bottom: 0,
          }}
        >

          {/* X AXIS */}

          <XAxis
            dataKey="month"
            tick={{
              fill: "#6B7175",
              fontSize: 9,
            }}
            tickLine={false}
            axisLine={{
              stroke: "#43484B",
            }}
          />

          {/* Y AXIS */}

          <YAxis
            ticks={[0, 10, 20, 30, 40, 50]}
            tickFormatter={(v) => `${v}%`}
            tick={{
              fill: "#6B7175",
              fontSize: 9,
            }}
            tickLine={false}
            axisLine={{
              stroke: "#43484B",
            }}
          />

          {/* TOP DOTTED */}

          <Line
            type="monotone"
            dataKey="datacenter"
            stroke="#5C8700"
            strokeWidth={0.9}
            strokeDasharray="3 4"
            dot={{
              r: 1.8,
              fill: "#5C8700",
              strokeWidth: 0,
            }}
            activeDot={false}
          />

          {/* MIDDLE SOLID */}

          <Line
            type="monotone"
            dataKey="enterprise"
            stroke="#9BE000"
            strokeWidth={1.5}
            dot={{
              r: 2.2,
              fill: "#9BE000",
              strokeWidth: 0,
            }}
            activeDot={false}
          />

          {/* BOTTOM DOTTED */}

          <Line
            type="monotone"
            dataKey="startup"
            stroke="#6E9E00"
            strokeWidth={0.9}
            strokeDasharray="3 4"
            dot={{
              r: 1.8,
              fill: "#6E9E00",
              strokeWidth: 0,
            }}
            activeDot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  </div>

</div>

  </div>

</div>

    </div>
  );
}