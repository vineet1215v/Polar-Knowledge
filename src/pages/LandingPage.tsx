import { useState, useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import CmlreBackboneLogin from "../components/CmlreBackboneLogin"

const MarqueeTag = "marquee" as unknown as React.ElementType

interface LandingPageProps {
  onNavigate: (page: string) => void
  onSearch?: (query: string) => void
}

interface StationInfo {
  id: string
  name: string
  lat: number
  lng: number
  region: string
  established: string
  status: string
  description: string
  focus: string
}

const POLAR_STATIONS: StationInfo[] = [
  {
    id: "bharati",
    name: "Bharati Station",
    lat: -69.4065,
    lng: 76.1927,
    region: "East Antarctica · Larsemann Hills",
    established: "2012",
    status: "Active (Year-round)",
    description:
      "India's third Antarctic research facility with automated laboratory modules, energy-efficient HVAC, and direct satellite telemetry links.",
    focus:
      "Atmospheric Chemistry, Oceanography, High-Energy Geomagnetism, Satellite Telemetry",
  },
  {
    id: "maitri",
    name: "Maitri Station",
    lat: -70.7669,
    lng: 11.737,
    region: "Central Dronning Maud Land · Schirmacher Oasis",
    established: "1989",
    status: "Active (Year-round)",
    description:
      "India's second permanent Antarctic research base, conducting long-term geophysical, meteorological, and biological observations.",
    focus: "Meteorology, Seismology, Geomagnetism, Limnology, Glaciology",
  },
  {
    id: "himadri",
    name: "Himadri Station",
    lat: 78.9268,
    lng: 11.935,
    region: "High Arctic · Ny-Ålesund, Svalbard, Norway",
    established: "2008",
    status: "Active (Seasonal/Winter)",
    description:
      "Flagship Indian research base at 79°N in the international research settlement of Ny-Ålesund, studying Arctic climate teleconnections.",
    focus:
      "Aerosol Optical Depth, Fjord Biogeochemistry, Sea-Ice Teleconnections, Glacial Runoff",
  },
  {
    id: "himansh",
    name: "Himansh Station",
    lat: 32.4042,
    lng: 77.6111,
    region: "Western Himalayas · Chandra Basin, Spiti Valley",
    established: "2016",
    status: "Active (High-Altitude)",
    description:
      "Dedicated high-altitude research station at 4,080m monitoring Himalayan cryospheric mass balance and downstream freshwater security.",
    focus:
      "Glacial Mass Balance, Snow Accumulation, Permafrost, Hydrological Runoff",
  },
  {
    id: "dakshin",
    name: "Dakshin Gangotri",
    lat: -70.0831,
    lng: 12.0061,
    region: "Princess Astrid Coast · Antarctica",
    established: "1983",
    status: "Historic Base",
    description:
      "India's historic first permanent Antarctic station, now commemorated as an Antarctic Specially Protected Area.",
    focus: "Historical Glaciological Baseline & Ice Core Archive",
  },
]

const HERO_SLIDES = [
  {
    id: 1,
    isGrandBanner: true,
    topTag: "NATIONAL",
    highlightText: "POLAR SCIENCE DAY",
    serifHeading: "QUIZ 2026",
    label: "NATIONAL QUIZ 2026",
    heading: "National Polar Science Day Quiz 2026",
    description:
      "Participate in India's premier polar science challenge organized by NCPOR & Ministry of Earth Sciences. Test your knowledge on Antarctica, Maitri, Bharati, and Arctic Himadri.",
    image:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&q=85",
    primaryCta: "Take National Quiz",
    primaryDest: "education",
    secondaryCta: "Explore Expeditions",
    secondaryDest: "expeditions",
  },
  {
    id: 2,
    isGrandBanner: false,
    label: "INDIA'S POLAR RESEARCH",
    heading: "Explore India's Polar Science",
    description:
      "Discover expeditions, research, datasets and scientific knowledge from India's polar research ecosystem across Antarctica, the Arctic, and the Himalayas.",
    image:
      "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=1600&q=85",
    primaryCta: "Explore Expeditions",
    primaryDest: "expeditions",
    secondaryCta: "Explore Research",
    secondaryDest: "publications",
  },
  {
    id: 3,
    isGrandBanner: false,
    label: "POLAR KNOWLEDGE PORTAL",
    heading: "Connecting Polar Science",
    description:
      "Connect publications, datasets, expeditions, researchers and evidence through one integrated national scientific ecosystem.",
    image:
      "https://images.unsplash.com/photo-1672570289260-d430df31d893?w=1600&q=85",
    primaryCta: "Explore Knowledge",
    primaryDest: "dashboard",
    secondaryCta: "Ask Polar AI",
    secondaryDest: "ai",
  },
  {
    id: 4,
    isGrandBanner: false,
    label: "POLAR EXPLORER",
    heading: "Explore the Poles",
    description:
      "Discover research stations, expedition routes, datasets and scientific activity through an interactive polar GIS map.",
    image:
      "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=1600&q=85",
    primaryCta: "Open Polar Explorer",
    primaryDest: "map",
    secondaryCta: "View Stations",
    secondaryDest: "map",
  },
]

const TICKER_ANNOUNCEMENTS = [
  "Now Hiring! Research Fellowship Applications Open at NCPOR – View the details and submit your application by 30th October 2026 | National Polar Science Outreach",
  "New Polar Expedition Research Added: 46th IAE field reports available for public access",
  "New Dataset Available: Southern Ocean biogeochemical timeseries (2024) released",
  "NCPOR Research Publication Released: Glaciological ablation dynamics in Ny-Ålesund, Svalbard",
  "Upcoming Polar Science Event: National Conference on Polar Sciences (NCPS 2026), Goa",
]

const INVOLVE_TABS = [
  {
    id: "tasks",
    label: "Do/Tasks",
    count: 24,
    dest: "education",
    iconType: "tasks",
    subhead:
      "Find a variety of online & on ground skill-building tasks, activities & contests",
  },
  {
    id: "discuss",
    label: "Discuss",
    count: 6,
    dest: "news",
    iconType: "discuss",
    subhead:
      "Engage with scientists and research fellows on polar cryosphere topics",
  },
  {
    id: "poll",
    label: "Poll/Survey",
    count: 3,
    dest: "news",
    iconType: "poll",
    subhead:
      "Share your opinions on climate awareness and polar conservation policies",
  },
  {
    id: "blog",
    label: "Blog",
    count: 5,
    dest: "publications",
    iconType: "blog",
    subhead:
      "Read firsthand dispatches and field diaries from Antarctic expeditioners",
  },
  {
    id: "talk",
    label: "Talk",
    count: 1,
    dest: "events",
    iconType: "talk",
    subhead:
      "Join live webinars and presentations by chief glaciologists and polar biologists",
  },
  {
    id: "quiz",
    label: "Quiz",
    count: 33,
    dest: "education",
    iconType: "quiz",
    subhead:
      "Challenge yourself with interactive quizzes on polar geography and ecology",
  },
  {
    id: "prime",
    label: "MG Prime",
    count: 2,
    dest: "dashboard",
    iconType: "prime",
    subhead:
      "Exclusive research fellowships and high-altitude field training grants",
  },
  {
    id: "campaigns",
    label: "Campaigns",
    count: 79,
    dest: "expeditions",
    iconType: "campaigns",
    subhead:
      "National initiatives supporting Mission Samudrayaan and Arctic expeditions",
  },
  {
    id: "pledge",
    label: "Pledge",
    count: 12,
    dest: "education",
    iconType: "pledge",
    subhead:
      "Take the Citizen Polar Conservation and Climate Responsibility Pledge",
  },
  {
    id: "podcast",
    label: "Podcast",
    count: 18,
    dest: "media",
    iconType: "podcast",
    subhead:
      "Listen to audio interviews with overwintering teams at Maitri & Bharati",
  },
]

const LANDING_REPO_STATS = [
  {
    id: "expeditions",
    value: "44",
    suffix: "+",
    label: "SCIENTIFIC EXPEDITIONS",
    tooltipTitle: "44 Scientific Expeditions",
    tooltipSubtitle: "Antarctic, Arctic & Southern Ocean Missions",
    dest: "expeditions",
  },
  {
    id: "publications",
    value: "1,248",
    suffix: "+",
    label: "PUBLICATIONS",
    tooltipTitle: "1,248+ Peer-Reviewed Papers",
    tooltipSubtitle: "98% Open Access in High-Impact Journals",
    dest: "publications",
  },
  {
    id: "datasets",
    value: "364",
    suffix: "+",
    label: "OPEN DATASETS",
    tooltipTitle: "364+ Verified Open Datasets",
    tooltipSubtitle: "in 18 Polar Disciplines (18.4 TB)",
    dest: "datasets",
  },
  {
    id: "stations",
    value: "4",
    suffix: "BASES",
    label: "RESEARCH STATIONS",
    tooltipTitle: "4 Permanent Polar Bases",
    tooltipSubtitle: "Bharati, Maitri, Himadri & IndARC",
    dest: "dashboard",
  },
  {
    id: "media",
    value: "5,120",
    suffix: "+",
    label: "MEDIA & 360° TOURS",
    tooltipTitle: "5,120+ Media Assets & VR Tours",
    tooltipSubtitle: "160 Immersive 360° Exploration Nodes",
    dest: "media",
  },
  {
    id: "explorers",
    value: "14,82,500",
    suffix: "",
    label: "POLAR EXPLORERS",
    tooltipTitle: "14,82,500 Registered Explorers",
    tooltipSubtitle: "Citizen Scientists & Polar Research Fellows",
    dest: "dashboard",
  },
]

const MKB_LISTEN_EPISODES = [
  {
    id: 126,
    episodeNum: "EPISODE 126",
    broadcastDate: "28 Sep 2026",
    subheading: "Special Broadcast on Indian Polar Science & Innovation",
    heading: "PM Narendra Modi on Bharati, Maitri & Arctic Frontiers",
    title: "Mann Ki Baat: 126th Episode on 28th September 2026",
    desc: "In this special episode, Prime Minister shares inspiring stories of India's wintering scientists at Larsemann Hills, Antarctica, and advances in high-latitude climate telemetry.",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
  },
  {
    id: 125,
    episodeNum: "EPISODE 125",
    broadcastDate: "31 Aug 2026",
    subheading: "Samudrayaan & Deep Ocean Scientific Mission",
    heading: "PM Modi on Oceanic Explorations & Glacial Safeguards",
    title: "Mann Ki Baat: 125th Episode on 31st August 2026",
    desc: "Prime Minister highlights indigenous seabed sensors deployed across the Southern Ocean and congratulates younger generation researchers dedicated to Himalayan glacial preservation.",
    image:
      "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&q=80",
  },
  {
    id: 124,
    episodeNum: "EPISODE 124",
    broadcastDate: "27 Jul 2026",
    subheading: "Green Energy at Antarctica & Youth Innovation",
    heading: "PM on Zero-Carbon Polar Bases & AI Climate Analytics",
    title: "Mann Ki Baat: 124th Episode on 27th July 2026",
    desc: "Prime Minister discusses zero-emission microgrids installed at Maitri and Himadri stations, inviting student innovators to participate in the National Polar Science AI Datathon.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
]

const MKB_BOOKLETS = [
  {
    id: 125,
    edition: "125th Episode E-Booklet",
    badge: "Official Booklet",
    pubDate: "28 Sep 2026",
    theme: "Viksit Bharat & Cryosphere Frontiers",
    title: "Mann Ki Baat: 125th Episode E-Booklet",
    desc: "Download the comprehensive commemorative digital publication compiling citizen discussions on Viksit Bharat, environmental protection, and scientific exploration.",
    accentGradient: "from-[#2563EB] to-[#1D4ED8]",
    borderAccent: "border-[#1E40AF]",
  },
  {
    id: 124,
    edition: "124th Episode E-Booklet",
    badge: "Special Edition",
    pubDate: "31 Aug 2026",
    theme: "Himalayan Glacier Dynamics & Ocean Telemetry",
    title: "Mann Ki Baat: 124th Episode E-Booklet",
    desc: "An illustrated publication documenting national citizen initiatives on clean polar seas, Southern Ocean conservation, and Arctic Kongsfjorden atmospheric timeseries.",
    accentGradient: "from-[#0284C7] to-[#0369A1]",
    borderAccent: "border-[#075985]",
  },
  {
    id: 123,
    edition: "123rd Episode E-Booklet",
    badge: "Special Edition",
    pubDate: "27 Jul 2026",
    theme: "Youth Polar Fellows & Ice Core Discoveries",
    title: "Mann Ki Baat: 123rd Episode E-Booklet",
    desc: "A rich collection of firsthand field diaries from young Indian Antarctic wintering expeditioners, drilling engineers, and community climate volunteers across India.",
    accentGradient: "from-[#4338CA] to-[#312E81]",
    borderAccent: "border-[#3730A3]",
  },
]

export default function LandingPage({
  onNavigate,
  onSearch,
}: LandingPageProps) {
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHeroPlaying, setIsHeroPlaying] = useState(true)

  // Search State
  const [searchCategory, setSearchCategory] = useState("All Categories")
  const [searchKeyword, setSearchKeyword] = useState("")

  // Statistics Strip Active Tab
  const [activeStatIndex, setActiveStatIndex] = useState(2)

  // Marquee Ticker State
  const [isTickerPlaying, setIsTickerPlaying] = useState(true)
  const marqueeRef = useRef<any>(null)

  // Get Involved / Editorial Tabs
  const [activeTab, setActiveTab] = useState("tasks")

  // Leaflet Map State
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [activeStation, setActiveStation] = useState<StationInfo>(
    POLAR_STATIONS[0],
  )

  // Ask Polar AI Section State
  const [aiQuestion, setAiQuestion] = useState("")
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  // Mann Ki Baat Carousel States
  const [mkbListenSlide, setMkbListenSlide] = useState(0)
  const [mkbReadSlide, setMkbReadSlide] = useState(0)
  const [isMkbHovered, setIsMkbHovered] = useState(false)
  const [inFocusSlide, setInFocusSlide] = useState(0)
  const [quizSlide, setQuizSlide] = useState(0)
  const [pollSelected, setPollSelected] = useState("dakshin")
  const [pollVoted, setPollVoted] = useState(false)
  const [activePodcastId, setActivePodcastId] = useState<number | null>(null)
  const [socialSlide, setSocialSlide] = useState(0)
  const [mediaModalOpen, setMediaModalOpen] = useState(false)

  // Modals & Drawers
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Header Dropdown States
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [accessibilityDropdownOpen, setAccessibilityDropdownOpen] =
    useState(false)
  const [socialMenuOpen, setSocialMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showLoginScreen, setShowLoginScreen] = useState(false)
  const [currentLang, setCurrentLang] = useState("English")
  const [contrastMode, setContrastMode] = useState<"normal" | "high" | "dark">(
    "normal",
  )
  const [fontSizeOffset, setFontSizeOffset] = useState(0)

  // Close header dropdowns on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        !target.closest(".lang-switcher-block") &&
        !target.closest(".user_accessibility") &&
        !target.closest(".site_share") &&
        !target.closest(".user-block") &&
        !target.closest(".hamburger") &&
        !target.closest(".megamenu-wrap")
      ) {
        setLangMenuOpen(false)
        setAccessibilityDropdownOpen(false)
        setSocialMenuOpen(false)
        setUserMenuOpen(false)
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener("click", handleDocClick)
    return () => document.removeEventListener("click", handleDocClick)
  }, [])

  // Autoplay Hero
  useEffect(() => {
    if (!isHeroPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isHeroPlaying])

  // Synchronize Marquee play/pause
  useEffect(() => {
    if (!marqueeRef.current) return
    try {
      if (isTickerPlaying) {
        marqueeRef.current.start?.()
      } else {
        marqueeRef.current.stop?.()
      }
    } catch {
      // Safe fallback
    }
  }, [isTickerPlaying])

  // Mann Ki Baat Autoplay Carousel
  useEffect(() => {
    if (isMkbHovered) return
    const timer = setInterval(() => {
      setMkbListenSlide((prev) => (prev + 1) % MKB_LISTEN_EPISODES.length)
      setMkbReadSlide((prev) => (prev + 1) % MKB_BOOKLETS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isMkbHovered])

  // Scroll listener for Back to Top
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const map = L.map(mapContainerRef.current, {
      center: [-15, 45],
      zoom: 2,
      minZoom: 1,
      maxZoom: 9,
      scrollWheelZoom: false,
    })
    mapRef.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors | MoES / NCPOR",
    }).addTo(map)

    POLAR_STATIONS.forEach((station) => {
      const pinColor =
        station.id === "bharati" || station.id === "maitri"
          ? "#1D4ED8"
          : station.id === "himadri"
            ? "#2563EB"
            : station.id === "himansh"
              ? "#059669"
              : "#64748B"

      const customPin = L.divIcon({
        className: "custom-polar-marker",
        html: `
          <div style="background-color: ${pinColor}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="width: 8px; height: 8px; background: #FFFFFF; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const marker = L.marker([station.lat, station.lng], {
        icon: customPin,
      }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; max-width: 220px;">
          <div style="font-weight: 700; font-size: 13px; color: #0F172A;">${station.name}</div>
          <div style="font-size: 11px; color: #2563EB; margin-bottom: 4px; font-weight: 600;">${station.region}</div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${station.description}</div>
          <div style="font-size: 10px; font-weight: 600; color: #1D4ED8;">Focus: ${station.focus}</div>
        </div>
      `)

      marker.on("click", () => {
        setActiveStation(station)
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const handleSearchExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchKeyword.trim()) return
    if (onSearch) onSearch(searchKeyword.trim())
    if (searchCategory === "Expeditions") onNavigate("expeditions")
    else if (searchCategory === "Research") onNavigate("publications")
    else if (searchCategory === "Datasets") onNavigate("datasets")
    else if (searchCategory === "Media") onNavigate("media")
    else if (searchCategory === "Education") onNavigate("education")
    else onNavigate("publications")
  }

  const handleAskPolarSubmit = (promptText?: string) => {
    const query = promptText || aiQuestion
    if (!query.trim()) return
    setAiQuestion(query)
    setAiLoading(true)
    setAiAnswer(null)

    setTimeout(() => {
      if (
        query.toLowerCase().includes("antarctica") ||
        query.toLowerCase().includes("research")
      ) {
        setAiAnswer(
          "India's Antarctic research is conducted across Maitri (Schirmacher Oasis, est. 1989) and Bharati (Larsemann Hills, est. 2012) stations. Primary scientific programmes include paleoclimate ice core analysis, aerosol-cloud radiative forcing, Southern Ocean hydrography, and extremophile microbiology, coordinated under 46 annual expeditions by NCPOR.",
        )
      } else if (
        query.toLowerCase().includes("dataset") ||
        query.toLowerCase().includes("linked")
      ) {
        setAiAnswer(
          "Datasets linked to Indian polar expeditions include high-resolution CTD profiles, Automated Weather Station (AWS) surface meteorology, NetCDF sea-ice concentration arrays (Prydz Bay & Weddell Sea), and ice-core stable isotope proxies (delta-18O, delta-D) hosted in NCPOR's FAIR-compliant scientific repository.",
        )
      } else if (
        query.toLowerCase().includes("biodiversity") ||
        query.toLowerCase().includes("student")
      ) {
        setAiAnswer(
          "Polar biodiversity features organisms adapted to extreme freezing temperatures: Antarctic waters support massive swarms of Antarctic Krill (Euphausia superba), Adélie and Emperor penguins, and Weddell seals, while Arctic fjords support polar bears, ringed seals, and specialized psychrophilic bacteria.",
        )
      } else if (
        query.toLowerCase().includes("station") ||
        query.toLowerCase().includes("himadri") ||
        query.toLowerCase().includes("himansh")
      ) {
        setAiAnswer(
          "India operates 4 permanent stations: Maitri & Bharati in East Antarctica; Himadri in Ny-Ålesund, Svalbard (Arctic, 79°N); and Himansh at 4,080m in the Western Himalayas (Spiti Valley). Each station is equipped with dedicated automated sensors and satellite communications.",
        )
      } else {
        setAiAnswer(
          `Scientific query grounded in NCPOR research publications and observational repositories: Multi-year observational records confirm active Indian research addressing "${query}". Explore the full Polar AI assistant to examine exact research citations, sensor telemetry, and data matrices.`,
        )
      }
      setAiLoading(false)
    }, 550)
  }
  if (showLoginScreen) {
    return (
      <CmlreBackboneLogin
        onBackToHome={() => setShowLoginScreen(false)}
        onLoginSuccess={(_role, _email) => {
          setShowLoginScreen(false)
          onNavigate("dashboard")
        }}
        onOpenAI={() => {
          setShowLoginScreen(false)
          onNavigate("ai")
        }}
      />
    )
  }

  return (
    <div
      className={`min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col font-sans selection:bg-[#E0F2FE] selection:text-[#0F172A] ${
        contrastMode === "high" ? "contrast-125" : ""
      } ${
        fontSizeOffset === 1
          ? "text-[1.05rem]"
          : fontSizeOffset === -1
            ? "text-[0.95rem]"
            : ""
      }`}
    >
      {/* ================================================================
          OFFICIAL MYGOV RADIX INSTITUTIONAL HEADER (NCPOR PORTAL)
      ================================================================ */}
      <header className="header sticky" role="banner">
        {/* MAIN HEADER (Logo, Search, Hamburger & User) */}
        <div className="main-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="header-search-block">
              {/* Left: Ashoka Lion Emblem + NCPOR Institutional Branding */}
              <div
                className="flex items-center gap-2.5 sm:gap-3 cursor-pointer flex-shrink-0"
                onClick={() => onNavigate("landing")}
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

              {/* Center: Exact MyGov Search Bar Wrapper */}
              <div className="mygov-search-wrapper">
                <form
                  onSubmit={handleSearchExecute}
                  className="flex items-center w-full h-full"
                >
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search in MyGov"
                    className="form-textfield"
                  />
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="form-select hidden md:block"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Expeditions">Expeditions</option>
                    <option value="Research">Research</option>
                    <option value="Datasets">Datasets</option>
                    <option value="Media">Media</option>
                    <option value="Education">Education</option>
                  </select>
                  <button type="submit" className="form-submit btn-primary">
                    Search
                  </button>
                </form>
              </div>

              {/* Right: Hamburger Menu & User Profile Account */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Animated Hamburger Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMegaMenuOpen(!megaMenuOpen)
                    setUserMenuOpen(false)
                    setLangMenuOpen(false)
                    setAccessibilityDropdownOpen(false)
                    setSocialMenuOpen(false)
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
                      setLangMenuOpen(false)
                      setAccessibilityDropdownOpen(false)
                      setSocialMenuOpen(false)
                    }}
                    className="user-log"
                    title="Scientist / Staff Portal Login"
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

                  {userMenuOpen && (
                    <div className="login-details animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="font-bold text-sm text-gray-900 mb-1">
                        NCPOR Scientist & Citizen Portal
                      </div>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        Sign in to access researcher workspace, scientific data
                        telemetry, Antarctic cruise clearances, and research
                        proposals.
                      </p>
                      <div className="login-link-wrapper mb-3">
                        <a
                          href="#login"
                          onClick={(e) => {
                            e.preventDefault()
                            setUserMenuOpen(false)
                            setShowLoginScreen(true)
                          }}
                          className="ac-login"
                        >
                          Log in / Register
                        </a>
                      </div>
                      <div className="border-t border-gray-100 pt-2 text-xs text-gray-600 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            onNavigate("expeditions")
                          }}
                          className="block w-full text-left hover:text-[#1D4ED8] transition-colors py-0.5 font-medium"
                        >
                          Expedition Operations
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            onNavigate("datasets")
                          }}
                          className="block w-full text-left hover:text-[#1D4ED8] transition-colors py-0.5 font-medium"
                        >
                          Polar Data Repositories
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false)
                            onNavigate("ai")
                          }}
                          className="block w-full text-left hover:text-[#1D4ED8] transition-colors py-0.5 font-medium"
                        >
                          Polar AI Scientific Assistant
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                        onNavigate("expeditions")
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
                        onNavigate("expeditions")
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
                        onNavigate("map")
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
                        onNavigate("map")
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
                        onNavigate("map")
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
                        onNavigate("map")
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
                        onNavigate("expeditions")
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
                        onNavigate("datasets")
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
                        onNavigate("datasets")
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
                        onNavigate("datasets")
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
                        onNavigate("datasets")
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
                        onNavigate("datasets")
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
                        onNavigate("datasets")
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
                        onNavigate("datasets")
                      }}
                    >
                      Open Research API Access <span>→</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="megamenu_item">
                <h2>Research & Publications</h2>
                <ul>
                  <li>
                    <a
                      href="#publications"
                      onClick={(e) => {
                        e.preventDefault()
                        setMegaMenuOpen(false)
                        onNavigate("publications")
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
                        onNavigate("publications")
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
                        onNavigate("publications")
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
                        onNavigate("publications")
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
                        onNavigate("publications")
                      }}
                    >
                      SCAR & IASC Scientific Groups <span>→</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#publications"
                      onClick={(e) => {
                        e.preventDefault()
                        setMegaMenuOpen(false)
                        onNavigate("publications")
                      }}
                    >
                      Southern Ocean Hydrography <span>→</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="megamenu_item">
                <h2>Outreach & Education</h2>
                <ul>
                  <li>
                    <a
                      href="#education"
                      onClick={(e) => {
                        e.preventDefault()
                        setMegaMenuOpen(false)
                        onNavigate("education")
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
                        onNavigate("education")
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
                        onNavigate("media")
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
                        onNavigate("education")
                      }}
                    >
                      Educational Wall Posters & Kits <span>→</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#media"
                      onClick={(e) => {
                        e.preventDefault()
                        setMegaMenuOpen(false)
                        onNavigate("media")
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
                        onNavigate("ai")
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
                        onNavigate("about")
                      }}
                    >
                      Mandate & Institutional Charter <span>→</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault()
                        setMegaMenuOpen(false)
                        onNavigate("about")
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
                        onNavigate("about")
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
                        onNavigate("about")
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
                        onNavigate("about")
                      }}
                    >
                      RTI & Public Disclosures <span>→</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault()
                        setMegaMenuOpen(false)
                        onNavigate("about")
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
      </header>

      {/* ================================================================
          RIGHT FLOATING ACTION TOOLBAR (Matching official MyGov sidebar)
      ================================================================ */}
      <div className="floating-sidebar-toolbar fixed right-2.5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2 select-none">
        <button
          type="button"
          onClick={() => onNavigate("ai")}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-[#1D4ED8] hover:border-[#1D4ED8] flex items-center justify-center transition-all hover:scale-105"
          title="Ask AI & Explore"
          aria-label="Contribute / Add"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-4 h-4"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("publications")}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-amber-500 hover:border-amber-400 flex items-center justify-center transition-all hover:scale-105"
          title="Featured Highlights"
          aria-label="Highlights"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-amber-500"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("events")}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-[#1D4ED8] hover:border-[#1D4ED8] flex items-center justify-center transition-all hover:scale-105"
          title="Calendar & Upcoming Events"
          aria-label="Events"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4 text-[#1D4ED8]"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("education")}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-blue-600 hover:border-blue-500 flex items-center justify-center transition-all hover:scale-105"
          title="Student Quizzes & Pledges"
          aria-label="Quizzes"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4 text-blue-600"
          >
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setFeedbackModalOpen(true)}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-emerald-600 hover:border-emerald-500 flex items-center justify-center transition-all hover:scale-105"
          title="Helpdesk & Citizen Support"
          aria-label="Helpdesk"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4 text-emerald-600"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
      </div>
      {/* Main Content Anchor */}
      <main id="main-content" className="flex-1">
        {/* ================================================================
            3. EXACT HERO CAROUSEL (With Terracotta Navigation Chevrons)
        ================================================================ */}
        <section className="relative h-[430px] sm:h-[460px] bg-slate-900 overflow-hidden select-none">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.heading}
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle dark image overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent"></div>

              {/* Text Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl text-white">
                    {slide.isGrandBanner ? (
                      <div className="mb-4">
                        <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-white/90 mb-1">
                          {slide.topTag}
                        </div>
                        <div className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#93C5FD] leading-none mb-1">
                          {slide.highlightText}
                        </div>
                        <div className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                          {slide.serifHeading}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs font-extrabold uppercase tracking-widest text-[#93C5FD] mb-2">
                          {slide.label}
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
                          {slide.heading}
                        </h1>
                      </>
                    )}
                    <p className="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Terracotta Button */}
                      <button
                        onClick={() => onNavigate(slide.primaryDest)}
                        className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1e3a8a] text-white font-semibold text-xs transition-colors shadow-sm"
                      >
                        {slide.primaryCta}
                      </button>
                      <button
                        onClick={() => onNavigate(slide.secondaryDest)}
                        className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/40 text-white font-semibold text-xs transition-colors"
                      >
                        {slide.secondaryCta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* EXACT Terracotta Circular Chevrons (< and >) Matching Reference Screenshot */}
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
              )
            }
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#2563EB]/85 hover:bg-[#2563EB] text-white flex items-center justify-center transition-all shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.8}
              className="w-5 h-5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
            }
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#2563EB]/85 hover:bg-[#2563EB] text-white flex items-center justify-center transition-all shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.8}
              className="w-5 h-5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Circular Pause Button in the bottom right corner of carousel */}
          <button
            onClick={() => setIsHeroPlaying((prev) => !prev)}
            className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white flex items-center justify-center shadow-md transition-colors"
            title={isHeroPlaying ? "Pause Carousel" : "Play Carousel"}
            aria-label="Pause Carousel"
          >
            {isHeroPlaying ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5 pl-0.5"
              >
                <polygon points="6 4 19 12 6 20 6 4" />
              </svg>
            )}
          </button>
        </section>

        {/* ================================================================
            4. EXACT STATISTICS STRIP (White Card Floating Below Hero)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30 mb-6">
          <div className="bg-white rounded-2xl shadow-md border border-[#E2E8F0] p-4 sm:p-5 relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] text-center">
              {LANDING_REPO_STATS.map((stat, idx) => {
                const isActive = activeStatIndex === idx
                return (
                  <div
                    key={stat.id}
                    onMouseEnter={() => setActiveStatIndex(idx)}
                    onClick={() => {
                      setActiveStatIndex(idx)
                      onNavigate(stat.dest)
                    }}
                    className="py-2.5 px-3 cursor-pointer group relative hover:bg-slate-50/80 rounded-xl transition-all"
                  >
                    {/* Active Tooltip Badge */}
                    {isActive && (
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-white px-2.5 py-1 rounded-md shadow-md border border-[#CBD5E1] text-[10px] text-[#059669] font-bold whitespace-nowrap hidden sm:block z-20 pointer-events-none animate-in fade-in duration-150">
                        {stat.tooltipTitle}
                        <div className="text-[9px] text-[#475569] font-normal">
                          {stat.tooltipSubtitle}
                        </div>
                      </div>
                    )}

                    <div className="text-xl sm:text-2xl font-bold text-[#456EDE] tracking-tight group-hover:text-[#1D4ED8] transition-colors">
                      {stat.value}
                      {stat.suffix && (
                        <span className="text-xs font-normal text-[#456EDE] ml-1">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-[#1E293B] uppercase tracking-wide mt-1 group-hover:text-[#1D4ED8] transition-colors">
                      {stat.label}
                    </div>
                    {isActive && (
                      <div className="w-12 h-1 bg-[#2563EB] mx-auto mt-2 rounded-full"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================================================================
            5. EXACT NEWS / ANNOUNCEMENT TICKER (Sky Blue #D7ECFB) - MARQUEE
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-[#D7ECFB] border border-[#BFDBFE] rounded-lg px-4 py-2 flex items-center justify-between gap-3 text-xs text-[#0F172A] relative overflow-hidden">
            {/* Circular Black Pause / Play Button on Left */}
            <div className="flex items-center gap-2 relative z-10 bg-[#D7ECFB] pr-2 flex-shrink-0">
              <button
                onClick={() => setIsTickerPlaying((prev) => !prev)}
                className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 hover:bg-slate-800"
                title={isTickerPlaying ? "Pause marquee" : "Resume marquee"}
                aria-label={
                  isTickerPlaying ? "Pause marquee" : "Resume marquee"
                }
              >
                {isTickerPlaying ? (
                  <span className="text-[9px] font-bold font-mono leading-none">
                    ||
                  </span>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-2.5 h-2.5 ml-0.5"
                  >
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                )}
              </button>
            </div>

            {/* Native Flowing Marquee Track */}
            <div
              className="overflow-hidden flex-1 relative flex items-center min-w-0"
              onMouseEnter={() => {
                try {
                  marqueeRef.current?.stop?.()
                } catch {
                  // ignore
                }
              }}
              onMouseLeave={() => {
                try {
                  if (isTickerPlaying) marqueeRef.current?.start?.()
                } catch {
                  // ignore
                }
              }}
            >
              <MarqueeTag
                ref={marqueeRef}
                {...{
                  direction: "left",
                  scrollamount: "6",
                  behavior: "scroll",
                } as any}
                className="w-full flex items-center cursor-pointer"
              >
                <div className="inline-flex items-center gap-10 text-xs font-medium text-[#0F172A] py-0.5">
                  {TICKER_ANNOUNCEMENTS.map((announcement, i) => (
                    <span
                      key={i}
                      onClick={() => onNavigate("news")}
                      className="inline-flex items-center gap-3 hover:text-[#2563EB] hover:underline transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      <span>{announcement}</span>
                    </span>
                  ))}
                </div>
              </MarqueeTag>
            </div>

            {/* View All Button on Right with Gradient Fade */}
            <div className="relative z-10 flex-shrink-0 bg-gradient-to-l from-[#D7ECFB] via-[#D7ECFB] to-transparent pl-4">
              <button
                onClick={() => onNavigate("news")}
                className="text-[#2563EB] hover:underline font-bold text-xs flex-shrink-0"
              >
                View All
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================
            6. EXACT "GET INVOLVED" EDITORIAL SECTION (Matching Reference)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {/* Large White Rounded Container */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
            {/* Section Heading */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight uppercase">
                GET INVOLVED
              </h2>
              <p className="text-sm text-[#4B5563] mt-1.5 font-normal">
                Participate in nation-building activities
              </p>
            </div>

            {/* Split layout: Left Category Pills + Right Editorial Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Category Pills */}
              <div className="lg:col-span-3 space-y-3">
                {INVOLVE_TABS.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <div key={tab.id} className="relative">
                      {/* Floating Amber Pill Badge */}
                      <span className="absolute -top-2 left-4 z-10 bg-[#BFDBFE] text-[#1E40AF] text-[10px] font-bold px-2 py-0.2 rounded-full shadow-2xs">
                        {tab.count}
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab(tab.id)
                          onNavigate(tab.dest)
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1] shadow-xs"
                            : "bg-white border-[#E2E8F0] text-[#334155] hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isActive ? "bg-[#0284C7]" : "bg-slate-300"
                            }`}
                          />
                          <span>{tab.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">›</span>
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Right Column: Editorial Task Card */}
              <div className="lg:col-span-9">
                {/* Header row with Title + Orange Icons */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]">
                  <div className="w-full text-center">
                    <h3 className="text-xl font-bold text-[#1F2937] mb-1">
                      {INVOLVE_TABS.find((t) => t.id === activeTab)?.label ||
                        "Do/Tasks"}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4B5563]">
                      {INVOLVE_TABS.find((t) => t.id === activeTab)?.subhead ||
                        "Find a variety of online & on ground skill-building tasks, activities & contests"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onNavigate("education")}
                      className="w-7 h-7 rounded-full border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white flex items-center justify-center transition-colors"
                      title="View all"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onNavigate("education")}
                      className="w-7 h-7 rounded-full border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white flex items-center justify-center transition-colors"
                      title="Grid view"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Task Card 1 (Exact Layout from Reference Image 1 & 2) */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5 mb-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:shadow-md transition-shadow">
                  <div className="md:col-span-7 flex flex-col justify-between h-full">
                    <div>
                      {/* Badges: Submission Open (Green) + Date (Off-white) */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#B2DFB6] text-[#1E4620] px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.2}
                            className="w-3.5 h-3.5"
                          >
                            <path d="M9 18h6" />
                            <path d="M10 22h4" />
                            <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
                          </svg>
                          <span>Submission Open</span>
                        </span>
                        <span className="bg-[#F8F9FA] text-[#495057] px-3.5 py-1 rounded-full text-xs font-medium border border-slate-200">
                          Sep 25, 2026 - Oct 05, 2026
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-[#212529] mb-1 leading-snug">
                        Essay Competition - 12 Years of Indian Polar Missions
                      </h4>
                      <div className="text-xs font-medium text-[#495057] mb-2">
                        Ministry of Earth Sciences · NCPOR
                      </div>
                      <p className="text-xs text-[#495057] leading-relaxed line-clamp-2">
                        Theme: "12 Years of Indian Polar Frontiers: From Maitri
                        to Bharati and Himadri — Advancing Cryospheric Science
                        for the Nation".
                      </p>
                    </div>

                    {/* Terracotta Action Button: Make Your Contribution → */}
                    <div className="mt-5 flex items-center justify-between">
                      <button
                        onClick={() => onNavigate("education")}
                        className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1e3a8a] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
                      >
                        <span>Make Your Contribution</span>
                        <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-[10px]">
                          →
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href)
                          alert("Link copied to clipboard!")
                        }}
                        className="w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                        title="Share"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Right Poster Graphic */}
                  <div className="md:col-span-5 h-44 rounded-xl overflow-hidden border border-[#E2E8F0] relative bg-[#EFF6FF] flex items-center justify-center p-4">
                    <img
                      src="https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=600&q=80"
                      alt="Essay Competition"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col justify-end p-4 text-white">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                        National Contest
                      </div>
                      <div className="text-sm font-extrabold leading-tight">
                        ESSAY COMPETITION: 12 YEARS OF POLAR MISSIONS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Card 2 (Exact Layout from Reference Image 3) */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:shadow-md transition-shadow">
                  <div className="md:col-span-7 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#B2DFB6] text-[#1E4620] px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.2}
                            className="w-3.5 h-3.5"
                          >
                            <path d="M9 18h6" />
                            <path d="M10 22h4" />
                            <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
                          </svg>
                          <span>Submission Open</span>
                        </span>
                        <span className="bg-[#F8FAFC] text-[#495057] px-3.5 py-1 rounded-full text-xs font-medium border border-slate-200">
                          Sep 25, 2026 - Oct 05, 2026
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-[#212529] mb-1 leading-snug">
                        Photo Story and Citizen Storytelling Contest 2026
                      </h4>
                      <div className="text-xs font-medium text-[#495057] mb-2">
                        Ministry of Earth Sciences · NCPOR
                      </div>
                      <p className="text-xs text-[#495057] leading-relaxed line-clamp-2">
                        Format: Photo Story / Citizen Storytelling Contest ·
                        Category: Creative Arts & Polar Heritage Documentation.
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <button
                        onClick={() => onNavigate("education")}
                        className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1e3a8a] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
                      >
                        <span>Make Your Contribution</span>
                        <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-[10px]">
                          →
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href)
                          alert("Link copied to clipboard!")
                        }}
                        className="w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                        title="Share"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Right Poster Graphic 2 */}
                  <div className="md:col-span-5 h-44 rounded-xl overflow-hidden border border-[#E2E8F0] relative bg-[#EFF6FF] flex items-center justify-center p-4">
                    <img
                      src="https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=600&q=80"
                      alt="Photo Story"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col justify-end p-4 text-white">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                        Creative Contest
                      </div>
                      <div className="text-sm font-extrabold leading-tight">
                        PHOTO STORY & CITIZEN STORYTELLING CONTEST
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            7. MANN KI BAAT (Official MyGov Radio & E-Booklet Dialogue)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="mb-6 text-left">
            <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#111827] tracking-tight">
              Mann Ki Baat
            </h2>
            <p className="text-sm text-[#4B5563] mt-1.5 font-normal">
              Touching Lives, Sharing Stories and Celebrating Achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Listen to Mann Ki Baat (Image Carousel) */}
            <div
              onMouseEnter={() => setIsMkbHovered(true)}
              onMouseLeave={() => setIsMkbHovered(false)}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Carousel Container */}
                <div className="relative h-56 bg-slate-900 overflow-hidden group">
                  {MKB_LISTEN_EPISODES.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                        mkbListenSlide === idx
                          ? "opacity-100 z-10 pointer-events-auto"
                          : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-between p-4">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#1D4ED8] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3 h-3"
                            >
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                            <span>Listen to Mann Ki Baat</span>
                          </span>
                          <span className="bg-black/60 text-white/90 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                            {item.episodeNum}
                          </span>
                        </div>

                        <div className="text-white">
                          <div className="text-[11px] text-[#BFDBFE] font-bold uppercase tracking-wider mb-1">
                            {item.subheading}
                          </div>
                          <div className="text-base sm:text-lg font-bold leading-tight line-clamp-1">
                            {item.heading}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Carousel Left Navigation Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMkbListenSlide((prev) =>
                        prev === 0 ? MKB_LISTEN_EPISODES.length - 1 : prev - 1,
                      )
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 shadow-md backdrop-blur-xs"
                    title="Previous episode"
                    aria-label="Previous episode"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-4 h-4"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {/* Carousel Right Navigation Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMkbListenSlide(
                        (prev) => (prev + 1) % MKB_LISTEN_EPISODES.length,
                      )
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 shadow-md backdrop-blur-xs"
                    title="Next episode"
                    aria-label="Next episode"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-4 h-4"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-3.5 h-3.5 text-[#1D4ED8]"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>
                      Broadcast Date:{" "}
                      {MKB_LISTEN_EPISODES[mkbListenSlide].broadcastDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111827] mb-2 leading-snug">
                    {MKB_LISTEN_EPISODES[mkbListenSlide].title}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2">
                    {MKB_LISTEN_EPISODES[mkbListenSlide].desc}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#F1F5F9] flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onNavigate("media")}
                    className="px-5 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Watch Now</span>
                  </button>
                  <button
                    onClick={() => onNavigate("news")}
                    className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#334155] text-xs font-semibold transition-colors"
                  >
                    Read
                  </button>
                  <button
                    onClick={() => onNavigate("media")}
                    className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#334155] text-xs font-semibold transition-colors ml-auto"
                  >
                    View All
                  </button>
                </div>

                {/* Clickable Carousel Dots */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {MKB_LISTEN_EPISODES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setMkbListenSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        mkbListenSlide === i
                          ? "w-6 bg-[#1D4ED8]"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Read Mann Ki Baat (Booklet Carousel) */}
            <div
              onMouseEnter={() => setIsMkbHovered(true)}
              onMouseLeave={() => setIsMkbHovered(false)}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Booklet Image Carousel Container */}
                <div className="relative h-56 bg-gradient-to-br from-[#1E293B] to-[#0F172A] overflow-hidden group flex items-center justify-center p-4">
                  {MKB_BOOKLETS.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-500 ease-in-out ${
                        mkbReadSlide === idx
                          ? "opacity-100 z-10 pointer-events-auto"
                          : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <div
                        className={`w-40 h-48 bg-gradient-to-r ${item.accentGradient} rounded-r-lg shadow-2xl border-l-4 ${item.borderAccent} p-4 text-white flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black uppercase tracking-widest text-amber-200">
                            {item.badge}
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-white/90"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" />
                          </svg>
                        </div>
                        <div className="my-auto">
                          <div className="text-[10px] font-extrabold uppercase leading-tight text-white">
                            Mann Ki Baat
                          </div>
                          <div className="text-[8px] text-amber-100 font-medium">
                            {item.edition}
                          </div>
                          <div className="text-[7px] text-sky-200 mt-1 line-clamp-1">
                            {item.theme}
                          </div>
                        </div>
                        <div className="text-[7px] text-white/80 border-t border-white/20 pt-1 font-mono">
                          Government of India
                        </div>
                      </div>

                      <span className="absolute top-4 left-4 bg-[#1D4ED8] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5 z-20">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-3 h-3"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <span>Read Mann Ki Baat</span>
                      </span>

                      <span className="absolute top-4 right-4 bg-black/60 text-white/90 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs z-20">
                        {item.edition.split(" ")[0]}
                      </span>
                    </div>
                  ))}

                  {/* Carousel Left Navigation Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMkbReadSlide((prev) =>
                        prev === 0 ? MKB_BOOKLETS.length - 1 : prev - 1,
                      )
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 shadow-md backdrop-blur-xs"
                    title="Previous booklet"
                    aria-label="Previous booklet"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-4 h-4"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {/* Carousel Right Navigation Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMkbReadSlide(
                        (prev) => (prev + 1) % MKB_BOOKLETS.length,
                      )
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 shadow-md backdrop-blur-xs"
                    title="Next booklet"
                    aria-label="Next booklet"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-4 h-4"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-3.5 h-3.5 text-[#1D4ED8]"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>
                      Publication Date: {MKB_BOOKLETS[mkbReadSlide].pubDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111827] mb-2 leading-snug">
                    {MKB_BOOKLETS[mkbReadSlide].title}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2">
                    {MKB_BOOKLETS[mkbReadSlide].desc}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#F1F5F9] flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onNavigate("publications")}
                    className="px-5 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-3.5 h-3.5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>View PDF</span>
                  </button>
                  <button
                    onClick={() => onNavigate("publications")}
                    className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#334155] text-xs font-semibold transition-colors"
                  >
                    Hindi
                  </button>
                  <button
                    onClick={() => onNavigate("publications")}
                    className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#334155] text-xs font-semibold transition-colors ml-auto"
                  >
                    View All
                  </button>
                </div>

                {/* Clickable Carousel Dots */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {MKB_BOOKLETS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setMkbReadSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        mkbReadSlide === i
                          ? "w-6 bg-[#1D4ED8]"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to booklet ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            8. MYGOV MEDIA (Exact Layout & Typography matching official MyGov)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="mb-6 text-left">
            <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#111827] tracking-tight">
              MyGov Media
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] mt-1.5 font-normal">
              Connecting citizens and government through the power of media
            </p>
          </div>

          {/* Featured Video Card matching official MyGov */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden mb-8 p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left 6 cols: Video Player with bottom control strip */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-sm bg-black group aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80"
                  alt="The Untold Stories of Indian History & Polar Exploration"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-95"
                />

                {/* Center Big Play Button on hover */}
                <button
                  type="button"
                  onClick={() => onNavigate("media")}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all hover:scale-110 shadow-xl border border-white/30"
                  aria-label="Play Video"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 ml-0.5"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>

                {/* Bottom Video Progress & Control Bar exactly as in screenshot */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-white hover:text-[#1D4ED8] transition-colors"
                      aria-label="Play"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                    <span className="font-mono text-[11px] text-white/90">
                      0:00 / 1:35:13
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-white hover:text-white/80"
                      aria-label="Volume"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-3.5 h-3.5"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="text-white hover:text-white/80"
                      aria-label="Fullscreen"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-3.5 h-3.5"
                      >
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 6 cols: Title, Channel, Download, Metadata */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] leading-snug">
                  Digital India&apos;s New Frontier: How AI Is Preserving Our
                  Ancient History | Dr. Vikram Sampath
                </h3>

                {/* Channel Row matching official screenshot */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-6 h-8 flex flex-col items-center justify-center flex-shrink-0 text-[#1E293B]">
                    <svg viewBox="0 0 40 48" fill="none" className="w-5 h-7">
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
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-sm text-[#0F172A]">
                      my
                    </span>
                    <span className="font-black text-sm text-[#1D4ED8]">
                      GOV
                    </span>
                    <span className="text-[10px] text-[#1A3C6E] font-semibold -ml-0.5">
                      मेरी सरकार
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#111827] ml-2">
                    MyGov India
                  </span>
                  {/* Verified Badge */}
                  <span className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      className="w-2.5 h-2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("media")}
                    className="w-10 h-10 rounded-full border border-[#CBD5E1] text-[#475569] hover:bg-slate-50 flex items-center justify-center transition-colors"
                    title="Share Video"
                    aria-label="Share"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate("media")}
                    className="px-5 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
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
                    <span>Download</span>
                  </button>
                </div>

                {/* Metadata Lines */}
                <div className="pt-2 text-xs text-[#4B5563] space-y-1">
                  <div>Video Size : 280.7 MB | Video Resolution : 1280x720</div>
                  <div>Published Date: 26 Aug 2026</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            15. I TOOK THE PLEDGE (Soft Warm Beige Background Section)
        ================================================================ */}
        <section className="bg-[#FAF8F2] py-12 mb-14 border-y border-[#EFE8D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 text-left">
              <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#111827] tracking-tight">
                I Took The Pledge
              </h2>
              <p className="text-sm text-[#4B5563] mt-1.5 font-normal">
                Come on, let&apos;s make a commitment to preserve our planet and
                polar environments
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Stat Card (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EFE8D8] shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8] mb-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-7 h-7"
                    >
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-[#1D4ED8] tracking-tight mb-1">
                    270.70{" "}
                    <span className="text-base font-semibold text-[#1D4ED8]">
                      + LAKH
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#1E293B] uppercase tracking-wide mb-6">
                    TOTAL PLEDGES TAKEN
                  </div>

                  {/* Gender Breakdown */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3.5 h-3.5 text-[#1D4ED8]"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                          <span>Male</span>
                        </span>
                        <span>152.40 + LAKH (56.3%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1D4ED8] w-[56.3%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3.5 h-3.5 text-[#EC4899]"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                          <span>Female</span>
                        </span>
                        <span>118.30 + LAKH (43.7%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#EC4899] w-[43.7%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <div className="text-[11px] text-[#64748B]">
                    Commitment to G20 Environmental and Antarctic Conservation
                    Goals.
                  </div>
                </div>
              </div>

              {/* Right 2x2 Grid of Pledge Cards (8 cols) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Pledge 1 */}
                <div className="bg-white rounded-2xl border border-[#EFE8D8] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="h-32 rounded-xl bg-slate-900 overflow-hidden relative mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=600&q=80"
                        alt="Antarctic Wilderness"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-bold leading-tight">
                          Antarctic Protocol
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#111827] mb-1.5 leading-snug">
                      Protect Antarctic Wilderness Pledge
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed mb-4 line-clamp-2">
                      I pledge to practice zero-waste, support ocean
                      conservation, and adhere to environmental protocols
                      preserving polar wildlife.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert(
                        "Congratulations! You have taken the Protect Antarctic Wilderness Pledge.",
                      )
                    }}
                    className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors"
                  >
                    Take Pledge
                  </button>
                </div>

                {/* Pledge 2 */}
                <div className="bg-white rounded-2xl border border-[#EFE8D8] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="h-32 rounded-xl bg-slate-900 overflow-hidden relative mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"
                        alt="Clean Oceans"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-bold leading-tight">
                          Polar Conservation
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#111827] mb-1.5 leading-snug">
                      Clean Oceans &amp; Polar Life Pledge
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed mb-4 line-clamp-2">
                      Commit to eliminating single-use plastics and protecting
                      polar ecosystems against microplastic infiltration.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert(
                        "Congratulations! You have taken the Clean Oceans & Polar Life Pledge.",
                      )
                    }}
                    className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors"
                  >
                    Take Pledge
                  </button>
                </div>

                {/* Pledge 3 */}
                <div className="bg-white rounded-2xl border border-[#EFE8D8] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="h-32 rounded-xl bg-slate-900 overflow-hidden relative mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&q=80"
                        alt="Carbon Reduction"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-bold leading-tight">
                          Climate Action
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#111827] mb-1.5 leading-snug">
                      Carbon Footprint Reduction Pledge
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed mb-4 line-clamp-2">
                      Pledge to adopt energy-saving habits and support
                      India&apos;s transition to net-zero renewable energy
                      across scientific centers.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert(
                        "Congratulations! You have taken the Carbon Footprint Reduction Pledge.",
                      )
                    }}
                    className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors"
                  >
                    Take Pledge
                  </button>
                </div>

                {/* Pledge 4 */}
                <div className="bg-white rounded-2xl border border-[#EFE8D8] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="h-32 rounded-xl bg-slate-900 overflow-hidden relative mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"
                        alt="Citizen Science"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-bold leading-tight">
                          Evidence-Based Science
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#111827] mb-1.5 leading-snug">
                      Citizen Science & Climate Action Pledge
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed mb-4 line-clamp-2">
                      Commit to learning, sharing, and advocating for
                      peer-reviewed polar science facts and inspiring the next
                      generation.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert(
                        "Congratulations! You have taken the Citizen Science & Climate Action Pledge.",
                      )
                    }}
                    className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors"
                  >
                    Take Pledge
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right mt-6">
              <button
                onClick={() => onNavigate("education")}
                className="px-6 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>View All Pledges</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================
            16. PODCAST FOR YOU (Audio Player Cards with Scientists)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight">
                Podcast For You
              </h2>
              <p className="text-sm text-[#4B5563] mt-1 font-normal">
                Listen to our podcast series featuring chief glaciologists,
                wintering expeditioners, and polar biologists
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="w-9 h-9 rounded-full border border-[#CBD5E1] text-[#334155] hover:bg-slate-100 flex items-center justify-center transition-colors"
                aria-label="Previous Podcast"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="w-4 h-4"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="w-9 h-9 rounded-full border border-[#CBD5E1] text-[#334155] hover:bg-slate-100 flex items-center justify-center transition-colors"
                aria-label="Next Podcast"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="w-4 h-4"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                title: "Surviving the Antarctic Winter at -40°C",
                speaker: "Dr. Thamban Meloth, Director NCPOR",
                image:
                  "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&q=80",
                duration: "14:32",
                size: "18.4 MB",
              },
              {
                id: 2,
                title: "High Arctic Warming & Svalbard Teleconnections",
                speaker: "Chief Arctic Scientist, Himadri Station",
                image:
                  "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&q=80",
                duration: "19:45",
                size: "22.1 MB",
              },
              {
                id: 3,
                title: "Deep Ocean Frontiers: Submersible MATSYA 6000",
                speaker: "Ocean Technology Group, MoES",
                image:
                  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
                duration: "22:10",
                size: "25.6 MB",
              },
              {
                id: 4,
                title: "Reading Earth's Past from 100,000-Year Ice Cores",
                speaker: "Paleoclimatology Division, NCPOR",
                image:
                  "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=600&q=80",
                duration: "16:50",
                size: "20.3 MB",
              },
            ].map((podcast) => (
              <div
                key={podcast.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-slate-900 relative overflow-hidden">
                    <img
                      src={podcast.image}
                      alt={podcast.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                        {podcast.speaker}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xs font-bold text-[#1E293B] mb-3 leading-snug line-clamp-2">
                      {podcast.title}
                    </h3>

                    {/* Audio Player Bar */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 flex items-center gap-2">
                      <button
                        onClick={() =>
                          setActivePodcastId(
                            activePodcastId === podcast.id ? null : podcast.id,
                          )
                        }
                        className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center flex-shrink-0 shadow-2xs hover:bg-[#1e40af]"
                        aria-label="Toggle Podcast Play"
                      >
                        {activePodcastId === podcast.id ? (
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <rect x="6" y="5" width="4" height="14" rx="1" />
                            <rect x="14" y="5" width="4" height="14" rx="1" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3.5 h-3.5 ml-0.5"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                          <div
                            className={`h-full bg-[#1D4ED8] ${
                              activePodcastId === podcast.id
                                ? "w-[45%] animate-pulse"
                                : "w-0"
                            }`}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-[#64748B] font-mono">
                          <span>
                            {activePodcastId === podcast.id ? "06:12" : "00:00"}
                          </span>
                          <span>{podcast.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>Audio MP3 · {podcast.size}</span>
                  <button
                    onClick={() => onNavigate("media")}
                    className="font-bold text-[#1D4ED8] hover:underline"
                  >
                    Listen →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mt-6">
            <button
              onClick={() => onNavigate("media")}
              className="px-6 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>View All Podcasts</span>
              <span>→</span>
            </button>
          </div>
        </section>

        {/* ================================================================
            17. TRENDING SOCIAL MEDIA (Twitter/X, Instagram, LinkedIn Hub)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight">
                Trending Social Media
              </h2>
              <p className="text-sm text-[#4B5563] mt-1 font-normal">
                Join Our Social Hub to stay up to date with live feeds from the
                poles
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="w-9 h-9 rounded-full border border-[#CBD5E1] text-[#334155] hover:bg-slate-100 flex items-center justify-center transition-colors"
                aria-label="Previous Social"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="w-4 h-4"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="w-9 h-9 rounded-full border border-[#CBD5E1] text-[#334155] hover:bg-slate-100 flex items-center justify-center transition-colors"
                aria-label="Next Social"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="w-4 h-4"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Social Card 1: Twitter / X */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-black flex items-center gap-1">
                        <span>NCPOR India</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="#1D9BF0"
                          className="w-3.5 h-3.5"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        @ncpor_goi · 2h ago
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    X / Twitter
                  </span>
                </div>

                <p className="text-xs text-[#1E293B] leading-relaxed mb-3">
                  Flagged off! The 46th Indian Scientific Expedition to
                  Antarctica sets sail from Cape Town. 42 scientists deployed to
                  Bharati & Maitri to monitor glaciological balance and
                  atmospheric ozone. #PolarScience #NCPOR
                </p>

                <div className="h-36 rounded-xl bg-slate-900 overflow-hidden mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80"
                    alt="Harbor Flagoff"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#64748B]">
                  <span>432 Reposts</span>
                  <span>2.8K Likes</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <a
                  href="https://twitter.com/moesgoi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors block text-center"
                >
                  View More on X
                </a>
              </div>
            </div>

            {/* Social Card 2: Instagram */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        ncpor.india
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        Larsemann Hills, Antarctica
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Instagram
                  </span>
                </div>

                <div className="h-44 rounded-xl bg-slate-900 overflow-hidden mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80"
                    alt="Aurora Australis"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-xs text-[#1E293B] leading-relaxed mb-2 line-clamp-2">
                  Southern Lights illuminating the Larsemann Hills sky over
                  Bharati Station. Wintering team conducting uninterrupted
                  telemetry...
                </p>

                <div className="text-[11px] font-semibold text-[#1E293B]">
                  14,892 likes
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors block text-center"
                >
                  View More on Instagram
                </a>
              </div>
            </div>

            {/* Social Card 3: LinkedIn */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0077B5] text-white flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        National Centre for Polar and Ocean Research
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        Government Agency · 1d ago
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    LinkedIn
                  </span>
                </div>

                <p className="text-xs text-[#1E293B] leading-relaxed mb-3">
                  NCPOR invites applications for Junior Research Fellows (JRF)
                  in Cryosphere & Paleoclimate Dynamics. Join India&apos;s
                  premier polar research missions. Apply online before October
                  31, 2026.
                </p>

                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-3">
                  <div className="text-xs font-bold text-[#0F172A] mb-0.5">
                    NCPOR Research Fellowships 2026
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    ncpor.gov.in · 5 min read
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#64748B]">
                  <span>856 Reactions</span>
                  <span>64 Comments</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors block text-center"
                >
                  View More on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            18. MG GROUPS (NCPOR Scientific Divisions & Ministry Hubs)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="mb-6 text-left">
            <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#111827] tracking-tight">
              MG Groups
            </h2>
            <p className="text-sm text-[#4B5563] mt-1.5 font-normal">
              Check out the Activities and Collaborations based on Research
              Groups
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Group 1 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8] mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-7 h-7"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 leading-snug">
                  Ministry of Earth Sciences (MoES)
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                  Parent ministry overseeing polar expeditions, ocean
                  atmospheric sciences, seismic networks, and meteorological
                  forecasting.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    12 Tasks
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    4 Discussions
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    8 Surveys
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate("about")}
                className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors"
              >
                Explore Group
              </button>
            </div>

            {/* Group 2 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8] mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-7 h-7"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 leading-snug">
                  Polar Sciences & Cryosphere Division
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                  Responsible for Maitri, Bharati, Himadri operations,
                  glaciological mass balance, and ice-core paleoclimate
                  archives.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    24 Tasks
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    6 Discussions
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    15 Surveys
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate("expeditions")}
                className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors"
              >
                Explore Group
              </button>
            </div>

            {/* Group 3 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-7 h-7"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 leading-snug">
                  Ocean Sciences & Polar Geophysics
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                  Managing hydrothermal vent mapping, Southern Ocean
                  hydrography, and national deep-sea exploration initiatives.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    18 Tasks
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    3 Discussions
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    9 Surveys
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate("datasets")}
                className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors"
              >
                Explore Group
              </button>
            </div>
          </div>

          <div className="text-right mt-6">
            <button
              onClick={() => onNavigate("about")}
              className="px-6 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>View All Groups</span>
              <span>→</span>
            </button>
          </div>
        </section>

        {/* ================================================================
            19. POLAR EXPLORER (Interactive Leaflet Map in White Container)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  POLAR EXPLORER & OBSERVATORIES
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] mt-1">
                  Discover Indian research stations and scientific activity
                  across Antarctica, the Arctic and the Himalayas
                </p>
              </div>

              <button
                onClick={() => onNavigate("map")}
                className="px-4 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors"
              >
                Launch Fullscreen Map →
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 h-[380px] rounded-xl overflow-hidden border border-[#E2E8F0] relative z-10">
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>

              <div className="lg:col-span-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      {activeStation.status}
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">
                      Est. {activeStation.established}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] mb-0.5">
                    {activeStation.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#1D4ED8] mb-3">
                    {activeStation.region}
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed mb-4">
                    {activeStation.description}
                  </p>

                  <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] mb-3">
                    <div className="text-[10px] font-bold text-[#64748B] uppercase mb-1">
                      Scientific Focus
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      {activeStation.focus}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => onNavigate("map")}
                    className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors text-center"
                  >
                    View Station on Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            20. ASK POLAR AI (Evidence-Grounded Scientific AI Assistant)
        ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#93C5FD] mb-1">
                EVIDENCE-GROUNDED SCIENTIFIC AI
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                ASK POLAR AI
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Explore trusted polar knowledge directly backed by 1,280+
                peer-reviewed papers and open datasets
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAskPolarSubmit()
                }}
                className="flex rounded-md overflow-hidden bg-white/10 border border-white/20 focus-within:border-[#1D4ED8] transition-all p-1"
              >
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Ask anything about polar science: e.g. What research has been conducted in Antarctica?"
                  className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="px-5 py-2 rounded bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors flex-shrink-0"
                >
                  {aiLoading ? "Consulting..." : "Ask Polar →"}
                </button>
              </form>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() =>
                    handleAskPolarSubmit(
                      "What research has been conducted in Antarctica?",
                    )
                  }
                  className="text-[11px] px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
                >
                  What research has been conducted in Antarctica?
                </button>
                <button
                  onClick={() =>
                    handleAskPolarSubmit(
                      "Which datasets are linked to this expedition?",
                    )
                  }
                  className="text-[11px] px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
                >
                  Which datasets are linked to this expedition?
                </button>
                <button
                  onClick={() =>
                    handleAskPolarSubmit(
                      "Explain polar biodiversity for a student.",
                    )
                  }
                  className="text-[11px] px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
                >
                  Explain polar biodiversity for a student.
                </button>
              </div>

              {aiAnswer && (
                <div className="mt-5 p-4 rounded-xl bg-white/10 border border-white/20 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#93C5FD]">
                      Verified Polar Knowledge Response
                    </span>
                    <span className="text-[10px] text-slate-400">
                      MoES Grounded Evidence
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                    {aiAnswer}
                  </p>
                  <div className="text-right">
                    <button
                      onClick={() => onNavigate("ai")}
                      className="text-xs font-bold text-[#93C5FD] hover:underline"
                    >
                      Open in Full Polar AI Workbench →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================
          21. OFFICIAL MYGOV DARK CHARCOAL INSTITUTIONAL FOOTER
      ================================================================ */}
      <footer className="bg-[#1E252B] text-slate-300 text-xs border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Top Banner Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 mb-8 border-b border-slate-700/80 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-11 flex flex-col items-center justify-center flex-shrink-0 text-white">
                <svg viewBox="0 0 40 48" fill="none" className="w-8 h-10">
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
                  <circle cx="20" cy="34" r="1.5" fill="#1E252B" />
                  <path
                    d="M10 37C14 36.5 26 36.5 30 37C29 40 25 41 20 41C15 41 11 40 10 37Z"
                    fill="#94A3B8"
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
              </div>
              <div>
                <div className="font-extrabold text-white text-sm tracking-wide">
                  NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH
                </div>
                <div className="text-[11px] text-slate-400">
                  Ministry of Earth Sciences · Government of India · Headland
                  Sada, Vasco da Gama, Goa 403804
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate("dashboard")}
                className="px-5 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors shadow-sm"
              >
                Access Science Dashboard
              </button>
            </div>
          </div>

          {/* 4 Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-[11px] mb-10">
            {/* Column 1: Get Involved */}
            <div>
              <div className="font-bold text-white text-xs uppercase mb-3 text-[#38BDF8]">
                GET INVOLVED
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <button
                    onClick={() => onNavigate("education")}
                    className="hover:text-white transition-colors"
                  >
                    Do / Tasks
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("news")}
                    className="hover:text-white transition-colors"
                  >
                    Discuss
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("news")}
                    className="hover:text-white transition-colors"
                  >
                    Poll / Survey
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("publications")}
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("events")}
                    className="hover:text-white transition-colors"
                  >
                    Talk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("education")}
                    className="hover:text-white transition-colors"
                  >
                    Quiz
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("dashboard")}
                    className="hover:text-white transition-colors"
                  >
                    MG Prime
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("expeditions")}
                    className="hover:text-white transition-colors"
                  >
                    Campaigns
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("education")}
                    className="hover:text-white transition-colors"
                  >
                    Pledge
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("media")}
                    className="hover:text-white transition-colors"
                  >
                    Podcast
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("media")}
                    className="hover:text-white transition-colors"
                  >
                    Media Gallery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("publications")}
                    className="hover:text-white transition-colors"
                  >
                    Periodicals
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Get to Know */}
            <div>
              <div className="font-bold text-white text-xs uppercase mb-3 text-[#38BDF8]">
                GET TO KNOW
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <button
                    onClick={() => onNavigate("about")}
                    className="hover:text-white transition-colors"
                  >
                    About NCPOR
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("about")}
                    className="hover:text-white transition-colors"
                  >
                    Mandate & Charter
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("map")}
                    className="hover:text-white transition-colors"
                  >
                    Maitri Station (Antarctica)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("map")}
                    className="hover:text-white transition-colors"
                  >
                    Bharati Station (Antarctica)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("map")}
                    className="hover:text-white transition-colors"
                  >
                    Himadri Station (Arctic)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("about")}
                    className="hover:text-white transition-colors"
                  >
                    Research Vessel ORV Sagar Kanya
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("about")}
                    className="hover:text-white transition-colors"
                  >
                    Scientific Advisory Board
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("education")}
                    className="hover:text-white transition-colors"
                  >
                    Fellowship & Career Programs
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Help & Support */}
            <div>
              <div className="font-bold text-white text-xs uppercase mb-3 text-[#38BDF8]">
                HELP & SUPPORT
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <button
                    onClick={() => onNavigate("about")}
                    className="hover:text-white transition-colors"
                  >
                    Contact Goa Headquarters
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setFeedbackModalOpen(true)}
                    className="hover:text-white transition-colors"
                  >
                    Citizen Feedback & Inquiries
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("news")}
                    className="hover:text-white transition-colors"
                  >
                    Frequently Asked Questions (FAQ)
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Right to Information (RTI)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Website Policies
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setAccessibilityModalOpen(true)}
                    className="hover:text-white transition-colors"
                  >
                    Accessibility Statement
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Useful Links (Styled Pill Badges Grid matching MyGov) */}
            <div>
              <div className="font-bold text-white text-xs uppercase mb-3 text-[#38BDF8]">
                USEFUL LINKS
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "MyGov Quiz",
                  "MyGov Innovation",
                  "MyGov Blog",
                  "Campus Program",
                  "Transforming India",
                  "MyGov Pledge",
                  "Self4Society",
                  "Saathi Portal",
                  "Data.gov.in",
                  "MoES Portal",
                ].map((linkName) => (
                  <button
                    key={linkName}
                    onClick={() => onNavigate("dashboard")}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-[#1D4ED8] hover:text-white border border-slate-700/80 text-[10px] font-semibold text-slate-300 text-center transition-colors truncate"
                    title={linkName}
                  >
                    {linkName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Social Follow Bar, QR Code & App Download Badges */}
          <div className="pt-8 border-t border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Icons */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Connect with MyGov & NCPOR
              </div>
              <div className="flex items-center gap-2">
                {[
                  {
                    name: "Twitter / X",
                    href: "https://twitter.com/moesgoi",
                    svg: (
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    ),
                  },
                  {
                    name: "Facebook",
                    href: "https://facebook.com",
                    svg: (
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    ),
                  },
                  {
                    name: "YouTube",
                    href: "https://youtube.com",
                    svg: (
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    ),
                  },
                  {
                    name: "Instagram",
                    href: "https://instagram.com",
                    svg: (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    ),
                  },
                  {
                    name: "LinkedIn",
                    href: "https://linkedin.com",
                    svg: (
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-colors"
                    title={social.name}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      {social.svg}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* App Store & Google Play Download Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#app-download"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-2.5 text-white transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.87.96-2.96-1 .04-2.13.66-2.8 1.44-.58.67-1.1 1.76-.96 2.83 1.12.09 2.16-.54 2.8-1.31z" />
                </svg>
                <div className="text-left">
                  <div className="text-[8px] text-slate-400 uppercase leading-none">
                    Download on the
                  </div>
                  <div className="text-xs font-bold leading-tight">
                    App Store
                  </div>
                </div>
              </a>

              <a
                href="#app-download"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-2.5 text-white transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.02 2.02 0 0 1-1.61-1.996V3.81a2.02 2.02 0 0 1 1.609-1.996zm11.612 11.615l2.67 2.67-12.06 6.892 9.39-9.562zm2.67-2.858l3.183 1.82a1.2 1.2 0 0 1 0 2.078l-3.183 1.82-2.146-2.146 2.146-2.146v.574zm-2.67-1.428L5.831 2.581l12.06 6.892-2.67 2.67z" />
                </svg>
                <div className="text-left">
                  <div className="text-[8px] text-slate-400 uppercase leading-none">
                    GET IT ON
                  </div>
                  <div className="text-xs font-bold leading-tight">
                    Google Play
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Bottom Legal Copyright Bar */}
          <div className="pt-6 mt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              &copy; 2026 National Centre for Polar and Ocean Research, MoES,
              Government of India. All Rights Reserved.
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Use
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                GIGW Compliance
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>



      {/* ================================================================
          HAMBURGER MEGA-MENU DRAWER
      ================================================================ */}
      {megaMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMegaMenuOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-50">
            <div className="p-4 bg-[#1E293B] text-white flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">POLAR KNOWLEDGE PORTAL</div>
                <div className="text-[10px] text-slate-300">
                  National Centre for Polar and Ocean Research
                </div>
              </div>
              <button
                onClick={() => setMegaMenuOpen(false)}
                className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center text-white"
                aria-label="Close menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  Scientific Portals
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onNavigate("dashboard")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>Science Dashboard</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("expeditions")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>Indian Expeditions</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("publications")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>Research Publications</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("datasets")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>Scientific Datasets</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("map")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>Polar Interactive Map</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("ai")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-[#E0F2FE] text-xs font-bold text-[#0369A1] flex justify-between"
                  >
                    <span>Ask Polar AI</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  Outreach & Dissemination
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onNavigate("education")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>Education & Outreach</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("media")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>Polar Media Gallery</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("news")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>News & Announcements</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("events")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>Events & Calendar</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("about")
                      setMegaMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs font-semibold text-[#0F172A] flex justify-between"
                  >
                    <span>About NCPOR</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] text-[10px] text-[#64748B] text-center">
              Ministry of Earth Sciences · Government of India
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          ACCESSIBILITY MODAL
      ================================================================ */}
      {accessibilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0F172A]">
                Accessibility Options
              </h3>
              <button
                onClick={() => setAccessibilityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close modal"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-xs text-[#475569]">
              <p>
                This portal is engineered to conform with Level AA of the Web
                Content Accessibility Guidelines (WCAG 2.1) and the Guidelines
                for Indian Government Websites (GIGW).
              </p>
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[11px]">
                Screen reader access, high contrast and responsive font resizing
                enabled by default.
              </div>
            </div>
            <div className="mt-5 text-right">
              <button
                onClick={() => setAccessibilityModalOpen(false)}
                className="px-4 py-2 rounded-full bg-[#2563EB] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          FEEDBACK MODAL
      ================================================================ */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0F172A]">
                Citizen Feedback & Inquiries
              </h3>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close modal"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert(
                  "Thank you. Your inquiry has been submitted to the NCPOR Outreach Cell.",
                )
                setFeedbackModalOpen(false)
              }}
            >
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Dr. / Prof. / Mr. / Ms."
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@domain.gov.in"
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">
                    Subject
                  </label>
                  <select className="w-full px-3 py-2 rounded border border-[#CBD5E1] outline-none focus:border-[#2563EB]">
                    <option>Scientific Data Inquiry</option>
                    <option>Outreach & School Visit</option>
                    <option>Research Fellowship</option>
                    <option>General Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Please describe your query..."
                    className="w-full px-3 py-2 rounded border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-[#475569] font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#2563EB] text-white font-bold text-xs"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
