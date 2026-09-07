import { useState } from "react";
import { events } from "../data";

interface Props { onNavigate?: (p: string) => void; }

export default function Events({ onNavigate }: Props) {
  const [tab, setTab] = useState("upcoming");
  const filtered = events.filter(e => e.type === tab);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      <div className="p-6">
        <div className="mb-5">
          <h1 className="page-header-title">Events & Activities</h1>
          <p className="page-header-sub">Explore upcoming events, past activities and institutional initiatives.</p>
        </div>

        <div className="tab-bar w-fit mb-5">
          <button className={`tab-item ${tab === "upcoming" ? "active" : ""}`} onClick={() => setTab("upcoming")}>Upcoming Events</button>
          <button className={`tab-item ${tab === "past" ? "active" : ""}`} onClick={() => setTab("past")}>Past Events</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(ev => (
                <div key={ev.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2" style={{ borderColor: "var(--accent)", background: "var(--accent-light)" }}>
                      <span className="text-xl font-bold leading-none" style={{ color: "var(--accent)" }}>{ev.day}</span>
                      <span className="text-[10px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>{ev.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{ev.title}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-3 h-3 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{ev.location}</span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{ev.description}</p>

                      {/* Connected knowledge */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <button className="text-[10px] px-2 py-0.5 rounded-full border hover:bg-blue-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }} onClick={() => onNavigate?.("publications")}> Related Publications</button>
                        <button className="text-[10px] px-2 py-0.5 rounded-full border hover:bg-blue-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }} onClick={() => onNavigate?.("expeditions")}> Related Expeditions</button>
                        <button className="text-[10px] px-2 py-0.5 rounded-full border hover:bg-blue-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }} onClick={() => onNavigate?.("education")}> Educational Materials</button>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-1.5">
                      <button className={ev.action === "Register" ? "btn-primary btn-sm" : "btn-outline btn-sm"}>{ev.action}</button>
                      {tab === "past" && <button className="btn-outline btn-sm text-[10px]"> Create Summary</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Quick Calendar</h3>
              <div className="space-y-2">
                {filtered.map(ev => (
                  <div key={ev.id} className="flex items-center gap-2 text-xs">
                    <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0" style={{ background: "var(--accent-light)" }}>
                      <span className="font-bold text-xs leading-none" style={{ color: "var(--accent)" }}>{ev.day}</span>
                      <span className="text-[9px] leading-none" style={{ color: "var(--text-muted)" }}>{ev.month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{ev.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Register for Updates</h3>
              <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>Get notified about upcoming polar science events and NCPOR activities.</p>
              <input className="search-input mb-2" placeholder="Your email address"/>
              <button className="btn-primary btn-sm w-full">Subscribe →</button>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>Knowledge Hub</h3>
              <p className="text-[10px] mb-2" style={{ color: "var(--text-secondary)" }}>Events are connected to the NCPOR knowledge ecosystem.</p>
              <div className="space-y-1.5">
                {[["","Browse Publications", "publications"],["","Educational Resources","education"],["","Related Datasets","datasets"]].map(([icon, label, dest]) => (
                  <button key={dest as string} onClick={() => onNavigate?.(dest as string)} className="w-full flex items-center gap-2 text-[10px] px-2 py-1.5 rounded hover:bg-slate-50 transition-colors" style={{ color: "var(--text-secondary)" }}>
                    <span>{icon as string}</span>{label as string} →
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
