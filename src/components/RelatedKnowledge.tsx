interface RelatedEntity {
  type: "publication" | "dataset" | "expedition" | "finding" | "researcher" | "station" | "media" | "project";
  label: string;
  meta?: string;
}

const typeConfig: Record<RelatedEntity["type"], { icon: string; color: string; bg: string }> = {
  publication:  { icon: "📄", color: "#2563eb", bg: "#eff6ff" },
  dataset:      { icon: "💾", color: "#7c3aed", bg: "#faf5ff" },
  expedition:   { icon: "🚢", color: "#0891b2", bg: "#ecfeff" },
  finding:      { icon: "🔍", color: "#16a34a", bg: "#f0fdf4" },
  researcher:   { icon: "👤", color: "#d97706", bg: "#fffbeb" },
  station:      { icon: "🏔️", color: "#ea580c", bg: "#fff7ed" },
  media:        { icon: "🖼️", color: "#db2777", bg: "#fdf2f8" },
  project:      { icon: "📋", color: "#64748b", bg: "#f8fafc" },
};

interface Props {
  title?: string;
  entities: RelatedEntity[];
  onNavigate?: (type: string) => void;
  compact?: boolean;
}

export default function RelatedKnowledge({ title = "Related Knowledge", entities, onNavigate, compact }: Props) {
  if (entities.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {entities.map((e, i) => {
          const c = typeConfig[e.type];
          return (
            <button key={i} onClick={() => onNavigate?.(e.type)} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium hover:opacity-80 transition-opacity" style={{ background: c.bg, color: c.color }}>
              <span>{c.icon}</span>
              <span>{e.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {title && <h4 className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>{title}</h4>}
      <div className="space-y-1.5">
        {entities.map((e, i) => {
          const c = typeConfig[e.type];
          return (
            <button key={i} onClick={() => onNavigate?.(e.type)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity text-left" style={{ background: c.bg }}>
              <span className="text-sm">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: c.color }}>{e.label}</div>
                {e.meta && <div className="text-[10px] opacity-70" style={{ color: c.color }}>{e.meta}</div>}
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 flex-shrink-0 opacity-50" style={{ color: c.color }}><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
