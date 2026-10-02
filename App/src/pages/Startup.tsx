const Startup = () => {
  return (
    <div className="flex-1 bg-[#0A0F0B] text-white overflow-y-auto overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <div className="px-6 pt-6 pb-4 border-b border-[#446A03]/40 flex justify-between items-start">

        <div>
          <h1 className="text-xl font-semibold">
            AI FinOps Dashboard —
            <span className="text-[#77B900]"> Startup</span>
          </h1>

          <p className="text-xs text-[#7E7E7E] mt-1">
            Last synced: 1 min ago · Billing cycle: Apr 1–30, 2026
          </p>
        </div>

        <div className="flex gap-2">
          <div className="px-3 py-[3px] text-xs rounded-full border border-red-500 text-red-400">
            7 Wastage alerts
          </div>

          <div className="px-3 py-[3px] text-xs rounded-full border border-[#77B900] text-[#77B900]">
            Budget risk
          </div>
        </div>

      </div>

      {/* ================= BODY ================= */}
      <div className="p-6 space-y-6">

        {/* 🔥 ALERT BAR (UPDATED) */}
        <div className="
          w-full 
          border border-orange-500/40 
          bg-orange-500/10 
          text-orange-400 
          text-sm 
          px-4 py-2 
          rounded-md
        ">
          • 2 idle GPU instances detected in us-east-1 · Estimated waste: $34/day · Auto-remediate available
        </div>

        {/* ================= KEY METRICS ================= */}
        <div>

          <h2 className="text-sm text-[#D9D9D9] mb-3">
            KEY METRICS
          </h2>

          <div className="grid grid-cols-4 gap-4">

            {/* CARD 1 */}
            <div className="
              p-4 rounded-xl
              border border-[#446A03]/50
              bg-[#131814]/40
              shadow-[0px_4px_4px_0px_rgba(186,186,186,0.25)]
            ">
              <p className="text-xs text-[#7E7E7E]">MTD AI Spend</p>
              <h3 className="text-2xl mt-1">$2,840</h3>
              <p className="text-xs text-red-400 mt-1">+12% vs last month</p>
            </div>

            {/* CARD 2 */}
            <div className="
              p-4 rounded-xl
              border border-[#446A03]/50
              bg-[#131814]/40
              shadow-[0px_4px_4px_0px_rgba(186,186,186,0.25)]
            ">
              <p className="text-xs text-[#7E7E7E]">PROJECTED EOC</p>
              <h3 className="text-2xl mt-1">$4,210</h3>
              <p className="text-xs text-[#7E7E7E] mt-1">Budget limit: $5,000</p>
            </div>

            {/* CARD 3 */}
            <div className="
              p-4 rounded-xl
              border border-[#446A03]/50
              bg-[#131814]/40
              shadow-[0px_4px_4px_0px_rgba(186,186,186,0.25)]
            ">
              <p className="text-xs text-[#7E7E7E]">WASTAGE COST</p>
              <h3 className="text-2xl mt-1">$318</h3>
              <p className="text-xs text-red-400 mt-1">11.2% of total spend</p>
            </div>

            {/* CARD 4 */}
            <div className="
              p-4 rounded-xl
              border border-[#446A03]/50
              bg-[#131814]/40
              shadow-[0px_4px_4px_0px_rgba(186,186,186,0.25)]
            ">
              <p className="text-xs text-[#7E7E7E]">SAVINGS FOUND</p>
              <h3 className="text-2xl mt-1">$640</h3>
              <p className="text-xs text-[#77B900] mt-1">Across 5 remediations</p>
            </div>

          </div>

        </div>
    <div className="ml-[0px] px-1 mt-1">

  {/* TITLE */}
  <h2 className="text-white text-sm mb-4">LIVE MONITORING</h2>

  {/* CARDS ROW */}
  <div className="flex gap-6">

    {/* ================= CARD 1 ================= */}
    <div className="relative w-[390px] h-[130px] rounded-[25px] border border-[#77B900]/60 bg-[#0B120C] p-5 overflow-hidden">

      {/* Bottom glow ONLY */}
      <div className="absolute bottom-0 left-0 w-full h-[30px] bg-[#77B900]/45 blur-3xl"></div>

      <div className="relative z-10">

        <p className="text-[10px] text-[#7E7E7E]">
          GPU utilization (7d)
        </p>

        {/* GRAPH - 10 bars */}
        <div className="flex items-end gap-[2px] mt-2">
          <div className="w-[22px] h-[11px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[33px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[27px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[11px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[25px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[30px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[22px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[25px] bg-[#5E8F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[6px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[36px] bg-[#77B900] rounded-[2px]"></div>
        </div>

        <h3 className="text-[18px] mt-2 text-white font-medium">68%</h3>

        <p className="text-[8px] text-[#7E7E7E]">
          avg · target ≥ 75%
        </p>

      </div>
    </div>


    {/* ================= CARD 2 ================= */}
    <div className="relative w-[380px] h-[130px] rounded-[25px] border border-[#77B900]/60 bg-[#0B120C] p-5 overflow-hidden">

      <div className="absolute bottom-0 left-0 w-full h-[30px] bg-[#77B900]/45 blur-3xl"></div>

      <div className="relative z-10">

        <p className="text-[10px] text-[#7E7E7E]">
          Token throughput (7d)
        </p>

        <div className="flex items-end gap-[2px] mt-2">
          <div className="w-[22px] h-[17px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[9px] bg-[#1A3D6E] rounded-[2px]"></div>
          <div className="w-[22px] h-[12px] bg-[#1A3D6E] rounded-[2px]"></div>
          <div className="w-[22px] h-[19px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[24px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[14px] bg-[#1A3D6E] rounded-[2px]"></div>
          <div className="w-[22px] h-[17px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[7px] bg-[#1A3D6E] rounded-[2px]"></div>
          <div className="w-[22px] h-[21px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[24px] bg-[#4D9FFF] rounded-[2px]"></div>
        </div>

        <h3 className="text-[16px] mt-2 text-white font-medium">
          1.4M/day
        </h3>

        <p className="text-[8px] text-[#7E7E7E]">
          +4% vs prior week
        </p>

      </div>
    </div>


    {/* ================= CARD 3 ================= */}
    <div className="relative w-[380px] h-[130px] rounded-[25px] border border-[#77B900]/60 bg-[#0B120C] p-5 overflow-hidden">

      <div className="absolute bottom-0 left-0 w-full h-[30px] bg-[#77B900]/45 blur-2xl"></div>

      <div className="relative z-10">

        <p className="text-[10px] text-[#7E7E7E]">
          Inference cost / 1K tokens
        </p>

        <div className="flex items-end gap-[2px] mt-1">
          <div className="w-[22px] h-[37px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[31px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[29px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[33px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[14px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[25px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[20px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[33px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[14px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[11px] bg-[#365F00] rounded-[2px]"></div>
        </div>

        <h3 className="text-[18px] mt-2 text-white font-medium">
          $0.0018
        </h3>

        <p className="text-[8px] text-[#7E7E7E]">
          -6% after optimization
        </p>

      </div>
    </div>
    </div>
    <div className="ml-[0px] px-2 mt-5">

  {/* ===== SECTION ROW ===== */}
  <div className="flex gap-6">

    {/* ================= LEFT SIDE ================= */}
    <div className="w-[470px]">

      {/* 🔥 TITLE OUTSIDE (IMPORTANT) */}
      <p className="text-[12px] text-[#D9D9D9] mb-2">
        WASTAGE BREAKDOWN
      </p>

      {/* CARD */}
      <div
        className="relative h-[130px] rounded-[20px] p-5 overflow-hidden"
        style={{
          backgroundColor: "rgba(19, 24, 20, 0.4)",
          border: "2px solid rgba(68, 106, 3, 0.5)",
          boxShadow: "0px 4px 4px rgba(186, 186, 186, 0.25)",
          backdropFilter: "blur(6px)",
        }}
      >

        {/* Bottom glow only */}
        <div className="absolute bottom-0 left-0 w-full h-[35px] bg-gradient-to-t from-[#77B900]/10 to-transparent"></div>

        <div className="relative z-10 space-y-2">

          {/* Row 1 */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#9FAFA3] w-[180px]">
              Idle instances
            </span>

            <div className="flex items-center gap-3 flex-1">
              <div className="h-[2px] w-[180px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[38%] bg-[#FF4D4D]"></div>
              </div>
              <span className="text-[12px] text-white">38%</span>
              <span className="text-[11px] text-[#7E7E7E]">$128</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#9FAFA3] w-[180px]">
              Over-provisioned
            </span>

            <div className="flex items-center gap-3 flex-1">
              <div className="h-[2px] w-[180px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[27%] bg-[#F5A623]"></div>
              </div>
              <span className="text-[12px] text-white">27%</span>
              <span className="text-[11px] text-[#7E7E7E]">$91</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#9FAFA3] w-[180px]">
              Unused quotas
            </span>

            <div className="flex items-center gap-3 flex-1">
              <div className="h-[2px] w-[180px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[19%] bg-[#F5A623]"></div>
              </div>
              <span className="text-[12px] text-white">19%</span>
              <span className="text-[11px] text-[#7E7E7E]">$64</span>
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#9FAFA3] w-[180px]">
              Cold model load
            </span>

            <div className="flex items-center gap-3 flex-1">
              <div className="h-[2px] w-[180px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[16%] bg-[#7E7E7E]"></div>
              </div>
              <span className="text-[12px] text-white">16%</span>
              <span className="text-[11px] text-[#7E7E7E]">$54</span>
            </div>
          </div>

        </div>
      </div>
    </div>
    {/* ================= RIGHT SIDE ================= */}
<div className="w-[420px]">

  {/* 🔥 TITLE OUTSIDE */}
  <p className="text-[12px] text-[#D9D9D9] mb-2">
    ORCHESTRATION STATUS
  </p>

  {/* CARD */}
  <div
    className="relative h-[130px] rounded-[20px] p-5 overflow-hidden"
    style={{
      backgroundColor: "rgba(19, 24, 20, 0.4)",
      border: "2px solid rgba(68, 106, 3, 0.5)",
      boxShadow: "0px 4px 4px rgba(186, 186, 186, 0.25)",
      backdropFilter: "blur(6px)",
    }}
  >

    {/* Bottom glow */}
    <div className="absolute bottom-0 left-0 w-full h-[35px] bg-gradient-to-t from-[#77B900]/10 to-transparent"></div>

    <div className="relative z-10 space-y-2">

      {/* Row 1 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#9FAFA3]">
            Inference cluster
          </span>
          <span className="text-[10px] px-2 py-[2px] rounded bg-[#77B900]/20 text-[#77B900]">
            Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-[2px] w-[120px] bg-[#1f2a1f] rounded-full">
            <div className="h-full w-[72%] bg-[#77B900]"></div>
          </div>
          <span className="text-[12px] text-white">72%</span>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#9FAFA3]">
            Fine-tune jobs
          </span>
          <span className="text-[10px] px-2 py-[2px] rounded bg-gray-700 text-gray-300">
            Idle
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-[2px] w-[120px] bg-[#1f2a1f] rounded-full">
            <div className="h-full w-[12%] bg-gray-500"></div>
          </div>
          <span className="text-[12px] text-white">12%</span>
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#9FAFA3]">
            Embedding pipeline
          </span>
          <span className="text-[10px] px-2 py-[2px] rounded bg-blue-500/20 text-blue-400">
            Scaled ↓
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-[2px] w-[120px] bg-[#1f2a1f] rounded-full">
            <div className="h-full w-[45%] bg-blue-400"></div>
          </div>
          <span className="text-[12px] text-white">45%</span>
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#9FAFA3]">
            Batch processor
          </span>
          <span className="text-[10px] px-2 py-[2px] rounded bg-[#77B900]/20 text-[#77B900]">
            Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-[2px] w-[120px] bg-[#1f2a1f] rounded-full">
            <div className="h-full w-[81%] bg-[#77B900]"></div>
          </div>
          <span className="text-[12px] text-white">81%</span>
        </div>
      </div>

    </div>
  </div>
</div>


  </div>
</div>
<div className="ml-[10px] px-1 mt-4 w-[920px]">

  {/* TITLE */}
  <p className="text-[12px] text-[#7E7E7E] mb-2 tracking-wide">
    OPTIMIZATION RECOMMENDATIONS
  </p>

  {/* CARD */}
  <div
    className="rounded-[18px] p-3"
    style={{
      backgroundColor: "rgba(19, 24, 20, 0.4)",
      border: "2px solid rgba(68, 106, 3, 0.5)",
      boxShadow: "0px 4px 4px rgba(186, 186, 186, 0.25)",
      backdropFilter: "blur(6px)",
    }}
  >

    {/* TABS */}
    <div className="flex gap-6 text-[11px] text-[#7E7E7E] border-b border-[#2a332a] pb-2 mb-3">
      <span className="text-[#77B900] border-b border-[#77B900] pb-[2px]">
        All
      </span>
      <span className="hover:text-white cursor-pointer">Auto-apply</span>
      <span className="hover:text-white cursor-pointer">Requires review</span>
    </div>

    {/* ITEMS */}
    <div className="space-y-3">

      {/* ITEM 1 */}
      <div
        className="rounded-[12px] p-3 flex justify-between items-start"
        style={{
          backgroundColor: "rgba(19, 24, 20, 0.4)",
          border: "1px solid rgba(68, 106, 3, 0.25)",
        }}
      >
        <div className="space-y-2">
          <p className="text-[13px] text-white leading-tight">
            Right-size T4 cluster
          </p>

          <p className="text-[11px] text-[#7E7E7E] leading-tight">
            Reduce 4→2 replicas off-peak hours (10pm–6am)
          </p>

          <span className="text-[10px] px-2 py-[2px] rounded bg-[#77B900]/20 text-[#77B900]">
            Auto-apply
          </span>
        </div>

        <p className="text-[13px] text-[#77B900] font-medium">
          +$210/mo
        </p>
      </div>

      {/* ITEM 2 */}
      <div
        className="rounded-[12px] p-3 flex justify-between items-start"
        style={{
          backgroundColor: "rgba(19, 24, 20, 0.4)",
          border: "1px solid rgba(68, 106, 3, 0.25)",
        }}
      >
        <div className="space-y-2">
          <p className="text-[13px] text-white leading-tight">
            Switch to spot instances
          </p>

          <p className="text-[11px] text-[#7E7E7E] leading-tight">
            70% discount on non-critical batch workloads
          </p>

          <span className="text-[10px] px-2 py-[2px] rounded bg-yellow-500/20 text-yellow-400">
            Review needed
          </span>
        </div>

        <p className="text-[13px] text-[#77B900] font-medium">
          +$180/mo
        </p>
      </div>

      {/* ITEM 3 */}
      <div
        className="rounded-[12px] p-3 flex justify-between items-start"
        style={{
          backgroundColor: "rgba(19, 24, 20, 0.4)",
          border: "1px solid rgba(68, 106, 3, 0.25)",
        }}
      >
        <div className="space-y-2">
          <p className="text-[13px] text-white leading-tight">
            Prune unused model cache
          </p>

          <p className="text-[11px] text-[#7E7E7E] leading-tight">
            12 model versions unused {'>'}30 days consuming storage
          </p>

          <span className="text-[10px] px-2 py-[2px] rounded bg-red-500/20 text-red-400">
            Critical
          </span>
        </div>

        <p className="text-[13px] text-[#77B900] font-medium">
          +$95/mo
        </p>
      </div>

    </div>
  </div>
</div>
<div className="ml-[10px] px-1 mt-4 w-[920px]">

  {/* TITLE */}
  <p className="text-[13px] text-[#7E7E7E] mb-2 tracking-wide">
    ACCOUNT PROFILE
  </p>

  {/* CARD */}
  <div
    className="relative rounded-[20px] px-6 py-4"
    style={{
      backgroundColor: "rgba(19, 24, 20, 0.4)",
      border: "2px solid rgba(68, 106, 3, 0.5)",
      boxShadow: "0px 4px 4px rgba(186, 186, 186, 0.25)",
      backdropFilter: "blur(6px)",
    }}
  >

    {/* Bottom glow */}
    <div className="absolute bottom-0 left-0 w-full h-[30px] bg-gradient-to-t from-[#77B900]/10 to-transparent"></div>

    <div className="relative z-10 grid grid-cols-2 gap-y-4 gap-x-12">

      {/* LEFT COLUMN */}
      <div>
        <p className="text-[11px] text-[#77B900] mb-1">ORGANIZATION</p>
        <p className="text-[14px] text-white">NovaSpark Inc.</p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">PLAN</p>
        <p className="text-[14px] text-white">Startup Pro</p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">PRIMARY USE CASE</p>
        <p className="text-[14px] text-white">
          LLM API + inference
        </p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">CLOUD PROVIDER</p>
        <p className="text-[14px] text-white">
          AWS (us-east-1, eu-west-2)
        </p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">BUDGET CAP</p>
        <p className="text-[14px] text-white">$5,000 / month</p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">ALERT THRESHOLD</p>
        <p className="text-[14px] text-white">80% of budget</p>
      </div>

    </div>
  </div>
</div>
      </div>
    </div>
    </div>
  );
};

export default Startup;