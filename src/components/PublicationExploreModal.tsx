import { useState } from "react";
import { publications } from "../data";
import { findings, publicationHistory } from "../knowledgeData";
import { EvidenceBadge, EvidenceRow } from "./EvidenceBadge";
import RelatedKnowledge from "./RelatedKnowledge";
import SaveFollowButton from "./SaveFollowButton";
import AddToWorkspace from "./AddToWorkspace";
import { gameStore } from "../gameStore";
import type { WorkspaceSource } from "../workspaceStore";

type PubType = typeof publications[0];

interface PublicationExploreModalProps {
  pub: PubType;
  onClose: () => void;
  onOpenPdf: (p: PubType) => void;
  onNavigate?: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}

export default function PublicationExploreModal({
  pub,
  onClose,
  onOpenPdf,
  onNavigate,
  onAddToWorkspace,
  onOpenStudio,
}: PublicationExploreModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "findings" | "evidence" | "evolution" | "impact">("overview");

  const pubFindings = findings.filter(f => f.sourceId === `pub${pub.id}` || (pub.id === 1 && f.id === "f1") || (pub.id === 2 && f.id === "f2") || (pub.id === 3 && f.id === "f3") || (pub.id === 4 && f.id === "f5") || (pub.id === 5 && f.id === "f4") || (pub.id === 6 && f.id === "f6"));
  const displayFindings = pubFindings.length > 0 ? pubFindings : findings.slice(0, 2);

  const history = publicationHistory[pub.id] || [
    { version: "v1.0", date: `Jan ${pub.year}`, change: "Initial peer-reviewed publication" },
    { version: "v1.1", date: `May ${pub.year}`, change: "Supplemental data and figures archived to NCPOR data centre" },
  ];

  const related = [
    { type: "dataset" as const, label: "Antarctic Sea Ice Concentration (2023)", meta: "2.1 GB · NetCDF" },
    { type: "expedition" as const, label: pub.id <= 3 ? "46th IAE (2024)" : "43rd IAE (2021)", meta: "Source expedition" },
    { type: "researcher" as const, label: pub.authors.split(",")[0], meta: pub.journal },
    { type: "station" as const, label: "Maitri Station", meta: "Primary field data site" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Ribbon */}
        <div className="flex-shrink-0 bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-xl flex-shrink-0">
              
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {pub.journal}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {pub.year} · DOI: {pub.doi}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 hidden sm:inline">
                  ● Verified Open Access
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                {pub.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onOpenPdf(pub)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Open full interactive PDF manuscript"
            >
              <span></span> Read Manuscript
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition"
              aria-label="Close"
            >
              x
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex-shrink-0 bg-slate-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300/80 shadow-2xs">
            {(
              [
                ["overview", " Overview & Synopsis"],
                ["findings", " Key Scientific Findings"],
                ["evidence", " Evidence Rigor"],
                ["evolution", " Version History"],
                ["impact", " Impact & Reach"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === id
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <AddToWorkspace
              source={{
                id: `pub-${pub.id}`,
                type: "publication",
                title: pub.title,
                meta: `${pub.journal} · ${pub.year}`,
                version: "v1.0",
                date: `${pub.year}`,
                origin: "NCPOR Repository",
              }}
              onAdd={onAddToWorkspace || (() => {})}
            />
            <SaveFollowButton entityId={pub.id.toString()} entityType="publication" compact />
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Metadata Cards HUD */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="card p-3.5 bg-white border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Discipline</div>
                  <div className="text-sm font-bold text-slate-800">Polar Cryosphere</div>
                  <div className="text-[11px] text-blue-600 font-medium mt-0.5">Earth Sciences</div>
                </div>
                <div className="card p-3.5 bg-white border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Expedition Source</div>
                  <div className="text-sm font-bold text-slate-800">{pub.id <= 4 ? "46th IAE (2024)" : "Arctic 2023"}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">NCPOR Mission</div>
                </div>
                <div className="card p-3.5 bg-white border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Field Site</div>
                  <div className="text-sm font-bold text-slate-800">Maitri / Southern Ocean</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Ground & Marine</div>
                </div>
                <div className="card p-3.5 bg-white border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Citations</div>
                  <div className="text-sm font-bold text-emerald-700">{pub.id === 1 ? "47 Citations" : "28 Citations"}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Top 5% in Glaciology</div>
                </div>
              </div>

              {/* Research Synopsis */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Scientific Abstract & Synopsis
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Peer-Reviewed Original Research
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  High-latitude observation and empirical calibration data gathered during recent Indian polar expeditions.
                  This investigation demonstrates statistically significant correlations between Southern Ocean atmospheric circulation anomalies,
                  sea-ice extent minimums, and sub-Antarctic biogeochemical carbon sinks. Utilizing in-situ CTD profiles and satellite radiometry,
                  the authors quantify multi-decadal retreat rates and present actionable climate forecasting baselines for the polar cryosphere.
                </p>
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500">
                    Lead Authors: <span className="font-semibold text-slate-800">{pub.authors}</span>
                  </div>
                  <button
                    onClick={() => onOpenPdf(pub)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Open Complete Manuscript PDF (8 Pages) →
                  </button>
                </div>
              </div>

              {/* Connected Polar Graph */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Connected Entities in Knowledge Graph
                </h3>
                <RelatedKnowledge title="" entities={related} onNavigate={onNavigate} />
              </div>
            </div>
          )}

          {/* TAB 2: FINDINGS */}
          {activeTab === "findings" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                Peer-verified quantitative claims extracted from this publication and linked into the NCPOR scientific knowledge index.
              </div>
              {displayFindings.map(f => (
                <div key={f.id} className="card p-4 space-y-3 border border-slate-200 bg-white shadow-2xs">
                  <p className="text-xs sm:text-sm leading-relaxed font-semibold text-slate-900">{f.text}</p>
                  <EvidenceRow status={f.evidenceStatus} confidence={f.confidence} sourceTitle={f.sourceTitle} />
                  {f.relatedDatasets && f.relatedDatasets.length > 0 && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                      <span className="font-semibold text-slate-700">Underlying Telemetry:</span>
                      <span className="text-blue-600 font-medium">{f.relatedDatasets.join(", ")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      className="btn-outline btn-sm text-xs"
                      onClick={() => {
                        onClose();
                        onNavigate?.("datasets");
                      }}
                    >
                      Inspect Linked Dataset →
                    </button>
                    <button
                      className="btn-outline btn-sm text-xs"
                      onClick={() => {
                        onClose();
                        onNavigate?.("ai");
                      }}
                    >
                      Ask Polar Assistant →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: EVIDENCE */}
          {activeTab === "evidence" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                Evidence assessment and confidence auditing across observational sources and peer evaluations.
              </div>
              {displayFindings.map(f => (
                <div key={f.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-900">{f.text}</div>
                  <div className="flex items-center gap-2">
                    <EvidenceBadge status={f.evidenceStatus} confidence={f.confidence} />
                    <span className="text-xs text-slate-500">Rigorous Peer Review Status</span>
                  </div>
                  <div className="text-xs px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <strong>Evidence Passage:</strong> Observational telemetry from {f.sourceTitle} provides direct mathematical and empirical support with an assessed confidence score of {f.confidence || 92}%.
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: EVOLUTION */}
          {activeTab === "evolution" && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Version History & Knowledge Evolution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological records of revisions, corrigenda, and supplemental datasets.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-blue-100 text-blue-700 border border-blue-300 flex-shrink-0">
                        {h.version}
                      </div>
                      {i < history.length - 1 && <div className="w-0.5 h-10 bg-slate-200" />}
                    </div>
                    <div className="pb-2">
                      <div className="text-xs font-bold text-slate-400 font-mono">{h.date}</div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">{h.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: IMPACT */}
          {activeTab === "impact" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-4 border border-slate-200 bg-white">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Field Citation Ratio</div>
                  <div className="text-2xl font-black text-blue-700">2.4x</div>
                  <div className="text-[11px] text-slate-500 mt-1">Relative to domain average</div>
                </div>
                <div className="card p-4 border border-slate-200 bg-white">
                  <div className="text-xs font-semibold text-slate-500 mb-1">SCAR Policy Mentions</div>
                  <div className="text-2xl font-black text-emerald-600">3 Reports</div>
                  <div className="text-[11px] text-slate-500 mt-1">Antarctic Treaty Consultative Meeting</div>
                </div>
                <div className="card p-4 border border-slate-200 bg-white">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Repository Downloads</div>
                  <div className="text-2xl font-black text-purple-700">1,420+</div>
                  <div className="text-[11px] text-slate-500 mt-1">PDF & dataset queries</div>
                </div>
              </div>

              <div className="card p-5 border border-slate-200 bg-white space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Institutional Affiliation & Archival Guarantee
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Published under the auspices of the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Government of India.
                  Digital preservation maintained by the Indian Polar Data Centre adhering to FAIR data principles.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 bg-white px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            NCPOR Research Portal · DOI: <span className="font-mono text-slate-700">{pub.doi}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigate?.("ai");
              }}
              className="btn-outline btn-sm text-xs font-semibold flex items-center gap-1"
            >
              <span></span> Ask Polar AI
            </button>
            <button
              onClick={() => onOpenPdf(pub)}
              className="btn-primary btn-sm text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <span></span> View Full PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

