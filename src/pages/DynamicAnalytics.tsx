import { useState, useEffect } from "react"

interface Props {
  onNavigate: (p: string) => void
}

type ParameterType = "Temperature" | "SnowCover" | "GlacierFlow" | "Permafrost"

interface ParamConfig {
  label: string
  unit: string
  currentVal: string
  changePct: string
  isPositive: boolean
  strokeColor: string
  fillGradId: string
  fillColor: string
  wavePoints: { x: number; y: number; label: string; val: string }[]
  yAxisLabel: string
  yAxisLineY: number
}

export default function DynamicAnalytics({ onNavigate }: Props) {
  // Live Clock & Live Mode
  const [currentTime, setCurrentTime] = useState("")
  const [liveMode, setLiveMode] = useState(true)
  const [selectedParam, setSelectedParam] =
    useState<ParameterType>("Temperature")

  // Hover & selection states
  const [hoveredWaveIndex, setHoveredWaveIndex] = useState<number | null>(null)
  const [hoveredTempIndex, setHoveredTempIndex] = useState<number | null>(null)
  const [selectedGasSlice, setSelectedGasSlice] = useState<{
    name: string
    formula: string
    pct: number
    concentration: string
    source: string
  }>({
    name: "Permafrost Thaw Degassing",
    formula: "CH₄",
    pct: 42,
    concentration: "1,942 ppb",
    source: "Thermokarst tundra fen & active layer microbial methanogenesis",
  })
  const [activeRadarNode, setActiveRadarNode] = useState<{
    id: number
    label: string
    score: number
  } | null>({
    id: 1,
    label: "Water Quality Index",
    score: 92,
  })

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [classifierModalOpen, setClassifierModalOpen] = useState(false)

  // Live clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Parameter Configurations for Interactive Parameter Analysis
  const paramConfigs: Record<ParameterType, ParamConfig> = {
    Temperature: {
      label: "Sea Surface Temperature",
      unit: "°C",
      currentVal: "31.43 °C",
      changePct: "+3.1% vs avg",
      isPositive: true,
      strokeColor: "#EA580C",
      fillGradId: "paramTempGrad",
      fillColor: "#EA580C",
      yAxisLabel: "31.43°",
      yAxisLineY: 30,
      wavePoints: [
        { x: 40, y: 170, label: "00:00", val: "26.4°C" },
        { x: 120, y: 130, label: "03:00", val: "27.8°C" },
        { x: 200, y: 145, label: "06:00", val: "27.2°C" },
        { x: 280, y: 130, label: "09:00", val: "28.1°C" },
        { x: 360, y: 80, label: "12:00", val: "30.4°C" },
        { x: 440, y: 125, label: "15:00", val: "28.6°C" },
        { x: 520, y: 155, label: "18:00", val: "26.9°C" },
        { x: 600, y: 125, label: "21:00", val: "28.8°C" },
        { x: 680, y: 95, label: "00:00", val: "30.2°C" },
        { x: 760, y: 130, label: "03:00", val: "28.2°C" },
        { x: 840, y: 30, label: "Now", val: "31.43°C" },
      ],
    },
    Permafrost: {
      label: "Permafrost Thaw Rate",
      unit: "cm/yr",
      currentVal: "14.8 cm/yr",
      changePct: "+12.5% vs avg",
      isPositive: true,
      strokeColor: "#059669",
      fillGradId: "paramPermafrostGrad",
      fillColor: "#059669",
      yAxisLabel: "14.8",
      yAxisLineY: 40,
      wavePoints: [
        { x: 40, y: 160, label: "00:00", val: "11.2 cm/yr" },
        { x: 120, y: 140, label: "03:00", val: "11.8 cm/yr" },
        { x: 200, y: 130, label: "06:00", val: "12.4 cm/yr" },
        { x: 280, y: 110, label: "09:00", val: "13.1 cm/yr" },
        { x: 360, y: 75, label: "12:00", val: "13.9 cm/yr" },
        { x: 440, y: 95, label: "15:00", val: "14.2 cm/yr" },
        { x: 520, y: 120, label: "18:00", val: "14.0 cm/yr" },
        { x: 600, y: 100, label: "21:00", val: "14.4 cm/yr" },
        { x: 680, y: 70, label: "00:00", val: "14.6 cm/yr" },
        { x: 760, y: 105, label: "03:00", val: "14.7 cm/yr" },
        { x: 840, y: 40, label: "Now", val: "14.8 cm/yr" },
      ],
    },
    GlacierFlow: {
      label: "Glacier Flow Velocity",
      unit: "m/yr",
      currentVal: "142.6 m/yr",
      changePct: "+18.5% vs avg",
      isPositive: true,
      strokeColor: "#2563EB",
      fillGradId: "paramGlacierGrad",
      fillColor: "#2563EB",
      yAxisLabel: "142.6",
      yAxisLineY: 50,
      wavePoints: [
        { x: 40, y: 130, label: "00:00", val: "122 m/yr" },
        { x: 120, y: 115, label: "03:00", val: "128 m/yr" },
        { x: 200, y: 125, label: "06:00", val: "131 m/yr" },
        { x: 280, y: 100, label: "09:00", val: "135 m/yr" },
        { x: 360, y: 85, label: "12:00", val: "139 m/yr" },
        { x: 440, y: 110, label: "15:00", val: "141 m/yr" },
        { x: 520, y: 135, label: "18:00", val: "140 m/yr" },
        { x: 600, y: 105, label: "21:00", val: "142 m/yr" },
        { x: 680, y: 90, label: "00:00", val: "141 m/yr" },
        { x: 760, y: 115, label: "03:00", val: "142 m/yr" },
        { x: 840, y: 50, label: "Now", val: "142.6 m/yr" },
      ],
    },
    SnowCover: {
      label: "Snow Cover Duration",
      unit: "Days",
      currentVal: "184 Days",
      changePct: "-12.4% vs avg",
      isPositive: false,
      strokeColor: "#0284C7",
      fillGradId: "paramSnowCoverGrad",
      fillColor: "#0284C7",
      yAxisLabel: "184 d",
      yAxisLineY: 45,
      wavePoints: [
        { x: 40, y: 150, label: "00:00", val: "212 d" },
        { x: 120, y: 120, label: "03:00", val: "208 d" },
        { x: 200, y: 135, label: "06:00", val: "205 d" },
        { x: 280, y: 110, label: "09:00", val: "198 d" },
        { x: 360, y: 70, label: "12:00", val: "192 d" },
        { x: 440, y: 105, label: "15:00", val: "190 d" },
        { x: 520, y: 140, label: "18:00", val: "187 d" },
        { x: 600, y: 115, label: "21:00", val: "185 d" },
        { x: 680, y: 85, label: "00:00", val: "186 d" },
        { x: 760, y: 120, label: "03:00", val: "185 d" },
        { x: 840, y: 45, label: "Now", val: "184 Days" },
      ],
    },
  }

  const activeConfig = paramConfigs[selectedParam]

  // Temperature Readings Data (amber line chart)
  const tempReadings = [
    { x: 60, y: 110, temp: "25.1°C", label: "25.1°C" },
    { x: 135, y: 65, temp: "27.8°C", label: "27.8°C" },
    { x: 210, y: 45, temp: "29.2°C", label: "29.2°C" },
    { x: 285, y: 60, temp: "28.5°C", label: "28.5°C" },
    { x: 360, y: 85, temp: "27.1°C", label: "27.1°C" },
    { x: 435, y: 100, temp: "26.2°C", label: "26.2°C" },
  ]

  // Greenhouse Gas Distribution Data: Methane (CH4) & Carbon (CO2)
  const greenhouseGasData = [
    {
      name: "Permafrost Thaw Degassing",
      formula: "CH₄ (Methane)",
      pct: 42,
      concentration: "1,942 ppb",
      color: "#059669",
      bgPill: "bg-emerald-50 text-emerald-700 border-emerald-200",
      source: "Thermokarst tundra fen & active layer microbial methanogenesis",
    },
    {
      name: "Sub-ice Polar Shelf Venting",
      formula: "CH₄ Hydrate Flux",
      pct: 24,
      concentration: "1,885 ppb",
      color: "#0284C7",
      bgPill: "bg-sky-50 text-sky-700 border-sky-200",
      source: "Subsea permafrost & benthic methane clathrate dissociation",
    },
    {
      name: "Atmospheric Background Advection",
      formula: "CO₂ (Carbon Dioxide)",
      pct: 20,
      concentration: "422.8 ppm",
      color: "#2563EB",
      bgPill: "bg-blue-50 text-blue-700 border-blue-200",
      source: "Synoptic hemispheric background atmospheric transport",
    },
    {
      name: "Cryoconite & Microbial Respiration",
      formula: "CO₂ Biological Respiration",
      pct: 14,
      concentration: "419.5 ppm",
      color: "#EA580C",
      bgPill: "bg-orange-50 text-orange-700 border-orange-200",
      source: "Supraglacial cryoconite holes & active microbial respiration",
    },
  ]

  // Environmental Health Index Radar Points (Health Score: 92%)
  const radarAxes = [
    { id: 0, label: "Surface Temp", score: 88, x: 200, y: 65 },
    { id: 1, label: "Water Quality", score: 92, x: 275, y: 108 },
    { id: 2, label: "Biodiversity", score: 86, x: 270, y: 190 },
    { id: 3, label: "Dissolved O2", score: 94, x: 200, y: 235 },
    { id: 4, label: "Snow Cover Index", score: 90, x: 125, y: 190 },
    { id: 5, label: "Benthic Shelf", score: 85, x: 128, y: 108 },
  ]

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "var(--content-bg)" }}
    >
      {/* ── TOP HERO HEADER: MATCHES DASHBOARD COMMAND & CONTROL STYLE ───────── */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#1D4ED8] font-bold uppercase">
                NCPOR &middot; REAL-TIME POLAR TELEMETRY
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dynamic Analytics Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Interactive parameter telemetry, biodiversity distributions, and
              oceanographic indices
            </p>
          </div>

          {/* Controls: Live Mode Toggle, Refresh, Back to Dashboard */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setLiveMode(!liveMode)}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
                liveMode
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {liveMode && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    liveMode ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </span>
              <span>{liveMode ? "Live Mode Active" : "Telemetry Paused"}</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              title="Refresh Telemetry Stream"
              className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-3.5 h-3.5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD CONTAINER ────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* ── ROW OF 4 KPI METRIC CARDS (MATCHES DASHBOARD THEME) ─────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Temperature */}
          <div
            onClick={() => setSelectedParam("Temperature")}
            className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
              selectedParam === "Temperature"
                ? "border-[#EA580C] ring-2 ring-[#EA580C]/20"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    className="w-4 h-4"
                  >
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Temperature
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                <span>&uarr;</span> 12.3%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                28.5°C
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Baseline: 25.4°C</span>
                <span className="text-[#EA580C] font-semibold group-hover:underline">
                  View Wave &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Permafrost Thaw Rate */}
          <div
            onClick={() => setSelectedParam("Permafrost")}
            className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
              selectedParam === "Permafrost"
                ? "border-emerald-500 ring-2 ring-emerald-500/20"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <path d="M3 20h18M3 16h18M3 12h18" />
                    <path d="M4 12l4-6 4 4 5-7 4 9" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Permafrost Thaw Rate
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                <span>&uarr;</span> 12.5%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                14.8 cm/yr
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Baseline: 12.1 cm/yr</span>
                <span className="text-emerald-600 font-semibold group-hover:underline">
                  View Thaw Rate &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Glacier Flow Velocity */}
          <div
            onClick={() => setSelectedParam("GlacierFlow")}
            className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
              selectedParam === "GlacierFlow"
                ? "border-blue-500 ring-2 ring-blue-500/20"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Glacier Flow Velocity
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-0.5">
                <span>&uarr;</span> 18.5%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                142.6 m/yr
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Baseline: 118.2 m/yr</span>
                <span className="text-blue-600 font-semibold group-hover:underline">
                  View Velocity &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Snow Cover Duration */}
          <div
            onClick={() => setSelectedParam("SnowCover")}
            className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
              selectedParam === "SnowCover"
                ? "border-sky-500 ring-2 ring-sky-500/20"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Snow Cover Duration
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                <span>&darr;</span> 12.4%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                184 Days
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Baseline: 210 Days/yr</span>
                <span className="text-sky-600 font-semibold group-hover:underline">
                  View Duration &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 1: INTERACTIVE PARAMETER ANALYSIS (WHITE THEMED WITH SPLINE AREA) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          {/* Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1D4ED8] border border-blue-100 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  Interactive Parameter Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous underway sensor timeseries &middot;{" "}
                  {activeConfig.label}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Live clock pill */}
              <div className="flex items-center gap-1.5 text-slate-500 font-mono bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5 text-slate-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Last updated: {currentTime || "3:19:54 PM"}</span>
              </div>

              {/* Parameter Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedParam}
                  onChange={(e) =>
                    setSelectedParam(e.target.value as ParameterType)
                  }
                  className="bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="Temperature">Temperature (°C)</option>
                  <option value="Permafrost">Permafrost Thaw Rate (cm/yr)</option>
                  <option value="GlacierFlow">Glacier Flow Velocity (m/yr)</option>
                  <option value="SnowCover">Snow Cover Duration (Days)</option>
                </select>
              </div>

              {/* Current Value Display Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-medium">
                  Current:
                </span>
                <span className="text-slate-900 font-bold">
                  {activeConfig.currentVal}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeConfig.isPositive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {activeConfig.changePct}
                </span>
              </div>
            </div>
          </div>

          {/* Spline Area Chart Canvas */}
          <div className="relative h-64 sm:h-72 w-full pt-2 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 880 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={activeConfig.fillGradId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={activeConfig.fillColor}
                    stopOpacity="0.28"
                  />
                  <stop
                    offset="100%"
                    stopColor={activeConfig.fillColor}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Vertical dashed grid lines */}
              {[40, 120, 200, 280, 360, 440, 520, 600, 680, 760, 840].map(
                (gx, i) => (
                  <line
                    key={i}
                    x1={gx}
                    y1={10}
                    x2={gx}
                    y2={190}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                ),
              )}

              {/* Current reading baseline */}
              <text
                x="10"
                y={activeConfig.yAxisLineY + 2}
                fill="#64748B"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {activeConfig.yAxisLabel}
              </text>
              <line
                x1="40"
                y1={activeConfig.yAxisLineY}
                x2="840"
                y2={activeConfig.yAxisLineY}
                stroke="#CBD5E1"
                strokeDasharray="3 3"
              />

              {/* Filled Area under curve */}
              <path
                d={`M 40 ${activeConfig.wavePoints[0].y} C 80 ${activeConfig.wavePoints[1].y + 20}, 100 ${activeConfig.wavePoints[1].y}, 120 ${activeConfig.wavePoints[1].y} C 160 ${activeConfig.wavePoints[1].y}, 160 ${activeConfig.wavePoints[2].y}, 200 ${activeConfig.wavePoints[2].y} C 240 ${activeConfig.wavePoints[2].y}, 240 ${activeConfig.wavePoints[3].y}, 280 ${activeConfig.wavePoints[3].y} C 320 ${activeConfig.wavePoints[3].y}, 320 ${activeConfig.wavePoints[4].y}, 360 ${activeConfig.wavePoints[4].y} C 400 ${activeConfig.wavePoints[4].y}, 400 ${activeConfig.wavePoints[5].y}, 440 ${activeConfig.wavePoints[5].y} C 480 ${activeConfig.wavePoints[5].y}, 480 ${activeConfig.wavePoints[6].y}, 520 ${activeConfig.wavePoints[6].y} C 560 ${activeConfig.wavePoints[6].y}, 560 ${activeConfig.wavePoints[7].y}, 600 ${activeConfig.wavePoints[7].y} C 640 ${activeConfig.wavePoints[7].y}, 640 ${activeConfig.wavePoints[8].y}, 680 ${activeConfig.wavePoints[8].y} C 720 ${activeConfig.wavePoints[8].y}, 720 ${activeConfig.wavePoints[9].y}, 760 ${activeConfig.wavePoints[9].y} C 800 ${activeConfig.wavePoints[9].y}, 800 ${activeConfig.wavePoints[10].y}, 840 ${activeConfig.wavePoints[10].y} L 840 200 L 40 200 Z`}
                fill={`url(#${activeConfig.fillGradId})`}
              />

              {/* Stroke Line */}
              <path
                d={`M 40 ${activeConfig.wavePoints[0].y} C 80 ${activeConfig.wavePoints[1].y + 20}, 100 ${activeConfig.wavePoints[1].y}, 120 ${activeConfig.wavePoints[1].y} C 160 ${activeConfig.wavePoints[1].y}, 160 ${activeConfig.wavePoints[2].y}, 200 ${activeConfig.wavePoints[2].y} C 240 ${activeConfig.wavePoints[2].y}, 240 ${activeConfig.wavePoints[3].y}, 280 ${activeConfig.wavePoints[3].y} C 320 ${activeConfig.wavePoints[3].y}, 320 ${activeConfig.wavePoints[4].y}, 360 ${activeConfig.wavePoints[4].y} C 400 ${activeConfig.wavePoints[4].y}, 400 ${activeConfig.wavePoints[5].y}, 440 ${activeConfig.wavePoints[5].y} C 480 ${activeConfig.wavePoints[5].y}, 480 ${activeConfig.wavePoints[6].y}, 520 ${activeConfig.wavePoints[6].y} C 560 ${activeConfig.wavePoints[6].y}, 560 ${activeConfig.wavePoints[7].y}, 600 ${activeConfig.wavePoints[7].y} C 640 ${activeConfig.wavePoints[7].y}, 640 ${activeConfig.wavePoints[8].y}, 680 ${activeConfig.wavePoints[8].y} C 720 ${activeConfig.wavePoints[8].y}, 720 ${activeConfig.wavePoints[9].y}, 760 ${activeConfig.wavePoints[9].y} C 800 ${activeConfig.wavePoints[9].y}, 800 ${activeConfig.wavePoints[10].y}, 840 ${activeConfig.wavePoints[10].y}`}
                fill="none"
                stroke={activeConfig.strokeColor}
                strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Interactive Node Markers */}
              {activeConfig.wavePoints.map((pt, idx) => (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredWaveIndex(idx)}
                  onMouseLeave={() => setHoveredWaveIndex(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredWaveIndex === idx ? 7 : 4.5}
                    fill={activeConfig.strokeColor}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                  {hoveredWaveIndex === idx && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={11}
                      fill="none"
                      stroke={activeConfig.strokeColor}
                      strokeWidth={1.5}
                      opacity={0.6}
                      className="animate-ping"
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredWaveIndex !== null && (
              <div
                className="absolute z-20 bg-slate-900 text-white rounded-xl p-2.5 text-xs shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full -mt-2 border border-slate-700 animate-in fade-in zoom-in-95 duration-100"
                style={{
                  left: `${(activeConfig.wavePoints[hoveredWaveIndex].x / 880) * 100}%`,
                  top: `${(activeConfig.wavePoints[hoveredWaveIndex].y / 200) * 100}%`,
                }}
              >
                <div className="font-bold text-white font-mono">
                  {activeConfig.wavePoints[hoveredWaveIndex].val}
                </div>
                <div className="text-[10px] text-slate-300 font-sans mt-0.5">
                  {activeConfig.wavePoints[hoveredWaveIndex].label} &middot;
                  Continuous Sensor
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── ROW OF 2 CARDS: TEMPERATURE READINGS & METHANE (CH4) & CARBON (CO2) DISTRIBUTION ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card: Temperature Readings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  className="w-4 h-4"
                >
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Temperature Readings
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time thermal monitoring across underway stations
                </p>
              </div>
            </div>

            {/* Line Chart */}
            <div className="h-56 relative w-full pt-2 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 480 160"
              >
                {/* Y-axis labels & grid lines */}
                {[
                  { y: 20, l: "35°C" },
                  { y: 60, l: "30°C" },
                  { y: 100, l: "25°C" },
                  { y: 140, l: "20°C" },
                ].map((grid, i) => (
                  <g key={i}>
                    <text
                      x="10"
                      y={grid.y + 4}
                      fill="#64748B"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {grid.l}
                    </text>
                    <line
                      x1="45"
                      y1={grid.y}
                      x2="465"
                      y2={grid.y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />
                  </g>
                ))}

                {/* Amber curve */}
                <path
                  d="M 60 110 Q 135 65, 210 45 T 360 85 T 435 100"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth={3}
                  strokeLinecap="round"
                />

                {/* Interactive Data points */}
                {tempReadings.map((pt, idx) => (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredTempIndex(idx)}
                    onMouseLeave={() => setHoveredTempIndex(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredTempIndex === idx ? 7 : 5}
                      fill="#D97706"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                    <text
                      x={pt.x}
                      y={155}
                      fill="#475569"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Tooltip on Temperature dot */}
              {hoveredTempIndex !== null && (
                <div
                  className="absolute z-20 bg-slate-900 text-white rounded-lg p-2 text-xs shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full -mt-2 border border-slate-700"
                  style={{
                    left: `${(tempReadings[hoveredTempIndex].x / 480) * 100}%`,
                    top: `${(tempReadings[hoveredTempIndex].y / 160) * 100}%`,
                  }}
                >
                  <div className="font-bold text-amber-300 font-mono">
                    {tempReadings[hoveredTempIndex].temp}
                  </div>
                  <div className="text-[9px] text-slate-300">
                    Station In-Situ Sensor
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card: Methane (CH4) & Carbon Distribution (CO2) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 tracking-tight">
                    Methane (CH₄) &amp; Carbon Distribution (CO₂)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atmospheric cryospheric flux, permafrost ebullition &amp; mixing ratios
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold whitespace-nowrap">
                  CH₄: 1,942 ppb
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold whitespace-nowrap">
                  CO₂: 422.8 ppm
                </span>
              </div>
            </div>

            {/* Donut Chart & Legend Row */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-1">
              {/* Donut Chart SVG */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-44 h-44 overflow-visible"
                  viewBox="0 0 160 160"
                >
                  {/* Slice 1: Emerald 42% (CH4 Permafrost Degassing) */}
                  <path
                    d="M 80 80 L 80 10 A 70 70 0 0 1 113.7 141.3 Z"
                    fill="#059669"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    className="hover:opacity-90 cursor-pointer transition-opacity"
                    onClick={() => setSelectedGasSlice(greenhouseGasData[0])}
                  />
                  {/* Slice 2: Sky Blue 24% (CH4 Polar Shelf Venting) */}
                  <path
                    d="M 80 80 L 113.7 141.3 A 70 70 0 0 1 20.9 117.5 Z"
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    className="hover:opacity-90 cursor-pointer transition-opacity"
                    onClick={() => setSelectedGasSlice(greenhouseGasData[1])}
                  />
                  {/* Slice 3: Royal Blue 20% (CO2 Background Transport) */}
                  <path
                    d="M 80 80 L 20.9 117.5 A 70 70 0 0 1 26.1 35.4 Z"
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    className="hover:opacity-90 cursor-pointer transition-opacity"
                    onClick={() => setSelectedGasSlice(greenhouseGasData[2])}
                  />
                  {/* Slice 4: Amber/Orange 14% (CO2 Cryoconite Respiration) */}
                  <path
                    d="M 80 80 L 26.1 35.4 A 70 70 0 0 1 80 10 Z"
                    fill="#EA580C"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    className="hover:opacity-90 cursor-pointer transition-opacity"
                    onClick={() => setSelectedGasSlice(greenhouseGasData[3])}
                  />

                  {/* Clean Doughnut Hole */}
                  <circle
                    cx="80"
                    cy="80"
                    r="38"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth={1.5}
                  />
                  <text
                    x="80"
                    y="72"
                    fill="#0F172A"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {selectedGasSlice?.pct || 42}%
                  </text>
                  <text
                    x="80"
                    y="86"
                    fill="#059669"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {selectedGasSlice?.formula.split(" ")[0]}
                  </text>
                  <text
                    x="80"
                    y="98"
                    fill="#64748B"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {selectedGasSlice?.concentration}
                  </text>
                </svg>
              </div>

              {/* Legend List */}
              <div className="flex-1 space-y-1.5 w-full">
                {greenhouseGasData.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => setSelectedGasSlice(item)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                      selectedGasSlice?.name === item.name
                        ? "bg-slate-100 border-slate-300 shadow-2xs"
                        : "bg-slate-50/70 hover:bg-slate-50 border-slate-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: item.color }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">{item.formula}</span>
                          <span>&middot;</span>
                          <span className="text-emerald-700 font-bold">{item.concentration}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-900 ml-2">
                      {item.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Greenhouse Gas Summary Banner */}
            {selectedGasSlice && (
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-center text-xs text-slate-600">
                Selected Flux:{" "}
                <span className="font-bold text-slate-900">
                  {selectedGasSlice.name} ({selectedGasSlice.formula})
                </span>{" "}
                &mdash;{" "}
                <span className="font-bold text-emerald-700 font-mono">
                  {selectedGasSlice.concentration}
                </span>{" "}
                ({selectedGasSlice.pct}% of active polar emission plume)
              </div>
            )}
          </div>
        </div>

        {/* ── ROW OF 2 CARDS: DEPTH PROFILE & ENVIRONMENTAL HEALTH INDEX ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card: Depth Profile Analysis */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Depth Profile Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Water column CTD stratification &amp; oxygen saturation
                </p>
              </div>
            </div>

            {/* Depth Bars */}
            <div className="h-64 relative w-full pt-2 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 460 180"
              >
                <defs>
                  <linearGradient
                    id="depthBarLightGrad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>

                {/* Y-axis depth markers & bars */}
                {[
                  { y: 25, l: "> 200m", bar: 0.85, temp: "14.2°C" },
                  { y: 55, l: "100-200m", bar: 0.65, temp: "18.6°C" },
                  { y: 90, l: "20-50m", bar: 0.92, temp: "24.1°C" },
                  { y: 125, l: "10-20m", bar: 0.74, temp: "26.8°C" },
                  { y: 155, l: "0-10m", bar: 0.58, temp: "28.5°C" },
                ].map((dm, i) => (
                  <g key={i}>
                    <text
                      x="65"
                      y={dm.y + 4}
                      fill="#475569"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {dm.l}
                    </text>
                    <line
                      x1="75"
                      y1={dm.y}
                      x2="440"
                      y2={dm.y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />

                    {/* Gradient Horizontal Bar */}
                    <rect
                      x="75"
                      y={dm.y - 7}
                      width={365 * dm.bar}
                      height="14"
                      rx="4"
                      fill="url(#depthBarLightGrad)"
                      opacity="0.9"
                    />

                    {/* Temp label on right */}
                    <text
                      x="445"
                      y={dm.y + 4}
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {dm.temp}
                    </text>
                  </g>
                ))}

                {/* X-axis percentages */}
                {[
                  { x: 75, l: "0" },
                  { x: 166, l: "0.25" },
                  { x: 257, l: "0.5" },
                  { x: 348, l: "0.75" },
                  { x: 440, l: "1.0" },
                ].map((xm, i) => (
                  <g key={i}>
                    <line
                      x1={xm.x}
                      y1="15"
                      x2={xm.x}
                      y2="165"
                      stroke="#CBD5E1"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={xm.x}
                      y="178"
                      fill="#64748B"
                      fontSize="9.5"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {xm.l}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Card: Environmental Health Index (Radar Chart) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 tracking-tight">
                    Environmental Health Index
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive multi-axial polar ecosystem health
                  </p>
                </div>
              </div>

              {/* Health Score Badge */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Health Score: 92%</span>
              </div>
            </div>

            {/* Radar Web Canvas */}
            <div className="relative flex items-center justify-center h-64 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
              <svg className="w-64 h-64 overflow-visible" viewBox="0 0 400 300">
                {/* Concentric Polygons */}
                {[0.25, 0.5, 0.75, 1.0].map((scale, i) => {
                  const points = [
                    [200, 150 - 95 * scale],
                    [200 + 82 * scale, 150 - 47 * scale],
                    [200 + 82 * scale, 150 + 47 * scale],
                    [200, 150 + 95 * scale],
                    [200 - 82 * scale, 150 + 47 * scale],
                    [200 - 82 * scale, 150 - 47 * scale],
                  ]
                    .map((p) => p.join(","))
                    .join(" ")
                  return (
                    <polygon
                      key={i}
                      points={points}
                      fill={i === 3 ? "#FFFFFF" : "none"}
                      stroke="#CBD5E1"
                      strokeWidth={1}
                    />
                  )
                })}

                {/* Axis Radial Lines */}
                <line x1="200" y1="150" x2="200" y2="55" stroke="#CBD5E1" />
                <line x1="200" y1="150" x2="282" y2="103" stroke="#CBD5E1" />
                <line x1="200" y1="150" x2="282" y2="197" stroke="#CBD5E1" />
                <line x1="200" y1="150" x2="200" y2="245" stroke="#CBD5E1" />
                <line x1="200" y1="150" x2="118" y2="197" stroke="#CBD5E1" />
                <line x1="200" y1="150" x2="118" y2="103" stroke="#CBD5E1" />

                {/* Axis numbering */}
                <text
                  x="200"
                  y="45"
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  0
                </text>
                <text
                  x="295"
                  y="100"
                  fill="#64748B"
                  fontSize="10"
                  fontWeight="bold"
                >
                  1
                </text>
                <text
                  x="295"
                  y="205"
                  fill="#64748B"
                  fontSize="10"
                  fontWeight="bold"
                >
                  2
                </text>
                <text
                  x="200"
                  y="260"
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  3
                </text>
                <text
                  x="105"
                  y="205"
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="end"
                  fontWeight="bold"
                >
                  4
                </text>
                <text
                  x="105"
                  y="100"
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="end"
                  fontWeight="bold"
                >
                  5
                </text>

                {/* Emerald Filled Score Polygon */}
                <polygon
                  points="200,65 275,108 270,190 200,235 125,190 128,108"
                  fill="rgba(16, 185, 129, 0.22)"
                  stroke="#059669"
                  strokeWidth={2.5}
                />

                {/* Active Vertex line to vertex 1 */}
                <line
                  x1="200"
                  y1="150"
                  x2="275"
                  y2="108"
                  stroke="#059669"
                  strokeWidth={1.5}
                  opacity={0.6}
                />

                {/* Vertex Nodes */}
                {radarAxes.map((v) => (
                  <circle
                    key={v.id}
                    cx={v.x}
                    cy={v.y}
                    r={activeRadarNode?.id === v.id ? 6 : 4}
                    fill={activeRadarNode?.id === v.id ? "#059669" : "#10B981"}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    className="cursor-pointer"
                    onClick={() =>
                      setActiveRadarNode({
                        id: v.id,
                        label: v.label,
                        score: v.score,
                      })
                    }
                  />
                ))}
              </svg>

              {/* Floating Tooltip Card */}
              <div className="absolute right-4 top-4 bg-white border border-slate-200 rounded-xl p-3 shadow-lg animate-in fade-in duration-200">
                <div className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">
                  Node #{activeRadarNode?.id ?? 1}
                </div>
                <div className="text-emerald-700 font-extrabold text-sm mt-0.5 font-mono">
                  Score : {activeRadarNode?.score || 92}%
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  {activeRadarNode?.label || "Water Quality Index"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 4: QUICK ACTIONS (MATCHES DASHBOARD THEME) ─────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1D4ED8] border border-blue-100 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                Quick Actions
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Analyze your data with advanced polar research and cryospheric
              visualization tools
            </p>
          </div>

          {/* 3 Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Button 1: View Map */}
            <button
              type="button"
              onClick={() => onNavigate("map")}
              className="w-full py-3 px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              <span>View Map</span>
            </button>

            {/* Button 2: AI Classifier */}
            <button
              type="button"
              onClick={() => setClassifierModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M12 2a4 4 0 0 1 4 4v2h1a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1v2a4 4 0 0 1-8 0v-2H7a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
                <circle cx="9" cy="10" r="1" />
                <circle cx="15" cy="10" r="1" />
              </svg>
              <span>AI Classifier</span>
            </button>

            {/* Button 3: Generate Report */}
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL: GENERATE REPORT (LIGHT DASHBOARD THEME) ─────────────────── */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in"
          onClick={() => setReportModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white text-slate-900 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Dynamic Polar Research Report
                </h3>
                <p className="text-xs text-slate-500">
                  Automated synthesized summary of active telemetry sensors
                </p>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-900 font-bold">
                  MoES NCPOR Polar Telemetry Synthesis
                </div>
                <div>
                  Recorded Period: 2020 - 2024 (Active In-Situ Sensor Stations)
                </div>
                <div className="text-emerald-700 font-semibold">
                  Mean SST: 28.5°C &middot; Snow Cover: 184 Days &middot;
                  Glacier Velocity: 142.6 m/yr &middot; Health: 92%
                </div>
              </div>
              <p>
                Includes depth profile CTD stratification, automated greenhouse gas
                flux dynamics (CH₄ &amp; CO₂), and cryospheric ecosystem vulnerability
                indicators compiled in accordance with Ministry standards.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Report compiled and downloaded successfully!")
                  setReportModalOpen(false)
                }}
                className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold"
              >
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: AI CLASSIFIER (LIGHT DASHBOARD THEME) ───────────────────── */}
      {classifierModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in"
          onClick={() => setClassifierModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white text-slate-900 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Polar AI Taxonomy &amp; Cryo Classifier
                </h3>
                <p className="text-xs text-slate-500">
                  Deep learning otolith and eDNA taxonomic verification
                </p>
              </div>
              <button
                onClick={() => setClassifierModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="text-purple-800 font-bold">
                  Neural Classification Model: MoES-OtolithNet v2.4
                </div>
                <div className="text-purple-900">
                  Confidence Score: 98.4% Accuracy against 14,200 indexed
                  teleost otolith micrographs.
                </div>
              </div>
              <p>
                Upload an acoustic echogram, otolith micrograph, or eDNA
                sequence to classify species and estimate somatic growth age.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClassifierModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setClassifierModalOpen(false)
                  onNavigate("ai")
                }}
                className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold"
              >
                Launch in Full AI Assistant &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING POLAR AI BUTTON (BOTTOM RIGHT) ───────────────────────── */}
      <aside className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => onNavigate("ai")}
          className="group flex flex-col items-center gap-1 focus:outline-hidden cursor-pointer"
          title="Open Polar AI Assistant"
          aria-label="Open Polar AI Assistant"
        >
          <div className="w-13 h-13 rounded-full bg-[#0C1E3C] border-2 border-sky-400/80 shadow-2xl flex items-center justify-center text-white relative transition-transform duration-200 group-hover:scale-110">
            <div className="absolute inset-0 rounded-full border border-sky-400 animate-ping opacity-25 pointer-events-none" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6 text-sky-300"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="bg-[#002855] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-sky-300/40 tracking-wide">
            Polar AI
          </span>
        </button>
      </aside>
    </div>
  )
}
