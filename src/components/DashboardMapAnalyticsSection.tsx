import { useState } from "react"
import DashboardPolarMap from "./DashboardPolarMap"

interface Props {
  onNavigate: (p: string) => void
  onToast: (msg: string) => void
}

interface Specimen {
  id: string
  name: string
  scientific: string
  family: string
  age: string
  rings: string
  catchArea: string
  length: string
  weight: string
  temp: string
  salinity: string
  desc: string
  image: string
  region: "Antarctic" | "Arctic" | "Southern Ocean"
}

const SPECIMENS: Specimen[] = [
  {
    id: "toothfish",
    name: "Antarctic Toothfish",
    scientific: "Dissostichus mawsoni",
    family: "Nototheniidae",
    age: "12.4 Years",
    rings: "12 Annual Annuli",
    catchArea: "Ross Sea & Prydz Bay (Station SO-04)",
    length: "135.0 cm",
    weight: "34.5 kg",
    temp: "-1.8°C",
    salinity: "34.4 PSU",
    image: "/images/otolith/toothfish_otolith.jpg",
    region: "Antarctic",
    desc: "Apex Southern Ocean notothenioid. Transverse sagitta slice exhibits alternating opaque summer and hyaline winter growth zones with pronounced sub-zero slow deposition.",
  },
  {
    id: "icefish",
    name: "Mackerel Icefish",
    scientific: "Champsocephalus gunnari",
    family: "Channichthyidae",
    age: "3.8 Years",
    rings: "4 Annual Annuli",
    catchArea: "South Georgia & Scotia Arc (Station SG-11)",
    length: "38.2 cm",
    weight: "460 g",
    temp: "1.2°C",
    salinity: "34.1 PSU",
    image: "/images/otolith/icefish_otolith.jpg",
    region: "Southern Ocean",
    desc: "White-blooded Antarctic channichthyid devoid of hemoglobin. Polarized micrograph reveals distinct daily micro-increments and crystalline aragonite growth rings.",
  },
  {
    id: "polar-cod",
    name: "Polar Cod (Arctic)",
    scientific: "Boreogadus saida",
    family: "Gadidae",
    age: "4.6 Years",
    rings: "5 Annual Annuli",
    catchArea: "Svalbard Shelf / Kongsfjorden (Station AR-02)",
    length: "21.4 cm",
    weight: "92 g",
    temp: "-0.8°C",
    salinity: "34.8 PSU",
    image: "/images/otolith/arctic_cod_otolith.jpg",
    region: "Arctic",
    desc: "Key cryopelagic Arctic bio-indicator. Micrograph on glass slide demonstrates tight multi-year annuli tracking multi-decadal Arctic sea ice retreat and warming trends.",
  },
  {
    id: "silverfish",
    name: "Antarctic Silverfish",
    scientific: "Pleuragramma antarctica",
    family: "Nototheniidae",
    age: "2.9 Years",
    rings: "3 Annual Annuli",
    catchArea: "Prydz Bay Coastal Polynya (Station PB-08)",
    length: "16.8 cm",
    weight: "38 g",
    temp: "-1.9°C",
    salinity: "34.3 PSU",
    image: "/images/otolith/icefish_otolith.jpg",
    region: "Antarctic",
    desc: "True pelagic Antarctic shelf notothenioid. Micro-increments reveal dense winter growth pauses beneath fast ice, serving as a primary trophic link for penguins.",
  },
  {
    id: "rockcod",
    name: "Emerald Rockcod",
    scientific: "Trematomus bernacchii",
    family: "Nototheniidae",
    age: "6.8 Years",
    rings: "7 Annual Annuli",
    catchArea: "Princess Astrid Coast / Maitri (Station MA-03)",
    length: "27.5 cm",
    weight: "340 g",
    temp: "-1.7°C",
    salinity: "34.5 PSU",
    image: "/images/otolith/toothfish_otolith.jpg",
    region: "Antarctic",
    desc: "Benthic circum-Antarctic teleost adapted to sub-zero seawater through high antifreeze glycoprotein (AFGP) levels. Otolith core validates benthic settlement.",
  },
  {
    id: "halibut",
    name: "Greenland Halibut",
    scientific: "Reinhardtius hippoglossoides",
    family: "Pleuronectidae",
    age: "13.9 Years",
    rings: "14 Annual Annuli",
    catchArea: "Fram Strait Arctic Basin (Station FS-19)",
    length: "82.0 cm",
    weight: "7.6 kg",
    temp: "0.4°C",
    salinity: "34.9 PSU",
    image: "/images/otolith/arctic_cod_otolith.jpg",
    region: "Arctic",
    desc: "Deep-water Arctic flatfish inhabiting bathyal depths down to 2,000m. Transverse otolith sectioning displays clear decadal banding used in international polar assessments.",
  },
]

export default function DashboardMapAnalyticsSection({
  onNavigate,
  onToast,
}: Props) {
  // Specimen & Analytics Modals
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(
    null,
  )
  const [allSamplesModalOpen, setAllSamplesModalOpen] = useState(false)
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false)

  return (
    <section className="space-y-4">
      {/* ── TWO-COLUMN GRID: LEFT POLAR MAP + RIGHT OTOLITH & ANALYTICS ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: EXACT POLAR MAP PREVIOUSLY PRESENT (8 COLS) ──────── */}
        <div className="lg:col-span-8 flex flex-col">
          <DashboardPolarMap onNavigate={onNavigate} onToast={onToast} />
        </div>

        {/* ── RIGHT COLUMN: OTOLITH LAB (TOP) + DYNAMIC ANALYTICS (BOTTOM) (4 COLS) ── */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* ── CARD 1: OTOLITH LAB ────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header: Purple Icon + Title */}
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
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
                </div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Otolith Lab
                </h3>
              </div>

              {/* 2x3 Specimen Cards Grid with Real Polar Micrographs */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {SPECIMENS.map((sp) => (
                  <div
                    key={sp.id}
                    onClick={() => setSelectedSpecimen(sp)}
                    className="rounded-xl overflow-hidden border border-purple-200/80 bg-slate-900 hover:border-purple-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between aspect-square"
                    title={`Inspect ${sp.name} (${sp.scientific})`}
                  >
                    {/* Top Body: Real Polar Micrograph */}
                    <div className="flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center">
                      <img
                        src={sp.image}
                        alt={sp.name}
                        className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-300"
                      />
                      <span className="absolute top-1 left-1 bg-black/75 text-[8.5px] font-mono text-purple-200 px-1 py-0.2 rounded border border-white/20">
                        {sp.region === "Antarctic" ? "ANT" : sp.region === "Arctic" ? "ARC" : "SO"}
                      </span>
                    </div>

                    {/* Bottom Pill: Dark Purple with Label */}
                    <div className="bg-[#1e1b4b] text-white text-[10px] font-bold py-1 px-1 text-center truncate tracking-tight">
                      {sp.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Buttons: All Samples + Lab Portal */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAllSamplesModalOpen(true)}
                className="flex-1 py-2 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold transition-all text-center cursor-pointer truncate"
              >
                All Polar Archive
              </button>
              <button
                type="button"
                onClick={() => onNavigate("otolith-lab")}
                className="flex-1 py-2 px-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 shadow-xs truncate"
              >
                <span>Lab Portal</span>
                <span>&rarr;</span>
              </button>
            </div>
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
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Interactive parameter analysis with real-time marine data
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

      {/* ── MODAL 1: SPECIMEN DETAIL (FROM OTOLITH LAB) ────────────────────── */}
      {selectedSpecimen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150"
          onClick={() => setSelectedSpecimen(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                  {selectedSpecimen.family}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSpecimen.name}{" "}
                  <span className="text-xs font-normal italic text-slate-500">
                    ({selectedSpecimen.scientific})
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedSpecimen(null)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                x
              </button>
            </div>

            {selectedSpecimen.image && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={selectedSpecimen.image}
                  alt={selectedSpecimen.name}
                  className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  POLARIZED MICROSCOPY · 40x
                </div>
                <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
                  {selectedSpecimen.region} Specimen
                </div>
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedSpecimen.desc}
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <div>
                <span className="text-slate-500 text-[11px] block">
                  Estimated Age:
                </span>
                <span className="font-bold text-slate-900">
                  {selectedSpecimen.age}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">
                  Daily Annuli Count:
                </span>
                <span className="font-bold text-purple-700">
                  {selectedSpecimen.rings}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">
                  Fish Length & Weight:
                </span>
                <span className="font-bold text-slate-900">
                  {selectedSpecimen.length} · {selectedSpecimen.weight}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">
                  Sampling Location:
                </span>
                <span className="font-bold text-slate-900">
                  {selectedSpecimen.catchArea}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">
                  Water Temperature:
                </span>
                <span className="font-bold text-cyan-700">
                  {selectedSpecimen.temp}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">
                  Salinity Profile:
                </span>
                <span className="font-bold text-emerald-700">
                  {selectedSpecimen.salinity}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedSpecimen(null)
                  onNavigate("otolith-lab")
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Interactive Polar Workbench</span>
                <span>&rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onToast(
                    `Downloaded Otolith Microstructure dataset for ${selectedSpecimen.name}`,
                  )
                  setSelectedSpecimen(null)
                }}
                className="py-2 px-3 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition-all shadow-xs"
              >
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => setSelectedSpecimen(null)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: VIEW ALL SAMPLES ──────────────────────────────────────── */}
      {allSamplesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150"
          onClick={() => setAllSamplesModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Polar Otolith Reference Sclerochronology Archive
                </h3>
                <p className="text-xs text-slate-500">
                  Antarctic, Southern Ocean & Arctic Teleost Reference Micrographs
                </p>
              </div>
              <button
                onClick={() => setAllSamplesModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                x
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPECIMENS.map((sp) => (
                <div
                  key={sp.id}
                  className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all cursor-pointer flex gap-3 items-center"
                  onClick={() => {
                    setSelectedSpecimen(sp)
                    setAllSamplesModalOpen(false)
                  }}
                >
                  <img
                    src={sp.image}
                    alt={sp.name}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {sp.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold ml-1 shrink-0">
                        {sp.age}
                      </span>
                    </div>
                    <div className="text-xs italic text-slate-500 truncate">
                      {sp.scientific}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 truncate">
                      {sp.catchArea}
                    </div>
                    <div className="text-[10px] text-cyan-700 font-medium mt-0.5">
                      {sp.region} · {sp.temp} · {sp.rings}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setAllSamplesModalOpen(false)
                  onNavigate("otolith-lab")
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>Open Dedicated Polar Otolith Lab</span>
                <span>&rarr;</span>
              </button>
              <button
                onClick={() => setAllSamplesModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: DYNAMIC ANALYTICS LAUNCHER ─────────────────────────────── */}
      {analyticsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150"
          onClick={() => setAnalyticsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1D4ED8] flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Dynamic Oceanographic Analytics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time sensor telemetry & parameter correlation matrix
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAnalyticsModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                x
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="text-[10px] text-slate-500">Avg SST (2024)</div>
                <div className="text-base font-bold text-blue-700 font-mono mt-0.5">
                  26.8°C
                </div>
                <div className="text-[9px] text-emerald-600 font-medium">
                  ↑ +0.4°C anomaly
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="text-[10px] text-slate-500">Salinity Index</div>
                <div className="text-base font-bold text-emerald-700 font-mono mt-0.5">
                  35.4 PSU
                </div>
                <div className="text-[9px] text-slate-400">Normal Range</div>
              </div>
              <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-100">
                <div className="text-[10px] text-slate-500">Chlorophyll-a</div>
                <div className="text-base font-bold text-purple-700 font-mono mt-0.5">
                  1.82 mg/m³
                </div>
                <div className="text-[9px] text-purple-600 font-medium">
                  High productivity
                </div>
              </div>
              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <div className="text-[10px] text-slate-500">Dissolved O2</div>
                <div className="text-base font-bold text-amber-700 font-mono mt-0.5">
                  4.6 ml/L
                </div>
                <div className="text-[9px] text-slate-400">
                  Oxygenated Shelf
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Multi-Year Chlorophyll-a / SST Correlation</span>
                <span className="text-[10px] text-sky-400 font-mono">
                  Telemetry Active
                </span>
              </div>
              <div className="h-28 flex items-end gap-2 pt-4 px-2">
                {[45, 62, 58, 75, 84, 92, 78, 88, 95, 82, 90, 98].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1 group"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm group-hover:brightness-125 transition-all"
                        style={{ height: `${val}%` }}
                      />
                      <span className="text-[8px] text-slate-400 font-mono">
                        {idx + 1}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate("datasets")
                  setAnalyticsModalOpen(false)
                }}
                className="px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition-all shadow-xs"
              >
                Go to Full Datasets Module →
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
