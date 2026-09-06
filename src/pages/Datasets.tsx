import { useState } from "react";
import { datasets } from "../data";
import { datasetProvenance } from "../knowledgeData";
import RelatedKnowledge from "../components/RelatedKnowledge";
import SaveFollowButton from "../components/SaveFollowButton";
import AddToWorkspace from "../components/AddToWorkspace";
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
              <span className="flex-shrink-0">⚠</span>{issue}
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
    { label: "Upload / Import", desc: "Upload dataset file(s) or provide repository URL", icon: "📤", status: step > 0 ? "done" : step === 0 ? "active" : "pending" },
    { label: "Parse & Validate", desc: "Detect format (NetCDF, CSV, HDF5), verify structure", icon: "🔍", status: step > 1 ? "done" : step === 1 ? "active" : "pending" },
    { label: "Metadata Extraction", desc: "Extract variables, temporal/spatial coverage, instrument details", icon: "📋", status: step > 2 ? "done" : step === 2 ? "active" : "pending" },
    { label: "Chunking & Indexing", desc: "Segment and embed dataset for semantic search", icon: "🧩", status: step > 3 ? "done" : step === 3 ? "active" : "pending" },
    { label: "Relationship Extraction", desc: "Link to expeditions, publications, researchers", icon: "🔗", status: step > 4 ? "done" : step === 4 ? "active" : "pending" },
    { label: "Quality Review", desc: "Metadata completeness scored — manual review if <70%", icon: "✅", status: step > 5 ? "done" : step === 5 ? "active" : "pending" },
    { label: "Repository Publication", desc: "Dataset visible in Scientific Datasets after approval", icon: "🌐", status: step > 6 ? "done" : step === 6 ? "active" : "pending" },
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
            <button onClick={onClose} className="text-slate-400 text-lg" aria-label="Close">✕</button>
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
                <div className="text-2xl mb-1">📁</div>
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
                ✓ Dataset submitted — pipeline running. Review required before publication.
              </div>
              <div className="space-y-2">
                {pipelineSteps.map((s, i) => {
                  const st = (i < step ? "done" : i === step ? "active" : "pending") as "done" | "active" | "pending";
                  return (
                    <div key={s.label} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: statusBg[st] }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm" style={{ background: statusColor[st], color: "white" }}>
                        {st === "done" ? "✓" : st === "active" ? "…" : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold" style={{ color: st === "pending" ? "var(--text-muted)" : "var(--text-primary)" }}>{s.label}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
                        {i === 4 && st === "done" && (
                          <div className="mt-1 text-[10px] font-semibold" style={{ color: "#d97706" }}>
                            ⚠ Relationship review required — 2 suggested links need confirmation
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

function DatasetDetail({ dataset, onClose, onNavigate, onAddToWorkspace, onOpenStudio }: { dataset: DatasetType; onClose: () => void; onNavigate?: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void; onOpenStudio?: () => void }) {
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
                  {prov?.access === "open" ? "🔓 Open Access" : "🔒 Restricted"}
                </span>
              </div>
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{dataset.title}</h2>
              <div className="text-xs mt-1 flex gap-3" style={{ color: "var(--text-muted)" }}>
                <span>📦 {dataset.size}</span>
                <span>Format: {dataset.format}</span>
                <span>{dataset.year}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 text-lg focus-visible:outline-2 focus-visible:outline-blue-500" aria-label="Close">✕</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <button className="btn-primary btn-sm">View & Download</button>
            <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate?.("ai"); }}>Ask Polar</button>
            <button className="btn-outline btn-sm">Compare</button>
            <AddToWorkspace source={{ id: `ds-${dataset.id}`, type: "dataset", title: dataset.title, meta: `${dataset.size} · ${dataset.region}`, version: datasetProvenance[dataset.id]?.version || "v1.0", date: `${dataset.year}`, origin: "NCPOR Repository" }} onAdd={onAddToWorkspace || (() => {})}/>
            <button className="btn-outline btn-sm" onClick={() => { onClose(); onOpenStudio?.(); }}>✨ Studio</button>
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
                ⚠️ Demo data — not verified NCPOR measurements. Provenance and access labels are illustrative.
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
                      <span className="text-sm flex-shrink-0">{q.sev === "medium" ? "🟡" : "🔵"}</span>
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
                { icon: "📤", label: "Source", value: prov.source, note: "Original collector" },
                { icon: "🚢", label: "Expedition", value: prov.expedition, note: "Collection campaign" },
                { icon: "🔬", label: "Collection Context", value: prov.collectionContext, note: "Instruments & method" },
                { icon: "⚙️", label: "Processing", value: "NCPOR Central Analytical Laboratory · Level 2", note: "Quality-controlled, gap-filled" },
                { icon: "📦", label: "Version", value: prov.version, note: `Last updated ${prov.lastUpdated}` },
                { icon: "🌐", label: "Access & Rights", value: `${prov.rights} · ${prov.access}`, note: "License" },
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

export default function Datasets({ onNavigate, onAddToWorkspace, onOpenStudio }: { onNavigate?: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void; onOpenStudio?: () => void }) {
  const [search, setSearch] = useState("");
  const [param, setParam] = useState("");
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const [selected, setSelected] = useState<DatasetType | null>(null);
  const [showIngestion, setShowIngestion] = useState(false);

  const filtered = datasets.filter(d => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (param && d.parameter !== param) return false;
    if (region && d.region !== region) return false;
    if (year && d.year !== parseInt(year)) return false;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h1 className="page-header-title">Scientific Datasets</h1>
            <p className="page-header-sub">Access and explore scientific datasets from polar expeditions.</p>
          </div>
          <button className="btn-primary btn-sm" onClick={() => setShowIngestion(true)}>
            📤 Submit Dataset
          </button>
        </div>

        <div className="card p-4 mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search datasets..." aria-label="Search datasets"/>
          </div>
          <select className="filter-select" value={param} onChange={e => setParam(e.target.value)} aria-label="Filter by parameter">
            <option value="">Parameter</option>
            <option>Sea Ice</option><option>Atmosphere</option><option>Oceanography</option><option>Cryosphere</option>
          </select>
          <select className="filter-select" value={region} onChange={e => setRegion(e.target.value)} aria-label="Filter by region">
            <option value="">Region</option>
            <option>Antarctica</option><option>Arctic</option><option>Southern Ocean</option>
          </select>
          <select className="filter-select" value={year} onChange={e => setYear(e.target.value)} aria-label="Filter by year">
            <option value="">Year</option>
            {[2023,2022,2021,2020].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="space-y-3" role="list">
          {filtered.map(d => (
            <div key={d.id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(d)} role="listitem">
              <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0" aria-hidden="true">
                <img src={d.thumb} alt="" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(14,31,61,0.5)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} className="w-6 h-6"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/></svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1 hover:text-blue-600" style={{ color: "var(--text-primary)" }}>{d.title}</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>📦 {d.size}</span>
                  <span className="tag">{d.parameter}</span>
                  <span className="tag tag-green">{d.region}</span>
                  <span className="tag tag-orange">{d.category}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{d.year}</span>
                  {datasetProvenance[d.id] && <span className="text-[10px] font-semibold text-green-600">🔓 Open</span>}
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <button className="btn-primary btn-sm" onClick={e => { e.stopPropagation(); }}>Download</button>
                  <button className="btn-outline btn-sm" onClick={e => { e.stopPropagation(); setSelected(d); }}>Details →</button>
                </div>
                <SaveFollowButton entityId={d.id.toString()} entityType="dataset" compact/>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center" style={{ color: "var(--text-muted)" }}>
            <div className="text-2xl mb-2" aria-hidden="true">💾</div>
            <div className="text-sm">No datasets found.</div>
          </div>
        )}
      </div>

      {selected && <DatasetDetail dataset={selected} onClose={() => setSelected(null)} onNavigate={onNavigate} onAddToWorkspace={onAddToWorkspace} onOpenStudio={onOpenStudio}/>}
      {showIngestion && <IngestionPipeline onClose={() => setShowIngestion(false)}/>}
    </div>
  );
}
