import { useState, useEffect } from "react"
import { expeditions, publications, datasets } from "../data"
import {
  gameStore,
  type PlayerStats,
  type Badge,
  type Quest,
} from "../gameStore"

interface Props {
  onNavigate?: (p: string) => void
  onToast?: (msg: string) => void
}

export default function Profile({ onNavigate, onToast }: Props) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "expeditions" | "publications" | "biolab" | "badges"
  >("overview")

  const [stats, setStats] = useState<PlayerStats>(gameStore.getStats())
  const [badges, setBadges] = useState<Badge[]>(gameStore.getBadges())
  const [quests, setQuests] = useState<Quest[]>(gameStore.getQuests())
  const [copiedOrcid, setCopiedOrcid] = useState(false)

  useEffect(() => {
    return gameStore.subscribe(() => {
      setStats(gameStore.getStats())
      setBadges([...gameStore.getBadges()])
      setQuests([...gameStore.getQuests()])
    })
  }, [])

  const handleCopyOrcid = () => {
    navigator.clipboard.writeText("0000-0002-4819-2041")
    setCopiedOrcid(true)
    onToast?.("Copied ORCID ID to clipboard")
    setTimeout(() => setCopiedOrcid(false), 2000)
  }

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "var(--content-bg, #f1f5f9)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── PROFILE HERO CARD ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Top Banner Gradient */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-[#002244] via-[#003366] to-[#0284c7] relative p-6 flex items-end justify-between">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 hidden sm:flex items-center gap-2 text-white/80 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                NCPOR SCIENTIFIC ROSTER &middot; REGION: ANTARCTIC &amp; ARCTIC
              </span>
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate?.("dashboard")}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition cursor-pointer"
              >
                &larr; Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("ai")}
                className="px-3 py-1.5 rounded-xl bg-white text-[#003366] text-xs font-bold shadow-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Ask Polar AI
              </button>
            </div>
          </div>

          {/* Hero Content Info */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 p-1 shadow-lg border-4 border-white flex items-center justify-center text-white text-3xl font-black">
                    VS
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                    title="Active Researcher Status"
                  >
                    ✓
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Dr. Vikramaditya Sen
                    </h1>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                      Lvl {stats.level} &middot; {stats.rank}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Lead Scientist, Cryosphere &amp; Polar Limnology &middot;{" "}
                    <span className="text-blue-700 font-semibold">
                      National Centre for Polar and Ocean Research (NCPOR)
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Ministry of Earth Sciences, Government of India &middot; Headquartered in Vasco da Gama, Goa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={handleCopyOrcid}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  title="Copy ORCID iD"
                >
                  <span className="text-emerald-600 font-bold">iD</span>
                  <span>0000-0002-4819-2041</span>
                  <span className="text-[10px] text-slate-400">
                    {copiedOrcid ? "✓ Copied" : "📋"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.("datasets")}
                  className="px-3.5 py-1.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>📊</span> Data Workspace
                </button>
              </div>
            </div>

            {/* Researcher Profile Tags */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Specializations:</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                Lake Limnology
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                Otolith Age Validation
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                Antarctic Circumpolar Oceanography
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                eDNA Metagenomics
              </span>
              <span className="ml-auto text-[11px] text-slate-400 font-mono">
                Roster ID: IND-POL-2024-8842
              </span>
            </div>
          </div>
        </div>

        {/* ── KPI METRICS CARDS ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs text-left">
            <div className="text-xs text-slate-500 font-medium">Polar Expeditions</div>
            <div className="text-2xl font-black text-slate-900 mt-1">6</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <span>●</span> 5 Antarctic + 1 Arctic
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs text-left">
            <div className="text-xs text-slate-500 font-medium">Research Papers</div>
            <div className="text-2xl font-black text-slate-900 mt-1">28</div>
            <div className="text-[11px] text-blue-600 font-medium mt-0.5 flex items-center gap-1">
              <span>▲</span> 480 Total Citations
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs text-left">
            <div className="text-xs text-slate-500 font-medium">Open Datasets</div>
            <div className="text-2xl font-black text-slate-900 mt-1">14</div>
            <div className="text-[11px] text-purple-600 font-medium mt-0.5">
              NetCDF / CSV Indexed
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs text-left">
            <div className="text-xs text-slate-500 font-medium">Academy XP &amp; Badges</div>
            <div className="text-2xl font-black text-[#1D4ED8] mt-1">{stats.xp} XP</div>
            <div className="text-[11px] text-blue-600 font-medium mt-0.5">
              {badges.filter((b) => b.unlocked).length} of {badges.length} Badges
            </div>
          </div>
        </div>

        {/* ── NAVIGATION TABS ────────────────────────────────────────────────── */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-px">
            {[
              { id: "overview", label: "Overview & Biography", icon: "👤" },
              { id: "expeditions", label: "Field Expeditions (6)", icon: "🚢" },
              { id: "publications", label: "Selected Papers (28)", icon: "📄" },
              { id: "biolab", label: "Specimen Analysis Logs", icon: "🔬" },
              { id: "badges", label: "Badges & Credentials", icon: "🏆" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? "border-[#003366] text-[#003366]"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* ── TAB CONTENT: OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs text-left">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Scientific Biography &amp; Focus
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Dr. Vikramaditya Sen is an Senior Research Oceanographer at the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences. With over 14 years of high-latitude scientific experience, Dr. Sen's research focuses on cryospheric biogeochemistry, Antarctic freshwater limnology (Priyadarshini Lake, Schirmacher Oasis), and Southern Ocean fish growth dynamics using otolith microscopic increment calibration.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  He has served as Team Lead on multiple Indian Antarctic Expeditions (IAE) operating from Maitri and Bharati stations, and led marine sampling transects aboard ORV Sagar Kanya and MV Sagar Nidhi.
                </p>
              </div>

              {/* Research Focus Areas */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs text-left">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Key Research Directives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>❄️</span> Cryosphere Paleoclimatology
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Ice core isotope stratigraphy and firn core drilling across Dronning Maud Land.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🐟</span> Otolith Age Validation
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Microstructure annual ring analysis for Dissostichus eleginoides and Icefish.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🧬</span> Environmental DNA (eDNA)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      High-throughput Nanopore sequencing of Southern Ocean and fjord water columns.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🌊</span> Southern Ocean Hydrography
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Antarctic Circumpolar Current carbon sequestration and CTD rosette profiling.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* Credentials & Certifications */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs text-left">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Clearances &amp; Certifications
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
                    <span className="font-semibold">Antarctic Medical Clearance</span>
                    <span className="text-[10px] font-mono">Class-1 Valid</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
                    <span className="font-semibold">Winter-Over Survival Certification</span>
                    <span className="text-[10px] font-mono">ITBP Auli</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 border border-purple-100 text-purple-800">
                    <span className="font-semibold">MoES Chief Scientist Clearance</span>
                    <span className="text-[10px] font-mono">Verified</span>
                  </div>
                </div>
              </div>

              {/* Station Deployments Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs text-left">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Station Station Deployments
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2 rounded-lg bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Bharati Station</div>
                      <div className="text-[10px] text-slate-500">Larsemann Hills, Antarctica</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700">3 Seasons</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Maitri Station</div>
                      <div className="text-[10px] text-slate-500">Schirmacher Oasis, Antarctica</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700">2 Seasons</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Himadri Station</div>
                      <div className="text-[10px] text-slate-500">Ny-Ålesund, Svalbard (Arctic)</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700">1 Season</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: EXPEDITIONS ──────────────────────────────────────── */}
        {activeTab === "expeditions" && (
          <div className="space-y-4 text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Field Deployment History
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Verified mission records maintained in the NCPOR National Polar Archive.
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "46th Indian Antarctic Expedition (IAE)",
                    dates: "Nov 2024 – Mar 2025",
                    role: "Chief Scientist (Lake Limnology)",
                    station: "Maitri & Bharati Stations",
                    highlight: "Priyadarshini lake ice thickness profiling and benthic sediment sampling.",
                  },
                  {
                    title: "44th Indian Antarctic Expedition (IAE)",
                    dates: "Nov 2022 – Apr 2023",
                    role: "Senior Oceanographer",
                    station: "Bharati Station & Prydz Bay",
                    highlight: "Conducted 40 hydrographic CTD rosette casts along the Antarctic slope front.",
                  },
                  {
                    title: "Indian Arctic Expedition (Himadri 2021)",
                    dates: "Jul 2021 – Sep 2021",
                    role: "Marine Biologist",
                    station: "Himadri, Ny-Ålesund",
                    highlight: "Kongsfjorden fjord eDNA water column profiling and IndARC mooring inspection.",
                  },
                  {
                    title: "42nd Indian Antarctic Expedition (IAE)",
                    dates: "Dec 2020 – Mar 2021",
                    role: "Field Researcher",
                    station: "Maitri Station",
                    highlight: "Firn ice core drilling and meteorological mast calibration.",
                  },
                ].map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#003366] transition shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="text-sm font-bold text-slate-900">{exp.title}</div>
                      <div className="text-[11px] font-mono text-slate-500">{exp.dates}</div>
                    </div>
                    <div className="flex items-center gap-3 text-xs mb-2">
                      <span className="font-semibold text-blue-700">{exp.role}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-600">{exp.station}</span>
                    </div>
                    <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                      {exp.highlight}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: PUBLICATIONS ─────────────────────────────────────── */}
        {activeTab === "publications" && (
          <div className="space-y-4 text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Peer-Reviewed Research Publications
                  </h3>
                  <p className="text-xs text-slate-500">
                    Indexed in Web of Science, Scopus, and NCPOR Open Science Repository.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate?.("publications")}
                  className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                >
                  View in Research Portal &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Decadal Sea Ice Retreat & Polynya Expansion in Prydz Bay, East Antarctica",
                    journal: "Journal of Glaciology",
                    year: "2024",
                    citations: 48,
                    doi: "10.1017/jog.2024.001",
                  },
                  {
                    title: "Cryophilic Enzymes and Cold-Active Proteases from Priyadarshini Lake Microbes",
                    journal: "Polar Biology",
                    year: "2023",
                    citations: 34,
                    doi: "10.1007/s00300-023-3100-2",
                  },
                  {
                    title: "Otolith Increment Analysis in Dissostichus eleginoides across the Kerguelen Plateau",
                    journal: "Antarctic Science",
                    year: "2023",
                    citations: 29,
                    doi: "10.1017/S095410202300014X",
                  },
                  {
                    title: "Atlantic Water Ingress & Fjord Heat Budget Derived from IndARC Mooring Timeseries",
                    journal: "Climate Dynamics",
                    year: "2024",
                    citations: 52,
                    doi: "10.1007/s00382-022-06123-5",
                  },
                ].map((pub, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition shadow-2xs"
                  >
                    <div className="text-sm font-bold text-slate-900 leading-snug mb-1">
                      {pub.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="font-semibold text-blue-700">{pub.journal}</span>
                      <span>&bull;</span>
                      <span>{pub.year}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-[11px] text-slate-400">DOI: {pub.doi}</span>
                      <span className="ml-auto font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        {pub.citations} Citations
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: BIOLAB & OTOLITH ─────────────────────────────────── */}
        {activeTab === "biolab" && (
          <div className="space-y-4 text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Otolith Micrographs &amp; eDNA Analysis Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Logged specimens analyzed using NCPOR confocal microscopy and AI edge-detectors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate?.("datasets")}
                  className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                >
                  Explore Datasets Archive &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-bold text-slate-800 mb-1">Sample #OT-849</div>
                  <div className="text-[11px] text-slate-600 mb-2">
                    Dissostichus eleginoides (Toothfish)
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-700">7 Annual Rings Verified</div>
                  <div className="text-[10px] text-slate-400 mt-1">Captured at Bharati Station Lab</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-bold text-slate-800 mb-1">Sample #OT-902</div>
                  <div className="text-[11px] text-slate-600 mb-2">
                    Chaenocephalus aceratus (Icefish)
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-700">4 Opaque Zones Detected</div>
                  <div className="text-[10px] text-slate-400 mt-1">Polarized Light Microscopy</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-bold text-slate-800 mb-1">Sample #ED-312</div>
                  <div className="text-[11px] text-slate-600 mb-2">
                    Weddell Sea Water Column (200m)
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-700">34 Species Barcodes</div>
                  <div className="text-[10px] text-slate-400 mt-1">Nanopore 16S/18S Metagenomics</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: BADGES ───────────────────────────────────────────── */}
        {activeTab === "badges" && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs text-left">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Badges &amp; Polar Citizen Achievements
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Earn badges by validating datasets, inspecting station telemetry, and completing missions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition ${
                    badge.unlocked
                      ? "bg-emerald-50/60 border-emerald-200 text-slate-900"
                      : "bg-slate-50 border-slate-200 opacity-60 text-slate-500"
                  }`}
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{badge.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {badge.desc}
                    </div>
                    <div className="text-[9px] font-mono mt-1 text-slate-400">
                      {badge.unlocked ? "✓ Unlocked" : "Locked Mission"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
