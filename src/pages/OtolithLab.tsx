import { useState } from "react";

interface Props {
  onNavigate?: (p: string) => void;
  onToast?: (msg: string) => void;
  embedded?: boolean;
}

export interface PolarOtolithSpecimen {
  id: string;
  name: string;
  scientific: string;
  family: string;
  region: "Antarctic" | "Arctic" | "Southern Ocean";
  age: string;
  annualAnnuli: number;
  dailyIncrements: number;
  location: string;
  station: string;
  length: string;
  weight: string;
  waterTemp: string;
  salinity: string;
  depth: string;
  voucherId: string;
  image: string;
  scaleUm: number;
  vonBertalanffyK: string;
  asymptoticLength: string;
  desc: string;
  ecologicalRole: string;
  srCaRatio: string;
}

export const POLAR_OTOLITH_SPECIMENS: PolarOtolithSpecimen[] = [
  {
    id: "toothfish",
    name: "Antarctic Toothfish",
    scientific: "Dissostichus mawsoni",
    family: "Nototheniidae",
    region: "Antarctic",
    age: "12.4 Years",
    annualAnnuli: 12,
    dailyIncrements: 4520,
    location: "Ross Sea & Prydz Bay Shelf",
    station: "Station SO-04 (IAE-45)",
    length: "135.0 cm",
    weight: "34.5 kg",
    waterTemp: "-1.8°C",
    salinity: "34.4 PSU",
    depth: "850 m",
    voucherId: "NCPOR-IAE-OTO-2024-042",
    image: "/images/otolith/toothfish_otolith.jpg",
    scaleUm: 500,
    vonBertalanffyK: "K = 0.088 yr⁻¹",
    asymptoticLength: "L∞ = 182 cm",
    desc: "Dominant apex notothenioid of the Southern Ocean. Sagitta cross-section under transmitted polarized light demonstrates alternating translucent summer and opaque winter growth zones with pronounced sub-zero slow deposition.",
    ecologicalRole: "Top pelagic/benthopelagic predator feeding on cephalopods and icefish.",
    srCaRatio: "1.42 ± 0.08 mmol/mol (Sub-zero cryo-calcification)",
  },
  {
    id: "icefish",
    name: "Mackerel Icefish",
    scientific: "Champsocephalus gunnari",
    family: "Channichthyidae",
    region: "Southern Ocean",
    age: "3.8 Years",
    annualAnnuli: 4,
    dailyIncrements: 1385,
    location: "South Georgia & Scotia Arc",
    station: "Station SG-11 (CCAMLR-48)",
    length: "38.2 cm",
    weight: "460 g",
    waterTemp: "1.2°C",
    salinity: "34.1 PSU",
    depth: "180 m",
    voucherId: "NCPOR-CCAMLR-2023-118",
    image: "/images/otolith/icefish_otolith.jpg",
    scaleUm: 300,
    vonBertalanffyK: "K = 0.320 yr⁻¹",
    asymptoticLength: "L∞ = 52 cm",
    desc: "Hemoglobin-free white-blooded Antarctic icefish. Otolith macrostructure under polarized light displays high crystalline clarity with radial sulcal groove and rapid early larval increments reflecting seasonal krill swarms.",
    ecologicalRole: "Major consumer of Antarctic krill (Euphausia superba).",
    srCaRatio: "1.18 ± 0.05 mmol/mol (High vascular perfusion)",
  },
  {
    id: "polar-cod",
    name: "Arctic Polar Cod",
    scientific: "Boreogadus saida",
    family: "Gadidae",
    region: "Arctic",
    age: "4.6 Years",
    annualAnnuli: 5,
    dailyIncrements: 1680,
    location: "Svalbard Shelf / Kongsfjorden",
    station: "Station AR-02 (Himadri)",
    length: "21.4 cm",
    weight: "92 g",
    waterTemp: "-0.8°C",
    salinity: "34.8 PSU",
    depth: "95 m",
    voucherId: "NCPOR-HIMADRI-2024-009",
    image: "/images/otolith/arctic_cod_otolith.jpg",
    scaleUm: 400,
    vonBertalanffyK: "K = 0.410 yr⁻¹",
    asymptoticLength: "L∞ = 28 cm",
    desc: "Key cryopelagic Arctic bio-indicator. Otolith thin-section mounted on glass slide demonstrates tight multi-year annuli tracking multi-decadal Arctic sea ice retreat and warming trends in Svalbard waters.",
    ecologicalRole: "Central food web link connecting ice amphipods to seals and seabirds.",
    srCaRatio: "1.65 ± 0.12 mmol/mol (Polar front salinity marker)",
  },
  {
    id: "silverfish",
    name: "Antarctic Silverfish",
    scientific: "Pleuragramma antarctica",
    family: "Nototheniidae",
    region: "Antarctic",
    age: "2.9 Years",
    annualAnnuli: 3,
    dailyIncrements: 1060,
    location: "Prydz Bay Coastal Polynya",
    station: "Station PB-08 (Bharati)",
    length: "16.8 cm",
    weight: "38 g",
    waterTemp: "-1.9°C",
    salinity: "34.3 PSU",
    depth: "320 m",
    voucherId: "NCPOR-IAE-OTO-2023-085",
    image: "/images/otolith/icefish_otolith.jpg",
    scaleUm: 200,
    vonBertalanffyK: "K = 0.160 yr⁻¹",
    asymptoticLength: "L∞ = 24 cm",
    desc: "True pelagic Antarctic shelf notothenioid. Micro-increments reveal dense winter growth pauses beneath permanent coastal fast ice, serving as a primary trophic link for Adélie and Emperor penguins.",
    ecologicalRole: "Obligate cold-water pelagic species dominant in high-latitude polynyas.",
    srCaRatio: "1.38 ± 0.06 mmol/mol (Cold-water shelf calcification)",
  },
  {
    id: "rockcod",
    name: "Emerald Rockcod",
    scientific: "Trematomus bernacchii",
    family: "Nototheniidae",
    region: "Antarctic",
    age: "6.8 Years",
    annualAnnuli: 7,
    dailyIncrements: 2480,
    location: "Princess Astrid Coast / Maitri",
    station: "Station MA-03 (Maitri)",
    length: "27.5 cm",
    weight: "340 g",
    waterTemp: "-1.7°C",
    salinity: "34.5 PSU",
    depth: "60 m",
    voucherId: "NCPOR-IAE-OTO-2022-192",
    image: "/images/otolith/toothfish_otolith.jpg",
    scaleUm: 350,
    vonBertalanffyK: "K = 0.142 yr⁻¹",
    asymptoticLength: "L∞ = 36 cm",
    desc: "Benthic circum-Antarctic teleost adapted to sub-zero seawater through high concentrations of antifreeze glycoproteins (AFGPs). Otolith core validates early benthic settlement timing.",
    ecologicalRole: "Benthic predator on polychaetes, amphipods, and isopods.",
    srCaRatio: "1.50 ± 0.09 mmol/mol (Benthic baseline marker)",
  },
  {
    id: "halibut",
    name: "Greenland Halibut",
    scientific: "Reinhardtius hippoglossoides",
    family: "Pleuronectidae",
    region: "Arctic",
    age: "13.9 Years",
    annualAnnuli: 14,
    dailyIncrements: 5070,
    location: "Fram Strait Arctic Basin",
    station: "Station FS-19 (Himadri)",
    length: "82.0 cm",
    weight: "7.6 kg",
    waterTemp: "0.4°C",
    salinity: "34.9 PSU",
    depth: "1200 m",
    voucherId: "NCPOR-HIMADRI-2023-044",
    image: "/images/otolith/arctic_cod_otolith.jpg",
    scaleUm: 600,
    vonBertalanffyK: "K = 0.075 yr⁻¹",
    asymptoticLength: "L∞ = 120 cm",
    desc: "Deep-water Arctic flatfish inhabiting depths down to 2,000m. Transverse otolith sectioning displays clear decadal banding used in international ICES and NAFO polar stock assessments.",
    ecologicalRole: "Deep bathyal predator feeding on polar cod, squid, and deepwater shrimp.",
    srCaRatio: "1.74 ± 0.14 mmol/mol (Bathyal Arctic marker)",
  },
];

export default function OtolithLab({ onNavigate, onToast, embedded = false }: Props) {
  const [selectedSpecimen, setSelectedSpecimen] = useState<PolarOtolithSpecimen>(
    POLAR_OTOLITH_SPECIMENS[0]
  );
  const [regionFilter, setRegionFilter] = useState<"All" | "Antarctic" | "Arctic" | "Southern Ocean">("All");

  // Interactive Micrograph Viewer Toggles
  const [showAnnuliOverlays, setShowAnnuliOverlays] = useState(true);
  const [showPrimordiumCore, setShowPrimordiumCore] = useState(true);
  const [showSulcusCanal, setShowSulcusCanal] = useState(true);
  const [showReadingAxis, setShowReadingAxis] = useState(true);
  const [magnification, setMagnification] = useState<"20x" | "40x" | "100x">("40x");
  const [contrastFilter, setContrastFilter] = useState(false);
  const [exportedCert, setExportedCert] = useState(false);

  const filteredSpecimens =
    regionFilter === "All"
      ? POLAR_OTOLITH_SPECIMENS
      : POLAR_OTOLITH_SPECIMENS.filter((s) => s.region === regionFilter);

  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "VoucherID,Species,Scientific,Region,AgeYears,AnnuliCount,DailyIncrements,LengthCm,WeightKg,TemperatureC,SalinityPSU,K_Parameter\n" +
      `${selectedSpecimen.voucherId},${selectedSpecimen.name},${selectedSpecimen.scientific},${selectedSpecimen.region},${selectedSpecimen.age},${selectedSpecimen.annualAnnuli},${selectedSpecimen.dailyIncrements},${selectedSpecimen.length},${selectedSpecimen.weight},${selectedSpecimen.waterTemp},${selectedSpecimen.salinity},"${selectedSpecimen.vonBertalanffyK}"`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedSpecimen.id}_polar_otolith_microstructure.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onToast) {
      onToast(`Downloaded ${selectedSpecimen.name} Otolith Dataset (.CSV)`);
    }
  };

  const handleExportCert = () => {
    setExportedCert(true);
    if (onToast) {
      onToast(`Generated Sclerochronology Validation Certificate for ${selectedSpecimen.voucherId}`);
    }
    setTimeout(() => setExportedCert(false), 3000);
  };

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "var(--content-bg)" }}
    >
      {/* ── TOP HERO HEADER (MATCHES WEBSITE THEME) ───────────────────────────── */}
      {!embedded && (
        <div className="bg-white border-b border-slate-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[11px] font-mono tracking-widest text-[#003366] font-bold uppercase">
                  NCPOR &middot; POLAR TELEOST SCLEROCHRONOLOGY &amp; OTOLITH BIO-ATLAS
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] border border-blue-200 flex items-center justify-center flex-shrink-0">
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
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Polar Otolith &amp; Microstructure Lab</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-200">
                      CCAMLR / NCPOR
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Microstructure biochronology, annual annuli validation, and paleotemperature thermometry for Antarctic &amp; Arctic ecosystems
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Chips */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              {onNavigate && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate("edna-lab")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>eDNA Lab</span>
                    <span>&rarr;</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("ai-tools")}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>AI Tools</span>
                    <span>&rarr;</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("dashboard")}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Dashboard</span>
                    <span>&rarr;</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT CONTAINER ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── 1. TOP 4 METRIC / KPI CARDS ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-blue-200/80 p-4 shadow-xs">
            <div className="text-[11px] font-bold text-[#003366] uppercase tracking-wider">
              Polar Voucher Specimens
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              2,450+
            </div>
            <div className="text-[11px] text-blue-600 mt-0.5">
              NCPOR &amp; CCAMLR Verified
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200/80 p-4 shadow-xs">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Age Resolution Precision
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              &plusmn;0.2 Yrs
            </div>
            <div className="text-[11px] text-blue-600 mt-0.5">
              Dual Optical + SEM Calibration
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-cyan-200/80 p-4 shadow-xs">
            <div className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
              Sub-Zero Calcification
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              -1.9&deg;C
            </div>
            <div className="text-[11px] text-cyan-600 mt-0.5">
              Cryopelagic Baseline Seawater
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Polar Bio-Zones Active
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              3 Zones
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5">
              Southern Ocean, Prydz, Arctic
            </div>
          </div>
        </div>

        {/* ── 2. DUAL-PANE INTERACTIVE WORKSPACE ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── LEFT COLUMN: POLAR SPECIMEN SELECTOR (5 COLS) ─────────────────── */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h2 className="font-bold text-base text-slate-900 tracking-tight">
                  Polar Teleost Collection
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {filteredSpecimens.length} Species
                </span>
              </div>

              {/* Region Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(["All", "Antarctic", "Arctic", "Southern Ocean"] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => {
                      setRegionFilter(r);
                      const nextList =
                        r === "All"
                          ? POLAR_OTOLITH_SPECIMENS
                          : POLAR_OTOLITH_SPECIMENS.filter((s) => s.region === r);
                      if (nextList.length > 0 && !nextList.some((s) => s.id === selectedSpecimen.id)) {
                        setSelectedSpecimen(nextList[0]);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      regionFilter === r
                        ? "bg-[#003366] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Specimen Cards List */}
              <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                {filteredSpecimens.map((sp) => {
                  const isSelected = selectedSpecimen.id === sp.id;
                  return (
                    <div
                      key={sp.id}
                      onClick={() => setSelectedSpecimen(sp)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? "border-[#003366] bg-blue-50/70 shadow-xs ring-1 ring-[#003366]"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white"
                      }`}
                    >
                      {/* Micrograph Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-300 relative shadow-2xs">
                        <img
                          src={sp.image}
                          alt={sp.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] text-center font-mono py-0.2">
                          {sp.annualAnnuli}R
                        </span>
                      </div>

                      {/* Specimen Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {sp.name}
                          </h4>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                              sp.region === "Antarctic"
                                ? "bg-blue-100 text-blue-800"
                                : sp.region === "Arctic"
                                ? "bg-cyan-100 text-cyan-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {sp.region}
                          </span>
                        </div>
                        <div className="text-[11px] italic text-slate-500 truncate">
                          {sp.scientific}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1 font-mono">
                          <span className="font-bold text-[#003366]">
                            Age: {sp.age}
                          </span>
                          <span>&middot;</span>
                          <span className="text-slate-500">
                            {sp.length}
                          </span>
                          <span>&middot;</span>
                          <span className="text-cyan-700 font-semibold">
                            {sp.waterTemp}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: HIGH-RES POLAR MICROGRAPH WORKBENCH (7 COLS) ───── */}
          <div className="lg:col-span-7 space-y-5">
            {/* ── MICROGRAPH VIEWER CARD ─────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#003366] font-bold uppercase border border-blue-200">
                      {selectedSpecimen.voucherId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedSpecimen.station}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedSpecimen.name}{" "}
                    <span className="text-xs font-normal italic text-slate-500">
                      ({selectedSpecimen.scientific})
                    </span>
                  </h3>
                </div>

                {/* Magnification Controls */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                  {(["20x", "40x", "100x"] as const).map((mag) => (
                    <button
                      type="button"
                      key={mag}
                      onClick={() => setMagnification(mag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        magnification === mag
                          ? "bg-white text-[#003366] shadow-2xs font-bold"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {mag}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setContrastFilter((c) => !c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      contrastFilter
                        ? "bg-[#003366] text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="Toggle Polarizing Filter Mode"
                  >
                    Polarizer
                  </button>
                </div>
              </div>

              {/* Micrograph Canvas Display */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[380px] shadow-inner group">
                <img
                  src={selectedSpecimen.image}
                  alt={`${selectedSpecimen.name} Otolith Micrograph`}
                  className={`w-full max-h-[460px] object-contain transition-all duration-300 ${
                    contrastFilter ? "contrast-125 saturate-150" : ""
                  } ${
                    magnification === "100x"
                      ? "scale-125"
                      : magnification === "20x"
                      ? "scale-90"
                      : "scale-100"
                  }`}
                />

                {/* Interactive SVG Sclerochronology Overlays */}
                <svg
                  viewBox="0 0 500 340"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Dynamic Annuli Rings */}
                  {showAnnuliOverlays && (
                    <g className="transition-opacity duration-200">
                      {Array.from({ length: Math.min(selectedSpecimen.annualAnnuli, 12) }).map((_, i) => {
                        const factor = (i + 1) / Math.min(selectedSpecimen.annualAnnuli, 12);
                        const rx = 35 + factor * 165;
                        const ry = 25 + factor * 115;
                        return (
                          <g key={i}>
                            <ellipse
                              cx="250"
                              cy="170"
                              rx={rx}
                              ry={ry}
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth={i === selectedSpecimen.annualAnnuli - 1 ? "2.5" : "1.5"}
                              strokeDasharray={i % 2 === 0 ? "4 3" : "2 2"}
                              opacity={0.8 + (i / 12) * 0.2}
                            />
                            {/* Annulus label node */}
                            <circle
                              cx={250 + rx * 0.72}
                              cy={170 - ry * 0.69}
                              r="3.5"
                              fill="#0284c7"
                              stroke="#ffffff"
                              strokeWidth="0.8"
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* Primordium Core */}
                  {showPrimordiumCore && (
                    <g>
                      <circle cx="250" cy="170" r="7" fill="#eab308" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="250" cy="170" r="14" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="3 2" />
                      <line x1="250" y1="170" x2="210" y2="135" stroke="#fde047" strokeWidth="1.2" />
                      <rect x="120" y="122" width="88" height="18" rx="4" fill="#000000" fillOpacity="0.8" stroke="#facc15" strokeWidth="0.8" />
                      <text x="164" y="135" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        Core Primordium
                      </text>
                    </g>
                  )}

                  {/* Sulcus Acousticus Canal */}
                  {showSulcusCanal && (
                    <g>
                      <path
                        d="M 120 185 Q 240 160 380 182"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                      <path
                        d="M 120 185 Q 240 160 380 182"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      <rect x="290" y="195" width="100" height="17" rx="4" fill="#000000" fillOpacity="0.8" stroke="#06b6d4" strokeWidth="0.8" />
                      <text x="340" y="207" fill="#67e8f9" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        Sulcus Acousticus
                      </text>
                    </g>
                  )}

                  {/* Dorsal Reading Axis */}
                  {showReadingAxis && (
                    <g>
                      <line x1="250" y1="170" x2="430" y2="45" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
                      <rect x="350" y="25" width="98" height="17" rx="4" fill="#000000" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="0.8" />
                      <text x="399" y="37" fill="#bae6fd" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        Dorsal R/O Axis
                      </text>
                    </g>
                  )}
                </svg>

                {/* Overlaid Micrograph Badges & Scale Bar */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <span className="bg-[#0c1e3c]/90 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-lg shadow-md border border-blue-400/30">
                      {selectedSpecimen.annualAnnuli} Annual Annuli Verified
                    </span>
                    <span className="bg-black/75 backdrop-blur-xs text-cyan-300 text-[10px] font-mono px-2 py-1 rounded border border-cyan-400/30">
                      Daily Incr: ~{selectedSpecimen.dailyIncrements}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-white/20">
                      Transmitted Polarized Light &middot; {magnification}
                    </div>

                    {/* Scale Bar */}
                    <div className="flex flex-col items-center bg-black/80 backdrop-blur-xs text-white px-2 py-1 rounded border border-white/20">
                      <div className="w-16 h-0.5 bg-white mb-0.5" />
                      <span className="text-[9px] font-mono">
                        {selectedSpecimen.scaleUm} &micro;m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Micrograph Viewer Control Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-700 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAnnuliOverlays}
                      onChange={(e) => setShowAnnuliOverlays(e.target.checked)}
                      className="rounded accent-[#003366]"
                    />
                    <span className="font-medium">Annuli Rings</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPrimordiumCore}
                      onChange={(e) => setShowPrimordiumCore(e.target.checked)}
                      className="rounded accent-[#003366]"
                    />
                    <span className="font-medium">Core Primordium</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSulcusCanal}
                      onChange={(e) => setShowSulcusCanal(e.target.checked)}
                      className="rounded accent-[#003366]"
                    />
                    <span className="font-medium">Sulcus Acousticus</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showReadingAxis}
                      onChange={(e) => setShowReadingAxis(e.target.checked)}
                      className="rounded accent-[#003366]"
                    />
                    <span className="font-medium">Reading Axis</span>
                  </label>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── 3. BIOCHRONOLOGY & BIOLOGICAL METRICS CARD (FULL WIDTH) ──────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 tracking-tight pb-2 border-b border-slate-100">
            Biological &amp; Oceanographic Parameters
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <span className="text-slate-500 text-[11px] block">Estimated Age</span>
              <span className="font-bold text-sm text-[#003366] mt-0.5 block">
                {selectedSpecimen.age}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <span className="text-slate-500 text-[11px] block">Fish Length / Weight</span>
              <span className="font-bold text-sm text-slate-900 mt-0.5 block">
                {selectedSpecimen.length} &middot; {selectedSpecimen.weight}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <span className="text-slate-500 text-[11px] block">Habitat Temp &amp; Depth</span>
              <span className="font-bold text-sm text-cyan-700 mt-0.5 block">
                {selectedSpecimen.waterTemp} &middot; {selectedSpecimen.depth}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <span className="text-slate-500 text-[11px] block">Salinity Baseline</span>
              <span className="font-bold text-sm text-emerald-700 mt-0.5 block">
                {selectedSpecimen.salinity}
              </span>
            </div>
          </div>

          {/* Scientific Description */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1.5">
            <p>
              <strong className="text-[#003366]">Microstructure Analysis: </strong>
              {selectedSpecimen.desc}
            </p>
            <p>
              <strong className="text-slate-900">Ecological Role: </strong>
              {selectedSpecimen.ecologicalRole}
            </p>
            <p>
              <strong className="text-cyan-900">Sr/Ca Thermometry: </strong>
              <span className="font-mono">{selectedSpecimen.srCaRatio}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Micro-Data (.CSV)</span>
            </button>

            <button
              type="button"
              onClick={handleExportCert}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0c1e3c] hover:bg-[#08152a] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700/50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-cyan-300">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>{exportedCert ? "Certificate Exported!" : "Export Bio-Certificate"}</span>
            </button>
          </div>
        </div>

        {/* ── 3. POLAR EXPEDITION ARCHIVE VOUCHER TABLE ───────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                National Polar Marine Otolith Repository &middot; Cruise Catalog
              </h3>
              <p className="text-xs text-slate-500">
                Biological collections curated from Indian Antarctic &amp; Arctic Expeditions
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
              NCPOR Goa Bio-Archive
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Voucher ID</th>
                  <th className="py-2.5 px-3">Species (Taxon)</th>
                  <th className="py-2.5 px-3">Polar Region</th>
                  <th className="py-2.5 px-3">Sampling Station</th>
                  <th className="py-2.5 px-3">Age Annuli</th>
                  <th className="py-2.5 px-3">Temperature</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {POLAR_OTOLITH_SPECIMENS.map((sp) => (
                  <tr
                    key={sp.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      selectedSpecimen.id === sp.id ? "bg-blue-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-[#003366] font-bold">
                      {sp.voucherId}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-slate-900 font-bold">{sp.name}</div>
                      <div className="text-[11px] italic text-slate-500">{sp.scientific}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          sp.region === "Antarctic"
                            ? "bg-blue-100 text-blue-800"
                            : sp.region === "Arctic"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {sp.region}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{sp.station}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{sp.age} ({sp.annualAnnuli} R)</td>
                    <td className="py-2.5 px-3 font-bold text-cyan-700">{sp.waterTemp}</td>
                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSpecimen(sp);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <div className="py-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>&copy; 2025 National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Govt of India</div>
          <div>Polar Marine Teleost Sclerochronology &amp; Otolith Reference Atlas</div>
        </div>
      </div>
    </div>
  );
}
