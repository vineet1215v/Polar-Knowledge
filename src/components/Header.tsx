import { useState } from "react";

interface HeaderProps {
  onSearch?: (q: string) => void;
  onNavigate?: (p: string) => void;
  workspaceCount?: number;
  onOpenWorkspace?: () => void;
}

const notificationFeed = [
  { id: "n1", type: "new_dataset",     icon: "💾", title: "New dataset published",      body: "Antarctic Sea Ice Concentration (2024) is now available", time: "2h ago",  dest: "datasets",     unread: true },
  { id: "n2", type: "expedition_update",icon: "🚢", title: "46th IAE update",            body: "Team has reached Bharati Station. Field observations begun.", time: "4h ago",  dest: "expeditions",  unread: true },
  { id: "n3", type: "new_publication",  icon: "📄", title: "New publication indexed",    body: "Sea ice variability in Prydz Bay (2024) — added to repository", time: "1d ago",  dest: "publications", unread: true },
  { id: "n4", type: "knowledge_gap",    icon: "⚠️", title: "Coverage gap detected",      body: "Arctic methane flux — potential repository coverage gap identified", time: "1d ago",  dest: "dashboard",    unread: false },
  { id: "n5", type: "review_needed",    icon: "📋", title: "Draft awaiting review",      body: "AI-generated outreach article requires editorial approval", time: "2d ago",  dest: "news",         unread: false },
  { id: "n6", type: "new_media",        icon: "📸", title: "New media added",            body: "18 photos from 46th IAE added to Media Gallery", time: "3d ago",  dest: "media",        unread: false },
  { id: "n7", type: "follow_update",    icon: "🔔", title: "Expedition you follow updated", body: "45th IAE final datasets released to public repository", time: "4d ago",  dest: "datasets",     unread: false },
];

const recentlyViewed = [
  { icon: "🚢", label: "46th IAE (2024)",              type: "Expedition",  dest: "expeditions" },
  { icon: "📄", label: "Sea ice dynamics (2024)",       type: "Publication", dest: "publications" },
  { icon: "💾", label: "Ocean Temperature Profiles",    type: "Dataset",     dest: "datasets" },
  { icon: "🗺️", label: "Bharati Station",               type: "Station",     dest: "map" },
  { icon: "📸", label: "Aurora Australis IAE 2023",     type: "Media",       dest: "media" },
];

const savedKnowledge = [
  { icon: "📄", label: "Sea ice dynamics in Southern Ocean",     type: "Publication" },
  { icon: "💾", label: "Antarctic Sea Ice Concentration 2023",   type: "Dataset" },
  { icon: "🚢", label: "45th Indian Antarctic Expedition",       type: "Expedition" },
];

const followedEntities = [
  { icon: "🚢", label: "46th IAE",          type: "Expedition", updates: 3 },
  { icon: "🔬", label: "Dr. Rahul Mohan",   type: "Researcher", updates: 1 },
  { icon: "🏷️", label: "Sea Ice Science",   type: "Topic",      updates: 5 },
];

// Icon button for header — white/muted on navy
function HeaderIconBtn({ label, onClick, children, badge }: { label: string; onClick: () => void; children: React.ReactNode; badge?: number }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      style={{ color: "rgba(255,255,255,0.7)" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: "#ef4444" }}>{badge}</span>
      )}
    </button>
  );
}

export default function Header({ onSearch, onNavigate, workspaceCount = 0, onOpenWorkspace }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<"saved" | "recent" | "following">("saved");
  const [readAll, setReadAll] = useState(false);

  const unreadCount = readAll ? 0 : notificationFeed.filter(n => n.unread).length;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim() && onSearch) onSearch(query);
  }

  function handleNotifClick(dest: string) {
    setNotifOpen(false);
    onNavigate?.(dest);
  }

  return (
    <>
      {/* ── Navy Header ──────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 flex-shrink-0 relative z-30"
        style={{
          height: "var(--header-height)",
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--header-border)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative max-w-md">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2} className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search expeditions, datasets, publications..."
            aria-label="Search the knowledge portal"
            className="w-full text-white text-xs outline-none transition-all"
            style={{
              height: 34,
              paddingLeft: 34,
              paddingRight: 12,
              borderRadius: "var(--radius-md)",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              fontSize: 12.5,
              fontFamily: "inherit",
            }}
            onFocus={e => { e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.borderColor = "rgba(255,255,255,0.35)"; }}
            onBlur={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.borderColor = "rgba(255,255,255,0.15)"; }}
          />
        </form>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Workspace Sources button */}
          {workspaceCount > 0 && (
            <button
              onClick={onOpenWorkspace}
              aria-label={`Open Polar Studio — ${workspaceCount} sources selected`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.12)", color: "#93c5fd", border: "1px solid rgba(255,255,255,0.2)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              Sources ({workspaceCount}) · Studio ✨
            </button>
          )}

          {/* Notifications */}
          <HeaderIconBtn
            label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            badge={unreadCount}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 17, height: 17 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </HeaderIconBtn>

          {/* Divider */}
          <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.15)" }}/>

          {/* Profile */}
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            aria-label="Open profile and saved knowledge"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.85)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
            >R</div>
            <div className="hidden sm:block text-left">
              <div className="text-[10px] leading-none" style={{ color: "rgba(255,255,255,0.5)" }}>Researcher</div>
              <div className="text-[12px] font-semibold leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>NCPOR</div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3 h-3 flex-shrink-0 transition-transform ${profileOpen ? "rotate-180" : ""}`} style={{ color: "rgba(255,255,255,0.4)" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-20" onClick={() => { setNotifOpen(false); setProfileOpen(false); }}/>
      )}

      {/* ── Notification Dropdown ─────────────────────────── */}
      {notifOpen && (
        <div
          className="fixed right-4 z-30 w-80 bg-white overflow-hidden animate-slide-up"
          style={{ top: "calc(var(--header-height) + 6px)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xl)", border: "1px solid var(--border)" }}
          role="region"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Notifications</span>
              {unreadCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "#fee2e2", color: "#dc2626" }}>{unreadCount} new</span>}
            </div>
            <button className="text-[10px] font-semibold" style={{ color: "var(--accent)" }} onClick={() => setReadAll(true)}>Mark all read</button>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
            {notificationFeed.map(n => (
              <button
                key={n.id}
                className="w-full text-left flex items-start gap-3 px-4 py-3 transition-colors"
                style={{ borderBottom: "1px solid var(--border)", background: n.unread && !readAll ? "#f8faff" : "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = n.unread && !readAll ? "#f8faff" : "transparent")}
                onClick={() => handleNotifClick(n.dest)}
              >
                <span className="text-base flex-shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs" style={{ color: "var(--text-primary)" }}>{n.title}</span>
                    {n.unread && !readAll && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }}/>}
                  </div>
                  <div className="text-[11px] mt-0.5 leading-snug" style={{ color: "var(--text-secondary)" }}>{n.body}</div>
                  <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{n.time}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 text-center" style={{ background: "var(--surface-secondary)", borderTop: "1px solid var(--border)" }}>
            <button className="text-[11px] font-semibold" style={{ color: "var(--accent)" }} onClick={() => { setNotifOpen(false); onNavigate?.("dashboard"); }}>
              View all activity in Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* ── Profile Dropdown ──────────────────────────────── */}
      {profileOpen && (
        <div
          className="fixed right-4 z-30 w-80 bg-white overflow-hidden animate-slide-up"
          style={{ top: "calc(var(--header-height) + 6px)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xl)", border: "1px solid var(--border)" }}
          role="region"
          aria-label="Your knowledge space"
        >
          {/* Profile header — navy strip */}
          <div className="px-4 py-4" style={{ background: "var(--primary-navy)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>R</div>
              <div>
                <div className="text-white font-semibold text-sm">Researcher</div>
                <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>NCPOR · Glaciology Division</div>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              {[["3","Saved"],["3","Following"],["5","Viewed"]].map(([count, label]) => (
                <div key={label} className="flex-1 text-center">
                  <div className="text-white font-bold text-sm">{count}</div>
                  <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-bar m-3 mb-0">
            {([["saved","💾 Saved"],["recent","🕐 Recent"],["following","🔔 Following"]] as const).map(([id, label]) => (
              <button key={id} className={`tab-item flex-1 text-[10px] ${profileTab === id ? "active" : ""}`} onClick={() => setProfileTab(id)}>{label}</button>
            ))}
          </div>

          <div className="overflow-y-auto p-3 space-y-0.5" style={{ maxHeight: 240 }}>
            {profileTab === "saved" && savedKnowledge.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors group" onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-secondary)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.type}</div>
                </div>
              </div>
            ))}

            {profileTab === "recent" && recentlyViewed.map((item, i) => (
              <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors" onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-secondary)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onClick={() => { setProfileOpen(false); onNavigate?.(item.dest); }}>
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.type}</div>
                </div>
              </button>
            ))}

            {profileTab === "following" && followedEntities.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-secondary)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.type}</div>
                </div>
                {item.updates > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: "var(--accent-light)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>{item.updates} new</span>}
              </div>
            ))}
          </div>

          <div className="px-4 py-3 flex gap-2" style={{ background: "var(--surface-secondary)", borderTop: "1px solid var(--border)" }}>
            <button className="flex-1 btn-outline btn-sm" style={{ fontSize: "10px" }} onClick={() => { setProfileOpen(false); onNavigate?.("ai"); }}>Ask Polar →</button>
            <button className="flex-1 btn-outline btn-sm" style={{ fontSize: "10px" }} onClick={() => { setProfileOpen(false); onNavigate?.("about"); }}>My Profile →</button>
          </div>
        </div>
      )}
    </>
  );
}
