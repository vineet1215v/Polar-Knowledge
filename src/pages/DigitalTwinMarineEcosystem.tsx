import { useState, useEffect, useRef, useMemo } from "react"

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

// ── PURE CRYOSPHERE SIMULATION MODEL ENGINE ─────────────────────────────────
// Computes physics-grounded equilibrium responses.
// FLUCTUATIONS ONLY OCCUR WHEN perturbationEnergy > 0 (i.e. when parameters are changed!)
function computeCryoModel(
  temp: number,
  co2: number,
  alb: number,
  wind: number,
  basal: number,
  mdd: number,
  step: number,
  perturbationEnergy: number = 0, // ONLY fluctuates when perturbationEnergy > 0!
  flucMult: number = 2.5,
) {
  // Environmental Forcing normalized deviations from climatological baselines
  const dTemp = temp - -4.2
  const dCo2 = co2 - 422.8
  const dAlb = 0.68 - alb // positive when darker surface / lower albedo
  const dWind = wind - 18.5
  const dBasal = basal - 1.2
  const dMdd = mdd - 68

  // Base Equilibrium Models (Exact physical target state for these parameters)
  const basePermafrost =
    14.8 + dTemp * 1.95 + (dMdd / 14) * 2.4 + (dCo2 / 24) * 1.8 + dAlb * 20.0
  const baseGlacier =
    142.6 + dBasal * 44.0 + dTemp * 11.5 + (dMdd / 18) * 8.5 + dAlb * 32.0
  const baseSnow =
    184 - dTemp * 7.2 - (dMdd / 10) * 6.5 - dAlb * 85.0 - (dWind / 12) * 4.2
  const baseMethane =
    1942 + dTemp * 42.0 + (dMdd / 10) * 36.0 + (dCo2 / 16) * 30.0 + dBasal * 25.0
  const baseSeaIce =
    4.12 - dTemp * 0.35 - dAlb * 4.6 - dBasal * 0.45 - (dWind / 18) * 0.40

  // Dynamic Fluctuation: ONLY active when perturbationEnergy > 0!
  // When no parameter is being changed, perturbationEnergy is 0 -> fluctuations are EXACTLY 0.
  const windTurbulence = (wind / 18.5) * flucMult * perturbationEnergy

  // Damped harmonic response waves (modeling transient response upon forcing perturbation)
  const w1 = Math.sin(step * 0.65)
  const w2 = Math.cos(step * 1.15 + 0.8)
  const w3 = Math.sin(step * 2.1 + 1.9) * 0.5
  const combinedWave = (w1 * 0.55 + w2 * 0.35 + w3 * 0.1) * windTurbulence

  const flucPermafrost =
    (combinedWave * 3.6 + w1 * 1.8 * perturbationEnergy) * (wind / 18.5)
  const flucGlacier =
    (w2 * 0.6 + w1 * 0.4) * (basal / 1.2) * 38.0 * flucMult * perturbationEnergy
  const flucSnow = (w1 * 0.6 + w3 * 0.4) * windTurbulence * 20.0
  const flucMethane =
    (w3 * 0.5 + w2 * 0.5) *
    (1 + Math.max(0, dTemp) / 14) *
    110.0 *
    flucMult *
    perturbationEnergy
  const flucSeaIce = (w1 * 0.5 + w2 * 0.5) * windTurbulence * 0.65

  // Final outputs clamped within polar earth-system boundaries
  const permafrostVal = Math.max(
    2.5,
    Math.min(68.0, parseFloat((basePermafrost + flucPermafrost).toFixed(1))),
  )
  const glacierVal = Math.max(
    35.0,
    Math.min(440.0, parseFloat((baseGlacier + flucGlacier).toFixed(1))),
  )
  const snowVal = Math.max(45, Math.min(320, Math.round(baseSnow + flucSnow)))
  const methaneVal = Math.max(
    1600,
    Math.min(3900, Math.round(baseMethane + flucMethane)),
  )
  const seaiceVal = Math.max(
    0.6,
    Math.min(12.0, parseFloat((baseSeaIce + flucSeaIce).toFixed(2))),
  )

  // Physics-based Multi-factor Cryospheric Stability & Tipping Point Margin
  const tempExcess = Math.max(0, temp - -8.0) / 10.0
  const co2Excess = Math.max(0, co2 - 390.0) / 80.0
  const albedoDeficit = Math.max(0, 0.82 - alb) / 0.35
  const meltImpact = Math.max(0, mdd - 35) / 120.0
  const windImpact = Math.max(0, wind - 15) / 40.0

  const rawStability =
    100 -
    (tempExcess * 35 +
      co2Excess * 22 +
      albedoDeficit * 24 +
      meltImpact * 16 +
      windImpact * 8)
  const stabilityFluc = combinedWave * 6.0 * flucMult
  const stability = Math.max(
    5.0,
    Math.min(99.0, parseFloat((rawStability + stabilityFluc).toFixed(1))),
  )

  const tippingMargin = Math.max(
    0.12,
    Math.min(
      3.8,
      parseFloat(
        (
          2.6 -
          (tempExcess * 1.5 + co2Excess * 0.75 + albedoDeficit * 0.6) +
          w2 * 0.3 * flucMult * perturbationEnergy
        ).toFixed(2),
      ),
    ),
  )

  // Percentage deviations relative to climatological benchmarks
  const pTrend = parseFloat((((permafrostVal - 12.1) / 12.1) * 100).toFixed(1))
  const gTrend = parseFloat((((glacierVal - 118.2) / 118.2) * 100).toFixed(1))
  const sTrend = parseFloat((((snowVal - 210) / 210) * 100).toFixed(1))
  const mTrend = parseFloat((((methaneVal - 1880) / 1880) * 100).toFixed(1))
  const siTrend = parseFloat((((seaiceVal - 6.2) / 6.2) * 100).toFixed(1))

  return {
    permafrost: permafrostVal,
    glacier: glacierVal,
    snow: snowVal,
    methane: methaneVal,
    seaice: seaiceVal,
    stability,
    tippingRisk: tippingMargin,
    permafrostTrend: pTrend,
    glacierTrend: gTrend,
    snowTrend: sTrend,
    methaneTrend: mTrend,
    seaiceTrend: siTrend,
  }
}

// Generate initial steady-state history points at baseline
function createInitialHistory(): HistoryPoint[] {
  const points: HistoryPoint[] = []
  const now = new Date()
  const baseModel = computeCryoModel(
    -4.2,
    422.8,
    0.68,
    18.5,
    1.2,
    68,
    0,
    0, // zero fluctuation initially
    2.2,
  )

  for (let i = 14; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 1500)
    const timeStr = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`
    points.push({
      time: timeStr,
      permafrost: baseModel.permafrost,
      glacier: baseModel.glacier,
      snow: baseModel.snow,
      methane: baseModel.methane,
      seaice: baseModel.seaice,
      stability: baseModel.stability,
      tippingRisk: baseModel.tippingRisk,
    })
  }
  return points
}

export default function DigitalTwinMarineEcosystem({ onNavigate }: Props) {
  // Polar Climate Forcing Controls (Environmental Drivers)
  const [tempAnomaly, setTempAnomaly] = useState(-4.2) // °C (-20 to +6)
  const [co2Forcing, setCo2Forcing] = useState(422.8) // ppm (380 to 520)
  const [albedo, setAlbedo] = useState(0.68) // α (0.30 to 0.90)
  const [windSpeed, setWindSpeed] = useState(18.5) // m/s (5 to 45)
  const [basalMeltRate, setBasalMeltRate] = useState(1.2) // m/yr (0.1 to 5.0)
  const [meltDegreeDays, setMeltDegreeDays] = useState(68) // MDD (10 to 250)

  // ── TRANSIENT PERTURBATION STATE ──────────────────────────────────────────
  // Fluctuation occurs ONLY when a parameter is actively changed or perturbed!
  // perturbationEnergy starts at 1.0 on change and decays to 0 (steady equilibrium).
  const [perturbationEnergy, setPerturbationEnergy] = useState<number>(0)
  const [perturbationTick, setPerturbationTick] = useState<number>(0)

  // Fluctuation Intensity Multiplier (when parameters are changed)
  const [fluctuationLevel, setFluctuationLevel] = useState<
    "standard" | "high" | "extreme"
  >("high")
  const fluctuationMultiplier =
    fluctuationLevel === "standard" ? 1.0 : fluctuationLevel === "high" ? 2.2 : 3.8

  // Simulation Runtime Controls
  const [isRunning, setIsRunning] = useState(true)
  const [simulationSpeed, setSimulationSpeed] = useState<number>(2) // 1x, 2x, 5x, 10x
  const [timeStep, setTimeStep] = useState(150)
  const [selectedIndicatorId, setSelectedIndicatorId] =
    useState<string>("permafrost")

  // Time-series history for charts
  const [history, setHistory] = useState<HistoryPoint[]>(createInitialHistory)

  const speedRef = useRef(simulationSpeed)
  speedRef.current = simulationSpeed

  // Function to trigger dynamic perturbation wave whenever ANY parameter changes
  const triggerPerturbation = () => {
    setPerturbationEnergy(1.0)
    setPerturbationTick((t) => t + 1)
  }

  // Parameter Change Handlers
  const handleTempChange = (v: number) => {
    setTempAnomaly(v)
    triggerPerturbation()
  }
  const handleCo2Change = (v: number) => {
    setCo2Forcing(v)
    triggerPerturbation()
  }
  const handleAlbedoChange = (v: number) => {
    setAlbedo(v)
    triggerPerturbation()
  }
  const handleWindChange = (v: number) => {
    setWindSpeed(v)
    triggerPerturbation()
  }
  const handleBasalChange = (v: number) => {
    setBasalMeltRate(v)
    triggerPerturbation()
  }
  const handleMddChange = (v: number) => {
    setMeltDegreeDays(v)
    triggerPerturbation()
  }

  // Pre-configured scientific scenario triggers for instant demo impact
  const applyScenario = (
    temp: number,
    co2: number,
    alb: number,
    wind: number,
    basal: number,
    mdd: number,
    level: "standard" | "high" | "extreme",
  ) => {
    setTempAnomaly(temp)
    setCo2Forcing(co2)
    setAlbedo(alb)
    setWindSpeed(wind)
    setBasalMeltRate(basal)
    setMeltDegreeDays(mdd)
    setFluctuationLevel(level)
    triggerPerturbation()
  }

  // Decay animation for the perturbation wave (smoothly settles into equilibrium)
  useEffect(() => {
    if (perturbationEnergy <= 0.01) return

    const timer = setTimeout(() => {
      setPerturbationTick((t) => t + 1)
      setPerturbationEnergy((prev) => {
        const next = prev * 0.82 - 0.02
        return next <= 0.02 ? 0 : next
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [perturbationEnergy, perturbationTick])

  // Reactive evaluation of current model state
  // Notice: perturbationEnergy determines whether fluctuations are active!
  const currentModel = useMemo(() => {
    return computeCryoModel(
      tempAnomaly,
      co2Forcing,
      albedo,
      windSpeed,
      basalMeltRate,
      meltDegreeDays,
      perturbationTick,
      perturbationEnergy,
      fluctuationMultiplier,
    )
  }, [
    tempAnomaly,
    co2Forcing,
    albedo,
    windSpeed,
    basalMeltRate,
    meltDegreeDays,
    perturbationTick,
    perturbationEnergy,
    fluctuationMultiplier,
  ])

  // Map into structured Polar Indicator array for components
  const indicators: PolarIndicatorModel[] = useMemo(() => {
    return [
      {
        id: "permafrost",
        name: "Permafrost Thaw Rate",
        scientific: "Active Layer Thermokarst Degradation",
        value: currentModel.permafrost,
        unit: "cm/yr",
        baseline: 12.1,
        trend: currentModel.permafrostTrend,
        color: "#059669", // emerald
        optimalRange: [8.0, 12.0],
        category: "Cryosphere",
      },
      {
        id: "glacier",
        name: "Glacier Flow Velocity",
        scientific: "Basal Sliding & Ice Stream Displacement",
        value: currentModel.glacier,
        unit: "m/yr",
        baseline: 118.2,
        trend: currentModel.glacierTrend,
        color: "#2563EB", // blue
        optimalRange: [90.0, 125.0],
        category: "Glaciology",
      },
      {
        id: "snow",
        name: "Snow Cover Duration",
        scientific: "Cryospheric Seasonal Albedo Extent",
        value: currentModel.snow,
        unit: "Days/yr",
        baseline: 210,
        trend: currentModel.snowTrend,
        color: "#0284C7", // sky
        optimalRange: [200, 230],
        category: "Cryosphere",
      },
      {
        id: "methane",
        name: "Methane (CH₄) Plume",
        scientific: "Thermokarst Microbial Methanogenesis",
        value: currentModel.methane,
        unit: "ppb",
        baseline: 1880,
        trend: currentModel.methaneTrend,
        color: "#D97706", // amber
        optimalRange: [1750, 1885],
        category: "Atmosphere",
      },
      {
        id: "seaice",
        name: "Sea Ice Concentration",
        scientific: "CryoSat-2 & SAR Satellite Pack Ice",
        value: currentModel.seaice,
        unit: "M km²",
        baseline: 6.2,
        trend: currentModel.seaiceTrend,
        color: "#06B6D4", // cyan
        optimalRange: [5.5, 7.8],
        category: "Sea Ice",
      },
    ]
  }, [currentModel])

  const cryosphereStabilityScore = currentModel.stability
  const tippingPointProximity = currentModel.tippingRisk

  // Whenever perturbation is active, record the transient fluctuation wave into history!
  useEffect(() => {
    if (perturbationEnergy > 0) {
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

      setHistory((prev) => [
        ...prev.slice(-14),
        {
          time: timeStr,
          permafrost: currentModel.permafrost,
          glacier: currentModel.glacier,
          snow: currentModel.snow,
          methane: currentModel.methane,
          seaice: currentModel.seaice,
          stability: currentModel.stability,
          tippingRisk: currentModel.tippingRisk,
        },
      ])
    } else {
      // When settled, smoothly update the latest point to match the settled equilibrium
      setHistory((prev) => {
        if (prev.length === 0) return prev
        const updated = [...prev]
        const lastIdx = updated.length - 1
        updated[lastIdx] = {
          ...updated[lastIdx],
          permafrost: currentModel.permafrost,
          glacier: currentModel.glacier,
          snow: currentModel.snow,
          methane: currentModel.methane,
          seaice: currentModel.seaice,
          stability: currentModel.stability,
          tippingRisk: currentModel.tippingRisk,
        }
        return updated
      })
    }
  }, [currentModel, perturbationEnergy])

  // Continuous time progression (advances the graph forward smoothly without jitter)
  useEffect(() => {
    if (!isRunning) return

    const intervalTime = Math.max(300, 1500 / speedRef.current)

    const interval = setInterval(() => {
      setTimeStep((t) => t + 1)

      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

      // When steady, append settled point; if perturbed, append fluctuating point
      setHistory((prev) => [
        ...prev.slice(-14),
        {
          time: timeStr,
          permafrost: currentModel.permafrost,
          glacier: currentModel.glacier,
          snow: currentModel.snow,
          methane: currentModel.methane,
          seaice: currentModel.seaice,
          stability: currentModel.stability,
          tippingRisk: currentModel.tippingRisk,
        },
      ])
    }, intervalTime)

    return () => clearInterval(interval)
  }, [isRunning, simulationSpeed, currentModel])

  // Reset to climatological baselines
  const handleResetSimulation = () => {
    setTempAnomaly(-4.2)
    setCo2Forcing(422.8)
    setAlbedo(0.68)
    setWindSpeed(18.5)
    setBasalMeltRate(1.2)
    setMeltDegreeDays(68)
    setFluctuationLevel("high")
    setTimeStep(150)
    triggerPerturbation()
  }

  const selectedIndicator =
    indicators.find((ind) => ind.id === selectedIndicatorId) || indicators[0]

  // Dynamic SVG Y-coordinates with full vertical scale utilization (12px top to 175px baseline)
  const getYPermafrost = (v: number) =>
    175 - Math.min(155, Math.max(12, ((v - 2.5) / 48.0) * 155))
  const getYGlacier = (v: number) =>
    175 - Math.min(155, Math.max(12, ((v - 35.0) / 360.0) * 155))
  const getYSnow = (v: number) =>
    175 - Math.min(155, Math.max(12, ((v - 50.0) / 250.0) * 155))
  const getYMethane = (v: number) =>
    175 - Math.min(155, Math.max(12, ((v - 1620.0) / 1600.0) * 155))
  const getYSeaIce = (v: number) =>
    175 - Math.min(155, Math.max(12, ((v - 0.7) / 9.8) * 155))

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "var(--content-bg)" }}
    >
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
              Real-time Cryospheric Dynamics, Permafrost Thaw &amp; Atmospheric
              Greenhouse Simulation
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
              <span>{isRunning ? "Live Engine Active" : "Paused"}</span>
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
        {/* ── TOP 3 CONTROLS CARDS: Engine Status, Speed, Perturbation Dynamics ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: AI Model Status */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                Cryosphere AI Engine
              </h3>
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
                title="Reset to climatological polar baselines"
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

          {/* Card 2: Simulation Speed */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                Computational Velocity
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Speed: {simulationSpeed}x
              </span>
            </div>
            <div className="space-y-2">
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
              <p className="text-[10px] text-slate-400 text-center font-mono">
                NCPOR Multi-Pillar Earth System Model
              </p>
            </div>
          </div>

          {/* Card 3: Dynamic Perturbation Fluctuation Status */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    perturbationEnergy > 0
                      ? "bg-amber-500 animate-ping"
                      : "bg-emerald-500"
                  }`}
                />
                <h3 className="font-bold text-sm text-slate-900">
                  Fluctuation Status
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border transition-all ${
                  perturbationEnergy > 0
                    ? "bg-amber-50 text-amber-700 border-amber-300 animate-pulse"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {perturbationEnergy > 0
                  ? "⚡ Forcing Perturbation Active"
                  : "✓ Settled Equilibrium"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(["standard", "high", "extreme"] as const).map((level) => {
                const labels = {
                  standard: "Balanced ±5%",
                  high: "High ±15%",
                  extreme: "Storm ±30%",
                }
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setFluctuationLevel(level)
                      triggerPerturbation()
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                      fluctuationLevel === level
                        ? "bg-[#003366] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    {labels[level]}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Fluctuation Trigger:</span>
              <span
                className={`font-semibold ${
                  perturbationEnergy > 0 ? "text-amber-700" : "text-emerald-700"
                }`}
              >
                {perturbationEnergy > 0
                  ? `Fluctuating (${Math.round(perturbationEnergy * 100)}% Intensity)`
                  : "Calm / Parameter-Driven Only"}
              </span>
            </div>
          </div>
        </div>

        {/* ── CARD: REAL-TIME CRYOSPHERE TELEMETRY STRIP ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  perturbationEnergy > 0
                    ? "bg-amber-500 animate-pulse"
                    : "bg-emerald-500"
                }`}
              />
              <h3 className="font-bold text-sm text-slate-900">
                Real-time Polar Cryosphere Telemetry
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {perturbationEnergy > 0
                ? "Active Transient Oscillation Wave"
                : "Equilibrium Baseline Observed"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
            {/* Metric 1: Cryosphere Stability */}
            <div className="space-y-0.5">
              <div
                className={`text-xl sm:text-2xl font-black font-mono tracking-tight truncate transition-colors duration-150 ${
                  cryosphereStabilityScore > 80
                    ? "text-emerald-600"
                    : cryosphereStabilityScore > 55
                      ? "text-amber-600"
                      : "text-rose-600"
                }`}
              >
                {cryosphereStabilityScore.toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                <span>Stability Index</span>
                <span
                  className={`text-[9px] font-bold ${
                    cryosphereStabilityScore > 80
                      ? "text-emerald-600"
                      : cryosphereStabilityScore > 55
                        ? "text-amber-600"
                        : "text-rose-600"
                  }`}
                >
                  {cryosphereStabilityScore > 80
                    ? "Optimal"
                    : cryosphereStabilityScore > 55
                      ? "Warning"
                      : "Critical"}
                </span>
              </div>
            </div>

            {/* Metric 2: Tipping Point Buffer */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight truncate">
                +{tippingPointProximity.toFixed(2)}°C
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Tipping Point Margin
              </div>
            </div>

            {/* Metric 3: Permafrost Thaw */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono tracking-tight truncate">
                {indicators.find((s) => s.id === "permafrost")?.value.toFixed(1)}{" "}
                cm/yr
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                <span>Permafrost Thaw</span>
                <span className="text-[10px] font-bold text-emerald-600 font-mono">
                  {currentModel.permafrostTrend >= 0
                    ? `+${currentModel.permafrostTrend}%`
                    : `${currentModel.permafrostTrend}%`}
                </span>
              </div>
            </div>

            {/* Metric 4: Methane Plume */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono tracking-tight truncate">
                {indicators
                  .find((s) => s.id === "methane")
                  ?.value.toLocaleString()}{" "}
                ppb
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                <span>Methane (CH₄) Plume</span>
                <span className="text-[10px] font-bold text-amber-600 font-mono">
                  {currentModel.methaneTrend >= 0
                    ? `+${currentModel.methaneTrend}%`
                    : `${currentModel.methaneTrend}%`}
                </span>
              </div>
            </div>

            {/* Metric 5: Sea Ice Extent */}
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-cyan-700 font-mono tracking-tight truncate">
                {indicators.find((s) => s.id === "seaice")?.value.toFixed(2)} M km²
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                <span>Sea Ice Extent</span>
                <span className="text-[10px] font-bold text-cyan-600 font-mono">
                  {currentModel.seaiceTrend >= 0
                    ? `+${currentModel.seaiceTrend}%`
                    : `${currentModel.seaiceTrend}%`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN GRID: POLAR FORCING CONTROLS (LEFT) + REAL-TIME INDICATOR TIMESERIES (RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ── LEFT COLUMN: POLAR FORCING CONTROLS (5 COLS) ─────────────────── */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#003366] flex items-center justify-center">
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
                  Polar Forcing Controls
                </h3>
              </div>
              <span className="text-[10px] text-blue-600 font-bold font-mono">
                Fluctuates on Adjustment
              </span>
            </div>

            {/* Quick Climate Scenarios Preset Bar */}
            <div className="space-y-1.5 pt-0.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                <span>Preset Climate Scenarios</span>
                <span className="text-[9px] text-blue-600 font-normal">
                  Click to trigger perturbation
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    applyScenario(-4.2, 422.8, 0.68, 18.5, 1.2, 68, "high")
                  }
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-slate-800">
                    Baseline
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    -4.2°C &middot; 423ppm
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyScenario(-16.5, 385.0, 0.88, 10.0, 0.2, 15, "standard")
                  }
                  className="p-1.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-blue-800">
                    Deep Freeze
                  </div>
                  <div className="text-[9px] text-blue-600 font-mono">
                    -16.5°C &middot; Glacial
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyScenario(4.2, 495.0, 0.4, 28.0, 3.8, 195, "high")
                  }
                  className="p-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-rose-800">
                    Tipping Surge
                  </div>
                  <div className="text-[9px] text-rose-600 font-mono">
                    +4.2°C &middot; Melt
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyScenario(-7.5, 430.0, 0.62, 43.5, 1.8, 55, "extreme")
                  }
                  className="p-1.5 rounded-lg border border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-cyan-800">
                    Blizzard Storm
                  </div>
                  <div className="text-[9px] text-cyan-600 font-mono">
                    43.5 m/s Wind
                  </div>
                </button>
              </div>
            </div>

            {/* 6 Interactive Polar Sliders */}
            <div className="space-y-4 pt-1">
              {/* Slider 1: Polar Surface Temp Anomaly */}
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
                    <span>Polar Temp Anomaly</span>
                  </div>
                  <span className="font-mono font-bold text-rose-600 text-sm">
                    {tempAnomaly > 0
                      ? `+${tempAnomaly.toFixed(1)}`
                      : tempAnomaly.toFixed(1)}
                    °C
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="6"
                  step="0.1"
                  value={tempAnomaly}
                  onChange={(e) => handleTempChange(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-20.0°C (Glacial Minimum)</span>
                  <span>+6.0°C (Runaway Thaw)</span>
                </div>
              </div>

              {/* Slider 2: Atmospheric CO2 Forcing */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth={2.2}
                      className="w-4 h-4"
                    >
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
                  onChange={(e) => handleCo2Change(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>380 ppm (Pre-Industrial)</span>
                  <span>520 ppm (Extreme Forcing)</span>
                </div>
              </div>

              {/* Slider 3: Surface Albedo Feedback */}
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
                  onChange={(e) => handleAlbedoChange(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.30 α (Melt Ponds / Dark)</span>
                  <span>0.90 α (Fresh Antarctic Firn)</span>
                </div>
              </div>

              {/* Slider 4: Katabatic Wind Shear Speed */}
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
                      <path d="M17.7 7.7A7.5 7.5 0 0 0 5 10.5M6.3 16.3A7.5 7.5 0 0 0 19 13.5" />
                      <polyline points="14 7 18 7 18 3" />
                      <polyline points="10 17 6 17 6 21" />
                    </svg>
                    <span>Katabatic Wind Shear &middot; Turbulence Driver</span>
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
                  onChange={(e) => handleWindChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5 m/s (Calm Low Turbulence)</span>
                  <span>45 m/s (Blizzard Gale Wave Surges)</span>
                </div>
              </div>

              {/* Slider 5: Sub-ice Shelf Basal Melt */}
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
                  onChange={(e) => handleBasalChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.1 m/yr (Anchored)</span>
                  <span>5.0 m/yr (Cavity Lubrication Surge)</span>
                </div>
              </div>

              {/* Slider 6: Summer Melt Degree Days (MDD) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#059669"
                      strokeWidth={2.2}
                      className="w-4 h-4"
                    >
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
                  onChange={(e) =>
                    handleMddChange(parseInt(e.target.value, 10))
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10 MDD (High Plateau)</span>
                  <span>250 MDD (Coastal Thermokarst)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: REAL-TIME CRYOSPHERE INDICATOR CHART (7 COLS) ───────── */}
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
                  Real-time Cryosphere Trajectory Model
                </h3>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold transition-all ${
                  perturbationEnergy > 0
                    ? "text-amber-700 bg-amber-50 border-amber-300 animate-pulse"
                    : "text-emerald-700 bg-emerald-50 border-emerald-200"
                }`}
              >
                {perturbationEnergy > 0
                  ? "⚡ Transient Wave Active"
                  : "✓ Stable Response"}
              </span>
            </div>

            {/* SVG Normalized Cryosphere Time-Series Chart */}
            <div className="h-72 relative w-full pt-2 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
              >
                {/* Horizontal grid lines & Y labels */}
                {[
                  { y: 20, l: "High Forcing" },
                  { y: 60, l: "75%" },
                  { y: 100, l: "50% Median" },
                  { y: 140, l: "25%" },
                  { y: 175, l: "Baseline" },
                ].map((g, i) => (
                  <g key={i}>
                    <text
                      x="32"
                      y={g.y + 3}
                      fill="#64748B"
                      fontSize="9"
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
                        y2={175}
                        stroke="#E2E8F0"
                        strokeDasharray="2 2"
                        opacity={0.45}
                      />
                      {i % 3 === 0 && (
                        <text
                          x={x}
                          y={192}
                          fill="#94A3B8"
                          fontSize="9"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {pt.time}
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
                      const x =
                        50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = getYPermafrost(pt.permafrost)
                      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#059669"
                  strokeWidth={selectedIndicatorId === "permafrost" ? 4 : 2.2}
                  strokeOpacity={selectedIndicatorId === "permafrost" ? 1 : 0.65}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 2. Glacier Flow Velocity (Royal Blue) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x =
                        50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = getYGlacier(pt.glacier)
                      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth={selectedIndicatorId === "glacier" ? 4 : 2.2}
                  strokeOpacity={selectedIndicatorId === "glacier" ? 1 : 0.65}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 3. Snow Cover Duration (Sky Blue) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x =
                        50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = getYSnow(pt.snow)
                      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth={selectedIndicatorId === "snow" ? 4 : 2.2}
                  strokeOpacity={selectedIndicatorId === "snow" ? 1 : 0.65}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 4. Methane Plume (Amber) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x =
                        50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = getYMethane(pt.methane)
                      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth={selectedIndicatorId === "methane" ? 4 : 2.2}
                  strokeOpacity={selectedIndicatorId === "methane" ? 1 : 0.65}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 5. Sea Ice Extent (Cyan) */}
                <path
                  d={history
                    .map((pt, i) => {
                      const x =
                        50 + (i / Math.max(1, history.length - 1)) * 530
                      const y = getYSeaIce(pt.seaice)
                      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth={selectedIndicatorId === "seaice" ? 4 : 2.2}
                  strokeOpacity={selectedIndicatorId === "seaice" ? 1 : 0.65}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Active Indicator Pulse Marker */}
                {history.length > 0 && (() => {
                  const lastPt = history[history.length - 1]
                  const lastX = 580
                  const lastY =
                    selectedIndicatorId === "permafrost"
                      ? getYPermafrost(lastPt.permafrost)
                      : selectedIndicatorId === "glacier"
                        ? getYGlacier(lastPt.glacier)
                        : selectedIndicatorId === "snow"
                          ? getYSnow(lastPt.snow)
                          : selectedIndicatorId === "methane"
                            ? getYMethane(lastPt.methane)
                            : getYSeaIce(lastPt.seaice)

                  return (
                    <g>
                      <circle
                        cx={lastX}
                        cy={lastY}
                        r={8}
                        fill={selectedIndicator.color}
                        opacity={perturbationEnergy > 0 ? 0.5 : 0.25}
                        className={perturbationEnergy > 0 ? "animate-ping" : ""}
                      />
                      <circle
                        cx={lastX}
                        cy={lastY}
                        r={4.5}
                        fill={selectedIndicator.color}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    </g>
                  )
                })()}
              </svg>
            </div>

            {/* Polar Indicator Legend with Interactive Highlighter */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold pt-1">
              {indicators.map((ind) => {
                const isSelected = selectedIndicatorId === ind.id
                return (
                  <div
                    key={ind.id}
                    onClick={() => setSelectedIndicatorId(ind.id)}
                    className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white font-bold shadow-xs scale-105"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: ind.color }}
                    />
                    <span>{ind.name}</span>
                    <span className="text-[10px] opacity-80 font-mono ml-0.5">
                      {ind.id === "methane"
                        ? `${ind.value}`
                        : ind.id === "seaice"
                          ? `${ind.value.toFixed(2)}`
                          : `${ind.value.toFixed(1)}`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── 5 HORIZONTAL POLAR INDICATOR CARDS WITH REAL-TIME STRESS METERS ── */}
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
                      ) : ind.id === "glacier" ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      ) : ind.id === "snow" ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4"
                        >
                          <path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5" />
                        </svg>
                      ) : ind.id === "methane" ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4"
                        >
                          <path
                            d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="currentColor"
                            fillOpacity="0.2"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4"
                        >
                          <polygon points="12 2 19 21 12 17 5 21 12 2" />
                        </svg>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono transition-colors ${
                        ind.trend >= 0
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {ind.trend >= 0 ? `+${ind.trend}%` : `${ind.trend}%`}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {ind.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 italic mt-0.5 line-clamp-1">
                    {ind.scientific}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Modeled:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {ind.id === "methane"
                        ? ind.value.toLocaleString()
                        : ind.id === "seaice"
                          ? ind.value.toFixed(2)
                          : ind.value.toFixed(1)}{" "}
                      {ind.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Baseline:</span>
                    <span className="font-bold text-slate-600 font-mono">
                      {ind.id === "methane"
                        ? ind.baseline.toLocaleString()
                        : ind.id === "seaice"
                          ? ind.baseline.toFixed(2)
                          : ind.baseline.toFixed(1)}{" "}
                      {ind.unit}
                    </span>
                  </div>

                  {/* Responsive Dynamic Stress Meter */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            8,
                            ((ind.value - ind.baseline * 0.4) /
                              (ind.baseline * 1.6)) *
                              100,
                          ),
                        )}%`,
                        backgroundColor:
                          Math.abs(ind.trend) > 30
                            ? "#EF4444"
                            : Math.abs(ind.trend) > 15
                              ? "#F59E0B"
                              : ind.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── AI-GENERATED REAL-TIME INSIGHTS (3 POLAR ALERTS) ─────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#003366"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                AI Cryosphere Telemetry &amp; Tipping Point Insights
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Coupled Earth System Diagnostics
            </span>
          </div>

          <div className="space-y-3">
            {/* Alert 1: Permafrost Degradation Alert (Red/Rose) */}
            <div
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                tempAnomaly > 0
                  ? "bg-[#FEF2F2] border-[#FECACA]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={tempAnomaly > 0 ? "#DC2626" : "#059669"}
                  strokeWidth={2}
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <h4
                    className={`font-bold text-xs sm:text-sm ${
                      tempAnomaly > 0 ? "text-red-900" : "text-slate-900"
                    }`}
                  >
                    {tempAnomaly > 0
                      ? "Cryospheric Degradation Warning"
                      : "Permafrost Stabilization Envelope"}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 ${
                      tempAnomaly > 0 ? "text-red-700" : "text-slate-600"
                    }`}
                  >
                    Permafrost thaw rate currently modeling at{" "}
                    <span className="font-bold font-mono">
                      {currentModel.permafrost.toFixed(1)} cm/yr
                    </span>{" "}
                    &middot; Active layer subsidence across high-latitude
                    polygons
                  </p>
                  <p
                    className={`text-xs font-bold mt-1 ${
                      tempAnomaly > 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    Thermal forcing at{" "}
                    {tempAnomaly > 0
                      ? `+${tempAnomaly.toFixed(1)}`
                      : tempAnomaly.toFixed(1)}
                    °C &mdash;{" "}
                    {tempAnomaly > 0
                      ? "Exceeds historical Holocene baseline stability envelope"
                      : "Maintains ice-cored permafrost structure"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 flex-shrink-0 font-mono">
                Real-time
              </span>
            </div>

            {/* Alert 2: Glacier Surge & Flow Velocity Advisory (Amber/Yellow) */}
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
                    Glacial Flow &amp; Basal Lubrication Advisory
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Glacier flow velocity calculated at{" "}
                    <span className="font-bold font-mono">
                      {currentModel.glacier.toFixed(1)} m/yr
                    </span>{" "}
                    under {basalMeltRate.toFixed(1)} m/yr basal cavity melt
                  </p>
                  <p className="text-xs text-amber-600 font-bold mt-1">
                    Cryosphere stability at{" "}
                    {cryosphereStabilityScore.toFixed(1)}% &mdash;{" "}
                    {basalMeltRate > 2.5
                      ? "High subglacial water pressures accelerating grounding line retreat"
                      : "Basal friction maintains stable ice stream grounding"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-700 border border-amber-200 flex-shrink-0 font-mono">
                Live Update
              </span>
            </div>

            {/* Alert 3: Atmospheric Greenhouse Coupling Status (Blue) */}
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
                    Atmospheric Feedback &amp; Methane Ebullition
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Methane plume active at{" "}
                    <span className="font-bold font-mono">
                      {currentModel.methane.toLocaleString()} ppb
                    </span>{" "}
                    under {co2Forcing.toFixed(1)} ppm radiative forcing &mdash;{" "}
                    {timeStep} cycles executed
                  </p>
                  <p className="text-xs text-blue-600 font-bold mt-1">
                    Multi-variate physical coupling reproduces Indian Arctic
                    (IndARC) and Antarctic (Bharati &amp; Maitri) observational
                    benchmarks
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-blue-700 border border-blue-200 flex-shrink-0 font-mono">
                Synchronized
              </span>
            </div>
          </div>
        </div>

        {/* ── CARD: CRYOSPHERE STABILITY TRENDS (AREA CHART) ───────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Cryospheric Stability &amp; Tipping Risk Trends
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic stability envelope undulating with real-time parameter
                forcings
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Continuous Decadal Projection
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
                <linearGradient
                  id="stabilityAreaGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Y Axis labels */}
              {[
                { y: 20, l: "100%" },
                { y: 55, l: "75%" },
                { y: 90, l: "50%" },
                { y: 125, l: "25%" },
                { y: 160, l: "0%" },
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

              {/* Filled Blue Area Chart: Stability Trend */}
              <polygon
                points={
                  history
                    .map((pt, i) => {
                      const x =
                        50 + (i / Math.max(1, history.length - 1)) * 520
                      const y = 160 - (pt.stability / 100) * 140
                      return `${x.toFixed(1)},${y.toFixed(1)}`
                    })
                    .join(" ") + ` 570,160 50,160`
                }
                fill="url(#stabilityAreaGrad)"
              />
              <polyline
                points={history
                  .map((pt, i) => {
                    const x =
                      50 + (i / Math.max(1, history.length - 1)) * 520
                    const y = 160 - (pt.stability / 100) * 140
                    return `${x.toFixed(1)},${y.toFixed(1)}`
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
                    const x =
                      50 + (i / Math.max(1, history.length - 1)) * 520
                    const y = 160 - (pt.tippingRisk / 3.0) * 140
                    return `${x.toFixed(1)},${y.toFixed(1)}`
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
              <span className="text-slate-700">
                Cryosphere Stability Index (%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-slate-700">
                Tipping Point Safety Buffer (°C)
              </span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <div className="py-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            &copy; 2025 National Centre for Polar and Ocean Research (NCPOR),
            Ministry of Earth Sciences, Government of India
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
