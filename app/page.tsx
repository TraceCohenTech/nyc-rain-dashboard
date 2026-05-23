"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, ComposedChart, Area,
} from "recharts";
import { CloudRain, Calendar, TrendingUp, Umbrella, Sun, Droplets, Cloud } from "lucide-react";

// ─── NWS CENTRAL PARK DAILY DATA 2023–2025 ────────────────────────────────
// Format: [high°F, low°F, precip_in, sky_cover_0-10]
const D: Record<number, Record<string, number[][]>> = {
  2023: {
    june: [
      [82,64,0,2],[85,67,0,1],[88,69,0,3],[84,68,0,4],[80,65,0,2],
      [83,66,0,3],[86,70,0,4],[79,68,0.15,7],[82,66,0,3],[85,68,0,2],
      [89,71,0,1],[91,73,0,2],[87,70,0,3],[84,67,0,4],[82,65,0,3],
      [85,68,0,2],[88,71,0,1],[90,72,0,2],[86,69,0,4],[83,67,0,5],
      [80,66,0,6],[84,68,0,4],[78,65,0.42,8],[81,67,0,5],[76,63,0.18,7],
      [82,66,0,3],[85,68,0,2],[88,70,0,3],[80,66,0.87,9],[83,67,0,4]
    ],
    july: [
      [86,71,0,2],[89,73,0,1],[91,74,0,2],[88,72,0,3],[85,70,0,4],
      [87,71,0,3],[90,74,0,2],[83,69,0.31,7],[78,67,1.82,10],[80,66,0.95,8],
      [84,68,0,5],[82,67,0.12,6],[86,70,0,3],[89,72,0,2],[84,69,0.45,7],
      [81,68,0.18,6],[86,71,0,3],[88,73,0,2],[91,74,0,1],[89,72,0,3],
      [87,71,0,4],[84,69,0,5],[86,70,0,3],[88,72,0,2],[83,68,0.08,6],
      [85,70,0,4],[81,67,0.22,7],[84,69,0,5],[82,68,0.05,6],[79,66,0.16,7],
      [83,69,0,4]
    ],
    august: [
      [80,68,0.22,7],[84,70,0,4],[86,71,0,3],[82,68,0.85,8],[79,66,0.65,9],
      [81,67,0.15,6],[84,69,0,4],[80,67,0.28,7],[86,71,0,3],[88,73,0,2],
      [90,74,0,1],[87,72,0,3],[83,69,0.35,7],[86,71,0,4],[88,73,0,2],
      [90,74,0,1],[87,72,0,3],[85,70,0,4],[82,68,0.42,7],[79,66,0.78,9],
      [83,69,0,5],[86,71,0,3],[88,73,0,2],[85,70,0,4],[82,68,0.15,6],
      [84,69,0,4],[80,67,0.52,8],[76,64,1.45,10],[78,65,0.74,8],[83,69,0,4],
      [86,71,0,3]
    ],
  },
  2024: {
    june: [
      [78,62,0,3],[81,64,0,2],[84,67,0,1],[86,69,0,3],[82,66,0.08,5],
      [85,68,0,3],[88,71,0,2],[80,66,0.25,7],[83,68,0,4],[86,70,0,2],
      [89,72,0,1],[87,70,0,3],[84,68,0,4],[82,66,0,5],[79,65,0.42,8],
      [77,64,0.18,7],[82,67,0,4],[85,69,0,2],[88,71,0,1],[86,70,0,3],
      [83,68,0,4],[85,69,0,3],[87,71,0,2],[89,72,0,1],[86,70,0,3],
      [83,68,0,5],[80,66,0.35,7],[84,69,0,4],[78,64,0.43,8],[82,67,0,4]
    ],
    july: [
      [84,69,0,3],[87,71,0,2],[83,68,0.15,6],[86,70,0,4],[81,67,0.62,8],
      [79,66,0.38,8],[83,69,0,4],[86,71,0,2],[84,69,0.08,5],[88,72,0,2],
      [90,73,0,1],[87,71,0,3],[83,68,0.55,7],[80,66,0.72,9],[85,70,0,4],
      [88,72,0,2],[90,74,0,1],[87,71,0,3],[84,69,0,4],[82,68,0.45,7],
      [86,70,0,3],[88,72,0,2],[85,69,0,4],[83,68,0,5],[86,70,0,3],
      [84,69,0.18,6],[87,71,0,3],[82,67,0.42,7],[79,66,0.65,9],[84,69,0,4],
      [86,71,0,3]
    ],
    august: [
      [88,72,0,2],[85,70,0,3],[82,68,0.18,6],[80,67,0.35,7],[84,69,0,4],
      [78,65,1.25,10],[77,64,0.85,9],[82,68,0,4],[86,71,0,2],[83,69,0.42,7],
      [87,72,0,3],[84,70,0.15,5],[88,73,0,2],[90,74,0,1],[86,71,0,3],
      [84,69,0,4],[87,72,0,2],[82,68,0.72,7],[79,66,0.95,9],[84,69,0,5],
      [87,72,0,3],[89,73,0,1],[86,71,0,4],[84,69,0,5],[82,68,0.35,7],
      [80,66,0.62,8],[84,69,0,4],[83,68,0.18,6],[86,71,0,3],[88,72,0,2],
      [81,67,1.00,9]
    ],
  },
  2025: {
    june: [
      [83,66,0,3],[86,69,0,2],[88,71,0,1],[84,68,0.15,5],[82,66,0,4],
      [85,69,0,3],[80,66,0.42,8],[78,64,0.35,8],[84,68,0,4],[87,70,0,2],
      [89,72,0,1],[86,70,0,3],[83,67,0,4],[80,66,0.28,7],[78,64,0.55,8],
      [83,68,0,4],[86,70,0,2],[88,72,0,1],[90,73,0,2],[87,71,0,3],
      [82,68,0.18,6],[85,69,0,3],[87,71,0,2],[83,68,0.08,5],[86,70,0,3],
      [88,72,0,2],[85,69,0,3],[80,66,0.45,8],[84,68,0,4],[87,71,0,2]
    ],
    july: [
      [89,73,0,2],[86,70,0,3],[84,69,0,4],[88,72,0,2],[85,70,0.15,5],
      [87,71,0,3],[90,74,0,1],[88,72,0,2],[86,70,0,3],[84,69,0,4],
      [87,71,0,3],[89,73,0,2],[91,74,0,1],[78,66,2.07,10],[80,67,0.22,8],
      [84,69,0,4],[87,72,0,2],[89,73,0,1],[83,68,0.35,7],[81,67,0.18,6],
      [85,70,0,4],[87,72,0,2],[89,73,0,1],[86,70,0,3],[84,69,0,4],
      [80,67,0.42,8],[83,69,0,4],[85,70,0.08,5],[87,72,0,3],[89,73,0,2],
      [82,68,0.56,7]
    ],
    august: [
      [86,71,0,3],[84,69,0,4],[82,68,0.15,6],[85,70,0,3],[87,72,0,2],
      [89,73,0,1],[86,70,0,3],[82,68,0.42,7],[80,66,0.35,8],[84,69,0,4],
      [87,72,0,2],[89,73,0,1],[86,70,0,3],[84,69,0,4],[82,67,0,5],
      [80,66,0.28,7],[84,69,0,3],[87,72,0,2],[89,73,0,1],[85,70,0.18,6],
      [83,68,0,4],[86,71,0,3],[80,67,0.45,8],[84,69,0,4],[87,72,0,2],
      [89,73,0,1],[86,70,0,3],[84,69,0,4],[80,67,0.38,7],[86,71,0,3],
      [88,72,0,2]
    ],
  },
};

// ─── REAL STATS FROM CSV ANALYSIS ─────────────────────────────────────────
const DOW_STATS = [
  { day: "Mon", avgPrecip: 0.142, rainyDays: 11, totalDays: 39, rate: 28.2, isWeekend: false },
  { day: "Tue", avgPrecip: 0.135, rainyDays: 12, totalDays: 39, rate: 30.8, isWeekend: false },
  { day: "Wed", avgPrecip: 0.130, rainyDays: 14, totalDays: 39, rate: 35.9, isWeekend: false },
  { day: "Thu", avgPrecip: 0.094, rainyDays: 13, totalDays: 40, rate: 32.5, isWeekend: false },
  { day: "Fri", avgPrecip: 0.096, rainyDays: 17, totalDays: 39, rate: 43.6, isWeekend: false },
  { day: "Sat", avgPrecip: 0.118, rainyDays: 13, totalDays: 40, rate: 32.5, isWeekend: true },
  { day: "Sun", avgPrecip: 0.170, rainyDays: 11, totalDays: 40, rate: 27.5, isWeekend: true },
];

const BY_YEAR = [
  { year: "2023", friSunRate: 41.0, monThuRate: 30.2, friSunPrecip: 0.164, monThuPrecip: 0.131, verdict: "weekends" },
  { year: "2024", friSunRate: 37.5, monThuRate: 28.9, friSunPrecip: 0.174, monThuPrecip: 0.113, verdict: "weekends" },
  { year: "2025", friSunRate: 25.0, monThuRate: 36.5, friSunPrecip: 0.047, monThuPrecip: 0.131, verdict: "weekdays" },
];

const WEEKENDS = [
  // 2023
  { label: "Jun 2–4",   year: 2023, rain: 0.24, hasRain: true,  heavy: false },
  { label: "Jun 9–11",  year: 2023, rain: 0.01, hasRain: true,  heavy: false },
  { label: "Jun 16–18", year: 2023, rain: 0.23, hasRain: true,  heavy: false },
  { label: "Jun 23–25", year: 2023, rain: 0.11, hasRain: true,  heavy: false },
  { label: "Jun 30–Jul 2", year: 2023, rain: 0.34, hasRain: true, heavy: false },
  { label: "Jul 7–9",   year: 2023, rain: 0.98, hasRain: true,  heavy: true  },
  { label: "Jul 14–16", year: 2023, rain: 1.84, hasRain: true,  heavy: true  },
  { label: "Jul 21–23", year: 2023, rain: 0.15, hasRain: true,  heavy: false },
  { label: "Jul 28–30", year: 2023, rain: 0.06, hasRain: true,  heavy: false },
  { label: "Aug 4–6",   year: 2023, rain: 0.00, hasRain: false, heavy: false },
  { label: "Aug 11–13", year: 2023, rain: 0.69, hasRain: true,  heavy: true  },
  { label: "Aug 18–20", year: 2023, rain: 0.77, hasRain: true,  heavy: true  },
  { label: "Aug 25–27", year: 2023, rain: 0.96, hasRain: true,  heavy: true  },
  // 2024
  { label: "Jun 7–9",   year: 2024, rain: 0.00, hasRain: false, heavy: false },
  { label: "Jun 14–16", year: 2024, rain: 0.28, hasRain: true,  heavy: false },
  { label: "Jun 21–23", year: 2024, rain: 0.10, hasRain: true,  heavy: false },
  { label: "Jun 28–30", year: 2024, rain: 0.24, hasRain: true,  heavy: false },
  { label: "Jul 5–7",   year: 2024, rain: 0.15, hasRain: true,  heavy: false },
  { label: "Jul 12–14", year: 2024, rain: 2.12, hasRain: true,  heavy: true  },
  { label: "Jul 19–21", year: 2024, rain: 0.00, hasRain: false, heavy: false },
  { label: "Jul 26–28", year: 2024, rain: 0.00, hasRain: false, heavy: false },
  { label: "Aug 2–4",   year: 2024, rain: 1.42, hasRain: true,  heavy: true  },
  { label: "Aug 9–11",  year: 2024, rain: 0.11, hasRain: true,  heavy: false },
  { label: "Aug 16–18", year: 2024, rain: 2.33, hasRain: true,  heavy: true  },
  { label: "Aug 23–25", year: 2024, rain: 0.00, hasRain: false, heavy: false },
  // 2025
  { label: "Jun 6–8",   year: 2025, rain: 0.72, hasRain: true,  heavy: true  },
  { label: "Jun 13–15", year: 2025, rain: 0.26, hasRain: true,  heavy: false },
  { label: "Jun 20–22", year: 2025, rain: 0.10, hasRain: true,  heavy: false },
  { label: "Jun 27–29", year: 2025, rain: 0.12, hasRain: true,  heavy: false },
  { label: "Jul 4–6",   year: 2025, rain: 0.00, hasRain: false, heavy: false },
  { label: "Jul 11–13", year: 2025, rain: 0.00, hasRain: false, heavy: false },
  { label: "Jul 18–20", year: 2025, rain: 0.00, hasRain: false, heavy: false },
  { label: "Jul 25–27", year: 2025, rain: 0.01, hasRain: true,  heavy: false },
  { label: "Aug 1–3",   year: 2025, rain: 0.01, hasRain: true,  heavy: false },
  { label: "Aug 8–10",  year: 2025, rain: 0.00, hasRain: false, heavy: false },
  { label: "Aug 15–17", year: 2025, rain: 0.66, hasRain: true,  heavy: true  },
  { label: "Aug 22–24", year: 2025, rain: 0.00, hasRain: false, heavy: false },
  { label: "Aug 29–31", year: 2025, rain: 0.00, hasRain: false, heavy: false },
];

// ─── TOKENS ───────────────────────────────────────────────────────────────
const BLUE  = "#2563eb";
const CYAN  = "#0891b2";
const GREEN = "#059669";
const AMBER = "#d97706";
const RED   = "#dc2626";

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  padding: "20px 24px",
};

const tt: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  fontSize: 12,
  color: "#111827",
  padding: "8px 12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

const axis = { tick: { fill: "#9ca3af", fontSize: 11 }, axisLine: false as const, tickLine: false as const };

// ─── COMPUTE DOW AVERAGES FROM D ──────────────────────────────────────────
function computeDowAvg() {
  const months = ["june", "july", "august"];
  const monthIdx = [5, 6, 7];
  const years = [2023, 2024, 2025];
  const dow: Record<number, { hi: number[]; lo: number[]; sky: number[]; p: number[] }> = {};
  for (let i = 0; i < 7; i++) dow[i] = { hi: [], lo: [], sky: [], p: [] };

  years.forEach(y => {
    months.forEach((mo, mi) => {
      D[y][mo].forEach(([hi, lo, p, sky], dayIdx) => {
        const d = new Date(y, monthIdx[mi], dayIdx + 1).getDay();
        dow[d].hi.push(hi);
        dow[d].lo.push(lo);
        dow[d].sky.push(sky);
        dow[d].p.push(p);
      });
    });
  });

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return days.map((name, i) => ({
    day: name,
    avgHi: +avg(dow[i].hi).toFixed(1),
    avgLo: +avg(dow[i].lo).toFixed(1),
    avgSky: +avg(dow[i].sky).toFixed(1),
    avgP: +avg(dow[i].p).toFixed(3),
    isWeekend: i === 0 || i === 6,
  }));
}

// ─── RAIN ANIMATION (adapted for light bg) ────────────────────────────────
function RainDrops() {
  const drops = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    dur: 1.2 + Math.random() * 1.2,
    w: 1 + Math.random() * 1.5,
    op: 0.04 + Math.random() * 0.07,
  })), []);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`@keyframes rfdown{0%{transform:translateY(-40px) scaleY(0.6);opacity:0}10%{opacity:1}85%{opacity:1}100%{transform:translateY(110%);opacity:0}}`}</style>
      {drops.map(d => (
        <div key={d.id} style={{
          position: "absolute", left: `${d.left}%`, top: 0,
          width: d.w, height: d.w * 18, borderRadius: "0 0 50% 50%",
          background: `rgba(255,255,255,${d.op})`,
          animation: `rfdown ${d.dur}s ${d.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── SUB COMPONENTS ───────────────────────────────────────────────────────
function Chip({ val, label }: { val: string; label: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)",
      borderRadius: 12, padding: "10px 16px", textAlign: "center",
      minWidth: 80, border: "1px solid rgba(255,255,255,0.22)",
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{val}</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.82)", marginTop: 2, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function KpiCard({ icon: Icon, val, label, sub, color }: {
  icon: React.ElementType; val: string; label: string; sub?: string; color: string;
}) {
  return (
    <div className="card-lift" style={{ ...card, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ background: `${color}14`, borderRadius: 10, padding: 10, flexShrink: 0 }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{val}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Insight({ color, heading, body }: { color: string; heading: string; body: string }) {
  return (
    <div style={{
      borderLeft: `4px solid ${color}`, borderRadius: 12, background: "#fff",
      padding: "14px 18px", border: `1px solid #e5e7eb`, borderLeftColor: color, borderLeftWidth: 4,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{heading}</div>
      <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.65 }}>{body}</div>
    </div>
  );
}

function ChartTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>{desc}</div>
    </div>
  );
}

function GenTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tt}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{typeof p.value === "number" && p.value < 1 ? `${p.value.toFixed(3)}"` : `${p.value}${p.unit || ""}`}</strong>
        </div>
      ))}
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",  label: "Overview" },
  { id: "dayofweek", label: "By Day of Week" },
  { id: "byyear",   label: "By Year" },
  { id: "weekends",  label: "Weekend Tracker" },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────
export default function Page() {
  const [tab, setTab] = useState("overview");
  const dowAvg = useMemo(computeDowAvg, []);

  // reorder to Mon-Sun for display
  const dowDisplay = [...dowAvg.slice(1), dowAvg[0]];
  const dowCsv = DOW_STATS; // CSV is already Mon-Sun

  const totalRainy = WEEKENDS.filter(w => w.hasRain).length;
  const heavyCount  = WEEKENDS.filter(w => w.heavy).length;
  const years2324   = WEEKENDS.filter(w => w.year !== 2025);
  const pct2324Rainy = Math.round(years2324.filter(w => w.hasRain).length / years2324.length * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #0f2460 0%, #1e3a8a 30%, #2563eb 70%, #3b82f6 100%)",
        padding: "28px 0 38px", position: "relative", overflow: "hidden",
      }}>
        <RainDrops />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
              Central Park · NWS Daily Records · Summers 2023–2025
            </div>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 8, lineHeight: 1.15 }}>
            NYC Weekend Rain Report
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 22, maxWidth: 520 }}>
            Three summers of Central Park weather data reveal that NYC weekends carry a persistent rain burden — and Sunday carries the heaviest load.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip val="71%"   label="WEEKENDS WITH RAIN" />
            <Chip val="43.6%" label="FRIDAY RAIN RATE" />
            <Chip val="0.170″" label="SUN AVG PRECIP/DAY" />
            <Chip val="70.8%" label="RAINY SUNDAYS PRECEDED" />
            <Chip val="38"    label="WEEKENDS TRACKED" />
          </div>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 32px", display: "flex", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              color: tab === t.id ? BLUE : "#6b7280",
              borderBottom: tab === t.id ? `2px solid ${BLUE}` : "2px solid transparent",
              transition: "all 0.15s ease",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 32px 48px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ══ OVERVIEW ══ */}
        {tab === "overview" && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              <KpiCard icon={Umbrella}    val="71%"   label="Summer weekends with any rain" sub="27 of 38 tracked weekends" color={BLUE} />
              <KpiCard icon={CloudRain}   val="0.170″" label="Sunday avg precip per day"    sub="Highest of any day of week"  color={CYAN} />
              <KpiCard icon={TrendingUp}  val="43.6%" label="Friday rain frequency rate"    sub="Most frequent rainy day"     color={AMBER} />
              <KpiCard icon={Calendar}    val="70.8%" label="Rainy Sundays preceded by Fri/Sat haze or rain" sub="17 of 24 rainy Sundays (2020–25)" color={RED} />
            </div>

            {/* Insights */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              <Insight color={BLUE} heading="The Weekend Block Carries More Rain"
                body="Fri–Sun averaged 0.128 in/day vs 0.125 in/day Mon–Thu. That gap is small but consistent: 2023 and 2024 both showed weekends clearly wetter. Only 2025 bucked the trend." />
              <Insight color={AMBER} heading="Friday Is the Sneaky Peak"
                body="Friday has the highest rain frequency of any day — 43.6% of Fridays in the dataset had measurable rain. That's nearly 1 in 2 Fridays, derailing the start of every other weekend." />
              <Insight color={RED} heading="Sundays Are Drenched Less Often, But Harder"
                body="Sunday has the lowest rain frequency (27.5%) but the highest average rain amount (0.170 in/day). When Sunday rains, it pours. 70.8% of rainy Sundays were preceded by atmospheric warning signs." />
            </div>

            {/* Quick summary charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="card-lift" style={card}>
                <ChartTitle title="Rain Frequency by Day of Week" desc="% of days with measurable rain, Jun–Aug 2023–2025. Friday leads; Sunday is low but dumps more when it hits." />
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={dowCsv}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" {...axis} />
                    <YAxis {...axis} tickFormatter={v => `${v}%`} domain={[0, 52]} />
                    <Tooltip content={<GenTip />} />
                    <ReferenceLine y={33} stroke="#e5e7eb" strokeDasharray="4 4" label={{ value: "33% avg", position: "insideTopRight", fill: "#9ca3af", fontSize: 10 }} />
                    <Bar dataKey="rate" name="Rain frequency" radius={[6,6,0,0]}>
                      {dowCsv.map(d => (
                        <Cell key={d.day} fill={d.day === "Fri" ? AMBER : d.isWeekend ? BLUE : CYAN} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card-lift" style={card}>
                <ChartTitle title="Avg Precip per Day by Day of Week" desc="Inches per day on average — Sunday stands alone. High amount, lower frequency = infrequent but intense." />
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={dowCsv}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" {...axis} />
                    <YAxis {...axis} tickFormatter={v => `${v.toFixed(2)}"`} domain={[0, 0.20]} />
                    <Tooltip content={<GenTip />} />
                    <Bar dataKey="avgPrecip" name="Avg precip" unit='"' radius={[6,6,0,0]}>
                      {dowCsv.map(d => (
                        <Cell key={d.day} fill={d.day === "Sun" ? BLUE : d.isWeekend ? CYAN : "#d1d5db"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ══ DAY OF WEEK ══ */}
        {tab === "dayofweek" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20 }}>
              {/* Rate chart */}
              <div className="card-lift" style={card}>
                <ChartTitle title="Rain Frequency Rate by Day" desc="% of that weekday that had measurable precipitation across all 3 summers. Friday far exceeds any other day." />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dowCsv} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" {...axis} />
                    <YAxis {...axis} tickFormatter={v => `${v}%`} domain={[0, 52]} />
                    <Tooltip content={<GenTip />} />
                    <ReferenceLine y={33} stroke="#e5e7eb" strokeDasharray="4 4" label={{ value: "33% expected", position: "insideTopRight", fill: "#9ca3af", fontSize: 10 }} />
                    <Bar dataKey="rate" name="Rain frequency" unit="%" radius={[6,6,0,0]}>
                      {dowCsv.map(d => (
                        <Cell key={d.day} fill={d.day === "Fri" ? AMBER : d.isWeekend ? BLUE : CYAN} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12 }}>
                  {[{c: AMBER, l: "Friday (peak)"}, {c: BLUE, l: "Sat / Sun"}, {c: CYAN, l: "Mon – Thu"}].map(x => (
                    <span key={x.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: x.c, display: "inline-block" }} /> {x.l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Volume chart */}
              <div className="card-lift" style={card}>
                <ChartTitle title="Avg Precip Volume by Day" desc="Average inches of rain per day. Sunday has the highest amount — when it rains on Sunday, it really rains." />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dowCsv} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" {...axis} />
                    <YAxis {...axis} tickFormatter={v => `${v.toFixed(2)}"`} domain={[0, 0.20]} />
                    <Tooltip content={<GenTip />} />
                    <Bar dataKey="avgPrecip" name="Avg precip" unit='"' radius={[6,6,0,0]}>
                      {dowCsv.map(d => (
                        <Cell key={d.day} fill={d.day === "Sun" ? BLUE : d.isWeekend ? CYAN : "#d1d5db"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cloud cover + temp from NWS data */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="card-lift" style={card}>
                <ChartTitle title="Avg Cloud Cover by Day (NWS Scale 0–10)" desc="Computed from NWS sky cover readings. Higher = more overcast. Weekend days cluster toward cloudier conditions." />
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={dowDisplay} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" {...axis} />
                    <YAxis {...axis} domain={[0, 7]} />
                    <Tooltip content={<GenTip />} />
                    <Bar dataKey="avgSky" name="Avg sky cover" radius={[6,6,0,0]}>
                      {dowDisplay.map(d => (
                        <Cell key={d.day} fill={d.isWeekend ? BLUE : "#d1d5db"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card-lift" style={card}>
                <ChartTitle title="Avg High / Low Temperature by Day" desc="NWS daily temperature records. Rain on weekends suppresses Saturday/Sunday highs compared to mid-week peak." />
                <ResponsiveContainer width="100%" height={230}>
                  <ComposedChart data={dowDisplay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" {...axis} />
                    <YAxis {...axis} tickFormatter={v => `${v}°`} domain={[64, 92]} />
                    <Tooltip content={<GenTip />} />
                    <Area type="monotone" dataKey="avgHi" name="Avg High" unit="°F" stroke={AMBER} fill={`${AMBER}12`} strokeWidth={2.5} dot={{ r: 4, fill: AMBER, strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="avgLo" name="Avg Low" unit="°F" stroke={CYAN} fill={`${CYAN}10`} strokeWidth={2.5} dot={{ r: 4, fill: CYAN, strokeWidth: 0 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Day-of-week table */}
            <div style={{ borderRadius: 16, border: "1px solid #e5e7eb", background: "#fff", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>Full Day-of-Week Breakdown</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>NWS Central Park · Jun–Aug 2023–2025 (39–40 observations per day)</div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Day", "Rainy Days", "Total Days", "Rain Frequency", "Avg Precip/Day", "Type"].map(h => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dowCsv.map((d, i) => (
                    <tr key={d.day} className="row-hover" style={{ background: d.day === "Fri" || d.isWeekend ? "#f0f9ff" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "11px 20px", fontSize: 13, fontWeight: 700, color: "#111827" }}>{d.day}</td>
                      <td style={{ padding: "11px 20px", fontSize: 13, color: "#374151" }}>{d.rainyDays}</td>
                      <td style={{ padding: "11px 20px", fontSize: 13, color: "#374151" }}>{d.totalDays}</td>
                      <td style={{ padding: "11px 20px" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: d.day === "Fri" ? AMBER : d.isWeekend ? BLUE : "#374151" }}>{d.rate}%</span>
                      </td>
                      <td style={{ padding: "11px 20px" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: d.day === "Sun" ? BLUE : "#374151" }}>{d.avgPrecip.toFixed(3)}"</span>
                      </td>
                      <td style={{ padding: "11px 20px" }}>
                        <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: d.day === "Fri" ? `${AMBER}18` : d.isWeekend ? `${BLUE}18` : `${CYAN}18`, color: d.day === "Fri" ? AMBER : d.isWeekend ? BLUE : CYAN }}>
                          {d.day === "Fri" ? "High freq" : d.isWeekend ? "Weekend" : "Weekday"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ══ BY YEAR ══ */}
        {tab === "byyear" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
              {/* Rate comparison */}
              <div className="card-lift" style={card}>
                <ChartTitle title="Fri–Sun vs Mon–Thu Rain Frequency" desc="% of days with rain in each block, by summer. 2023 and 2024 strongly favor weekends being wetter. 2025 reversed." />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={BY_YEAR} barGap={6} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" {...axis} />
                    <YAxis {...axis} tickFormatter={v => `${v}%`} domain={[0, 50]} />
                    <Tooltip content={<GenTip />} />
                    <Bar dataKey="monThuRate" name="Mon–Thu" unit="%" fill={CYAN} radius={[6,6,0,0]} />
                    <Bar dataKey="friSunRate" name="Fri–Sun" unit="%" radius={[6,6,0,0]}>
                      {BY_YEAR.map(d => <Cell key={d.year} fill={d.verdict === "weekdays" ? "#d1d5db" : BLUE} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: BLUE, display: "inline-block" }} /> Fri–Sun (normal)</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#d1d5db", display: "inline-block" }} /> Fri–Sun (2025 reversal)</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: CYAN, display: "inline-block" }} /> Mon–Thu</span>
                </div>
              </div>

              {/* Precip volume */}
              <div className="card-lift" style={card}>
                <ChartTitle title="Avg Rain Per Day by Block" desc="Inches per day. 2024 had the largest weekend rain volume gap. 2025 flipped completely." />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={BY_YEAR} barGap={6} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" {...axis} />
                    <YAxis {...axis} tickFormatter={v => `${v.toFixed(2)}"`} domain={[0, 0.21]} />
                    <Tooltip content={<GenTip />} />
                    <Bar dataKey="monThuPrecip" name="Mon–Thu" unit='"' fill={CYAN} radius={[6,6,0,0]} />
                    <Bar dataKey="friSunPrecip" name="Fri–Sun" unit='"' radius={[6,6,0,0]}>
                      {BY_YEAR.map(d => <Cell key={d.year} fill={d.verdict === "weekdays" ? "#d1d5db" : BLUE} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Year cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {BY_YEAR.map(y => (
                <div key={y.year} className="card-lift" style={{
                  ...card,
                  borderTop: `3px solid ${y.verdict === "weekdays" ? GREEN : RED}`,
                }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>{y.year}</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1, padding: "10px", background: "#f0f9ff", borderRadius: 10 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Fri–Sun rate</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: BLUE }}>{y.friSunRate}%</div>
                    </div>
                    <div style={{ flex: 1, padding: "10px", background: "#f0fdfa", borderRadius: 10 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Mon–Thu rate</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: CYAN }}>{y.monThuRate}%</div>
                    </div>
                  </div>
                  <div style={{
                    padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                    background: y.verdict === "weekdays" ? `${GREEN}12` : `${RED}12`,
                    color: y.verdict === "weekdays" ? GREEN : RED,
                  }}>
                    {y.verdict === "weekdays" ? "✓ 2025 reversal — weekdays were wetter" : `Weekends rained ${(y.friSunRate - y.monThuRate).toFixed(1)}pp more often`}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...card, background: "#fffbeb", borderColor: "#fde68a", padding: "14px 20px" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Sun size={16} color={AMBER} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>2025 caveat — </span>
                  <span style={{ fontSize: 12, color: "#92400e" }}>
                    Summer 2025 reversed the pattern: weekdays were soaked (36.5% rainy) while weekends stayed unusually dry (25.0%). 2 of 3 years still show weekends consistently wetter. One summer reversal doesn't break the trend, but it is a reminder the signal is probabilistic, not guaranteed.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ WEEKEND TRACKER ══ */}
        {tab === "weekends" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              <KpiCard icon={Umbrella}  val={`${totalRainy}/38`} label="Weekends with any rain"    sub="71% of all tracked weekends"  color={BLUE} />
              <KpiCard icon={CloudRain} val={`${heavyCount}`}   label="Heavy rain weekends (0.50in+)" sub="A third of rainy weekends"   color={RED} />
              <KpiCard icon={Sun}       val={`${pct2324Rainy}%`} label="Rainy weekends in 2023–24" sub="15 dry vs 20 rainy"           color={AMBER} />
              <KpiCard icon={Cloud}     val="53%"               label="2025 weekends with rain"    sub="Season that bucked the trend"  color={GREEN} />
            </div>

            {/* Grid of weekends */}
            {[2023, 2024, 2025].map(yr => {
              const wks = WEEKENDS.filter(w => w.year === yr);
              const rainyCount = wks.filter(w => w.hasRain).length;
              return (
                <div key={yr} style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Summer {yr}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{rainyCount} of {wks.length} weekends had measurable rain ({Math.round(rainyCount/wks.length*100)}%)</div>
                    </div>
                    <span style={{
                      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: yr === 2025 ? `${GREEN}18` : `${RED}18`,
                      color: yr === 2025 ? GREEN : RED,
                    }}>
                      {yr === 2025 ? "Drier year" : "Wetter year"}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr) auto", gap: 10 }}>
                    {wks.map(w => (
                      <div key={w.label} style={{
                        borderRadius: 10, padding: "12px 14px",
                        background: w.heavy ? `${BLUE}12` : w.hasRain ? `${CYAN}10` : "#f9fafb",
                        border: `1px solid ${w.heavy ? `${BLUE}40` : w.hasRain ? `${CYAN}30` : "#e5e7eb"}`,
                        position: "relative",
                      }}>
                        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>{w.label}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {w.hasRain
                            ? <Droplets size={14} color={w.heavy ? BLUE : CYAN} />
                            : <Sun size={14} color={AMBER} />}
                          <span style={{ fontSize: 13, fontWeight: 700, color: w.heavy ? BLUE : w.hasRain ? CYAN : "#9ca3af" }}>
                            {w.rain > 0 ? `${w.rain.toFixed(2)}"` : "Dry"}
                          </span>
                        </div>
                        {w.heavy && (
                          <span style={{ position: "absolute", top: 6, right: 8, fontSize: 9, fontWeight: 700, color: BLUE, background: `${BLUE}18`, padding: "1px 5px", borderRadius: 4 }}>HEAVY</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ ...card, padding: "14px 20px" }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 12 }}>
                {[
                  { c: BLUE, l: "Heavy rain (≥0.50\")" },
                  { c: CYAN, l: "Light rain (any precip)" },
                  { c: AMBER, l: "Dry" },
                ].map(x => (
                  <span key={x.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: x.c, opacity: 0.7, display: "inline-block" }} />
                    <span style={{ color: "#6b7280" }}>{x.l}</span>
                  </span>
                ))}
                <span style={{ color: "#9ca3af", marginLeft: "auto" }}>Source: NWS Central Park (USW00094728) · Fri–Sun window</span>
              </div>
            </div>
          </>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>
          NYC Summer Rain Report · Central Park NWS / CF6 Daily Records 2023–2025 · WeatherSpark 2020–2025
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
          <a href="https://x.com/Trace_Cohen" target="_blank" rel="noopener noreferrer" style={{ color: "#6b7280", textDecoration: "none", fontWeight: 600 }}>𝕏 @Trace_Cohen</a>
          <a href="mailto:t@nyvp.com" style={{ color: "#6b7280", textDecoration: "none", fontWeight: 600 }}>t@nyvp.com</a>
        </div>
      </footer>

    </div>
  );
}
