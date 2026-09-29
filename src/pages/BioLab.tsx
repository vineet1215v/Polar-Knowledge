import { useState, useEffect } from "react";
import EdnaLab from "./EdnaLab";
import OtolithLab from "./OtolithLab";

interface Props {
  initialLab?: "edna" | "otolith";
  onNavigate?: (p: string) => void;
  onToast?: (msg: string) => void;
}

export default function BioLab({
  initialLab = "edna",
  onNavigate,
  onToast,
}: Props) {
  const [activeLab, setActiveLab] = useState<"edna" | "otolith">(initialLab);

  // Sync state if initialLab prop changes
  useEffect(() => {
    if (initialLab) {
      setActiveLab(initialLab);
    }
  }, [initialLab]);

  // Handle inner navigation switching between labs seamlessly
  const handleInnerNavigate = (page: string) => {
    if (page === "otolith-lab") {
      setActiveLab("otolith");
      return;
    }
    if (page === "edna-lab") {
      setActiveLab("edna");
      return;
    }
    onNavigate?.(page);
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "var(--content-bg, #f1f5f9)" }}
    >
      {/* ── UNIFIED TOP BAR FOR COMBINED BIOLOGICAL LABS ───────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200/90 shadow-2xs z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Title & Description */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-2xs">
                {activeLab === "edna" ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5 text-[#003366]"
                  >
                    <path d="M2 15c6.667-6 13.333 0 20-6" />
                    <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
                    <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5 text-[#003366]"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                    eDNA &amp; Otolith Lab
                  </h1>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-200">
                    Biological Sciences
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {activeLab === "edna"
                    ? "Environmental DNA sequence analysis, species barcode matching & biodiversity profiling"
                    : "Microstructure biochronology, annual annuli validation & paleotemperature thermometry"}
                </p>
              </div>
            </div>

            {/* Segmented 2-Tab Switcher & Quick Links */}
            <div className="flex items-center gap-2.5 self-start sm:self-center">
              {/* Segmented Pill Switcher */}
              <div
                className="bg-[#e2e8f0]/90 p-1 rounded-xl flex items-center gap-1 border border-slate-300/60 shadow-2xs"
                role="tablist"
                aria-label="Biological Labs Switcher"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeLab === "edna"}
                  onClick={() => setActiveLab("edna")}
                  className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeLab === "edna"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-3.5 h-3.5 text-[#003366]"
                  >
                    <path d="M2 15c6.667-6 13.333 0 20-6" />
                    <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
                    <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
                  </svg>
                  <span>eDNA Lab</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeLab === "otolith"}
                  onClick={() => setActiveLab("otolith")}
                  className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeLab === "otolith"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-3.5 h-3.5 text-[#003366]"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1" />
                  </svg>
                  <span>Otolith Lab</span>
                </button>
              </div>

              {/* Quick Navigation Jump Chips */}
              {onNavigate && (
                <div className="hidden lg:flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onNavigate("ai-tools")}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>AI Tools</span>
                    <span>&rarr;</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("dashboard")}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Dashboard</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTIVE LAB VIEW CONTAINER ────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {activeLab === "edna" ? (
          <EdnaLab
            onNavigate={handleInnerNavigate}
            onToast={onToast}
            embedded={true}
          />
        ) : (
          <OtolithLab
            onNavigate={handleInnerNavigate}
            onToast={onToast}
            embedded={true}
          />
        )}
      </div>
    </div>
  );
}
