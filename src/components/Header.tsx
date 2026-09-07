import { useState, useEffect } from "react";
import { gameStore, type PlayerStats, type Quest, type Badge } from "../gameStore";

interface HeaderProps {
  onSearch?: (q: string) => void;
  onNavigate?: (p: string) => void;
  workspaceCount?: number;
  onOpenWorkspace?: () => void;
  onOpenSocial?: () => void;
  onToggleSidebar?: () => void;
}

const notificationFeed = [
  { id: "n1", type: "new_dataset",     icon: "", title: "New dataset published",      body: "Antarctic Sea Ice Concentration (2024) is now available", time: "2h ago",  dest: "datasets",     unread: true },
  { id: "n2", type: "expedition_update",icon: "", title: "46th IAE update",            body: "Team has reached Bharati Station. Field observations begun.", time: "4h ago",  dest: "expeditions",  unread: true },
  { id: "n3", type: "new_publication",  icon: "", title: "New publication indexed",    body: "Sea ice variability in Prydz Bay (2024) — added to repository", time: "1d ago",  dest: "publications", unread: true },
  { id: "n4", type: "knowledge_gap",    icon: "Warning:", title: "Coverage gap detected",      body: "Arctic methane flux — potential repository coverage gap identified", time: "1d ago",  dest: "dashboard",    unread: false },
  { id: "n5", type: "review_needed",    icon: "", title: "Draft awaiting review",      body: "AI-generated outreach article requires editorial approval", time: "2d ago",  dest: "news",         unread: false },
  { id: "n6", type: "new_media",        icon: "", title: "New media added",            body: "18 photos from 46th IAE added to Media Gallery", time: "3d ago",  dest: "media",        unread: false },
  { id: "n7", type: "follow_update",    icon: "", title: "Expedition you follow updated", body: "45th IAE final datasets released to public repository", time: "4d ago",  dest: "datasets",     unread: false },
];

const savedKnowledge = [
  { icon: "", label: "Sea ice dynamics in Southern Ocean",     type: "Publication" },
  { icon: "", label: "Antarctic Sea Ice Concentration 2023",   type: "Dataset" },
  { icon: "", label: "45th Indian Antarctic Expedition",       type: "Expedition" },
];

const leaderboard = [
  { rank: 1, name: "Dr. Rahul Mohan", title: "Chief Glaciologist", xp: 1420, level: 8, badge: "1st" },
  { rank: 2, name: "Priya Sharma", title: "Ocean Mooring Specialist", xp: 980, level: 5, badge: "2nd" },
  { rank: 3, name: "You (Explorer)", title: "Active Polar Scout", xp: 380, level: 2, badge: "3rd", isUser: true },
  { rank: 4, name: "Vikram Das", title: "Maitri Atmospheric Tech", xp: 320, level: 2, badge: "*" },
  { rank: 5, name: "Ananya Iyer", title: "Polar Biologist", xp: 290, level: 2, badge: "*" },
];

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

export default function Header({ onSearch, onNavigate, workspaceCount = 0, onOpenWorkspace, onOpenSocial, onToggleSidebar }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [questDrawerOpen, setQuestDrawerOpen] = useState(false);
  const [gameTab, setGameTab] = useState<"quests" | "badges" | "leaderboard">("quests");
  const [readAll, setReadAll] = useState(false);

  // Gamification Reactive State
  const [stats, setStats] = useState<PlayerStats>(gameStore.getStats());
  const [quests, setQuests] = useState<Quest[]>(gameStore.getQuests());
  const [badges, setBadges] = useState<Badge[]>(gameStore.getBadges());
  const [notification, setNotification] = useState(gameStore.getNotification());

  useEffect(() => {
    return gameStore.subscribe(() => {
      setStats(gameStore.getStats());
      setQuests([...gameStore.getQuests()]);
      setBadges([...gameStore.getBadges()]);
      setNotification(gameStore.getNotification());
    });
  }, []);

  const unreadCount = readAll ? 0 : notificationFeed.filter(n => n.unread).length;
  const unclaimedQuests = quests.filter(q => q.completed && !q.claimed).length;

  const currentLevelXp = stats.xp % 200;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 200) * 100));

  const handleClaim = (questId: string) => {
    gameStore.claimQuest(questId);
  };

  return (
    <>

      {/* ── Navy Header ──────────────────────────────────── */}
      <div
        className="flex items-center justify-between gap-3 px-4 sm:px-5 flex-shrink-0 relative z-30"
        style={{
          height: "var(--header-height)",
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--header-border)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="flex items-center justify-center flex-shrink-0 rounded-lg transition-colors hover:bg-white/15"
            style={{
              width: 34,
              height: 34,
              color: "white",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>

          {/* Logo & NCPOR brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.("dashboard")}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-wide leading-none flex items-center gap-1.5">
                NCPOR
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-normal">POLAR ACADEMY</span>
              </div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5 hidden sm:block">
                Interactive Polar Science
              </div>
            </div>
          </div>
        </div>

        {/* Center: Institutional Search Input */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search expeditions, datasets, publications..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/10 text-white placeholder-slate-400 text-xs border border-white/15 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white/15 transition-all"
            />
          </div>
        </div>

        {/* Right: Workspace & Notifications */}
        <div className="flex items-center gap-1.5">
          {/* Workspace Sources */}
          {workspaceCount > 0 && (
            <button
              onClick={onOpenWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              <span></span> Sources ({workspaceCount})
            </button>
          )}

          {/* Notifications */}
          <HeaderIconBtn
            label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setQuestDrawerOpen(false); }}
            badge={unreadCount}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 17, height: 17 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </HeaderIconBtn>

          {/* Profile */}
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setQuestDrawerOpen(false); }}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center text-xs font-bold">
              EXP
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[10px] text-slate-400 leading-none">Explorer</div>
              <div className="text-xs font-semibold text-white leading-none mt-0.5">{stats.rank.split(" ")[0]}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {(notifOpen || profileOpen || questDrawerOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs"
          onClick={() => { setNotifOpen(false); setProfileOpen(false); setQuestDrawerOpen(false); }}
        />
      )}

      {/* ── GAMIFICATION QUESTS & TROPHY DRAWER ─────────────────────── */}
      {questDrawerOpen && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 text-xs flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl"></span>
              <div>
                <h3 className="font-bold text-sm">Polar Explorer Mission Command</h3>
                <p className="text-[10px] text-slate-400">Level {stats.level} {stats.rank} · {stats.crystals} Crystals</p>
              </div>
            </div>
            <button onClick={() => setQuestDrawerOpen(false)} className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white">x</button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1">
            {[["quests", "Daily Quests"], ["badges", "Badges & Trophies"], ["leaderboard", "Leaderboard"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setGameTab(key as any)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${gameTab === key ? "bg-white text-blue-700 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`}
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
                  <span>{quests.filter(q => q.completed).length} / {quests.length} Completed</span>
                </div>

                {quests.map(q => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${q.completed ? "bg-emerald-50/60 border-emerald-200" : "bg-white border-slate-200"}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl">{q.icon}</span>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{q.title}</div>
                        <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{q.desc}</div>
                        <div className="flex items-center gap-2 mt-1 font-mono text-[10px] font-bold">
                          <span className="text-blue-600">+{q.xpReward} XP</span>
                          <span className="text-cyan-600">+{q.crystalReward} </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {q.completed ? (
                        q.claimed ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                            OK Claimed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleClaim(q.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs animate-bounce"
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
                    setQuestDrawerOpen(false);
                    onNavigate?.("education");
                  }}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <span></span> Open Gaming Learning Arena →
                </button>
              </div>
            )}

            {gameTab === "badges" && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">
                  Unlocked Achievements ({badges.filter(b => b.unlocked).length} / {badges.length})
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {badges.map(b => (
                    <div
                      key={b.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${b.unlocked ? "bg-gradient-to-br from-amber-50/50 to-white border-amber-200 shadow-2xs" : "bg-slate-50/60 border-slate-200 opacity-60 grayscale"}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-2xl">{b.icon}</span>
                          <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {b.rarity}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 leading-tight">{b.name}</div>
                        <div className="text-[10px] text-slate-500 leading-snug mt-1">{b.desc}</div>
                      </div>
                      <div className="mt-2 text-[9px] font-mono font-semibold text-amber-700">
                        {b.unlocked ? "OK Unlocked" : " Locked"}
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
                  {leaderboard.map(u => (
                    <div
                      key={u.rank}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${u.isUser ? "bg-blue-50 border-blue-300 shadow-2xs" : "bg-white border-slate-200"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-center font-bold text-slate-500 text-sm">{u.badge}</span>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                            {u.name}
                            {u.isUser && <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold">YOU</span>}
                          </div>
                          <div className="text-[10px] text-slate-500">{u.title}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-700 font-mono text-xs">{u.xp} XP</div>
                        <div className="text-[9px] text-slate-400 font-mono">Level {u.level}</div>
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
        <div className="fixed right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
            <h4 className="font-bold text-xs">Notifications</h4>
            <button onClick={() => setReadAll(true)} className="text-[10px] text-blue-300 hover:underline">Mark all read</button>
          </div>
          <div className="p-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {notificationFeed.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  setNotifOpen(false);
                  onNavigate?.(n.dest);
                }}
                className={`p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 flex items-start gap-2.5 transition-colors ${!readAll && n.unread ? "bg-blue-50/60" : ""}`}
              >
                <span className="text-lg">{n.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900 leading-tight">{n.title}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{n.body}</div>
                  <div className="text-[9px] text-slate-400 mt-1">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Profile Dropdown ─────────────────────────────── */}
      {profileOpen && (
        <div className="fixed right-4 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 text-xs p-4 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white text-lg flex items-center justify-center font-bold">
              EXP
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Polar Explorer</div>
              <div className="text-[10px] text-blue-600 font-semibold">{stats.rank} · Level {stats.level}</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Saved Sources</div>
            {savedKnowledge.map(s => (
              <div key={s.label} className="p-1.5 rounded hover:bg-slate-50 flex items-center justify-between text-slate-700">
                <span className="truncate">{s.icon} {s.label}</span>
                <span className="text-[9px] text-slate-400">{s.type}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setProfileOpen(false);
              onNavigate?.("education");
            }}
            className="w-full py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors text-center"
          >
            Go to Academy Game Arena →
          </button>
        </div>
      )}
    </>
  );
}
