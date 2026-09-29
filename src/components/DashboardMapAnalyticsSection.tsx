import DashboardPolarMap from "./DashboardPolarMap"

interface Props {
  onNavigate: (p: string) => void
  onToast: (msg: string) => void
}

export default function DashboardMapAnalyticsSection({
  onNavigate,
  onToast,
}: Props) {
  return (
    <section className="space-y-4">
      {/* ── TWO-COLUMN GRID: LEFT POLAR MAP + RIGHT DIGITAL TWIN & ANALYTICS ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: EXACT POLAR MAP (8 COLS) ──────── */}
        <div className="lg:col-span-8 flex flex-col">
          <DashboardPolarMap onNavigate={onNavigate} onToast={onToast} />
        </div>

        {/* ── RIGHT COLUMN: DIGITAL TWIN AI (TOP) + DYNAMIC ANALYTICS (BOTTOM) (4 COLS) ── */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* ── CARD 1: DIGITAL TWIN AI ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header: Star/Sparkle Icon + Title + AI Badge */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 tracking-tight">
                    Digital Twin AI
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AI SIMULATION
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-xs text-slate-500 leading-relaxed mb-3.5">
                Bio-physical polar ecosystem simulator modeling species biomass, ocean warming &amp; trophic shifts.
              </p>

              {/* Live Telemetry KPI Chips */}
              <div className="grid grid-cols-3 gap-2 mb-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
                  <div className="text-[10px] font-medium text-slate-500">Eco Health</div>
                  <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">88.4%</div>
                  <div className="text-[9px] text-slate-400">Optimal</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
                  <div className="text-[10px] font-medium text-slate-500">Sea Temp</div>
                  <div className="text-sm font-bold text-blue-600 font-mono mt-0.5">24.1°C</div>
                  <div className="text-[9px] text-amber-600">▲ +0.3°C</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
                  <div className="text-[10px] font-medium text-slate-500">O₂ Level</div>
                  <div className="text-sm font-bold text-cyan-600 font-mono mt-0.5">6.0 mg/L</div>
                  <div className="text-[9px] text-slate-400">Stable</div>
                </div>
              </div>

              {/* Live Monitored Marine Species Mini-List */}
              <div className="space-y-1.5 mb-4 text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Active Modeled Species
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="font-semibold text-slate-800">Yellowfin Tuna</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-blue-700">10,241 kg</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="font-semibold text-slate-800">Oil Sardine</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-emerald-700">7,672 kg</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/50 border border-purple-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="font-semibold text-slate-800">Tiger Prawn</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-purple-700">1,280 kg</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              type="button"
              onClick={() => onNavigate("digital-twin")}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#003366] to-[#1D4ED8] hover:from-[#002244] hover:to-[#1e40af] active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" />
              </svg>
              <span>Launch Digital Twin AI &rarr;</span>
            </button>
          </div>

          {/* ── CARD 2: DYNAMIC ANALYTICS ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header: Blue Bar Chart Icon + Title + NEW Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center flex-shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Dynamic Analytics
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  NEW
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-xs text-slate-500 leading-relaxed mb-4 text-left">
                Interactive parameter analysis with real-time polar data
                visualization
              </p>
            </div>

            {/* Button: Launch Analytics */}
            <button
              type="button"
              onClick={() => onNavigate("analytics")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Launch Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
