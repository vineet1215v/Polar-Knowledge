import { useState, useEffect } from "react"
import {
  gameStore,
  type PlayerStats,
  type Quest,
  type Badge,
} from "../gameStore"

interface HeaderProps {
  onSearch?: (q: string) => void
  onNavigate?: (p: string) => void
  workspaceCount?: number
  onOpenWorkspace?: () => void
  onOpenSocial?: () => void
  onToggleSidebar?: () => void
}

const notificationFeed = [
  {
    id: "n1",
    type: "new_dataset",
    icon: "📊",
    title: "New dataset published",
    body: "Antarctic Sea Ice Concentration (2024) is now available",
    time: "2h ago",
    dest: "datasets",
    unread: true,
  },
  {
    id: "n2",
    type: "expedition_update",
    icon: "🚢",
    title: "46th IAE update",
    body: "Team has reached Bharati Station. Field observations begun.",
    time: "4h ago",
    dest: "expeditions",
    unread: true,
  },
  {
    id: "n3",
    type: "new_publication",
    icon: "📑",
    title: "New publication indexed",
    body: "Sea ice variability in Prydz Bay (2024) — added to repository",
    time: "1d ago",
    dest: "publications",
    unread: true,
  },
  {
    id: "n4",
    type: "knowledge_gap",
    icon: "⚠️",
    title: "Coverage gap detected",
    body: "Arctic methane flux — potential repository coverage gap identified",
    time: "1d ago",
    dest: "dashboard",
    unread: false,
  },
  {
    id: "n5",
    type: "review_needed",
    icon: "📝",
    title: "Draft awaiting review",
    body: "AI-generated outreach article requires editorial approval",
    time: "2d ago",
    dest: "news",
    unread: false,
  },
  {
    id: "n6",
    type: "new_media",
    icon: "📷",
    title: "New media added",
    body: "18 photos from 46th IAE added to Media Gallery",
    time: "3d ago",
    dest: "media",
    unread: false,
  },
  {
    id: "n7",
    type: "follow_update",
    icon: "🛰️",
    title: "Expedition you follow updated",
    body: "45th IAE final datasets released to public repository",
    time: "4d ago",
    dest: "datasets",
    unread: false,
  },
]

const savedKnowledge = [
  {
    icon: "📑",
    label: "Sea ice dynamics in Southern Ocean",
    type: "Publication",
  },
  { icon: "📊", label: "Antarctic Sea Ice Concentration 2023", type: "Dataset" },
  { icon: "🚢", label: "45th Indian Antarctic Expedition", type: "Expedition" },
]

const leaderboard = [
  {
    rank: 1,
    name: "Dr. Rahul Mohan",
    title: "Chief Glaciologist",
    xp: 1420,
    level: 8,
    badge: "🥇",
  },
  {
    rank: 2,
    name: "Priya Sharma",
    title: "Ocean Mooring Specialist",
    xp: 980,
    level: 5,
    badge: "🥈",
  },
  {
    rank: 3,
    name: "You (Explorer)",
    title: "Active Polar Scout",
    xp: 380,
    level: 2,
    badge: "🥉",
    isUser: true,
  },
  {
    rank: 4,
    name: "Vikram Das",
    title: "Maitri Atmospheric Tech",
    xp: 320,
    level: 2,
    badge: "🎖️",
  },
  {
    rank: 5,
    name: "Ananya Iyer",
    title: "Polar Biologist",
    xp: 290,
    level: 2,
    badge: "🎖️",
  },
]

function HeaderIconBtn({
  label,
  onClick,
  children,
  badge,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  badge?: number
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
      style={{
        color: "rgba(255,255,255,0.85)",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
      }
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs"
          style={{ background: "#ef4444" }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

export default function Header({
  onSearch,
  onNavigate,
  workspaceCount = 0,
  onOpenWorkspace,
  onOpenSocial,
  onToggleSidebar,
}: HeaderProps) {
  // Menus & Modals state
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [questDrawerOpen, setQuestDrawerOpen] = useState(false)
  const [gameTab, setGameTab] = useState<"quests" | "badges" | "leaderboard">(
    "quests",
  )
  const [readAll, setReadAll] = useState(false)

  // Gamification Reactive State
  const [stats, setStats] = useState<PlayerStats>(gameStore.getStats())
  const [quests, setQuests] = useState<Quest[]>(gameStore.getQuests())
  const [badges, setBadges] = useState<Badge[]>(gameStore.getBadges())

  useEffect(() => {
    return gameStore.subscribe(() => {
      setStats(gameStore.getStats())
      setQuests([...gameStore.getQuests()])
      setBadges([...gameStore.getBadges()])
    })
  }, [])

  const unreadCount = readAll
    ? 0
    : notificationFeed.filter((n) => n.unread).length

  const handleClaim = (questId: string) => {
    gameStore.claimQuest(questId)
  }

  const closeAllMenus = () => {
    setMegaMenuOpen(false)
    setUserMenuOpen(false)
    setNotifOpen(false)
    setQuestDrawerOpen(false)
  }

  return (
    <>
      {/* ================================================================
          OFFICIAL MYGOV RADIX INSTITUTIONAL HEADER (EXACT LANDING PAGE STYLE)
      ================================================================ */}
      <header
        className="header sticky top-0 z-40 w-full"
        role="banner"
        style={{ height: "var(--header-height, 68px)" }}
      >
        {/* MAIN HEADER (Logo, Search, Hamburger & User) */}
        <div
          className="main-header w-full h-full flex items-center shadow-md relative"
          style={{ background: "#003366", borderBottom: "2px solid #002244" }}
        >
          <div className="w-full px-3 sm:px-6">
            <div className="header-search-block !py-0 flex items-center justify-between gap-2.5 sm:gap-4 w-full">
              {/* Left: Sidebar Toggle + Ashoka Lion Emblem + NCPOR Branding */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Sidebar Toggle Button for Logged-in View */}
                {onToggleSidebar && (
                  <button
                    type="button"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    className="flex items-center justify-center flex-shrink-0 rounded-lg transition-colors hover:bg-white/15 cursor-pointer"
                    style={{
                      width: 36,
                      height: 36,
                      color: "white",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                    title="Toggle Sidebar Navigation"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  </button>
                )}

                {/* Exact Ashoka Lion Emblem + NCPOR Institutional Branding from Landing Page */}
                <div
                  className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
                  onClick={() => onNavigate?.("dashboard")}
                  title="NCPOR Polar Knowledge Portal Home"
                >
                  {/* Official Ashoka Lion Capital of India Vector */}
                  <div className="w-8 sm:w-10 h-10 sm:h-12 flex flex-col items-center justify-center flex-shrink-0 text-white">
                    <svg
                      viewBox="0 0 40 48"
                      fill="none"
                      className="w-7 sm:w-9 h-9 sm:h-11"
                    >
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
                      <circle cx="20" cy="34" r="1.5" fill="#003366" />
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
                    <div className="text-[6px] sm:text-[7.5px] font-black tracking-tight text-white/90 -mt-1 uppercase">
                      सत्यमेव जयते
                    </div>
                  </div>

                  {/* MyGov Official Bilingual Logo & Institutional NCPOR Identity */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="leading-none border-r border-white/25 pr-2 sm:pr-3">
                      <div className="flex items-baseline gap-0.5">
                        <span className="font-extrabold text-xl sm:text-2xl text-emerald-400 tracking-tight font-sans">
                          my
                        </span>
                        <span className="font-black text-xl sm:text-2xl text-white tracking-tight font-sans">
                          GOV
                        </span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-sky-200 tracking-tight -mt-0.5 font-sans">
                        मेरी सरकार
                      </div>
                    </div>
                    <div className="leading-tight">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <span className="font-black text-base sm:text-xl tracking-tight text-white font-sans">
                          ncpor
                        </span>
                        <span className="text-sky-300 font-black text-base sm:text-xl font-sans">
                          .gov<span className="text-xs text-sky-100">.in</span>
                        </span>
                      </div>
                      <div className="text-[8.5px] sm:text-[10.5px] font-bold text-white leading-none mt-0.5">
                        National Centre for Polar and Ocean Research
                      </div>
                      <div className="text-[7.5px] sm:text-[9px] text-sky-200/90 leading-tight hidden sm:block">
                        Ministry of Earth Sciences · Government of India
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Spacer - search removed after login */}
              <div className="flex-1" />

              {/* Right: Sources, Notifications, Profile, Hamburger & User Account */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                {/* Workspace Sources Indicator */}
                {workspaceCount > 0 && (
                  <button
                    type="button"
                    onClick={onOpenWorkspace}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>📂</span> Sources ({workspaceCount})
                  </button>
                )}

                {/* Notifications Bell */}
                <HeaderIconBtn
                  label={`Notifications${
                    unreadCount > 0 ? ` — ${unreadCount} unread` : ""
                  }`}
                  onClick={() => {
                    setNotifOpen(!notifOpen)
                    setUserMenuOpen(false)
                    setMegaMenuOpen(false)
                    setQuestDrawerOpen(false)
                  }}
                  badge={unreadCount}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    style={{ width: 18, height: 18 }}
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </HeaderIconBtn>

                {/* Direct Profile Access Button */}
                <button
                  type="button"
                  onClick={() => {
                    closeAllMenus()
                    onNavigate?.("profile")
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer shadow-2xs group"
                  title="View Polar Scientist Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/40 flex items-center justify-center text-[10px] font-black text-white shadow-2xs group-hover:scale-105 transition-transform">
                    {stats.rank?.substring(0, 2).toUpperCase() || "SC"}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                      <span>Profile</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-400/25 text-cyan-200 font-mono font-bold">
                        Lvl {stats.level}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Animated Hamburger Button for Mega Menu */}
                <button
                  type="button"
                  onClick={() => {
                    setMegaMenuOpen(!megaMenuOpen)
                    setUserMenuOpen(false)
                    setNotifOpen(false)
                    setQuestDrawerOpen(false)
                  }}
                  className={`hamburger ${megaMenuOpen ? "open" : ""}`}
                  title="Toggle Navigation Mega Menu"
                  aria-label="Navigation Menu"
                  aria-expanded={megaMenuOpen}
                >
                  <span className="icon-left"></span>
                  <span className="icon-right"></span>
                </button>

                {/* User Block with Dropdown Profile Card */}
                <div className="user-block">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen)
                      setMegaMenuOpen(false)
                      setNotifOpen(false)
                      setQuestDrawerOpen(false)
                    }}
                    className="user-log"
                    title="Scientist / User Account"
                    aria-label="User Account"
                    aria-expanded={userMenuOpen}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </button>

                  {/* User Profile Dropdown */}
                  {userMenuOpen && (
                    <div className="login-details animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                      <div className="font-bold text-sm text-gray-900 mb-0.5">
                        NCPOR Scientist &amp; Citizen Portal
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {stats.rank} · Level {stats.level}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          {stats.xp} XP
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                        Signed in with researcher credentials. Access scientific telemetry, Antarctic clearances, and proposals.
                      </p>

                      {/* Primary Profile Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          onNavigate?.("profile")
                        }}
                        className="w-full mb-2.5 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>View Full Scientist Profile</span>
                      </button>

                      <div className="border-t border-gray-100 pt-2 text-xs text-gray-700 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            onNavigate?.("profile")
                          }}
                          className="block w-full text-left hover:text-[#1D4ED8] transition-colors py-0.5 font-semibold text-blue-700 cursor-pointer"
                        >
                          👤 My Profile &amp; Research Portfolio
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            onNavigate?.("expeditions")
                          }}
                          className="block w-full text-left hover:text-[#1D4ED8] transition-colors py-0.5 font-medium cursor-pointer"
                        >
                          🚢 Expedition Operations
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            onNavigate?.("datasets")
                          }}
                          className="block w-full text-left hover:text-[#1D4ED8] transition-colors py-0.5 font-medium cursor-pointer"
                        >
                          📊 Polar Data Repositories
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            onNavigate?.("bio-lab")
                          }}
                          className="block w-full text-left hover:text-[#1D4ED8] transition-colors py-0.5 font-medium cursor-pointer"
                        >
                          🧬 eDNA &amp; Otolith Lab
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            onNavigate?.("ai")
                          }}
                          className="block w-full text-left hover:text-[#1D4ED8] transition-colors py-0.5 font-medium cursor-pointer"
                        >
                          🤖 Polar AI Scientific Assistant
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            setQuestDrawerOpen(true)
                          }}
                          className="block w-full text-left hover:text-emerald-600 transition-colors py-0.5 font-semibold text-emerald-700 cursor-pointer"
                        >
                          🎯 Missions &amp; Quests Command
                        </button>
                        <div className="border-t border-gray-100 pt-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false)
                              onNavigate?.("landing")
                            }}
                            className="block w-full text-left hover:text-red-600 text-slate-500 transition-colors py-0.5 font-medium cursor-pointer"
                          >
                            🚪 Sign Out to Public Portal
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. FULL MEGAMENU DROPDOWN (5 Columns matching MyGov) */}
          {megaMenuOpen && (
            <div className="megamenu-wrap animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="megamenu">
                <div className="megamenu_item">
                  <h2>Polar Expeditions</h2>
                  <ul>
                    <li>
                      <a
                        href="#expeditions"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("expeditions")
                        }}
                      >
                        46th Indian Antarctic Expedition <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#expeditions"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("expeditions")
                        }}
                      >
                        Arctic Expedition (Svalbard) <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#stations"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("map")
                        }}
                      >
                        Maitri Station (Schirmacher Oasis) <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#stations"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("map")
                        }}
                      >
                        Bharati Station (Larsemann Hills) <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#stations"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("map")
                        }}
                      >
                        Himadri Arctic Station (79°N) <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#stations"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("map")
                        }}
                      >
                        Himansh Himalayan Station (Spiti) <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#expeditions"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("expeditions")
                        }}
                      >
                        Southern Ocean Winter Cruises <span>→</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="megamenu_item">
                  <h2>Scientific Data</h2>
                  <ul>
                    <li>
                      <a
                        href="#datasets"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("datasets")
                        }}
                      >
                        CTD Oceanographic Profiles <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#datasets"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("datasets")
                        }}
                      >
                        Automated Weather Stations (AWS) <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#datasets"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("datasets")
                        }}
                      >
                        Ice Core Isotope Stratigraphy <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#datasets"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("datasets")
                        }}
                      >
                        Satellite Sea-Ice Radar (SAR) <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#datasets"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("datasets")
                        }}
                      >
                        Extremophile Microbial Genomics <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#datasets"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("datasets")
                        }}
                      >
                        Atmospheric Aerosol Optical Depth <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#datasets"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("datasets")
                        }}
                      >
                        Open Research API Access <span>→</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="megamenu_item">
                  <h2>Research &amp; Publications</h2>
                  <ul>
                    <li>
                      <a
                        href="#publications"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("publications")
                        }}
                      >
                        Peer-Reviewed Journal Papers <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#publications"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("publications")
                        }}
                      >
                        NCPOR Technical Reports <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#publications"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("publications")
                        }}
                      >
                        Paleoclimate Modeling Group <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#publications"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("publications")
                        }}
                      >
                        Glacial Mass Balance Audits <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#publications"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("publications")
                        }}
                      >
                        SCAR &amp; IASC Scientific Groups <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#publications"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("publications")
                        }}
                      >
                        Southern Ocean Hydrography <span>→</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="megamenu_item">
                  <h2>Outreach &amp; Education</h2>
                  <ul>
                    <li>
                      <a
                        href="#education"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("education")
                        }}
                      >
                        Student Fellowship Programs <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#education"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("education")
                        }}
                      >
                        National Polar Science Quiz <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#media"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("media")
                        }}
                      >
                        High-Res Polar Photography <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#education"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("education")
                        }}
                      >
                        Educational Wall Posters &amp; Kits <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#media"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("media")
                        }}
                      >
                        Expedition Video Documentaries <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#ai"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("ai")
                        }}
                      >
                        Ask Polar AI Assistant <span>→</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="megamenu_item">
                  <h2>About NCPOR</h2>
                  <ul>
                    <li>
                      <a
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("about")
                        }}
                      >
                        Mandate &amp; Institutional Charter <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("about")
                        }}
                      >
                        Ministry of Earth Sciences (MoES) <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("about")
                        }}
                      >
                        Research Vessel ORV Sagar Kanya <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("about")
                        }}
                      >
                        Scientific Advisory Board <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("about")
                        }}
                      >
                        RTI &amp; Public Disclosures <span>→</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault()
                          setMegaMenuOpen(false)
                          onNavigate?.("about")
                        }}
                      >
                        Contact Goa Headquarters <span>→</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Backdrop to close menus */}
      {(megaMenuOpen || userMenuOpen || notifOpen || questDrawerOpen) && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-2xs"
          onClick={closeAllMenus}
        />
      )}

      {/* ── GAMIFICATION QUESTS & TROPHY DRAWER ─────────────────────── */}
      {questDrawerOpen && (
        <div className="fixed top-18 right-4 sm:right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 text-xs flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <div>
                <h3 className="font-bold text-sm">
                  Polar Explorer Mission Command
                </h3>
                <p className="text-[10px] text-slate-400">
                  Level {stats.level} {stats.rank} · {stats.crystals} Crystals
                </p>
              </div>
            </div>
            <button
              onClick={() => setQuestDrawerOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1">
            {[
              ["quests", "Daily Quests"],
              ["badges", "Badges & Trophies"],
              ["leaderboard", "Leaderboard"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setGameTab(key as any)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  gameTab === key
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Drawer Body */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {gameTab === "quests" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase">
                  <span>Active Missions</span>
                  <span>
                    {quests.filter((q) => q.completed).length} / {quests.length}{" "}
                    Completed
                  </span>
                </div>

                {quests.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      q.completed
                        ? "bg-emerald-50/60 border-emerald-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl">{q.icon}</span>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
                          {q.title}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          {q.desc}
                        </div>
                        <div className="flex items-center gap-2 mt-1 font-mono text-[10px] font-bold">
                          <span className="text-blue-600">
                            +{q.xpReward} XP
                          </span>
                          <span className="text-cyan-600">
                            +{q.crystalReward} 💎
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {q.completed ? (
                        q.claimed ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                            ✓ Claimed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleClaim(q.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs animate-bounce cursor-pointer"
                          >
                            Claim Reward!
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setQuestDrawerOpen(false)
                    onNavigate?.("education")
                  }}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🎮</span> Open Gaming Learning Arena →
                </button>
              </div>
            )}

            {gameTab === "badges" && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">
                  Unlocked Achievements (
                  {badges.filter((b) => b.unlocked).length} / {badges.length})
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        b.unlocked
                          ? "bg-gradient-to-br from-amber-50/50 to-white border-amber-200 shadow-2xs"
                          : "bg-slate-50/60 border-slate-200 opacity-60 grayscale"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-2xl">{b.icon}</span>
                          <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {b.rarity}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 leading-tight">
                          {b.name}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-snug mt-1">
                          {b.desc}
                        </div>
                      </div>
                      <div className="mt-2 text-[9px] font-mono font-semibold text-amber-700">
                        {b.unlocked ? "✓ Unlocked" : "🔒 Locked"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gameTab === "leaderboard" && (
              <div className="space-y-2.5">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">
                  NCPOR Polar Science Academy Leaderboard
                </div>

                <div className="space-y-1.5">
                  {leaderboard.map((u) => (
                    <div
                      key={u.rank}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        u.isUser
                          ? "bg-blue-50 border-blue-300 shadow-2xs"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-center font-bold text-slate-500 text-sm">
                          {u.badge}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                            {u.name}
                            {u.isUser && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {u.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-700 font-mono text-xs">
                          {u.xp} XP
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          Level {u.level}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Notification Dropdown ─────────────────────────── */}
      {notifOpen && (
        <div className="fixed top-18 right-16 sm:right-20 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
            <h4 className="font-bold text-xs">Notifications</h4>
            <button
              onClick={() => setReadAll(true)}
              className="text-[10px] text-blue-300 hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          </div>
          <div className="p-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {notificationFeed.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setNotifOpen(false)
                  onNavigate?.(n.dest)
                }}
                className={`p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 flex items-start gap-2.5 transition-colors ${
                  !readAll && n.unread ? "bg-blue-50/60" : ""
                }`}
              >
                <span className="text-lg">{n.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {n.title}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {n.body}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
