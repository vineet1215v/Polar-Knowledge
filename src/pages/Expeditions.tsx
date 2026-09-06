import { useState } from "react";
import { expeditions } from "../data";
import { findings, projects } from "../knowledgeData";
import ResearchDNA from "../components/ResearchDNA";
import RelatedKnowledge from "../components/RelatedKnowledge";
import SaveFollowButton from "../components/SaveFollowButton";
import AddToWorkspace from "../components/AddToWorkspace";
import type { WorkspaceSource } from "../workspaceStore";

interface Props { onNavigate: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void; onOpenStudio?: () => void; }

type ExpeditionType = typeof expeditions[0];

function KnowledgeTimeline({ expedition }: { expedition: ExpeditionType }) {
  const steps = [
    { date: expedition.dates.split("–")[0].trim(), label: "Expedition Departure", icon: "🚢", type: "event" },
    { date: "+2 weeks", label: "Station Arrival — Maitri / Bharati", icon: "🏔️", type: "event" },
    { date: "+1 month", label: "Field Observations Begin", icon: "🔬", type: "science" },
    { date: "+2 months", label: "Datasets Collected & Transmitted", icon: "💾", type: "data" },
    { date: "+6 months", label: "Initial Findings Drafted", icon: "📝", type: "finding" },
    { date: "+12 months", label: "Publications Submitted", icon: "📄", type: "publication" },
    { date: "+18 months", label: "Educational Content Created", icon: "🎓", type: "education" },
  ];
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: "var(--accent-light)", border: "2px solid var(--accent)" }}>
              {step.icon}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 h-5 mt-0.5" style={{ background: "var(--border)" }}/>}
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <div className="text-[9px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>{step.date}</div>
            <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{step.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpeditionDetail({ expedition, onClose, onNavigate, onAddToWorkspace, onOpenStudio }: { expedition: ExpeditionType; onClose: () => void; onNavigate: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void; onOpenStudio?: () => void }) {
  const [detailTab, setDetailTab] = useState<"overview" | "dna" | "timeline" | "findings">("overview");
  const expFindings = findings.slice(0, 3);
  const expProjects = projects.filter(p => p.expeditionIds.includes(expedition.id)).slice(0, 3);

  const relatedEntities = [
    { type: "dataset" as const, label: "Antarctic Sea Ice Concentration (2023)", meta: "2.1 GB · Sea Ice" },
    { type: "publication" as const, label: "Changing sea ice dynamics in the Southern Ocean", meta: "Journal of Glaciology · 2024" },
    { type: "station" as const, label: "Maitri Station", meta: "Schirmacher Oasis, Antarctica" },
    { type: "station" as const, label: "Bharati Station", meta: "Prydz Bay, Antarctica" },
    { type: "media" as const, label: "126 Media Assets", meta: "Photos, videos, 360° tours" },
  ];

  return (
    <div className="fixed inset-0 z-40 flex" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="ml-auto w-full max-w-2xl h-full bg-white flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="relative" style={{ height: 160 }}>
            <img src={expedition.image} alt={expedition.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0" style={{ background: "linear-gradient(transparent 40%, rgba(14,31,61,0.85))" }}/>
            <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40">✕</button>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex gap-2 mb-1">
                <span className="tag" style={{ background: expedition.status === "Active" ? "#f0fdf4" : "#f1f5f9", color: expedition.status === "Active" ? "#16a34a" : "#64748b" }}>{expedition.status}</span>
                <span className="tag">{expedition.region}</span>
              </div>
              <h2 className="font-bold text-lg text-white">{expedition.subtitle}</h2>
              <p className="text-white/80 text-xs">{expedition.dates}</p>
            </div>
          </div>
          <div className="tab-bar m-3 mb-0">
            {([["overview","Overview"],["dna","Research DNA"],["timeline","Timeline"],["findings","Findings"]] as const).map(([id,label]) => (
              <button key={id} className={`tab-item ${detailTab === id ? "active" : ""}`} onClick={() => setDetailTab(id)}>{label}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {detailTab === "overview" && (
            <>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{expedition.description} The expedition involved multi-disciplinary research across glaciology, oceanography, atmospheric science, biology and remote sensing at Maitri and Bharati research stations.</p>
              <div>
                <h4 className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>Active Projects</h4>
                <div className="space-y-2">
                  {expProjects.map(proj => (
                    <div key={proj.id} className="card p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{proj.title}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{proj.domain} · PI: {proj.pi}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{proj.datasets} datasets</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{proj.publications} publications</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <RelatedKnowledge entities={relatedEntities} onNavigate={onNavigate}/>
              <div className="flex flex-wrap gap-2">
                <button className="btn-primary btn-sm flex-1" onClick={() => { onClose(); onNavigate("ai"); }}>🤖 Ask Polar →</button>
                <AddToWorkspace source={{ id: `exp-${expedition.id}`, type: "expedition", title: expedition.title, meta: expedition.dates, date: `${expedition.year}`, origin: "NCPOR Expedition Archive" }} onAdd={onAddToWorkspace || (() => {})}/>
                <button className="btn-outline btn-sm" onClick={() => { onClose(); onOpenStudio?.(); }}>✨ Studio</button>
              </div>
              <SaveFollowButton entityId={expedition.id.toString()} entityType="expedition" label="Expedition"/>
            </>
          )}

          {detailTab === "dna" && (
            <ResearchDNA expeditionId={expedition.id} onNavigate={(dest) => { onClose(); onNavigate(dest); }}/>
          )}

          {detailTab === "timeline" && <KnowledgeTimeline expedition={expedition}/>}

          {detailTab === "findings" && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Key findings from publications connected to this expedition. Evidence status reflects assessment against available NCPOR sources.</p>
              {expFindings.map(f => (
                <div key={f.id} className="card p-3 space-y-2">
                  <p className="text-xs leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>{f.text}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`tag ${f.evidenceStatus === "source_backed" ? "tag-green" : f.evidenceStatus === "synthesis" ? "" : "tag-orange"}`}>
                      {f.evidenceStatus === "source_backed" ? "✓ Source-Backed" : f.evidenceStatus === "synthesis" ? "⊕ Synthesis" : "? Insufficient Evidence"}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{f.confidence}% confidence</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{f.domain} · {f.year}</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Source: {f.sourceTitle}</div>
                  <div className="flex gap-1.5">
                    <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate("publications"); }}>View Publication</button>
                    <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate("ai"); }}>Ask Polar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Expeditions({ onNavigate, onAddToWorkspace, onOpenStudio }: Props) {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<ExpeditionType | null>(null);

  const filtered = expeditions.filter(e => {
    if (tab === "antarctic" && e.region !== "Antarctic") return false;
    if (tab === "arctic" && e.region !== "Arctic") return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (year && e.year !== parseInt(year)) return false;
    if (status && e.status !== status) return false;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      <div className="p-6">
        <div className="mb-5">
          <h1 className="page-header-title">Expeditions</h1>
          <p className="page-header-sub">Explore India's journey through the polar regions</p>
        </div>

        <div className="tab-bar w-fit mb-4">
          {[["all","All Expeditions"],["antarctic","Antarctic Expeditions"],["arctic","Arctic Expeditions"]].map(([id, label]) => (
            <button key={id} className={`tab-item ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expeditions..."/>
          </div>
          <select className="filter-select" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">Year</option>
            {[2024,2023,2022,2021,2020,2019].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(exp => (
            <div key={exp.id} className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative overflow-hidden" style={{ height: 160 }}>
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                <div className="absolute top-3 left-3"><span className={`tag ${exp.status === "Active" ? "tag-green" : ""}`}>{exp.status}</span></div>
                <div className="absolute top-3 right-3"><span className="tag" style={{ background: exp.region === "Antarctic" ? "#eff6ff" : "#f0fdf4", color: exp.region === "Antarctic" ? "#2563eb" : "#16a34a" }}>{exp.region}</span></div>
                {/* Research DNA quick-view badge */}
                {exp.id <= 4 && (
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {[["💾","Datasets"],["📄","Pubs"],["🔍","Findings"]].map(([icon, label]) => (
                      <div key={label as string} className="flex-1 text-center rounded px-1 py-0.5 text-[9px] text-white font-semibold" style={{ background: "rgba(14,31,61,0.7)" }}>{icon as string} {label as string}</div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{exp.title}</h3>
                  <span className="text-xs font-semibold ml-2 flex-shrink-0" style={{ color: "var(--accent)" }}>{exp.year}</span>
                </div>
                <div className="text-xs mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>{exp.dates}</div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{exp.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <button className="btn-outline btn-sm flex-1" onClick={() => setSelected(exp)}>View Details →</button>
                  <SaveFollowButton entityId={exp.id.toString()} entityType="expedition" compact/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center" style={{ color: "var(--text-muted)" }}>
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-sm">No expeditions found matching your filters.</div>
          </div>
        )}
      </div>

      {selected && <ExpeditionDetail expedition={selected} onClose={() => setSelected(null)} onNavigate={onNavigate} onAddToWorkspace={onAddToWorkspace} onOpenStudio={onOpenStudio}/>}
    </div>
  );
}
