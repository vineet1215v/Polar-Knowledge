//

type Page = "landing" | "login" | "dashboard" | "analytics" | "digital-twin" | "data-upload" | "explorer" | "expeditions" | "publications" | "datasets" | "media" | "map" | "research-rooms" | "ai-tools" | "bio-lab" | "otolith-lab" | "edna-lab" | "ai" | "education" | "news" | "events" | "about" | "settings" | "profile"

interface SidebarProps {
  active: Page

  onNavigate: (p: Page) => void

  collapsed?: boolean
}

const navItems: {
  id: Page

  label: string

  badge?: string

  icon: React.ReactNode
}[] = [
  {
    id: "dashboard",

    label: "Dashboard",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },

  {
    id: "analytics",

    label: "Dynamic Analytics",

    badge: "NEW",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },

  {
    id: "digital-twin",

    label: "Digital Twin AI",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" />
      </svg>
    ),
  },

  {
    id: "explorer",

    label: "Data Explorer",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },

  {
    id: "map",

    label: "Polar Map",

    badge: "NEW",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },

  {
    id: "research-rooms",

    label: "Research Rooms",

    badge: "LIVE",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    ),
  },

  {
    id: "ai-tools",

    label: "AI Tools",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },

  {
    id: "ai",

    label: "Polar Knowledge (AI)",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M12 2a4 4 0 0 1 4 4v2h1a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1v2a4 4 0 0 1-8 0v-2H7a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
        <circle cx="9" cy="10" r="1" />
        <circle cx="15" cy="10" r="1" />
        <path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5" />
      </svg>
    ),
  },

  {
    id: "education",

    label: "Polar Education",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },

  {
    id: "news",

    label: "Content Creation",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6z" />
      </svg>
    ),
  },

  {
    id: "bio-lab",

    label: "eDNA & Otolith Lab",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M2 15c6.667-6 13.333 0 20-6" />
        <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
        <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },

  {
    id: "events",

    label: "Events & Activities",

    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },

  {
    id: "profile",
    label: "Scientist Profile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function Sidebar({
  active,

  onNavigate,

  collapsed = false,
}: SidebarProps) {
  return (
    <div
      className="flex flex-col fixed left-0 z-40"
      style={{
        top: "var(--header-height)",

        height: "calc(100vh - var(--header-height))",

        width: collapsed ? "72px" : "var(--sidebar-width)",

        background: "var(--sidebar-bg)",

        borderRight: "1px solid var(--sidebar-border)",

        transition: "width 0.25s ease",

        overflow: "hidden",
      }}
    >
      {/* ========================= */}
      {/* BRAND */}
      {/* ========================= */}

      <div
        className="px-4 py-4"
        style={{
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          {/* Brand text */}
          {!collapsed && (
            <div>
              <div
                className="font-bold text-[13px] leading-tight"
                style={{
                  color: "var(--primary-navy)",
                }}
              >
                NCPOR
              </div>

              <div
                className="text-[10px] leading-tight"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Polar Knowledge Portal
              </div>
            </div>
          )}
        </div>

        {/* Live status */}
        {!collapsed && (
          <div
            className="mt-3 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
            style={{
              background: "var(--success-bg)",

              border: "1px solid var(--success-border)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 pulse-dot"
              style={{
                background: "var(--success)",
              }}
            />

            <span
              className="text-[10px] font-semibold"
              style={{
                color: "var(--success)",
              }}
            >
              46th Expedition Active
            </span>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* NAVIGATION */}
      {/* ========================= */}

      <nav
        className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const isExplorerItem = item.id === "explorer"
          const isBioLabItem = item.id === "bio-lab"

          const isItemActive =
            active === item.id ||
            (isExplorerItem &&
              (active === "expeditions" ||
                active === "publications" ||
                active === "datasets" ||
                active === "media")) ||
            (isBioLabItem &&
              (active === "bio-lab" ||
                active === "edna-lab" ||
                active === "otolith-lab"))

          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id)
              }}
              className={`sidebar-nav-item ${
                isItemActive
                  ? "!bg-[#003366] !text-white !border-transparent font-semibold shadow-xs"
                  : ""
              } ${collapsed ? "justify-center" : ""}`}
              aria-current={isItemActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              <span className={isItemActive ? "[&>svg]:text-white" : ""}>
                {item.icon}
              </span>

              {/* Hide text when collapsed */}
              {!collapsed && (
                <span className="truncate flex-1 text-left flex items-center justify-between">
                  <span
                    className={isItemActive ? "text-white font-semibold" : ""}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        item.badge === "NEW"
                          ? "bg-emerald-600 text-white"
                          : isItemActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      {!collapsed && (
        <div
          className="px-4 pb-4 pt-3"
          style={{
            borderTop: "1px solid var(--sidebar-border)",
          }}
        >
          <div className="text-center">
            <div
              className="text-[10px] font-semibold"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Exploring Today for a Sustainable Tomorrow
            </div>

            <div
              className="mt-1 text-[9px]"
              style={{
                color: "var(--text-placeholder)",
              }}
            >
              Ministry of Earth Sciences · Government of India
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
