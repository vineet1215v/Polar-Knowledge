import { useState } from "react"

export interface UserProfileData {
  name: string
  email: string
  mobile: string
  role: string
  points: number
  level: string
}

interface MyGovCitizenDashboardProps {
  user: UserProfileData
  onNavigate: (page: string) => void
  onLogout: () => void
  onClose: () => void
}

interface CertificateItem {
  id: string
  certNumber: string
  title: string
  subtitle: string
  issueDate: string
  category: "Quiz" | "Pledge" | "Challenge" | "Fellowship"
  score?: string
  signatory: string
  signatoryTitle: string
  validity: string
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-1",
    certNumber: "MYGOV/NCPOR/2026/Q-94821",
    title: "National Polar Science Day Quiz 2026",
    subtitle:
      "Certificate of Merit for Exceptional Performance in Cryospheric and Oceanographic Sciences",
    issueDate: "12 February 2026",
    category: "Quiz",
    score: "100% (20/20 Points)",
    signatory: "Dr. Thamban Meloth",
    signatoryTitle: "Director, NCPOR, Ministry of Earth Sciences",
    validity: "Digitally Verified via DigiLocker & MeriPehchaan",
  },
  {
    id: "cert-2",
    certNumber: "MYGOV/NCPOR/2026/PLG-1029",
    title: "Antarctic Wilderness Conservation & Zero-Waste Pledge",
    subtitle:
      "Certificate of Commitment towards preserving Antarctica's pristine fragile ecosystems and SCAR protocols",
    issueDate: "28 January 2026",
    category: "Pledge",
    signatory: "Dr. M. Ravichandran",
    signatoryTitle: "Secretary, Ministry of Earth Sciences (MoES)",
    validity: "Official Government of India Citizen Commitment",
  },
  {
    id: "cert-3",
    certNumber: "MYGOV/NCPOR/2025/HCK-4029",
    title: "Arctic Climate Teleconnections Citizen Science Challenge",
    subtitle:
      "Citation of Merit for Computational Modeling of Monsoonal Teleconnections with Arctic Sea-Ice Anomalies",
    issueDate: "14 December 2025",
    category: "Challenge",
    score: "Distinction Award (Top 2%)",
    signatory: "Chief Glaciologist & Coordinator",
    signatoryTitle: "Arctic Science Operations Cell, NCPOR",
    validity: "Digitally Signed e-Credential",
  },
  {
    id: "cert-4",
    certNumber: "MYGOV/NCPOR/2025/PLG-0812",
    title: "International Day of Polar Oceans – Clean Seas Pledge",
    subtitle:
      "Citizen Pledge supporting deep-sea biogeochemistry preservation and marine microplastic mitigation",
    issueDate: "08 June 2025",
    category: "Pledge",
    signatory: "Head of Ocean Sciences",
    signatoryTitle: "Southern Ocean Research Division, MoES",
    validity: "Permanent Government of India Verification Record",
  },
]

interface ActivityItem {
  id: string
  type: "task" | "discussion" | "poll" | "pledge"
  title: string
  portal: string
  date: string
  status: string
  statusColor: string
  pointsEarned: number
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "task",
    title:
      "Suggestions for 46th Indian Antarctic Expedition Environmental Guidelines",
    portal: "Do / Policy Consultation",
    date: "24 Feb 2026",
    status: "Approved by MoES",
    statusColor: "bg-green-100 text-green-800 border-green-200",
    pointsEarned: 150,
  },
  {
    id: "act-2",
    type: "discussion",
    title:
      "Standard Operating Procedures for Scientific Tourism in Larsemann Hills",
    portal: "Discuss / NCPOR Forum",
    date: "19 Feb 2026",
    status: "Published (18 Upvotes)",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
    pointsEarned: 75,
  },
  {
    id: "act-3",
    type: "poll",
    title:
      "Prioritizing Autonomous Surface Vehicles (ASVs) for Southern Ocean Winter Data",
    portal: "Polls & Surveys",
    date: "10 Feb 2026",
    status: "Voted & Recorded",
    statusColor: "bg-purple-100 text-purple-800 border-purple-200",
    pointsEarned: 25,
  },
  {
    id: "act-4",
    type: "pledge",
    title: "Antarctic Wilderness Conservation & Zero-Waste Pledge",
    portal: "Citizen Pledges",
    date: "28 Jan 2026",
    status: "Certificate Issued",
    statusColor: "bg-amber-100 text-amber-800 border-amber-200",
    pointsEarned: 100,
  },
  {
    id: "act-5",
    type: "task",
    title: "Public Review on Deep Ocean Mission Phase-II Submersible Protocols",
    portal: "Do / MoES Direct",
    date: "12 Jan 2026",
    status: "Under Committee Review",
    statusColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    pointsEarned: 150,
  },
]

interface ExpeditionProposal {
  id: string
  proposalId: string
  title: string
  leadInvestigator: string
  station: string
  tenure: string
  status: string
  statusBadge: string
  berthAllocated: string
}

const EXPEDITION_PROPOSALS: ExpeditionProposal[] = [
  {
    id: "prop-1",
    proposalId: "NCPOR-2026-IAE-46-EXP",
    title:
      "Continuous High-Resolution CTD Profiling Across Prydz Bay Ice Front",
    leadInvestigator: "Dr. Rajeshwar Sharma (Lead PI)",
    station: "Bharati Station / Southern Ocean Cruise",
    tenure: "November 2026 - March 2027",
    status: "Scientific Advisory Committee (SAC) Approved",
    statusBadge: "bg-green-100 text-green-800 border-green-300",
    berthAllocated: "Berth #B-14 confirmed aboard Ice-Class Vessel",
  },
  {
    id: "prop-2",
    proposalId: "NCPOR-2025-ARC-HIM-12",
    title:
      "Multi-wavelength Aerosol Optical Depth Observations at Himadri Station",
    leadInvestigator: "Dr. Rajeshwar Sharma & Co-PIs",
    station: "Himadri Station (Ny-Ålesund, 79°N)",
    tenure: "Summer & Winter Campaign 2025",
    status: "Completed & FAIR Datasets Archived",
    statusBadge: "bg-blue-100 text-blue-800 border-blue-300",
    berthAllocated: "Campaign Completed (Datasets: 1.4 TB in Open Repository)",
  },
  {
    id: "prop-3",
    proposalId: "NCPOR-2027-GLAC-04",
    title:
      "Cryospheric Mass Balance and Ice Core Chronology at Himansh Himalayan Station",
    leadInvestigator: "Dr. Rajeshwar Sharma",
    station: "Himansh Station (Spiti, 4080m)",
    tenure: "Pre-Monsoon 2027",
    status: "Scientific Peer Review in Progress",
    statusBadge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    berthAllocated: "Field logistics clearance pending",
  },
]

export default function MyGovCitizenDashboard({
  user,
  onNavigate,
  onLogout,
  onClose,
}: MyGovCitizenDashboardProps) {
  const [activeTab, setActiveTab] =
    useState<"certificates" | "activity" | "badges" | "expeditions" | "saved">(
      "certificates",
    )
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null)
  const [activityFilter, setActivityFilter] =
    useState<"all" | "task" | "discussion" | "poll" | "pledge">("all")
  const [copySuccess, setCopySuccess] = useState(false)

  const filteredActivities =
    activityFilter === "all"
      ? ACTIVITIES
      : ACTIVITIES.filter((a) => a.type === activityFilter)

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = (certNum: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://verify.mygov.in/cert/${certNum}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 pb-16 font-sans">
      {/* ── Top Government / Tiranga Header Bar ── */}
      <div className="bg-[#1A3C6E] text-white">
        <div className="flex h-1.5 w-full">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Ashoka Emblem */}
            <div className="w-8 h-10 flex flex-col items-center justify-center flex-shrink-0 text-white">
              <svg viewBox="0 0 40 48" fill="none" className="w-7 h-9">
                <path
                  d="M12 4C12 2.5 13.5 1 16 1C18.5 1 20 2.5 20 4C20 2.5 21.5 1 24 1C26.5 1 28 2.5 28 4C28 6 26.5 8 25 9C27 10 28.5 12 28.5 14.5C28.5 17 26.8 19 24.5 19.8C25.5 20.8 26 22 26 23.5C26 26 24 28 21.5 28.5V31H18.5V28.5C16 28 14 26 14 23.5C14 22 14.5 20.8 15.5 19.8C13.2 19 11.5 17 11.5 14.5C11.5 12 13 10 15 9C13.5 8 12 6 12 4Z"
                  fill="#FFFFFF"
                />
                <rect
                  x="8"
                  y="32"
                  width="24"
                  height="4"
                  rx="1"
                  fill="#FFFFFF"
                />
                <circle cx="20" cy="34" r="1.5" fill="#1A3C6E" />
                <path
                  d="M10 37C14 36.5 26 36.5 30 37C29 40 25 41 20 41C15 41 11 40 10 37Z"
                  fill="#CBD5E1"
                />
                <rect
                  x="13"
                  y="42"
                  width="14"
                  height="1.5"
                  rx="0.5"
                  fill="#FFFFFF"
                />
              </svg>
              <div className="text-[6px] font-black tracking-tight text-white -mt-0.5 uppercase">
                सत्यमेव जयते
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  MyGov Citizen & Researcher Portal
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm bg-white/20 text-white">
                  MoES · NCPOR
                </span>
              </div>
              <div className="text-xs text-blue-200">
                Single Sign-On Authentication via MeriPehchaan (National SSO)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 border border-white/20"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-3.5 h-3.5"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Public Portal</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-3.5 h-3.5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* 1. CITIZEN PROFILE HERO CARD (Official MyGov Identity Card) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Card Top Strip with Saffron/Navy Pattern */}
          <div className="h-24 bg-gradient-to-r from-[#1A3C6E] via-[#0F294D] to-[#1D4ED8] relative px-6 flex items-end">
            <div className="absolute top-3 right-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-green-800 shadow-xs border border-green-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-green-600"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                MeriPehchaan & DigiLocker Verified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#1D4ED8] text-white shadow-xs">
                Active Polar Citizen
              </span>
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 pb-6 pt-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10 mb-6">
              {/* Avatar + Main Info */}
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-md border border-slate-200 flex-shrink-0">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1A3C6E] to-[#1D4ED8] text-white flex items-center justify-center text-2xl font-black shadow-inner">
                    RS
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {user.name}
                    </h1>
                    <span className="px-2 py-0.5 rounded-sm bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200">
                      Scientist 'D'
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    {user.role} · National Centre for Polar and Ocean Research
                    (NCPOR, Goa)
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                    <span>
                      <strong>Email:</strong> {user.email}
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Mobile:</strong> {user.mobile}
                    </span>
                    <span>•</span>
                    <span>
                      <strong>NCPOR ID:</strong> NCPOR-RES-4492
                    </span>
                  </div>
                </div>
              </div>

              {/* Gamified Citizen Rank & Points Progression */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[280px]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-amber-500"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{user.level}</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#1D4ED8]">
                    {user.points.toLocaleString()} Points
                  </span>
                </div>
                {/* Level Progress Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-[#1D4ED8] h-full rounded-full transition-all duration-500"
                    style={{ width: "82%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Level 4: Influencer</span>
                  <span>550 Pts to Level 5: Champion</span>
                </div>
              </div>
            </div>

            {/* 2. STATS KPI GRID (6 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center hover:border-blue-300 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-[#1D4ED8]">
                  {user.points}
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  MyGov Points
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center hover:border-blue-300 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-blue-700">
                  4
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  Official Certificates
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center hover:border-green-300 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-green-700">
                  12
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  Quizzes (Avg 94%)
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center hover:border-amber-300 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-amber-700">
                  5
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  Pledges Taken
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center hover:border-purple-300 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-purple-700">
                  8
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  Tasks & Discussions
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center hover:border-teal-300 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-teal-700">
                  2
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  Expeditions Cleared
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DASHBOARD TAB NAVIGATION */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 overflow-x-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("certificates")}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === "certificates"
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>My Certificates ({CERTIFICATES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === "activity"
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>My Activity & Submissions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("badges")}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === "badges"
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Badges & Gamification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("expeditions")}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === "expeditions"
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>Expedition Clearances (NCPOR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === "saved"
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>Saved Datasets & Bookmarks</span>
          </button>
        </div>

        {/* 4. TAB CONTENTS */}

        {/* TAB 1: MY CERTIFICATES */}
        {activeTab === "certificates" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-b-xl border border-slate-200 border-t-0 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Official Government e-Certificates
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authenticated and digitally verifiable certificates earned
                  through MyGov and NCPOR Polar initiatives.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 text-green-600"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Linked to DigiLocker Account</span>
              </div>
            </div>

            {/* Certificate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CERTIFICATES.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Decorative Border Corner Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent pointer-events-none rounded-bl-full"></div>

                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-[#1D4ED8] border border-blue-200">
                        {cert.category} Certificate
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">
                        {cert.certNumber}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 leading-snug mb-1">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {cert.subtitle}
                    </p>

                    <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span>Issued On:</span>
                        <strong className="text-slate-800">
                          {cert.issueDate}
                        </strong>
                      </div>
                      {cert.score && (
                        <div className="flex justify-between">
                          <span>Performance:</span>
                          <strong className="text-green-700">
                            {cert.score}
                          </strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Authority:</span>
                        <span className="text-slate-700 font-medium truncate max-w-[200px]">
                          {cert.signatory}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="px-3 py-1.5 text-xs font-bold text-[#1D4ED8] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-3.5 h-3.5"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>View Certificate</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#1A3C6E] hover:bg-[#132E56] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-3.5 h-3.5"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MY ACTIVITY & SUBMISSIONS */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                {(["all", "task", "discussion", "poll", "pledge"] as const).map(
                  (filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActivityFilter(filter)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors ${
                        activityFilter === filter
                          ? "bg-[#1A3C6E] text-white"
                          : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {filter === "all" ? "All Activity" : filter}
                    </button>
                  ),
                )}
              </div>

              <div className="text-xs text-slate-500 font-semibold">
                Showing {filteredActivities.length} items
              </div>
            </div>

            {/* Activities List */}
            <div className="divide-y divide-slate-100">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                        {act.portal}
                      </span>
                      <span className="text-xs text-slate-400">{act.date}</span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      {act.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold border ${act.statusColor}`}
                      >
                        {act.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-extrabold text-[#1D4ED8]">
                      +{act.pointsEarned} Pts
                    </div>
                    <div className="text-[11px] text-slate-400">Awarded</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BADGES & GAMIFICATION */}
        {activeTab === "badges" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Citizen Badges & Recognition
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Gamification tiers recognized across all Ministry of Earth
                Sciences citizen participatory platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Enthusiast",
                  level: "Level 1",
                  points: "500 Pts",
                  status: "Unlocked",
                  icon: "badge",
                  desc: "First 5 citizen contributions on MyGov",
                },
                {
                  title: "Discoverer",
                  level: "Level 2",
                  points: "1,000 Pts",
                  status: "Unlocked",
                  icon: "badge",
                  desc: "Participated across 3 different ministries",
                },
                {
                  title: "Influencer",
                  level: "Level 3",
                  points: "2,000 Pts",
                  status: "Active Badge",
                  icon: "star",
                  desc: "Exemplary policy reviews and certified quiz score",
                },
                {
                  title: "Polar Pioneer",
                  level: "Special MoES",
                  points: "Honour",
                  status: "Special Award",
                  icon: "polar",
                  desc: "NCPOR Verified Scientist & Citizen Science Lead",
                },
                {
                  title: "Champion",
                  level: "Level 4",
                  points: "3,000 Pts",
                  status: "In Progress (82%)",
                  icon: "lock",
                  desc: "Requires 550 additional reward points",
                },
                {
                  title: "Change Maker",
                  level: "Level 5",
                  points: "5,000 Pts",
                  status: "Locked",
                  icon: "lock",
                  desc: "Top 0.5% citizen advisory contributor tier",
                },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    badge.status === "Active Badge"
                      ? "border-[#1D4ED8] bg-blue-50/50 shadow-xs ring-1 ring-[#1D4ED8]"
                      : badge.status.includes("Unlocked") ||
                          badge.status === "Special Award"
                        ? "border-slate-200 bg-white"
                        : "border-dashed border-slate-300 bg-slate-50 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {badge.level}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        badge.status === "Active Badge"
                          ? "bg-[#1D4ED8] text-white"
                          : badge.status === "Special Award"
                            ? "bg-blue-600 text-white"
                            : badge.status === "Unlocked"
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {badge.status}
                    </span>
                  </div>

                  <div className="font-extrabold text-base text-slate-900 mb-1">
                    {badge.title}
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{badge.desc}</p>
                  <div className="text-[11px] font-bold text-[#1D4ED8]">
                    {badge.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EXPEDITION CLEARANCES (NCPOR RESEARCHER HUB) */}
        {activeTab === "expeditions" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  National Polar Expedition Clearances
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scientist berth allocations, cruise authorizations, and SAC
                  project approvals for Indian Antarctic and Arctic expeditions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("expeditions")}
                className="px-3.5 py-1.5 text-xs font-bold bg-[#1A3C6E] hover:bg-[#132E56] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>View All Expeditions</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-4">
              {EXPEDITION_PROPOSALS.map((prop) => (
                <div
                  key={prop.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-white space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {prop.proposalId}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {prop.station}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${prop.statusBadge}`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-slate-900">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>Investigator:</strong> {prop.leadInvestigator} ·{" "}
                      <strong>Tenure:</strong> {prop.tenure}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 flex items-center justify-between border border-slate-200">
                    <span className="font-medium">{prop.berthAllocated}</span>
                    <button
                      type="button"
                      onClick={() => onNavigate("dashboard")}
                      className="text-xs font-bold text-[#1D4ED8] hover:underline"
                    >
                      View Station Telemetry →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SAVED DATASETS & BOOKMARKS */}
        {activeTab === "saved" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Bookmarked Knowledge & Scientific Datasets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryospheric arrays, CTD moorings, and technical reports saved
                for quick workspace access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {[
                {
                  title: "Antarctic Sea Ice Concentration (2024 NetCDF)",
                  size: "2.1 GB",
                  type: "Dataset",
                  dest: "datasets",
                },
                {
                  title:
                    "CTD Oceanographic Profiles – Southern Ocean Transects",
                  size: "1.4 GB",
                  type: "Dataset",
                  dest: "datasets",
                },
                {
                  title:
                    "Changing Sea-Ice Dynamics in Prydz Bay (Journal of Glaciology)",
                  size: "PDF · 18 MB",
                  type: "Publication",
                  dest: "publications",
                },
                {
                  title:
                    "Atmospheric Aerosol Optical Depth over Maitri Station",
                  size: "750 MB",
                  type: "Telemetry",
                  dest: "dashboard",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {item.type}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 mt-0.5">
                      {item.title}
                    </h5>
                    <span className="text-[11px] text-slate-500">
                      {item.size}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.dest)}
                    className="px-3 py-1.5 text-xs font-bold text-[#1A3C6E] hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 flex-shrink-0"
                  >
                    Open View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. FULL OFFICIAL CERTIFICATE PREVIEW MODAL ── */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border-4 border-amber-600/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Controls */}
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                Official Digital Credential Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(selectedCert.certNumber)}
                  className="px-2.5 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                >
                  {copySuccess ? "Copied Link!" : "Copy Verification URL"}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1 text-xs rounded bg-[#1D4ED8] hover:bg-[#D96016] text-white font-bold transition-colors flex items-center gap-1"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-3.5 h-3.5"
                  >
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="text-slate-300 hover:text-white text-lg font-bold ml-2"
                >
                  x
                </button>
              </div>
            </div>

            {/* Official e-Certificate Sheet */}
            <div className="p-8 sm:p-10 bg-[#FFFDF9] relative border-8 border-double border-amber-800/20 m-4 rounded-xl text-center select-none shadow-inner">
              {/* National Emblem */}
              <div className="w-12 h-14 mx-auto mb-2 text-slate-800 flex flex-col items-center">
                <svg viewBox="0 0 40 48" fill="none" className="w-10 h-12">
                  <path
                    d="M12 4C12 2.5 13.5 1 16 1C18.5 1 20 2.5 20 4C20 2.5 21.5 1 24 1C26.5 1 28 2.5 28 4C28 6 26.5 8 25 9C27 10 28.5 12 28.5 14.5C28.5 17 26.8 19 24.5 19.8C25.5 20.8 26 22 26 23.5C26 26 24 28 21.5 28.5V31H18.5V28.5C16 28 14 26 14 23.5C14 22 14.5 20.8 15.5 19.8C13.2 19 11.5 17 11.5 14.5C11.5 12 13 10 15 9C13.5 8 12 6 12 4Z"
                    fill="#1E293B"
                  />
                  <rect
                    x="8"
                    y="32"
                    width="24"
                    height="4"
                    rx="1"
                    fill="#1E293B"
                  />
                  <circle cx="20" cy="34" r="1.5" fill="#FFFFFF" />
                  <path
                    d="M10 37C14 36.5 26 36.5 30 37C29 40 25 41 20 41C15 41 11 40 10 37Z"
                    fill="#334155"
                  />
                  <rect
                    x="13"
                    y="42"
                    width="14"
                    height="1.5"
                    rx="0.5"
                    fill="#1E293B"
                  />
                </svg>
                <div className="text-[7px] font-black tracking-tight text-slate-900 -mt-1 uppercase">
                  सत्यमेव जयते
                </div>
              </div>

              <div className="text-xs uppercase font-extrabold tracking-widest text-slate-800">
                GOVERNMENT OF INDIA
              </div>
              <div className="text-[11px] font-bold text-slate-600">
                MINISTRY OF EARTH SCIENCES
              </div>
              <div className="text-[10px] font-semibold text-[#1D4ED8] mb-4">
                National Centre for Polar and Ocean Research (NCPOR) & MyGov
              </div>

              {/* Title */}
              <div className="font-serif text-2xl sm:text-3xl font-black text-slate-900 tracking-wide uppercase mb-1">
                CERTIFICATE OF{" "}
                {selectedCert.category === "Pledge" ? "COMMITMENT" : "MERIT"}
              </div>
              <div className="w-24 h-0.5 bg-amber-600 mx-auto mb-4"></div>

              <p className="text-xs sm:text-sm text-slate-600 italic mb-2">
                This is proudly presented to
              </p>

              {/* Recipient */}
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#1A3C6E] underline decoration-amber-500/50 decoration-2 underline-offset-4 mb-3">
                {user.name}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
                for exemplary participation and scoring{" "}
                {selectedCert.score || "full qualification"} in the{" "}
                <strong>{selectedCert.title}</strong>, contributing towards
                India's polar scientific literacy and Antarctic environmental
                stewardship.
              </p>

              {/* Bottom Signatories & QR code */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-xs">
                {/* QR Code Simulation */}
                <div className="flex flex-col items-center sm:items-start text-left">
                  <div className="w-16 h-16 bg-slate-900 p-1 rounded-sm shadow-xs mb-1 flex items-center justify-center">
                    <div className="w-full h-full bg-white p-1 grid grid-cols-3 gap-0.5">
                      <div className="bg-slate-900"></div>
                      <div className="bg-white"></div>
                      <div className="bg-slate-900"></div>
                      <div className="bg-white"></div>
                      <div className="bg-slate-900"></div>
                      <div className="bg-white"></div>
                      <div className="bg-slate-900"></div>
                      <div className="bg-slate-900"></div>
                      <div className="bg-slate-900"></div>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">
                    ID: {selectedCert.certNumber}
                  </div>
                </div>

                {/* Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-600/40 p-1 flex items-center justify-center text-amber-700">
                    <div className="w-full h-full rounded-full border border-dashed border-amber-600 flex flex-col items-center justify-center text-[7px] font-bold uppercase leading-tight">
                      <span>NCPOR</span>
                      <span>SEAL</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Verified e-Credential
                  </span>
                </div>

                {/* Signatory */}
                <div className="text-right">
                  <div className="font-serif italic text-sm font-bold text-slate-800">
                    {selectedCert.signatory}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">
                    {selectedCert.signatoryTitle}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    Date: {selectedCert.issueDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
