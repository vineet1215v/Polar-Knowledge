import type { EvidenceStatus } from "../knowledgeData";

interface Props {
  status: EvidenceStatus;
  confidence?: number;
  compact?: boolean;
}

const config: Record<EvidenceStatus, { label: string; bg: string; color: string; icon: string }> = {
  source_backed:       { label: "Source-Backed",       bg: "#f0fdf4", color: "#16a34a", icon: "OK" },
  synthesis:           { label: "Synthesis",            bg: "#eff6ff", color: "#2563eb", icon: "⊕" },
  insufficient_evidence: { label: "Insufficient Evidence", bg: "#fefce8", color: "#ca8a04", icon: "?" },
  conflicting:         { label: "Conflicting Sources",  bg: "#fff1f2", color: "#dc2626", icon: "!" },
};

export function EvidenceBadge({ status, confidence, compact }: Props) {
  const c = config[status];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: c.bg, color: c.color }}>
      <span>{c.icon}</span>
      {!compact && <span>{c.label}</span>}
      {confidence !== undefined && !compact && <span className="opacity-70">· {confidence}%</span>}
    </span>
  );
}

export function EvidenceRow({ status, confidence, sourceTitle }: { status: EvidenceStatus; confidence?: number; sourceTitle?: string }) {
  const c = config[status];
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg text-xs" style={{ background: c.bg }}>
      <span className="font-bold mt-0.5" style={{ color: c.color }}>{c.icon}</span>
      <div>
        <span className="font-semibold" style={{ color: c.color }}>{c.label}</span>
        {confidence !== undefined && <span className="ml-1 opacity-70" style={{ color: c.color }}>· {confidence}% confidence</span>}
        {sourceTitle && <div className="text-[10px] mt-0.5 opacity-80" style={{ color: c.color }}>Source: {sourceTitle}</div>}
      </div>
    </div>
  );
}
