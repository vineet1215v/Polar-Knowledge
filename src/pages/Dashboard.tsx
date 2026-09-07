import { useState, useEffect } from "react";
import { newsItems, events, expeditions, publications, datasets } from "../data";
import type { WorkspaceSource } from "../workspaceStore";
import { gameStore } from "../gameStore";
import DashboardPolarMap from "../components/DashboardPolarMap";

interface Props {
  onNavigate: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}

// ── Toast Notification ─────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-blue-500/30 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <span className="text-emerald-400 text-sm font-bold">OK</span>
      <span className="text-xs font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white text-xs">x</button>
    </div>
  );
}

// ── Station Telemetry Data ─────────────────────────────────────
interface StationData {
  id: string;
  name: string;
  region: "Antarctica" | "Arctic";
  location: string;
  coordinates: string;
  elevation: string;
  temp: number;
  windSpeed: number;
  windDir: string;
  pressure: number;
  humidity: number;
  iceThickness: string;
  winteroverCrew: number;
  status: string;
  activeSensors: string[];
  bannerImage: string;
  tourId?: number;
}

const stations: StationData[] = [
  {
    id: "maitri",
    name: "Maitri Station",
    region: "Antarctica",
    location: "Schirmacher Oasis, Dronning Maud Land",
    coordinates: "70°45'58\"S, 11°43'56\"E",
    elevation: "117 m a.s.l.",
    temp: -18.4,
    windSpeed: 34,
    windDir: "ESE",
    pressure: 986.2,
    humidity: 58,
    iceThickness: "1.85 m (Priyardarshini Lake)",
    winteroverCrew: 24,
    status: "Operational · High-Latitude Meteorological Sampling",
    activeSensors: ["Fluxgate Magnetometer", "Ozone Spectrophotometer", "Seismic Array", "Campbell Weather Mast"],
    bannerImage: "https://images.unsplash.com/photo-1766465405501-ab1cce22d097?w=800&q=80",
    tourId: 12,
  },
  {
    id: "bharati",
    name: "Bharati Station",
    region: "Antarctica",
    location: "Larsemann Hills, Prydz Bay",
    coordinates: "69°24'28\"S, 76°11'14\"E",
    elevation: "35 m a.s.l.",
    temp: -12.1,
    windSpeed: 28,
    windDir: "ENE",
    pressure: 992.8,
    humidity: 64,
    iceThickness: "2.30 m (Fast Ice)",
    winteroverCrew: 22,
    status: "Optimal · Real-time Cartosat Ground Station Tracking",
    activeSensors: ["X-Band Tracking Radome", "Microbial Incubator", "Deep Sea CTD", "Aerosol LIDAR"],
    bannerImage: "https://images.unsplash.com/photo-1687904368738-ca6423635666?w=800&q=80",
    tourId: 13,
  },
  {
    id: "himadri",
    name: "Himadri Station",
    region: "Arctic",
    location: "Ny-Ålesund, Spitsbergen, Svalbard",
    coordinates: "78°55'N, 11°56'E",
    elevation: "12 m a.s.l.",
    temp: -4.8,
    windSpeed: 16,
    windDir: "NNW",
    pressure: 1004.5,
    humidity: 78,
    iceThickness: "0.85 m (Glacial Outwash)",
    winteroverCrew: 8,
    status: "Active · Kongsfjorden Atmospheric & Aerosol Chemistry",
    activeSensors: ["Sun Photometer", "Black Carbon Monitor", "Snow Sampling Station", "Aura Satellite Collocation"],
    bannerImage: "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=800&q=80",
  },
  {
    id: "indarc",
    name: "IndARC Subsurface Mooring",
    region: "Arctic",
    location: "Kongsfjorden Fjord, Svalbard",
    coordinates: "79°00'N, 12°00'E",
    elevation: "192 m below sea level",
    temp: -1.2,
    windSpeed: 0,
    windDir: "Current 0.38 m/s",
    pressure: 1020.1,
    humidity: 100,
    iceThickness: "Open Fjord / Frazil Ice",
    winteroverCrew: 0,
    status: "Submerged · Autonomous High-Frequency Fjord Profiling",
    activeSensors: ["Acoustic Doppler Current Profiler", "Seabird CTD Probe", "Fluorometer", "Turbidity Sensor"],
    bannerImage: "https://images.unsplash.com/photo-1462888387064-2a2ea232edb8?w=800&q=80",
  },
];

// ── Featured Indian Polar Expeditions ──────────────────────────
const featuredExpeditions = [
  {
    id: 1,
    title: "46th Indian Antarctic Expedition (2024–2025)",
    shortName: "46th IAE",
    region: "Antarctica",
    location: "Maitri & Bharati Stations",
    status: "Active",
    statusBadge: "Active · Field Phase",
    dates: "Nov 2024 – Mar 2025",
    crew: "48 Field Scientists",
    lead: "National Centre for Polar and Ocean Research (NCPOR)",
    summary: "Deep firn ice coring, Priyadarshini lake limnology, Cartosat-3 satellite ground truthing, and high-latitude meteorological observations.",
    stats: { days: "120 Days", data: "21 Datasets", pubs: "12 Papers" },
    image: "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=600&q=80",
    tags: ["Glaciology", "Atmospheric Chemistry", "Lake Limnology"],
  },
  {
    id: 7,
    title: "Indian Arctic Expedition (Himadri, Svalbard)",
    shortName: "Arctic Svalbard",
    region: "Arctic",
    location: "Ny-Ålesund, Spitsbergen (78°55'N)",
    status: "Active",
    statusBadge: "Operational · Year-Round",
    dates: "Continuous Monitoring 2024",
    crew: "14 Rotating Researchers",
    lead: "NCPOR Arctic Research Group",
    summary: "Kongsfjorden fjord atmospheric aerosol profiling, black carbon radiative forcing, fjord warming dynamics, and microbial cryopreservation.",
    stats: { days: "365 Days/Yr", data: "9 Datasets", pubs: "6 Publications" },
    image: "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=600&q=80",
    tags: ["Aerosols", "Kongsfjorden Fjord", "Microbial Genomics"],
  },
  {
    id: 3,
    title: "Southern Ocean Oceanographic Cruise (MV Sagar Nidhi)",
    shortName: "MV Sagar Nidhi",
    region: "Southern Ocean",
    location: "Prydz Bay & Enderby Basin",
    status: "Active",
    statusBadge: "Underway · 11.2 Knots",
    dates: "Dec 2024 – Feb 2025",
    crew: "28 Marine Oceanographers",
    lead: "Ministry of Earth Sciences (MoES)",
    summary: "Conducting 40 hydrographic CTD rosette casts, measuring Antarctic Circumpolar Current transport rates, and sampling carbon sequestration.",
    stats: { days: "60 Days at Sea", data: "16 NetCDF Sets", pubs: "11 Papers" },
    image: "https://images.unsplash.com/photo-1672570289260-d430df31d893?w=600&q=80",
    tags: ["Oceanography", "Carbon Cycle", "Circumpolar Current"],
  },
  {
    id: 9,
    title: "IndARC Subsurface Mooring Observatory",
    shortName: "IndARC Observatory",
    region: "Arctic Fjord",
    location: "Kongsfjorden Fjord (192m depth)",
    status: "Active",
    statusBadge: "Submerged · Autonomous",
    dates: "Deployed 2014 – Present",
    crew: "Autonomous Acoustic Array",
    lead: "NCPOR Polar Oceanography",
    summary: "India's first multi-sensor underwater observatory recording salinity, current velocities, temperature, and Atlantic water inflow pulses.",
    stats: { days: "10 Yrs Deployed", data: "Real-Time ADCP", pubs: "14 Publications" },
    image: "https://images.unsplash.com/photo-1462888387064-2a2ea232edb8?w=600&q=80",
    tags: ["Underwater Mooring", "CTD Telemetry", "Deep Fjord"],
  },
];

// ── Landmark Scientific Discoveries ────────────────────────────
const landmarkDiscoveries = [
  {
    id: 101,
    title: "Decadal Sea Ice Retreat & Polynya Expansion in Prydz Bay",
    journal: "Journal of Glaciology",
    year: 2024,
    doi: "10.1017/jog.2024.001",
    lead: "Dr. A. Sharma, Dr. R. Kumar et al. (NCPOR Glaciology)",
    summary: "Satellite SAR analysis revealed unprecedented early winter sea ice retreat rates, driving intense air-sea heat exchange near Bharati Station.",
    impact: "High Impact · Cited in IPCC Assessment Report",
    badge: "Climate Breakthrough",
    image: "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=600&q=80",
    datasetLink: "2.1 GB NetCDF Open Data",
  },
  {
    id: 102,
    title: "Novel Cryophilic Enzymes Isolated from Priyadarshini Lake",
    journal: "Polar Biology",
    year: 2023,
    doi: "10.1007/s00300-023-3100-2",
    lead: "Dr. K. Mehta, Dr. T. Rao et al. (NCPOR Biotechnology)",
    summary: "Discovered psychrophilic Antarctic bacteria synthesizing cold-active proteases and bio-preservative enzymes operating efficiently at sub-zero temperatures.",
    impact: "Biotechnology Patent Filed · 4 Indexed Genomes",
    badge: "Biological Discovery",
    image: "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=600&q=80",
    datasetLink: "NCBI GenBank Indexed",
  },
  {
    id: 103,
    title: "12-Year Glacial Mass Balance Trends at Schirmacher Oasis",
    journal: "Annals of Glaciology",
    year: 2023,
    doi: "10.1017/aog.2022.15",
    lead: "Dr. D. Nair, Dr. J. Pillai et al. (Maitri Science Unit)",
    summary: "Continuous ground-penetrating radar profiling documented localized ice stabilization around Maitri oasis bedrock ridges despite regional warming.",
    impact: "Benchmark 2010–2022 Long-Term Polar Dataset",
    badge: "Glaciology Benchmark",
    image: "https://images.unsplash.com/photo-1687904368738-ca6423635666?w=600&q=80",
    datasetLink: "850 MB CSV/HDF5 Records",
  },
  {
    id: 104,
    title: "Atlantic Water Ingress & Fjord Heat Budget from IndARC Mooring",
    journal: "Climate Dynamics",
    year: 2024,
    doi: "10.1007/s00382-022-06123-5",
    lead: "Dr. S. Iyer, Dr. M. Das et al. (Arctic Oceanography Team)",
    summary: "Autonomous underwater profiler recorded seasonal pulses of warm transformed Atlantic water altering high-latitude Arctic salinity and marine ecosystems.",
    impact: "Continuous Timeseries from India's 1st Arctic Mooring",
    badge: "Oceanographic First",
    image: "https://images.unsplash.com/photo-1766699623469-32a2c3b17a17?w=600&q=80",
    datasetLink: "1.4 GB CTD Acoustic Profiles",
  },
];

export default function Dashboard({ onNavigate, onAddToWorkspace }: Props) {
  // State
  const [activeStationId, setActiveStationId] = useState("maitri");
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Featured Science Showcase Tab
  const [featureTab, setFeatureTab] = useState<"expeditions" | "discoveries">("expeditions");

  // KPI Filter
  const [kpiTimeframe, setKpiTimeframe] = useState<"all" | "season" | "trend">("all");
  const [kpiModal, setKpiModal] = useState<{ title: string; desc: string; breakdown: { label: string; count: string; pct: number }[] } | null>(null);

  const showToast = (msg: string) => setToastMessage(msg);

  const activeStation = stations.find(s => s.id === activeStationId) || stations[0];

  // Handle Station Switch + XP
  const handleStationSwitch = (stId: string) => {
    setActiveStationId(stId);
    const target = stations.find(s => s.id === stId);
    showToast(`Switched station telemetry to ${target?.name}`);
    gameStore.addXP(25, "Station Telemetry Inspected", 5);
    gameStore.completeQuest("q_weather");
  };

  // Save Expedition to Workspace + XP
  const handleSaveExpedition = (exp: typeof featuredExpeditions[0]) => {
    if (onAddToWorkspace) {
      onAddToWorkspace({
        id: `exp-${exp.id}`,
        type: "expedition",
        title: exp.title,
        meta: `${exp.region} · ${exp.dates}`,
        origin: "Featured Polar Missions",
      });
      gameStore.addXP(30, "Saved Expedition Mission to Workspace", 8);
      showToast(`Saved "${exp.title}" to Workspace! (+30 XP )`);
    }
  };

  // Save Discovery to Workspace + XP
  const handleSaveDiscovery = (disc: typeof landmarkDiscoveries[0]) => {
    if (onAddToWorkspace) {
      onAddToWorkspace({
        id: `disc-${disc.id}`,
        type: "publication",
        title: disc.title,
        meta: `${disc.journal} · ${disc.year} · ${disc.lead}`,
        origin: "Landmark Discoveries",
      });
      gameStore.addXP(30, "Saved Discovery to Workspace", 8);
      showToast(`Saved "${disc.title}" to Workspace! (+30 XP )`);
    }
  };

  // Dynamic KPI numbers
  const kpiData = {
    all: { exp: "44", pub: "1,248", data: "364", media: "5,120", expTrend: "+2 in 2024", pubTrend: "+18%", dataTrend: "+24%", mediaTrend: "+35%" },
    season: { exp: "3", pub: "86", data: "42", media: "640", expTrend: "Active 44th IAE", pubTrend: "+28% vs 2023", dataTrend: "Real-time", mediaTrend: "12 4K Reels" },
    trend: { exp: "18", pub: "460", data: "185", media: "2,400", expTrend: "5-Yr High", pubTrend: "+42%", dataTrend: "Open-Access", mediaTrend: "360 VR Added" },
  }[kpiTimeframe];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* ── TOP HERO: STATION OPERATIONS COMMAND CENTER ──────────────────────── */}
      <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-25 scale-105"
          style={{ backgroundImage: `url(${activeStation.bannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />

        <div className="relative p-6 sm:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Hero Left Intro */}
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
                NCPOR POLAR KNOWLEDGE COMMAND & TELEMETRY
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              India's Polar Science & Expedition Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore live observatory telemetry, 44 scientific expeditions, thousands of peer-reviewed datasets, and generative research intelligence.
            </p>

            {/* Quick Action Chips & Gaming Launcher */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onNavigate("education")}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Launch Gaming Academy (+XP)</span>
              </button>
              <button
                onClick={() => onNavigate("expeditions")}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Explore Expeditions →</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("media");
                  gameStore.addXP(40, "Station 360° Virtual Tour Inspected", 10);
                  gameStore.completeQuest("q_tour");
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-xs transition-colors flex items-center gap-1.5"
              >
                <span>⊙</span> 360° Virtual Tours
              </button>
            </div>
          </div>

          {/* Hero Right: Interactive Station Telemetry Card */}
          <div className="lg:w-96 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/15 p-4 shadow-2xl flex flex-col gap-3">
            {/* Station Switcher Tabs */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              {stations.map(st => (
                <button
                  key={st.id}
                  onClick={() => handleStationSwitch(st.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all truncate ${st.id === activeStationId ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-white"}`}
                >
                  {st.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Active Station Banner */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white">{activeStation.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono">{activeStation.region}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{activeStation.coordinates}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setStationModalOpen(true)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-xs"
                >
                  Live Telemetry →
                </button>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5 text-center">
              <div className="p-1">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Temp</div>
                <div className="text-lg font-bold font-mono text-cyan-300">{activeStation.temp > 0 ? `+${activeStation.temp}` : activeStation.temp}°C</div>
              </div>
              <div className="p-1 border-x border-white/10">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Wind</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">{activeStation.windSpeed} km/h</div>
                <div className="text-[9px] text-slate-400">{activeStation.windDir}</div>
              </div>
              <div className="p-1">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Ice / Depth</div>
                <div className="text-xs font-bold text-emerald-400 mt-1 truncate">{activeStation.iceThickness.split(" ")[0]} m</div>
              </div>
            </div>

            {/* Station Status Ticker */}
            <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"/>
                <span className="truncate">{activeStation.status.split("·")[0]}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                 {activeStation.winteroverCrew} Winterover
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* ── GAMING CALLOUT BANNER (Matches Portal Theme) ────────────────── */}


        {/* ── INTERACTIVE TIMEFRAME KPI METRICS ───────────────────────────────── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">National Polar Repository At A Glance</h2>
              <p className="text-xs text-slate-500">Live indexed research records across Indian Antarctic & Arctic programmes.</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs w-fit">
              {[["all", "All-Time Records"], ["season", "2024 Active Season"], ["trend", "5-Year Trajectory"]].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setKpiTimeframe(key as any);
                    showToast(`Metrics updated for ${label}`);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${kpiTimeframe === key ? "bg-white text-blue-700 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div
              className="kpi-card cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
              onClick={() => setKpiModal({
                title: "Expedition Logistics Breakdown",
                desc: "44 Scientific expeditions coordinated by NCPOR from 1981 to present.",
                breakdown: [
                  { label: "Indian Antarctic Expeditions (IAE)", count: "44", pct: 78 },
                  { label: "Arctic Research Expeditions (Svalbard)", count: "16", pct: 45 },
                  { label: "Southern Ocean Scientific Cruises", count: "12", pct: 32 },
                  { label: "Special Ice Drilling Missions", count: "8", pct: 20 },
                ],
              })}
            >
              <div className="flex items-start justify-between">
                <div className="kpi-label">Expeditions</div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform border border-blue-200/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polygon points="12 2 19 21 12 17 5 21 12 2" />
                  </svg>
                </div>
              </div>
              <div className="kpi-value text-slate-900">{kpiData.exp}</div>
              <div className="flex items-center justify-between">
                <span className="kpi-trend-up">↑ {kpiData.expTrend}</span>
                <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">Deep Dive →</span>
              </div>
            </div>

            <div
              className="kpi-card cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
              onClick={() => setKpiModal({
                title: "Research Publication Indices",
                desc: "Peer-reviewed papers in high-impact international cryosphere journals.",
                breakdown: [
                  { label: "Nature, Science & Cell Press", count: "84 papers", pct: 60 },
                  { label: "Geophysical Research Letters (AGU)", count: "210 papers", pct: 85 },
                  { label: "Cryosphere & Glaciology Journals", count: "480 papers", pct: 95 },
                  { label: "Open Access Full-Text Available", count: "98% compliance", pct: 98 },
                ],
              })}
            >
              <div className="flex items-start justify-between">
                <div className="kpi-label">Publications</div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform border border-emerald-200/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              </div>
              <div className="kpi-value text-slate-900">{kpiData.pub}</div>
              <div className="flex items-center justify-between">
                <span className="kpi-trend-up text-emerald-600">↑ {kpiData.pubTrend}</span>
                <span className="text-[10px] text-emerald-600 font-semibold group-hover:underline">Deep Dive →</span>
              </div>
            </div>

            <div
              className="kpi-card cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group"
              onClick={() => setKpiModal({
                title: "Polar Scientific Datasets",
                desc: "Standardized NetCDF, GeoTIFF, and tabular datasets hosted on NCPOR repository.",
                breakdown: [
                  { label: "Glaciology & Ice Core Chemistry", count: "128 datasets", pct: 75 },
                  { label: "Southern Ocean CTD & Biogeochemistry", count: "96 datasets", pct: 60 },
                  { label: "Atmospheric & Magnetosphere Radar", count: "82 datasets", pct: 50 },
                  { label: "Satellite Remote Sensing Derived", count: "58 datasets", pct: 40 },
                ],
              })}
            >
              <div className="flex items-start justify-between">
                <div className="kpi-label">Open Datasets</div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform border border-purple-200/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                </div>
              </div>
              <div className="kpi-value text-slate-900">{kpiData.data}</div>
              <div className="flex items-center justify-between">
                <span className="kpi-trend-up text-purple-600">↑ {kpiData.dataTrend}</span>
                <span className="text-[10px] text-purple-600 font-semibold group-hover:underline">Deep Dive →</span>
              </div>
            </div>

            <div
              className="kpi-card cursor-pointer hover:border-amber-300 hover:shadow-md transition-all group"
              onClick={() => setKpiModal({
                title: "Media & Virtual Reality Archive",
                desc: "Visual scientific archive covering stations, wildlife, icebreakers, and operations.",
                breakdown: [
                  { label: "Ultra-HD Expedition Photos", count: "4,200 assets", pct: 85 },
                  { label: "Scientific Video Documentaries", count: "480 clips", pct: 45 },
                  { label: "Interactive 360° Virtual Tours", count: "160 nodes", pct: 30 },
                  { label: "Historical 1980s Archival Film", count: "280 scans", pct: 25 },
                ],
              })}
            >
              <div className="flex items-start justify-between">
                <div className="kpi-label">Media & 360° Tours</div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform border border-amber-200/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                    <line x1="7" y1="2" x2="7" y2="22" />
                    <line x1="17" y1="2" x2="17" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="2" y1="7" x2="7" y2="7" />
                    <line x1="2" y1="17" x2="7" y2="17" />
                    <line x1="17" y1="17" x2="22" y2="17" />
                    <line x1="17" y1="7" x2="22" y2="7" />
                  </svg>
                </div>
              </div>
              <div className="kpi-value text-slate-900">{kpiData.media}</div>
              <div className="flex items-center justify-between">
                <span className="kpi-trend-up text-amber-600">↑ {kpiData.mediaTrend}</span>
                <span className="text-[10px] text-amber-600 font-semibold group-hover:underline">Deep Dive →</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE POLAR OPERATIONS MAP (REALISTIC LEAFLET ENGINE) ─────── */}
        <DashboardPolarMap onNavigate={onNavigate} onToast={showToast} />

        {/* ── FEATURED POLAR EXPEDITIONS & LANDMARK DISCOVERIES ─────────────── */}
        <div className="card p-5 rounded-2xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">National Science Highlights</span>
                <span className="text-xs text-slate-500">· Flagship Indian polar missions & breakthrough discoveries</span>
              </div>
              <h3 className="font-bold text-base text-slate-900">Featured Expeditions & Landmark Discoveries</h3>
            </div>

            {/* View Selector Tabs (Portal theme) */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFeatureTab("expeditions")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  featureTab === "expeditions" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span></span>
                <span>Active Expeditions (4)</span>
              </button>
              <button
                onClick={() => setFeatureTab("discoveries")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  featureTab === "discoveries" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span></span>
                <span>Landmark Discoveries (4)</span>
              </button>
            </div>
          </div>

          {featureTab === "expeditions" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredExpeditions.map(exp => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            {exp.region}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                            {exp.statusBadge}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                          {exp.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                           {exp.location} ·  {exp.dates}
                        </div>
                      </div>
                      <img
                        src={exp.image}
                        alt={exp.shortName}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-2xs border border-slate-200"
                      />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {exp.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {exp.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-white rounded-lg border border-slate-100 text-center text-xs mb-3">
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">{exp.stats.days}</div>
                        <div className="text-[9px] text-slate-400">Duration</div>
                      </div>
                      <div className="border-x border-slate-100">
                        <div className="font-bold text-blue-600 text-[11px]">{exp.stats.data}</div>
                        <div className="text-[9px] text-slate-400">Indexed Data</div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">{exp.stats.pubs}</div>
                        <div className="text-[9px] text-slate-400">Publications</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 gap-2">
                    <button
                      onClick={() => onNavigate("expeditions")}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <span>Explore Voyage Log</span> →
                    </button>
                    <button
                      onClick={() => handleSaveExpedition(exp)}
                      className="btn-outline btn-sm text-[11px] py-1 px-2.5"
                    >
                      + Save to Workspace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {landmarkDiscoveries.map(disc => (
                <div
                  key={disc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {disc.badge}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {disc.year} · {disc.journal}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                          {disc.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                           {disc.lead}
                        </div>
                      </div>
                      <img
                        src={disc.image}
                        alt={disc.badge}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-2xs border border-slate-200"
                      />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {disc.summary}
                    </p>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-100 text-xs mb-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Scientific Impact:</span>
                        <span className="font-bold text-emerald-700">{disc.impact}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Associated Open Data:</span>
                        <span className="font-mono text-blue-600 font-semibold">{disc.datasetLink}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 gap-2">
                    <button
                      onClick={() => onNavigate("publications")}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <span>Read Publication</span> →
                    </button>
                    <button
                      onClick={() => handleSaveDiscovery(disc)}
                      className="btn-outline btn-sm text-[11px] py-1 px-2.5"
                    >
                      + Save to Workspace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── REAL-TIME KNOWLEDGE PULSE & UPDATES ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">Expedition News & Bulletins</h3>
              <button className="text-xs text-blue-600 hover:underline font-medium" onClick={() => onNavigate("news")}>
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {newsItems.slice(0, 3).map(n => (
                <div
                  key={n.id}
                  onClick={() => onNavigate("news")}
                  className="flex items-start gap-3 cursor-pointer group p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <img src={n.thumb} alt={n.title} className="w-14 h-12 object-cover rounded-lg flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform"/>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                      {n.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{n.date} · {n.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">Upcoming Events & Deadlines</h3>
              <button className="text-xs text-blue-600 hover:underline font-medium" onClick={() => onNavigate("events")}>
                View All →
              </button>
            </div>
            <div className="space-y-2.5">
              {events.filter(e => e.type === "upcoming").slice(0, 3).map(ev => (
                <div key={ev.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                  <div className="text-center w-10 flex-shrink-0 bg-white p-1 rounded-lg border border-slate-200">
                    <div className="text-base font-black text-blue-700 leading-none">{ev.day}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">{ev.month}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800 leading-tight">{ev.title}</div>
                    <div className="text-[10px] text-slate-500 truncate">{ev.location}</div>
                  </div>
                  <button
                    onClick={() => onNavigate("events")}
                    className="px-2 py-1 text-[10px] rounded bg-white border border-slate-200 font-semibold hover:bg-slate-100"
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-slate-900">Media & 360° VR Showcase</h3>
                <button className="text-xs text-blue-600 hover:underline font-medium" onClick={() => onNavigate("media")}>
                  Full Gallery →
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">Immersive virtual tours inside Maitri & Bharati stations.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { title: "Maitri Station 360°", img: "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=400&q=80", tag: "360° VR" },
                { title: "Bharati Station 360°", img: "https://images.unsplash.com/photo-1687904368738-ca6423635666?w=400&q=80", tag: "360° VR" },
                { title: "45th IAE Documentary", img: "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=400&q=80", tag: "Video" },
                { title: "Emperor Penguin Colony", img: "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=400&q=80", tag: "Photo" },
              ].map((m, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onNavigate("media");
                    gameStore.addXP(40, "Explored 360 Station Node", 10);
                    gameStore.completeQuest("q_tour");
                  }}
                  className="relative h-20 rounded-xl overflow-hidden cursor-pointer group border border-slate-200 shadow-2xs"
                >
                  <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"/>
                  <span className="absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.2 rounded bg-black/60 text-white backdrop-blur-xs">
                    {m.tag}
                  </span>
                  <span className="absolute bottom-1.5 inset-x-1.5 text-[10px] font-semibold text-white truncate drop-shadow-sm">
                    {m.title}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                onNavigate("media");
                gameStore.addXP(40, "Launched 360 VR Station Tour", 10);
                gameStore.completeQuest("q_tour");
              }}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>⊙</span> Launch Virtual VR Tours →
            </button>
          </div>
        </div>
      </div>

      {/* ── MODALS ───────────────────────────────────────────────────────────── */}
      {stationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" onClick={() => setStationModalOpen(false)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="relative h-44 bg-slate-950">
              <img src={activeStation.bannerImage} alt={activeStation.name} className="w-full h-full object-cover opacity-80"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">{activeStation.region} Research Station</span>
                <h3 className="text-xl font-bold">{activeStation.name}</h3>
                <div className="text-xs text-slate-300">{activeStation.coordinates} · {activeStation.elevation}</div>
              </div>
              <button
                onClick={() => setStationModalOpen(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center text-xs"
              >
                x
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Surface Temp</div>
                  <div className="text-base font-bold text-cyan-600 font-mono">{activeStation.temp}°C</div>
                </div>
                <div className="border-x border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">Barometric</div>
                  <div className="text-base font-bold text-slate-800 font-mono">{activeStation.pressure} hPa</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Winterover</div>
                  <div className="text-base font-bold text-emerald-600 font-mono">{activeStation.winteroverCrew} Crew</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Active Instrumentation & Sensors</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {activeStation.activeSensors.map(s => (
                    <div key={s} className="p-2 rounded-lg bg-blue-50/60 text-slate-800 font-medium flex items-center gap-1.5 border border-blue-100">
                      <span></span> {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-600 leading-relaxed">
                <strong>Operational Scope:</strong> {activeStation.status}. Station maintains triple-redundant satellite communication links to NCPOR Goa.
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setStationModalOpen(false);
                    onNavigate("media");
                    gameStore.addXP(50, "Launched 360 Station VR Tour", 15);
                    gameStore.completeQuest("q_tour");
                    showToast(`Launching ${activeStation.name} 360° Virtual Tour (+50 XP)`);
                  }}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  ⊙ Launch 360° Virtual Tour
                </button>
                <button
                  onClick={() => {
                    setStationModalOpen(false);
                    onNavigate("expeditions");
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 text-xs"
                >
                  Expedition History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {kpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" onClick={() => setKpiModal(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 animate-in fade-in zoom-in-95 text-xs space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600">Metric Deep-Dive</span>
                <h3 className="font-bold text-base text-slate-900">{kpiModal.title}</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">{kpiModal.desc}</p>
              </div>
              <button onClick={() => setKpiModal(null)} className="text-slate-400 hover:text-slate-600">x</button>
            </div>

            <div className="space-y-3">
              {kpiModal.breakdown.map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.pct}%` }}/>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button onClick={() => setKpiModal(null)} className="btn-primary btn-sm">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
