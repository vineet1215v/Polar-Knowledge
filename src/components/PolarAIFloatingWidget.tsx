import { useState, useRef, useEffect } from "react"

interface PolarAIFloatingWidgetProps {
  onNavigate: (page: string) => void
}

export default function PolarAIFloatingWidget({
  onNavigate,
}: PolarAIFloatingWidgetProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
    }, 250)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  const quickPrompts = [
    "Antarctic sea-ice minimum anomaly",
    "Maitri & Bharati weather telemetry",
    "Sub-zero otolith growth rings",
    "12S MiFish eDNA metabarcoding",
  ]

  return (
    <div
      className="fixed right-5 bottom-6 z-50 flex flex-col items-end select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── EXPANDABLE QUICK HOVER PREVIEW CARD ── */}
      {showTooltip && (
        <div
          role="tooltip"
          className="mb-3 w-80 rounded-2xl bg-[#001E3D]/95 backdrop-blur-md text-white p-4 shadow-2xl border border-cyan-500/30 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
          style={{
            boxShadow: "0 20px 40px -15px rgba(2, 132, 199, 0.4)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5 text-cyan-300"
                >
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-xs text-white leading-tight flex items-center gap-1.5">
                  Polar AI Assistant
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-cyan-200/80 font-medium">
                  National Polar & Ocean Knowledge Engine
                </div>
              </div>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-700/50">
              RAG Active
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-slate-300 my-2.5 leading-relaxed">
            Query India&apos;s 46 polar expeditions, Arctic & Antarctic station
            telemetry, otolith sclerochronology, and genomic eDNA records.
          </p>

          {/* Suggested Quick Inquiries */}
          <div className="space-y-1.5 mb-3">
            <div className="text-[10px] font-bold text-cyan-300/90 uppercase tracking-wider">
              Quick Inquiries
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigate("ai")}
                  className="text-left text-[10.5px] px-2 py-1 rounded-lg bg-white/10 hover:bg-cyan-500/25 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-white transition-all duration-150 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <button
            onClick={() => onNavigate("ai")}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-900/40 cursor-pointer active:scale-[0.98]"
          >
            <span>Open Full Polar AI Workspace</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-3.5 h-3.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}

      {/* ── THE STANDARD FLOATING POLAR AI BUTTON ── */}
      <button
        onClick={() => onNavigate("ai")}
        className="group relative flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-gradient-to-r from-[#00264d] via-[#003873] to-[#0284c7] text-white shadow-xl hover:shadow-cyan-500/30 border border-cyan-400/40 hover:border-cyan-300 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(2, 132, 199, 0.45), 0 8px 10px -6px rgba(0, 40, 85, 0.4)",
        }}
        title="Open Polar AI Assistant"
        aria-label="Open Polar AI Assistant"
      >
        {/* Glow ambient layer */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300" />

        {/* Icon with glowing active radar indicator */}
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center border border-white/20 transition-colors">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform duration-300"
            >
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
            </svg>
          </div>

          {/* Pulsing Green/Cyan Status Dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#00264d]"></span>
          </span>
        </div>

        {/* Brand Typography */}
        <div className="flex flex-col items-start leading-none pr-1">
          <span className="font-extrabold text-[13px] tracking-wide text-white drop-shadow-xs flex items-center gap-1">
            Polar AI
          </span>
          <span className="text-[9.5px] font-medium text-cyan-200/90 mt-0.5">
            Ask Assistant
          </span>
        </div>

        {/* Action arrow badge */}
        <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-cyan-200 group-hover:bg-white/25 group-hover:text-white transition-colors">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>
    </div>
  )
}
