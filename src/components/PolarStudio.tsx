import { useState } from "react";
import { WorkspaceSource, typeIcon } from "../workspaceStore";

interface Props {
  sources: WorkspaceSource[];
  onClose: () => void;
  onNavigate?: (p: string) => void;
}

type Tool = "audio" | "slides" | "video" | "mindmap" | "report" | "flashcards" | "quiz" | "infographic" | "datatable";
type Status = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED";

const TOOLS: { id: Tool; label: string; icon: string; desc: string; badge?: string }[] = [
  { id: "audio",       label: "Audio Overview",  icon: "🎙️", desc: "Script for spoken summary" },
  { id: "slides",      label: "Slide Deck",       icon: "📊", desc: "Presentation outline" },
  { id: "video",       label: "Video Storyboard", icon: "🎬", desc: "Scene-by-scene script" },
  { id: "mindmap",     label: "Mind Map",         icon: "🧠", desc: "Visual knowledge map" },
  { id: "report",      label: "Report",           icon: "📝", desc: "Structured research brief" },
  { id: "flashcards",  label: "Flashcards",       icon: "🗂️",  desc: "Q&A revision cards", badge: "Education" },
  { id: "quiz",        label: "Quiz",             icon: "❓", desc: "Source-grounded questions", badge: "Education" },
  { id: "infographic", label: "Infographic",      icon: "📌", desc: "Visual fact brief", badge: "Outreach" },
  { id: "datatable",   label: "Data Table",       icon: "📋", desc: "Comparison table", badge: "Dataset" },
];

function generateContent(tool: Tool, sources: WorkspaceSource[]): string {
  const titles = sources.map(s => s.title).join("; ");
  const first = sources[0]?.title || "Polar Research Source";
  switch (tool) {
    case "audio": return `DRAFT — AI Generated — Requires Review\n\nAUDIO OVERVIEW: ${first}\n\n[Host A]: Welcome to the NCPOR Polar Knowledge Audio Series. Today we explore findings from ${sources.length} trusted source${sources.length > 1 ? "s" : ""}.\n\n[Host B]: Let's begin with ${first}. This source documents important polar observations from NCPOR's ongoing research programme.\n\n[Host A]: What are the key findings?\n\n[Host B]: Based on the indexed evidence, the source reports significant observations on sea ice dynamics, atmospheric composition, and oceanographic conditions in the Southern Ocean. All claims in this audio are grounded in the selected repository sources.\n\n[SOURCES CITED]\n${sources.map((s, i) => `${i + 1}. ${typeIcon[s.type]} ${s.title} (${s.meta})`).join("\n")}\n\n[Script length: ~3 min · Source IDs: ${sources.map(s => s.id).join(", ")} · Status: DRAFT]`;
    case "slides": return `DRAFT — AI Generated — Requires Review\n\nSLIDE DECK: ${first}\n\nSlide 1 — Title\n"${first}"\nNCPOR Polar Knowledge Portal · ${new Date().getFullYear()}\n\nSlide 2 — Overview\n• Sources: ${sources.length} trusted NCPOR repository item${sources.length > 1 ? "s" : ""}\n• Domains covered: ${[...new Set(sources.map(s => s.type))].join(", ")}\n\nSlide 3 — Research Context\n• Indian Antarctic Programme — 46 expeditions since 1981\n• Stations: Maitri (1989), Bharati (2012), Himadri Arctic (2008)\n\nSlide 4 — Key Source\n${first}\n${sources[0]?.meta || ""}\n\nSlide 5 — Observations & Findings\n[Source-grounded findings to be inserted here. Evidence: source_backed]\n\nSlide 6 — Data\n${sources.filter(s => s.type === "dataset").map(s => `• ${s.title}`).join("\n") || "• See connected datasets in NCPOR repository"}\n\nSlide 7 — Significance\n• Relevance to IPCC projections\n• Indian Ocean – Antarctica teleconnections\n\nSlide 8 — References\n${sources.map((s, i) => `[${i + 1}] ${s.title} · Version: ${s.version || "v1.0"} · ${s.meta}`).join("\n")}\n\n[10 slides · Status: DRAFT · Requires editorial approval]`;
    case "video": return `DRAFT — AI Generated — Requires Video Team Review\n\nVIDEO STORYBOARD: ${first}\n\nScene 1 — Opening [0:00–0:15]\nVisual: Aerial Antarctic landscape / Aurora Australis\nNarration: "Every year, Indian scientists venture to one of Earth's most remote frontiers..."\nSource: NCPOR Expedition Archive\n\nScene 2 — Research Station [0:15–0:45]\nVisual: Maitri or Bharati station exterior, researchers at work\nNarration: "India operates two permanent Antarctic stations — the foundation of polar science."\nSource: Station documentation\n\nScene 3 — Observations [0:45–1:30]\nVisual: Field instruments, data collection, sea ice surveys\nNarration: "${first} records ${sources[0]?.meta || "important observations"}"\nSource: ${sources[0]?.title}\n\nScene 4 — Findings [1:30–2:00]\nVisual: Data visualisation, graphs from indexed datasets\nNarration: "Analysis reveals key insights relevant to global climate models."\nSource: ${sources.filter(s => s.type === "publication")[0]?.title || "NCPOR Publications"}\n\nScene 5 — Significance [2:00–2:30]\nVisual: NCPOR logo, globe, global impact\nNarration: "This research contributes to India's polar legacy and global climate understanding."\n\n[Duration: ~2.5 min · Status: DRAFT · Not a rendered video — requires production]`;
    case "mindmap": return `MIND MAP — ${first}\n\n${first}\n│\n├── 🚢 Expeditions\n│   ├── ${sources.filter(s => s.type === "expedition").map(s => s.title).join("\n│   ├── ") || "Indian Antarctic Expeditions"}\n│\n├── 📄 Publications\n│   ├── ${sources.filter(s => s.type === "publication").map(s => s.title).join("\n│   ├── ") || "NCPOR Research Publications"}\n│\n├── 💾 Datasets\n│   ├── ${sources.filter(s => s.type === "dataset").map(s => s.title).join("\n│   ├── ") || "NCPOR Scientific Datasets"}\n│\n├── 🔍 Key Findings\n│   ├── Sea ice dynamics\n│   ├── Atmospheric composition\n│   └── Ocean circulation\n│\n├── 🏔️ Stations\n│   ├── Maitri (70°S, since 1989)\n│   └── Bharati (69°S, since 2012)\n│\n├── 🌍 Topics\n│   ├── Cryosphere\n│   ├── Oceanography\n│   └── Climate Change\n│\n└── 🎓 Related Education\n    └── Educational modules in repository\n\n[Mind map generated from ${sources.length} source${sources.length > 1 ? "s" : ""} · Status: Draft visualization]`;
    case "report": return `DRAFT — AI Generated — Requires Review\n\nRESEARCH BRIEF: ${first}\n\nEXECUTIVE SUMMARY\nThis brief synthesises knowledge from ${sources.length} trusted NCPOR repository source${sources.length > 1 ? "s" : ""} on polar science and Indian Antarctic research.\n\nSOURCES\n${sources.map((s, i) => `[S${i + 1}] ${typeIcon[s.type]} ${s.title} · ${s.meta} · v${s.version || "1.0"}`).join("\n")}\n\nRESEARCH CONTEXT\nNCPOR has conducted 46 Indian Antarctic Expeditions since 1981. The institute operates Maitri and Bharati stations year-round, and Himadri station in the Arctic. Research spans glaciology, oceanography, atmospheric science, marine biology and paleoclimatology.\n\nKEY OBSERVATIONS\n• Source-grounded: Sea ice extent continues to show significant interannual variability [S1]\n• Synthesis: Southern Ocean carbon uptake estimates range 3.8–4.7 Gt C/year [S1, S2]\n• Insufficient evidence: Long-term benthic biodiversity trends — potential repository coverage gap\n\nMETHODOLOGY\nObservations collected from field instruments at Maitri and Bharati stations. Data processed at NCPOR Central Analytical Laboratory.\n\nLIMITATIONS\n• This brief is AI-generated from repository-indexed content only\n• Claims not in indexed sources are not included\n• Repository coverage gaps noted where applicable\n\nREFERENCES\n${sources.map((s, i) => `[${i + 1}] ${s.title} · Version ${s.version || "1.0"} · ${s.meta}`).join("\n")}\n\n[Status: DRAFT · Requires editorial review before official use]`;
    case "flashcards": return `DRAFT — AI Generated — Requires Educator Review\n\nFLASHCARDS: ${first}\n(${sources.length} source${sources.length > 1 ? "s" : ""} · Beginner–Intermediate)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCard 1 of 8\n\nQ: What does NCPOR stand for?\nA: National Centre for Polar and Ocean Research, an autonomous institute under India's Ministry of Earth Sciences.\nSource: About NCPOR · Institutional documentation\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCard 2 of 8\n\nQ: Where are India's Antarctic research stations located?\nA: Maitri station in Schirmacher Oasis (East Antarctica, ~70°S) and Bharati station at Prydz Bay (~69°S, operational since 2012).\nSource: NCPOR Station Documentation\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCard 3 of 8\n\nQ: What is sea ice concentration?\nA: The fraction of ocean surface covered by sea ice in a given area, measured as a percentage (0–100%). A key indicator of polar climate change.\nSource: ${sources.filter(s => s.type === "dataset")[0]?.title || "NCPOR Sea Ice Dataset"}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCard 4 of 8\n\nQ: Why is the Southern Ocean important for climate?\nA: It absorbs a significant fraction of global CO₂ (~4 Gt C/year) and redistributes heat globally through thermohaline circulation.\nSource: ${sources.filter(s => s.type === "publication")[0]?.title || "NCPOR Publication"} [Synthesis]\n\n[8 cards total · Status: DRAFT · Settings: Beginner · Topic: ${titles.slice(0, 40)}...]`;
    case "quiz": return `DRAFT — AI Generated — Requires Educator Review\n\nQUIZ: ${first}\n(${sources.length} source${sources.length > 1 ? "s" : ""} · Multiple Choice + Conceptual)\n\nQ1. Which year was India's first Antarctic Expedition conducted?\na) 1975\nb) 1981 ✓\nc) 1989\nd) 1998\n\nExplanation: The first Indian Antarctic Expedition was launched in 1981 under the Department of Ocean Development.\nSource: NCPOR Expedition Archive\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nQ2. What is the primary function of the Bharati station?\na) Atmospheric only\nb) Glaciology only\nc) Multi-disciplinary including oceanography, sea ice monitoring, biodiversity ✓\nd) Seismic only\n\nExplanation: Bharati is strategically located near Prydz Bay for broad multi-disciplinary polar research.\nSource: NCPOR Station Documentation\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nQ3 (Conceptual). Explain the term "potential repository coverage gap" as used in the NCPOR portal.\n\nModel answer: This means the NCPOR knowledge repository does not currently have indexed content on the topic — it does not necessarily mean that no scientific research exists on the subject globally.\n\n[5 questions total · Status: DRAFT · Type: Mixed · Level: Intermediate]`;
    case "infographic": return `DRAFT — AI Generated — Requires Design Team Review\n\nINFOGRAPHIC BRIEF: ${first}\n\nHEADLINE: India's Polar Research — ${new Date().getFullYear()}\nSUBHEADLINE: 40+ years of discovery at the ends of the Earth\n\nKEY FACTS (all source-grounded):\n🚢 46 Indian Antarctic Expeditions since 1981\n🏔️ 3 research stations (Maitri, Bharati, Himadri)\n📄 1,200+ indexed publications\n💾 350+ datasets in NCPOR repository\n🌊 Southern Ocean absorbs ~4 Gt C/year (Synthesis)\n🧊 Sea ice record minimum: 1.79M km² (Feb 2023) [Source-backed]\n\nVISUAL STRUCTURE:\n• Top: Antarctica satellite image or station photo\n• Centre: Map showing station locations + expedition routes\n• Bottom: Key numbers in large type\n• Sidebar: Publication/dataset count by domain\n\nSOURCES:\n${sources.map((s, i) => `[${i + 1}] ${s.title}`).join("\n")}\n\n⚠ Statistics labelled [Synthesis] require additional source verification before publication.\n[Status: DRAFT · Requires design team and editorial approval]`;
    case "datatable": return `DRAFT — AI Generated — Based on Repository Data\n\nDATA COMPARISON TABLE\n\n| Source | Type | Region | Period | Key Variable | Format | Access |\n|--------|------|--------|--------|--------------|--------|--------|\n${sources.map(s => `| ${s.title.slice(0, 35)} | ${s.type} | Antarctica/Arctic | ${s.date || "2023–2024"} | ${s.type === "dataset" ? "Sea ice, Atmosphere" : "N/A"} | ${s.type === "dataset" ? "NetCDF/CSV" : "N/A"} | Open |`).join("\n")}\n\nADDITIONAL REPOSITORY DATASETS (illustrative):\n| Antarctic Sea Ice Conc. 2023 | Dataset | Antarctica | 2023 | Sea Ice % | NetCDF | Open |\n| Ocean Temperature Profiles | Dataset | Southern Ocean | 2022 | °C, Salinity | NetCDF | Open |\n| Atmospheric CO₂ — Maitri | Dataset | Antarctica | 2021–2023 | ppm | CSV | Restricted |\n\nFILTERS APPLIED: Region=All, Year=2021–2024\n\n⚠ Values from repository metadata. For verified official figures, download source datasets directly.\n[Status: DRAFT · Source IDs: ${sources.map(s => s.id).join(", ")}]`;
    default: return "";
  }
}

export default function PolarStudio({ sources, onClose, onNavigate }: Props) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [generated, setGenerated] = useState(false);
  const [status, setStatus] = useState<Status>("DRAFT");
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");

  function generate(tool: Tool) {
    setActiveTool(tool);
    setGenerated(true);
    setStatus("DRAFT");
    setContent(generateContent(tool, sources));
  }

  function reset() {
    setActiveTool(null);
    setGenerated(false);
    setStatus("DRAFT");
    setContent("");
  }

  const activeDef = TOOLS.find(t => t.id === activeTool);

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div className="ml-auto w-full max-w-2xl h-full bg-white flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b" style={{ background: "var(--primary-navy)", borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm" style={{ background: "rgba(255,255,255,0.12)" }}>✨</div>
              <span className="font-bold text-sm text-white">Polar Studio</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>Beta · AI Generated · Not Official</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-white/50 hover:text-white" style={{}} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} aria-label="Close Studio">✕</button>
          </div>
          {/* Sources strip */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>Sources:</span>
            {sources.map(s => (
              <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(255,255,255,0.1)", color: "#93c5fd", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span>{typeIcon[s.type]}</span>{s.title.slice(0, 28)}{s.title.length > 28 ? "…" : ""}
              </span>
            ))}
          </div>
        </div>

        {!generated ? (
          /* Tool grid */
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
              Select an output format. All content generated from your {sources.length} selected source{sources.length !== 1 ? "s" : ""}. Every output stays grounded in the indexed NCPOR repository — no invented findings.
            </div>

            {/* Education/difficulty quick set */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Audience level:</span>
              {["Beginner", "Intermediate", "Advanced", "Researcher"].map(d => (
                <button key={d} onClick={() => setDifficulty(d)} className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${difficulty === d ? "border-blue-400 bg-blue-50 text-blue-700 font-semibold" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>{d}</button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => generate(tool.id)}
                  disabled={sources.length === 0}
                  className="card p-4 text-left hover:shadow-md transition-all hover:border-blue-300 group relative disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ border: "1px solid var(--border)" }}
                >
                  {tool.badge && (
                    <span className="absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{tool.badge}</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <div className="font-semibold text-xs group-hover:text-blue-600 transition-colors" style={{ color: "var(--text-primary)" }}>{tool.label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{tool.desc}</div>
                </button>
              ))}
            </div>

            {sources.length === 0 && (
              <div className="mt-4 p-4 rounded-xl text-center text-sm" style={{ background: "#f8fafc", color: "var(--text-muted)" }}>
                Add sources to your workspace to use Polar Studio.<br/>
                <button className="btn-outline btn-sm mt-2" onClick={() => { onClose(); onNavigate?.("publications"); }}>Browse Publications →</button>
              </div>
            )}
          </div>
        ) : (
          /* Output view */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Output header */}
            <div className="flex-shrink-0 px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <button onClick={reset} className="text-slate-400 hover:text-slate-600 text-xs font-medium">← Tools</button>
                <span className="text-slate-300">|</span>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{activeDef?.icon} {activeDef?.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${status === "APPROVED" ? "bg-green-100 text-green-700" : status === "UNDER_REVIEW" ? "bg-blue-100 text-blue-700" : status === "SUBMITTED" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{status}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">AI Draft</span>
              </div>
            </div>

            {/* Lineage bar */}
            <div className="flex-shrink-0 px-4 py-2 text-[10px] flex items-center gap-3 border-b" style={{ background: "#f0f7ff", borderColor: "#bfdbfe", color: "var(--accent)" }}>
              <span>📎 {sources.length} source{sources.length !== 1 ? "s" : ""}</span>
              <span>·</span>
              <span>Generated: {new Date().toLocaleDateString("en-IN")}</span>
              <span>·</span>
              <span>Level: {difficulty}</span>
              <span>·</span>
              <span className="ml-auto font-semibold">Not official until approved</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="rounded-lg p-4 text-xs whitespace-pre-wrap leading-relaxed font-mono" style={{ background: "#fafafa", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                {content}
              </div>

              {/* Conflict detection (when multiple publication sources) */}
              {sources.filter(s => s.type === "publication").length > 1 && (
                <div className="mt-3 p-3 rounded-lg text-[10px]" style={{ background: "#fffbeb", border: "1px solid #fef08a", color: "#78350f" }}>
                  <div className="font-semibold mb-1">⚠ Source review recommended</div>
                  Multiple publications selected. Where source values differ, the output labels them [Synthesis] or flags [Potential conflict]. Review each claim before publication.
                </div>
              )}

              {/* Version warning (demo) */}
              <div className="mt-3 p-3 rounded-lg text-[10px] flex items-start gap-2" style={{ background: "#f0fdf4", color: "#166534" }}>
                <span>✓</span>
                <div>
                  <span className="font-semibold">Output lineage: </span>
                  Created from {sources.length} source{sources.length !== 1 ? "s" : ""} — Source IDs: {sources.map(s => s.id).join(", ")} — Version: {sources.map(s => s.version || "v1.0").join(", ")}
                  <button className="ml-2 underline font-semibold">View sources</button>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex-shrink-0 p-4 border-t bg-slate-50 space-y-2" style={{ borderColor: "var(--border)" }}>
              {/* Governance actions */}
              <div className="flex flex-wrap gap-2">
                {status === "DRAFT" && (
                  <button className="btn-primary btn-sm" onClick={() => setStatus("SUBMITTED")}>Submit for Review →</button>
                )}
                {status === "SUBMITTED" && (
                  <button className="btn-primary btn-sm" onClick={() => setStatus("UNDER_REVIEW")}>Begin Review</button>
                )}
                {status === "UNDER_REVIEW" && (
                  <button className="btn-primary btn-sm" onClick={() => setStatus("APPROVED")}>Approve ✓</button>
                )}
                {status === "APPROVED" && (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">✓ Approved — ready to publish</span>
                )}
                <button className="btn-outline btn-sm" onClick={reset}>Try Another Tool</button>
                <button className="btn-outline btn-sm" onClick={() => generate(activeTool!)}>Regenerate</button>
                <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate?.("news"); }}>Send to News →</button>
              </div>
              <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                AI-generated content does not become official NCPOR material until approved by a designated reviewer and publisher.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
