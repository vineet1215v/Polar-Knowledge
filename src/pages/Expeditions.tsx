import { useState } from "react";
import { expeditions } from "../data";
import { findings, projects } from "../knowledgeData";
import ResearchDNA from "../components/ResearchDNA";
import RelatedKnowledge from "../components/RelatedKnowledge";
import SaveFollowButton from "../components/SaveFollowButton";
import AddToWorkspace from "../components/AddToWorkspace";
import ExpeditionRouteMap from "../components/ExpeditionRouteMap";
import { gameStore } from "../gameStore";
import type { WorkspaceSource } from "../workspaceStore";

interface Props {
  onNavigate: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}

type ExpeditionType = typeof expeditions[0];

interface FieldDispatch {
  day: string;
  date: string;
  location: string;
  author: string;
  title: string;
  content: string;
  sensorLog: string;
  tag: string;
}

const FIELD_DISPATCHES: Record<number, FieldDispatch[]> = {
  1: [
    {
      day: "Day 01",
      date: "18 Nov 2024",
      location: "Mormugao Port, Goa (15.41°N, 73.80°E)",
      author: "Dr. K. Sharma (Expedition Leader)",
      title: "Expedition Departure & Scientific Gear Staging",
      content: "All 42 expeditioners, including 18 winter-over crew members, boarded the chartered vessel. 85 heavy shipping containers holding JP-8 polar fuel, snowmobiles, and ice drills were lashed securely.",
      sensorLog: "Barometric Pressure: 1013.2 hPa · Sea Surface Temp: 28.4°C",
      tag: "Departure",
    },
    {
      day: "Day 24",
      date: "12 Dec 2024",
      location: "Roaring Forties (44.20°S, 16.50°E)",
      author: "P. Nair (Chief Oceanographer)",
      title: "Navigating Swells in the Roaring Forties",
      content: "Ship encountered a polar low front with westerly gale winds gusting up to 48 knots. 6-meter swells tossed the vessel. Continuous surface underway fluorometer registered a sharp spike in chlorophyll-a.",
      sensorLog: "Wind: 48 kts WNW · Sea Surface Temp: 8.8°C · Salinity: 34.2 PSU",
      tag: "Oceanography",
    },
    {
      day: "Day 36",
      date: "24 Dec 2024",
      location: "Marginal Ice Zone (63.80°S, 12.40°E)",
      author: "A. Verma (Glaciology Lead)",
      title: "First Contact with Consolidated Antarctic Sea Ice",
      content: "Hull shuddered as we pierced first-year pack ice at 64°S. Deployed portable ice-thickness drill: mean ice floe thickness was 1.3 meters with 20 cm snow cover. Sighted 3 pods of Crabeater seals.",
      sensorLog: "Ice Thickness: 1.3 m · Air Temp: -5.4°C · Wind: 18 kts E",
      tag: "Sea Ice",
    },
    {
      day: "Day 48",
      date: "05 Jan 2025",
      location: "Maitri Station, Schirmacher Oasis (-70.77°S, 11.74°E)",
      author: "Station Operations Team",
      title: "Arrival at Schirmacher Oasis & Handover",
      content: "Helicopter sling operations successfully completed from India Bay fast ice shelf to Maitri. Station generators fired up; winter-over team began calibration of the atmospheric LIDAR and geomagnetic sensors.",
      sensorLog: "Station Temp: -14.2°C · Wind: 26 kts ESE · Pressure: 984 hPa",
      tag: "Station Ops",
    },
  ],
  2: [
    {
      day: "Day 05",
      date: "22 Nov 2023",
      location: "Southern Indian Ocean (-25.10°S, 65.40°E)",
      author: "Dr. S. Iyer (Mission PI)",
      title: "Calibration of Deep CTD Rosette",
      content: "Conducted test casts down to 2,500m depth. 36 Niskin bottles fired successfully. Recorded microplastic concentrations in high-seas oligotrophic gyre.",
      sensorLog: "Water Depth: 4,120m · CTD Voltage: 24.1V · Sound Velocity: 1530 m/s",
      tag: "Deep Water",
    },
    {
      day: "Day 32",
      date: "19 Dec 2023",
      location: "Prydz Bay Coastal Polynya (-68.20°S, 76.10°E)",
      author: "Marine Biology Team",
      title: "Adelie Penguin Foraging Acoustic Tracking",
      content: "Surveyed coastal polynya front adjacent to Larsemann Hills. Multi-frequency echo sounders mapped dense krill swarms (Euphausia superba) feeding penguin foraging grounds.",
      sensorLog: "Target Strength: -68 dB · Sea Temp: -1.7°C · Swell: 0.8m",
      tag: "Ecology",
    },
  ],
};

function KnowledgeTimeline({ expedition }: { expedition: ExpeditionType }) {
  const steps = [
    { date: expedition.dates.split("–")[0].trim(), label: "Expedition Departure", icon: "", type: "event" },
    { date: "+2 weeks", label: "Station Arrival — Maitri / Bharati", icon: "", type: "event" },
    { date: "+1 month", label: "Field Observations Begin", icon: "", type: "science" },
    { date: "+2 months", label: "Datasets Collected & Transmitted", icon: "", type: "data" },
    { date: "+6 months", label: "Initial Findings Drafted", icon: "", type: "finding" },
    { date: "+12 months", label: "Publications Submitted", icon: "", type: "publication" },
    { date: "+18 months", label: "Educational Content Created", icon: "", type: "education" },
  ];
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: "var(--accent-light)", border: "2px solid var(--accent)" }}
            >
              {step.icon}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 h-5 mt-0.5" style={{ background: "var(--border)" }} />}
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <div className="text-[9px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
              {step.date}
            </div>
            <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
              {step.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpeditionDetail({
  expedition,
  onClose,
  onNavigate,
  onAddToWorkspace,
  onOpenStudio,
}: {
  expedition: ExpeditionType;
  onClose: () => void;
  onNavigate: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}) {
  const [detailTab, setDetailTab] = useState<"overview" | "dispatches" | "dna" | "timeline" | "findings">("overview");
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);
  const expFindings = findings.slice(0, 3);
  const expProjects = projects.filter(p => p.expeditionIds.includes(expedition.id)).slice(0, 3);

  const dispatches = FIELD_DISPATCHES[expedition.id] || FIELD_DISPATCHES[1];

  const relatedEntities = [
    { type: "dataset" as const, label: "Antarctic Sea Ice Concentration (2023)", meta: "2.1 GB · Sea Ice" },
    { type: "publication" as const, label: "Changing sea ice dynamics in the Southern Ocean", meta: "Journal of Glaciology · 2024" },
    { type: "station" as const, label: "Maitri Station", meta: "Schirmacher Oasis, Antarctica" },
    { type: "station" as const, label: "Bharati Station", meta: "Prydz Bay, Antarctica" },
    { type: "media" as const, label: "126 Media Assets", meta: "Photos, videos, 360° tours" },
  ];

  const handleToggleRadio = () => {
    setIsPlayingRadio(!isPlayingRadio);
    if (!isPlayingRadio) {
      gameStore.addXp(20, "Tuned into Polar Field Radio Dispatch");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div
        className="ml-auto w-full max-w-2xl h-full bg-white flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="relative" style={{ height: 160 }}>
            <img src={expedition.image} alt={expedition.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(transparent 35%, rgba(14,31,61,0.9))" }} />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40"
            >
              x
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="tag"
                  style={{
                    background: expedition.status === "Active" ? "#f0fdf4" : "#f1f5f9",
                    color: expedition.status === "Active" ? "#16a34a" : "#64748b",
                  }}
                >
                  {expedition.status === "Active" ? "● Active Expedition" : expedition.status}
                </span>
                <span className="tag">{expedition.region}</span>
                <span className="text-white/70 text-xs ml-auto font-mono">{expedition.dates}</span>
              </div>
              <h2 className="font-bold text-lg text-white">{expedition.subtitle}</h2>
            </div>
          </div>

          <div className="tab-bar m-3 mb-0">
            {(
              [
                ["overview", "Overview"],
                ["dispatches", `Field Dispatches (${dispatches.length})`],
                ["dna", "Research DNA"],
                ["timeline", "Timeline"],
                ["findings", "Findings"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                className={`tab-item ${detailTab === id ? "active" : ""}`}
                onClick={() => setDetailTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {detailTab === "overview" && (
            <>
              <p className="text-sm leading-relaxed text-slate-600">
                {expedition.description} The expedition involved multi-disciplinary research across glaciology,
                oceanography, atmospheric science, biology, and remote sensing at Maitri and Bharati research stations.
              </p>

              {/* Expedition Metrics Strip */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-800">42 Members</div>
                  <div className="text-[9px] text-slate-500 uppercase">Scientific Crew</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-800">118 Days</div>
                  <div className="text-[9px] text-slate-500 uppercase">Field Duration</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-blue-700">18 Datasets</div>
                  <div className="text-[9px] text-slate-500 uppercase">Collected</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-indigo-700">42 Pubs</div>
                  <div className="text-[9px] text-slate-500 uppercase">Published</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs mb-2 text-slate-900">Active Research Projects</h4>
                <div className="space-y-2">
                  {expProjects.map(proj => (
                    <div key={proj.id} className="card p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-900">{proj.title}</div>
                        <div className="text-[10px] mt-0.5 text-slate-500">
                          {proj.domain} · PI: {proj.pi}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-slate-500">{proj.datasets} datasets</div>
                        <div className="text-[10px] text-slate-500">{proj.publications} publications</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <RelatedKnowledge entities={relatedEntities} onNavigate={onNavigate} />

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  className="btn-primary btn-sm flex-1"
                  onClick={() => {
                    onClose();
                    onNavigate("ai");
                  }}
                >
                   Ask Polar AI →
                </button>
                <AddToWorkspace
                  source={{
                    id: `exp-${expedition.id}`,
                    type: "expedition",
                    title: expedition.title,
                    meta: expedition.dates,
                    date: `${expedition.year}`,
                    origin: "NCPOR Expedition Archive",
                  }}
                  onAdd={onAddToWorkspace || (() => {})}
                />
                <button
                  className="btn-outline btn-sm"
                  onClick={() => {
                    onClose();
                    onOpenStudio?.();
                  }}
                >
                  Studio
                </button>
              </div>
              <SaveFollowButton entityId={expedition.id.toString()} entityType="expedition" label="Expedition" />
            </>
          )}

          {/* New Field Dispatches & Daily Notebook Tab */}
          {detailTab === "dispatches" && (
            <div className="space-y-4">
              {/* Radio Simulation Bar */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isPlayingRadio ? "bg-emerald-400 animate-ping" : "bg-slate-600"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold text-white">NCPOR High-Latitude HF Radio Dispatch Channel</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {isPlayingRadio ? "Simulating Live Polar Telemetry Broadcast • 8.420 MHz" : "Audio Channel Standby"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleRadio}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    isPlayingRadio ? "bg-red-600 text-white" : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {isPlayingRadio ? "■ Mute Radio" : "▶ Listen Dispatch (+20 XP)"}
                </button>
              </div>

              {/* Dispatches List */}
              <div className="space-y-3">
                {dispatches.map((disp, idx) => (
                  <div key={idx} className="card p-3.5 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {disp.day}
                        </span>
                        <span className="text-[11px] text-slate-500">{disp.date}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {disp.tag}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{disp.title}</h4>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        By {disp.author} · <span className="text-slate-600">{disp.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">{disp.content}</p>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px] font-mono text-slate-600 flex items-center gap-2">
                      <span className="text-blue-600"></span>
                      <span>{disp.sensorLog}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailTab === "dna" && (
            <ResearchDNA
              expeditionId={expedition.id}
              onNavigate={dest => {
                onClose();
                onNavigate(dest);
              }}
            />
          )}

          {detailTab === "timeline" && <KnowledgeTimeline expedition={expedition} />}

          {detailTab === "findings" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Key findings from publications connected to this expedition. Evidence status reflects assessment against
                available NCPOR sources.
              </p>
              {expFindings.map(f => (
                <div key={f.id} className="card p-3 space-y-2">
                  <p className="text-xs leading-relaxed font-medium text-slate-900">{f.text}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span
                      className={`tag ${
                        f.evidenceStatus === "source_backed"
                          ? "tag-green"
                          : f.evidenceStatus === "synthesis"
                          ? ""
                          : "tag-orange"
                      }`}
                    >
                      {f.evidenceStatus === "source_backed"
                        ? "OK Source-Backed"
                        : f.evidenceStatus === "synthesis"
                        ? "⊕ Synthesis"
                        : "? Insufficient Evidence"}
                    </span>
                    <span className="text-[10px] text-slate-500">{f.confidence}% confidence</span>
                    <span className="text-[10px] text-slate-500">
                      {f.domain} · {f.year}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Source: {f.sourceTitle}</div>
                  <div className="flex gap-1.5">
                    <button
                      className="btn-outline btn-sm"
                      onClick={() => {
                        onClose();
                        onNavigate("publications");
                      }}
                    >
                      View Publication
                    </button>
                    <button
                      className="btn-outline btn-sm"
                      onClick={() => {
                        onClose();
                        onNavigate("ai");
                      }}
                    >
                      Ask Polar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Expeditions({ onNavigate, onAddToWorkspace, onOpenStudio }: Props) {
  // Main Visualization Mode
  const [viewMode, setViewMode] = useState<"routes" | "deck">("routes");
  const [activeRouteId, setActiveRouteId] = useState<string>("route_46_maitri");

  // Filter States
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<ExpeditionType | null>(null);

  const filtered = expeditions.filter(e => {
    if (tab === "antarctic" && e.region !== "Antarctic") return false;
    if (tab === "arctic" && e.region !== "Arctic") return false;
    if (
      search &&
      !e.title.toLowerCase().includes(search.toLowerCase()) &&
      !e.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (year && e.year !== parseInt(year)) return false;
    if (status && e.status !== status) return false;
    return true;
  });

  const handleSelectExpedition = (exp: ExpeditionType) => {
    setSelected(exp);
    gameStore.addXp(20, `Inspected Expedition: ${exp.title}`);
  };

  const handleSaveExpedition = (exp: ExpeditionType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWorkspace) {
      onAddToWorkspace({
        id: `exp-${exp.id}`,
        type: "expedition",
        title: exp.title,
        meta: exp.dates,
        date: `${exp.year}`,
        origin: "NCPOR Expedition Archive",
      });
    }
    gameStore.addXp(30, `Saved Expedition: ${exp.title}`);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl"></span>
              <h1 className="page-header-title text-2xl font-bold text-slate-900">
                Polar Expeditions Hub & Visualizer
              </h1>
            </div>
            <p className="page-header-sub text-xs text-slate-500 mt-1">
              Explore India's scientific journeys through the Antarctic, Arctic, and Southern Oceans with live voyage tracking and mission archives.
            </p>
          </div>

          {/* Interactive Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-200/90 p-1.5 rounded-xl border border-slate-300/60 shadow-2xs">
            <button
              onClick={() => {
                setViewMode("routes");
                gameStore.addXp(15, "Switched to Voyage Route Visualizer");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === "routes"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              <span></span> Voyage Routes Visualizer
            </button>
            <button
              onClick={() => {
                setViewMode("deck");
                gameStore.addXp(15, "Switched to Expedition Missions");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === "deck"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              <span></span> Expedition Missions ({filtered.length})
            </button>
          </div>
        </div>

        {/* View 1: Interactive Polar Voyage Route Tracker */}
        {viewMode === "routes" && (
          <div>
            <ExpeditionRouteMap initialRouteId={activeRouteId} onNavigate={onNavigate} />
            {/* Quick switcher callout */}
            <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-base"></span>
                <span className="text-xs text-blue-900 font-medium">
                  Want to explore specific expedition crews, field photos, and scientific dispatches?
                </span>
              </div>
              <button
                onClick={() => setViewMode("deck")}
                className="btn-primary btn-sm text-xs font-semibold"
              >
                Open Mission Directory →
              </button>
            </div>
          </div>
        )}

        {/* View 2: Interactive Expedition Mission Deck */}
        {viewMode === "deck" && (
          <div className="space-y-5">
            {/* Controls Bar */}
            <div className="card p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-200">
              {/* Region Switcher */}
              <div className="tab-bar">
                {[
                  ["all", "All Expeditions"],
                  ["antarctic", "Antarctic Missions"],
                  ["arctic", "Arctic Missions"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    className={`tab-item ${tab === id ? "active" : ""}`}
                    onClick={() => setTab(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-48">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    className="search-input text-xs pl-8 py-1.5"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search mission..."
                  />
                </div>
                <select
                  className="filter-select text-xs py-1.5"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                >
                  <option value="">Year (All)</option>
                  {[2024, 2023, 2022, 2021, 2020, 2019].map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  className="filter-select text-xs py-1.5"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="">Status (All)</option>
                  <option value="Active">Active Missions</option>
                  <option value="Completed">Completed Missions</option>
                </select>
              </div>
            </div>

            {/* Interactive Expedition Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(exp => (
                <div
                  key={exp.id}
                  onClick={() => handleSelectExpedition(exp)}
                  className="card overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Card Image Banner */}
                    <div className="relative overflow-hidden h-44">
                      <img
                        src={exp.image}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
                            exp.status === "Active"
                              ? "bg-emerald-500 text-white shadow-xs animate-pulse"
                              : "bg-slate-900/80 text-slate-200"
                          }`}
                        >
                          {exp.status === "Active" ? "● Active In Ice" : exp.status}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-2xs"
                          style={{
                            background: exp.region === "Antarctic" ? "#1e3a8a" : "#065f46",
                            color: "#ffffff",
                          }}
                        >
                          {exp.region}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-white drop-shadow-sm">{exp.title}</h3>
                          <span className="font-mono text-xs font-bold text-blue-200">{exp.year}</span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">{exp.dates}</div>
                      </div>
                    </div>

                    {/* Mission Body Metrics */}
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{exp.description}</p>

                      {/* Interactive Telemetry Chips */}
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs py-1">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div className="font-extrabold text-slate-800">{exp.id <= 2 ? "42" : "38"}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">Scientists</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div className="font-extrabold text-blue-700">{exp.id <= 2 ? "118d" : "90d"}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">Deployment</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div className="font-extrabold text-emerald-700">{exp.id <= 2 ? "18" : "14"}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">Datasets</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        const rId = exp.id === 1
                          ? "route_46_maitri"
                          : exp.id === 2
                          ? "route_45_bharati"
                          : exp.region === "Arctic"
                          ? "route_arctic_himadri"
                          : "route_southern_ocean";
                        setActiveRouteId(rId);
                        setViewMode("routes");
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex-1 text-center"
                      title="View Route Map"
                    >
                       Route
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleSelectExpedition(exp);
                      }}
                      className="btn-outline btn-sm flex-1 text-xs"
                    >
                       Field Log
                    </button>
                    <button
                      onClick={e => handleSaveExpedition(exp, e)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Save to Workspace (+30 XP)"
                    >
                      
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="card p-10 text-center text-slate-500 border border-slate-200">
                <div className="text-3xl mb-2"></div>
                <div className="text-sm font-semibold">No polar expeditions found matching your filters.</div>
                <button
                  onClick={() => {
                    setTab("all");
                    setSearch("");
                    setYear("");
                    setStatus("");
                  }}
                  className="mt-3 btn-outline btn-sm text-xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deep-Dive Expedition Detail Drawer with Field Notebook */}
      {selected && (
        <ExpeditionDetail
          expedition={selected}
          onClose={() => setSelected(null)}
          onNavigate={onNavigate}
          onAddToWorkspace={onAddToWorkspace}
          onOpenStudio={onOpenStudio}
        />
      )}
    </div>
  );
}
