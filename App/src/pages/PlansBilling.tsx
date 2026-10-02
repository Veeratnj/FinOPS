import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/context/SubscriptionContext";

const PlanBilling = () => {

  const [billing, setBilling] =
    useState("monthly");

  const [selectedSpend, setSelectedSpend] =
    useState("free");

  const [openFaq, setOpenFaq] =
    useState<number | null>(null);

  const flipBilling = () => {
    setBilling((prev) =>
      prev === "monthly"
        ? "annual"
        : "monthly"
    );
  };
  const handleSpendSelect = (
  tier: string,
  cardId: string
) => {
  setSelectedSpend(tier);

  const el = document.getElementById(cardId);

  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // remove old outlines
    document
      .querySelectorAll(".pc")
      .forEach((card) => {
        (
          card as HTMLElement
        ).style.outline = "none";

        (
          card as HTMLElement
        ).style.outlineOffset = "0px";
      });

    // highlight selected card
    const target =
      el.classList.contains("pc")
        ? el
        : el.querySelector(".pc");

    if (target) {
      (
        target as HTMLElement
      ).style.outline =
        "2px solid var(--blue)";

      (
        target as HTMLElement
      ).style.outlineOffset =
        "3px";
    }
  }
};
const navigate = useNavigate();

const {
  setSelectedPlan,
  setSubscriptionStatus,
  setIsTrialActive,
} = useSubscription();
const handleFreePlan = () => {
  setSelectedPlan("free");
  setSubscriptionStatus("trial");
  setIsTrialActive(true);

  navigate("/billing");
};

const handlePlatformTrial = () => {
  setSelectedPlan("platform");
  setSubscriptionStatus("trial");
  setIsTrialActive(true);
  navigate("/billing");
};

const handlePlatformPlusTrial = () => {
  setSelectedPlan("platform-plus");
  setSubscriptionStatus("trial");
  setIsTrialActive(true);
  navigate("/billing");
};

const handleEnterpriseSales = () => {
  navigate("/contact-sales");
};

const handleDataCenterTeam = () => {
  navigate("/contact-sales");
};

  return (
    <>
      {/* ADD CSS HERE */}
      <style>{`
          :root {
          --r: 12px;
--r-lg: 18px;
--r-xl: 24px;

--gold-lt: rgba(251,191,36,.1);
--teal-lt: rgba(62,202,160,.12);
  /* TEXT */
  --ink: #ffffff;
  --ink2: #cccccc;
  --ink3: #aaaaaa;
  --ink4: #888888;
  --ink5: #666666;

  /* BACKGROUND (MATCH YOUR SITE) */
  --paper: #0A0F0B;
  --white: #0f1a12;
  --surf: #0b1200;

  /* BORDER */
  --rule: rgba(119,185,0,0.1);
  --rule-md: rgba(119,185,0,0.25);

  /* PRIMARY BRAND (IMPORTANT) */
  --blue: #77B900;        /* CHANGE FROM BLUE → GREEN */
  --blue-lt: rgba(119,185,0,0.1);
  --blue-dk: #4d7c00;

  /* ACCENTS */
  --teal: #77B900;
  --gold: #9fdc00;
  --plum: #77B900;
  --coral: #ff4d4d;

  /* FONTS */
  --dm: 'Poppins', sans-serif;
  --fran: 'Poppins', sans-serif;
}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:var(--dm);background:transparent;color:var(--ink);line-height:1.7}

    /* NAV */
    .nav{position:sticky;top:0;z-index:200;background:rgba(246,245,241,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 2.5rem}
    .nav-brand{font-family:var(--fran);font-size:19px;font-weight:500;color:var(--ink);text-decoration:none}
    .nav-brand em{font-style:italic;color:var(--blue)}
    .nav-right{display:flex;align-items:center;gap:10px}
    .nav-link{font-size:13px;color:var(--ink3);text-decoration:none;padding:5px 12px;border-radius:var(--r);transition:background .15s}
    .nav-link:hover{background:var(--rule)}
    .nav-cta{font-size:13px;font-weight:500;color:var(--white);background:var(--ink);padding:8px 20px;border-radius:var(--r);text-decoration:none;transition:background .15s}
    .nav-cta:hover{background:var(--ink2)}

    /* HERO */
    .hero{background:transparent;padding:5.5rem 2.5rem 4.5rem;text-align:center;overflow:hidden;position:relative}
    .hero-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.07) 1px,transparent 1px);background-size:28px 28px}
    .hero-inner{max-width:760px;margin:0 auto;position:relative;z-index:1}
    .hero-eyebrow{font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--ink4);margin-bottom:1.5rem;display:block}
    .hero h1{font-family:var(--fran);font-size:clamp(38px,6vw,64px);font-weight:300;color:var(--ink);line-height:1.08;margin-bottom:1.25rem;letter-spacing:-.02em}
    .hero h1 em{font-style:italic;color:#9fdc00;font-weight:300}
    .hero-lead{font-size:16px;color:var(--ink4);line-height:1.8;max-width:520px;margin:0 auto 2.5rem}

    /* toggle */
    .toggle-row{display:inline-flex;align-items:center;gap:14px}
    .tog-text{font-size:13px;color:var(--ink4);cursor:pointer;transition:color .15s;user-select:none}
    .tog-text.on{color:var(--paper);font-weight:500}
    .tog-track{width:46px;height:26px;border-radius:13px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);cursor:pointer;position:relative;transition:background .2s}
    .tog-track.active{background:var(--blue);border-color:var(--blue)}
    .tog-knob{position:absolute;width:20px;height:20px;border-radius:50%;background:var(--paper);top:2px;left:2px;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}
    .tog-track.active .tog-knob{transform:translateX(20px)}
    .save-chip{font-size:10px;font-weight:500;letter-spacing:.05em;padding:2px 9px;border-radius:20px;background:rgba(13,122,94,.25);color:#6adfc0;border:1px solid rgba(13,122,94,.3)}

    /* spend bar */
    .spend-bar{background:transparent;border-bottom:1px solid rgba(119,185,0,0.1);padding:1.25rem 2.5rem}
    .spend-bar-inner{max-width:1080px;margin:0 auto;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
    .spend-q{font-size:13px;font-weight:500;color:var(--ink3);white-space:nowrap}
    .spend-pills{display:flex;gap:8px;flex-wrap:wrap}
    .sp{font-size:12px;font-weight:500;padding:6px 16px;border-radius:20px;border:1px solid var(--rule-md);background:var(--paper);color:var(--ink3);cursor:pointer;transition:all .15s}
    .sp:hover{border-color:var(--blue);color:var(--blue)}
    .sp.active{background:var(--blue);border-color:var(--blue);color:var(--white)}

    /* plans wrap */
    .plans-wrap{padding:3rem 2.5rem 0}
    .plans-inner{max-width:1080px;margin:0 auto}

    /* tier separator */
    .tier-sep{display:flex;align-items:center;gap:14px;margin:2.5rem 0 1.25rem}
    .tier-sep-line{flex:1;height:1px;background:var(--rule)}
    .tier-sep-lbl{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--ink5);white-space:nowrap}

    /* plan grid */
    .pgrid{display:grid;gap:14px;grid-template-columns:repeat(3,1fr)}
    .pgrid2{display:grid;gap:14px;grid-template-columns:repeat(2,1fr)}
    @media(max-width:860px){.pgrid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:680px){.pgrid2{grid-template-columns:1fr}}
    @media(max-width:540px){.pgrid{grid-template-columns:1fr}}

    /* plan card */
    .pc{background: rgba(15, 26, 18, 0.7);border: 1px solid rgba(119,185,0,0.2);border-radius:var(--r-xl);padding:1.75rem 1.5rem;display:flex;flex-direction:column;position:relative;transition:border-color .2s,transform .2s}
    .pc:hover{border-color:var(--rule-md);transform:translateY(-2px)}
    .pc.feat{background:rgba(15,26,18,0.9);border:1px solid rgba(119,185,0,0.3);transform:translateY(-6px)}
    .pc.feat:hover{transform:translateY(-9px)}
    .pc.prem{background:rgba(15, 26, 18, 0.9);border:1px solid rgba(119,185,0,0.3)}
    .pc.prem:hover{border-color:rgba(119,185,0,0.5)}
    .pop-chip{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;background:var(--blue);color:var(--white);padding:3px 14px;border-radius:20px;white-space:nowrap}
    .new-chip{position:absolute;top:-11px;right:1.5rem;font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;background:var(--plum);color:var(--white);padding:3px 12px;border-radius:20px}
    .pc-tier{font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ink5);margin-bottom:.4rem}
    .pc.feat .pc-tier,.pc.prem .pc-tier{color:var(--ink4)}
    .pc-name{font-family:var(--fran);font-size:22px;font-weight:500;color:var(--ink);letter-spacing:-.02em;margin-bottom:.3rem}
    .pc.feat .pc-name,.pc.prem .pc-name{color:var(--ink)}
    .pc-tag{font-size:12px;color:var(--ink4);line-height:1.5;margin-bottom:1.25rem}
    .pc.feat .pc-tag,.pc.prem .pc-tag{color:var(--ink3)}
    .pc-price{font-family:var(--fran);font-size:40px;font-weight:500;color:var(--ink);letter-spacing:-.03em;line-height:1}
    .pc.feat .pc-price,.pc.prem .pc-price{color:var(--ink)}
    .pc-price-sm{font-size:24px;padding-top:4px}
    .pc-period{font-size:12px;color:var(--ink5);margin:.3rem 0 .2rem}
    .pc.feat .pc-period,.pc.prem .pc-period{color:#5a5b58}
    .pc-note{font-size:11px;min-height:16px;margin-bottom:1.25rem;color:var(--ink5)}
    .pc.prem .pc-note.sv{color:#6adfc0}
    .pc-limit{font-size:11px;font-weight:500;padding:4px 12px;border-radius:var(--r);display:inline-block;margin-bottom:1.25rem}
    .pc-div{border:none;border-top:1px solid var(--rule);margin-bottom:1.25rem}
    .pc.feat .pc-div,.pc.prem .pc-div{border-top-color:rgba(255,255,255,.08)}
    .pc-feats{flex:1;display:flex;flex-direction:column;gap:8px;margin-bottom:1.5rem}
    .pc-feat{display:flex;gap:9px;align-items:flex-start;font-size:12px;color:var(--ink3);line-height:1.45}
    .pc.feat .pc-feat,.pc.prem .pc-feat{color:#7a7b77}
    .pc-feat strong{font-weight:500;color:var(--ink)}
    .pc.feat .pc-feat strong,.pc.prem .pc-feat strong{color:var(--ink)}
    .ck{width:15px;height:15px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px}
    .ck svg{width:9px;height:9px}
    .ck.y{background:#dcf5eb}
    .ck.y svg{stroke:var(--teal)}
    .ck.n{background:var(--rule)}
    .ck.n svg{stroke:var(--ink5)}
    .pc.feat .ck.y,.pc.prem .ck.y{background:rgba(106,223,192,.12)}
    .pc.feat .ck.y svg,.pc.prem .ck.y svg{stroke:#6adfc0}
    .pc.feat .ck.n,.pc.prem .ck.n{background:rgba(255,255,255,.06)}
    .pc-btn{display:block;text-align:center;font-size:13px;font-weight:500;padding:11px;border-radius:var(--r);text-decoration:none;border:1px solid var(--rule-md);color:var(--ink);transition:all .15s}
    .pc-btn:hover{background:var(--surf)}
    .pc.feat .pc-btn{background:var(--paper);border-color:transparent;color:var(--ink)}
    .pc.feat .pc-btn:hover{background:var(--white)}
    .pc.prem .pc-btn{background:rgba(90,45,130,.25);border-color:rgba(90,45,130,.4);color:#d4aaff}
    .pc.prem .pc-btn:hover{background:rgba(90,45,130,.4)}
    .pc-btn.dk{background:var(--ink);border-color:var(--ink);color:var(--paper)}
    .pc-btn.dk:hover{background:var(--ink2)}

    /* inside strip */
    .inside-strip{background:var(--surf);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:1.5rem 2.5rem;margin:2.5rem 0 0}
    .inside-inner{max-width:1080px;margin:0 auto;display:flex;gap:2rem;align-items:flex-start;flex-wrap:wrap}
    .in-lbl{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink4);flex-shrink:0;padding-top:3px;white-space:nowrap}
    .in-items{display:flex;gap:1.25rem;flex-wrap:wrap}
    .in-item{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ink3)}
    .in-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}

    /* utils */
    .wrap{max-width:1080px;margin:0 auto;padding:0 2.5rem}
    .sh{margin-bottom:2.5rem}
    .sh .ey{font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);display:block;margin-bottom:.5rem}
    .sh h2{font-family:var(--fran);font-size:clamp(24px,3.5vw,36px);font-weight:500;color:var(--ink);letter-spacing:-.02em;line-height:1.2;margin-bottom:.5rem}
    .sh p{font-size:14px;color:var(--ink3);line-height:1.75;max-width:560px}
    hr.div{border:none;border-top:1px solid var(--rule);max-width:1080px;margin:4rem auto}
    .ovf{overflow-x:auto}

    /* comparison table */
    .cmp{width:100%;border-collapse:collapse;font-size:12px}
    .cmp thead th{padding:10px 14px;text-align:center;font-family:var(--fran);font-size:13px;font-weight:500;color:var(--ink3);border-bottom:2px solid var(--rule);background:var(--paper)}
    .cmp thead th:first-child{text-align:left;width:22%}
    .cmp thead th.hl{background:var(--ink);color:var(--paper);border-radius:8px 8px 0 0}
    .cmp .gr td{padding:8px 14px 4px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink5);background:var(--paper);border-bottom:1px solid var(--rule)}
    .cmp .gr td.hb{background:rgba(13,14,12,.03)}
    .cmp .row{border-bottom:1px solid var(--rule);transition:background .1s}
    .cmp .row:hover{background:rgba(13,14,12,.02)}
    .cmp .row td{padding:10px 14px;color:var(--ink3);text-align:center;vertical-align:middle}
    .cmp .row td:first-child{text-align:left;color:var(--ink2)}
    .cmp td.hb{background:rgba(13,14,12,.03)}
    .cy{color:var(--teal);font-weight:600;font-size:13px}
    .cn{color:var(--ink5);font-size:13px}
    .cp{font-size:11px;color:var(--ink4);font-style:italic}

    /* add-ons */
    .ao-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
    .ao{background:var(--white);border:1px solid var(--rule);border-radius:var(--r-lg);padding:1.375rem;transition:border-color .15s}
    .ao:hover{border-color:var(--rule-md)}
    .ao-ico{font-size:22px;margin-bottom:8px}
    .ao h4{font-family:var(--fran);font-size:15px;font-weight:500;color:var(--ink);letter-spacing:-.01em;margin-bottom:5px}
    .ao p{font-size:12px;color:var(--ink4);line-height:1.65;margin-bottom:12px}
    .ao-price{font-family:var(--fran);font-size:20px;font-weight:500;color:var(--blue)}
    .ao-price span{font-size:12px;font-family:var(--dm);color:var(--ink4);font-weight:400}

    /* roi band */
    .roi-band{background:rgba(15, 26, 18, 0.9);border:1px solid rgba(119,185,0,0.2); border-radius: 16px;padding:3rem;position:relative;overflow:hidden}
    .roi-band::after{content:'';position:absolute;right:-60px;top:-80px;width:340px;height:340px;border-radius:50%;border:1px solid rgba(255,255,255,.04)}
    .roi-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;max-width:860px;margin:0 auto}
    @media(max-width:640px){.roi-grid{grid-template-columns:1fr;gap:2rem}}
    .roi-text .ey2{color:#8ab4f8;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;display:block;margin-bottom:.5rem}
    .roi-text h3{font-family:var(--fran);font-size:clamp(22px,3vw,32px);font-weight:300;color:var(--ink);line-height:1.25;margin-bottom:.75rem;letter-spacing:-.02em}
    .roi-text h3 em{font-style:italic}
    .roi-text p{font-size:14px;color:var(--ink3);line-height:1.8}
    .roi-items{display:flex;flex-direction:column;gap:12px}
    .roi-item{background:rgba(15, 26, 18, 0.6);border:1px solid rgba(119,185,0,0.2);border-radius:var(--r-lg);padding:1rem 1.25rem}
    .roi-item-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
    .roi-item h5{font-size:13px;font-weight:500;color:var(--ink)}
    .roi-item-val{font-family:var(--fran);font-size:18px;font-weight:500;color:#8ab4f8}
    .roi-item p{font-size:11px;color:var(--ink4);line-height:1.5}

    /* segments */
    .seg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    @media(max-width:680px){.seg-grid{grid-template-columns:1fr}}
    .sg{border-radius:var(--r-xl);padding:2rem;position:relative;overflow:hidden}
    .sg::before{content:'';position:absolute;width:240px;height:240px;border-radius:50%;top:-100px;right:-80px}
    .sg.s1{background:var(--ink)}
    .sg.s1::before{background:radial-gradient(circle,rgba(19,80,232,.4) 0%,transparent 70%)}
    .sg.s2{background:#0b1830}
    .sg.s2::before{background:radial-gradient(circle,rgba(19,80,232,.3) 0%,transparent 70%)}
    .sg.s3{background:#0a1c0e}
    .sg.s3::before{background:radial-gradient(circle,rgba(13,122,94,.4) 0%,transparent 70%)}
    .sg-badge{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:4px 12px;border-radius:20px;display:inline-block;margin-bottom:1rem;position:relative;z-index:1}
    .sg.s1 .sg-badge,.sg.s2 .sg-badge{background:rgba(19,80,232,.2);color:#8ab4f8}
    .sg.s3 .sg-badge{background:rgba(13,122,94,.2);color:#6adfc0}
    .sg h4{font-family:var(--fran);font-size:20px;font-weight:500;color:var(--paper);letter-spacing:-.02em;margin-bottom:.5rem;position:relative;z-index:1}
    .sg p{font-size:12px;color:#5a5b58;line-height:1.7;margin-bottom:1.25rem;position:relative;z-index:1}
    .sg-rec{font-size:12px;font-weight:500;color:var(--paper);background:rgba(255,255,255,.1);padding:5px 14px;border-radius:var(--r);display:inline-block;position:relative;z-index:1}

    /* faq */
    .faq-list{display:flex;flex-direction:column;max-width:700px}
    .fq{border-bottom:1px solid var(--rule)}
    .fq:first-child{border-top:1px solid var(--rule)}
    .fq-q{width:100%;text-align:left;background:transparent;border:none;padding:1.1rem 0;display:flex;justify-content:space-between;align-items:center;gap:1rem;cursor:pointer;font-family:var(--fran);font-size:15px;font-weight:500;color:var(--ink);letter-spacing:-.01em;line-height:1.4}
    .fq-q:hover{color:var(--blue)}
    .fq-ico{width:22px;height:22px;border-radius:50%;background:var(--rule);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;color:var(--ink3);line-height:1;transition:transform .2s,background .2s}
    .fq.open .fq-ico{transform:rotate(45deg);background:var(--blue-lt);color:var(--blue)}
    .fq-a{display:none;padding:0 0 1.1rem;font-size:13px;color:var(--ink3);line-height:1.8}
    .fq.open .fq-a{display:block}

    /* cta */
    .cta-band{background:rgba(10, 15, 11, 0.95);border-top: 1px solid rgba(119,185,0,0.2);padding:5rem 2.5rem;text-align:center;position:relative;overflow:hidden;margin-top:4rem}
    .cta-band::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 60px,rgba(255,255,255,.012) 60px,rgba(255,255,255,.012) 61px)}
    .cta-inner{position:relative;z-index:1;max-width:580px;margin:0 auto}
    .cta-band h2{font-family:var(--fran);font-size:clamp(28px,4vw,44px);font-weight:300;color: #ffffff;line-height:1.2;margin-bottom:1rem;letter-spacing:-.02em}
    .cta-band h2 em{font-style:italic}
    .cta-band p{font-size:15px;color:#9aa09a;line-height:1.75;margin-bottom:2.5rem}
    .cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .btn-paper{font-size:14px;font-weight:600;color: #0A0F0B;background:#77B900;;padding:12px 28px;border-radius:var(--r);text-decoration:none;transition:background .15s}
    .btn-paper:hover{background:var(--white)}
    .btn-ghost-w{font-size:14px;font-weight:400;color:#9aa09a;background:transparent;padding:12px 28px;border-radius:var(--r);border:1px solid rgba(255,255,255,0.15);text-decoration:none;transition:all .15s}
    .btn-ghost-w:hover{color: #ffffff;border-color:#77B900}

    /* dark */
    @media(prefers-color-scheme:dark){
      :root{--ink:#f0efe9;--ink2:#d0cfc6;--ink3:#a0a19c;--ink4:#6b6c68;--ink5:#4a4b47;--paper:#111210;--white:#1c1d1a;--surf:#181917;--rule:rgba(240,239,233,.08);--rule-md:rgba(240,239,233,.14);--blue:#4d7ef7;--blue-lt:rgba(77,126,247,.14);--blue-dk:#7ba7f5;--teal:#3ecaa0;--teal-lt:rgba(62,202,160,.12);--gold:#fbbf24;--gold-lt:rgba(251,191,36,.1);--plum:#b47cff;--plum-lt:rgba(180,124,255,.1)}
      .nav {
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(10,15,11,0.9);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(119,185,0,0.2);
}
      .pc{background:var(--white)}
      .pc.feat{background:#2a2b28}
      .pc.prem{background:#15101e;border-color:rgba(180,124,255,.3)}
      .ao{background:var(--white)}
      .spend-bar{background:var(--white)}
      .sp{background:var(--paper)}
      .cmp thead th{background:var(--white)}
      .cmp thead th.hl{background:#2a2b28}
      .cmp .gr td{background:var(--paper)}
      .cmp .gr td.hb,.cmp td.hb{background:rgba(240,239,233,.03)}
      .cmp .row:hover{background:rgba(240,239,233,.03)}
      .inside-strip{background:var(--white)}
      .roi-band{background:#1a1b18}
      .sg.s1{background:#1c1d1a}
    }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-dots"></div>

        <div className="hero-inner">
          <span className="hero-eyebrow">
            Pricing
          </span>

          <h1>
            The right level of
            <br />
            <em>support</em> for every team
          </h1>

          <p className="hero-lead">
            From self-serve cost visibility to a fully
            operated AI FinOps programme.
          </p>

          <div className="toggle-row">
            <span
              className={`tog-text ${
                billing === "monthly" ? "on" : ""
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </span>

            <div
              className={`tog-track ${
                billing === "annual" ? "active" : ""
              }`}
              onClick={flipBilling}
            >
              <div className="tog-knob"></div>
            </div>

            <span
              className={`tog-text ${
                billing === "annual" ? "on" : ""
              }`}
              onClick={() => setBilling("annual")}
            >
              Annual
            </span>

            <span className="save-chip">
              Save 20%
            </span>
          </div>
        </div>
      </section>
      {/* SPEND SELECTOR */}
<div className="spend-bar">
  <div className="spend-bar-inner">
    <span className="spend-q">
      Monthly AI spend:
    </span>

    <div className="spend-pills">
      <div
        className={`sp ${
          selectedSpend === "free"
            ? "active"
            : ""
        }`}
        onClick={() =>
  handleSpendSelect(
    "free",
    "pc-free"
  )
}
      >
        &lt; $10K
      </div>

      <div
        className={`sp ${
          selectedSpend === "growth"
            ? "active"
            : ""
        }`}
        onClick={() =>
  handleSpendSelect(
    "growth",
    "pc-growth"
  )
}
      >
        $10K – $100K
      </div>

      <div
        className={`sp ${
          selectedSpend === "scale"
            ? "active"
            : ""
        }`}
        onClick={() =>
  handleSpendSelect(
    "scale",
    "pc-scale"
  )
}
      >
        $100K – $500K
      </div>

      <div
        className={`sp ${
          selectedSpend === "enterprise"
            ? "active"
            : ""
        }`}
        onClick={() =>
  handleSpendSelect(
    "enterprise",
    "pc-enterprise"
  )
}
      >
        $500K+
      </div>

      <div
        className={`sp ${
          selectedSpend === "concierge"
            ? "active"
            : ""
        }`}
        onClick={() =>
  handleSpendSelect(
    "concierge",
    "pc-concierge"
  )
}
      >
        Need a team to run it for us
      </div>
    </div>
  </div>
</div>

{/* PLANS WRAPPER */}
<div className="plans-wrap">
  <div className="plans-inner">

    {/* TIER ARCHITECTURE COMMENT KEPT */}

  </div>
</div>
{/* SELF-SERVE PLANS */}
<div className="tier-sep">
  <div className="tier-sep-line"></div>

  <div className="tier-sep-lbl">
    Use the platform yourself
  </div>

  <div className="tier-sep-line"></div>
</div>

<div className="pgrid">

  {/* FREE PLAN */}
  <div className="pc" id="pc-free">

    <div className="pc-tier">
      Starter
    </div>

    <div className="pc-name">
      Free
    </div>

    <div className="pc-tag">
      Get visibility into your AI costs in minutes —
      no commitment.
    </div>

    <div className="pc-price">
      $<span className="v-free">0</span>
    </div>

    <div className="pc-period">
      forever free
    </div>

    <div className="pc-note">
      No credit card required
    </div>

    <span
      className="pc-limit"
      style={{
        background: "var(--surf)",
        color: "var(--ink4)",
      }}
    >
      Up to $10K AI spend / mo
    </span>

    <div className="pc-div"></div>

    <div className="pc-feats">

      <div className="pc-feat">
        <div className="ck y">✓</div>
        3 connected accounts
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Unified cost dashboard
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        7-day cost history
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Basic anomaly alerts
      </div>

      <div className="pc-feat">
        <div className="ck n">—</div>
        Optimization & orchestration
      </div>

      <div className="pc-feat">
        <div className="ck n">—</div>
        Waste elimination
      </div>

    </div>

    <button
  onClick={handleFreePlan}
  className="pc-btn"
>
  Start free
</button>
  </div>

  {/* PLATFORM PLAN */}
  <div className="pc" id="pc-growth">

    <div className="pc-tier">
      Growth
    </div>

    <div className="pc-name">
      Platform
    </div>

    <div className="pc-tag">
      Full platform access for teams managing
      their own AI operations.
    </div>

    <div className="pc-price">
      $
      <span className="v-growth">
        {billing === "monthly" ? "299" : "239"}
      </span>
    </div>

    <div className="pc-period">
      per month, billed{" "}
      <span className="bp">
        {billing}
      </span>
    </div>

    {billing === "annual" ? (
      <div
        className="pc-note sv an-note"
        style={{ color: "var(--teal)" }}
      >
        Save $718 / year on annual
      </div>
    ) : (
      <div className="pc-note mo-note">
        14-day free trial · no card needed
      </div>
    )}

    <span
      className="pc-limit"
      style={{
        background: "var(--blue-lt)",
        color: "var(--blue)",
      }}
    >
      $10K – $100K AI spend / mo
    </span>

    <div className="pc-div"></div>

    <div className="pc-feats">

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Unlimited connected accounts
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Token-level cost attribution
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        90-day history + forecasting
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        ML anomaly detection
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Advisory optimization & orchestration
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Idle resource detection + alerts
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Budget guardrails
      </div>

    </div>

    <button
  onClick={handlePlatformTrial}
  className="pc-btn"
>
  Start 14-day trial
</button>
  </div>

  {/* PLATFORM+ PLAN */}
  <div className="pc feat" id="pc-scale">

    <div className="pop-chip">
      Most popular
    </div>

    <div className="pc-tier">
      Scale
    </div>

    <div className="pc-name">
      Platform+
    </div>

    <div className="pc-tag">
      Full automation for high-growth operations —
      with guided setup included.
    </div>

    <div className="pc-price">
      $
      <span className="v-scale">
        {billing === "monthly" ? "999" : "799"}
      </span>
    </div>

    <div className="pc-period">
      per month, billed{" "}
      <span className="bp">
        {billing}
      </span>
    </div>

    {billing === "annual" ? (
      <div
        className="pc-note sv an-note"
        style={{ color: "#6adfc0" }}
      >
        Save $2,398 / year on annual
      </div>
    ) : (
      <div className="pc-note mo-note">
        Includes onboarding session
      </div>
    )}

    <span
      className="pc-limit"
      style={{
        background: "rgba(19,80,232,.18)",
        color: "#8ab4f8",
      }}
    >
      $100K – $500K AI spend / mo
    </span>

    <div className="pc-div"></div>

    <div className="pc-feats">

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Everything in Platform
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>

        <span>
          <strong>Automated</strong> optimization
          actions
        </span>
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Full multi-cloud orchestration
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>

        <span>
          <strong>Automated</strong> waste
          elimination
        </span>
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Shadow AI discovery
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Chargeback + showback reports
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        RBAC + SSO + quarterly reviews
      </div>

    </div>

    <button
  onClick={handlePlatformPlusTrial}
  className="pc-btn"
>
  Start 14-day trial
</button>
  </div>

</div>
{/* CO-MANAGED PLANS */}
<div
  className="tier-sep"
  style={{ marginTop: "3rem" }}
>
  <div className="tier-sep-line"></div>

  <div className="tier-sep-lbl">
    We configure and co-manage it with you
  </div>

  <div className="tier-sep-line"></div>
</div>

<div className="pgrid2">

  {/* ENTERPRISE */}
  <div className="pc" id="pc-enterprise">

    <div className="pc-tier">
      Enterprise
    </div>

    <div className="pc-name">
      Enterprise
    </div>

    <div className="pc-tag">
      Platform licence + implementation,
      governance setup, and ongoing
      co-management for large organisations.
    </div>

    <div className="pc-price pc-price-sm">
      From $3,000
    </div>

    <div className="pc-period">
      / month · annual contract
    </div>

    <div
      className="pc-note"
      style={{ color: "var(--ink4)" }}
    >
      + one-time implementation from $15K
    </div>

    <span
      className="pc-limit"
      style={{
        background: "var(--gold-lt)",
        color: "var(--gold)",
      }}
    >
      $500K+ AI spend / mo
    </span>

    <div className="pc-div"></div>

    <div className="pc-feats">

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Everything in Platform+
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>

        <span>
          <strong>
            White-glove implementation
          </strong>{" "}
          — we connect, configure, and
          validate everything
        </span>
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Governance framework setup —
        policies, RBAC, audit trails
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Monthly savings review with your
        team
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        BYOK + Private Link + SCIM + SIEM
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Dedicated CSM + 2-hr support SLA
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        99.99% SLA · SOC 2 report · DPA
      </div>

    </div>

    <button
  onClick={handleEnterpriseSales}
  className="pc-btn dk"
>
  Talk to sales
</button>
  </div>

  {/* DATA CENTER */}
  <div className="pc" id="pc-datacenter">

    <div className="pc-tier">
      Infrastructure
    </div>

    <div className="pc-name">
      Data Center
    </div>

    <div className="pc-tag">
      Platform licence + deployment services
      and tenant billing operations for
      colocation and AI cloud operators.
    </div>

    <div className="pc-price pc-price-sm">
      From $5,000
    </div>

    <div className="pc-period">
      / month · GPU-node based pricing
    </div>

    <div
      className="pc-note"
      style={{ color: "var(--ink4)" }}
    >
      + deployment engagement from $20K
    </div>

    <span
      className="pc-limit"
      style={{
        background: "var(--teal-lt)",
        color: "var(--teal)",
      }}
    >
      Per GPU node pricing available
    </span>

    <div className="pc-div"></div>

    <div className="pc-feats">

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Everything in Enterprise
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>

        <span>
          <strong>Agent deployment</strong>{" "}
          across all racks — our team handles
          the rollout
        </span>
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Per-rack, per-tenant hardware
        telemetry
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>

        <span>
          <strong>
            Tenant billing automation
          </strong>{" "}
          — we operate the chargeback cycle
        </span>
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Cooling-aware workload consolidation
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        GPU utilisation reports for tenants
      </div>

      <div className="pc-feat">
        <div className="ck y">✓</div>
        Energy + carbon tracking · idle
        recovery ops
      </div>

    </div>

    <button
  onClick={handleDataCenterTeam}
  className="pc-btn dk"
>
  Talk to our team
</button>
  </div>

</div>
{/* FULLY OPERATED TIER */}
<div
  className="tier-sep"
  style={{ marginTop: "3rem" }}
>
  <div className="tier-sep-line"></div>

  <div className="tier-sep-lbl">
    We run your AI FinOps programme
    end-to-end
  </div>

  <div className="tier-sep-line"></div>
</div>

<div
  id="pc-concierge"
  style={{
    maxWidth: "860px",
    margin: "0 auto",
  }}
>
  <div
    className="pc prem"
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
      alignItems: "start",
    }}
  >

    <div className="new-chip">
      Operated
    </div>

    {/* LEFT SIDE */}
    <div>

      <div className="pc-tier">
        Fully managed
      </div>

      <div className="pc-name">
        Operated
      </div>

      <div className="pc-tag">
        Your dedicated AI FinOps team —
        we monitor, optimise, orchestrate,
        and eliminate waste on your behalf.
        You see the results.
      </div>

      <div
        className="pc-price pc-price-sm"
        style={{ marginTop: ".75rem" }}
      >
        From $8,000
      </div>

      <div className="pc-period">
        / month retainer + performance share
      </div>

      <div
        className="pc-note sv"
        style={{
          display: "block",
          marginTop: ".25rem",
        }}
      >
        Shared savings model available —
        we earn when you save
      </div>

      <span
        className="pc-limit"
        style={{
          background:
            "rgba(90,45,130,.2)",
          color: "#d4aaff",
          marginTop: ".75rem",
          display: "inline-block",
        }}
      >
        Any spend level · custom scoped
      </span>

      <div style={{ marginTop: "1.5rem" }}>
        <a
          href="#"
          className="pc-btn"
          style={{ maxWidth: "200px" }}
        >
          Book a scoping call
        </a>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div>

      <div
        className="pc-div"
        style={{ marginTop: 0 }}
      ></div>

      <div className="pc-feats">

        <div className="pc-feat">
          <div className="ck y">✓</div>

          <span>
            <strong>
              Dedicated AI FinOps analyst
            </strong>{" "}
            — named resource, embedded in
            your workflows
          </span>
        </div>

        <div className="pc-feat">
          <div className="ck y">✓</div>

          <span>
            <strong>
              Weekly cost reviews
            </strong>{" "}
            — we surface findings, explain
            changes, and drive actions
          </span>
        </div>

        <div className="pc-feat">
          <div className="ck y">✓</div>

          <span>
            <strong>
              Active optimisation management
            </strong>{" "}
            — we implement and tune, not
            just advise
          </span>
        </div>

        <div className="pc-feat">
          <div className="ck y">✓</div>

          <span>
            <strong>
              Orchestration operations
            </strong>{" "}
            — scheduling policies, spot
            routing, queue management handled
          </span>
        </div>

        <div className="pc-feat">
          <div className="ck y">✓</div>

          <span>
            <strong>
              Waste elimination sprints
            </strong>{" "}
            — quarterly deep-dives with
            committed savings targets
          </span>
        </div>

        <div className="pc-feat">
          <div className="ck y">✓</div>

          <span>
            <strong>
              Board-ready reporting
            </strong>{" "}
            — monthly AI cost report
            prepared for your CFO / CIO
          </span>
        </div>

        <div className="pc-feat">
          <div className="ck y">✓</div>
          Full platform access included
          for your team
        </div>

        <div className="pc-feat">
          <div className="ck y">✓</div>
          Performance guarantee — agreed
          savings baseline, quarterly
          reconciliation
        </div>

      </div>
    </div>

  </div>
</div>

{/* WHAT'S INCLUDED */}
<div
  className="inside-strip"
  style={{ marginTop: "3rem" }}
>
  <div className="inside-inner">

    <span className="in-lbl">
      Included in every paid plan
    </span>

    <div className="in-items">

      <div className="in-item">
        <div
          className="in-dot"
          style={{
            background: "var(--blue)",
          }}
        ></div>

        📡 Monitoring
      </div>

      <div className="in-item">
        <div
          className="in-dot"
          style={{
            background: "var(--teal)",
          }}
        ></div>

        ⚙️ Optimization
      </div>

      <div className="in-item">
        <div
          className="in-dot"
          style={{
            background: "var(--gold)",
          }}
        ></div>

        🔀 Orchestration
      </div>

      <div className="in-item">
        <div
          className="in-dot"
          style={{
            background: "var(--coral)",
          }}
        ></div>

        🗑️ Waste Elimination
      </div>

      <div className="in-item">
        <div
          className="in-dot"
          style={{
            background: "var(--plum)",
          }}
        ></div>

        🛡️ Governance
      </div>

      <div className="in-item">
        <div
          className="in-dot"
          style={{
            background: "var(--ink4)",
          }}
        ></div>

        🔒 SOC 2 security
      </div>

    </div>
  </div>
</div>

<hr className="div" />
{/* COMPARISON TABLE */}
<div className="wrap">
  <div className="sh">
    <span className="ey">
      Full comparison
    </span>

    <h2>
      Every capability, every plan
    </h2>

    <p>
      Features, automation levels, and engagement depth — across all six tiers.
    </p>
  </div>

  <div className="ovf">

    <table className="cmp">

      <thead>
        <tr>
          <th></th>

          <th>Free</th>

          <th>Platform</th>

          <th className="hl">
            Platform+
          </th>

          <th>Enterprise</th>

          <th>Data Center</th>

          <th>Operated</th>
        </tr>
      </thead>

      <tbody>

        {/* MONITORING */}
<tr className="gr">
  <td colSpan={2}>
    📡 Monitoring
  </td>

  <td></td>

  <td className="hb"></td>

  <td></td>

  <td></td>

  <td></td>
</tr>

<tr className="row">
  <td>Connected accounts</td>

  <td>3</td>

  <td>Unlimited</td>

  <td className="hb">
    Unlimited
  </td>

  <td>Unlimited</td>

  <td>Unlimited</td>

  <td>Unlimited</td>
</tr>

<tr className="row">
  <td>Data freshness</td>

  <td>Daily</td>

  <td>15 min</td>

  <td className="hb">
    15 min
  </td>

  <td>Real-time</td>

  <td>Real-time</td>

  <td>Real-time</td>
</tr>

<tr className="row">
  <td>Cost history</td>

  <td>7 days</td>

  <td>90 days</td>

  <td className="hb">
    12 months
  </td>

  <td>Unlimited</td>

  <td>Unlimited</td>

  <td>Unlimited</td>
</tr>

<tr className="row">
  <td>
    Token-level attribution
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Managed
  </td>
</tr>

<tr className="row">
  <td>
    Anomaly detection
  </td>

  <td>
    <span className="cp">
      Basic
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    ML
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>{" "}
    ML
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Custom
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Custom
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Operated
  </td>
</tr>

<tr className="row">
  <td>
    Cost forecasting
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    + modelled
  </td>
</tr>

<tr className="row">
  <td>
    GPU / hardware telemetry
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Per-rack
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>
</tr>

{/* OPTIMIZATION */}
<tr className="gr">
  <td colSpan={2}>
    ⚙️ Optimization
  </td>

  <td></td>

  <td className="hb"></td>

  <td></td>

  <td></td>

  <td></td>
</tr>

<tr className="row">
  <td>
    Recommendations
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Advisory
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>{" "}
    Automated
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Automated
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Automated
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    We implement
  </td>
</tr>

<tr className="row">
  <td>
    Model routing
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Managed
  </td>
</tr>

<tr className="row">
  <td>
    Auto right-sizing
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>
</tr>

<tr className="row">
  <td>
    Reserved capacity
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Guided
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>{" "}
    Guided
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    We negotiate
  </td>
</tr>

        {/* ORCHESTRATION */}
<tr className="gr">
  <td colSpan={2}>
    🔀 Orchestration
  </td>

  <td></td>

  <td className="hb"></td>

  <td></td>

  <td></td>

  <td></td>
</tr>

<tr className="row">
  <td>
    Workload scheduling
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cp">
      Single cloud
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>{" "}
    Multi-cloud
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Bare-metal
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Operated
  </td>
</tr>

<tr className="row">
  <td>
    Spot / preemptible routing
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Managed
  </td>
</tr>

<tr className="row">
  <td>
    Cross-cloud arbitrage
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>
</tr>

<tr className="row">
  <td>
    Data residency enforcement
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Cryptographic
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>
</tr>

{/* WASTE ELIMINATION */}
<tr className="gr">
  <td colSpan={2}>
    🗑️ Waste elimination
  </td>

  <td></td>

  <td className="hb"></td>

  <td></td>

  <td></td>

  <td></td>
</tr>

<tr className="row">
  <td>
    Idle resource detection
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Alerts
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>{" "}
    Automated
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Automated
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Operated
  </td>
</tr>

<tr className="row">
  <td>
    Zombie job termination
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>
</tr>

<tr className="row">
  <td>
    Shadow AI discovery
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cp">
      Basic
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Managed
  </td>
</tr>

<tr className="row">
  <td>
    Waste elimination sprints
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cp">
      Add-on
    </span>
  </td>

  <td>
    <span className="cp">
      Add-on
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Quarterly
  </td>
</tr>

{/* ENGAGEMENT MODEL */}
<tr className="gr">
  <td colSpan={2}>
    👥 Engagement model
  </td>

  <td></td>

  <td className="hb"></td>

  <td></td>

  <td></td>

  <td></td>
</tr>

<tr className="row">
  <td>
    Onboarding
  </td>

  <td>
    Self-serve
  </td>

  <td>
    Guided docs
  </td>

  <td className="hb">
    Onboarding call
  </td>

  <td>
    White-glove
  </td>

  <td>
    Full deployment
  </td>

  <td>
    We run it
  </td>
</tr>

<tr className="row">
  <td>
    Ongoing reviews
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    Quarterly
  </td>

  <td>
    Monthly
  </td>

  <td>
    Monthly
  </td>

  <td>
    Weekly
  </td>
</tr>

<tr className="row">
  <td>
    Dedicated resource
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cn">
      —
    </span>
  </td>

  <td>
    CSM
  </td>

  <td>
    CSM + engineer
  </td>

  <td>
    Named analyst
  </td>
</tr>

<tr className="row">
  <td>
    Performance guarantee
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Savings SLA
  </td>
</tr>

<tr className="row">
  <td>
    Board / CFO reporting
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    Self-serve
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    We prepare it
  </td>
</tr>
{/* SECURITY & GOVERNANCE */}
<tr className="gr">
  <td colSpan={2}>
    🛡️ Security & governance
  </td>

  <td></td>

  <td className="hb"></td>

  <td></td>

  <td></td>

  <td></td>
</tr>

<tr className="row">
  <td>
    RBAC + SSO
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cp">
      Basic RBAC
    </span>
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>{" "}
    Full
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>
</tr>

<tr className="row">
  <td>
    Audit log retention
  </td>

  <td>
    7 days
  </td>

  <td>
    90 days
  </td>

  <td className="hb">
    12 months
  </td>

  <td>
    Custom
  </td>

  <td>
    Custom
  </td>

  <td>
    Custom
  </td>
</tr>

<tr className="row">
  <td>
    BYOK encryption
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td className="hb">
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>
</tr>

<tr className="row">
  <td>
    SOC 2 report + DPA
  </td>

  <td>
    <span className="cn">
      —
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>{" "}
    DPA only
  </td>

  <td className="hb">
    <span className="cy">
      ✓
    </span>{" "}
    DPA only
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>

  <td>
    <span className="cy">
      ✓
    </span>
  </td>
</tr>

<tr className="row">
  <td>
    Uptime SLA
  </td>

  <td>
    Best effort
  </td>

  <td>
    99.9%
  </td>

  <td className="hb">
    99.9%
  </td>

  <td>
    99.99%
  </td>

  <td>
    99.99%
  </td>

  <td>
    99.99%
  </td>
</tr>

        {/* CONTINUE REMAINING ROWS EXACTLY SAME PATTERN */}

      </tbody>

    </table>

  </div>
</div>

<hr className="div" />
{/* ROI BAND */}
<div className="wrap">

  <div className="roi-band">

    <div className="roi-grid">

      {/* LEFT */}
      <div className="roi-text">

        <span className="ey2">
          Why it pays for itself
        </span>

        <h3>
          The platform pays back
          <br />
          <em>
            within weeks,
          </em>{" "}
          not quarters
        </h3>

        <p style={{ marginTop: ".75rem" }}>
          Whether you run it yourself or
          we run it for you, customers
          consistently recover the platform
          cost in the first billing cycle.
          On the Operated tier, we commit
          to a savings baseline and take a
          share only when we beat it.
        </p>

      </div>

      {/* RIGHT */}
      <div className="roi-items">

        <div className="roi-item">

          <div className="roi-item-top">

            <h5>
              Average payback period
            </h5>

            <span className="roi-item-val">
              &lt; 30 days
            </span>

          </div>

          <p>
            Median time to recover full
            platform cost in identified
            savings across all paid tiers.
          </p>

        </div>

        <div className="roi-item">

          <div className="roi-item-top">

            <h5>
              Average AI cost reduction
            </h5>

            <span className="roi-item-val">
              40%
            </span>

          </div>

          <p>
            Across monitoring,
            optimization, orchestration,
            and waste elimination combined.
          </p>

        </div>

        <div className="roi-item">

          <div className="roi-item-top">

            <h5>
              Operated tier savings range
            </h5>

            <span className="roi-item-val">
              $2M – $12M/yr
            </span>

          </div>

          <p>
            Typical annual savings generated
            for enterprise customers on the
            fully operated programme.
          </p>

        </div>

      </div>

    </div>

  </div>

</div>

<hr className="div" />

{/* ADD-ONS */}
<div className="wrap">

  <div className="sh">

    <span className="ey">
      Add-ons
    </span>

    <h2>
      Extend any plan
    </h2>

    <p>
      Optional capabilities available on
      Platform and above.
    </p>

  </div>

  <div className="ao-grid">

    {/* ADDON 1 */}
    <div className="ao">

      <div className="ao-ico">
        🔬
      </div>

      <h4>
        Prompt cost analytics
      </h4>

      <p>
        Correlate LLM API costs with
        product features and user surfaces.
        Identify your most and least
        cost-efficient experiences.
      </p>

      <div className="ao-price">
        $199 <span>/ month</span>
      </div>

    </div>

    {/* ADDON 2 */}
    <div className="ao">

      <div className="ao-ico">
        🧪
      </div>

      <h4>
        Advanced forecasting
      </h4>

      <p>
        12-month cost modelling with
        scenario analysis, capacity
        planning, and reserved instance
        optimisation recommendations.
      </p>

      <div className="ao-price">
        $149 <span>/ month</span>
      </div>

    </div>

    {/* ADDON 3 */}
    <div className="ao">

      <div className="ao-ico">
        🌿
      </div>

      <h4>
        Carbon & energy tracking
      </h4>

      <p>
        Per-workload energy and CO₂
        tracking, PUE monitoring,
        and GHG Protocol Scope 3
        sustainability reporting.
      </p>

      <div className="ao-price">
        $99 <span>/ month</span>
      </div>

    </div>

    {/* ADDON 4 */}
    <div className="ao">

      <div className="ao-ico">
        📊
      </div>

      <h4>
        BI connector pack
      </h4>

      <p>
        Native connectors for Looker,
        Tableau, Power BI, and Metabase
        with pre-built dashboards and
        data models.
      </p>

      <div className="ao-price">
        $149 <span>/ month</span>
      </div>

    </div>

    {/* ADDON 5 */}
    <div className="ao">

      <div className="ao-ico">
        🏛️
      </div>

      <h4>
        Compliance pack
      </h4>

      <p>
        HIPAA BAA, FedRAMP pre-auth
        support, SOX-ready audit trails,
        and a dedicated compliance
        dashboard.
      </p>

      <div className="ao-price">
        $299 <span>/ month</span>
      </div>

    </div>

    {/* ADDON 6 */}
    <div className="ao">

      <div className="ao-ico">
        ⚡
      </div>

      <h4>
        Waste elimination sprint
      </h4>

      <p>
        A 30-day intensive engagement —
        our team identifies and eliminates
        waste with committed savings
        targets. Available as a one-time
        project on Enterprise and above.
      </p>

      <div className="ao-price">
        From $20,000{" "}
        <span>/ project</span>
      </div>

    </div>

  </div>

</div>

<hr className="div" />
{/* SEGMENTS */}
<div className="wrap">

  <div className="sh">

    <span className="ey">
      Find your fit
    </span>

    <h2>
      Which plan is right for you?
    </h2>

    <p>
      Our recommendation by team type and
      how much involvement you want from us.
    </p>

  </div>

  <div className="seg-grid">

    {/* STARTUPS */}
    <div className="sg s1">

      <span className="sg-badge">
        🚀 Startups
      </span>

      <h4>
        Platform plan
      </h4>

      <p>
        Full visibility, spot routing,
        idle detection, and budget
        guardrails. Run it yourself and
        get instant ROI without enterprise
        complexity.
      </p>

      <span className="sg-rec">
        Platform · $299/mo
      </span>

    </div>

    {/* ENTERPRISE */}
    <div className="sg s2">

      <span className="sg-badge">
        🏢 Enterprise
      </span>

      <h4>
        Platform+ → Operated
      </h4>

      <p>
        Start with Platform+ for full
        automation. Add Enterprise for
        implementation and co-management,
        or move to Operated for maximum
        savings.
      </p>

      <span className="sg-rec">
        Platform+ · $999 or Enterprise+
      </span>

    </div>

    {/* DATA CENTERS */}
    <div className="sg s3">

      <span className="sg-badge">
        🏗️ Data Centers
      </span>

      <h4>
        Data Center plan
      </h4>

      <p>
        Hardware telemetry, per-rack
        billing, tenant isolation, and
        GPU utilisation maximisation —
        deployed and operated by our team.
      </p>

      <span className="sg-rec">
        Data Center · from $5,000/mo
      </span>

    </div>

  </div>

</div>

<hr className="div" />
{/* FAQ */}
<div className="wrap">

  <div className="sh">

    <span className="ey">
      FAQ
    </span>

    <h2>
      Common questions
    </h2>

  </div>

  <div className="faq-list">

    {/* FAQ 1 */}
    <div
      className={`fq ${
        openFaq === 1 ? "open" : ""
      }`}
    >

      <button
        className="fq-q"
        onClick={() =>
          setOpenFaq(
            openFaq === 1 ? null : 1
          )
        }
      >

        How is AI spend under management
        calculated?

        <span className="fq-ico">
          +
        </span>

      </button>

      <div className="fq-a">
        We count the total monthly AI spend
        visible across all connected
        accounts — cloud provider costs,
        direct AI API costs, and on-premises
        GPU infrastructure. You are billed
        for the tier covering your highest
        month in a 3-month rolling window,
        so one spike doesn't permanently
        upgrade your tier.
      </div>

    </div>

    {/* FAQ 2 */}
    <div
      className={`fq ${
        openFaq === 2 ? "open" : ""
      }`}
    >

      <button
        className="fq-q"
        onClick={() =>
          setOpenFaq(
            openFaq === 2 ? null : 2
          )
        }
      >

        What is the difference between
        Platform+ and the Operated tier?

        <span className="fq-ico">
          +
        </span>

      </button>

      <div className="fq-a">
        Platform+ gives your team all the
        tools to run AI FinOps yourselves —
        automation handles the heavy
        lifting. The Operated tier means
        our team runs the programme on your
        behalf: we review, act, report, and
        deliver savings.
      </div>

    </div>

    {/* FAQ 3 */}
    <div
      className={`fq ${
        openFaq === 3 ? "open" : ""
      }`}
    >

      <button
        className="fq-q"
        onClick={() =>
          setOpenFaq(
            openFaq === 3 ? null : 3
          )
        }
      >

        How does the shared savings model
        work on the Operated tier?

        <span className="fq-ico">
          +
        </span>

      </button>

      <div className="fq-a">
        We establish a verified baseline
        of your current AI spend in the
        first 30 days. We charge a monthly
        retainer plus an optional
        performance share of 12–18% of
        net savings generated above the
        baseline.
      </div>

    </div>

    {/* FAQ 4 */}
    <div
      className={`fq ${
        openFaq === 4 ? "open" : ""
      }`}
    >

      <button
        className="fq-q"
        onClick={() =>
          setOpenFaq(
            openFaq === 4 ? null : 4
          )
        }
      >

        What does the Enterprise
        implementation fee cover?

        <span className="fq-ico">
          +
        </span>

      </button>

      <div className="fq-a">
        The one-time implementation fee
        covers scoping, discovery,
        connecting all cloud and AI
        accounts, configuring RBAC,
        governance policies, integrations,
        onboarding, and full setup.
      </div>

    </div>

    {/* FAQ 5 */}
    <div
      className={`fq ${
        openFaq === 5 ? "open" : ""
      }`}
    >

      <button
        className="fq-q"
        onClick={() =>
          setOpenFaq(
            openFaq === 5 ? null : 5
          )
        }
      >

        Can I start on Platform and
        upgrade later?

        <span className="fq-ico">
          +
        </span>

      </button>

      <div className="fq-a">
        Yes — many customers start on
        Platform or Platform+ and later
        upgrade to Operated once they see
        the scale of the opportunity.
      </div>

    </div>

    {/* FAQ 6 */}
    <div
      className={`fq ${
        openFaq === 6 ? "open" : ""
      }`}
    >

      <button
        className="fq-q"
        onClick={() =>
          setOpenFaq(
            openFaq === 6 ? null : 6
          )
        }
      >

        Do you offer startup or
        non-profit discounts?

        <span className="fq-ico">
          +
        </span>

      </button>

      <div className="fq-a">
        Yes — discounts are available for
        non-profits, academic institutions,
        and early-stage startups through
        our Startup Programme.
      </div>

    </div>

  </div>

</div>
{/* CTA SECTION */}
<section className="cta-band">

  <div className="cta-inner">

    <h2>
      Start saving on
      <br />
      <em>AI costs</em> today
    </h2>

    <p>
      Join 500+ teams using our platform
      to monitor, optimise, orchestrate,
      and eliminate waste — at whatever
      level of involvement works for you.
    </p>

    <div className="cta-btns">

      <a
        href="#"
        className="btn-paper"
      >
        Start free — no card needed
      </a>

      <a
        href="#"
        className="btn-ghost-w"
      >
        Book a scoping call
      </a>

    </div>

  </div>

</section>
    </>
  );
};

export default PlanBilling;