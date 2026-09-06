// 

type Page =
  | "dashboard"
  | "expeditions"
  | "publications"
  | "datasets"
  | "media"
  | "map"
  | "ai"
  | "education"
  | "news"
  | "events"
  | "about";

interface SidebarProps {
  active: Page;
  onNavigate: (p: Page) => void;
  collapsed?: boolean;
}

const navItems: {
  id: Page;
  label: string;
  icon: React.ReactNode;
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
    id: "expeditions",
    label: "Expeditions",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },

  {
    id: "publications",
    label: "Research Publications",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },

  {
    id: "datasets",
    label: "Scientific Datasets",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },

  {
    id: "media",
    label: "Media Gallery",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4 h-4"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },

  {
    id: "map",
    label: "Polar Map & GIS",
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
    label: "Education & Outreach",
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
    label: "News & Announcements",
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
];

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
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-nav-item ${
              active === item.id ? "active" : ""
            } ${collapsed ? "justify-center" : ""}`}
            aria-current={active === item.id ? "page" : undefined}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}

            {/* Hide text when collapsed */}
            {!collapsed && (
              <span className="truncate">
                {item.label}
              </span>
            )}
          </button>
        ))}
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
  );
}