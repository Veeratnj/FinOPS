import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const requirementCards = [
  {
    title: "Startup requirements",
    items: [
      "Cost-per-GPU-hour visibility",
      "Idle resource auto-shutdown",
      "Spot instance blending",
      "Budget alert guardrails",
      "Simple onboarding — under 1 hour",
      "No tagging policy required",
      "Single-cloud support sufficient",
      "Monthly spend forecasting",
    ],
  },

  {
    title: "Enterprise requirements",
    items: [
      "Multi-team chargeback engine",
      "RBAC and SSO integration",
      "Multi-cloud cost consolidation",
      "Governance policy enforcement",
      "SOC 2 / ISO 27001 compliance",
      "Reserved instance tracking",
      "Executive cost reporting",
      "ERP and ITSM integration",
    ],
  },

  {
    title: "Data center requirements",
    items: [
      "DCIM integration for power data",
      "PUE-adjusted cost modelling",
      "Multi-rack cost attribution",
      "Carbon and ESG reporting",
      "Colocation fees allocation",
      "Hardware depreciation tracking",
      "Capacity planning forecasts",
      "Cooling anomaly detection",
    ],
  },
];
const featureCoverage = [
  {
    title: "Monitoring capabilities",
    items: [
      {
        label: "Real-time GPU utilization",
        tag: "All 3 personas",
      },
      {
        label: "Namespace cost attribution",
        tag: "3 personas",
      },
      {
        label: "Multi-site rack monitoring",
        tag: "Data Center",
      },
      {
        label: "Team-level spend alerts",
        tag: "Enterprise + DC",
      },
      {
        label: "PUE anomaly detection",
        tag: "Data Center",
      },
    ],
  },

  {
    title: "Optimization capabilities",
    items: [
      {
        label: "Real-time GPU utilization",
        tag: "All 3 personas",
      },
      {
        label: "Namespace cost attribution",
        tag: "Startup + Ent",
      },
      {
        label: "Multi-site rack monitoring",
        tag: "Enterprise + DC",
      },
      {
        label: "Team-level spend alerts",
        tag: "All 3 personas",
      },
      {
        label: "PUE anomaly detection",
        tag: "Data Center",
      },
    ],
  },

  {
    title: "Orchestration capabilities",
    items: [
      {
        label: "Multi-cloud arbitrage",
        tag: "Enterprise + DC",
      },
      {
        label: "Budget guardrail enforcement",
        tag: "All 3 personas",
      },
      {
        label: "Governance policy engine",
        tag: "Enterprise + DC",
      },
      {
        label: "Job scheduling by price window",
        tag: "All 3 personas",
      },
      {
        label: "Renewable energy scheduling",
        tag: "Data Center",
      },
    ],
  },

  {
    title: "Waste elimination capabilities",
    items: [
      {
        label: "Idle GPU auto-shutdown",
        tag: "All 3 personas",
      },
      {
        label: "Orphaned PVC cleanup",
        tag: "All 3 personas",
      },
      {
        label: "Duplicate charge detection",
        tag: "Enterprise + DC",
      },
      {
        label: "Stranded rack detection",
        tag: "Data Center",
      },
      {
        label: "Untagged spend recovery",
        tag: "Enterprise + DC",
      },
    ],
  },
];
const radarData = [
  {
    subject: "Monitoring",
    Startup: 75,
    Enterprise: 95,
    DataCentre: 85,
  },
  {
    subject: "Optimization",
    Startup: 68,
    Enterprise: 82,
    DataCentre: 78,
  },
  {
    subject: "Orchestration",
    Startup: 42,
    Enterprise: 88,
    DataCentre: 74,
  },
  {
    subject: "Waste elim",
    Startup: 84,
    Enterprise: 79,
    DataCentre: 91,
  },
  {
    subject: "Reporting",
    Startup: 58,
    Enterprise: 72,
    DataCentre: 86,
  },
];

const fulfillmentData = [
  {
    name: "Startup",
    fulfilled: 89,
    gap: 11,
  },
  {
    name: "Enterprise",
    fulfilled: 92,
    gap: 8,
  },
  {
    name: "Data center",
    fulfilled: 84,
    gap: 16,
  },
];

const BusinessRequirementsView = () => {
  return (
    <div className="mt-[18px]">

      {/* ================= TITLE ================= */}

      <h2 className="text-[14px] font-semibold text-white">
        Business requirements dashboard
      </h2>

      {/* SUBTITLE */}

      <p className="text-[10px] text-[#7B7B7B] mt-[3px]">
        Functional needs mapped to platform capabilities
        across all three user segments
      </p>

      {/* ================= SECTION ================= */}

      <div className="mt-[14px]">

        {/* SECTION TITLE */}

        <h3 className="text-[14px] text-white mb-[10px]">
          Requirements coverage by persona
        </h3>

        {/* CARDS */}

        <div className="grid grid-cols-3 gap-[16px]">

          {requirementCards.map((card, index) => (
            <div
              key={index}
              className="
                min-h-[238px]

                rounded-[12px]

                bg-[#131814]

                border
                border-[#77B900]/70

                px-[16px]
                pt-[14px]
                pb-[14px]
              "
            >

              {/* CARD TITLE */}

              <h4 className="text-[13px] text-white font-medium">
                {card.title}
              </h4>

              {/* LIST */}

              <ul className="mt-[10px] space-y-[9px]">

                {card.items.map((item, i) => (
                  <li
                    key={i}
                    className="
                      flex
                      items-start
                      gap-[6px]

                      text-[12px]
                      text-[#D7D7D7]

                      leading-[1.45]
                    "
                  >

                    {/* BULLET */}

                    <span className="mt-[0px] text-[#77B900]">
                      •
                    </span>

                    {/* TEXT */}

                    <span>{item}</span>

                  </li>
                ))}

              </ul>

            </div>
          ))}

        </div>
        {/* ================= FEATURE COVERAGE ================= */}

<div className="mt-[14px]">

  {/* TITLE */}

  <h3 className="text-[14px] text-white mb-[8px]">
    Feature coverage heatmap
  </h3>

  {/* GRID */}

  <div className="grid grid-cols-2 gap-[10px]">

    {featureCoverage.map((section, index) => (
      <div
        key={index}
        className="
          min-h-[128px]

          rounded-[14px]

          bg-[#131814]

          border
          border-[#77B900]/70

          px-[14px]
          pt-[10px]
          pb-[10px]
        "
      >

        {/* CARD TITLE */}

        <h4 className="text-[13px] text-white mb-[8px]">
          {section.title}
        </h4>

        {/* ROWS */}

        <div className="space-y-[5px]">

          {section.items.map((item, i) => (
            <div
              key={i}
              className="
                flex
                items-center
                justify-between
                gap-[8px]
              "
            >

              {/* LABEL */}

              <p className="text-[11px] text-[#E2E2E2] leading-[1.2]">
                {item.label}
              </p>

              {/* TAG */}

              <div
                className="
                  min-w-[104px]
                  h-[18px]

                  px-[8px]

                  rounded-full

                  bg-[#77B900]/25

                  flex
                  items-center
                  justify-center

                  whitespace-nowrap

                  shrink-0
                "
              >
                <span className="text-[11px] text-[#F3F3F3]">
                  {item.tag}
                </span>
              </div>

            </div>
          ))}

        </div>

      </div>
    ))}

  </div>

</div>
{/* ================= BUSINESS REQUIREMENT METRICS ================= */}

<div className="mt-[14px]">

  {/* TITLE */}

  <h3 className="text-[10px] text-white mb-[8px]">
    Business requirement metrics
  </h3>

  {/* GRID */}

  <div className="grid grid-cols-2 gap-[12px]">

    {/* ================= LEFT RADAR CHART ================= */}

    <div
  className="
    h-[240px]
    rounded-[16px]
    bg-[#0B0F0C]
    border
    border-[#77B900]/70
    px-[18px]
    pt-[12px]
    overflow-hidden
  "
>

  {/* ================= TITLE ================= */}

  <h4 className="text-[10px] text-white">
    Feature adoption by Persona (%)
  </h4>

  {/* ================= LEGENDS ================= */}

  <div className="flex items-center gap-[10px] mt-[6px]">

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#8EDB00]" />
      <span className="text-[8px] text-white">
        Startup
      </span>
    </div>

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#7D9E49]" />
      <span className="text-[8px] text-white">
        Enterprise
      </span>
    </div>

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#B7D97B]" />
      <span className="text-[8px] text-white">
        Data Centre
      </span>
    </div>

  </div>

  {/* ================= CHART ================= */}

  <div className="w-full h-[182px] mt-[2px]">

    <ResponsiveContainer width="100%" height="100%">

      <RadarChart
        data={radarData}
        outerRadius="78%"
      >

        {/* GRID */}

        <PolarGrid
          stroke="#4E544E"
          strokeWidth={1.2}
          radialLines={true}
        />

        {/* LABELS */}

        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fill: "#8A8A8A",
            fontSize: 10,
          }}
        />

        {/* VALUES */}

        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{
            fill: "#8C8C8C",
            fontSize: 8,
          }}
          axisLine={false}
        />

        {/* ================= STARTUP ================= */}

        <Radar
          name="Startup"
          dataKey="Startup"

          stroke="#77B900"

          fill="#77B900"
          fillOpacity={0.10}

          strokeWidth={3}

          dot={{
            r: 2,
            fill: "#77B900",
            stroke: "rgba(65,102,0,0.37)",
            strokeWidth: 3,
          }}
        />

        {/* ================= ENTERPRISE ================= */}

        <Radar
          name="Enterprise"
          dataKey="Enterprise"

          stroke="#416600"

          fill="#0B3D1F"
          fillOpacity={0.10}

          strokeWidth={3}

          dot={{
            r: 2,
            fill: "rgba(11,61,31,0.77)",
            stroke: "rgba(11,61,31,0.77)",
            strokeWidth: 3,
          }}
        />

        {/* ================= DATA CENTRE ================= */}

        <Radar
          name="DataCentre"
          dataKey="DataCentre"

          stroke="#7D9E49"

          fill="#416600"
          fillOpacity={0.10}

          strokeWidth={3}

          dot={{
            r: 2,
            fill: "rgba(11,61,31,0.77)",
            stroke: "#416600",
            strokeWidth: 3,
          }}
        />

      </RadarChart>

    </ResponsiveContainer>

  </div>

</div>

    {/* ================= RIGHT BAR CHART ================= */}

    <div
      className="
        h-[240px]

        rounded-[16px]

        bg-[#131814]

        border
        border-[#77B900]/70

        px-[18px]
        pt-[12px]
      "
    >

      {/* TITLE */}

      <h4 className="text-[10px] text-white">
        Requirement fulfilment score by tier
      </h4>

      {/* LEGENDS */}

      <div className="flex items-center gap-[10px] mt-[6px]">

        <div className="flex items-center gap-[4px]">
          <div className="w-[8px] h-[8px] bg-[#7ED000]" />
          <span className="text-[8px] text-white">
            Fulfilled
          </span>
        </div>

        <div className="flex items-center gap-[4px]">
          <div className="w-[8px] h-[8px] bg-[#5F9400]" />
          <span className="text-[8px] text-white">
            Gap
          </span>
        </div>

      </div>

      {/* CHART */}

      <div className="w-full h-[180px] mt-[4px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            layout="vertical"
            data={fulfillmentData}
            margin={{
              top: 5,
              right: 10,
              left: -10,
              bottom: 0,
            }}
            barCategoryGap={12}
          >

            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{
                fill: "#666",
                fontSize: 8,
              }}
              tickFormatter={(v) => `${v}%`}
              axisLine={{
                stroke: "#505050",
              }}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              tick={{
                fill: "#666",
                fontSize: 8,
              }}
              tickLine={false}
              axisLine={false}
              width={70}
            />

            <Bar
              dataKey="fulfilled"
              fill="#7ED000"
              barSize={14}
            />

            <Bar
              dataKey="gap"
              fill="#5F9400"
              barSize={14}
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
};

export default BusinessRequirementsView;