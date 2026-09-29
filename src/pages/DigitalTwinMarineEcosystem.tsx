import { useState, useEffect, useRef } from "react"

interface Props {
  onNavigate: (p: string) => void
}

interface SpeciesModel {
  id: string

  name: string

  scientific: string

  population: number

  biomass: number // kg

  trend: number // percentage change

  color: string

  optimalTemp: [number, number]

  optimalO2: [number, number]

  optimalSalinity: [number, number]
}

const INITIAL_SPECIES: SpeciesModel[] = [
  {
    id: "tuna",

    name: "Yellowfin Tuna",

    scientific: "Thunnus albacares",

    population: 774,

    biomass: 10241,

    trend: -0.1,

    color: "#2563EB", // blue

    optimalTemp: [22, 27],

    optimalO2: [5.5, 8],

    optimalSalinity: [34, 36],
  },

  {
    id: "sardine",

    name: "Oil Sardine",

    scientific: "Sardinella longiceps",

    population: 3500,

    biomass: 7672,

    trend: 0.1,

    color: "#10B981", // green

    optimalTemp: [24, 29],

    optimalO2: [5.0, 7.5],

    optimalSalinity: [32, 35],
  },

  {
    id: "mackerel",

    name: "Indian Mackerel",

    scientific: "Rastrelliger kanagurta",

    population: 2471,

    biomass: 5508,

    trend: 0.1,

    color: "#F59E0B", // amber

    optimalTemp: [23, 28],

    optimalO2: [5.0, 7.5],

    optimalSalinity: [33, 36],
  },

  {
    id: "pomfret",

    name: "Silver Pomfret",

    scientific: "Pampus argenteus",

    population: 2032,

    biomass: 5508,

    trend: -0.1,

    color: "#06B6D4", // cyan

    optimalTemp: [22, 26],

    optimalO2: [5.2, 7.8],

    optimalSalinity: [34, 36.5],
  },

  {
    id: "prawn",

    name: "Tiger Prawn",

    scientific: "Penaeus monodon",

    population: 943,

    biomass: 1280,

    trend: -0.6,

    color: "#8B5CF6", // purple

    optimalTemp: [25, 30],

    optimalO2: [4.5, 7.0],

    optimalSalinity: [30, 34],
  },
]

interface HistoryPoint {
  time: string

  tuna: number

  sardine: number

  mackerel: number

  pomfret: number

  prawn: number

  health: number

  biodiversity: number
}

export default function DigitalTwinMarineEcosystem({ onNavigate }: Props) {
  // Environmental Control State

  const [temperature, setTemperature] = useState(24.1) // °C (20 - 32)

  const [salinity, setSalinity] = useState(35.0) // PSU (30 - 37)

  const [phLevel, setPhLevel] = useState(7.97) // pH (7.8 - 8.3)

  const [oxygen, setOxygen] = useState(6.0) // mg/L (4 - 8)

  const [turbidity, setTurbidity] = useState(3.0) // NTU (0 - 10)

  const [nutrients, setNutrients] = useState(40.0) // µg/L (10 - 100)

  // Simulation Controls

  const [isRunning, setIsRunning] = useState(true)

  const [simulationSpeed, setSimulationSpeed] = useState<number>(2) // 1x, 2x, 5x

  const [timeStep, setTimeStep] = useState(151)

  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("tuna")

  // Dynamic Species state

  const [species, setSpecies] = useState<SpeciesModel[]>(INITIAL_SPECIES)

  // Time-series history for charts

  const [history, setHistory] = useState<HistoryPoint[]>([
    {
      time: "20:01",
      tuna: 790,
      sardine: 3480,
      mackerel: 2450,
      pomfret: 2050,
      prawn: 960,
      health: 65,
      biodiversity: 1.25,
    },

    {
      time: "20:02",
      tuna: 785,
      sardine: 3490,
      mackerel: 2460,
      pomfret: 2040,
      prawn: 955,
      health: 62,
      biodiversity: 1.24,
    },

    {
      time: "20:03",
      tuna: 780,
      sardine: 3495,
      mackerel: 2465,
      pomfret: 2038,
      prawn: 950,
      health: 58,
      biodiversity: 1.23,
    },

    {
      time: "20:04",
      tuna: 778,
      sardine: 3500,
      mackerel: 2468,
      pomfret: 2035,
      prawn: 948,
      health: 54,
      biodiversity: 1.23,
    },

    {
      time: "20:05",
      tuna: 776,
      sardine: 3500,
      mackerel: 2470,
      pomfret: 2033,
      prawn: 945,
      health: 48,
      biodiversity: 1.22,
    },

    {
      time: "20:06",
      tuna: 775,
      sardine: 3500,
      mackerel: 2471,
      pomfret: 2032,
      prawn: 944,
      health: 42,
      biodiversity: 1.22,
    },

    {
      time: "20:07",
      tuna: 774,
      sardine: 3500,
      mackerel: 2471,
      pomfret: 2032,
      prawn: 943,
      health: 37,
      biodiversity: 1.22,
    },
  ])

  // Ecosystem Health Calculations

  // Baseline optimal: Temp 25°C, Salinity 35, pH 8.1, O2 6.5, Turbidity 2, Nutrients 45

  const tempDeviation = Math.abs(temperature - 25.5) / 6.0

  const o2Deviation = Math.max(0, 6.5 - oxygen) / 2.5

  const salDeviation = Math.abs(salinity - 34.8) / 2.5

  const phDeviation = Math.abs(phLevel - 8.1) / 0.3

  const rawHealth = Math.max(
    5,
    100 -
      (tempDeviation * 35 +
        o2Deviation * 40 +
        salDeviation * 15 +
        phDeviation * 10),
  )

  const ecosystemHealthScore = Math.min(98.5, Math.max(12.5, rawHealth))

  const totalFishCount = species.reduce((acc, sp) => acc + sp.population, 0)

  // Simulation tick loop

  const speedRef = useRef(simulationSpeed)

  speedRef.current = simulationSpeed

  useEffect(() => {
    if (!isRunning) return

    const intervalTime = Math.max(400, 2000 / speedRef.current)

    const interval = setInterval(
      () => {
        setTimeStep((prev) => prev + 1)

        // Model species population response based on current environment

        setSpecies((prevSpecies) =>
          prevSpecies.map((sp) => {
            let delta = 0

            // Temp impact

            if (
              temperature < sp.optimalTemp[0] ||
              temperature > sp.optimalTemp[1]
            ) {
              delta -= 1.2
            } else {
              delta += 0.4
            }

            // Oxygen impact

            if (oxygen < sp.optimalO2[0]) {
              delta -= 2.0
            } else {
              delta += 0.3
            }

            // Salinity impact

            if (
              salinity < sp.optimalSalinity[0] ||
              salinity > sp.optimalSalinity[1]
            ) {
              delta -= 0.8
            }

            // Small natural oscillation

            delta += (Math.random() - 0.5) * 1.5

            const newPop = Math.max(150, Math.round(sp.population + delta))

            const trendPct = parseFloat(
              (((newPop - sp.population) / sp.population) * 100).toFixed(1),
            )

            const newBiomass = Math.round((newPop / sp.population) * sp.biomass)

            return {
              ...sp,

              population: newPop,

              biomass: newBiomass,

              trend: trendPct,
            }
          }),
        )

        // Append to history

        const now = new Date()

        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

        setHistory((prev) => {
          const last = prev[prev.length - 1]

          const newPoint: HistoryPoint = {
            time: timeStr,

            tuna: species.find((s) => s.id === "tuna")?.population || 774,

            sardine:
              species.find((s) => s.id === "sardine")?.population || 3500,

            mackerel:
              species.find((s) => s.id === "mackerel")?.population || 2471,

            pomfret:
              species.find((s) => s.id === "pomfret")?.population || 2032,

            prawn: species.find((s) => s.id === "prawn")?.population || 943,

            health: parseFloat(ecosystemHealthScore.toFixed(1)),

            biodiversity: 1.22,
          }

          const updated = [...prev.slice(-12), newPoint]

          return updated
        })
      },
      intervalTime,
    )

    return () => clearInterval(interval)
  }, [
    isRunning,
    temperature,
    salinity,
    oxygen,
    phLevel,
    simulationSpeed,
    ecosystemHealthScore,
    species,
  ])

  const handleResetSimulation = () => {
    setTemperature(24.1)

    setSalinity(35.0)

    setPhLevel(7.97)

    setOxygen(6.0)

    setTurbidity(3.0)

    setNutrients(40.0)

    setTimeStep(0)

    setSpecies(INITIAL_SPECIES)
  }

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "var(--content-bg)" }}
    >
      {/* ── TOP HEADER (MATCHES PORTAL THEME) ────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#1D4ED8] font-bold uppercase">
                CMLRE &middot; BIODIVERSITY &middot; DIGITAL TWIN AI
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
                SIMULATION ACTIVE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Digital Twin Marine Ecosystem
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time Species Population &amp; Environmental Controls
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-3.5 h-3.5"
              >
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
              <h3 className="font-bold text-sm text-slate-900">
                AI Model Status
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F1E36] text-white">
                Active
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#0F1E36] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-3.5 h-3.5"
                    >
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-3.5 h-3.5"
                    >
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5"
                >
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
                <span>Stop</span>
              </button>

              <button
                type="button"
                onClick={handleResetSimulation}
                className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset to default ecological parameters"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Card 2: Simulation Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <h3 className="font-bold text-sm text-slate-900">
              Simulation Controls
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Speed: {simulationSpeed}x
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Dynamic AI Engine
                </span>
              </div>

              {/* Speed Buttons / Slider representation */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[1, 2, 5, 10].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSimulationSpeed(s)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      simulationSpeed === s
                        ? "bg-[#0F1E36] text-white shadow-2xs"
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
            <h3 className="font-bold text-sm text-slate-900">Time Steps</h3>
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {timeStep}
            </div>
            <p className="text-xs text-slate-500">
              Simulation cycles completed
            </p>
          </div>
        </div>

        {/* ── CARD: REAL-TIME ECOSYSTEM DATA TELEMETRY STRIP ───────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">
            Real-time Ecosystem Data
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
            {/* Metric 1: Ecosystem Health */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono tracking-tight truncate">
                {ecosystemHealthScore.toFixed(2)}%
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Ecosystem Health
              </div>
            </div>

            {/* Metric 2: Biodiversity Index */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight truncate">
                1.22
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Biodiversity Index
              </div>
            </div>

            {/* Metric 3: Total Fish */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight truncate">
                {totalFishCount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Total Fish
              </div>
            </div>

            {/* Metric 4: Water Temp */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight truncate">
                {temperature.toFixed(1)}°C
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Water Temp
              </div>
            </div>

            {/* Metric 5: Oxygen */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight truncate">
                {oxygen.toFixed(1)} mg/L
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Oxygen
              </div>
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN GRID: ENVIRONMENTAL CONTROLS (LEFT) + REAL-TIME POPULATION (RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ── LEFT COLUMN: ENVIRONMENTAL CONTROLS (5 COLS) ─────────────────── */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
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
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Environmental Controls
              </h3>
            </div>

            {/* 6 Interactive Sliders */}
            <div className="space-y-4">
              {/* Slider 1: Temperature */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth={2.2}
                      className="w-4 h-4"
                    >
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                    </svg>
                    <span>Temperature</span>
                  </div>
                  <span className="font-mono font-bold text-rose-600 text-sm">
                    {temperature.toFixed(1)}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="32"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>20°C</span>
                  <span>32°C</span>
                </div>
              </div>

              {/* Slider 2: Salinity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth={2.2}
                      className="w-4 h-4"
                    >
                      <path d="M2 12c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3" />
                      <path d="M2 17c2.5 0 2.5-3 5-3s2.5 3 5 3 2.5-3 5-3 2.5 3 5 3" />
                    </svg>
                    <span>Salinity</span>
                  </div>
                  <span className="font-mono font-bold text-[#0284C7] text-sm">
                    {salinity.toFixed(1)} PSU
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="37"
                  step="0.1"
                  value={salinity}
                  onChange={(e) => setSalinity(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>30 PSU</span>
                  <span>37 PSU</span>
                </div>
              </div>

              {/* Slider 3: pH Level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth={2.2}
                      className="w-4 h-4"
                    >
                      <path d="M10 2v7.31L4.62 18.5A2 2 0 0 0 6.35 22h11.3a2 2 0 0 0 1.73-3.5L14 9.31V2" />
                      <line x1="8.5" y1="2" x2="15.5" y2="2" />
                    </svg>
                    <span>pH Level</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    {phLevel.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="7.8"
                  max="8.3"
                  step="0.01"
                  value={phLevel}
                  onChange={(e) => setPhLevel(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>7.8</span>
                  <span>8.3</span>
                </div>
              </div>

              {/* Slider 4: Oxygen */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth={2.2}
                      className="w-4 h-4"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span>Oxygen</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-600 text-sm">
                    {oxygen.toFixed(1)} mg/L
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="8"
                  step="0.1"
                  value={oxygen}
                  onChange={(e) => setOxygen(parseFloat(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>4 mg/L</span>
                  <span>8 mg/L</span>
                </div>
              </div>

              {/* Slider 5: Turbidity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth={2.2}
                      className="w-4 h-4"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                    </svg>
                    <span>Turbidity</span>
                  </div>
                  <span className="font-mono font-bold text-amber-600 text-sm">
                    {turbidity.toFixed(1)} NTU
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={turbidity}
                  onChange={(e) => setTurbidity(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 NTU</span>
                  <span>10 NTU</span>
                </div>
              </div>

              {/* Slider 6: Nutrients */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth={2.2}
                      className="w-4 h-4"
                    >
                      <path d="M6 2v6a6 6 0 0 0 12 0V2" />
                      <line x1="6" y1="2" x2="18" y2="2" />
                    </svg>
                    <span>Nutrients</span>
                  </div>
                  <span className="font-mono font-bold text-purple-600 text-sm">
                    {nutrients.toFixed(0)} µg/L
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={nutrients}
                  onChange={(e) => setNutrients(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10 µg/L</span>
                  <span>100 µg/L</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: REAL-TIME SPECIES POPULATION CHART (7 COLS) ───────── */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Real-time Species Population
                </h3>
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                Live Multi-Line Model
              </span>
            </div>

            {/* SVG Population Time-Series Chart */}
            <div className="h-64 relative w-full pt-2 bg-slate-50/40 rounded-xl p-3 border border-slate-100">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
              >
                {/* Horizontal grid lines & Y labels: 0, 900, 1800, 2700, 3600 */}
                {[
                  { y: 20, l: "3600" },

                  { y: 60, l: "2700" },

                  { y: 100, l: "1800" },

                  { y: 140, l: "900" },

                  { y: 180, l: "0" },
                ].map((g, i) => (
                  <g key={i}>
                    <text
                      x="32"
                      y={g.y + 4}
                      fill="#64748B"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {g.l}
                    </text>
                    <line
                      x1="40"
                      y1={g.y}
                      x2="590"
                      y2={g.y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />
                  </g>
                ))}

                {/* Vertical time markers */}
                {history.map((pt, i) => {
                  const x = 50 + (i / Math.max(1, history.length - 1)) * 530

                  return (
                    <g key={i}>
                      <line
                        x1={x}
                        y1={20}
                        x2={x}
                        y2={180}
                        stroke="#E2E8F0"
                        strokeDasharray="2 2"
                        opacity={0.5}
                      />
                      {i % 2 === 0 && (
                        <text
                          x={x}
                          y={196}
                          fill="#94A3B8"
                          fontSize="9"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {pt.time.slice(0, 5)}
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* 5 Species Population Lines */}
                {/* 1. Sardine (around 3500 -> Y around 24) */}
                <path
                  d={history

                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530

                      const y = 180 - (pt.sardine / 3800) * 160

                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })

                    .join(" ")}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* 2. Mackerel (around 2471 -> Y around 76) */}
                <path
                  d={history

                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530

                      const y = 180 - (pt.mackerel / 3800) * 160

                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })

                    .join(" ")}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* 3. Pomfret (around 2032 -> Y around 94) */}
                <path
                  d={history

                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530

                      const y = 180 - (pt.pomfret / 3800) * 160

                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })

                    .join(" ")}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* 4. Prawn (around 943 -> Y around 140) */}
                <path
                  d={history

                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530

                      const y = 180 - (pt.prawn / 3800) * 160

                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })

                    .join(" ")}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* 5. Tuna (around 774 -> Y around 147) */}
                <path
                  d={history

                    .map((pt, i) => {
                      const x = 50 + (i / Math.max(1, history.length - 1)) * 530

                      const y = 180 - (pt.tuna / 3800) * 160

                      return `${i === 0 ? "M" : "L"} ${x} ${y}`
                    })

                    .join(" ")}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Species Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold pt-1">
              {species.map((sp) => (
                <div
                  key={sp.id}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: sp.color }}
                  />
                  <span className="text-slate-700">{sp.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5 HORIZONTAL SPECIES CARDS ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {species.map((sp) => {
            const isSelected = selectedSpeciesId === sp.id

            return (
              <div
                key={sp.id}
                onClick={() => setSelectedSpeciesId(sp.id)}
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
                      style={{ background: `${sp.color}15`, color: sp.color }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path d="M18 12c-4 3-8 3-12 0 4-3 8-3 12 0z" />
                        <path d="M18 12l4-3v6l-4-3z" />
                        <circle cx="9" cy="12" r="1" fill="currentColor" />
                      </svg>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        sp.trend >= 0
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {sp.trend >= 0 ? `+${sp.trend}%` : `${sp.trend}%`}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {sp.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 italic font-serif">
                    {sp.scientific}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">
                      Population:
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {sp.population.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Biomass:</span>
                    <span className="font-bold text-slate-700 font-mono">
                      {sp.biomass.toLocaleString()} kg
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── AI-GENERATED REAL-TIME INSIGHTS (3 ALERTS) ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1D4ED8"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              AI-Generated Real-time Insights
            </h3>
          </div>

          <div className="space-y-3">
            {/* Alert 1: Environmental Impact Alert (Red/Rose) */}
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth={2}
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-red-900">
                    Environmental Impact Alert
                  </h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    Temperature changes affecting Yellowfin Tuna population
                    dynamics
                  </p>
                  <p className="text-xs text-red-600 font-bold mt-1">
                    Current parameters show {temperature.toFixed(1)}°C - outside
                    optimal range
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-red-700 border border-red-200 flex-shrink-0">
                Real-time
              </span>
            </div>

            {/* Alert 2: Population Trend Analysis (Amber/Yellow) */}
            <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth={2}
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                    Population Trend Analysis
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Species responding to oxygen level changes:{" "}
                    {oxygen.toFixed(1)} mg/L
                  </p>
                  <p className="text-xs text-amber-600 font-bold mt-1">
                    Ecosystem health at {ecosystemHealthScore.toFixed(2)}% -
                    intervention recommended
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-700 border border-amber-200 flex-shrink-0">
                Live Update
              </span>
            </div>

            {/* Alert 3: Simulation Status (Blue) */}
            <div className="p-4 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth={2}
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-blue-900">
                    Simulation Status
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Digital twin running at {simulationSpeed}x speed -{" "}
                    {timeStep} cycles completed
                  </p>
                  <p className="text-xs text-blue-600 font-bold mt-1">
                    Real-time parameter adjustments affecting population trends
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-blue-700 border border-blue-200 flex-shrink-0">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* ── CARD: ECOSYSTEM HEALTH TRENDS (AREA CHART) ───────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Ecosystem Health Trends
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Continuous Multi-Horizon Projection
            </span>
          </div>

          {/* Area Chart SVG */}
          <div className="h-60 relative w-full pt-2 bg-slate-50/40 rounded-xl p-3 border border-slate-100">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 600 180"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="healthAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F87171" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#F87171" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Y Axis labels: 0, 20, 40, 60, 80 */}
              {[
                { y: 20, l: "80" },

                { y: 55, l: "60" },

                { y: 90, l: "40" },

                { y: 125, l: "20" },

                { y: 160, l: "0" },
              ].map((g, i) => (
                <g key={i}>
                  <text
                    x="30"
                    y={g.y + 4}
                    fill="#64748B"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {g.l}
                  </text>
                  <line
                    x1="40"
                    y1={g.y}
                    x2="590"
                    y2={g.y}
                    stroke="#E2E8F0"
                    strokeDasharray="3 3"
                  />
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
                  <line
                    x1={tm.x}
                    y1={20}
                    x2={tm.x}
                    y2={160}
                    stroke="#E2E8F0"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={tm.x}
                    y={174}
                    fill="#64748B"
                    fontSize="9.5"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {tm.l}
                  </text>
                </g>
              ))}

              {/* Filled Red/Salmon Area Chart: Health Trend */}
              <polygon
                points="50,45 180,55 310,75 440,95 570,115 570,160 50,160"
                fill="url(#healthAreaGrad)"
              />
              <polyline
                points="50,45 180,55 310,75 440,95 570,115"
                fill="none"
                stroke="#EF4444"
                strokeWidth={2.5}
              />

              {/* Biodiversity Line: Cyan line near bottom baseline */}
              <polyline
                points="50,154 180,153 310,154 440,153 570,154"
                fill="none"
                stroke="#06B6D4"
                strokeWidth={3}
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs font-semibold pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-700">Ecosystem Health (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-slate-700">Biodiversity Index</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <div className="py-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            &copy; 2025 CMLRE, Ministry of Earth Sciences, Government of India
          </div>
          <div>Powered by CMLRE backbone, MoES</div>
        </div>
      </div>

      {/* ── FLOATING MARINE AI BUTTON ───────────────────────────────────────── */}
      <aside className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => onNavigate("ai")}
          className="group flex flex-col items-center gap-1 focus:outline-hidden cursor-pointer"
          title="Open Marine AI Assistant"
          aria-label="Open Marine AI Assistant"
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
            Marine AI
          </span>
        </button>
      </aside>
    </div>
  )
}

export { DigitalTwinMarineEcosystem };
