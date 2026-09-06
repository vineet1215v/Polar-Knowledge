import { useState } from "react";
import { WorkspaceSource, typeIcon } from "../workspaceStore";

interface Props {
  source: WorkspaceSource;
  onAdd: (s: WorkspaceSource) => void;
  compact?: boolean;
}

export default function AddToWorkspace({ source, onAdd, compact = false }: Props) {
  const [added, setAdded] = useState(false);

  function handle(e: React.MouseEvent) {
    e.stopPropagation();
    if (!added) { onAdd(source); setAdded(true); }
  }

  if (compact) {
    return (
      <button
        onClick={handle}
        title={added ? "Added to workspace" : "Add to Source Workspace"}
        className={`p-1 rounded transition-colors flex items-center gap-1 text-[10px] font-medium ${added ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`}
        aria-pressed={added}
        aria-label={added ? "Added to workspace" : "Add to Source Workspace"}
      >
        <span>{typeIcon[source.type]}</span>
        {added ? "✓ In Workspace" : "+ Workspace"}
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${added ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"}`}
      aria-pressed={added}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        {added ? <polyline points="20 6 9 17 4 12"/> : <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>}
      </svg>
      {added ? "Added to Workspace" : "Add to Workspace"}
    </button>
  );
}
