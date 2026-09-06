import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PolarStudio from "./components/PolarStudio";
import Dashboard from "./pages/Dashboard";
import Expeditions from "./pages/Expeditions";
import Publications from "./pages/Publications";
import Datasets from "./pages/Datasets";
import MediaGallery from "./pages/MediaGallery";
import PolarMap from "./pages/PolarMap";
import PolarAI from "./pages/PolarAI";
import Education from "./pages/Education";
import News from "./pages/News";
import Events from "./pages/Events";
import About from "./pages/About";
import { WorkspaceSource, typeIcon } from "./workspaceStore";
// AddToWorkspaceButton lives in components/AddToWorkspace to avoid circular imports


type Page =
  | "dashboard" | "expeditions" | "publications" | "datasets"
  | "media" | "map" | "ai" | "education" | "news" | "events" | "about";

function SearchResults({ query, onClose, onNavigate }: { query: string; onClose: () => void; onNavigate: (p: Page) => void }) {
  const results = [
    { type: "Publications", count: 24, dest: "publications" as Page, items: [
      { label: "Changing sea ice dynamics in the Southern Ocean", meta: "J. Glaciology · 2024" },
      { label: "Atmospheric composition over Antarctica", meta: "Env. Research Letters · 2023" },
    ]},
    { type: "Datasets", count: 8, dest: "datasets" as Page, items: [
      { label: "Antarctic Sea Ice Concentration (2023)", meta: "2.1 GB · Open Access" },
      { label: "Ocean Temperature Profiles – Southern Ocean", meta: "1.4 GB · NetCDF" },
    ]},
    { type: "Expeditions", count: 5, dest: "expeditions" as Page, items: [
      { label: "46th IAE (2024) — Active", meta: "Nov 2024 – Mar 2025" },
      { label: "45th IAE (2023) — Completed", meta: "Nov 2023 – Mar 2024" },
    ]},
    { type: "Findings", count: 12, dest: "publications" as Page, items: [
      { label: "Sea ice reached record minimum 1.79M km² (Feb 2023)", meta: "Source-Backed · 94% confidence" },
      { label: "Southern Ocean absorbed ~4.3 Gt C/year (2010–2020)", meta: "Synthesis · 76% confidence" },
    ]},
    { type: "Media", count: 38, dest: "media" as Page, items: [
      { label: "Antarctic Landscape (IAE 2024)", meta: "Photo" },
      { label: "Aurora Australis Observation", meta: "Photo · IAE 2023" },
    ]},
    { type: "Education", count: 6, dest: "education" as Page, items: [
      { label: "What is Sea Ice? (Learning Module)", meta: "Beginner · 8 min" },
      { label: "Climate Change Module", meta: "Intermediate · 12 min" },
    ]},
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="card w-full max-w-2xl mx-4 max-h-[75vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white" style={{ borderColor: "var(--border)" }}>
          <div>
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Search results for: </span>
            <span className="font-bold text-sm" style={{ color: "var(--accent)" }}>"{query}"</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>
        <div className="p-4 space-y-5">
          {results.map(r => (
            <div key={r.type}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs" style={{ color: "var(--text-primary)" }}>{r.type}</span>
                <div className="flex items-center gap-2">
                  <span className="tag">{r.count} results</span>
                  <button className="text-[10px] font-semibold" style={{ color: "var(--accent)" }} onClick={() => { onNavigate(r.dest); onClose(); }}>View all →</button>
                </div>
              </div>
              <div className="space-y-1">
                {r.items.map(item => (
                  <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer group" onClick={() => { onNavigate(r.dest); onClose(); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-3.5 h-3.5 flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs group-hover:text-blue-600 transition-colors" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.meta}</div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>Open</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-2 border-t text-center" style={{ borderColor: "var(--border)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Search covers: Expeditions · Publications · Datasets · Findings · Media · Stations · Researchers · Events · Education</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating workspace tray — appears when sources are selected
function WorkspaceTray({ sources, onRemove, onClear, onOpenAI, onOpenStudio }: {
  sources: WorkspaceSource[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenAI: () => void;
  onOpenStudio: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 overflow-hidden animate-slide-up"
      style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", minWidth: 360, maxWidth: "90vw" }}
    >
      {/* Collapsed bar */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-2 flex-1 text-left">
          <span className="text-base">📚</span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Sources</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--accent)", color: "white" }}>{sources.length}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3.5 h-3.5 ml-auto transition-transform ${expanded ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }}><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onOpenAI} className="btn-outline btn-sm" style={{ fontSize: "11px" }}>Ask AI</button>
          <button onClick={onOpenStudio} className="btn-primary btn-sm" style={{ fontSize: "11px" }}>✨ Studio</button>
          <button onClick={onClear} title="Clear all" className="w-6 h-6 rounded flex items-center justify-center transition-colors" style={{ color: "var(--text-muted)" }} onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-secondary)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} aria-label="Clear workspace">✕</button>
        </div>
      </div>

      {/* Expanded source list */}
      {expanded && (
        <div className="px-4 pb-3 space-y-1.5" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="text-[10px] font-semibold pt-2 mb-1" style={{ color: "var(--text-muted)" }}>Selected Sources — content generated from these</div>
          {sources.map(s => (
            <div key={s.id} className="flex items-center gap-2 py-1 px-2 rounded-lg" style={{ background: "var(--surface-secondary)" }}>
              <span className="text-sm flex-shrink-0">{typeIcon[s.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{s.title}</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.meta}{s.version ? ` · ${s.version}` : ""}</div>
              </div>
              <button onClick={() => onRemove(s.id)} className="text-sm flex-shrink-0 w-5 h-5 rounded flex items-center justify-center" style={{ color: "var(--text-muted)" }} aria-label="Remove source">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [workspace, setWorkspace] = useState<WorkspaceSource[]>([]);
  const [studioOpen, setStudioOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  const navigate = (p: string) => { setPage(p as Page); setSearchQuery(""); };

  function addToWorkspace(source: WorkspaceSource) {
    setWorkspace(ws => ws.find(s => s.id === source.id) ? ws : [...ws, source]);
  }
  function removeFromWorkspace(id: string) {
    setWorkspace(ws => ws.filter(s => s.id !== id));
  }

  const sharedProps = { onNavigate: navigate, onAddToWorkspace: addToWorkspace, onOpenStudio: () => setStudioOpen(true) };

  function renderPage() {
    switch (page) {
      case "dashboard":    return <Dashboard {...sharedProps}/>;
      case "expeditions":  return <Expeditions {...sharedProps}/>;
      case "publications": return <Publications {...sharedProps}/>;
      case "datasets":     return <Datasets {...sharedProps}/>;
      case "media":        return <MediaGallery {...sharedProps}/>;
      case "map":          return <PolarMap {...sharedProps}/>;
      case "ai":           return <PolarAI {...sharedProps} workspaceSources={workspace} onAddToWorkspace={addToWorkspace}/>;
      case "education":    return <Education {...sharedProps}/>;
      case "news":         return <News/>;
      case "events":       return <Events onNavigate={navigate}/>;
      case "about":        return <About onNavigate={navigate}/>;
      default:             return <Dashboard {...sharedProps}/>;
    }
  }

  return (
    <div className="h-full overflow-hidden">
      {/* ── FULL WIDTH HEADER ───────────────────────────── */}
    <Header
      onSearch={setSearchQuery}
      onNavigate={navigate}
      workspaceCount={workspace.length}
      onOpenWorkspace={() => setStudioOpen(true)}
      onToggleSidebar={() =>
        setSidebarCollapsed(prev => !prev)
      }
    />

    {/* ── SIDEBAR ────────────────────────────────────── */}
    <Sidebar
      active={page}
      onNavigate={setPage}
      collapsed={sidebarCollapsed}
    />

    {/* ── MAIN CONTENT ───────────────────────────────── */}
   <main
  style={{
    position: "fixed",
    top: "var(--header-height)",
    left: sidebarCollapsed ? "72px" : "var(--sidebar-width)",
    right: 0,
    bottom: 0,
    overflow: "auto",
    transition: "left 0.2s ease",
    background: "var(--page-bg)",
  }}
>
  {renderPage()}
</main>

    {searchQuery && (
      <SearchResults
        query={searchQuery}
        onClose={() => setSearchQuery("")}
        onNavigate={p => {
          setPage(p);
          setSearchQuery("");
        }}
      />
    )}

    {workspace.length > 0 && !studioOpen && (
      <WorkspaceTray
        sources={workspace}
        onRemove={removeFromWorkspace}
        onClear={() => setWorkspace([])}
        onOpenAI={() => navigate("ai")}
        onOpenStudio={() => setStudioOpen(true)}
      />
    )}

    {studioOpen && (
      <PolarStudio
        sources={workspace}
        onClose={() => setStudioOpen(false)}
        onNavigate={navigate}
      />
    )}

  </div>
  );
}
