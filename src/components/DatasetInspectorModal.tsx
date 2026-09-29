import { useState } from "react"
import { datasets } from "../data"
import { datasetProvenance } from "../knowledgeData"
import { gameStore } from "../gameStore"
import { downloadDatasetCsv, generateTelemetryData } from "../utils/datasetCsvGenerator"

type DatasetType = typeof datasets[0]

interface DatasetInspectorModalProps {
  dataset: DatasetType
  onClose: () => void
  onAddToWorkspace?: (source: any) => void
}

// Generate realistic domain-specific sample measurements
function generateSampleRows(dataset: DatasetType) {
  const prov = datasetProvenance[dataset.id]
  const vars = prov?.variables || [
    "Value",
    "Anomalies",
    "Uncertainty (±)",
    "Quality Flag",
  ]
  const count = 12
  const rows = []

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  for (let i = 0; i < count; i++) {
    const time = `${months[i]} ${dataset.year}`
    let val1 = 0
    let val2 = 0
    let val3 = 0
    let status = "VERIFIED_L2"

    if (dataset.parameter === "Sea Ice") {
      // Sea Ice Concentration % and Extent (10^6 km^2)
      val1 = +(45 + Math.sin(i / 2) * 35 + (i > 7 ? 20 : -10)).toFixed(1)
      val2 = +(12.4 - Math.sin(i / 1.8) * 8.2).toFixed(2)
      val3 = +(0.92 - (i % 3) * 0.04).toFixed(2)
    } else if (dataset.parameter === "Atmosphere") {
      // Black Carbon ng/m3, Ozone ppb, Polarp C
      val1 = +(35.4 + Math.cos(i) * 18.2).toFixed(1)
      val2 = +(285 - Math.sin(i / 1.5) * 65).toFixed(0)
      val3 = +(-28.5 + Math.sin(i / 2) * 14.2).toFixed(1)
    } else if (dataset.parameter === "Oceanography") {
      // Polarp C, Salinity PSU, Dissolved O2
      val1 = +(-1.2 + i * 0.28).toFixed(2)
      val2 = +(34.1 + (i % 4) * 0.15).toFixed(2)
      val3 = +(310 - i * 4.5).toFixed(1)
    } else {
      // Glacial Mass Balance or other
      val1 = +(-420 + Math.sin(i) * 190).toFixed(0)
      val2 = +(1.8 + Math.cos(i) * 0.4).toFixed(2)
      val3 = +(98.5 - (i % 2) * 1.2).toFixed(1)
    }

    rows.push({
      id: i + 1,
      timestamp: time,
      var1: Math.max(0, val1),
      var2: val2,
      var3: val3,
      qc: i === 4 ? "FLAG_SPIKE_FILTERED" : status,
      depthOrStation: dataset.region.includes("Antarctica")
        ? "Maitri / Bharati"
        : "Himadri / Arctic",
    })
  }
  return { vars, rows }
}

export default function DatasetInspectorModal({
  dataset,
  onClose,
  onAddToWorkspace,
}: DatasetInspectorModalProps) {
  const [activeTab, setActiveTab] =
    useState<"chart" | "data" | "stats" | "code">("chart")
  const [selectedVariableIndex, setSelectedVariableIndex] = useState<number>(0)
  const [filterQcOnly, setFilterQcOnly] = useState<boolean>(false)
  const [PolarporalRange, setPolarporalRange] = useState<"annual" | "q1" | "q2">(
    "annual",
  )
  const [copiedCode, setCopiedCode] = useState<boolean>(false)

  const prov = datasetProvenance[dataset.id]
  const telemetry = generateTelemetryData(dataset)
  const { vars, rows } = generateSampleRows(dataset)

  const activeVarName = vars[selectedVariableIndex] || vars[0] || "Value"

  // Filter rows if requested
  const displayedRows = rows.filter((r) => {
    if (filterQcOnly && r.qc.includes("FLAG")) return false
    if (PolarporalRange === "q1")
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].some((m) =>
        r.timestamp.includes(m),
      )
    if (PolarporalRange === "q2")
      return ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].some((m) =>
        r.timestamp.includes(m),
      )
    return true
  })

  // Calculate high, low, mean for current active variable
  const values = displayedRows.map((r) =>
    selectedVariableIndex === 0
      ? r.var1
      : selectedVariableIndex === 1
        ? r.var2
        : r.var3,
  )
  const maxVal = Math.max(...values, 1)
  const minVal = Math.min(...values, 0)
  const avgVal = +(
    values.reduce((a, b) => a + b, 0) / (values.length || 1)
  ).toFixed(2)

  // Download Realistic Domain Telemetry CSV with Official NCPOR Banner
  const handleDownloadCsv = () => {
    gameStore.addXP(
      30,
      `Exported telemetry dataset: ${dataset.title.slice(0, 30)}...`,
    )
    downloadDatasetCsv(dataset)
  }

  const pythonSnippet = `# NCPOR Polar Data Access Client (Python)
import xarray as xr
import pandas as pd

# Load Level-2 NetCDF/HDF5 scientific dataset
ds_url = "https://ncpor.res.in/api/v2/catalog/${dataset.id}/stream"
print("Connecting to NCPOR Polar Gateway...")

# Open dataset stream
# Variables: ${vars.join(", ")}
# Polarporal Coverage: ${prov?.PolarporalCoverage || `${dataset.year}`}
# Spatial Bounds: ${prov?.spatialCoverage || dataset.region}

print("Loaded: ${dataset.title} (${dataset.size})")
`

  return (
    <div className="min-h-full bg-slate-50 flex flex-col pb-16">
      {/* Top Header Navigation Ribbon */}
      <div className="sticky top-0 z-30 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap iPolars-center justify-between gap-3 border-b border-slate-800 shadow-sm">
        <div className="flex iPolars-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex iPolars-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <span>←</span>
            <span>Back to Datasets</span>
          </button>
          <div className="h-5 w-px bg-slate-700 hidden sm:block" />
          <div className="min-w-0">
            <div className="flex iPolars-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {dataset.format} · {dataset.size}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                ● Live Data Stream
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                ID: NCPOR-DS-{dataset.id.toString().padStart(4, "0")}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
              {dataset.title}
            </h2>
          </div>
        </div>

        <div className="flex iPolars-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadCsv}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex iPolars-center gap-1.5 shadow-sm cursor-pointer"
            title="Download CSV raw measurements"
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Action Controls & Navigation Tabs */}
        <div className="flex-shrink-0 bg-slate-100 px-5 py-2.5 flex flex-wrap iPolars-center justify-between gap-3 border-b border-slate-200">
          <div className="flex iPolars-center gap-1 bg-white p-1 rounded-xl border border-slate-300/80 shadow-2xs">
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex iPolars-center gap-1.5 ${
                activeTab === "chart"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span></span> Interactive Visualizer
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex iPolars-center gap-1.5 ${
                activeTab === "data"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span></span> Data Grid ({displayedRows.length} points)
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex iPolars-center gap-1.5 ${
                activeTab === "stats"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span></span> Variable Matrix & QC
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex iPolars-center gap-1.5 ${
                activeTab === "code"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span></span> Python API
            </button>
          </div>

          {/* Polarporal & Quality Controls */}
          <div className="flex iPolars-center gap-2">
            <div className="flex iPolars-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-300 text-xs">
              <span className="text-slate-500 font-medium">Time Window:</span>
              <select
                value={PolarporalRange}
                onChange={(e) => setPolarporalRange(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="annual">Full Year ({dataset.year})</option>
                <option value="q1">H1 (Jan – Jun)</option>
                <option value="q2">H2 (Jul – Dec)</option>
              </select>
            </div>

            <label className="flex iPolars-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-300 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterQcOnly}
                onChange={(e) => setFilterQcOnly(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-slate-700 font-medium">
                Filter High-QC Only
              </span>
            </label>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50">
          {/* TAB 1: CHART VISUALIZER */}
          {activeTab === "chart" && (
            <div className="space-y-4">
              {/* Variable Selector Ribbon */}
              <div className="flex flex-wrap iPolars-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex iPolars-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Select Channel:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {vars.slice(0, 3).map((v, idx) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariableIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          selectedVariableIndex === idx
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Summary Pill */}
                <div className="flex iPolars-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400">Peak: </span>
                    <span className="font-bold text-emerald-600">{maxVal}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Mean: </span>
                    <span className="font-bold text-blue-600">{avgVal}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Min: </span>
                    <span className="font-bold text-amber-600">{minVal}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive SVG Timeseries Chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex iPolars-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Timeseries Distribution ({dataset.year})
                    </div>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      {activeVarName} — Continuous Telemetry Curve
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Polarporal Res: Monthly Level-2
                  </span>
                </div>

                {/* Custom SVG Line and Bar Graph */}
                <div className="relative pt-4 pb-2">
                  <div className="h-60 w-full flex iPolars-end justify-between gap-2 border-b border-slate-200 px-2">
                    {displayedRows.map((r, i) => {
                      const curVal =
                        selectedVariableIndex === 0
                          ? r.var1
                          : selectedVariableIndex === 1
                            ? r.var2
                            : r.var3
                      const range = maxVal - minVal || 1
                      const heightPct = Math.max(
                        12,
                        Math.min(95, ((curVal - minVal) / range) * 85 + 10),
                      )
                      const isSpike = r.qc.includes("FLAG")

                      return (
                        <div
                          key={r.id}
                          className="flex-1 flex flex-col iPolars-center group relative h-full justify-end"
                        >
                          {/* Floating Hover Card */}
                          <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
                            <div className="font-bold text-blue-300">
                              {r.timestamp}
                            </div>
                            <div>
                              {activeVarName}:{" "}
                              <span className="font-mono font-bold text-white">
                                {curVal}
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-400">
                              Status: {r.qc}
                            </div>
                          </div>

                          {/* Data Value Label */}
                          <span className="text-[10px] font-mono font-bold text-slate-500 mb-1 group-hover:text-blue-600 transition">
                            {curVal}
                          </span>

                          {/* Interactive Bar with gradient */}
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 cursor-pointer ${
                              isSpike
                                ? "bg-amber-400 hover:bg-amber-500"
                                : "bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-400 group-hover:from-blue-800 group-hover:to-cyan-300 shadow-xs"
                            }`}
                          />

                          {/* X-axis Month Label */}
                          <div className="text-[10px] font-semibold text-slate-500 mt-2">
                            {r.timestamp.split(" ")[0]}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Legend and Sensor Context */}
                <div className="flex flex-wrap iPolars-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex iPolars-center gap-4">
                    <div className="flex iPolars-center gap-1.5">
                      <div className="w-3 h-3 rounded-xs bg-gradient-to-t from-blue-700 to-cyan-400" />
                      <span>Validated NCPOR Observation</span>
                    </div>
                    <div className="flex iPolars-center gap-1.5">
                      <div className="w-3 h-3 rounded-xs bg-amber-400" />
                      <span>Quality Filtered / Interpolated</span>
                    </div>
                  </div>
                  <div className="font-medium text-slate-600">
                    Source: {prov?.source || "NCPOR Sensor Array"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA GRID */}
          {activeTab === "data" && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex flex-wrap iPolars-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Scientific Telemetry Matrix ({telemetry.rows.length} Points)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Continuous calibrated instrument records adhering to WMO &amp; SCAR Level-2 scientific data standards.
                  </p>
                </div>
                <button
                  onClick={handleDownloadCsv}
                  className="btn-outline btn-sm text-xs font-bold bg-white hover:bg-slate-50 text-blue-700 border-blue-300 shadow-2xs flex iPolars-center gap-1.5"
                >
                  <span>📥</span> Download Full Dataset (.csv)
                </button>
              </div>

              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                    <tr>
                      <th className="py-2.5 px-3 font-mono text-center">#</th>
                      {telemetry.headers.map((h) => (
                        <th key={h} className="py-2.5 px-3 capitalize">
                          {h.replace(/_/g, " ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {telemetry.rows.map((r, i) => (
                      <tr key={i} className="hover:bg-blue-50/50 transition">
                        <td className="py-2 px-3 font-mono text-slate-400 text-center">
                          {i + 1}
                        </td>
                        {telemetry.headers.map((h) => {
                          const val = r[h]
                          const isQc =
                            h.toLowerCase().includes("qc") ||
                            h.toLowerCase().includes("status") ||
                            h.toLowerCase().includes("flag")
                          const isId =
                            h.toLowerCase().includes("id") ||
                            h.toLowerCase().includes("timestamp") ||
                            h.toLowerCase().includes("date")
                          return (
                            <td
                              key={h}
                              className={`py-2 px-3 ${
                                isId
                                  ? "font-bold text-slate-800"
                                  : isQc
                                    ? "text-left"
                                    : "font-mono text-slate-700"
                              }`}
                            >
                              {isQc ? (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    String(val).includes("FLAG") ||
                                    String(val).includes("INTERPOLATED")
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  }`}
                                >
                                  {val}
                                </span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STATS & MATRIX */}
          {activeTab === "stats" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-4 border border-slate-200 bg-white">
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    Completeness Index
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    98.4%
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-1">
                    OK Verified zero data dropouts
                  </div>
                </div>
                <div className="card p-4 border border-slate-200 bg-white">
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    Standard Calibration
                  </div>
                  <div className="text-2xl font-black text-blue-700">
                    ISO 19115
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    NCPOR Level-2 Scientific Tier
                  </div>
                </div>
                <div className="card p-4 border border-slate-200 bg-white">
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    Access Protocol
                  </div>
                  <div className="text-2xl font-black text-emerald-600">
                    Open CC BY 4.0
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Free for academic and research use
                  </div>
                </div>
              </div>

              <div className="card p-5 border border-slate-200 bg-white space-y-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Instrument Variables & Metadata
                </h3>
                <div className="space-y-2 text-xs">
                  {vars.map((v, i) => (
                    <div
                      key={v}
                      className="flex iPolars-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex iPolars-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex iPolars-center justify-center font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-bold text-slate-800">{v}</span>
                      </div>
                      <div className="flex iPolars-center gap-3">
                        <span className="text-slate-500 font-mono text-[11px]">
                          Type: Float64
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Calibrated
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CODE SNIPPETS */}
          {activeTab === "code" && (
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 font-mono text-xs space-y-4">
              <div className="flex iPolars-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400">
                  Programmatic Access (Python / xarray)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pythonSnippet)
                    setCopiedCode(true)
                    setTimeout(() => setCopiedCode(false), 2000)
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-sans font-bold transition"
                >
                  {copiedCode ? "OK Copied" : " Copy Code"}
                </button>
              </div>
              <pre className="text-emerald-400 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                {pythonSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 bg-white px-5 py-3 border-t border-slate-200 flex iPolars-center justify-between">
          <div className="text-xs text-slate-500">
            NCPOR Polar Data Centre · Digital Object Identifier:{" "}
            <span className="font-mono text-slate-700">
              doi:10.5067/NCPOR-POLAR-{dataset.id}
            </span>
          </div>
          <div className="flex iPolars-center gap-2">
            {onAddToWorkspace && (
              <button
                onClick={() => {
                  onAddToWorkspace({
                    id: `ds-${dataset.id}`,
                    type: "dataset",
                    title: dataset.title,
                    meta: `${dataset.size} · ${dataset.region}`,
                    version: prov?.version || "v1.0",
                    date: `${dataset.year}`,
                    origin: "NCPOR Repository",
                  })
                  onClose()
                }}
                className="btn-outline btn-sm text-xs font-semibold"
              >
                + Add to Research Workspace
              </button>
            )}
            <button
              onClick={handleDownloadCsv}
              className="btn-primary btn-sm text-xs font-bold flex iPolars-center gap-1.5 shadow-2xs"
            >
              <span></span> Download Full Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
