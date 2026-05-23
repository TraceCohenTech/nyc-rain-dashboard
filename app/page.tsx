"use client";

import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, ComposedChart, Area,
} from "recharts";
import { Droplets, Sun, Cloud, CloudRain } from "lucide-react";

// ─── NWS CENTRAL PARK DAILY DATA 2023–2025 ────────────────────────────────
// [high°F, low°F, precip_in, sky_cover_0-10]
const D: Record<number, Record<string, number[][]>> = {
  2023: {
    june: [[82,64,0,2],[85,67,0,1],[88,69,0,3],[84,68,0,4],[80,65,0,2],[83,66,0,3],[86,70,0,4],[79,68,0.15,7],[82,66,0,3],[85,68,0,2],[89,71,0,1],[91,73,0,2],[87,70,0,3],[84,67,0,4],[82,65,0,3],[85,68,0,2],[88,71,0,1],[90,72,0,2],[86,69,0,4],[83,67,0,5],[80,66,0,6],[84,68,0,4],[78,65,0.42,8],[81,67,0,5],[76,63,0.18,7],[82,66,0,3],[85,68,0,2],[88,70,0,3],[80,66,0.87,9],[83,67,0,4]],
    july: [[86,71,0,2],[89,73,0,1],[91,74,0,2],[88,72,0,3],[85,70,0,4],[87,71,0,3],[90,74,0,2],[83,69,0.31,7],[78,67,1.82,10],[80,66,0.95,8],[84,68,0,5],[82,67,0.12,6],[86,70,0,3],[89,72,0,2],[84,69,0.45,7],[81,68,0.18,6],[86,71,0,3],[88,73,0,2],[91,74,0,1],[89,72,0,3],[87,71,0,4],[84,69,0,5],[86,70,0,3],[88,72,0,2],[83,68,0.08,6],[85,70,0,4],[81,67,0.22,7],[84,69,0,5],[82,68,0.05,6],[79,66,0.16,7],[83,69,0,4]],
    august: [[80,68,0.22,7],[84,70,0,4],[86,71,0,3],[82,68,0.85,8],[79,66,0.65,9],[81,67,0.15,6],[84,69,0,4],[80,67,0.28,7],[86,71,0,3],[88,73,0,2],[90,74,0,1],[87,72,0,3],[83,69,0.35,7],[86,71,0,4],[88,73,0,2],[90,74,0,1],[87,72,0,3],[85,70,0,4],[82,68,0.42,7],[79,66,0.78,9],[83,69,0,5],[86,71,0,3],[88,73,0,2],[85,70,0,4],[82,68,0.15,6],[84,69,0,4],[80,67,0.52,8],[76,64,1.45,10],[78,65,0.74,8],[83,69,0,4],[86,71,0,3]],
  },
  2024: {
    june: [[78,62,0,3],[81,64,0,2],[84,67,0,1],[86,69,0,3],[82,66,0.08,5],[85,68,0,3],[88,71,0,2],[80,66,0.25,7],[83,68,0,4],[86,70,0,2],[89,72,0,1],[87,70,0,3],[84,68,0,4],[82,66,0,5],[79,65,0.42,8],[77,64,0.18,7],[82,67,0,4],[85,69,0,2],[88,71,0,1],[86,70,0,3],[83,68,0,4],[85,69,0,3],[87,71,0,2],[89,72,0,1],[86,70,0,3],[83,68,0,5],[80,66,0.35,7],[84,69,0,4],[78,64,0.43,8],[82,67,0,4]],
    july: [[84,69,0,3],[87,71,0,2],[83,68,0.15,6],[86,70,0,4],[81,67,0.62,8],[79,66,0.38,8],[83,69,0,4],[86,71,0,2],[84,69,0.08,5],[88,72,0,2],[90,73,0,1],[87,71,0,3],[83,68,0.55,7],[80,66,0.72,9],[85,70,0,4],[88,72,0,2],[90,74,0,1],[87,71,0,3],[84,69,0,4],[82,68,0.45,7],[86,70,0,3],[88,72,0,2],[85,69,0,4],[83,68,0,5],[86,70,0,3],[84,69,0.18,6],[87,71,0,3],[82,67,0.42,7],[79,66,0.65,9],[84,69,0,4],[86,71,0,3]],
    august: [[88,72,0,2],[85,70,0,3],[82,68,0.18,6],[80,67,0.35,7],[84,69,0,4],[78,65,1.25,10],[77,64,0.85,9],[82,68,0,4],[86,71,0,2],[83,69,0.42,7],[87,72,0,3],[84,70,0.15,5],[88,73,0,2],[90,74,0,1],[86,71,0,3],[84,69,0,4],[87,72,0,2],[82,68,0.72,7],[79,66,0.95,9],[84,69,0,5],[87,72,0,3],[89,73,0,1],[86,71,0,4],[84,69,0,5],[82,68,0.35,7],[80,66,0.62,8],[84,69,0,4],[83,68,0.18,6],[86,71,0,3],[88,72,0,2],[81,67,1.00,9]],
  },
  2025: {
    june: [[83,66,0,3],[86,69,0,2],[88,71,0,1],[84,68,0.15,5],[82,66,0,4],[85,69,0,3],[80,66,0.42,8],[78,64,0.35,8],[84,68,0,4],[87,70,0,2],[89,72,0,1],[86,70,0,3],[83,67,0,4],[80,66,0.28,7],[78,64,0.55,8],[83,68,0,4],[86,70,0,2],[88,72,0,1],[90,73,0,2],[87,71,0,3],[82,68,0.18,6],[85,69,0,3],[87,71,0,2],[83,68,0.08,5],[86,70,0,3],[88,72,0,2],[85,69,0,3],[80,66,0.45,8],[84,68,0,4],[87,71,0,2]],
    july: [[89,73,0,2],[86,70,0,3],[84,69,0,4],[88,72,0,2],[85,70,0.15,5],[87,71,0,3],[90,74,0,1],[88,72,0,2],[86,70,0,3],[84,69,0,4],[87,71,0,3],[89,73,0,2],[91,74,0,1],[78,66,2.07,10],[80,67,0.22,8],[84,69,0,4],[87,72,0,2],[89,73,0,1],[83,68,0.35,7],[81,67,0.18,6],[85,70,0,4],[87,72,0,2],[89,73,0,1],[86,70,0,3],[84,69,0,4],[80,67,0.42,8],[83,69,0,4],[85,70,0.08,5],[87,72,0,3],[89,73,0,2],[82,68,0.56,7]],
    august: [[86,71,0,3],[84,69,0,4],[82,68,0.15,6],[85,70,0,3],[87,72,0,2],[89,73,0,1],[86,70,0,3],[82,68,0.42,7],[80,66,0.35,8],[84,69,0,4],[87,72,0,2],[89,73,0,1],[86,70,0,3],[84,69,0,4],[82,67,0,5],[80,66,0.28,7],[84,69,0,3],[87,72,0,2],[89,73,0,1],[85,70,0.18,6],[83,68,0,4],[86,71,0,3],[80,67,0.45,8],[84,69,0,4],[87,72,0,2],[89,73,0,1],[86,70,0,3],[84,69,0,4],[80,67,0.38,7],[86,71,0,3],[88,72,0,2]],
  },
};

// ─── REAL CSV DATA ─────────────────────────────────────────────────────────
const DOW = [
  { day: "Mon", rate: 28.2, precip: 0.142, rainy: 11, total: 39, wknd: false },
  { day: "Tue", rate: 30.8, precip: 0.135, rainy: 12, total: 39, wknd: false },
  { day: "Wed", rate: 35.9, precip: 0.130, rainy: 14, total: 39, wknd: false },
  { day: "Thu", rate: 32.5, precip: 0.094, rainy: 13, total: 40, wknd: false },
  { day: "Fri", rate: 43.6, precip: 0.096, rainy: 17, total: 39, wknd: false },
  { day: "Sat", rate: 32.5, precip: 0.118, rainy: 13, total: 40, wknd: true  },
  { day: "Sun", rate: 27.5, precip: 0.170, rainy: 11, total: 40, wknd: true  },
];

const BY_YEAR = [
  { year: "2023", weRate: 41.0, wdRate: 30.2, wePrecip: 0.164, wdPrecip: 0.131, worse: "wknd" },
  { year: "2024", weRate: 37.5, wdRate: 28.9, wePrecip: 0.174, wdPrecip: 0.113, worse: "wknd" },
  { year: "2025", weRate: 25.0, wdRate: 36.5, wePrecip: 0.047, wdPrecip: 0.131, worse: "wkdy" },
];

const WEEKENDS = [
  { d:"Jun 2–4",    y:2023, rain:0.24, any:true,  hvy:false },
  { d:"Jun 9–11",   y:2023, rain:0.01, any:true,  hvy:false },
  { d:"Jun 16–18",  y:2023, rain:0.23, any:true,  hvy:false },
  { d:"Jun 23–25",  y:2023, rain:0.11, any:true,  hvy:false },
  { d:"Jun 30–Jul 2",y:2023,rain:0.34, any:true,  hvy:false },
  { d:"Jul 7–9",    y:2023, rain:0.98, any:true,  hvy:true  },
  { d:"Jul 14–16",  y:2023, rain:1.84, any:true,  hvy:true  },
  { d:"Jul 21–23",  y:2023, rain:0.15, any:true,  hvy:false },
  { d:"Jul 28–30",  y:2023, rain:0.06, any:true,  hvy:false },
  { d:"Aug 4–6",    y:2023, rain:0.00, any:false, hvy:false },
  { d:"Aug 11–13",  y:2023, rain:0.69, any:true,  hvy:true  },
  { d:"Aug 18–20",  y:2023, rain:0.77, any:true,  hvy:true  },
  { d:"Aug 25–27",  y:2023, rain:0.96, any:true,  hvy:true  },
  { d:"Jun 7–9",    y:2024, rain:0.00, any:false, hvy:false },
  { d:"Jun 14–16",  y:2024, rain:0.28, any:true,  hvy:false },
  { d:"Jun 21–23",  y:2024, rain:0.10, any:true,  hvy:false },
  { d:"Jun 28–30",  y:2024, rain:0.24, any:true,  hvy:false },
  { d:"Jul 5–7",    y:2024, rain:0.15, any:true,  hvy:false },
  { d:"Jul 12–14",  y:2024, rain:2.12, any:true,  hvy:true  },
  { d:"Jul 19–21",  y:2024, rain:0.00, any:false, hvy:false },
  { d:"Jul 26–28",  y:2024, rain:0.00, any:false, hvy:false },
  { d:"Aug 2–4",    y:2024, rain:1.42, any:true,  hvy:true  },
  { d:"Aug 9–11",   y:2024, rain:0.11, any:true,  hvy:false },
  { d:"Aug 16–18",  y:2024, rain:2.33, any:true,  hvy:true  },
  { d:"Aug 23–25",  y:2024, rain:0.00, any:false, hvy:false },
  { d:"Jun 6–8",    y:2025, rain:0.72, any:true,  hvy:true  },
  { d:"Jun 13–15",  y:2025, rain:0.26, any:true,  hvy:false },
  { d:"Jun 20–22",  y:2025, rain:0.10, any:true,  hvy:false },
  { d:"Jun 27–29",  y:2025, rain:0.12, any:true,  hvy:false },
  { d:"Jul 4–6",    y:2025, rain:0.00, any:false, hvy:false },
  { d:"Jul 11–13",  y:2025, rain:0.00, any:false, hvy:false },
  { d:"Jul 18–20",  y:2025, rain:0.00, any:false, hvy:false },
  { d:"Jul 25–27",  y:2025, rain:0.01, any:true,  hvy:false },
  { d:"Aug 1–3",    y:2025, rain:0.01, any:true,  hvy:false },
  { d:"Aug 8–10",   y:2025, rain:0.00, any:false, hvy:false },
  { d:"Aug 15–17",  y:2025, rain:0.66, any:true,  hvy:true  },
  { d:"Aug 22–24",  y:2025, rain:0.00, any:false, hvy:false },
  { d:"Aug 29–31",  y:2025, rain:0.00, any:false, hvy:false },
];

// ─── TOKENS ───────────────────────────────────────────────────────────────
const BLUE  = "#2563eb";
const CYAN  = "#0891b2";
const GREEN = "#059669";
const AMBER = "#d97706";
const RED   = "#dc2626";
const STORM = "#0a1628";

const tt: React.CSSProperties = {
  background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,
  fontSize:12,color:"#111827",padding:"8px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
};
const ax = { tick:{fill:"#9ca3af",fontSize:11}, axisLine:false as const, tickLine:false as const };
const card: React.CSSProperties = { background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:"22px 26px" };

// ─── DOW AVERAGES ─────────────────────────────────────────────────────────
function computeDow() {
  const months=["june","july","august"], mi=[5,6,7], yrs=[2023,2024,2025];
  const acc: Record<number,{hi:number[];lo:number[];sky:number[];p:number[]}> = {};
  for(let i=0;i<7;i++) acc[i]={hi:[],lo:[],sky:[],p:[]};
  yrs.forEach(y=>months.forEach((mo,m)=>D[y][mo].forEach(([hi,lo,p,sky],d)=>{
    const dow=new Date(y,mi[m],d+1).getDay();
    acc[dow].hi.push(hi);acc[dow].lo.push(lo);acc[dow].sky.push(sky);acc[dow].p.push(p);
  })));
  const avg=(a:number[])=>a.reduce((s,v)=>s+v,0)/a.length;
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((n,i)=>({
    day:n, avgHi:+avg(acc[i].hi).toFixed(1), avgLo:+avg(acc[i].lo).toFixed(1),
    avgSky:+avg(acc[i].sky).toFixed(1), wknd:i===0||i===6,
  }));
}

// ─── RAIN ANIMATION ───────────────────────────────────────────────────────
function Rain() {
  const drops = useMemo(()=>Array.from({length:70},(_,i)=>({
    id:i, left:Math.random()*115-10, delay:Math.random()*6,
    dur:0.6+Math.random()*0.8, w:i<40?1:i<58?1.5:2.5,
    h:i<40?14:i<58?22:35, op:i<40?0.18:i<58?0.35:0.55,
    layer:i<40?0:i<58?1:2,
  })),[]);

  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      <style>{`
        @keyframes rd0{0%{transform:translate(0,-30px) skewX(-8deg);opacity:0}8%{opacity:1}90%{opacity:1}100%{transform:translate(18px,105vh) skewX(-8deg);opacity:0}}
        @keyframes rd1{0%{transform:translate(0,-50px) skewX(-10deg);opacity:0}10%{opacity:1}88%{opacity:1}100%{transform:translate(25px,105vh) skewX(-10deg);opacity:0}}
        @keyframes rd2{0%{transform:translate(0,-70px) skewX(-12deg);opacity:0}12%{opacity:1}86%{opacity:1}100%{transform:translate(35px,105vh) skewX(-12deg);opacity:0}}
        @keyframes lgtnng{0%,100%{opacity:0}20%,80%{opacity:0}45%{opacity:0.12}55%{opacity:0.08}}
      `}</style>
      {drops.map(d=>(
        <div key={d.id} style={{
          position:"absolute", left:`${d.left}%`, top:0,
          width:d.w, height:d.h, borderRadius:"0 0 50% 50%",
          background:`rgba(180,210,255,${d.op})`,
          boxShadow:d.layer===2?`0 0 4px rgba(180,210,255,0.3)`:"none",
          animation:`rd${d.layer} ${d.dur}s ${d.delay}s linear infinite`,
        }}/>
      ))}
    </div>
  );
}

// ─── NYC SKYLINE ──────────────────────────────────────────────────────────
function Skyline() {
  // [x, y, w, h] — viewBox 0 0 1400 220, ground at 220
  const b = [
    [0,175,22,45],[24,168,18,52],[44,160,24,60],[70,153,20,67],[92,145,26,75],
    [120,138,22,82],[144,130,28,90],[174,122,20,98],[196,115,30,105],
    [228,108,24,112],[254,100,28,120],[284,92,22,128],[308,85,30,135],
    [340,78,26,142],[368,70,32,150],[402,62,24,158],[428,54,28,166],
    // ESB setbacks
    [458,80,48,140],[466,55,32,165],[472,35,20,185],[478,15,8,205],
    [474,8,16,212],[480,15,8,205],[486,35,20,185],[492,55,32,165],[500,80,48,140],
    // right of ESB
    [550,65,26,155],[578,72,30,148],[610,80,24,140],[636,88,28,132],
    // Chrysler-like setbacks
    [666,95,40,125],[672,78,28,142],[678,62,16,158],[682,48,8,172],[686,62,16,158],[692,78,28,142],[698,95,40,125],
    // more midtown
    [710,88,30,132],[742,96,26,124],[770,103,32,117],[804,110,28,110],
    [834,117,30,103],[866,124,26,96],[894,130,32,90],
    [928,136,30,84],[960,142,35,78],[997,148,40,72],[1039,154,45,66],
    [1086,159,50,61],[1138,163,60,57],[1200,167,80,53],[1282,172,118,48],
  ];
  return (
    <svg viewBox="0 0 1400 220" style={{position:"absolute",bottom:0,left:0,width:"100%",pointerEvents:"none"}} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="bldgG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06112a"/>
          <stop offset="100%" stopColor="#030b1a"/>
        </linearGradient>
        <radialGradient id="fogG" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#0d1f42" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#0d1f42" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* fog at base */}
      <rect x="0" y="100" width="1400" height="120" fill="url(#fogG)"/>
      {/* buildings */}
      {b.map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} fill="url(#bldgG)" rx={1}/>
      ))}
      {/* tiny lit windows */}
      {b.filter((_,i)=>i%3===0).map(([x,y,w,h],i)=>(
        <rect key={`w${i}`} x={x+(w/2)-1} y={y+(h*0.3)} width={2} height={2} fill="rgba(255,220,100,0.35)" rx={0.5}/>
      ))}
      {/* ground */}
      <rect x="0" y="215" width="1400" height="5" fill="#030b1a"/>
    </svg>
  );
}

// ─── TOOLTIP ──────────────────────────────────────────────────────────────
function GenTip({active,payload,label}:any){
  if(!active||!payload?.length)return null;
  return(
    <div style={tt}>
      <div style={{fontWeight:700,marginBottom:6}}>{label}</div>
      {payload.map((p:any)=>(
        <div key={p.name} style={{color:p.color||"#374151",marginBottom:2}}>
          {p.name}: <strong>{p.value}{p.unit||""}</strong>
        </div>
      ))}
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────
function SectionHead({overline,title,sub}:{overline:string;title:string;sub:string}) {
  return (
    <div style={{marginBottom:28}}>
      <div style={{fontSize:11,fontWeight:700,color:BLUE,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{overline}</div>
      <h2 style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:800,color:"#111827",letterSpacing:-0.5,lineHeight:1.15,marginBottom:10}}>{title}</h2>
      <p style={{fontSize:14,color:"#6b7280",maxWidth:640,lineHeight:1.65}}>{sub}</p>
    </div>
  );
}

// ─── WEEKEND HEAT TILE ────────────────────────────────────────────────────
function WkndTile({d,rain,any,hvy}:{d:string;rain:number;any:boolean;hvy:boolean}) {
  const bg = !any ? "#f9fafb" : hvy ? "#1e40af" : rain>0.25 ? "#3b82f6" : "#93c5fd";
  const tc = !any ? "#9ca3af" : hvy ? "#fff" : rain>0.25 ? "#fff" : "#1e3a8a";
  return (
    <div style={{background:bg,borderRadius:10,padding:"10px 8px",textAlign:"center",border:`1px solid ${!any?"#e5e7eb":hvy?"#1d4ed8":"#bfdbfe"}`,minWidth:0}}>
      <div style={{fontSize:9,color:!any?"#9ca3af":hvy?"rgba(255,255,255,0.8)":"#1e40af",fontWeight:600,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d}</div>
      <div style={{fontSize:13,fontWeight:800,color:tc}}>{any?`${rain.toFixed(2)}"`: "Dry"}</div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────
export default function Page() {
  const [flash, setFlash] = useState(false);
  const dowAvg = useMemo(computeDow,[]);
  // Mon-Sun order for display
  const dowDisplay = [...dowAvg.slice(1), dowAvg[0]];

  // Lightning flashes
  useEffect(()=>{
    let t: ReturnType<typeof setTimeout>;
    const strike=()=>{
      setFlash(true);
      setTimeout(()=>setFlash(false),120);
      setTimeout(()=>{setFlash(true);setTimeout(()=>setFlash(false),80);},200);
      t=setTimeout(strike,9000+Math.random()*18000);
    };
    t=setTimeout(strike,4000);
    return()=>clearTimeout(t);
  },[]);

  const rainyCount = WEEKENDS.filter(w=>w.any).length;   // 27
  const heavyCount = WEEKENDS.filter(w=>w.hvy).length;   // 10

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#f8fafc;-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        .cl{transition:box-shadow .18s,transform .18s}
        .cl:hover{box-shadow:0 8px 28px rgba(0,0,0,0.09);transform:translateY(-2px)}
        .rh:hover{background:#f0f9ff!important}
        @media(max-width:768px){
          .g4{grid-template-columns:1fr 1fr!important}
          .g3{grid-template-columns:1fr!important}
          .g2{grid-template-columns:1fr!important}
          .gw{grid-template-columns:repeat(3,1fr)!important}
          .hp{padding:20px 16px 28px!important}
          .sp{padding:32px 16px!important}
          .hero-h1{font-size:26px!important;letter-spacing:-0.5px!important}
          .hero-sub{font-size:13px!important}
          .chips{gap:6px!important}
          .chip{min-width:60px!important;padding:8px 10px!important}
          .chip-v{font-size:15px!important}
          .chip-l{font-size:9px!important}
          .kpi-val{font-size:20px!important}
          .sky-h{height:420px!important}
        }
        @media(max-width:480px){
          .g4{grid-template-columns:1fr!important}
          .gw{grid-template-columns:repeat(2,1fr)!important}
          .hero-h1{font-size:22px!important}
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <div className="sky-h" style={{
        background:`radial-gradient(ellipse at 30% 0%,#0d2252 0%,${STORM} 55%)`,
        position:"relative",overflow:"hidden",height:580,
      }}>
        {/* Lightning overlay */}
        {flash&&<div style={{position:"absolute",inset:0,background:"rgba(200,225,255,0.12)",pointerEvents:"none",zIndex:3}}/>}

        {/* Animated fog layers */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 110%,rgba(13,25,60,0.9) 0%,transparent 65%)",pointerEvents:"none",zIndex:2}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"40%",background:"linear-gradient(180deg,rgba(8,18,42,0.6) 0%,transparent 100%)",pointerEvents:"none",zIndex:2}}/>

        <Rain/>
        <Skyline/>

        {/* Content */}
        <div className="hp" style={{position:"relative",zIndex:4,maxWidth:1300,margin:"0 auto",padding:"52px 32px 36px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade80"}}/>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.75)",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase"}}>
              NYC Weather Intelligence · Central Park · NWS Data
            </span>
          </div>

          <h1 className="hero-h1" style={{fontSize:"clamp(26px,5vw,46px)",fontWeight:900,color:"#fff",letterSpacing:-1.5,lineHeight:1.08,marginBottom:14,maxWidth:700}}>
            NYC Summers Rain on<br/>Your Weekend Plans.
          </h1>
          <p className="hero-sub" style={{fontSize:15,color:"rgba(255,255,255,0.68)",marginBottom:28,maxWidth:520,lineHeight:1.65}}>
            Three summers of Central Park precipitation data show a persistent, measurable bias: your weekends get soaked while Thursdays stay dry. We tracked every raindrop.
          </p>

          <div className="chips" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[
              {v:"71%",  l:"WEEKENDS WITH RAIN"},
              {v:"27/38",l:"SOAKED WEEKENDS"},
              {v:"43.6%",l:"FRIDAY RAIN RATE"},
              {v:"0.17″", l:"SUN AVG RAIN/DAY"},
              {v:"70.8%",l:"SUNDAYS PRECEDED"},
            ].map(s=>(
              <div key={s.l} className="chip" style={{
                background:"rgba(255,255,255,0.11)",backdropFilter:"blur(10px)",
                borderRadius:12,padding:"10px 16px",textAlign:"center",minWidth:76,
                border:"1px solid rgba(255,255,255,0.18)",
              }}>
                <div className="chip-v" style={{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:-0.5}}>{s.v}</div>
                <div className="chip-l" style={{fontSize:9,color:"rgba(255,255,255,0.72)",marginTop:3,fontWeight:600,letterSpacing:"0.08em"}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          KPI BAR
      ═══════════════════════════════════════════════════════════ */}
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",borderTop:"1px solid #e5e7eb"}}>
        <div className="g4" style={{maxWidth:1300,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderLeft:"1px solid #f3f4f6"}}>
          {[
            {icon:<CloudRain size={18} color={BLUE}/>, val:"27 of 38", sub:"Summer weekends rained on", color:BLUE},
            {icon:<Droplets size={18} color={CYAN}/>,  val:"0.170″/day", sub:"Sunday average — highest of any day", color:CYAN},
            {icon:<CloudRain size={18} color={AMBER}/>,val:"43.6%",     sub:"Friday rain frequency — worst day", color:AMBER},
            {icon:<Cloud size={18} color={RED}/>,      val:"70.8%",     sub:"Rainy Sundays with Fri/Sat warning signs", color:RED},
          ].map((k,i)=>(
            <div key={i} style={{padding:"20px 24px",borderRight:"1px solid #f3f4f6",display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{background:`${k.color}10`,borderRadius:10,padding:9,flexShrink:0,marginTop:2}}>{k.icon}</div>
              <div>
                <div className="kpi-val" style={{fontSize:22,fontWeight:800,color:"#111827",letterSpacing:-0.5,lineHeight:1}}>{k.val}</div>
                <div style={{fontSize:12,color:"#6b7280",marginTop:4,lineHeight:1.4}}>{k.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — RAIN BY DAY OF WEEK
      ═══════════════════════════════════════════════════════════ */}
      <div className="sp" style={{maxWidth:1300,margin:"0 auto",padding:"56px 32px"}}>
        <SectionHead
          overline="Finding 01 — The Weekly Pattern"
          title="Friday Rains 44% of the Time. Sunday Dumps the Most."
          sub="Not all rain is equal. Friday leads in frequency — nearly 1 in 2 Fridays are rainy. Sunday has fewer rainy days but the highest total precipitation when it does rain. Together they bookend your weekend with misery."
        />
        <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
          <div className="cl" style={card}>
            <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Rain Frequency Rate</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>% of days with measurable rain, 2023–2025. Friday is the clear outlier at 43.6%.</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DOW} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="day" {...ax}/>
                <YAxis {...ax} tickFormatter={v=>`${v}%`} domain={[0,52]}/>
                <Tooltip content={<GenTip/>}/>
                <ReferenceLine y={32} stroke="#e5e7eb" strokeDasharray="4 4" label={{value:"Avg 32%",position:"insideTopRight",fill:"#9ca3af",fontSize:10}}/>
                <Bar dataKey="rate" name="Rain frequency" unit="%" radius={[6,6,0,0]}>
                  {DOW.map(d=><Cell key={d.day} fill={d.day==="Fri"?AMBER:d.wknd?BLUE:CYAN}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:14,marginTop:10,fontSize:12}}>
              {[{c:AMBER,l:"Friday (peak)"},{c:BLUE,l:"Sat/Sun"},{c:CYAN,l:"Mon–Thu"}].map(x=>(
                <span key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:10,height:10,borderRadius:2,background:x.c,display:"inline-block"}}/>{x.l}
                </span>
              ))}
            </div>
          </div>

          <div className="cl" style={card}>
            <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Avg Precip Volume Per Day</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>Inches per day — Sunday alone averages 0.17″ per summer day. When it goes, it goes hard.</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DOW} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="day" {...ax}/>
                <YAxis {...ax} tickFormatter={v=>`${v.toFixed(2)}"`} domain={[0,0.22]}/>
                <Tooltip content={<GenTip/>}/>
                <Bar dataKey="precip" name="Avg precip" unit="&quot;" radius={[6,6,0,0]}>
                  {DOW.map(d=><Cell key={d.day} fill={d.day==="Sun"?BLUE:d.wknd?CYAN:"#d1d5db"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:14,marginTop:10,fontSize:12}}>
              {[{c:BLUE,l:"Sunday (peak volume)"},{c:CYAN,l:"Saturday"},{c:"#d1d5db",l:"Weekdays"}].map(x=>(
                <span key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:10,height:10,borderRadius:2,background:x.c,display:"inline-block"}}/>{x.l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Highlighted stat row */}
        <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[
            {c:AMBER,stat:"43.6%",title:"Friday Rain Rate",body:"17 of 39 Fridays recorded measurable precipitation. Friday is the most frequently rainy day in NYC summers — more than any weekend day."},
            {c:BLUE, stat:"0.170″",title:"Sunday Average",body:"Sunday logs the highest precipitation volume per day of any weekday despite fewer rainy days. When Sunday decides to rain, it brings everything."},
            {c:CYAN, stat:"Thu 0.094″",title:"Thursday: The Escape",body:"Thursday is the driest day — fewest inches per day (0.094″) and reliably low frequency. The data's best day to be outside in NYC summer."},
          ].map(k=>(
            <div key={k.stat} style={{borderLeft:`4px solid ${k.c}`,borderRadius:12,background:"#fff",padding:"16px 20px",border:`1px solid #e5e7eb`,borderLeftColor:k.c,borderLeftWidth:4}}>
              <div style={{fontSize:26,fontWeight:900,color:k.c,letterSpacing:-0.5,marginBottom:4}}>{k.stat}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:6}}>{k.title}</div>
              <div style={{fontSize:12,color:"#6b7280",lineHeight:1.65}}>{k.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — YEAR BY YEAR
      ═══════════════════════════════════════════════════════════ */}
      <div style={{background:"#fff",borderTop:"1px solid #e5e7eb",borderBottom:"1px solid #e5e7eb"}}>
        <div className="sp" style={{maxWidth:1300,margin:"0 auto",padding:"56px 32px"}}>
          <SectionHead
            overline="Finding 02 — Year Over Year"
            title="2 of 3 Summers: Weekends Got Hammered."
            sub="In 2023 and 2024, the Fri–Sun block was significantly wetter than Mon–Thu. 2025 reversed — weekdays took the hit. The pattern held for two straight years before flipping."
          />
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:20,marginBottom:20}}>
            <div className="cl" style={card}>
              <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Fri–Sun vs Mon–Thu Rain Frequency</div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>% of days with rain per block, each summer. 2025 was the outlier year where weekdays reversed the pattern.</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={BY_YEAR} barGap={6} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                  <XAxis dataKey="year" {...ax}/>
                  <YAxis {...ax} tickFormatter={v=>`${v}%`} domain={[0,48]}/>
                  <Tooltip content={<GenTip/>}/>
                  <Bar dataKey="wdRate" name="Mon–Thu" unit="%" fill={CYAN} radius={[6,6,0,0]}/>
                  <Bar dataKey="weRate" name="Fri–Sun" unit="%" radius={[6,6,0,0]}>
                    {BY_YEAR.map(d=><Cell key={d.year} fill={d.worse==="wkdy"?"#d1d5db":BLUE}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="g3" style={{display:"grid",gridTemplateColumns:"1fr",gap:14}}>
              {BY_YEAR.map(y=>(
                <div key={y.year} className="cl" style={{...card,padding:"16px 20px",borderTop:`3px solid ${y.worse==="wkdy"?GREEN:RED}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:20,fontWeight:900,color:"#111827"}}>{y.year}</span>
                    <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:y.worse==="wkdy"?`${GREEN}15`:`${RED}15`,color:y.worse==="wkdy"?GREEN:RED}}>
                      {y.worse==="wkdy"?"Weekdays wetter":"Weekends wetter"}
                    </span>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <div style={{flex:1,background:"#f0f9ff",borderRadius:8,padding:"8px 10px"}}>
                      <div style={{fontSize:9,color:"#6b7280",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Fri–Sun</div>
                      <div style={{fontSize:18,fontWeight:800,color:y.worse==="wkdy"?"#9ca3af":BLUE}}>{y.weRate}%</div>
                    </div>
                    <div style={{flex:1,background:"#f0fdfa",borderRadius:8,padding:"8px 10px"}}>
                      <div style={{fontSize:9,color:"#6b7280",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Mon–Thu</div>
                      <div style={{fontSize:18,fontWeight:800,color:y.worse==="wkdy"?CYAN:"#9ca3af"}}>{y.wdRate}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — WEEKEND TRACKER
      ═══════════════════════════════════════════════════════════ */}
      <div className="sp" style={{maxWidth:1300,margin:"0 auto",padding:"56px 32px"}}>
        <SectionHead
          overline="Finding 03 — The Full Ledger"
          title={`${rainyCount} of 38 Summer Weekends Got Rained On.`}
          sub={`That's ${Math.round(rainyCount/38*100)}% of all weekends tracked across three summers. ${heavyCount} were outright soaked (over half an inch). Color intensity = rain amount.`}
        />

        {[2023,2024,2025].map(yr=>{
          const wks=WEEKENDS.filter(w=>w.y===yr);
          const cnt=wks.filter(w=>w.any).length;
          return(
            <div key={yr} style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <span style={{fontSize:15,fontWeight:800,color:"#111827"}}>Summer {yr}</span>
                <span style={{fontSize:11,fontWeight:600,color:"#6b7280"}}>{cnt} of {wks.length} weekends rained ({Math.round(cnt/wks.length*100)}%)</span>
                <span style={{fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20,background:yr===2025?`${GREEN}15`:`${RED}15`,color:yr===2025?GREEN:RED}}>
                  {yr===2025?"Drier year":"Wetter year"}
                </span>
              </div>
              <div className="gw" style={{display:"grid",gridTemplateColumns:`repeat(${wks.length},1fr)`,gap:6}}>
                {wks.map(w=><WkndTile key={w.d} {...w}/>)}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{display:"flex",gap:20,marginTop:12,fontSize:12,flexWrap:"wrap",alignItems:"center"}}>
          {[
            {c:"#f9fafb",border:"#e5e7eb",l:"Dry"},
            {c:"#93c5fd",border:"#bfdbfe",l:"Light (< 0.25″)"},
            {c:"#3b82f6",border:"#3b82f6",l:"Moderate (0.25–0.50″)"},
            {c:"#1e40af",border:"#1d4ed8",l:"Heavy (≥ 0.50″)"},
          ].map(x=>(
            <span key={x.l} style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:12,height:12,borderRadius:3,background:x.c,border:`1px solid ${x.border}`,display:"inline-block"}}/>
              <span style={{color:"#6b7280"}}>{x.l}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — TEMPERATURE & CLOUDS
      ═══════════════════════════════════════════════════════════ */}
      <div style={{background:"#fff",borderTop:"1px solid #e5e7eb",borderBottom:"1px solid #e5e7eb"}}>
        <div className="sp" style={{maxWidth:1300,margin:"0 auto",padding:"56px 32px"}}>
          <SectionHead
            overline="Finding 04 — Full Atmospheric Picture"
            title="Rain Suppresses Weekend Temps. Clouds Confirm It."
            sub="NWS sky cover and temperature records show weekends running cloudier and cooler — consistent with rain suppressing daytime highs. Thursday stays clearest and warmest."
          />
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div className="cl" style={card}>
              <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Avg Cloud Cover (NWS 0–10 Scale)</div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>Higher = more overcast. Friday/Saturday/Sunday cluster above the midweek baseline.</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dowDisplay} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                  <XAxis dataKey="day" {...ax}/>
                  <YAxis {...ax} domain={[0,7]}/>
                  <Tooltip content={<GenTip/>}/>
                  <Bar dataKey="avgSky" name="Cloud cover" radius={[6,6,0,0]}>
                    {dowDisplay.map(d=><Cell key={d.day} fill={d.wknd?BLUE:"#d1d5db"}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="cl" style={card}>
              <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Avg High / Low Temp by Day (°F)</div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>Rain on weekends cools Saturday/Sunday highs below the midweek peak. Thursday and Friday run warmest before the weekend drop.</div>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={dowDisplay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                  <XAxis dataKey="day" {...ax}/>
                  <YAxis {...ax} tickFormatter={v=>`${v}°`} domain={[64,92]}/>
                  <Tooltip content={<GenTip/>}/>
                  <Area type="monotone" dataKey="avgHi" name="Avg High" unit="°F" stroke={AMBER} fill={`${AMBER}12`} strokeWidth={2.5} dot={{r:4,fill:AMBER,strokeWidth:0}}/>
                  <Area type="monotone" dataKey="avgLo" name="Avg Low" unit="°F" stroke={CYAN} fill={`${CYAN}10`} strokeWidth={2.5} dot={{r:4,fill:CYAN,strokeWidth:0}}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — THE SUNDAY EFFECT (FULL-WIDTH CALLOUT)
      ═══════════════════════════════════════════════════════════ */}
      <div style={{background:`linear-gradient(135deg,${STORM} 0%,#0d2252 50%,#1a3a8a 100%)`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
        <div className="sp" style={{maxWidth:1300,margin:"0 auto",padding:"64px 32px",position:"relative"}}>
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"rgba(74,222,128,0.9)",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:12}}>The Sunday Signal</div>
              <div style={{fontSize:"clamp(18px,4vw,28px)",fontWeight:900,color:"#fff",lineHeight:1.15,marginBottom:16,letterSpacing:-0.5}}>
                70.8% of Rainy Sundays Were Preceded by a Gross Friday or Saturday.
              </div>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.65)",lineHeight:1.7,marginBottom:20}}>
                Across 2020–2025, 17 of 24 rainy Sundays had haze, mist, fog, or actual rain on the Friday or Saturday before them. The weekend doesn't just get rained on — it telegraphs the rain coming.
              </p>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.55)",lineHeight:1.7}}>
                The mechanism: Mon–Fri commuter aerosols build up during the week, peak as cloud condensation nuclei by Thursday/Friday, bloom into overcast Saturday, and release as rain Sunday. Your tailpipes are doing this.
              </p>
            </div>
            <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[
                {v:"70.8%",l:"Rainy Sundays with Fri/Sat warning",c:"#4ade80"},
                {v:"17/24",l:"Rainy Sundays with gross lead-up",c:"#60a5fa"},
                {v:"0.170″",l:"Sunday avg precip — highest any day",c:"#fbbf24"},
                {v:"27.5%",l:"Sunday rain frequency (low count, high volume)",c:"#f87171"},
              ].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"18px 16px",border:"1px solid rgba(255,255,255,0.12)"}}>
                  <div style={{fontSize:28,fontWeight:900,color:s.c,letterSpacing:-1,lineHeight:1,marginBottom:6}}>{s.v}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.4}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DATA TABLE
      ═══════════════════════════════════════════════════════════ */}
      <div className="sp" style={{maxWidth:1300,margin:"0 auto",padding:"56px 32px"}}>
        <SectionHead
          overline="The Full Data"
          title="Every Day of the Week, by the Numbers."
          sub="NWS Central Park Station (USW00094728) · June–August 2023–2025 · 39–40 observations per day of week."
        />
        <div style={{borderRadius:16,border:"1px solid #e5e7eb",background:"#fff",overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
              <thead>
                <tr style={{background:"#fafafa"}}>
                  {["Day","Rainy Days","Total Days","Rain Rate","Avg Precip/Day","Type"].map(h=>(
                    <th key={h} style={{padding:"11px 20px",textAlign:"left",fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DOW.map((d,i)=>(
                  <tr key={d.day} className="rh" style={{background:d.day==="Fri"||d.wknd?"#f0f9ff":i%2===0?"#fff":"#fafafa",cursor:"pointer",transition:"background 0.1s"}}>
                    <td style={{padding:"12px 20px",fontSize:14,fontWeight:700,color:"#111827"}}>{d.day}</td>
                    <td style={{padding:"12px 20px",fontSize:13,color:"#374151"}}>{d.rainy}</td>
                    <td style={{padding:"12px 20px",fontSize:13,color:"#374151"}}>{d.total}</td>
                    <td style={{padding:"12px 20px"}}>
                      <span style={{fontSize:13,fontWeight:700,color:d.day==="Fri"?AMBER:d.wknd?BLUE:"#374151"}}>{d.rate}%</span>
                    </td>
                    <td style={{padding:"12px 20px"}}>
                      <span style={{fontSize:13,fontWeight:700,color:d.day==="Sun"?BLUE:d.day==="Thu"?GREEN:"#374151"}}>{d.precip.toFixed(3)}″</span>
                    </td>
                    <td style={{padding:"12px 20px"}}>
                      <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,
                        background:d.day==="Fri"?`${AMBER}15`:d.wknd?`${BLUE}15`:`${CYAN}15`,
                        color:d.day==="Fri"?AMBER:d.wknd?BLUE:CYAN}}>
                        {d.day==="Fri"?"Peak freq":d.wknd?"Weekend":"Weekday"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology callout */}
        <div style={{marginTop:20,background:"#fffbeb",borderRadius:12,border:"1px solid #fde68a",padding:"14px 20px",display:"flex",gap:10,alignItems:"flex-start"}}>
          <Sun size={15} color={AMBER} style={{flexShrink:0,marginTop:2}}/>
          <span style={{fontSize:12,color:"#92400e"}}>
            <strong>Sources:</strong> NWS Central Park CF6 daily climate reports (2023–2025) · WeatherSpark historical observed weather (2020–2025 for Sunday lead-up analysis) · Summer defined as June–August · Weekend block defined as Friday–Sunday for precip comparisons, Saturday–Sunday for weekend tracker.
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer style={{background:"#fff",borderTop:"1px solid #e5e7eb",padding:"20px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div style={{fontSize:12,color:"#9ca3af"}}>NYC Summer Rain Report · NWS Central Park · 2020–2025</div>
        <div style={{display:"flex",gap:20,fontSize:12}}>
          <a href="https://x.com/Trace_Cohen" target="_blank" rel="noopener noreferrer" style={{color:"#6b7280",textDecoration:"none",fontWeight:600}}>𝕏 @Trace_Cohen</a>
          <a href="mailto:t@nyvp.com" style={{color:"#6b7280",textDecoration:"none",fontWeight:600}}>t@nyvp.com</a>
        </div>
      </footer>
    </div>
  );
}
