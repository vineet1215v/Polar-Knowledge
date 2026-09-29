import { useState } from "react";

interface AIToolsProps {
  onNavigate?: (page: string) => void;
  initialTool?: "prediction" | "fish-id" | "otolith" | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sample Specimen Data for Tool 2: Fish Image Identification
// ─────────────────────────────────────────────────────────────────────────────
interface FishSpecimen {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  confidence: number;
  totalLength: string;
  bodyDepth: string;
  habitat: string;
  status: string;
  svgColor: string;
  svgHighlight: string;
}

const FISH_SPECIMENS: FishSpecimen[] = [
  {
    id: "mackerel",
    name: "Indian Mackerel",
    scientificName: "Rastrelliger kanagurta",
    family: "Scombridae",
    confidence: 98.4,
    totalLength: "24.8 cm",
    bodyDepth: "6.4 cm",
    habitat: "Pelagic-neritic, 20-90m depth",
    status: "Least Concern (IUCN)",
    svgColor: "#0284c7",
    svgHighlight: "#38bdf8",
  },
  {
    id: "sardine",
    name: "Indian Oil Sardine",
    scientificName: "Sardinella longiceps",
    family: "Clupeidae",
    confidence: 97.9,
    totalLength: "18.2 cm",
    bodyDepth: "4.8 cm",
    habitat: "Coastal epipelagic, 5-45m depth",
    status: "Commercially Significant (CMFRI)",
    svgColor: "#059669",
    svgHighlight: "#34d399",
  },
  {
    id: "tuna",
    name: "Yellowfin Tuna",
    scientificName: "Thunnus albacares",
    family: "Scombridae",
    confidence: 99.1,
    totalLength: "68.5 cm",
    bodyDepth: "18.2 cm",
    habitat: "Oceanic epipelagic, 0-250m depth",
    status: "Near Threatened (IUCN)",
    svgColor: "#d97706",
    svgHighlight: "#fbbf24",
  },
  {
    id: "pomfret",
    name: "Silver Pomfret",
    scientificName: "Pampus argenteus",
    family: "Stromateidae",
    confidence: 96.5,
    totalLength: "28.0 cm",
    bodyDepth: "14.2 cm",
    habitat: "Benthopelagic, 10-100m depth",
    status: "High Commercial Value",
    svgColor: "#6366f1",
    svgHighlight: "#a5b4fc",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sample Otolith Specimens for Tool 3: Otolith Image Comparison
// ─────────────────────────────────────────────────────────────────────────────
interface OtolithSpecimen {
  id: string;
  species: string;
  scientificName: string;
  family: string;
  region: "Antarctic" | "Arctic" | "Southern Ocean";
  voucherId: string;
  rings: number;
  estimatedAge: string;
  cohort: string;
  growthK: string;
  matchScore: number;
  image: string;
  waterTemp: string;
  desc: string;
}

const OTOLITH_SPECIMENS: OtolithSpecimen[] = [
  {
    id: "oto-1",
    species: "Antarctic Toothfish",
    scientificName: "Dissostichus mawsoni",
    family: "Nototheniidae",
    region: "Antarctic",
    voucherId: "NCPOR-IAE-OTO-2024-042",
    rings: 12,
    estimatedAge: "12.4 ± 0.3 years",
    cohort: "Austral Winter 2012",
    growthK: "K = 0.088 yr⁻¹",
    matchScore: 98.6,
    image: "/images/otolith/toothfish_otolith.jpg",
    waterTemp: "-1.8°C",
    desc: "Apex Southern Ocean notothenioid. Transverse sagitta slice exhibits alternating opaque summer and hyaline winter growth zones with pronounced sub-zero slow deposition.",
  },
  {
    id: "oto-2",
    species: "Mackerel Icefish",
    scientificName: "Champsocephalus gunnari",
    family: "Channichthyidae",
    region: "Southern Ocean",
    voucherId: "NCPOR-SO-OTO-2023-018",
    rings: 4,
    estimatedAge: "3.8 ± 0.2 years",
    cohort: "Austral Spring 2020",
    growthK: "K = 0.312 yr⁻¹",
    matchScore: 97.4,
    image: "/images/otolith/icefish_otolith.jpg",
    waterTemp: "1.2°C",
    desc: "Hemoglobinless Antarctic white-blooded icefish. Polished sagitta displays daily aragonite micro-increments and crystalline calcium carbonate lamellae.",
  },
  {
    id: "oto-3",
    species: "Polar Cod (Arctic)",
    scientificName: "Boreogadus saida",
    family: "Gadidae",
    region: "Arctic",
    voucherId: "NCPOR-HIM-OTO-2024-009",
    rings: 5,
    estimatedAge: "4.6 ± 0.2 years",
    cohort: "Arctic Summer 2019",
    growthK: "K = 0.245 yr⁻¹",
    matchScore: 96.8,
    image: "/images/otolith/arctic_cod_otolith.jpg",
    waterTemp: "-0.8°C",
    desc: "Key Arctic cryo-pelagic keystone species sampled near Svalbard (Kongsfjorden). Shows five prominent optical growth annuli validated by ICES standards.",
  },
];

export default function AITools({ onNavigate, initialTool = null }: AIToolsProps) {
  // Modal states for the 3 tools
  const [activeToolModal, setActiveToolModal] = useState<"prediction" | "fish-id" | "otolith" | null>(initialTool);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Tool 1: Environmental Prediction State
  const [targetSpecies, setTargetSpecies] = useState("Sardinella longiceps");
  const [sst, setSst] = useState(28.4);
  const [salinity, setSalinity] = useState(34.8);
  const [dissolvedOxygen, setDissolvedOxygen] = useState(5.2);
  const [chlorophyll, setChlorophyll] = useState(1.8);
  const [depth, setDepth] = useState(45);

  // Compute realistic ecological metrics based on inputs
  const sstOptimum = targetSpecies === "Sardinella longiceps" ? 28.0 : targetSpecies === "Thunnus albacares" ? 26.5 : 28.2;
  const sstDelta = Math.abs(sst - sstOptimum);
  const suitabilityScore = Math.max(40, Math.min(99, Math.round(98 - sstDelta * 11 + chlorophyll * 3.5 - Math.abs(salinity - 34.5) * 4)));
  const predictedBiomass = (suitabilityScore * 0.62 + (chlorophyll * 5.4)).toFixed(1);
  const quotaRecommendation = Math.round(parseFloat(predictedBiomass) * 6.8);

  // Tool 2: Fish Image Identification State
  const [selectedSpecimen, setSelectedSpecimen] = useState<FishSpecimen>(FISH_SPECIMENS[0]);
  const [isScanningFish, setIsScanningFish] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [loggedToRepository, setLoggedToRepository] = useState(false);

  const handleScanSpecimen = (specimen: FishSpecimen) => {
    setSelectedSpecimen(specimen);
    setIsScanningFish(true);
    setLoggedToRepository(false);
    setTimeout(() => {
      setIsScanningFish(false);
    }, 700);
  };

  // Tool 3: Otolith Image Comparison State
  const [selectedOtolith, setSelectedOtolith] = useState<OtolithSpecimen>(OTOLITH_SPECIMENS[0]);
  const [showAnnuliRings, setShowAnnuliRings] = useState(true);
  const [showNucleusCore, setShowNucleusCore] = useState(true);
  const [showTransectAxis, setShowTransectAxis] = useState(true);
  const [otolithExported, setOtolithExported] = useState(false);

  // Marine AI Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your CMLRE Marine AI Assistant. I can help analyze oceanographic variables, explain otolith daily rings, predict pelagic fish biomass, or query polar and marine datasets. How can I assist your research today?",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChat = (textToSend?: string) => {
    const query = textToSend || chatInput.trim();
    if (!query) return;

    const userMsg = { sender: "user" as const, text: query, time: "Now" };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    setTimeout(() => {
      let reply = "Based on CMLRE oceanographic models and multi-year cruise archives, this parameter shows significant correlation with seasonal upwelling along the western continental shelf.";
      const lower = query.toLowerCase();

      if (lower.includes("sst") || lower.includes("temperature") || lower.includes("sardine")) {
        reply = "Analysis indicates that Sea Surface Temperature (SST) above 29.5°C drives Indian Oil Sardine (Sardinella longiceps) schools toward deeper offshore thermoclines or northward into cooler shelf waters, suppressing surface purse-seine catches.";
      } else if (lower.includes("otolith") || lower.includes("age") || lower.includes("ring")) {
        reply = "In tropical teleost otoliths, translucent zones correspond to rapid monsoon growth phases, whereas opaque zones indicate stress or spawning. High-resolution microscope optical density scans differentiate true annual annuli from sub-daily lunar feeding increments with 96.4% confidence.";
      } else if (lower.includes("chlorophyll") || lower.includes("bloom") || lower.includes("arabian")) {
        reply = "Southwest monsoon coastal upwelling brings cold, nutrient-rich sub-surface water (nitrate > 10 µM) to the photic zone, elevating Chlorophyll-a to 2.5–4.8 mg/m³ and creating high pelagic biomass hotspots.";
      } else if (lower.includes("edna") || lower.includes("dna") || lower.includes("trawling")) {
        reply = "eDNA 12S/16S metabarcoding achieves 3.4x higher taxonomic detection sensitivity than midwater trawl nets for rare and cryptobenthic species, without disrupting vulnerable benthic biotas.";
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: reply, time: "Now" }]);
    }, 600);
  };

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "var(--content-bg)" }}
    >
      {/* ── TOP HERO HEADER (MATCHES DASHBOARD COMMAND & CONTROL THEME) ────────── */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#003366] font-bold uppercase">
                NCPOR &middot; ADVANCED POLAR &amp; MARINE BIO-INTELLIGENCE AI
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] border border-blue-200/80 flex items-center justify-center flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                  <span>Explore AI Features</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Advanced AI-powered tools for polar research, species identification, and ecological forecasting
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Navigation & Badges */}
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
                  onClick={() => onNavigate("otolith-lab")}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#003366] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Otolith Lab</span>
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

      {/* ── MAIN BODY CONTENT (DASHBOARD LIGHT SYSTEM) ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ===================================================================== */}
        {/* 1. THREE TOP KPI CARDS (Matching Dashboard Theme & Screenshot)         */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: AI Models */}
          <div className="bg-white rounded-2xl border border-blue-200/80 p-5 flex items-start justify-between shadow-xs transition hover:shadow-md">
            <div>
              <div className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                AI Models
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1.5">
                3
              </div>
              <div className="text-xs text-blue-600/80 font-medium mt-1">
                Available Tools
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
              {/* Brain Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <path d="M9.5 2A4.5 4.5 0 0 0 5 6.5C5 7.4 5.3 8.2 5.8 8.9A5 5 0 0 0 4 13a4.99 4.99 0 0 0 3 4.6V20a2 2 0 0 0 2 2h2v-4h-2v-2" />
                <path d="M14.5 2A4.5 4.5 0 0 1 19 6.5c0 .9-.3 1.7-.8 2.4A5 5 0 0 1 20 13a4.99 4.99 0 0 1-3 4.6V20a2 2 0 0 1-2 2h-2v-4h2v-2" />
                <path d="M12 2v20" strokeDasharray="2 2" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* Card 2: Accuracy */}
          <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 flex items-start justify-between shadow-xs transition hover:shadow-md">
            <div>
              <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                Accuracy
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1.5">
                94.7%
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                Average Confidence
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0">
              {/* Target / Bullseye Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Card 3: Processed */}
          <div className="bg-white rounded-2xl border border-blue-200/80 p-5 flex items-start justify-between shadow-xs transition hover:shadow-md">
            <div>
              <div className="text-xs font-bold text-[#003366] tracking-wider uppercase">
                Processed
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1.5">
                15.2k
              </div>
              <div className="text-xs text-blue-600 font-medium mt-1">
                Total Analyses
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003366] border border-blue-100 flex items-center justify-center flex-shrink-0">
              {/* Database / Cylinder Storage Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. SECTION TITLE & BADGE                                              */}
        {/* ===================================================================== */}
        <div className="flex items-center gap-3 pt-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            AI-Powered Features
          </h2>
          <span className="bg-blue-50 text-[#003366] border border-blue-200 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            Verified Bio-AI Models
          </span>
        </div>

        {/* ===================================================================== */}
        {/* 3. THREE FEATURE / TOOL CARDS (Clean White Dashboard System)           */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: Environmental Fish Prediction */}
          <div className="bg-white rounded-2xl border border-blue-200/90 shadow-xs hover:shadow-md hover:border-blue-400 p-6 flex flex-col justify-between transition-all duration-200 min-h-[480px]">
            <div>
              {/* Blue Trending Up Icon in Container */}
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-blue-700 mb-2">
                Environmental Fish Prediction
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                AI-powered predictive modeling for fish population dynamics based on environmental parameters
              </p>

              {/* Bullet points with blue circular dots */}
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span>Machine learning models for population forecasting</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span>Environmental parameter correlation analysis</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span>Climate change impact assessment</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span>Sustainable fishing quota recommendations</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setActiveToolModal("prediction")}
                className="w-full bg-[#003366] hover:bg-[#002244] active:scale-[0.99] text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-150 cursor-pointer shadow-xs"
              >
                <span>Launch Tool</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>

          {/* CARD 2: Fish Image Identification */}
          <div className="bg-white rounded-2xl border border-emerald-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 p-6 flex flex-col justify-between transition-all duration-200 min-h-[480px]">
            <div>
              {/* Green Camera Icon in Container */}
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-emerald-700 mb-2">
                Fish Image Identification
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Advanced computer vision system for automatic fish species identification from photographs
              </p>

              {/* Bullet points with emerald circular dots */}
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span>Real-time species classification</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span>Confidence scoring and verification</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span>Morphometric analysis and measurements</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span>Field survey integration and data logging</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2">
              <button
                type="button"
                onClick={() => setActiveToolModal("fish-id")}
                className="w-full bg-[#003366] hover:bg-[#002244] active:scale-[0.99] text-white font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-150 cursor-pointer shadow-xs"
              >
                <span>Launch Quick AI Tool</span>
                <span className="text-base">&rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("edna-lab")}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Full Polar eDNA Lab</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

          {/* CARD 3: Otolith Image Comparison */}
          <div className="bg-white rounded-2xl border border-blue-200/90 shadow-xs hover:shadow-md hover:border-blue-400 p-6 flex flex-col justify-between transition-all duration-200 min-h-[480px]">
            <div>
              {/* Blue Concentric Circles / Target Icon in Container */}
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003366] border border-blue-100 flex items-center justify-center mb-5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Polar Otolith Sclerochronology
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Computer vision analysis of polar teleost otolith micrographs for sub-zero age estimation, annuli validation, and climate proxy tracking
              </p>

              {/* Bullet points with blue circular dots */}
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>Sub-zero cryo-calcified growth ring detection</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>Antarctic & Arctic age estimation models</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>NCPOR Polar reference voucher matching</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>Von Bertalanffy growth parameters (K, L_inf)</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2">
              <button
                type="button"
                onClick={() => setActiveToolModal("otolith")}
                className="w-full bg-[#003366] hover:bg-[#002244] active:scale-[0.99] text-white font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-150 cursor-pointer shadow-xs"
              >
                <span>Launch Quick AI Tool</span>
                <span className="text-base">&rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("otolith-lab")}
                className="w-full bg-blue-50 hover:bg-blue-100 text-[#003366] border border-blue-200 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Full Polar Otolith Lab</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── FOOTER (MATCHES WEBSITE THEME) ───────────────────────────────── */}
        <div className="py-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>&copy; 2025 National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Govt of India</div>
          <div>Powered by NCPOR Polar Marine Bio-Intelligence &amp; AI Ecosystem</div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. FLOATING POLAR AI ASSISTANT WIDGET                                  */}
      {/* ===================================================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Tooltip bubble with brand navy styling */}
        <div
          onClick={() => setAiChatOpen(true)}
          className="bg-[#003366] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400/30 relative cursor-pointer hover:bg-[#002244] transition-colors max-w-xs"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0 text-cyan-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-3.5 h-3.5"
            >
              <path d="M12 2a4 4 0 0 1 4 4v2h1a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1v2a4 4 0 0 1-8 0v-2H7a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide">
              Polar Research Assistant
            </div>
            <div className="text-[11px] text-blue-200 mt-0.5">
              Click to query polar bio-models &amp; cruise telemetry
            </div>
          </div>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#003366] transform rotate-45 border-r border-b border-blue-400/30" />
        </div>

        {/* Circular Floating Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setAiChatOpen(true)}
            className="w-12 h-12 rounded-full bg-[#003366] hover:bg-[#002244] border-2 border-cyan-400/60 shadow-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 relative group"
            aria-label="Open Polar AI"
          >
            <div className="w-6 h-6 rounded-full border-2 border-cyan-300/40 border-t-cyan-400 animate-spin" />
            <span className="absolute top-1 right-2 text-cyan-300 text-[10px]">
              ✦
            </span>
          </button>
          <span className="bg-[#003366] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30 shadow-sm -mt-2 z-10">
            Polar AI
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. MODAL 1: Environmental Fish Prediction Tool                        */}
      {/* ===================================================================== */}
      {activeToolModal === "prediction" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-900 to-[#003366] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Environmental Fish Prediction Engine</h3>
                  <p className="text-xs text-blue-200">XGBoost + Bio-Oceanographic Ensemble Model (v4.2)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveToolModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Species Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Target Commercial Pelagic Species
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    { label: "Oil Sardine", sci: "Sardinella longiceps" },
                    { label: "Indian Mackerel", sci: "Rastrelliger kanagurta" },
                    { label: "Yellowfin Tuna", sci: "Thunnus albacares" },
                    { label: "Indian Scad", sci: "Decapterus russelli" },
                  ].map((sp) => (
                    <button
                      key={sp.sci}
                      onClick={() => setTargetSpecies(sp.sci)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        targetSpecies === sp.sci
                          ? "border-blue-600 bg-blue-50 text-blue-900 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <div className="font-semibold text-xs">{sp.label}</div>
                      <div className="text-[11px] italic text-slate-500 truncate">{sp.sci}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Environmental Parameter Controls */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Oceanographic Parameter Inputs
                  </span>
                  <span className="text-xs text-blue-600 font-semibold">
                    Interactive Simulation
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* SST */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                      <span>Sea Surface Temperature (SST)</span>
                      <span className="font-bold text-blue-600">{sst.toFixed(1)} °C</span>
                    </div>
                    <input
                      type="range"
                      min="24.0"
                      max="32.5"
                      step="0.1"
                      value={sst}
                      onChange={(e) => setSst(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>24.0 °C (Upwelling cold)</span>
                      <span>32.5 °C (Thermal stress)</span>
                    </div>
                  </div>

                  {/* Salinity */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                      <span>Salinity</span>
                      <span className="font-bold text-blue-600">{salinity.toFixed(1)} PSU</span>
                    </div>
                    <input
                      type="range"
                      min="30.0"
                      max="37.0"
                      step="0.1"
                      value={salinity}
                      onChange={(e) => setSalinity(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>30.0 PSU (Estuarine)</span>
                      <span>37.0 PSU (Hyper-saline)</span>
                    </div>
                  </div>

                  {/* Chlorophyll */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                      <span>Chlorophyll-a Concentration</span>
                      <span className="font-bold text-emerald-600">{chlorophyll.toFixed(2)} mg/m³</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="4.5"
                      step="0.1"
                      value={chlorophyll}
                      onChange={(e) => setChlorophyll(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0.2 mg/m³ (Oligotrophic)</span>
                      <span>4.5 mg/m³ (High Bloom)</span>
                    </div>
                  </div>

                  {/* Dissolved Oxygen */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                      <span>Dissolved Oxygen (DO)</span>
                      <span className="font-bold text-cyan-600">{dissolvedOxygen.toFixed(1)} mg/L</span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="7.0"
                      step="0.1"
                      value={dissolvedOxygen}
                      onChange={(e) => setDissolvedOxygen(parseFloat(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>2.0 mg/L (Hypoxic edge)</span>
                      <span>7.0 mg/L (Well oxygenated)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prediction Results Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="text-[11px] font-semibold text-blue-700 uppercase">
                    Predicted Biomass Catch
                  </div>
                  <div className="text-2xl font-extrabold text-blue-950 mt-1">
                    {predictedBiomass} <span className="text-xs font-medium text-blue-700">t/km²</span>
                  </div>
                  <div className="text-[11px] text-blue-600 mt-1">
                    {suitabilityScore > 75 ? "+16.4% above historical avg" : "-12.1% below historical avg"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-emerald-700 uppercase">
                    Habitat Suitability (HSI)
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-950 mt-1">
                    {suitabilityScore}%
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-1">
                    {suitabilityScore > 75 ? "Optimal Breeding & Feeding" : "Sub-optimal Environmental Stress"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200">
                  <div className="text-[11px] font-semibold text-cyan-700 uppercase">
                    Sustainable Quota Recommendation
                  </div>
                  <div className="text-2xl font-extrabold text-cyan-950 mt-1">
                    {quotaRecommendation} <span className="text-xs font-medium text-cyan-700">t/month</span>
                  </div>
                  <div className="text-[11px] text-cyan-600 mt-1 font-medium">
                    Green Tier (Safe Yield)
                  </div>
                </div>
              </div>

              {/* Forecast Trajectory Visualizer */}
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    12-Month Population Abundance Forecast Curve
                  </div>
                  <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                    95% Confidence Interval
                  </span>
                </div>

                {/* SVG Curve */}
                <div className="w-full h-36 bg-slate-50 rounded-lg p-2 flex items-center justify-center">
                  <svg viewBox="0 0 500 120" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="30" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="30" y1="60" x2="480" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="30" y1="100" x2="480" y2="100" stroke="#cbd5e1" />

                    {/* Shaded confidence band */}
                    <path
                      d="M 30 75 Q 120 40 200 25 T 340 50 T 480 70 L 480 95 Q 340 75 200 55 T 120 70 T 30 95 Z"
                      fill="#93c5fd"
                      opacity="0.35"
                    />

                    {/* Predicted curve */}
                    <path
                      d="M 30 85 Q 120 50 200 35 T 340 60 T 480 80"
                      fill="none"
                      stroke="#1d4ed8"
                      strokeWidth="3"
                    />

                    {/* Data Points */}
                    <circle cx="30" cy="85" r="3.5" fill="#1d4ed8" />
                    <circle cx="200" cy="35" r="4.5" fill="#1e3a8a" />
                    <circle cx="340" cy="60" r="3.5" fill="#1d4ed8" />
                    <circle cx="480" cy="80" r="3.5" fill="#1d4ed8" />

                    <text x="210" y="30" fontSize="10" fill="#1e3a8a" fontWeight="bold">Monsoon Peak Catch</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                MoES CMLRE Fishery Oceanography Decision Support System
              </span>
              <button
                type="button"
                onClick={() => setActiveToolModal(null)}
                className="bg-[#003366] hover:bg-[#002244] text-white font-medium text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Close Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. MODAL 2: Fish Image Identification Tool                           */}
      {/* ===================================================================== */}
      {activeToolModal === "fish-id" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-900 to-[#003366] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Fish Image Identification (AI Computer Vision)</h3>
                  <p className="text-xs text-emerald-200">YOLOv8-Marine + ResNet-101 Deep Taxonomic Pipeline</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveToolModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Select Specimen to Classify */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Field Photograph Specimen to Classify
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {FISH_SPECIMENS.map((fish) => (
                    <button
                      type="button"
                      key={fish.id}
                      onClick={() => handleScanSpecimen(fish)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedSpecimen.id === fish.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs ring-1 ring-emerald-500"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <div className="font-bold text-xs">{fish.name}</div>
                      <div className="text-[11px] italic text-slate-500">{fish.scientificName}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                        {fish.confidence}% match
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Specimen Visualizer with AI Bounding Box */}
              <div className="relative bg-slate-900 rounded-2xl p-6 overflow-hidden flex flex-col items-center justify-center min-h-[260px] border border-slate-700">
                {isScanningFish && (
                  <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-2xs flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-white tracking-widest uppercase">
                        Scanning Morphometrics...
                      </span>
                    </div>
                  </div>
                )}

                {/* SVG Fish Illustration */}
                <div className="relative w-full max-w-lg h-44 flex items-center justify-center">
                  <svg viewBox="0 0 320 120" className="w-full h-full drop-shadow-lg">
                    {/* Fish Body */}
                    <path
                      d="M 40 60 C 90 20, 200 20, 250 60 C 200 100, 90 100, 40 60 Z"
                      fill={selectedSpecimen.svgColor}
                      opacity="0.9"
                    />
                    <polygon points="40,60 10,25 20,60 10,95" fill={selectedSpecimen.svgHighlight} />
                    <polygon points="140,30 170,10 200,32" fill={selectedSpecimen.svgHighlight} opacity="0.8" />
                    <polygon points="210,65 180,85 195,65" fill={selectedSpecimen.svgHighlight} opacity="0.85" />
                    <circle cx="260" cy="54" r="5" fill="#ffffff" />
                    <circle cx="261" cy="54" r="2.5" fill="#0f172a" />
                    <path d="M 50 60 Q 150 64 250 58" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                  </svg>

                  {/* Computer Vision Bounding Box Overlay */}
                  <div className="absolute inset-2 border-2 border-emerald-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between items-start">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        {selectedSpecimen.scientificName} · {selectedSpecimen.confidence}%
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        YOLOv8 [TL: {selectedSpecimen.totalLength}]
                      </span>
                    </div>

                    {showLandmarks && (
                      <div className="flex justify-between text-[9px] text-cyan-300 font-mono">
                        <span>(x: 124, y: 58) Snout</span>
                        <span>(x: 286, y: 72) Operculum</span>
                        <span>(x: 48, y: 60) Caudal</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlay Controls */}
                <div className="w-full flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showLandmarks}
                        onChange={(e) => setShowLandmarks(e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                      <span>Show Morphometric Landmarks</span>
                    </label>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Model Latency: 24ms (TensorRT)
                  </span>
                </div>
              </div>

              {/* Taxonomic & Biological Details Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Taxonomic Classification
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Common Name: </span>
                    <span className="font-bold text-slate-900">{selectedSpecimen.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Scientific Name: </span>
                    <span className="font-bold italic text-emerald-700">{selectedSpecimen.scientificName}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Family: </span>
                    <span className="font-medium text-slate-800">{selectedSpecimen.family}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">IUCN Status: </span>
                    <span className="font-semibold text-blue-700">{selectedSpecimen.status}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Automated Morphometrics
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Length (TL):</span>
                    <span className="font-bold text-slate-900">{selectedSpecimen.totalLength}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Maximum Body Depth:</span>
                    <span className="font-bold text-slate-900">{selectedSpecimen.bodyDepth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Habitat Depth:</span>
                    <span className="font-medium text-slate-800">{selectedSpecimen.habitat}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Model Confidence:</span>
                    <span className="font-extrabold text-emerald-600">{selectedSpecimen.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {loggedToRepository ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Specimen Logged to CMLRE National Repository
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  Ready to commit taxonomy observation to central bio-database
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveToolModal(null);
                    onNavigate?.("edna-lab");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open Dedicated Polar eDNA Lab</span>
                  <span>&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoggedToRepository(true)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Log to Repository
                </button>
                <button
                  type="button"
                  onClick={() => setActiveToolModal(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs px-3.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Close Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. MODAL 3: Otolith Image Comparison & Age Determination Tool         */}
      {/* ===================================================================== */}
      {activeToolModal === "otolith" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0c1e3c] to-[#003366] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Otolith Image Comparison & Age Determination</h3>
                  <p className="text-xs text-blue-200">High-Resolution Annuli Detection & Growth Modeling</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveToolModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Specimen Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Polar Teleost Otolith Micrograph Voucher
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {OTOLITH_SPECIMENS.map((oto) => (
                    <button
                      type="button"
                      key={oto.id}
                      onClick={() => setSelectedOtolith(oto)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex gap-3 items-center ${
                        selectedOtolith.id === oto.id
                          ? "border-[#003366] bg-blue-50 text-slate-900 shadow-2xs ring-1 ring-[#003366]"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <img
                        src={oto.image}
                        alt={oto.species}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs truncate">{oto.species}</div>
                        <div className="text-[11px] italic text-slate-500 truncate">{oto.scientificName}</div>
                        <div className="text-[10px] text-blue-700 font-medium mt-1">
                          {oto.region} · {oto.rings} Annuli
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Otolith Micrograph Viewer with Real Polar Micrograph */}
              <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center">
                <div className="w-full max-w-lg h-60 relative rounded-xl overflow-hidden border border-slate-700/60 flex items-center justify-center bg-black">
                  <img
                    src={selectedOtolith.image}
                    alt={selectedOtolith.species}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* SVG Overlays on top of the actual polar micrograph */}
                  <svg
                    viewBox="0 0 400 240"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    {showAnnuliRings && (
                      <g>
                        <ellipse cx="200" cy="120" rx="45" ry="30" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 3" opacity="0.85" />
                        <ellipse cx="200" cy="120" rx="80" ry="50" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="5 3" opacity="0.85" />
                        <ellipse cx="200" cy="120" rx="120" ry="75" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 3" opacity="0.85" />
                        {selectedOtolith.rings >= 8 && (
                          <>
                            <ellipse cx="200" cy="120" rx="155" ry="95" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="7 3" opacity="0.85" />
                            <ellipse cx="200" cy="120" rx="180" ry="110" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8 3" opacity="0.85" />
                          </>
                        )}
                      </g>
                    )}

                    {showNucleusCore && (
                      <g>
                        <circle cx="200" cy="120" r="6" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="210" y="115" fontSize="10" fill="#fef08a" fontWeight="bold">Primordium Core</text>
                      </g>
                    )}

                    {showTransectAxis && (
                      <g>
                        <line x1="200" y1="120" x2="360" y2="45" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                        <text x="310" y="38" fontSize="9" fill="#7dd3fc" fontFamily="monospace">Dorsal R/O Axis</text>
                      </g>
                    )}
                  </svg>

                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-white/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>POLARIZED MICROSCOPY · 40x</span>
                  </div>

                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-cyan-300 text-[10px] font-mono px-2 py-1 rounded border border-white/20">
                    {selectedOtolith.region} · {selectedOtolith.waterTemp}
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                    Voucher: {selectedOtolith.voucherId}
                  </div>
                </div>

                {/* Display Toggles */}
                <div className="w-full flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showAnnuliRings}
                        onChange={(e) => setShowAnnuliRings(e.target.checked)}
                        className="rounded accent-[#003366]"
                      />
                      <span>Annuli Rings</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showNucleusCore}
                        onChange={(e) => setShowNucleusCore(e.target.checked)}
                        className="rounded accent-[#003366]"
                      />
                      <span>Primordium Core</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showTransectAxis}
                        onChange={(e) => setShowTransectAxis(e.target.checked)}
                        className="rounded accent-[#003366]"
                      />
                      <span>R/O Reading Axis</span>
                    </label>
                  </div>

                  <span className="text-[11px] text-cyan-400 font-mono">
                    Match Confidence: {selectedOtolith.matchScore}%
                  </span>
                </div>
              </div>

              {/* Analysis Results Panel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="text-[10px] font-semibold text-[#003366] uppercase">
                    Detected Annuli
                  </div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {selectedOtolith.rings} Rings
                  </div>
                  <div className="text-[11px] text-blue-600 mt-0.5">
                    Opaque + Translucent
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-semibold text-slate-600 uppercase">
                    Estimated Age
                  </div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {selectedOtolith.estimatedAge}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Von Bertalanffy Model
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-semibold text-slate-600 uppercase">
                    Polar Provenance
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {selectedOtolith.region}
                  </div>
                  <div className="text-[11px] text-cyan-700 mt-0.5 font-medium">
                    Ambient: {selectedOtolith.waterTemp}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-semibold text-slate-600 uppercase">
                    Growth Rate
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {selectedOtolith.growthK}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Sub-zero Cryo Model
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {otolithExported ? (
                <span className="text-xs font-bold text-[#003366] flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5 text-emerald-600">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Polar Otolith Age Certificate Generated &amp; Downloaded
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  NCPOR Polar Marine Teleost Sclerochronology &amp; Biochronology Lab
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveToolModal(null);
                    onNavigate?.("otolith-lab");
                  }}
                  className="bg-[#003366] hover:bg-[#002244] text-white font-medium text-xs px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open Dedicated Polar Otolith Lab</span>
                  <span>&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOtolithExported(true)}
                  className="bg-[#0c1e3c] hover:bg-[#08152a] text-white font-medium text-xs px-3.5 py-2.5 rounded-xl cursor-pointer border border-slate-700/50"
                >
                  Export Certificate
                </button>
                <button
                  type="button"
                  onClick={() => setActiveToolModal(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs px-3.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8. MARINE AI ASSISTANT CHAT DRAWER / MODAL                            */}
      {/* ===================================================================== */}
      {aiChatOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between">
            {/* Chat Drawer Header */}
            <div className="p-4 bg-[#003366] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path d="M12 2a4 4 0 0 1 4 4v2h1a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1v2a4 4 0 0 1-8 0v-2H7a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold">Polar Research AI Assistant</h3>
                  <p className="text-[10px] text-blue-200">NCPOR &amp; MoES Polar Knowledge Intelligence</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiChatOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close assistant"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Sample Questions */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Recommended Queries
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "How does SST rise affect Oil Sardine migration?",
                  "Explain otolith daily increments vs annual rings.",
                  "What triggers high Chlorophyll-a in Arabian Sea?",
                ].map((q, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSendChat(q)}
                    className="text-[11px] bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full transition text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#003366] text-white rounded-br-2xs"
                        : "bg-slate-100 text-slate-800 border border-slate-200/80 rounded-bl-2xs"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        msg.sender === "user" ? "text-blue-200 text-right" : "text-slate-400"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Field */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendChat();
                }}
                placeholder="Ask about fish prediction, otoliths, or cruises..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => handleSendChat()}
                className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shadow-xs"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
