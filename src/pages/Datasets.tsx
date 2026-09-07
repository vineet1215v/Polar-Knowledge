import { useState } from "react";
import { datasets } from "../data";
import { datasetProvenance } from "../knowledgeData";
import { gameStore } from "../gameStore";
import RelatedKnowledge from "../components/RelatedKnowledge";
import SaveFollowButton from "../components/SaveFollowButton";
import AddToWorkspace from "../components/AddToWorkspace";
import DatasetInspectorModal from "../components/DatasetInspectorModal";
import type { WorkspaceSource } from "../workspaceStore";

type DatasetType = typeof datasets[0];

function MiniChart({ label }: { label: string }) {
  const bars = [35, 52, 48, 61, 55, 70, 63, 80];
  return (
    <div>
      <div className="text-[10px] mb-1 font-medium" style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div className="flex items-end gap-0.5" style={{ height: 40 }} role="img" aria-label={label}>
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t" style={{ height: `${b}%`, background: i === bars.length - 1 ? "var(--accent)" : "#bfdbfe" }}/>
        ))}
      </div>
      <div className="flex justify-between text-[8px] mt-0.5" style={{ color: "var(--text-muted)" }}>
        <span>Jan</span><span>Aug</span>
      </div>
    </div>
  );
}

function QualityBar({ label, pct, issues }: { label: string; pct: number; issues?: string[] }) {
  const color = pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }}/>
      </div>
      {issues && issues.length > 0 && (
        <div className="space-y-0.5">
          {issues.map(issue => (
            <div key={issue} className="flex items-start gap-1 text-[10px]" style={{ color: "#d97706" }}>
              <span className="flex-shrink-0">Warning:</span>{issue}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IngestionPipeline({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const pipelineSteps = [
    { label: "Upload / Import", desc: "Upload dataset file(s) or provide repository URL", icon: "", status: step > 0 ? "done" : step === 0 ? "active" : "pending" },
    { label: "Parse & Validate", desc: "Detect format (NetCDF, CSV, HDF5), verify structure", icon: "", status: step > 1 ? "done" : step === 1 ? "active" : "pending" },
    { label: "Metadata Extraction", desc: "Extract variables, temporal/spatial coverage, instrument details", icon: "", status: step > 2 ? "done" : step === 2 ? "active" : "pending" },
    { label: "Chunking & Indexing", desc: "Segment and embed dataset for semantic search", icon: "", status: step > 3 ? "done" : step === 3 ? "active" : "pending" },
    { label: "Relationship Extraction", desc: "Link to expeditions, publications, researchers", icon: "", status: step > 4 ? "done" : step === 4 ? "active" : "pending" },
    { label: "Quality Review", desc: "Metadata completeness scored — manual review if <70%", icon: "OK", status: step > 5 ? "done" : step === 5 ? "active" : "pending" },
    { label: "Repository Publication", desc: "Dataset visible in Scientific Datasets after approval", icon: "", status: step > 6 ? "done" : step === 6 ? "active" : "pending" },
  ];

  const statusColor = { done: "#16a34a", active: "var(--accent)", pending: "#94a3b8" };
  const statusBg = { done: "#f0fdf4", active: "var(--accent-light)", pending: "#f8fafc" };

  return (
    <div className="fixed inset-0 z-40 flex" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="ml-auto w-full max-w-lg h-full bg-white flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase text-blue-600 mb-0.5">Knowledge Ingestion Pipeline</div>
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Submit a Dataset</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 text-lg" aria-label="Close">x</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!submitted ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Dataset Title</label>
                <input className="search-input" placeholder="e.g. Arctic Sea Ice Extent 2024"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Expedition</label>
                  <select className="filter-select w-full">
                    <option>Select expedition</option>
                    <option>46th IAE (2024)</option>
                    <option>45th IAE (2023)</option>
                    <option>16th Arctic Expedition</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Format</label>
                  <select className="filter-select w-full">
                    <option>NetCDF</option>
                    <option>CSV</option>
                    <option>HDF5</option>
                    <option>GeoTIFF</option>
                  </select>
                </div>
              </div>
              <div className="border-2 border-dashed rounded-xl p-6 text-center" style={{ borderColor: "var(--border)" }}>
                <div className="text-2xl mb-1"></div>
                <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>Drop dataset files here</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>NetCDF, CSV, HDF5, GeoTIFF · Max 5GB</div>
                <button className="btn-outline btn-sm mt-2">Browse Files</button>
              </div>
              <button className="btn-primary w-full" onClick={() => { setSubmitted(true); setStep(3); }}>
                Submit to Ingestion Pipeline →
              </button>
            </>
          ) : (
            <>
              <div className="text-xs p-3 rounded-lg font-medium" style={{ background: "#f0fdf4", color: "#166534" }}>
                OK Dataset submitted — pipeline running. Review required before publication.
              </div>
              <div className="space-y-2">
                {pipelineSteps.map((s, i) => {
                  const st = (i < step ? "done" : i === step ? "active" : "pending") as "done" | "active" | "pending";
                  return (
                    <div key={s.label} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: statusBg[st] }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm" style={{ background: statusColor[st], color: "white" }}>
                        {st === "done" ? "OK" : st === "active" ? "…" : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold" style={{ color: st === "pending" ? "var(--text-muted)" : "var(--text-primary)" }}>{s.label}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
                        {i === 4 && st === "done" && (
                          <div className="mt-1 text-[10px] font-semibold" style={{ color: "#d97706" }}>
                            Warning: Relationship review required — 2 suggested links need confirmation
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {step < pipelineSteps.length - 1 && (
                  <button className="btn-primary btn-sm flex-1" onClick={() => setStep(s => Math.min(s + 1, pipelineSteps.length - 1))}>
                    Advance Pipeline (demo) →
                  </button>
                )}
                <button className="btn-outline btn-sm" onClick={() => { setSubmitted(false); setStep(0); }}>New Submission</button>
              </div>
              <div className="card p-3 text-[10px]" style={{ color: "var(--text-muted)" }}>
                <div className="font-semibold mb-0.5" style={{ color: "var(--text-secondary)" }}>Governance — Approval required</div>
                AI-generated metadata and suggested relationships must be reviewed by a dataset reviewer before publication. Dataset will not be visible to other users until approved.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DatasetDetail({
  dataset,
  onClose,
  onNavigate,
  onAddToWorkspace,
  onOpenStudio,
  onInspectDataset,
}: {
  dataset: DatasetType;
  onClose: () => void;
  onNavigate?: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
  onInspectDataset?: (d: DatasetType) => void;
}) {
  const [tab, setTab] = useState<"overview" | "quality" | "provenance" | "related">("overview");
  const prov = datasetProvenance[dataset.id];

  const related = [
    { type: "publication" as const, label: "Changing sea ice dynamics in the Southern Ocean", meta: "Journal of Glaciology · 2024" },
    { type: "expedition" as const, label: "46th IAE (2024)", meta: "Source expedition" },
    { type: "finding" as const, label: "Sea ice reached record minimum 1.79M km²", meta: "Finding F1 · 94% confidence" },
    { type: "station" as const, label: "Maitri Station", meta: "Instrument site" },
    { type: "researcher" as const, label: "Dr. A. Sharma", meta: "Glaciologist" },
  ];

  return (
    <div className="fixed inset-0 z-40 flex" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} role="dialog" aria-modal="true" aria-label={dataset.title}>
      <div className="ml-auto w-full max-w-xl h-full bg-white flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-3">
              <div className="flex flex-wrap gap-2 mb-1">
                <span className="tag">{dataset.parameter}</span>
                <span className="tag tag-green">{dataset.region}</span>
                <span className="text-[10px] font-medium" style={{ color: prov?.access === "open" ? "#16a34a" : "#dc2626" }}>
                  {prov?.access === "open" ? " Open Access" : " Restricted"}
                </span>
              </div>
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{dataset.title}</h2>
              <div className="text-xs mt-1 flex gap-3" style={{ color: "var(--text-muted)" }}>
                <span> {dataset.size}</span>
                <span>Format: {dataset.format}</span>
                <span>{dataset.year}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 text-lg focus-visible:outline-2 focus-visible:outline-blue-500" aria-label="Close">x</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              className="btn-primary btn-sm flex items-center gap-1.5"
              onClick={() => onInspectDataset?.(dataset)}
            >
              <span></span> Telemetry & Download
            </button>
            <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate?.("ai"); }}>Ask Polar</button>
            <AddToWorkspace source={{ id: `ds-${dataset.id}`, type: "dataset", title: dataset.title, meta: `${dataset.size} · ${dataset.region}`, version: datasetProvenance[dataset.id]?.version || "v1.0", date: `${dataset.year}`, origin: "NCPOR Repository" }} onAdd={onAddToWorkspace || (() => {})}/>
            <button className="btn-outline btn-sm" onClick={() => { onClose(); onOpenStudio?.(); }}>Studio</button>
            <SaveFollowButton entityId={dataset.id.toString()} entityType="dataset" label="Dataset"/>
          </div>
          <div className="tab-bar">
            {([["overview","Overview"],["quality","Data Quality"],["provenance","Provenance"],["related","Related"]] as const).map(([id,label]) => (
              <button key={id} className={`tab-item ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tab === "overview" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <MiniChart label="Data density over time"/>
                <MiniChart label="Download activity"/>
              </div>
              <div className="text-xs p-3 rounded-lg" style={{ background: "#f0f7ff", color: "var(--text-primary)" }}>
                <div className="font-semibold mb-1">Dataset Summary</div>
                This dataset contains {dataset.parameter.toLowerCase()} measurements from {dataset.region} ({dataset.year}). Collected during the {prov?.expedition || "NCPOR expedition"} and processed at NCPOR's Central Analytical Laboratory.
              </div>
              {prov && (
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {[["Temporal Coverage", prov.temporalCoverage],["Spatial Coverage", prov.spatialCoverage],["Variables", prov.variables.join(", ")],["License", prov.rights]].map(([k,v]) => (
                    <div key={k as string} className="flex gap-2 p-2 rounded" style={{ background: "#f8fafc" }}>
                      <span className="font-semibold flex-shrink-0 w-32" style={{ color: "var(--text-muted)" }}>{k as string}</span>
                      <span style={{ color: "var(--text-primary)" }}>{v as string}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-[10px] rounded p-2" style={{ background: "#fefce8", color: "#92400e" }}>
                Warning: Demo data — not verified NCPOR measurements. Provenance and access labels are illustrative.
              </div>
            </>
          )}

          {tab === "quality" && (
            <div className="space-y-4">
              <div className="card p-4 space-y-3">
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Metadata Completeness</div>
                <QualityBar label="Overall completeness" pct={82}/>
                <QualityBar label="Core metadata" pct={96}/>
                <QualityBar label="Temporal coverage" pct={90}/>
                <QualityBar label="Spatial reference" pct={74} issues={["Missing datum specification"]}/>
                <QualityBar label="Instrument metadata" pct={58} issues={["Calibration date missing","Serial number not recorded"]}/>
                <QualityBar label="Provenance chain" pct={88}/>
                <QualityBar label="Variable definitions" pct={70} issues={["Units unclear for 2 variables"]}/>
              </div>
              <div className="card p-4">
                <div className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>Quality Issues</div>
                <div className="space-y-2">
                  {[
                    { sev: "medium", label: "Missing temporal resolution", detail: "Sampling interval not documented in metadata" },
                    { sev: "low", label: "Instrument calibration gap", detail: "Post-expedition calibration records not linked" },
                    { sev: "low", label: "Partial spatial coverage descriptor", detail: "Bounding box defined but projection not specified" },
                  ].map(q => (
                    <div key={q.label} className="flex items-start gap-2 p-2 rounded" style={{ background: q.sev === "medium" ? "#fffbeb" : "#f8fafc" }}>
                      <span className="text-sm flex-shrink-0">{q.sev === "medium" ? "" : ""}</span>
                      <div>
                        <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{q.label}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{q.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-outline btn-sm mt-3 w-full text-[10px]">Request Metadata Improvement</button>
              </div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Quality scores are calculated from indexed metadata against SCAR data standards. Scores are illustrative in this demo.
              </div>
            </div>
          )}

          {tab === "provenance" && prov && (
            <div className="space-y-3">
              <div className="font-semibold text-xs mb-1" style={{ color: "var(--text-primary)" }}>Data Provenance Chain</div>
              {[
                { icon: "", label: "Source", value: prov.source, note: "Original collector" },
                { icon: "", label: "Expedition", value: prov.expedition, note: "Collection campaign" },
                { icon: "", label: "Collection Context", value: prov.collectionContext, note: "Instruments & method" },
                { icon: "", label: "Processing", value: "NCPOR Central Analytical Laboratory · Level 2", note: "Quality-controlled, gap-filled" },
                { icon: "", label: "Version", value: prov.version, note: `Last updated ${prov.lastUpdated}` },
                { icon: "", label: "Access & Rights", value: `${prov.rights} · ${prov.access}`, note: "License" },
              ].map((row, i) => (
                <div key={row.label} className="flex items-start gap-3">
                  {i < 5 && <div className="absolute w-px h-8 bg-slate-200 ml-3 mt-8" aria-hidden="true"/>}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm border-2 border-white shadow-sm z-10" style={{ background: "var(--accent-light)" }}>{row.icon}</div>
                  <div className="flex-1 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[9px] uppercase font-semibold" style={{ color: "var(--text-muted)" }}>{row.label}</div>
                    <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{row.value}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{row.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "related" && (
            <>
              <RelatedKnowledge entities={related} onNavigate={onNavigate}/>
              <div className="text-[10px] p-2 rounded" style={{ background: "#f8fafc", color: "var(--text-muted)" }}>
                Relationships shown are based on indexed metadata connections. AI-suggested relationships are marked separately.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Datasets({
  onNavigate,
  onAddToWorkspace,
  onOpenStudio,
}: {
  onNavigate?: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [param, setParam] = useState("");
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const [selected, setSelected] = useState<DatasetType | null>(null);
  const [showIngestion, setShowIngestion] = useState(false);
  const [inspectModalDataset, setInspectModalDataset] = useState<DatasetType | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const filtered = datasets.filter(d => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (param && d.parameter !== param) return false;
    if (region && d.region !== region) return false;
    if (year && d.year !== parseInt(year)) return false;
    return true;
  });

  const handleOpenInspector = (d: DatasetType) => {
    setInspectModalDataset(d);
    gameStore.addXP(25, `Launched Telemetry Visualizer: ${d.title.slice(0, 30)}...`);
  };

  const handleQuickDownload = (d: DatasetType, e: React.MouseEvent) => {
    e.stopPropagation();
    gameStore.addXP(20, `Downloaded Dataset: ${d.title.slice(0, 30)}...`);
    const dummy = `ID,Parameter,Region,Year,Size\n${d.id},${d.parameter},${d.region},${d.year},${d.size}`;
    const blob = new Blob([dummy], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${d.title.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl"></span>
              <h1 className="page-header-title text-2xl font-bold text-slate-900">
                Scientific Datasets & Telemetry
              </h1>
            </div>
            <p className="page-header-sub text-xs text-slate-500 mt-1">
              Curated Level-2 observational polar feeds, in-situ sensor logs, and NetCDF archives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Dual View Modes Switcher */}
            <div className="flex items-center gap-1 bg-slate-200/90 p-1 rounded-xl border border-slate-300/70 text-xs font-bold">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  viewMode === "cards" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span></span> Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  viewMode === "table" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span></span> Sensor Matrix
              </button>
            </div>

            <button className="btn-primary btn-sm flex items-center gap-1.5" onClick={() => setShowIngestion(true)}>
              <span></span> Submit Dataset
            </button>
          </div>
        </div>

        {/* Scientific Observational Metrics HUD (No Maps!) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold border border-blue-100 flex-shrink-0">
              
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">128.4 GB</div>
              <div className="text-[11px] text-slate-500 font-medium">Curated Telemetry</div>
            </div>
          </div>

          <div className="card p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-100 flex-shrink-0">
              
            </div>
            <div>
              <div className="text-lg font-black text-emerald-700">99.2%</div>
              <div className="text-[11px] text-slate-500 font-medium">Calibration Integrity</div>
            </div>
          </div>

          <div className="card p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg font-bold border border-purple-100 flex-shrink-0">
              
            </div>
            <div>
              <div className="text-lg font-black text-purple-700">100% Open</div>
              <div className="text-[11px] text-slate-500 font-medium">Fair Data Standard</div>
            </div>
          </div>

          <div className="card p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-lg font-bold border border-cyan-100 flex-shrink-0">
              
            </div>
            <div>
              <div className="text-lg font-black text-cyan-700">Level-2 / L3</div>
              <div className="text-[11px] text-slate-500 font-medium">Science-Ready Formats</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-200">
          {/* Quick Domain Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "", label: "All Parameters" },
              { id: "Sea Ice", label: " Sea Ice" },
              { id: "Atmosphere", label: " Atmosphere" },
              { id: "Oceanography", label: " Oceanography" },
              { id: "Cryosphere", label: " Cryosphere" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setParam(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  param === t.id
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search and Secondary Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48">
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input text-xs pl-8 py-1.5"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search telemetry..."
                aria-label="Search datasets"
              />
            </div>
            <select
              className="filter-select text-xs py-1.5"
              value={region}
              onChange={e => setRegion(e.target.value)}
              aria-label="Filter by region"
            >
              <option value="">Region (All)</option>
              <option value="Antarctica">Antarctica</option>
              <option value="Arctic">Arctic</option>
              <option value="Southern Ocean">Southern Ocean</option>
            </select>
            <select
              className="filter-select text-xs py-1.5"
              value={year}
              onChange={e => setYear(e.target.value)}
              aria-label="Filter by year"
            >
              <option value="">Year (All)</option>
              {[2023, 2022, 2021, 2020].map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode 1: Interactive Cards */}
        {viewMode === "cards" && (
          <div className="space-y-3" role="list">
            {filtered.map(d => (
              <div
                key={d.id}
                className="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer border border-slate-200"
                onClick={() => setSelected(d)}
                role="listitem"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-2xs border border-slate-200">
                    <img src={d.thumb} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                      <span className="text-white text-base"></span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {d.format}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                         {d.size}
                      </span>
                      <span className="tag tag-green">{d.region}</span>
                      <span className="tag tag-orange">{d.category}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                         Open Access
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition truncate">
                      {d.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      Temporal coverage: {datasetProvenance[d.id]?.temporalCoverage || `${d.year}`} · Variables: {datasetProvenance[d.id]?.variables.slice(0, 3).join(", ") || d.parameter}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {/* Interactive Visualizer & Telemetry Trigger */}
                  <button
                    className="btn-primary btn-sm text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    onClick={e => {
                      e.stopPropagation();
                      handleOpenInspector(d);
                    }}
                  >
                    <span></span> Visualize & Inspect
                  </button>

                  <button
                    className="btn-outline btn-sm text-xs font-medium"
                    onClick={e => handleQuickDownload(d, e)}
                    title="Export CSV Telemetry"
                  >
                     CSV
                  </button>

                  <button
                    className="btn-outline btn-sm text-xs font-medium"
                    onClick={e => {
                      e.stopPropagation();
                      setSelected(d);
                    }}
                  >
                    Details →
                  </button>

                  <SaveFollowButton entityId={d.id.toString()} entityType="dataset" compact />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode 2: High-Density Sensor Matrix Table View */}
        {viewMode === "table" && (
          <div className="card overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Dataset Title</th>
                    <th className="py-3 px-4">Parameter</th>
                    <th className="py-3 px-4">Format & Size</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(d => (
                    <tr
                      key={d.id}
                      onClick={() => setSelected(d)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{d.title}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {datasetProvenance[d.id]?.source || "NCPOR Sensor Feed"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          {d.parameter}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {d.format} · {d.size}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{d.region}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{d.year}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenInspector(d)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition flex items-center gap-1"
                          >
                            <span></span> Inspect
                          </button>
                          <button
                            onClick={e => handleQuickDownload(d, e)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition"
                          >
                            CSV
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="card p-8 text-center text-slate-500 border border-slate-200">
            <div className="text-2xl mb-2" aria-hidden="true">
              
            </div>
            <div className="text-sm font-semibold">No datasets found matching your filters.</div>
            <button
              onClick={() => {
                setSearch("");
                setParam("");
                setRegion("");
                setYear("");
              }}
              className="mt-3 btn-outline btn-sm text-xs"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {selected && (
        <DatasetDetail
          dataset={selected}
          onClose={() => setSelected(null)}
          onNavigate={onNavigate}
          onAddToWorkspace={onAddToWorkspace}
          onOpenStudio={onOpenStudio}
          onInspectDataset={d => {
            setSelected(null);
            handleOpenInspector(d);
          }}
        />
      )}

      {inspectModalDataset && (
        <DatasetInspectorModal
          dataset={inspectModalDataset}
          onClose={() => setInspectModalDataset(null)}
          onAddToWorkspace={onAddToWorkspace}
        />
      )}

      {showIngestion && <IngestionPipeline onClose={() => setShowIngestion(false)} />}
    </div>
  );
}
