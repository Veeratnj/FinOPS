const Individual = () => {
  return (
    <div className="flex-1 bg-[#0A0F0B] text-white overflow-y-auto overflow-x-hidden">
     
     {/* HEADER */}
      <div className="px-6 pt-6 pb-4 border-b border-[#558501]/40 flex justify-between items-start">

        <div>
          <h1 className="text-xl font-semibold">
            AI FinOps Dashboard —
            <span className="text-[#77B900]"> Individual</span>
          </h1>

          <p className="text-xs text-[#7E7E7E] mt-1">
            Last synced: 2 min ago · Billing cycle: Apr 1–30, 2026
          </p>
        </div>

        <div className="flex gap-2">
          <div className="px-3 py-[3px] text-xs rounded-full border border-red-500 text-red-400">
            3 Wastage alerts
          </div>

          <div className="px-3 py-[3px] text-xs rounded-full border border-[#77B900] text-[#77B900]">
            Budget healthy
          </div>
        </div>

      </div>

      {/* BODY */}
<div className="p-6 space-y-6">

  {/* 🔥 ALERT BAR */}
  <div className="
    w-full 
    border border-orange-500/40 
    bg-orange-500/10 
    text-orange-400 
    text-sm 
    px-4 py-2 
    rounded-md
  ">
    • GPT-4o calls spiking since Apr 22 — consider switching to a smaller model for dev/test queries
  </div>

  {/* 🔑 KEY METRICS */}
  <div className="w-full max-w-full">

  <h2 className="text-sm text-[#D9D9D9] mb-3">
    KEY METRICS
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

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
  <div className="flex gap-3">

    {/* ================= CARD 1 ================= */}
    <div className="relative w-[380px] h-[130px] rounded-[25px] border border-[#77B900]/60 bg-[#0B120C] p-5 overflow-hidden">

      {/* Bottom glow ONLY */}
      <div className="absolute bottom-0 left-0 w-full h-[30px] bg-[#77B900]/45 blur-3xl"></div>

      <div className="relative z-10">

        <p className="text-[10px] text-[#7E7E7E]">
          GPU utilization (7d)
        </p>

        {/* GRAPH - 10 bars */}
        <div className="flex items-end gap-[2px] mt-2">
          <div className="w-[22px] h-[15px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[22px] bg-[#4F7A00] rounded-[2px]"></div>
          <div className="w-[22px] h-[33px] bg-[#6FA800] rounded-[2px]"></div>
          <div className="w-[22px] h-[27px] bg-[#5E8F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[20px] bg-[#4F7A00] rounded-[2px]"></div>
          <div className="w-[22px] h-[9px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[36px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[14px] bg-[#5E8F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[27px] bg-[#6FA800] rounded-[2px]"></div>
          <div className="w-[22px] h-[11px] bg-[#4F7A00] rounded-[2px]"></div>
        </div>

        <h3 className="text-[18px] mt-2 text-white font-medium">54%</h3>

        <p className="text-[8px] text-[#7E7E7E]">
          avg · below recommended
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

        <div className="flex items-end gap-[2px] mt-1">
          <div className="w-[22px] h-[39px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[39px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[27px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[31px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[24px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[45px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[19px] bg-[#1A3D6E] rounded-[2px]"></div>
          <div className="w-[22px] h-[23px] bg-[#1A3D6E] rounded-[2px]"></div>
          <div className="w-[22px] h-[36px] bg-[#4D9FFF] rounded-[2px]"></div>
          <div className="w-[22px] h-[17px] bg-[#1A3D6E] rounded-[2px]"></div>
        </div>

        <h3 className="text-[16px] mt-2 text-white font-medium">
          82K/day
        </h3>

        <p className="text-[8px] text-[#7E7E7E]">
          +9% vs prior week
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
          <div className="w-[22px] h-[15px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[27px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[27px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[38px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[9px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[42px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[22px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[18px] bg-[#365F00] rounded-[2px]"></div>
          <div className="w-[22px] h-[33px] bg-[#77B900] rounded-[2px]"></div>
          <div className="w-[22px] h-[29px] bg-[#77B900] rounded-[2px]"></div>
        </div>

        <h3 className="text-[18px] mt-2 text-white font-medium">
          $0.0024
        </h3>

        <p className="text-[8px] text-[#7E7E7E]">
          No optimization applied yet
        </p>

      </div>
    </div>

  </div>
</div>
<div className="ml-[10px] px-0 mt-2">

  {/* ===== SECTION ROW ===== */}
  <div className="flex gap-6">

    {/* ================= LEFT SIDE ================= */}
    <div className="w-[520px]">

      {/* 🔥 TITLE OUTSIDE (IMPORTANT) */}
      <p className="text-[12px] text-[#7E7E7E] mb-2">
        WASTAGE BREAKDOWN
      </p>

      {/* CARD */}
      <div
        className="relative h-[120px] rounded-[20px] p-5 overflow-hidden"
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
              Oversized model calls
            </span>

            <div className="flex items-center gap-3 flex-1">
              <div className="h-[2px] w-[180px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[55%] bg-[#FF4D4D]"></div>
              </div>
              <span className="text-[12px] text-white">55%</span>
              <span className="text-[11px] text-[#7E7E7E]">$4.9</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#9FAFA3] w-[180px]">
              Repeated prompts
            </span>

            <div className="flex items-center gap-3 flex-1">
              <div className="h-[2px] w-[180px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[30%] bg-[#F5A623]"></div>
              </div>
              <span className="text-[12px] text-white">30%</span>
              <span className="text-[11px] text-[#7E7E7E]">$4.9</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#9FAFA3] w-[180px]">
              Unused API quota
            </span>

            <div className="flex items-center gap-3 flex-1">
              <div className="h-[2px] w-[180px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[15%] bg-[#7E7E7E]"></div>
              </div>
              <span className="text-[12px] text-white">15%</span>
              <span className="text-[11px] text-[#7E7E7E]">$1.3</span>
            </div>
          </div>

        </div>
      </div>
    </div>


    {/* ================= RIGHT SIDE ================= */}
    <div className="w-[380px]">

      {/* 🔥 TITLE OUTSIDE */}
      <p className="text-[12px] text-[#7E7E7E] mb-2">
        ORCHESTRATION STATUS
      </p>

      {/* CARD */}
      <div
        className="relative h-[90px] rounded-[20px] p-5 overflow-hidden"
        style={{
          backgroundColor: "rgba(19, 24, 20, 0.4)",
          border: "2px solid rgba(68, 106, 3, 0.5)",
          boxShadow: "0px 4px 4px rgba(186, 186, 186, 0.25)",
          backdropFilter: "blur(6px)",
        }}
      >

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 w-full h-[35px] bg-gradient-to-t from-[#77B900]/10 to-transparent"></div>

        <div className="relative z-10 space-y-3">

          {/* Row 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#9FAFA3]">
                Personal API
              </span>
              <span className="text-[10px] px-2 py-[2px] rounded bg-[#77B900]/20 text-[#77B900]">
                Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-[2px] w-[120px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[54%] bg-[#77B900]"></div>
              </div>
              <span className="text-[12px] text-white">54%</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#9FAFA3]">
                Notebook runner
              </span>
              <span className="text-[10px] px-2 py-[2px] rounded bg-gray-700 text-gray-300">
                Idle
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-[2px] w-[120px] bg-[#1f2a1f] rounded-full">
                <div className="h-full w-[5%] bg-gray-500"></div>
              </div>
              <span className="text-[12px] text-white">5%</span>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</div>
<div className="ml-[10px] px-1 mt-4 w-[920px]">

  {/* TITLE */}
  <p className="text-[12px] text-[#7E7E7E] mb-1 tracking-wide">
    OPTIMIZATION RECOMMENDATIONS
  </p>

  {/* CARD */}
  <div
    className="rounded-[18px] p-2"
    style={{
      backgroundColor: "rgba(19, 24, 20, 0.4)",
      border: "2px solid rgba(68, 106, 3, 0.5)",
      boxShadow: "0px 4px 4px rgba(186, 186, 186, 0.25)",
      backdropFilter: "blur(6px)",
    }}
  >

    {/* TABS */}
    <div className="flex gap-4 text-[11px] text-[#7E7E7E] border-b border-[#2a332a] pb-1 mb-2">
      <span className="text-[#77B900] border-b border-[#77B900] pb-[2px]">
        All
      </span>
      <span className="hover:text-white cursor-pointer">Auto-apply</span>
      <span className="hover:text-white cursor-pointer">Requires review</span>
    </div>

    {/* ITEM */}
    <div className="space-y-[6px]">

      {/* ITEM 1 */}
      <div
        className="rounded-[10px] p-2 flex justify-between items-start"
        style={{
          backgroundColor: "rgba(19, 24, 20, 0.4)",
          border: "1px solid rgba(68, 106, 3, 0.25)",
        }}
      >
        <div className="space-y-2">
          <p className="text-[12px] text-white leading-tight">
            Downgrade dev calls to Haiku
          </p>

          <p className="text-[10px] text-[#7E7E7E] leading-tight">
            Dev/test queries using GPT-4o → claude-haiku
          </p>

          <span className="text-[9px] px-2 py-[1px] rounded bg-[#77B900]/20 text-[#77B900]">
            Auto-apply
          </span>
        </div>

        <p className="text-[12px] text-[#77B900] font-medium">
          +$18/mo
        </p>
      </div>

      {/* ITEM 2 */}
      <div
        className="rounded-[10px] p-2 flex justify-between items-start"
        style={{
          backgroundColor: "rgba(19, 24, 20, 0.4)",
          border: "1px solid rgba(68, 106, 3, 0.25)",
        }}
      >
        <div className="space-y-2">
          <p className="text-[12px] text-white leading-tight">
            Cache repeated prompts
          </p>

          <p className="text-[10px] text-[#7E7E7E] leading-tight">
            38 identical prompts → enable caching
          </p>

          <span className="text-[9px] px-2 py-[1px] rounded bg-[#77B900]/20 text-[#77B900]">
            Auto-apply
          </span>
        </div>

        <p className="text-[12px] text-[#77B900] font-medium">
          +$8/mo
        </p>
      </div>

    </div>
  </div>
</div>
{/* ================= ACCOUNT PROFILE ================= */}
<div className="ml-[10px] px-1 mt-4 w-[920px]">

  {/* TITLE */}
  <p className="text-[13px] text-[#7E7E7E] mb-2 tracking-wide">
    ACCOUNT PROFILE
  </p>

  {/* CARD */}
  <div
    className="relative rounded-[20px] px-6 py-4"
    style={{
      backgroundColor: "rgba(19, 24, 20, 0.4)", // #131814 @40%
      border: "2px solid rgba(68, 106, 3, 0.5)", // #446A03 @50%
      boxShadow: "0px 4px 4px rgba(186, 186, 186, 0.25)", // exact Figma shadow
      backdropFilter: "blur(6px)",
    }}
  >

    {/* Bottom subtle glow ONLY */}
    <div className="absolute bottom-0 left-0 w-full h-[30px] bg-gradient-to-t from-[#77B900]/10 to-transparent"></div>

    <div className="relative z-10 grid grid-cols-2 gap-y-4 gap-x-12">

      {/* LEFT COLUMN */}
      <div>
        <p className="text-[11px] text-[#77B900] mb-1">NAME</p>
        <p className="text-[14px] text-white">Jaya Kumar</p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">PLAN</p>
        <p className="text-[14px] text-white">Individual Developer</p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">PRIMARY USE CASE</p>
        <p className="text-[14px] text-white">
          Personal projects & research
        </p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">CLOUD PROVIDER</p>
        <p className="text-[14px] text-white">
          API-only (no cloud)
        </p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">BUDGET CAP</p>
        <p className="text-[14px] text-white">$150 / month</p>
      </div>

      <div>
        <p className="text-[11px] text-[#77B900] mb-1">ALERT THRESHOLD</p>
        <p className="text-[14px] text-white">90% of budget</p>
      </div>

    </div>
  </div>
</div>
      
       
</div>          
    </div>
  );
};

export default Individual;