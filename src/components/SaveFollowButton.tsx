import { useState } from "react";

interface Props {
  entityId: string;
  entityType: "expedition" | "publication" | "dataset" | "researcher" | "topic" | "station" | "media" | "event";
  label?: string;
  compact?: boolean;
}

// Simple in-memory save/follow store (per session)
const savedSet = new Set<string>();
const followedSet = new Set<string>();

export function isSaved(key: string) { return savedSet.has(key); }
export function isFollowed(key: string) { return followedSet.has(key); }

export default function SaveFollowButton({ entityId, entityType, label, compact = false }: Props) {
  const key = `${entityType}:${entityId}`;
  const [saved, setSaved] = useState(() => savedSet.has(key));
  const [followed, setFollowed] = useState(() => followedSet.has(key));

  function toggleSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (saved) { savedSet.delete(key); setSaved(false); }
    else { savedSet.add(key); setSaved(true); }
  }

  function toggleFollow(e: React.MouseEvent) {
    e.stopPropagation();
    if (followed) { followedSet.delete(key); setFollowed(false); }
    else { followedSet.add(key); setFollowed(true); }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={toggleSave}
          title={saved ? "Saved" : "Save"}
          className="p-1 rounded hover:bg-slate-100 transition-colors"
          aria-label={saved ? "Remove from saved" : "Save"}
        >
          <svg viewBox="0 0 24 24" fill={saved ? "#2563eb" : "none"} stroke={saved ? "#2563eb" : "#94a3b8"} strokeWidth={2} className="w-3.5 h-3.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
        <button
          onClick={toggleFollow}
          title={followed ? "Following" : "Follow"}
          className="p-1 rounded hover:bg-slate-100 transition-colors"
          aria-label={followed ? "Unfollow" : "Follow"}
        >
          <svg viewBox="0 0 24 24" fill={followed ? "#16a34a" : "none"} stroke={followed ? "#16a34a" : "#94a3b8"} strokeWidth={2} className="w-3.5 h-3.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSave}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${saved ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
        aria-pressed={saved}
      >
        <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        {saved ? "Saved" : `Save ${label || entityType}`}
      </button>
      <button
        onClick={toggleFollow}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${followed ? "border-green-300 bg-green-50 text-green-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
        aria-pressed={followed}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
          {followed ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> : <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>}
        </svg>
        {followed ? "Following" : "Follow"}
      </button>
    </div>
  );
}
