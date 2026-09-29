import { useState, useEffect } from "react"
import Expeditions from "./Expeditions"
import Publications from "./Publications"
import Datasets from "./Datasets"
import MediaGallery from "./MediaGallery"
import type { WorkspaceSource } from "../workspaceStore"

export type ExplorerTab = "expeditions" | "publications" | "datasets" | "media"

interface Props {
  initialTab?: ExplorerTab
  onNavigate: (p: string) => void
  onAddToWorkspace?: (s: WorkspaceSource) => void
  onOpenStudio?: () => void
}

interface ExplorerCardConfig {
  id: ExplorerTab
  title: string
  metric: string
  tag: string
  accentColor: string
  iconBg: string
  activeBorder: string
  activeRing: string
  icon: React.ReactNode
}

export default function DataExplorer({
  initialTab = "expeditions",
  onNavigate,
  onAddToWorkspace,
  onOpenStudio,
}: Props) {
  const [activeTab, setActiveTab] = useState<ExplorerTab>(initialTab)

  // Sync if initialTab prop changes externally
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const cards: ExplorerCardConfig[] = [
    {
      id: "expeditions",
      title: "Expeditions",
      metric: "44",
      tag: "44 Missions · Antarctic & Arctic",
      accentColor: "#1D4ED8",
      iconBg: "bg-blue-50 text-[#1D4ED8] border-blue-200/80",
      activeBorder: "border-[#1D4ED8]",
      activeRing: "ring-2 ring-blue-500/20",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <polygon points="12 2 19 21 12 17 5 21 12 2" />
        </svg>
      ),
    },
    {
      id: "publications",
      title: "Research Publications",
      metric: "1,248",
      tag: "1,248 Papers · DOIs & Citations",
      accentColor: "#10B981",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
      activeBorder: "border-emerald-600",
      activeRing: "ring-2 ring-emerald-500/20",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: "datasets",
      title: "Scientific Datasets",
      metric: "364",
      tag: "364 Repositories · NetCDF & CTD",
      accentColor: "#8B5CF6",
      iconBg: "bg-purple-50 text-purple-600 border-purple-200/80",
      activeBorder: "border-purple-600",
      activeRing: "ring-2 ring-purple-500/20",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
    },
    {
      id: "media",
      title: "Multimedia",
      metric: "5,120",
      tag: "5,120 Photos, Reels & 360° VR",
      accentColor: "#0284C7",
      iconBg: "bg-blue-50 text-blue-600 border-blue-200/80",
      activeBorder: "border-blue-600",
      activeRing: "ring-2 ring-blue-500/20",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
  ]

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "var(--content-bg)" }}
    >
      {/* ── COMPACT TOP HEADER & 4 HORIZONTAL CARDS STRIP ───────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200/90 shadow-2xs z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2.5">
          {/* Slim Title & Navigation Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center flex-shrink-0 border border-blue-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight truncate">
                Data Explorer
              </h1>
              <span className="hidden sm:inline-flex text-[11px] text-slate-400 font-medium truncate">
                &middot; National Polar &amp; Oceanographic Repository
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3 h-3"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate("analytics")}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3 h-3"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span className="hidden sm:inline">Analytics</span>
              </button>
            </div>
          </div>

          {/* ── 4-TAB SEGMENTED PILL BAR (MATCHING EDNA LAB HEADER STYLE) ─────── */}
          <div
            className="bg-[#e2e8f0]/90 p-1 rounded-xl flex items-center gap-1 border border-slate-300/60 shadow-2xs"
            role="tablist"
            aria-label="Data Explorer Categories"
          >
            {cards.map((card) => {
              const isActive = activeTab === card.id
              return (
                <button
                  key={card.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(card.id)}
                  className={`flex-1 py-2 px-2.5 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{card.title}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                      isActive
                        ? "bg-[#003366] text-white border-[#003366] shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {card.metric}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── ACTIVE VIEW CONTAINER (EMBEDS THE ALREADY PRESENT PAGES DIRECTLY) ── */}
      <div className="flex-1 min-h-0 overflow-y-auto relative flex flex-col">
        {activeTab === "expeditions" && (
          <Expeditions
            onNavigate={onNavigate}
            onAddToWorkspace={onAddToWorkspace}
            onOpenStudio={onOpenStudio}
          />
        )}

        {activeTab === "publications" && (
          <Publications
            onNavigate={onNavigate}
            onAddToWorkspace={onAddToWorkspace}
            onOpenStudio={onOpenStudio}
          />
        )}

        {activeTab === "datasets" && (
          <Datasets
            onNavigate={onNavigate}
            onAddToWorkspace={onAddToWorkspace}
            onOpenStudio={onOpenStudio}
          />
        )}

        {activeTab === "media" && (
          <MediaGallery
            onNavigate={onNavigate}
            onAddToWorkspace={onAddToWorkspace}
            onOpenStudio={onOpenStudio}
          />
        )}
      </div>
    </div>
  )
}
