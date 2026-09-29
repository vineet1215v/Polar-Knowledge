import { useState, useEffect, useRef } from "react"

interface Props {
  onNavigate: (p: string) => void
}

interface PolarIndicatorModel {
  id: string
  name: string
  scientific: string
  value: number
  unit: string
  baseline: number
  trend: number // percentage change
  color: string
  optimalRange: [number, number]
  category: string
}

const INITIAL_INDICATORS: PolarIndicatorModel[] = [
  {
    id: "permafrost",
    name: "Permafrost Thaw Rate",
    scientific: "Active Layer Thermokarst Degradation",
    value: 14.8,
    unit: "cm/yr",
    baseline: 12.1,
    trend: 12.5,
    color: "#059669", // emerald
    optimalRange: [8.0, 12.0],
    category: "Cryosphere",
  },
  {
    id: "glacier",
    name: "Glacier Flow Velocity",
    scientific: "Basal Sliding & Ice Stream Displacement",
    value: 142.6,
    unit: "m/yr",
    baseline: 118.2,
    trend: 18.5,
    color: "#2563EB", // blue
    optimalRange: [90.0, 125.0],
    category: "Glaciology",
  },
  {
    id: "snow",
    name: "Snow Cover Duration",
    scientific: "Cryospheric Seasonal Albedo Extent",
    value: 184,
    unit: "Days/yr",
    baseline: 210,
    trend: -12.4,
    color: "#0284C7", // sky
    optimalRange: [200, 230],
    category: "Cryosphere",
  },
  {
    id: "methane",
    name: "Methane (CH₄) Plume",
    scientific: "Thermokarst Microbial Methanogenesis",
    value: 1942,
    unit: "ppb",
    baseline: 1880,
    trend: 3.3,
    color: "#D97706", // amber
    optimalRange: [1750, 1885],
    category: "Atmosphere",
  },
  {
    id: "seaice",
    name: "Sea Ice Concentration",
    scientific: "CryoSat-2 & SAR Satellite Pack Ice",
    value: 4.12,
    unit: "M km²",
    baseline: 6.20,
    trend: -33.5,
    color: "#06B6D4", // cyan
    optimalRange: [5.50, 7.80],
    category: "Sea Ice",
  },
]

interface HistoryPoint {
  time: string
  permafrost: number
  glacier: number
  snow: number
  methane: number
  seaice: number
  stability: number
  tippingRisk: number
}

export default function DigitalTwinMarineEcosystem({ onNavigate }: Props) {
  // Polar Climate Forcing Controls (Environmental Drivers)
  const [tempAnomaly, setTempAnomaly] = useState(-4.2) // °C (-20 to +6)
  const [co2Forcing, setCo2Forcing] = useState(422.8) // ppm (380 to 520)
  const [albedo, setAlbedo] = useState(0.68) // α (0.30 to 0.90)
  const [windSpeed, setWindSpeed] = useState(18.5) // m/s (5 to 45)
  const [basalMeltRate, setBasalMeltRate] = useState(1.2) // m/yr (0.1 to 5.0)
  const [meltDegreeDays, setMeltDegreeDays] = useState(68) // MDD (10 to 250)

  // Simulation Controls
  const [isRunning, setIsRunning] = useState(true)
  const [simulationSpeed, setSimulationSpeed] = useState<number>(2) // 1x, 2x, 5x, 10x
  const [timeStep, setTimeStep] = useState(151)
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>("permafrost")

  // Dynamic Indicators State
  const [indicators, setIndicators] = useState<PolarIndicatorModel[]>(INITIAL_INDICATORS)

  // Time-series history for charts (Normalized baseline simulation)
  const [history, setHistory] = useState<HistoryPoint[]>([
    { time: "20:01", permafrost: 13.9, glacier: 134.0, snow: 195, methane: 1910, seaice: 4.60, stability: 89.2, tippingRisk: 1.62 },
    { time: "20:02", permafrost: 14.1, glacier: 136.2, snow: 192, methane: 1918, seaice: 4.52, stability: 88.0, tippingRisk: 1.58 },
    { time: "20:03", permafrost: 14.3, glacier: 138.0, snow: 189, methane: 1925, seaice: 4.41, stability: 86.8, tippingRisk: 1.52 },
    { time: "20:04", permafrost: 14.5, glacier: 139.8, snow: 187, methane: 1932, seaice: 4.30, stability: 85.5, tippingRisk: 1.48 },
    { time: "20:05", permafrost: 14.6, glacier: 141.0, snow: 186, methane: 1937, seaice: 4.22, stability: 84.9, tippingRisk: 1.44 },
    { time: "20:06", permafrost: 14.7, glacier: 142.1, snow: 185, methane: 1940, seaice: 4.15, stability: 84.4, tippingRisk: 1.40 },
    { time: "20:07", permafrost: 14.8, glacier: 142.6, snow: 184, methane: 1942, seaice: 4.12, stability: 84.2, tippingRisk: 1.38 },
  ])

  // Cryospheric Stability Calculation (Physics-based multi-factor stability index)
  const tempExcess = Math.max(0, tempAnomaly - (-8.0)) / 10.0
  const co2Excess = Math.max(0, co2Forcing - 390.0) / 90.0
  const albedoDeficit = Math.max(0, 0.82 - albedo) / 0.40
  const meltImpact = Math.max(0, meltDegreeDays - 40) / 150.0

  const rawStability = 100 - (tempExcess * 35 + co2Excess * 25 + albedoDeficit * 25 + meltImpact * 15)
  const cryosphereStabilityScore = Math.min(98.5, Math.max(14.0, rawStability))
  const tippingPointProximity = Math.max(0.25, 2.5 - (tempExcess * 1.5 + co2Excess * 0.8))

  // Simulation tick loop
  const speedRef = useRef(simulationSpeed)
  speedRef.current = simulationSpeed

  useEffect(() => {
    if (!isRunning) return

    const intervalTime = Math.max(400, 2000 / speedRef.current)

    const interval = setInterval(() => {
      setTimeStep((prev) => prev + 1)

      // Model polar cryosphere responses based on current forcing parameters
      setIndicators((prev) =>
        prev.map((ind) => {
          let delta = 0

          if (ind.id === "permafrost") {
            // Thaw rate accelerates with warmer temperatures, high CO2, and high melt degree days
            const forcing = (tempAnomaly + 10) * 0.04 + (meltDegreeDays / 100) * 0.05 + (co2Forcing - 400) * 0.003
            delta = forcing + (Math.random() - 0.48) * 0.08
            const newVal = Math.max(6.0, parseFloat((ind.value + delta * 0.1).toFixed(2)))
            const trendPct = parseFloat((((newVal - ind.baseline) / ind.baseline) * 100).toFixed(1))
            return { ...ind, value: newVal, trend: trendPct }
          }

          if (ind.id === "glacier") {
            // Glacier sliding velocity accelerates with basal melt rate and thermal anomaly
            const forcing = basalMeltRate * 0.4 + (tempAnomaly + 10) * 0.2
            delta = forcing + (Math.random() - 0.48) * 0.3
            const newVal = Math.max(50.0, parseFloat((ind.value + delta * 0.15).toFixed(1)))
            const trendPct = parseFloat((((newVal - ind.baseline) / ind.baseline) * 100).toFixed(1))
            return { ...ind, value: newVal, trend: trendPct }
          }

          if (ind.id === "snow") {
            // Snow duration decreases with warming and lower albedo
            const forcing = -((tempAnomaly + 8) * 0.08 + (1 - albedo) * 0.1 + (meltDegreeDays / 80) * 0.06)
            delta = forcing + (Math.random() - 0.5) * 0.15
            const newVal = Math.max(90, Math.round(ind.value + delta * 0.2))
            const trendPct = parseFloat((((newVal - ind.baseline) / ind.baseline) * 100).toFixed(1))
            return { ...ind, value: newVal, trend: trendPct }
          }

          if (ind.id === "methane") {
            // Methane ebullition surges with permafrost thaw
            const forcing = (tempAnomaly + 10) * 0.6 + (meltDegreeDays / 60) * 0.4
            delta = forcing + (Math.random() - 0.48) * 0.8
            const newVal = Math.max(1650, Math.round(ind.value + delta * 0.3))
            const trendPct = parseFloat((((newVal - ind.baseline) / ind.baseline) * 100).toFixed(1))
            return { ...ind, value: newVal, trend: trendPct }
          }

          if (ind.id === "seaice") {
            // Sea ice extent contracts with warmer oceans and low albedo
            const forcing = -((tempAnomaly + 10) * 0.008 + basalMeltRate * 0.006 + (1 - albedo) * 0.005)
            delta = forcing + (Math.random() - 0.5) * 0.003
            const newVal = Math.max(1.8, parseFloat((ind.value + delta * 0.1).toFixed(2)))
            const trendPct = parseFloat((((newVal - ind.baseline) / ind.baseline) * 100).toFixed(1))
            return { ...ind, value: newVal, trend: trendPct }
          }

          return ind
        }),
      )

      // Append to history
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

      setHistory((prev) => {
        const curPermafrost = indicators.find((s) => s.id === "permafrost")?.value || 14.8
        const curGlacier = indicators.find((s) => s.id === "glacier")?.value || 142.6
        const curSnow = indicators.find((s) => s.id === "snow")?.value || 184
        const curMethane = indicators.find((s) => s.id === "methane")?.value || 1942
        const curSeaIce = indicators.find((s) => s.id === "seaice")?.value || 4.12

        const newPoint: HistoryPoint = {
          time: timeStr,
          permafrost: curPermafrost,
          glacier: curGlacier,
          snow: curSnow,
          methane: curMethane,
          seaice: curSeaIce,
          stability: parseFloat(cryosphereStabilityScore.toFixed(1)),
          tippingRisk: parseFloat(tippingPointProximity.toFixed(2)),
        }

        return [...prev.slice(-12), newPoint]
      })
    }, intervalTime)

    return () => clearInterval(interval)
  }, [
    isRunning,
    tempAnomaly,
    co2Forcing,
    albedo,
    windSpeed,
    basalMeltRate,
    meltDegreeDays,
    simulationSpeed,
    cryosphereStabilityScore,
    tippingPointProximity,
    indicators,
  ])

  const handleResetSimulation = () => {
    setTempAnomaly(-4.2)
    setCo2Forcing(422.8)
    setAlbedo(0.68)
    setWindSpeed(18.5)
    setBasalMeltRate(1.2)
    setMeltDegreeDays(68)
    setIndicators(INITIAL_INDICATORS)
    setTimeStep(0)
  }

  const selectedIndicator = indicators.find((ind) => ind.id === selectedIndicatorId) || indicators[0]

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      {/* ── TOP HEADER: MATCHES OFFICIAL NCPOR DEEP NAVY / CYAN PORTAL THEME ── */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#003366] font-bold uppercase">
                NCPOR &middot; CRYOSPHERE &amp; ATMOSPHERE &middot; DIGITAL TWIN AI
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
                SIMULATION ACTIVE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Digital Twin Polar Cryosphere
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time Cryospheric Dynamics, Permafrost Thaw &amp; Atmospheric Greenhouse Simulation
            </p>
          </div>

          {/* Right Live Simulation pill & back button */}
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {isRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isRunning ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </span>
              <span>Live Simulation</span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
        {/* ── TOP 3 CONTROLS CARDS: AI Model Status, Simulation Controls, Time Steps ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: AI Model Status */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Cryosphere AI Engine</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#003366] text-white">
                Online &middot; Grounded
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Start Simulation</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsRunning(false)}
                className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
                <span>Stop</span>
              </button>

              <button
                type="button"
                onClick={handleResetSimulation}
                className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset to climatological polar baselines"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Card 2: Simulation Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Computational Speed</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Velocity: {simulationSpeed}x</span>
                <span className="text-[10px] text-slate-400 font-mono">NCPOR High-Res Model</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[1, 2, 5, 10].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSimulationSpeed(s)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      simulationSpeed === s
                        ? "bg-[#003366] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Time Steps */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Simulation Steps</h3>
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{timeStep}</div>
            <p className="text-xs text-slate-500">Continuous forward cycles computed</p>
          </div>
        </div>

        {/* ── CARD: REAL-TIME CRYOSPHERE TELEMETRY STRIP ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Real-time Polar Cryosphere Telemetry</h3>
            <span className="text-[11px] font-mono text-slate-400">Indian Polar Stations Synchronized</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
            {/* Metric 1: Cryosphere Stability */}
            <div className="space-y-0.5">
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight truncate ${
                cryosphereStabilityScore > 80 ? "text-emerald-600" : cryosphereStabilityScore > 60 ? "text-amber-600" : "text-rose-600"
              }`}>
                {cryosphereStabilityScore.toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Stability Index</div>
            </div>

            {/* Metric 2: Tipping Point Buffer */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight truncate">
                +{tippingPointProximity.toFixed(2)}°C
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Tipping Point Margin</div>
            </div>

            {/* Metric 3: Permafrost Thaw */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono tracking-tight truncate">
                {indicators.find((s) => s.id === "permafrost")?.value.toFixed(1)} cm/yr
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Permafrost Thaw</div>
            </div>

            {/* Metric 4: Methane Plume */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono tracking-tight truncate">
                {indicators.find((s) => s.id === "methane")?.value.toLocaleString()} ppb
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Methane (CH₄) Plume</div>
            </div>

            {/* Metric 5: Sea Ice Extent */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-cyan-700 font-mono tracking-tight truncate">
                {indicators.find((s) => s.id === "seaice")?.value.toFixed(2)} M km²
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Sea Ice Extent</div>
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN GRID: POLAR FORCING CONTROLS (LEFT) + REAL-TIME INDICATOR TIMESERIES (RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ── LEFT COLUMN: POLAR FORCING CONTROLS (5 COLS) ─────────────────── */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#003366] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Polar Forcing Controls
              </h3>
            </div>

            {/* 6 Interactive Polar Sliders */}
            <div className="space-y-4">
              {/* Slider 1: Polar Surface Temp Anomaly */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2.2} className="w-4 h-4">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                    </svg>
                    <span>Polar Temp Anomaly</span>
                  </div>
                  <span className="font-mono font-bold text-rose-600 text-sm">
                    {tempAnomaly > 0 ? `+${tempAnomaly.toFixed(1)}` : tempAnomaly.toFixed(1)}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="6"
                  step="0.1"
                  value={tempAnomaly}
                  onChange={(e) => setTempAnomaly(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-20.0°C (Glacial)</span>
                  <span>+6.0°C (Extreme Melt)</span>
                </div>
              </div>

              {/* Slider 2: Atmospheric CO2 Forcing */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2.2} className="w-4 h-4">
                      <circle cx="12" cy="12" r="8" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    <span>Atmospheric CO₂ Forcing</span>
                  </div>
                  <span className="font-mono font-bold text-blue-600 text-sm">
                    {co2Forcing.toFixed(1)} ppm
                  </span>
                </div>
                <input
                  type="range"
                  min="380"
                  max="520"
                  step="0.5"
                  value={co2Forcing}
                  onChange={(e) => setCo2Forcing(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>380 ppm</span>
                  <span>520 ppm</span>
                </div>
              </div>

              {/* Slider 3: Surface Albedo Feedback */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth={2.2} className="w-4 h-4">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                    </svg>
                    <span>Surface Albedo Feedback</span>
                  </div>
                  <span className="font-mono font-bold text-[#0284C7] text-sm">
                    {albedo.toFixed(2)} α
                  </span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.90"
                  step="0.01"
                  value={albedo}
                  onChange={(e) => setAlbedo(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.30 α (Dark/Melt)</span>
                  <span>0.90 α (Fresh Snow)</span>
                </div>
              </div>

              {/* Slider 4: Katabatic Wind Shear Speed */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth={2.2} className="w-4 h-4">
                      <path d="M17.7 7.7A7.5 7.5 0 0 0 5 10.5M6.3 16.3A7.5 7.5 0 0 0 19 13.5" />
                      <polyline points="14 7 18 7 18 3" />
                      <polyline points="10 17 6 17 6 21" />
                    </svg>
                    <span>Katabatic Wind Shear</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-600 text-sm">
                    {windSpeed.toFixed(1)} m/s
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="0.5"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5 m/s (Calm)</span>
                  <span>45 m/s (Blizzard)</span>
                </div>
              </div>

              {/* Slider 5: Sub-ice Shelf Basal Melt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={2.2} className="w-4 h-4">
                      <path d="M2 12c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3" />
                      <path d="M2 17c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3" />
                    </svg>
                    <span>Sub-ice Basal Melt</span>
                  </div>
                  <span className="font-mono font-bold text-amber-600 text-sm">
                    {basalMeltRate.toFixed(1)} m/yr
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={basalMeltRate}
                  onChange={(e) => setBasalMeltRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.1 m/yr</span>
                  <span>5.0 m/yr</span>
                </div>
              </div>

              {/* Slider 6: Summer Melt Degree Days (MDD) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2.2} className="w-4 h-4">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Melt Degree Days (MDD)</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    {meltDegreeDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  step="1"
                  value={meltDegreeDays}
                  onChange={(e) => setMeltDegreeDays(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10 MDD (High Polar)</span>
                  <span>250 MDD (Tundra Thaw)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: REAL-TIME CRYOSPHERE INDICATOR CHART (7 COLS) ───────── */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Real-time Cryosphere Trajectory Model
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Multi-Pillar Earth System Model
              </span>
            </div>

            {/* SVG Normalized Cryosphere Time-Series Chart */}
            <div className="h-64 relative w-full pt-2 bg-slate-50/40 rounded-xl p-3 border border-slate-100">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Horizontal grid lines & Y labels: 100%, 75%, 50%, 25%, 0% */}
                {[
                  { y: 20, l: "High" },
                  { y: 60, l: "75%" },
                  { y: 100, l: "50%" },
                  { y: 140, l: "25%" },
                  { y: 180, l: "Base" },
                ].map((g, i) => (
                  <g key={i}>
                    <text x="32" y={g.y + 4} fill="#64748B" fontSize="10" textAnchor="end" fontFamily="monospace">
                      {g.l}
                    </text>
                    <line x1="40" y1={g.y} x2="590" y2={g.y} stroke="#E2E8F0" strokeDasharray="3 3" />
                  </g>
                ))}

                {/* Vertical time markers */}
                {history.map((pt, i) => {
                  const x = 50 + (i / Math.max(1, history.length - 1)) * 530
                  return (
                    <g key={i}>
                      <line x1={x} y1={20} x2={x} y2={180} stroke="#E2E8F0" strokeDasharray="2 2" opacity={0.5} />
                      {i % 2 === 0 && (
                        <text x={x} y={196} fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                          {pt.time.slice(0, 5)}
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* 5 Polar Indicators Lines */}
                {/* 1. Permafrost Thaw (Emerald) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = 180 - Math.min(160, Math.max(10, ((pt.permafrost - 6) / 20) * 160))
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#059669"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* 2. Glacier Flow Velocity (Royal Blue) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = 180 - Math.min(160, Math.max(10, ((pt.glacier - 50) / 150) * 160))
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* 3. Snow Cover Duration (Sky Blue) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = 180 - Math.min(160, Math.max(10, ((pt.snow - 90) / 150) * 160))
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* 4. Methane Plume (Amber) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = 180 - Math.min(160, Math.max(10, ((pt.methane - 1700) / 400) * 160))
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* 5. Sea Ice Extent (Cyan) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = 180 - Math.min(160, Math.max(10, ((pt.seaice - 1.8) / 6.0) * 160))
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Polar Indicator Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold pt-1">
              {indicators.map((ind) => (
                <div
                  key={ind.id}
                  onClick={() => setSelectedIndicatorId(ind.id)}
                  className={`flex items-center gap-1.5 cursor-pointer px-2 py-0.5 rounded-lg transition-all ${
                    selectedIndicatorId === ind.id ? "bg-slate-100 font-bold" : "hover:opacity-80"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: ind.color }} />
                  <span className="text-slate-700">{ind.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5 HORIZONTAL POLAR INDICATOR CARDS ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {indicators.map((ind) => {
            const isSelected = selectedIndicatorId === ind.id

            return (
              <div
                key={ind.id}
                onClick={() => setSelectedIndicatorId(ind.id)}
                className={`p-4 rounded-2xl border bg-white transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                    : "border-slate-200/90 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${ind.color}15`, color: ind.color }}
                    >
                      {ind.id === "permafrost" ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path d="M3 20h18M3 16h18M3 12h18" />
                          <path d="M4 12l4-6 4 4 5-7 4 9" />
                        </svg>
                      ) : ind.id === "glacier" ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      ) : ind.id === "snow" ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5" />
                        </svg>
                      ) : ind.id === "methane" ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" strokeLinecap="round" />
                          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <polygon points="12 2 19 21 12 17 5 21 12 2" />
                        </svg>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        ind.trend >= 0
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {ind.trend >= 0 ? `+${ind.trend}%` : `${ind.trend}%`}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-tight">{ind.name}</h4>
                  <div className="text-[10px] text-slate-400 italic mt-0.5 line-clamp-1">{ind.scientific}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Modeled:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {ind.id === "methane" ? ind.value.toLocaleString() : ind.value.toFixed(1)} {ind.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Baseline:</span>
                    <span className="font-bold text-slate-700 font-mono">
                      {ind.id === "methane" ? ind.baseline.toLocaleString() : ind.baseline.toFixed(1)} {ind.unit}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── AI-GENERATED REAL-TIME INSIGHTS (3 POLAR ALERTS) ─────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#003366" strokeWidth={2} className="w-4 h-4">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              AI Cryosphere Telemetry &amp; Tipping Point Insights
            </h3>
          </div>

          <div className="space-y-3">
            {/* Alert 1: Permafrost Degradation Alert (Red/Rose) */}
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-red-900">
                    Cryospheric Degradation Warning
                  </h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    Permafrost thaw rate accelerating to {indicators.find((s) => s.id === "permafrost")?.value.toFixed(1)} cm/yr &middot; Active layer subsidence active across high-latitude polygons
                  </p>
                  <p className="text-xs text-red-600 font-bold mt-1">
                    Current anomaly at {tempAnomaly > 0 ? `+${tempAnomaly.toFixed(1)}` : tempAnomaly.toFixed(1)}°C &mdash; exceeds historical Holocene baseline stability envelope
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-red-700 border border-red-200 flex-shrink-0">
                Real-time
              </span>
            </div>

            {/* Alert 2: Glacier Surge & Flow Velocity Advisory (Amber/Yellow) */}
            <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={2} className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                    Glacial Flow &amp; Basal Lubrication Advisory
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Glacier flow velocity elevated to {indicators.find((s) => s.id === "glacier")?.value.toFixed(1)} m/yr with {basalMeltRate.toFixed(1)} m/yr basal melt rate
                  </p>
                  <p className="text-xs text-amber-600 font-bold mt-1">
                    Cryosphere stability at {cryosphereStabilityScore.toFixed(1)}% &mdash; enhanced calving flux projected near continental shelf margin
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-700 border border-amber-200 flex-shrink-0">
                Live Update
              </span>
            </div>

            {/* Alert 3: Atmospheric Greenhouse Coupling Status (Blue) */}
            <div className="p-4 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth={2} className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-blue-900">
                    Atmospheric Feedback Coupling
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Methane plume mixing at {indicators.find((s) => s.id === "methane")?.value.toLocaleString()} ppb under {co2Forcing.toFixed(1)} ppm forcing &mdash; {timeStep} cycles completed
                  </p>
                  <p className="text-xs text-blue-600 font-bold mt-1">
                    Multi-variate physical coupling accurately reproduces Indian Arctic (IndARC) and Antarctic (Bharati) station observations
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-blue-700 border border-blue-200 flex-shrink-0">
                Synchronized
              </span>
            </div>
          </div>
        </div>

        {/* ── CARD: CRYOSPHERE STABILITY TRENDS (AREA CHART) ───────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Cryospheric Stability &amp; Tipping Risk Trends
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Continuous Multi-Decadal Projection
            </span>
          </div>

          {/* Area Chart SVG */}
          <div className="h-60 relative w-full pt-2 bg-slate-50/40 rounded-xl p-3 border border-slate-100">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="stabilityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Y Axis labels: 100, 75, 50, 25, 0 */}
              {[
                { y: 20, l: "100%" },
                { y: 55, l: "75%" },
                { y: 90, l: "50%" },
                { y: 125, l: "25%" },
                { y: 160, l: "0%" },
              ].map((g, i) => (
                <g key={i}>
                  <text x="30" y={g.y + 4} fill="#64748B" fontSize="10" textAnchor="end" fontFamily="monospace">
                    {g.l}
                  </text>
                  <line x1="40" y1={g.y} x2="590" y2={g.y} stroke="#E2E8F0" strokeDasharray="3 3" />
                </g>
              ))}

              {/* X Axis time markers: 00:00, 00:30, 01:00, 01:30, 02:00 */}
              {[
                { x: 50, l: "00:00" },
                { x: 180, l: "00:30" },
                { x: 310, l: "01:00" },
                { x: 440, l: "01:30" },
                { x: 570, l: "02:00" },
              ].map((tm, i) => (
                <g key={i}>
                  <line x1={tm.x} y1={20} x2={tm.x} y2={160} stroke="#E2E8F0" strokeDasharray="2 2" />
                  <text x={tm.x} y={174} fill="#64748B" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
                    {tm.l}
                  </text>
                </g>
              ))}

              {/* Filled Blue Area Chart: Stability Trend */}
              <polygon
                points={history
                  .map((pt, i) => {
                    const x = 50 + (i / Math.max(1, history.length - 1)) * 520
                    const y = 160 - (pt.stability / 100) * 140
                    return `${x},${y}`
                  })
                  .join(" ") + ` 570,160 50,160`}
                fill="url(#stabilityAreaGrad)"
              />
              <polyline
                points={history
                  .map((pt, i) => {
                    const x = 50 + (i / Math.max(1, history.length - 1)) * 520
                    const y = 160 - (pt.stability / 100) * 140
                    return `${x},${y}`
                  })
                  .join(" ")}
                fill="none"
                stroke="#0284C7"
                strokeWidth={2.5}
              />

              {/* Tipping Buffer line */}
              <polyline
                points={history
                  .map((pt, i) => {
                    const x = 50 + (i / Math.max(1, history.length - 1)) * 520
                    const y = 160 - (pt.tippingRisk / 3.0) * 140
                    return `${x},${y}`
                  })
                  .join(" ")}
                fill="none"
                stroke="#059669"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs font-semibold pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span className="text-slate-700">Cryosphere Stability Index (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-slate-700">Tipping Point Safety Buffer (°C)</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <div className="py-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            &copy; 2025 National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Government of India
          </div>
          <div>Powered by NCPOR Cryospheric Computing Backbone</div>
        </div>
      </div>

      {/* ── FLOATING POLAR AI BUTTON (BOTTOM RIGHT) ───────────────────────── */}
      <aside className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => onNavigate("ai")}
          className="group flex flex-col items-center gap-1 focus:outline-hidden cursor-pointer"
          title="Open Polar AI Assistant"
          aria-label="Open Polar AI Assistant"
        >
          <div className="w-13 h-13 rounded-full bg-[#003366] border-2 border-sky-400/80 shadow-2xl flex items-center justify-center text-white relative transition-transform duration-200 group-hover:scale-110">
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
          <span className="bg-[#002244] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-sky-300/40 tracking-wide">
            Polar AI
          </span>
        </button>
      </aside>
    </div>
  )
}

export { DigitalTwinMarineEcosystem }
