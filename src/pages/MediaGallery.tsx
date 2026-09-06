import { useState } from "react";
import { mediaItems } from "../data";
import AddToWorkspace from "../components/AddToWorkspace";
import type { WorkspaceSource } from "../workspaceStore";

type Tab = "photo" | "video" | "360";

function MediaIntelligencePanel({ item, onClose, onNavigate, onAddToWorkspace }: { item: typeof mediaItems[0]; onClose: () => void; onNavigate?: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void }) {
  const [aiTab, setAiTab] = useState<"context" | "ai" | "story">("context");

  const suggestions = [
    { field: "Caption", current: item.title, suggested: `${item.title} — documented during ${item.expedition} at ${item.location}. Part of NCPOR's ongoing polar monitoring programme.`, confidence: 78 },
    { field: "Topics", current: "Not tagged", suggested: "Sea ice, Polar landscape, Antarctic environment, NCPOR research", confidence: 85 },
    { field: "Related Publication", current: "Not linked", suggested: "Changing sea ice dynamics in the Southern Ocean (2024)", confidence: 62 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)" }} onClick={onClose}>
      <div className="w-full max-w-3xl mx-4 flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Image */}
        <div className="relative flex-1" style={{ minHeight: 300 }}>
          <img src={item.image} alt={item.title} className="w-full h-full object-cover"/>
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40">✕</button>
          <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
            <div className="text-white font-semibold text-sm">{item.title}</div>
            <div className="text-white/70 text-xs">{item.location} · {item.expedition}</div>
          </div>
        </div>

        {/* Panel */}
        <div className="w-72 flex-shrink-0 bg-white flex flex-col overflow-hidden">
          <div className="tab-bar m-3 mb-0">
            {([["context","Science Context"],["ai","AI Suggestions"],["story","Story"]] as const).map(([id, label]) => (
              <button key={id} className={`tab-item flex-1 ${aiTab === id ? "active" : ""}`} onClick={() => setAiTab(id)}>{label}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {aiTab === "context" && (
              <>
                <div>
                  <div className="text-[10px] uppercase font-semibold mb-2" style={{ color: "var(--text-muted)" }}>What does this media document?</div>
                  <div className="text-xs leading-relaxed p-2.5 rounded" style={{ background: "#f0f7ff", color: "var(--text-primary)" }}>
                    This image records {item.type === "photo" ? "photographic evidence of" : "footage from"} {item.title.toLowerCase()} observed during {item.expedition}. It contributes to the visual scientific archive of NCPOR's polar monitoring activities.
                  </div>
                </div>
                <div className="space-y-2">
                  {[["Expedition", item.expedition],["Location", item.location],["Media Type", item.type.toUpperCase()],["Rights","CC BY-NC 4.0 (illustrative)"],["Access","Open"]].map(([k,v]) => (
                    <div key={k as string} className="flex justify-between text-[10px]">
                      <span className="font-semibold" style={{ color: "var(--text-muted)" }}>{k as string}</span>
                      <span style={{ color: "var(--text-primary)" }}>{v as string}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-semibold" style={{ color: "var(--text-muted)" }}>Connected Knowledge</div>
                  {[{ icon: "📄", label: "View Related Publication", dest: "publications" }, { icon: "💾", label: "View Related Dataset", dest: "datasets" }, { icon: "🚢", label: "View Expedition", dest: "expeditions" }].map(l => (
                    <button key={l.label} onClick={() => { onClose(); onNavigate?.(l.dest); }} className="w-full flex items-center gap-2 p-2 rounded text-[10px] hover:bg-slate-50 transition-colors" style={{ color: "var(--accent)" }}>
                      <span>{l.icon}</span>{l.label} →
                    </button>
                  ))}
                  <AddToWorkspace source={{ id: `media-${item.id}`, type: "media", title: item.title, meta: `${item.expedition} · ${item.location}`, origin: "NCPOR Media Archive" }} onAdd={onAddToWorkspace || (() => {})}/>
                </div>
              </>
            )}

            {aiTab === "ai" && (
              <div className="space-y-3">
                <div className="text-[10px] p-2 rounded" style={{ background: "#fefce8", color: "#92400e" }}>
                  ⚠️ AI suggestions — marked as suggestions. Human review required before updating official metadata.
                </div>
                {suggestions.map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>{s.field}</div>
                    <div className="text-[10px] line-through" style={{ color: "var(--text-muted)" }}>{s.current}</div>
                    <div className="text-[10px] p-2 rounded" style={{ background: "#f0f7ff", color: "var(--text-primary)" }}>
                      ✨ {s.suggested}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>AI · {s.confidence}% conf.</span>
                      <div className="flex gap-1">
                        <button className="text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-700">Accept</button>
                        <button className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aiTab === "story" && (
              <div className="space-y-3">
                <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Create a source-grounded scientific story using this asset and related records.</div>
                <div className="card p-2 text-[10px]">
                  <div className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Story Package</div>
                  <div className="space-y-1" style={{ color: "var(--text-secondary)" }}>
                    <div>📸 This image</div>
                    <div>💾 + Sea Ice dataset (2023)</div>
                    <div>📄 + Publication: sea ice dynamics</div>
                    <div>🔍 + Finding F1 (94% confidence)</div>
                  </div>
                </div>
                <button className="btn-primary btn-sm w-full" onClick={() => { onClose(); onNavigate?.("news"); }}>
                  ✨ Create Outreach Package →
                </button>
                <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>Generated packages enter draft status and require review before publication.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MediaGallery({ onNavigate, onAddToWorkspace, onOpenStudio }: { onNavigate?: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void; onOpenStudio?: () => void }) {
  const [tab, setTab] = useState<Tab>("photo");
  const [expedition, setExpedition] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [selected, setSelected] = useState<typeof mediaItems[0] | null>(null);

  const filtered = mediaItems.filter(m => {
    if (tab === "photo" && m.type !== "photo") return false;
    if (tab === "video" && m.type !== "video") return false;
    if (tab === "360" && m.type !== "360") return false;
    if (expedition && !m.expedition.includes(expedition)) return false;
    if (yearFilter && !m.expedition.includes(yearFilter)) return false;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      <div className="p-6">
        <div className="mb-5">
          <h1 className="page-header-title">Media Gallery</h1>
          <p className="page-header-sub">Explore photos, videos and 360° virtual tours from expeditions.</p>
        </div>

        <div className="tab-bar w-fit mb-4">
          <button className={`tab-item ${tab === "photo" ? "active" : ""}`} onClick={() => setTab("photo")}>Photos</button>
          <button className={`tab-item ${tab === "video" ? "active" : ""}`} onClick={() => setTab("video")}>Videos</button>
          <button className={`tab-item ${tab === "360" ? "active" : ""}`} onClick={() => setTab("360")}>360° Virtual Tour</button>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <select className="filter-select" value={expedition} onChange={e => setExpedition(e.target.value)}>
            <option value="">All Expeditions</option>
            <option value="IAE 2024">IAE 2024</option>
            <option value="IAE 2023">IAE 2023</option>
            <option value="IAE 2022">IAE 2022</option>
          </select>
          <select className="filter-select" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <select className="filter-select">
            <option>Category</option>
            <option>Landscapes</option><option>Wildlife</option><option>Stations</option><option>Research</option>
          </select>
        </div>

        {tab === "360" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="card overflow-hidden cursor-pointer group" onClick={() => setSelected(item)}>
                <div className="relative" style={{ height: 200 }}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-white text-2xl">⊙</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2"><span className="tag tag-purple">360°</span></div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.location} · {item.expedition}</div>
                  </div>
                  <button className="btn-outline btn-sm" onClick={e => { e.stopPropagation(); setSelected(item); }}>Context →</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map(item => (
              <div key={item.id} className="card overflow-hidden cursor-pointer group" onClick={() => setSelected(item)}>
                <div className="relative" style={{ height: 160 }}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.2)" }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(37,99,235,0.9)" }}>
                        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-2" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                    <div className="text-white text-xs font-semibold">{item.title}</div>
                    <div className="text-white/70 text-[10px]">{item.location}</div>
                  </div>
                  {/* Science context hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="tag text-[9px]" style={{ background: "rgba(37,99,235,0.9)", color: "white" }}>Science Context</span>
                  </div>
                </div>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.expedition}</span>
                  <button className="text-[10px] font-medium" style={{ color: "var(--accent)" }} onClick={e => { e.stopPropagation(); setSelected(item); }}>Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <MediaIntelligencePanel item={selected} onClose={() => setSelected(null)} onNavigate={onNavigate} onAddToWorkspace={onAddToWorkspace}/>}
    </div>
  );
}
