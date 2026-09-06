import { useState } from "react";
import { publications } from "../data";
import { findings, publicationHistory } from "../knowledgeData";
import { EvidenceBadge, EvidenceRow } from "../components/EvidenceBadge";
import RelatedKnowledge from "../components/RelatedKnowledge";
import SaveFollowButton from "../components/SaveFollowButton";
import AddToWorkspace from "../components/AddToWorkspace";
import type { WorkspaceSource } from "../workspaceStore";

type PubType = typeof publications[0];

function PublicationDetail({ pub, onClose, onNavigate, onAddToWorkspace, onOpenStudio }: { pub: PubType; onClose: () => void; onNavigate: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void; onOpenStudio?: () => void }) {
  const [tab, setTab] = useState<"overview" | "findings" | "evidence" | "evolution">("overview");
  const pubFindings = findings.slice(0, pub.id <= 2 ? 2 : 1);
  const history = publicationHistory[pub.id] || [{ version: "v1.0", date: `Jan ${pub.year}`, change: "Initial publication" }];

  const related = [
    { type: "dataset" as const, label: "Antarctic Sea Ice Concentration (2023)", meta: "2.1 GB" },
    { type: "expedition" as const, label: pub.id <= 3 ? "46th IAE (2024)" : "43rd IAE (2021)", meta: "Source expedition" },
    { type: "researcher" as const, label: pub.authors.split(",")[0], meta: pub.journal },
    { type: "station" as const, label: "Maitri Station", meta: "Primary data site" },
  ];

  return (
    <div className="fixed inset-0 z-40 flex" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="ml-auto w-full max-w-xl h-full bg-white flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-3">
              <span className="tag mb-1 inline-block">{pub.journal}</span>
              <h2 className="font-bold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{pub.title}</h2>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{pub.authors} · {pub.year}</div>
              <div className="text-[10px] mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>DOI: {pub.doi}</div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button className="btn-primary btn-sm">View PDF</button>
            <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate("ai"); }}>Ask Polar</button>
            <button className="btn-outline btn-sm" onClick={() => setTab("evidence")}>🔍 Evidence</button>
            <AddToWorkspace source={{ id: `pub-${pub.id}`, type: "publication", title: pub.title, meta: `${pub.journal} · ${pub.year}`, version: "v1.0", date: `${pub.year}`, origin: "NCPOR Repository" }} onAdd={onAddToWorkspace || (() => {})}/>
            <button className="btn-outline btn-sm" onClick={() => { onClose(); onOpenStudio?.(); }}>✨ Studio</button>
            <SaveFollowButton entityId={pub.id.toString()} entityType="publication" label="Publication"/>
          </div>
          <div className="tab-bar mt-3">
            {([["overview","Overview"],["findings","Key Findings"],["evidence","Evidence"],["evolution","Evolution"]] as const).map(([id,label]) => (
              <button key={id} className={`tab-item ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tab === "overview" && (
            <>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[["Domain","Polar Science"],["Expedition",pub.id <= 4 ? "46th IAE (2024)" : "Arctic 2023"],["Open Access","Yes"],["Citations","47"]].map(([k,v]) => (
                  <div key={k as string} className="card p-2.5">
                    <div className="text-[9px] uppercase font-semibold mb-0.5" style={{ color: "var(--text-muted)" }}>{k as string}</div>
                    <div className="font-medium" style={{ color: "var(--text-primary)" }}>{v as string}</div>
                  </div>
                ))}
              </div>
              <RelatedKnowledge title="Related Knowledge" entities={related} onNavigate={onNavigate}/>
              <button className="btn-outline btn-sm w-full" onClick={() => { onClose(); onNavigate("ai"); }}>
                🤖 Ask Polar about this publication →
              </button>
            </>
          )}

          {tab === "findings" && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Structured findings extracted from this publication. Evidence status reflects assessment against available NCPOR sources.</p>
              {pubFindings.map(f => (
                <div key={f.id} className="card p-3 space-y-2">
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>{f.text}</p>
                  <EvidenceRow status={f.evidenceStatus} confidence={f.confidence} sourceTitle={f.sourceTitle}/>
                  {f.relatedDatasets.length > 0 && (
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      Related datasets: {f.relatedDatasets.join(", ")}
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate("datasets"); }}>View Dataset</button>
                    <button className="btn-outline btn-sm" onClick={() => { onClose(); onNavigate("ai"); }}>Ask Polar</button>
                  </div>
                </div>
              ))}
              {pubFindings.length === 0 && <div className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>No structured findings indexed yet for this publication.</div>}
            </div>
          )}

          {tab === "evidence" && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Evidence assessment for claims in this publication.</p>
              {pubFindings.map(f => (
                <div key={f.id} className="space-y-1.5">
                  <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{f.text.slice(0, 80)}…</div>
                  <EvidenceBadge status={f.evidenceStatus} confidence={f.confidence}/>
                  <div className="text-[10px] px-3 py-2 rounded" style={{ background: "#f8fafc", color: "var(--text-secondary)" }}>
                    <strong>Evidence passage:</strong> Data from {f.sourceTitle} provides direct quantitative support. Confidence: {f.confidence}%.
                  </div>
                </div>
              ))}
              <div className="text-[10px] rounded p-2" style={{ background: "#fefce8", color: "#92400e" }}>
                ⚠️ Evidence assessments are based on available indexed NCPOR sources. Absence of evidence does not indicate absence of scientific work.
              </div>
            </div>
          )}

          {tab === "evolution" && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Version history and knowledge evolution for this publication.</p>
              <div className="space-y-0">
                {history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{h.version}</div>
                      {i < history.length - 1 && <div className="w-0.5 h-5" style={{ background: "var(--border)" }}/>}
                    </div>
                    <div className="pb-4">
                      <div className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{h.date}</div>
                      <div className="text-xs" style={{ color: "var(--text-primary)" }}>{h.change}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card p-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                <div className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Downstream Impact</div>
                If this publication is updated, the following connected artifacts should be reviewed: educational content referencing Finding F1, outreach articles citing the 2023 record minimum data.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Publications({ onNavigate, onAddToWorkspace, onOpenStudio }: { onNavigate?: (p: string) => void; onAddToWorkspace?: (s: WorkspaceSource) => void; onOpenStudio?: () => void }) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [author, setAuthor] = useState("");
  const [selected, setSelected] = useState<PubType | null>(null);

  const filtered = publications.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.journal.toLowerCase().includes(search.toLowerCase())) return false;
    if (year && p.year !== parseInt(year)) return false;
    if (author && !p.authors.toLowerCase().includes(author.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      <div className="p-6">
        <div className="mb-5">
          <h1 className="page-header-title">Research Publications</h1>
          <p className="page-header-sub">Explore scientific papers, articles and citations by NCPOR researchers.</p>
        </div>

        <div className="card p-4 mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search publications..."/>
          </div>
          <select className="filter-select" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">Year</option>
            {[2024,2023,2022,2021,2020].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="filter-select" value={author} onChange={e => setAuthor(e.target.value)}>
            <option value="">Author</option>
            <option value="Sharma">A. Sharma</option>
            <option value="Verma">P. Verma</option>
            <option value="Mehta">K. Mehta</option>
          </select>
          <select className="filter-select">
            <option value="">Topic</option>
            <option>Sea Ice</option><option>Glaciology</option><option>Oceanography</option><option>Atmosphere</option><option>Biodiversity</option>
          </select>
        </div>

        <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
          {filtered.map(p => (
            <div key={p.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelected(p)}>
              <img src={p.thumb} alt={p.title} className="publication-thumb rounded-lg"/>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold leading-snug mb-1 hover:text-blue-600" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="tag">{p.journal}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>· {p.year} · {p.authors}</span>
                </div>
                <div className="text-[10px] mt-1 font-mono" style={{ color: "var(--text-muted)" }}>DOI: {p.doi}</div>
                {/* Evidence badge for top publications */}
                {p.id <= 2 && (
                  <div className="mt-1.5">
                    <EvidenceBadge status={p.id === 1 ? "source_backed" : "synthesis"} confidence={p.id === 1 ? 94 : 71}/>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <button className="btn-primary btn-sm" onClick={e => { e.stopPropagation(); }}>View PDF</button>
                  <button className="btn-outline btn-sm" onClick={e => { e.stopPropagation(); setSelected(p); }}>Explore →</button>
                </div>
                <SaveFollowButton entityId={p.id.toString()} entityType="publication" compact/>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center" style={{ color: "var(--text-muted)" }}>
            <div className="text-2xl mb-2">📄</div>
            <div className="text-sm">No publications found.</div>
          </div>
        )}
        <div className="mt-4 text-xs text-center" style={{ color: "var(--text-muted)" }}>Showing {filtered.length} of {publications.length} publications</div>
      </div>

      {selected && <PublicationDetail pub={selected} onClose={() => setSelected(null)} onNavigate={onNavigate || (() => {})} onAddToWorkspace={onAddToWorkspace} onOpenStudio={onOpenStudio}/>}
    </div>
  );
}
