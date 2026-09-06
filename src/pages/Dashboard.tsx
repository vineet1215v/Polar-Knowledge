import { useState } from "react";
import { newsItems, events, publications } from "../data";
import {
  knowledgePulse, knowledgeGaps, knowledgeTrends, opportunities, intelligenceFeed,
  type KnowledgeGap, type OpportunityCard as Opp,
} from "../knowledgeData";

import type { WorkspaceSource } from "../workspaceStore";

interface Props { onNavigate: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void; onOpenStudio?: () => void; }

// ── Mini Sparkline ────────────────────────────────────────────
function Sparkline({ value }: { value: number }) {
  const points = [40, 52, 45, 60, value * 0.8, value].map((v, i) => `${i * 18},${80 - v * 0.7}`).join(" ");
  return (
    <svg viewBox="0 0 90 60" className="w-16 h-8">
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── StatCard ──────────────────────────────────────────────────
function StatCard({ icon, value, label, sub, trend, color }: { icon: string; value: string; label: string; sub: string; trend?: string; color: string }) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="kpi-label">{label}</div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: color + "18" }}>{icon}</div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="flex items-center gap-2">
        {trend && <span className="kpi-trend-up">↑ {trend}</span>}
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</span>
      </div>
    </div>
  );
}

// ── Gap Inspect Modal ─────────────────────────────────────────
function GapModal({ gap, onClose, onNavigate }: { gap: KnowledgeGap; onClose: () => void; onNavigate: (p: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="card w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b flex items-start justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1">Potential Repository Coverage Gap</div>
            <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{gap.topic}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: "#fefce8", border: "1px solid #fef08a" }}>
            <div className="font-semibold text-amber-700">Gap Signals</div>
            {gap.signals.map((s, i) => <div key={i} className="flex items-start gap-1.5 text-amber-800"><span>·</span>{s}</div>)}
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="card p-3"><div className="text-[10px] uppercase font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Temporal</div><div style={{ color: "var(--text-primary)" }}>{gap.temporalGap}</div></div>
            <div className="card p-3"><div className="text-[10px] uppercase font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Spatial</div><div style={{ color: "var(--text-primary)" }}>{gap.spatialGap}</div></div>
            <div className="card p-3"><div className="text-[10px] uppercase font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Source Records</div><div className="text-lg font-bold" style={{ color: "var(--accent)" }}>{gap.sourceCount}</div></div>
            <div className="card p-3"><div className="text-[10px] uppercase font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Severity</div><span className={`tag ${gap.severity === "high" ? "tag-orange" : ""}`}>{gap.severity}</span></div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Related Opportunities</div>
            {gap.opportunities.map((o, i) => <div key={i} className="text-xs mb-1 flex items-start gap-1.5" style={{ color: "var(--text-secondary)" }}><span className="text-green-500 mt-0.5">→</span>{o}</div>)}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="btn-primary btn-sm" onClick={() => { onClose(); onNavigate("expeditions"); }}>View Related Expeditions</button>
            <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate("publications"); }}>View Evidence</button>
            <button className="btn-outline btn-sm">Convert to Opportunity</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Opportunity Detail Modal ───────────────────────────────────
function OppModal({ opp, onClose, onNavigate }: { opp: Opp; onClose: () => void; onNavigate: (p: string) => void }) {
  const typeColors: Record<string, string> = { research: "#2563eb", education: "#16a34a", outreach: "#7c3aed", content: "#ea580c" };
  const color = typeColors[opp.type] || "#2563eb";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="card w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b flex items-start justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color }}>
              {opp.type} opportunity · Score {opp.score}/100
            </div>
            <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{opp.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 ml-2">✕</button>
        </div>
        <div className="p-5 space-y-4 text-xs">
          <div className="rounded-lg p-3" style={{ background: color + "11" }}>
            <div className="font-semibold mb-1" style={{ color }}>Why this opportunity?</div>
            <p style={{ color: "var(--text-primary)" }}>{opp.why}</p>
          </div>
          <div>
            <div className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Signals</div>
            {opp.signals.map((s, i) => <div key={i} className="flex items-start gap-1.5 mb-1" style={{ color: "var(--text-secondary)" }}><span style={{ color }}>·</span>{s}</div>)}
          </div>
          <div>
            <div className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Evidence</div>
            {opp.evidence.map((e, i) => <div key={i} className="flex items-start gap-1.5 mb-1" style={{ color: "var(--text-secondary)" }}><span className="text-green-500">✓</span>{e}</div>)}
          </div>
          <div>
            <div className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Related Researchers</div>
            <div className="flex gap-2 flex-wrap">{opp.relatedResearchers.map(r => <span key={r} className="tag">{r}</span>)}</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "#f8fafc" }}>
            <div className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Possible Action</div>
            <p style={{ color: "var(--text-secondary)" }}>{opp.possibleAction}</p>
          </div>
          <div className="text-[10px] italic" style={{ color: "var(--text-muted)" }}>
            This is decision support, not scientific direction. Scoring is based on repository signals only.
          </div>
          <button className="btn-primary btn-sm w-full" onClick={() => { onClose(); onNavigate(opp.type === "education" ? "education" : opp.type === "outreach" || opp.type === "content" ? "news" : "datasets"); }}>
            Take Action →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Map (same as before) ──────────────────────────────────────
const mapStations = [
  { name: "Maitri", x: 52, y: 55 }, { name: "Bharati", x: 72, y: 50 }, { name: "Dakshin Gangotri", x: 46, y: 60 },
];
const mapRoutes = [{ x1: 52, y1: 55, x2: 46, y2: 60 }, { x1: 52, y1: 55, x2: 72, y2: 50 }];

export default function Dashboard({ onNavigate, onOpenStudio }: Props) {
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [inspectGap, setInspectGap] = useState<KnowledgeGap | null>(null);
  const [inspectOpp, setInspectOpp] = useState<Opp | null>(null);
  const [trendDomain, setTrendDomain] = useState("all");
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);

  const exampleQs = ["What is sea ice and why is it important?", "Show Antarctic climate trends", "List Indian Antarctic expeditions", "Explain ocean circulation in simple terms"];

  function askAI(q: string) {
    setAiQuestion(q);
    const answers: Record<string, string> = {
      "What is sea ice and why is it important?": "Sea ice is frozen ocean water that forms and melts seasonally in polar regions. It reflects solar radiation (high albedo), regulates ocean-atmosphere heat exchange, and provides habitat for polar ecosystems.",
      "Show Antarctic climate trends": "Antarctic surface temperatures show regional warming of 0.5–1°C over 50 years. The Southern Ocean has absorbed over 70% of excess global heat. Sea ice reached a record minimum in 2023.",
    };
    setAiAnswer(answers[q] || `NCPOR's knowledge base contains extensive data on "${q}". Browse our Publications, Datasets, and Expedition pages for detailed scientific information.`);
  }

  const filteredTrends = trendDomain === "all" ? knowledgeTrends : knowledgeTrends.filter(t => t.domain.toLowerCase().includes(trendDomain));

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img src="https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=1400&q=80" alt="Antarctic landscape" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(8,21,42,0.9) 0%, rgba(8,21,42,0.35) 100%)" }}/>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <div className="text-blue-300 text-xs font-semibold tracking-wider uppercase mb-1">"From the Poles to a Greener Planet"</div>
          <h1 className="text-3xl font-bold text-white leading-tight">Polar Knowledge Portal</h1>
          <p className="text-blue-200 text-sm mt-1 mb-1 font-medium">Discover | Explore | Learn | Share</p>
          <p className="text-white/70 text-xs max-w-sm">An integrated platform for polar science research, data, expeditions and outreach by NCPOR</p>
          <button className="btn-primary mt-4 w-fit" onClick={() => onNavigate("expeditions")}>Explore Expeditions →</button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon="🚢" value="42" label="Expeditions" sub="Antarctic & Arctic" trend="+2 this year" color="#2563eb"/>
          <StatCard icon="📄" value="1,200+" label="Research Publications" sub="Peer-reviewed" trend="+12%" color="#16a34a"/>
          <StatCard icon="💾" value="350+" label="Scientific Datasets" sub="Open access" trend="+24%" color="#7c3aed"/>
          <StatCard icon="📷" value="5,000+" label="Media Assets" sub="Photos & videos" trend="+16%" color="#ea580c"/>
        </div>

        {/* ── KNOWLEDGE PULSE ───────────────────────────────── */}
        {/* <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot"/>
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Knowledge Pulse</h3>
            </div>
            <button className="text-xs text-blue-600 hover:underline" onClick={() => setIntelligenceOpen(v => !v)}>
              {intelligenceOpen ? "Hide Feed" : "Intelligence Feed →"}
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            {knowledgePulse.map(kp => (
              <div key={kp.id} className="rounded-lg p-3 border" style={{ background: "#f8fafc", borderColor: "var(--border)" }}>
                <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{kp.topic}</div>
                <div className="text-[10px] font-bold" style={{ color: kp.direction === "up" ? "#16a34a" : "#dc2626" }}>{kp.change}</div>
                <div className="text-[10px] mt-1 leading-tight" style={{ color: "var(--text-muted)" }}>{kp.detail}</div>
                <div className="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>{kp.timestamp}</div>
              </div>
            ))} */}
          {/* </div> */}

          {/* Intelligence Feed (expandable) */}
          {/* {intelligenceOpen && (
            <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Intelligence Feed</div>
              {intelligenceFeed.map(item => {
                const typeIcon: Record<string, string> = { insight: "💡", gap: "⚠️", trend: "📈", action: "▶", connection: "🔗", opportunity: "🎯" };
                return (
                  <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg" style={{ background: "#f8fafc" }}>
                    <span className="text-sm flex-shrink-0 mt-0.5">{typeIcon[item.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</span>
                        {item.confidence && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{item.confidence}% conf.</span>}
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-secondary)" }}>{item.detail}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>{item.source} · {item.timestamp}</span>
                        {item.actionLabel && (
                          <button className="text-[10px] font-semibold" style={{ color: "var(--accent)" }} onClick={() => onNavigate(item.actionTarget || "dashboard")}>
                            {item.actionLabel} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )} */}
        {/* </div> */}

        {/* Latest Updates */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Latest Updates</h3>
            <button className="text-xs text-blue-600 font-medium hover:underline" onClick={() => onNavigate("news")}>View All →</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {newsItems.slice(0, 4).map(n => (
              <div key={n.id} className="cursor-pointer group" onClick={() => onNavigate("news")}>
                <div className="rounded-lg overflow-hidden mb-2" style={{ height: 80 }}>
                  <img src={n.thumb} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="text-xs font-medium leading-tight" style={{ color: "var(--text-primary)" }}>{n.title}</div>
                <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{n.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Map + News/Events */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="card lg:col-span-3">
            <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Interactive Polar Map</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Explore expedition routes, research locations and environmental data</p>
                </div>
                <button className="btn-outline btn-sm" onClick={() => onNavigate("map")}>Open Map →</button>
              </div>
            </div>
            <div className="relative" style={{ background: "#c8dff0", height: 260 }}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#b8d4e8"/>
                <path d="M 50 18 C 58 16 68 20 74 28 C 80 36 82 44 80 52 C 78 60 72 66 65 70 C 58 74 50 76 42 74 C 34 72 26 66 22 58 C 18 50 18 40 22 32 C 26 24 34 18 42 16 Z" fill="white" stroke="#dde8f0" strokeWidth="0.5"/>
                <path d="M 42 74 C 50 76 58 74 65 70 L 62 80 L 38 80 Z" fill="#e8f4ff" stroke="#dde8f0" strokeWidth="0.3"/>
                <path d="M 22 32 C 18 28 15 22 16 16 C 17 12 20 10 22 12 C 23 16 22 22 22 32 Z" fill="white" stroke="#dde8f0" strokeWidth="0.5"/>
                {mapRoutes.map((r, i) => <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#2563eb" strokeWidth="0.8" strokeDasharray="2,1" opacity="0.8"/>)}
                {mapStations.map(s => (
                  <g key={s.name}>
                    <circle cx={s.x} cy={s.y} r="2" fill="#ef4444" stroke="white" strokeWidth="0.5"/>
                    <text x={s.x + 2.5} y={s.y + 1} fontSize="2.5" fill="#0f172a" fontWeight="600">{s.name}</text>
                  </g>
                ))}
                <g transform="translate(35, 85)"><circle r="1.5" fill="#22c55e" className="pulse-dot" stroke="white" strokeWidth="0.5"/><text x="2.5" y="0.8" fontSize="2.5" fill="#22c55e" fontWeight="600">MV Sagar Nidhi</text></g>
              </svg>
              <div className="absolute bottom-2 left-2 card px-2 py-1.5 text-[10px] space-y-0.5">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/><span>Research Stations</span></div>
                <div className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600 inline-block" style={{ borderTop: "2px dashed #2563eb" }}/><span>Expedition Routes</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/><span>Active Vessel</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Latest News & Announcements</h3>
                <button className="text-xs text-blue-600 hover:underline" onClick={() => onNavigate("news")}>View All</button>
              </div>
              <div className="space-y-3">
                {newsItems.slice(0, 3).map(n => (
                  <div key={n.id} className="flex items-start gap-3 cursor-pointer group" onClick={() => onNavigate("news")}>
                    <img src={n.thumb} alt={n.title} className="w-14 h-11 object-cover rounded-lg flex-shrink-0"/>
                    <div className="min-w-0">
                      <div className="text-xs font-medium leading-tight group-hover:text-blue-600 transition-colors" style={{ color: "var(--text-primary)" }}>{n.title}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.date}</div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-4 h-4 flex-shrink-0 mt-0.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Upcoming Events</h3>
                <button className="text-xs text-blue-600 hover:underline" onClick={() => onNavigate("events")}>View All</button>
              </div>
              <div className="space-y-2">
                {events.filter(e => e.type === "upcoming").slice(0, 3).map(ev => (
                  <div key={ev.id} className="flex items-center gap-3">
                    <div className="text-center flex-shrink-0 w-9">
                      <div className="text-base font-bold leading-none" style={{ color: "var(--accent)" }}>{ev.day}</div>
                      <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--text-muted)" }}>{ev.month}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium leading-tight" style={{ color: "var(--text-primary)" }}>{ev.title}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{ev.location}</div>
                    </div>
                    <button className="btn-outline btn-sm flex-shrink-0">{ev.action}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── KNOWLEDGE GAPS ─────────────────────────────────── */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Knowledge Coverage & Gaps</h3>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>Potential repository coverage gaps — signals, not scientific absence</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>High
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1"/>Medium
                <span className="w-2 h-2 rounded-full bg-slate-300 inline-block ml-1"/>Low
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {knowledgeGaps.map(gap => (
              <div key={gap.id} className="rounded-lg p-3 border" style={{ background: gap.severity === "high" ? "#fff7ed" : gap.severity === "medium" ? "#fffbeb" : "#f8fafc", borderColor: gap.severity === "high" ? "#fed7aa" : gap.severity === "medium" ? "#fef08a" : "var(--border)" }}>
                <div className="flex items-start justify-between mb-1.5">
                  <div className="text-xs font-semibold leading-tight flex-1 mr-2" style={{ color: "var(--text-primary)" }}>{gap.topic}</div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ background: gap.severity === "high" ? "#ef4444" : gap.severity === "medium" ? "#f59e0b" : "#94a3b8" }}/>
                </div>
                <div className="text-[10px] mb-2" style={{ color: "var(--text-secondary)" }}>{gap.signal}</div>
                <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                  <span>{gap.sourceCount} source{gap.sourceCount !== 1 ? "s" : ""}</span>
                  <span>·</span>
                  <span>{gap.coverage} coverage</span>
                </div>
                <button className="mt-2 text-[10px] font-semibold" style={{ color: "var(--accent)" }} onClick={() => setInspectGap(gap)}>
                  Inspect →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── KNOWLEDGE TRENDS ──────────────────────────────── */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Knowledge Trends</h3>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>Repository & interest signals — not scientific importance rankings</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="filter-select" value={trendDomain} onChange={e => setTrendDomain(e.target.value)}>
                <option value="all">All Domains</option>
                <option value="cryo">Cryosphere</option>
                <option value="ocean">Oceanography</option>
                <option value="bio">Biology</option>
                <option value="glaci">Glaciology</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            {filteredTrends.map(t => (
              <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors" style={{ border: "1px solid var(--border)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{t.topic}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{t.domain}</span>
                    <span className="text-[11px] font-bold" style={{ color: t.direction === "up" ? "#16a34a" : t.direction === "down" ? "#dc2626" : "#94a3b8" }}>
                      {t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→"}
                    </span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.note}</div>
                </div>
                <div className="hidden lg:flex items-center gap-4 text-[10px] flex-shrink-0">
                  {[
                    { label: "Research", val: t.researchActivity },
                    { label: "Content demand", val: t.contentDemand },
                    { label: "Learning", val: t.learningInterest },
                  ].map(m => (
                    <div key={m.label} className="text-center w-16">
                      <div className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>{m.val}</div>
                      <div className="h-1 rounded-full mt-0.5 mb-0.5" style={{ background: "#e2e8f0" }}>
                        <div className="h-full rounded-full" style={{ width: `${m.val}%`, background: "var(--accent)" }}/>
                      </div>
                      <div style={{ color: "var(--text-muted)" }}>{m.label}</div>
                    </div>
                  ))}
                  <Sparkline value={t.researchActivity}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RESEARCH OPPORTUNITIES ────────────────────────── */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Research & Outreach Opportunities</h3>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>Decision support based on repository signals — not prescriptive</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {opportunities.map(opp => {
              const typeColors: Record<string, string> = { research: "#2563eb", education: "#16a34a", outreach: "#7c3aed", content: "#ea580c" };
              const color = typeColors[opp.type];
              return (
                <div key={opp.id} className="rounded-lg p-4 border" style={{ borderColor: "var(--border)", background: color + "08" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color }}>
                        {opp.type} opportunity
                      </div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{opp.title}</div>
                    </div>
                    <div className="flex-shrink-0 ml-2 text-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2" style={{ borderColor: color, color, background: color + "15" }}>{opp.score}</div>
                      <div className="text-[8px] mt-0.5" style={{ color: "var(--text-muted)" }}>score</div>
                    </div>
                  </div>
                  <p className="text-[11px] mb-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{opp.why}</p>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {opp.signals.slice(0, 2).map((s, i) => <span key={i} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: color + "15", color }}>{s}</span>)}
                  </div>
                  <button className="text-[10px] font-semibold" style={{ color }} onClick={() => setInspectOpp(opp)}>
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom 3 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Recent Publications</h3>
              <button className="text-xs text-blue-600 hover:underline" onClick={() => onNavigate("publications")}>View All</button>
            </div>
            <div className="space-y-3">
              {publications.slice(0, 3).map(p => (
                <div key={p.id} className="flex gap-3 items-start">
                  <img src={p.thumb} alt={p.title} className="publication-thumb"/>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium leading-tight" style={{ color: "var(--text-primary)" }}>{p.title}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{p.journal} · {p.year}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.authors}</div>
                    <div className="flex gap-1.5 mt-1.5">
                      <button className="btn-primary btn-sm">View PDF</button>
                      <button className="btn-outline btn-sm" onClick={() => onNavigate("publications")}>Explore</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Media Gallery</h3>
              <button className="text-xs text-blue-600 hover:underline" onClick={() => onNavigate("media")}>View All</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=200&q=80",
                "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=200&q=80",
                "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=200&q=80",
                "https://images.unsplash.com/photo-1672570289260-d430df31d893?w=200&q=80",
              ].map((src, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden cursor-pointer group" style={{ height: 70 }} onClick={() => onNavigate("media")}>
                  <img src={src} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 flex flex-col">
            <div className="mb-3">
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Polar Knowledge Assistant</h3>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>Ask questions, explore insights, and learn from NCPOR's knowledge base.</p>
            </div>
            {aiAnswer && (
              <div className="rounded-lg p-3 mb-3 text-xs leading-relaxed" style={{ background: "#f0f7ff", color: "var(--text-primary)" }}>
                <div className="text-[10px] font-semibold text-blue-600 mb-1">Assistant:</div>
                {aiAnswer}
              </div>
            )}
            <div className="space-y-1 mb-3">
              {exampleQs.slice(0, aiAnswer ? 2 : 4).map((q, i) => (
                <button key={i} onClick={() => askAI(q)} className="w-full text-left text-xs px-3 py-2 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>{q}</button>
              ))}
            </div>
            <div className="mt-auto flex gap-2">
              <input className="search-input flex-1" value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && aiQuestion && askAI(aiQuestion)} placeholder="Ask anything about polar science..."/>
              <button className="btn-primary px-3" onClick={() => onNavigate("ai")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <button className="text-[10px] text-center mt-2 text-blue-600 hover:underline" onClick={() => onNavigate("ai")}>Open Full AI Assistant →</button>
          </div>
        </div>
      </div>

        {/* Recent AI Work */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Recent AI Work</h2>
            <button className="text-[10px] font-semibold" style={{ color: "var(--accent)" }} onClick={() => onOpenStudio?.()}>Open Polar Studio ✨ →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "Antarctic Sea-Ice Research Brief", sources: 3, status: "DRAFT", icon: "📝", tool: "Report", time: "2h ago", dest: "publications" },
              { title: "46th IAE Expedition Slide Deck", sources: 5, status: "UNDER_REVIEW", icon: "📊", tool: "Slides", time: "1d ago", dest: "expeditions" },
              { title: "Sea Ice Climate Education Quiz", sources: 2, status: "APPROVED", icon: "❓", tool: "Quiz", time: "2d ago", dest: "education" },
            ].map(item => (
              <div key={item.title} className="card p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(item.dest)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{item.tool}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${item.status === "APPROVED" ? "bg-green-100 text-green-700" : item.status === "UNDER_REVIEW" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{item.status.replace("_", " ")}</span>
                </div>
                <div className="text-xs font-medium leading-snug mb-1.5" style={{ color: "var(--text-primary)" }}>{item.title}</div>
                <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
                  <span>📎 {item.sources} sources</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Modals */}
      {inspectGap && <GapModal gap={inspectGap} onClose={() => setInspectGap(null)} onNavigate={onNavigate}/>}
      {inspectOpp && <OppModal opp={inspectOpp} onClose={() => setInspectOpp(null)} onNavigate={onNavigate}/>}
    </div>
  );
}
