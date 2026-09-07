import { useState } from "react";
import { publications } from "../data";
import { EvidenceBadge } from "../components/EvidenceBadge";
import SaveFollowButton from "../components/SaveFollowButton";
import PublicationPdfModal from "../components/PublicationPdfModal";
import PublicationExploreModal from "../components/PublicationExploreModal";
import { gameStore } from "../gameStore";
import type { WorkspaceSource } from "../workspaceStore";

type PubType = typeof publications[0];

export default function Publications({
  onNavigate,
  onAddToWorkspace,
  onOpenStudio,
}: {
  onNavigate?: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [author, setAuthor] = useState("");
  const [topic, setTopic] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selected, setSelected] = useState<PubType | null>(null);
  const [pdfModalPub, setPdfModalPub] = useState<PubType | null>(null);

  const filtered = publications.filter(p => {
    if (
      search &&
      !p.title.toLowerCase().includes(search.toLowerCase()) &&
      !p.journal.toLowerCase().includes(search.toLowerCase()) &&
      !p.authors.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (year && p.year !== parseInt(year)) return false;
    if (author && !p.authors.toLowerCase().includes(author.toLowerCase())) return false;
    if (topic === "sea_ice" && !p.title.toLowerCase().includes("ice")) return false;
    if (topic === "atmosphere" && !p.title.toLowerCase().includes("atmosphere") && !p.title.toLowerCase().includes("vortex"))
      return false;
    if (topic === "biology" && !p.title.toLowerCase().includes("biodiversity") && !p.title.toLowerCase().includes("microbiome"))
      return false;
    if (topic === "ocean" && !p.title.toLowerCase().includes("ocean") && !p.title.toLowerCase().includes("sea"))
      return false;
    return true;
  });

  const handleOpenPdf = (p: PubType) => {
    setPdfModalPub(p);
    gameStore.addXP(25, `Opened Manuscript PDF: ${p.title.slice(0, 30)}...`);
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
                Research Publications Repository
              </h1>
            </div>
            <p className="page-header-sub text-xs text-slate-500 mt-1">
              Peer-reviewed polar papers, open-access manuscripts, and citation tools by NCPOR scientists.
            </p>
          </div>

          {/* View Mode Switcher: Cards vs Compact Table */}
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
              <span></span> Scientific Table
            </button>
          </div>
        </div>

        {/* Scientific Impact & Metrics HUD (Clean, no maps!) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold border border-blue-100 flex-shrink-0">
              
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">420+</div>
              <div className="text-[11px] text-slate-500 font-medium">Indexed Papers</div>
            </div>
          </div>

          <div className="card p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-100 flex-shrink-0">
              
            </div>
            <div>
              <div className="text-lg font-black text-emerald-700">14,850+</div>
              <div className="text-[11px] text-slate-500 font-medium">Global Citations</div>
            </div>
          </div>

          <div className="card p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg font-bold border border-purple-100 flex-shrink-0">
              
            </div>
            <div>
              <div className="text-lg font-black text-purple-700">94.2%</div>
              <div className="text-[11px] text-slate-500 font-medium">Open Access</div>
            </div>
          </div>

          <div className="card p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg font-bold border border-amber-100 flex-shrink-0">
              
            </div>
            <div>
              <div className="text-lg font-black text-amber-700">2.4x</div>
              <div className="text-[11px] text-slate-500 font-medium">Field Citation Ratio</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-200">
          {/* Quick Topic Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Topics" },
              { id: "sea_ice", label: " Sea Ice & Glaciers" },
              { id: "ocean", label: " Southern Ocean" },
              { id: "atmosphere", label: " Atmosphere & Ozone" },
              { id: "biology", label: " Cryomicrobiome" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  topic === t.id
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search and Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth={2}
                className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input text-xs pl-8 py-1.5"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search titles, authors, DOI..."
              />
            </div>
            <select
              className="filter-select text-xs py-1.5"
              value={year}
              onChange={e => setYear(e.target.value)}
            >
              <option value="">Year (All)</option>
              {[2024, 2023, 2022, 2021, 2020].map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              className="filter-select text-xs py-1.5"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            >
              <option value="">Author (All)</option>
              <option value="Sharma">A. Sharma</option>
              <option value="Verma">P. Verma</option>
              <option value="Mehta">K. Mehta</option>
              <option value="Iyer">S. Iyer</option>
              <option value="Nair">D. Nair</option>
              <option value="Gupta">R. Gupta</option>
            </select>
          </div>
        </div>

        {/* View Mode 1: Detailed Cards View */}
        {viewMode === "cards" && (
          <div className="space-y-3">
            {filtered.map(p => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className="card p-4 hover:shadow-md transition-all duration-150 cursor-pointer border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <img
                    src={p.thumb}
                    alt={p.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {p.journal}
                      </span>
                      <span className="text-xs font-bold text-slate-600">· {p.year}</span>
                      <span className="text-[10px] font-mono text-slate-400">DOI: {p.doi}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                      {p.title}
                    </h3>

                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{p.authors}</span>
                      {p.id <= 2 && (
                        <EvidenceBadge
                          status={p.id === 1 ? "source_backed" : "synthesis"}
                          confidence={p.id === 1 ? 94 : 71}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {/* Working View PDF Button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleOpenPdf(p);
                    }}
                    className="btn-primary btn-sm text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span></span> View PDF
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelected(p);
                    }}
                    className="btn-outline btn-sm text-xs font-medium"
                  >
                    Explore →
                  </button>

                  <SaveFollowButton entityId={p.id.toString()} entityType="publication" compact />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode 2: Compact Scientific Table View */}
        {viewMode === "table" && (
          <div className="card overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Title & DOI</th>
                    <th className="py-3 px-4">Journal</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Lead Author</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(p => (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                        <div className="font-mono text-[10px] text-slate-400">{p.doi}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          {p.journal}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">{p.year}</td>
                      <td className="py-3 px-4 text-slate-600">{p.authors.split(",")[0]}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setSelected(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition"
                          >
                            Explore →
                          </button>
                          <button
                            onClick={() => handleOpenPdf(p)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition flex items-center gap-1"
                          >
                            <span></span> View PDF
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
          <div className="card p-10 text-center text-slate-500 border border-slate-200">
            <div className="text-3xl mb-2"></div>
            <div className="text-sm font-semibold">No publications found matching your filters.</div>
            <button
              onClick={() => {
                setSearch("");
                setYear("");
                setAuthor("");
                setTopic("all");
              }}
              className="mt-3 btn-outline btn-sm text-xs"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="text-xs text-center text-slate-400 pt-2">
          Showing {filtered.length} of {publications.length} scientific publications in NCPOR indexed repository.
        </div>
      </div>

      {/* Publication Explore Modal */}
      {selected && (
        <PublicationExploreModal
          pub={selected}
          onClose={() => setSelected(null)}
          onOpenPdf={handleOpenPdf}
          onNavigate={onNavigate}
          onAddToWorkspace={onAddToWorkspace}
          onOpenStudio={onOpenStudio}
        />
      )}

      {/* Interactive PDF Reader Modal */}
      {pdfModalPub && (
        <PublicationPdfModal
          pub={pdfModalPub}
          onClose={() => setPdfModalPub(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
