import { expeditionDNA, researchers } from "../knowledgeData";

interface Props {
  expeditionId: number;
  onNavigate?: (dest: string) => void;
}

export default function ResearchDNA({ expeditionId, onNavigate }: Props) {
  const dna = expeditionDNA[expeditionId];
  if (!dna) return null;

  const cells = [
    { label: "Researchers", value: dna.researchers, icon: "", dest: "about", color: "#d97706" },
    { label: "Projects",    value: dna.projects,    icon: "", dest: "about", color: "#7c3aed" },
    { label: "Datasets",    value: dna.datasets,    icon: "", dest: "datasets", color: "#0891b2" },
    { label: "Publications",value: dna.publications, icon: "", dest: "publications", color: "#2563eb" },
    { label: "Findings",    value: dna.findings,    icon: "", dest: "publications", color: "#16a34a" },
    { label: "Media Assets",value: dna.media,       icon: "", dest: "media", color: "#db2777" },
    { label: "Educational", value: dna.educational, icon: "", dest: "education", color: "#ea580c" },
  ];

  const researcherDetails = dna.researcherList.slice(0, 4).map(id => researchers.find(r => r.id === id)).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* DNA grid */}
      <div>
        <h4 className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>Research Footprint</h4>
        <div className="grid grid-cols-4 gap-2">
          {cells.map(c => (
            <button key={c.label} onClick={() => onNavigate?.(c.dest)} className="card p-2.5 text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-base mb-0.5">{c.icon}</div>
              <div className="text-lg font-bold" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[9px] font-medium leading-tight" style={{ color: "var(--text-muted)" }}>{c.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Researchers */}
      <div>
        <h4 className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>Key Researchers</h4>
        <div className="space-y-1.5">
          {researcherDetails.map((r: any) => (
            <div key={r.id} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700 flex-shrink-0">
                {r.name.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <div className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{r.name}</div>
                <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{r.domain}</div>
              </div>
            </div>
          ))}
          {dna.researcherList.length > 4 && (
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>+{dna.researcherList.length - 4} more researchers</div>
          )}
        </div>
      </div>

      {/* Connection graph (simplified) */}
      <div>
        <h4 className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>Knowledge Connections</h4>
        <div className="rounded-lg p-3 text-[10px] space-y-1.5" style={{ background: "#f8fafc", border: "1px solid var(--border)" }}>
          {[
            { from: "Expedition", to: "Maitri / Bharati Stations", rel: "at" },
            { from: "Station", to: `${dna.projects} Projects`, rel: "hosts" },
            { from: "Projects", to: `${dna.datasets} Datasets`, rel: "produced" },
            { from: "Datasets", to: `${dna.findings} Findings`, rel: "generated" },
            { from: "Findings", to: `${dna.publications} Publications`, rel: "published in" },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="font-semibold" style={{ color: "var(--accent)" }}>{row.from}</span>
              <span style={{ color: "var(--text-muted)" }}>→ {row.rel} →</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{row.to}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
