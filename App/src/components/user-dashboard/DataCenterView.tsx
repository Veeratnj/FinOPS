import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const statCards = [
  {
    title: "Total rack cost/mo",
    value: "$2.14M",
    subtitle: "18 racks × 4 sites",
  },
  {
    title: "Avg PUE",
    value: "1.42",
    subtitle: "Target: 1.25",
  },
  {
    title: "GPU rack utilization",
    value: "58%",
    subtitle: "24% idle capacity",
  },
  {
    title: "Power cost/mo",
    value: "$312K",
    subtitle: "kWh × PUE × rate",
  },
  {
    title: "Carbon output",
    value: "142 tCO₂e",
    subtitle: "This month",
  },
];
const dataCenterAlerts = [
  {
    title: "Site B PUE anomaly detected",
    desc: "PUE spiked to 1.71 — cooling fault suspected · Est. cost impact $28K/mo",
    badge: "Critical",
    amount: "+$28K/mo",
  },
  {
    title: "Rack 7 utilization at 18% — Site A",
    desc: "Consolidate workloads to 4 racks · Shut down 3 idle racks",
    badge: "Warning",
    amount: "Save $64K/mo",
  },
  {
    title: "Renewable energy window — Site C",
    desc: "Grid mix 94% renewable 02:00–06:00 · Schedule batch jobs now",
    badge: "Opportunity",
    amount: "−18 tCO₂e",
  },
];

const DataCenterView = () => {
  return (
    <div className="mt-[14px] w-full">

      {/* ================= CARDS ================= */}

      <div className="grid grid-cols-5 gap-[14px] w-full">

        {statCards.map((card, index) => (
          <div
            key={index}
            className="
              w-full
              h-[86px]

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
            <p className="text-[10px] text-[#F3F3F3] leading-none">
              {card.title}
            </p>

            {/* VALUE */}
            <h3 className="text-[18px] text-[#77B900] font-semibold mt-[10px] leading-none">
              {card.value}
            </h3>

            {/* SUBTITLE */}
            <p className="text-[10px] text-[#D4D4D4] mt-[10px] leading-none">
              {card.subtitle}
            </p>

          </div>
        ))}

      </div>
      {/* ================= DATA CENTER OPERATIONS VIEW ================= */}
<div className="mt-5">

  {/* TITLE */}
  <h2 className="text-[14px] text-[#F2F2F2] mb-3">
    Data center operations view
  </h2>

  {/* ALERTS */}
  <div className="flex flex-col gap-[8px]">

    {dataCenterAlerts.map((alert, index) => (

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
                w-[61px]
                h-[15px]

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
    {/* ================= CHARTS ROW ================= */}

<div className="grid grid-cols-2 gap-[20px] mt-[18px]">

  {/* ========================================================= */}
  {/* ================= LEFT CHART ============================ */}
  {/* ========================================================= */}

  <div
    className="
         w-full

      h-[260px]

      rounded-[20px]

      bg-[#131814]

      border
      border-[#77B900]

      px-[18px]
      pt-[16px]
      pb-[12px]

      min-w-0
    "
    style={{
      boxShadow: "inset 0 0 0 1px rgba(15,24,0,0.95)",
    }}
  >

    {/* TITLE */}
    <h3 className="text-[11px] text-[#F3F3F3] leading-none">
      Rack utilization by site (%)
    </h3>

    {/* LEGENDS */}
    <div className="flex items-center gap-[10px] mt-[10px]">

      <div className="flex items-center gap-[4px]">
        <div className="w-[8px] h-[8px] bg-[#77B900]" />
        <span className="text-[8px] text-[#E5E5E5]">
          Site A
        </span>
      </div>

      <div className="flex items-center gap-[4px]">
        <div className="w-[8px] h-[8px] bg-[#9BE000]" />
        <span className="text-[8px] text-[#E5E5E5]">
          Site B
        </span>
      </div>

      <div className="flex items-center gap-[4px]">
        <div className="w-[8px] h-[8px] bg-[#5A8700]" />
        <span className="text-[8px] text-[#E5E5E5]">
          Site C
        </span>
      </div>

      <div className="flex items-center gap-[4px]">
        <div className="w-[8px] h-[8px] bg-[#3D5C00]" />
        <span className="text-[8px] text-[#E5E5E5]">
          Site D
        </span>
      </div>

    </div>

    {/* GRAPH */}
    <div className="w-full h-[182px] mt-[8px]">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart
          data={[
            {
              month: "Jan",
              siteA: 71,
              siteB: 67,
              siteC: 55,
              siteD: 40,
            },
            {
              month: "Feb",
              siteA: 73,
              siteB: 68,
              siteC: 57,
              siteD: 42,
            },
            {
              month: "Mar",
              siteA: 75,
              siteB: 70,
              siteC: 60,
              siteD: 46,
            },
            {
              month: "Apr",
              siteA: 77,
              siteB: 58,
              siteC: 60,
              siteD: 49,
            },
            {
              month: "May",
              siteA: 79,
              siteB: 56,
              siteC: 63,
              siteD: 50,
            },
            {
              month: "Jun",
              siteA: 80,
              siteB: 58,
              siteC: 65,
              siteD: 51,
            },
          ]}
          margin={{
            top: 5,
            right: 8,
            left: -24,
            bottom: -12,
          }}
        >

          {/* GRID */}
          <CartesianGrid
            vertical={false}
            stroke="#1A2515"
          />

          {/* X AXIS */}
          <XAxis
            dataKey="month"
            tick={{
              fill: "#5E5E5E",
              fontSize: 8,
            }}
            tickLine={false}
            axisLine={{
              stroke: "#5C5C5C",
            }}
          />

          {/* Y AXIS */}
          <YAxis
            domain={[30, 90]}
            ticks={[30,40,50,60,70,80,90]}
            tickFormatter={(v) => `${v}%`}
            tick={{
              fill: "#5E5E5E",
              fontSize: 8,
            }}
            tickLine={false}
            axisLine={{
              stroke: "#5C5C5C",
            }}
          />

          {/* SITE A */}
          <Line
            type="monotone"
            dataKey="siteA"
            stroke="#77B900"
            strokeWidth={1}
            dot={{
              r: 1.3,
              fill: "#77B900",
              strokeWidth: 0,
            }}
            activeDot={false}
          />

          {/* SITE B */}
          <Line
            type="monotone"
            dataKey="siteB"
            stroke="#9BE000"
            strokeWidth={1}
            strokeDasharray="3 2"
            dot={{
              r: 1.2,
              fill: "#9BE000",
              strokeWidth: 0,
            }}
            activeDot={false}
          />

          {/* SITE C */}
          <Line
            type="monotone"
            dataKey="siteC"
            stroke="#5A8700"
            strokeWidth={1}
            dot={{
              r: 1.2,
              fill: "#5A8700",
              strokeWidth: 0,
            }}
            activeDot={false}
          />

          {/* SITE D */}
          <Line
            type="monotone"
            dataKey="siteD"
            stroke="#466A00"
            strokeWidth={1}
            strokeDasharray="3 2"
            dot={{
              r: 1.2,
              fill: "#466A00",
              strokeWidth: 0,
            }}
            activeDot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  </div>

  {/* ========================================================= */}
  {/* ================= RIGHT CHART =========================== */}
  {/* ========================================================= */}

  {/* ========================================================= */}
{/* ================= RIGHT CHART =========================== */}
{/* ========================================================= */}

<div
  className="
    w-full

    h-[260px]

    rounded-[20px]

    bg-[#131814]

    border
    border-[#77B900]

    px-[18px]
    pt-[16px]
    pb-[12px]

    min-w-0
  "
  style={{
    boxShadow: "inset 0 0 0 1px rgba(15,24,0,0.95)",
  }}
>

  {/* TITLE */}
  <h3 className="text-[11px] text-[#F3F3F3] leading-none">
    Power cost vs carbon (monthly)
  </h3>

  {/* LEGENDS */}
  <div className="flex items-center gap-[10px] mt-[10px]">

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#77B900]" />
      <span className="text-[8px] text-[#E5E5E5]">
        Power$K
      </span>
    </div>

    <div className="flex items-center gap-[4px]">
      <div className="w-[8px] h-[8px] bg-[#5A8700]" />
      <span className="text-[8px] text-[#E5E5E5]">
        Carbon tCO₂e
      </span>
    </div>

  </div>

  {/* GRAPH */}
  <div className="w-full h-[185px] mt-[6px]">

    <ResponsiveContainer width="100%" height="100%">

      <LineChart
        data={[
          {
            month: "Jan",
            solid: 318,
            dotted: 319,
          },
          {
            month: "Feb",
            solid: 322,
            dotted: 322,
          },
          {
            month: "Mar",
            solid: 310,
            dotted: 311,
          },
          {
            month: "Apr",
            solid: 305,
            dotted: 305.5,
          },
          {
            month: "May",
            solid: 299,
            dotted: 300,
          },
          {
            month: "Jun",
            solid: 295,
            dotted: 296,
          },
        ]}
        margin={{
          top: 8,
          right: 8,
          left: -10,
          bottom: -12,
        }}
      >

        {/* GRID */}
        <CartesianGrid
          vertical={false}
          stroke="#182115"
          strokeOpacity={0.8}
        />

        {/* X AXIS */}
        <XAxis
          dataKey="month"
          tick={{
            fill: "#5B5B5B",
            fontSize: 8,
          }}
          tickLine={false}
          axisLine={{
            stroke: "#5E5E5E",
          }}
        />

        {/* Y AXIS */}
        <YAxis
          domain={[290, 325]}
          ticks={[
            290,
            295,
            300,
            305,
            310,
            315,
            320,
            325,
          ]}
          tickFormatter={(v) => `$${v}K`}
          tick={{
            fill: "#5B5B5B",
            fontSize: 8,
          }}
          tickLine={false}
          axisLine={{
            stroke: "#5E5E5E",
          }}
        />

        {/* DOTTED LINE */}
        <Line
          type="monotone"
          dataKey="dotted"
          stroke="#4F7A00"
          strokeWidth={1}
          strokeDasharray="3 2"
          dot={false}
          activeDot={false}
        />

        {/* SOLID LINE */}
        <Line
          type="monotone"
          dataKey="solid"
          stroke="#77B900"
          strokeWidth={1.4}
          dot={{
            r: 2,
            fill: "#8DDB00",
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
  );
};

export default DataCenterView;