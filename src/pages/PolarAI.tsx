import { useState } from "react";
import { aiAgents } from "../knowledgeData";
import { EvidenceBadge } from "../components/EvidenceBadge";
import type { WorkspaceSource, SourceType } from "../workspaceStore";
import { typeIcon } from "../workspaceStore";
import { publications, datasets, expeditions } from "../data";

interface Message {
  role: "user" | "assistant";
  text: string;
  agent?: string;
  evidenceStatus?: "source_backed" | "synthesis" | "insufficient_evidence" | "conflicting";
  confidence?: number;
  sources?: string[];
  relatedLinks?: { label: string; dest: string }[];
  actions?: string[];
}

interface Artifact {
  id: string;
  tool: string;
  icon: string;
  title: string;
  sourceCount: number;
  status: "draft" | "saved" | "approved";
  createdAt: string;
  content: any;
}

interface FlashCard { q: string; a: string; source: string; }
interface QuizQ { q: string; options: string[]; correct: number; explanation: string; source: string; }
interface Slide { title: string; bullets: string[]; source: string; }
interface Scene { scene: number; narration: string; visual: string; source: string; }

const STUDIO_TOOLS = [
  { id: "report",      icon: "", label: "Research Report",  desc: "Structured report with executive summary and findings" },
  { id: "slides",      icon: "", label: "Slide Deck",       desc: "Presentation-ready slides from source content" },
  { id: "audio",       icon: "", label: "Audio Script",     desc: "Narration script for an audio knowledge overview" },
  { id: "video",       icon: "", label: "Video Storyboard", desc: "Scene-by-scene storyboard with narration text" },
  { id: "mindmap",     icon: "", label: "Mind Map",         desc: "Visual concept map of source relationships" },
  { id: "flashcards",  icon: "", label: "Flashcards",       desc: "Study flashcards generated from key findings" },
  { id: "quiz",        icon: "", label: "Quiz",             desc: "Knowledge quiz based on selected sources" },
  { id: "infographic", icon: "", label: "Infographic",      desc: "Key statistics and facts visual layout" },
  { id: "datatable",   icon: "", label: "Data Table",       desc: "Comparative data table from source metadata" },
];

const RESPONSES: Record<string, Omit<Message, "role">> = {
  "How does sea ice affect climate change?": {
    agent: "research",
    text: "Sea ice plays a crucial role in Earth's climate by reflecting sunlight (high albedo effect), regulating ocean temperatures, and influencing atmospheric circulation. When sea ice melts, it exposes dark ocean water which absorbs more heat, accelerating warming — the ice-albedo feedback loop. A decline in sea ice can accelerate global warming, affect weather patterns, and alter ocean circulation.",
    confidence: 91,
    evidenceStatus: "source_backed",
    sources: ["Changing sea ice dynamics in the Southern Ocean (J. Glaciology, 2024)", "Antarctic Sea Ice Concentration Dataset (2023)"],
    relatedLinks: [{ label: "Sea Ice Dataset", dest: "datasets" }, { label: "46th IAE Research", dest: "expeditions" }],
    actions: ["Explain for Students", "Compare Sources", "Show Evidence"],
  },
  "What is the Maitri research station?": {
    agent: "explorer",
    text: "Maitri is India's second permanent Antarctic research station, established in 1989 in the Schirmacher Oasis of Dronning Maud Land (70°46′S, 11°44′E). It operates year-round and supports research in glaciology, atmospheric science, geology, biology, and environmental monitoring. It is managed by NCPOR under the Ministry of Earth Sciences.",
    confidence: 96,
    evidenceStatus: "source_backed",
    sources: ["NCPOR Station Overview", "40 Years of Indian Antarctic Research (2024)"],
    relatedLinks: [{ label: "View on Map", dest: "map" }, { label: "Maitri Expeditions", dest: "expeditions" }],
    actions: ["Explore Connections", "View Related Research"],
  },
  "Show Antarctic climate trends": {
    agent: "research",
    text: "Antarctic climate shows complex regional variability. The Antarctic Peninsula has warmed by approximately 3°C over 50 years. The Southern Ocean has absorbed over 70% of excess global heat. Sea ice extent reached a record minimum of 1.79 million km² in February 2023. The East Antarctic Ice Sheet remains relatively stable, while the West Antarctic Ice Sheet shows accelerating mass loss.",
    confidence: 82,
    evidenceStatus: "synthesis",
    sources: ["Changing sea ice dynamics (2024) — source-backed for sea ice minimum", "Indian Arctic Ocean observations (2022) — synthesized for warming trend"],
    relatedLinks: [{ label: "Sea Ice Dataset", dest: "datasets" }, { label: "Knowledge Trends", dest: "dashboard" }],
    actions: ["Compare Sources", "Show Evidence", "Explain for Students"],
  },
  "List Indian Antarctic expeditions": {
    agent: "research",
    text: "India has conducted 46 Antarctic Expeditions since 1981. Key milestones: 1st IAE (1981) — first Indian expedition; 3rd IAE (1983) — Dakshin Gangotri established; 9th IAE (1989) — Maitri station inaugurated; 31st IAE (2011) — Bharati construction begins; 46th IAE (2024) — currently active. All expeditions are documented in the NCPOR Expedition Archive.",
    confidence: 98,
    evidenceStatus: "source_backed",
    sources: ["NCPOR Expedition Archive", "46th IAE Science Plan (2024)"],
    relatedLinks: [{ label: "View All Expeditions", dest: "expeditions" }, { label: "Expedition Datasets", dest: "datasets" }],
    actions: ["Explore Connections", "View on Map"],
  },
};

const ACTION_RESULTS: Record<string, string> = {
  "Explain for Students": "Student-friendly version (source-grounded, facts preserved):\n\nSea ice is like a giant mirror floating on the ocean. When the sun shines on it, most of the light bounces back into space. But when the ice melts, the dark ocean underneath absorbs heat instead — making the planet warmer faster. Scientists call this the ice-albedo effect. India's NCPOR scientists measure this directly from stations like Maitri.",
  "Compare Sources": "Source comparison:\n\n• Changing sea ice dynamics (2024): SOURCE-BACKED — uses direct satellite measurements. Confidence: 94%.\n• Indian Arctic Ocean observations (2022): SYNTHESIS — combines multiple datasets. Confidence: 76%.\n\nBoth sources agree on the warming trend direction but differ in magnitude estimates by approximately 0.4°C/decade.",
  "Show Evidence": "Evidence passage:\n\n'Sea ice extent reached 1.79 million km² in February 2023, representing 1.03 million km² below the 1981–2010 average.' — Changing sea ice dynamics in the Southern Ocean (Journal of Glaciology, 2024). DOI: 10.1017/jog.2024.001. Confidence: 94%. Status: SOURCE_BACKED.",
  "Explore Connections": "Knowledge connections identified:\n\nSea Ice → Ocean Heat Uptake → Southern Ocean Circulation → Global Climate Feedback\n\nRelated NCPOR datasets: 3 | Related publications: 6 | Related expeditions: 2",
  "View Related Research": "Related research found:\n\n1. Bharati Station oceanographic surveys (2012–2024)\n2. Glacial mass balance at Dakshin Gangotri (2022)\n3. Polar vortex dynamics and Southern Hemisphere climate (2024)\n\nAll peer-reviewed and indexed in NCPOR repository.",
};

const EXAMPLE_QUESTIONS = [
  "How does sea ice affect climate change?",
  "What is the Maitri research station?",
  "Show Antarctic climate trends",
  "List Indian Antarctic expeditions",
  "Explain Southern Ocean carbon uptake",
];

type PubRecord  = typeof publications[0];
type DsRecord   = typeof datasets[0];
type ExpRecord  = typeof expeditions[0];

interface ResolvedSource {
  ws: WorkspaceSource;
  pub?: PubRecord;
  ds?: DsRecord;
  exp?: ExpRecord;
}

function resolveAll(sources: WorkspaceSource[]): ResolvedSource[] {
  return sources.map(ws => {
    const num = parseInt(ws.id.split("-")[1], 10);
    return {
      ws,
      pub: ws.type === "publication" ? publications.find(p => p.id === num) : undefined,
      ds:  ws.type === "dataset"     ? datasets.find(d => d.id === num)     : undefined,
      exp: ws.type === "expedition"  ? expeditions.find(e => e.id === num)  : undefined,
    };
  });
}

function genReport(sources: WorkspaceSource[]): string {
  const date = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  const resolved = resolveAll(sources);
  const pubs  = resolved.filter(r => r.pub).map(r => r.pub!);
  const dsets = resolved.filter(r => r.ds).map(r => r.ds!);
  const exps  = resolved.filter(r => r.exp).map(r => r.exp!);

  const sourceLines = resolved.map((r, i) => {
    if (r.pub)  return `[${i+1}] ${r.pub.title} — ${r.pub.authors}. ${r.pub.journal} (${r.pub.year}). DOI: ${r.pub.doi}`;
    if (r.ds)   return `[${i+1}] ${r.ds.title} — ${r.ds.format}, ${r.ds.size}, ${r.ds.region} (${r.ds.year}). NCPOR Open Data.`;
    if (r.exp)  return `[${i+1}] ${r.exp.subtitle} — ${r.exp.region}, ${r.exp.dates}. NCPOR Expedition Archive.`;
    return `[${i+1}] ${r.ws.title} — ${r.ws.type}. NCPOR Repository.`;
  }).join("\n");

  const pubSection = pubs.length > 0 ? `\n## Publications Reviewed (${pubs.length})\n` + pubs.map(p =>
    `### ${p.title}\n**Authors:** ${p.authors}  \n**Journal:** ${p.journal} · ${p.year}  \n**DOI:** ${p.doi}  \n**Significance:** Peer-reviewed contribution to ${p.journal} advancing NCPOR's polar science mandate.`
  ).join("\n\n") : "";

  const dsSection = dsets.length > 0 ? `\n## Datasets Analysed (${dsets.length})\n` + dsets.map(d =>
    `### ${d.title}\n**Parameter:** ${d.parameter}  \n**Region:** ${d.region}  \n**Format:** ${d.format}  \n**Size:** ${d.size}  \n**Year:** ${d.year}  \n**Category:** ${d.category}  \n**Coverage:** Systematic measurements from NCPOR field campaigns.`
  ).join("\n\n") : "";

  const expSection = exps.length > 0 ? `\n## Expeditions Referenced (${exps.length})\n` + exps.map(e =>
    `### ${e.subtitle}\n**Dates:** ${e.dates}  \n**Region:** ${e.region}  \n**Status:** ${e.status}  \n**Research focus:** ${e.description}`
  ).join("\n\n") : "";

  const regions = [...new Set([...exps.map(e => e.region), ...dsets.map(d => d.region)])].join(", ") || "Polar regions";
  const years   = [...new Set([...pubs.map(p => p.year), ...dsets.map(d => d.year), ...exps.map(e => e.year)])].sort();
  const span    = years.length > 1 ? `${years[0]}–${years[years.length-1]}` : (years[0] ?? "Recent");

  return `NCPOR RESEARCH SYNTHESIS REPORT
Generated: ${date}
Status: DRAFT — Requires editorial review before official publication
Sources: ${sources.length} | Period: ${span} | Region: ${regions}

════════════════════════════════════════

EXECUTIVE SUMMARY

This report synthesises findings from ${sources.length} NCPOR knowledge source(s) covering the period ${span}. ${
  pubs.length > 0 ? `${pubs.length} peer-reviewed publication(s) are included, spanning journals: ${[...new Set(pubs.map(p => p.journal))].join(", ")}.` : ""
} ${
  dsets.length > 0 ? `${dsets.length} scientific dataset(s) are included, covering parameters: ${[...new Set(dsets.map(d => d.parameter))].join(", ")}.` : ""
} ${
  exps.length > 0 ? `${exps.length} expedition(s) are referenced: ${exps.map(e => e.title).join(", ")}.` : ""
}

All claims in this report are bounded by indexed NCPOR sources. Evidence status: SOURCE-BACKED where primary data is cited; SYNTHESIS where multiple sources are combined.
${pubSection}
${dsSection}
${expSection}

════════════════════════════════════════

EVIDENCE ASSESSMENT

${resolved.map((r, i) => {
  if (r.pub) return `[${i+1}] ${r.pub.title} — SOURCE-BACKED (peer-reviewed, DOI verified)`;
  if (r.ds)  return `[${i+1}] ${r.ds.title} — SOURCE-BACKED (NCPOR open dataset)`;
  if (r.exp) return `[${i+1}] ${r.exp.title} — SOURCE-BACKED (NCPOR expedition record)`;
  return `[${i+1}] ${r.ws.title} — SYNTHESIS`;
}).join("\n")}

LIMITATIONS

This synthesis is limited to digitally indexed NCPOR sources. Field observations from recent expeditions may not yet be fully indexed. Absence of a record does not indicate absence of scientific work.

════════════════════════════════════════

REFERENCES

${sourceLines}

────────────────────────────────────────
AI-generated draft · Not an official NCPOR document · Requires scientific and editorial review before publication`;
}

function genSlides(sources: WorkspaceSource[]): Slide[] {
  const resolved = resolveAll(sources);
  const slides: Slide[] = [];
  const regions = [...new Set(resolved.flatMap(r => r.exp ? [r.exp.region] : r.ds ? [r.ds.region] : []))];
  slides.push({
    title: "NCPOR Polar Knowledge Synthesis",
    bullets: [
      `${sources.length} source(s) selected`,
      `Regions: ${regions.join(", ") || "Polar"}`,
      "National Centre for Polar and Ocean Research",
      "Ministry of Earth Sciences, Government of India",
    ],
    source: "NCPOR Repository",
  });
  resolved.forEach(r => {
    if (r.pub) {
      slides.push({
        title: r.pub.title,
        bullets: [
          `Authors: ${r.pub.authors}`,
          `Published: ${r.pub.journal}, ${r.pub.year}`,
          `DOI: ${r.pub.doi}`,
          "Status: Peer-reviewed · Source-backed",
        ],
        source: `${r.pub.journal} (${r.pub.year})`,
      });
    } else if (r.ds) {
      slides.push({
        title: r.ds.title,
        bullets: [
          `Parameter: ${r.ds.parameter}`,
          `Region: ${r.ds.region}`,
          `Format: ${r.ds.format} · Size: ${r.ds.size}`,
          `Category: ${r.ds.category} · Year: ${r.ds.year}`,
          "Availability: NCPOR Open Data Portal",
        ],
        source: `NCPOR Datasets (${r.ds.year})`,
      });
    } else if (r.exp) {
      slides.push({
        title: r.exp.subtitle,
        bullets: [
          `Dates: ${r.exp.dates}`,
          `Region: ${r.exp.region}`,
          `Status: ${r.exp.status}`,
          `Focus: ${r.exp.description}`,
        ],
        source: `NCPOR Expedition Archive · ${r.exp.title}`,
      });
    }
  });
  slides.push({
    title: "Conclusions & Next Steps",
    bullets: [
      "All evidence is bounded by indexed NCPOR sources",
      "Further field data may not yet be indexed",
      "Submit this deck through the governance workflow for review",
      "Regenerate when source versions are updated",
    ],
    source: "NCPOR Polar Knowledge AI · AI-generated draft",
  });

  return slides;
}

function genAudioScript(sources: WorkspaceSource[]): string {
  const resolved = resolveAll(sources);
  const date = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const sourceSegments = resolved.map((r, i) => {
    const min = 1.5 + i * 0.75;
    const sec = `${Math.floor(min)}:${String(Math.round((min % 1) * 60)).padStart(2, "0")}`;
    if (r.pub) {
      return `[SOURCE ${i+1} — ${sec}]\nA ${r.pub.year} paper in ${r.pub.journal} — titled "${r.pub.title}" — by ${r.pub.authors} — examines this area of polar science. The study, available under DOI ${r.pub.doi}, represents peer-reviewed, source-backed knowledge in the NCPOR repository.`;
    }
    if (r.ds) {
      return `[SOURCE ${i+1} — ${sec}]\nThe dataset "${r.ds.title}" captures ${r.ds.parameter.toLowerCase()} data across the ${r.ds.region} region. Released in ${r.ds.year}, this ${r.ds.format} dataset — ${r.ds.size} in size — forms part of NCPOR's open scientific data infrastructure.`;
    }
    if (r.exp) {
      return `[SOURCE ${i+1} — ${sec}]\nThe ${r.exp.subtitle}, conducted from ${r.exp.dates} across the ${r.exp.region} region. ${r.exp.description} This expedition record is archived in the NCPOR knowledge repository.`;
    }
    return `[SOURCE ${i+1} — ${sec}]\n${r.ws.title} — ${r.ws.type} source from the NCPOR repository.`;
  }).join("\n\n");

  const closingMin = 1.5 + resolved.length * 0.75;
  const closingSec = `${Math.floor(closingMin)}:${String(Math.round((closingMin % 1) * 60)).padStart(2, "0")}`;

  return `NCPOR POLAR KNOWLEDGE — AUDIO OVERVIEW SCRIPT
Generated: ${date}
Sources: ${sources.length} | Status: AI DRAFT — Not for broadcast without scientific review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[INTRO — 0:00]
Welcome to the NCPOR Polar Knowledge Audio Overview. This episode explores ${sources.length} knowledge source(s) from India's National Centre for Polar and Ocean Research, covering ${[...new Set(resolved.flatMap(r => r.exp ? [r.exp.region] : r.ds ? [r.ds.region] : []))].join(" and ") || "the polar regions"}.

[CONTEXT — 0:45]
India has maintained a continuous scientific presence in Antarctica since 1981, when the first Indian Antarctic Expedition set sail from Goa. NCPOR operates Maitri station in the Schirmacher Oasis (since 1989), Bharati station on the shores of Prydz Bay (since 2012), and Himadri station in Ny-Ålesund, Svalbard (since 2008). These stations serve as permanent observatories of the polar environment.

[SOURCES — 1:30]
${sourceSegments}

[CLOSING — ${closingSec}]
${sources.length > 1 ? `These ${sources.length} sources together` : "This source"} represent${sources.length === 1 ? "s" : ""} a portion of NCPOR's indexed knowledge. All claims presented are bounded by the selected repository sources. For primary data, visit the NCPOR Scientific Datasets portal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI-generated script · Requires scientific review before broadcast · Not an official NCPOR communication`;
}

function genVideoStoryboard(sources: WorkspaceSource[]): Scene[] {
  const resolved = resolveAll(sources);
  const scenes: Scene[] = [];

  scenes.push({
    scene: 1,
    narration: "India's polar science journey began in 1981, when the first Indian Antarctic Expedition set sail from Goa. Forty-six expeditions later, NCPOR's research spans two continents of ice.",
    visual: "Time-lapse montage: map of India → Southern Ocean → Antarctica. Archival expedition footage overlaid with expedition count counter.",
    source: "NCPOR Expedition Archive",
  });

  resolved.forEach((r, i) => {
    if (r.exp) {
      scenes.push({
        scene: scenes.length + 1,
        narration: `The ${r.exp.subtitle}, operating from ${r.exp.dates} across the ${r.exp.region} region. ${r.exp.description}`,
        visual: `Research vessel crossing the Southern Ocean. Cut to station operations — instruments, field teams, sample collection. Status overlay: "${r.exp.status}".`,
        source: r.exp.title,
      });
    } else if (r.ds) {
      scenes.push({
        scene: scenes.length + 1,
        narration: `The dataset "${r.ds.title}" — ${r.ds.size} of ${r.ds.parameter.toLowerCase()} data from the ${r.ds.region}, collected in ${r.ds.year} and available in ${r.ds.format} format through the NCPOR open data portal.`,
        visual: `Satellite imagery of ${r.ds.region}. Data visualisation — colour-coded ${r.ds.parameter.toLowerCase()} maps. Scientists downloading and processing ${r.ds.format} files.`,
        source: r.ds.title,
      });
    } else if (r.pub) {
      scenes.push({
        scene: scenes.length + 1,
        narration: `"${r.pub.title}" — published in ${r.pub.journal} in ${r.pub.year} by ${r.pub.authors}. A peer-reviewed contribution connecting NCPOR field work to global scientific discourse.`,
        visual: `Journal cover / DOI graphic (${r.pub.doi}). Pull-quote animation from paper abstract. Authors' names displayed. Citation count overlay.`,
        source: `${r.pub.journal} (${r.pub.year})`,
      });
    }
  });

  scenes.push({
    scene: scenes.length + 1,
    narration: "The polar regions are not distant frontiers. They are the planet's early-warning system — and India is listening, measuring, and publishing. The NCPOR knowledge repository: open, peer-reviewed, source-backed.",
    visual: "Wide shot — aurora australis over Maitri station. Slow zoom to NCPOR logo. Repository URL lower-third. Fade to black.",
    source: "NCPOR Polar Knowledge AI · AI-generated storyboard",
  });

  return scenes;
}

function genFlashcards(sources: WorkspaceSource[]): FlashCard[] {
  const resolved = resolveAll(sources);
  const cards: FlashCard[] = [];

  resolved.forEach(r => {
    if (r.pub) {
      cards.push({ q: `Which journal published "${r.pub.title.slice(0, 50)}${r.pub.title.length > 50 ? "…" : ""}"?`, a: `${r.pub.journal} (${r.pub.year})`, source: r.pub.title });
      cards.push({ q: `Who are the authors of the ${r.pub.year} study on "${r.pub.title.split(" ").slice(0, 5).join(" ")}…"?`, a: r.pub.authors, source: r.pub.title });
      cards.push({ q: `What is the DOI for the ${r.pub.year} paper "${r.pub.title.split(" ").slice(0, 4).join(" ")}…"?`, a: r.pub.doi, source: r.pub.title });
    }
    if (r.ds) {
      cards.push({ q: `What file format is the dataset "${r.ds.title.slice(0, 40)}…" stored in?`, a: `${r.ds.format} (${r.ds.size})`, source: r.ds.title });
      cards.push({ q: `Which scientific parameter does "${r.ds.title.slice(0, 40)}…" measure?`, a: `${r.ds.parameter} — covering the ${r.ds.region} region (${r.ds.year})`, source: r.ds.title });
      cards.push({ q: `In which region was the dataset "${r.ds.title.slice(0, 40)}…" collected?`, a: `${r.ds.region} · Category: ${r.ds.category}`, source: r.ds.title });
    }
    if (r.exp) {
      cards.push({ q: `When did the ${r.exp.subtitle} take place?`, a: r.exp.dates, source: r.exp.title });
      cards.push({ q: `What was the primary research focus of the ${r.exp.title}?`, a: r.exp.description, source: r.exp.title });
      cards.push({ q: `Which region did the ${r.exp.title} cover?`, a: `${r.exp.region} — status: ${r.exp.status}`, source: r.exp.title });
    }
  });
  if (cards.length === 0) {
    cards.push({ q: "What does NCPOR stand for?", a: "National Centre for Polar and Ocean Research — apex body for Indian polar science, Ministry of Earth Sciences.", source: "NCPOR" });
  }

  return cards;
}

function genQuiz(sources: WorkspaceSource[]): QuizQ[] {
  const resolved = resolveAll(sources);
  const questions: QuizQ[] = [];

  resolved.forEach(r => {
    if (r.pub) {
      const otherJournals = publications.filter(p => p.id !== r.pub!.id).map(p => p.journal);
      const options = shuffle([r.pub.journal, ...otherJournals.slice(0, 3)]);
      questions.push({
        q: `In which journal was "${r.pub.title.slice(0, 60)}${r.pub.title.length > 60 ? "…" : ""}" published?`,
        options,
        correct: options.indexOf(r.pub.journal),
        explanation: `This paper was published in ${r.pub.journal} in ${r.pub.year}. Authors: ${r.pub.authors}. DOI: ${r.pub.doi}`,
        source: r.pub.title,
      });
      const otherYears = publications.filter(p => p.id !== r.pub!.id).map(p => String(p.year));
      const yearOptions = shuffle([String(r.pub.year), ...otherYears.slice(0, 3)]);
      questions.push({
        q: `In what year was "${r.pub.title.split(" ").slice(0, 6).join(" ")}…" published by ${r.pub.authors.split(",")[0]}?`,
        options: yearOptions,
        correct: yearOptions.indexOf(String(r.pub.year)),
        explanation: `Published in ${r.pub.year} in ${r.pub.journal}. Full citation: ${r.pub.authors}. ${r.pub.journal} (${r.pub.year}).`,
        source: r.pub.title,
      });
    }

    if (r.ds) {
      const otherFormats = datasets.filter(d => d.id !== r.ds!.id).map(d => d.format);
      const fmtOptions = shuffle([r.ds.format, ...otherFormats.slice(0, 3)]);
      questions.push({
        q: `What file format is the dataset "${r.ds.title.slice(0, 50)}…" stored in?`,
        options: fmtOptions,
        correct: fmtOptions.indexOf(r.ds.format),
        explanation: `This dataset is stored in ${r.ds.format} format. It covers ${r.ds.parameter} in the ${r.ds.region} and is ${r.ds.size} in size (${r.ds.year}).`,
        source: r.ds.title,
      });
      const otherRegions = datasets.filter(d => d.id !== r.ds!.id).map(d => d.region);
      const regOptions = shuffle([r.ds.region, ...otherRegions.slice(0, 3)]);
      questions.push({
        q: `Which region does the dataset "${r.ds.title.slice(0, 45)}…" cover?`,
        options: regOptions,
        correct: regOptions.indexOf(r.ds.region),
        explanation: `This dataset covers the ${r.ds.region} region, measuring ${r.ds.parameter}. Category: ${r.ds.category}. Format: ${r.ds.format}.`,
        source: r.ds.title,
      });
    }

    if (r.exp) {
      const otherDates = expeditions.filter(e => e.id !== r.exp!.id).map(e => e.dates);
      const dateOptions = shuffle([r.exp.dates, ...otherDates.slice(0, 3)]);
      questions.push({
        q: `When did the ${r.exp.subtitle} take place?`,
        options: dateOptions,
        correct: dateOptions.indexOf(r.exp.dates),
        explanation: `The ${r.exp.subtitle} ran from ${r.exp.dates} in the ${r.exp.region} region. ${r.exp.description}`,
        source: r.exp.title,
      });
      const regionOptions = shuffle([r.exp.region, "Southern Ocean", "Arctic Ocean", "Sub-Antarctic Islands"].filter(x => x !== r.exp!.region || true).slice(0, 4));
      const corrIdx = regionOptions.indexOf(r.exp.region) >= 0 ? regionOptions.indexOf(r.exp.region) : 0;
      questions.push({
        q: `What region did the ${r.exp.title} cover?`,
        options: corrIdx >= 0 ? regionOptions : [r.exp.region, "Southern Ocean", "Arctic Ocean", "Sub-Antarctic Islands"],
        correct: corrIdx >= 0 ? corrIdx : 0,
        explanation: `The ${r.exp.subtitle} operated in the ${r.exp.region} region from ${r.exp.dates}. Research focus: ${r.exp.description}`,
        source: r.exp.title,
      });
    }
  });

  return questions.slice(0, 8);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genInfographic(sources: WorkspaceSource[]): { title: string; facts: { label: string; value: string; color: string }[] } {
  const resolved = resolveAll(sources);
  const pubs  = resolved.filter(r => r.pub).map(r => r.pub!);
  const dsets = resolved.filter(r => r.ds).map(r => r.ds!);
  const exps  = resolved.filter(r => r.exp).map(r => r.exp!);

  const years  = [...new Set([...pubs.map(p => p.year), ...dsets.map(d => d.year), ...exps.map(e => e.year)])].sort();
  const span   = years.length > 1 ? `${years[0]}–${years[years.length-1]}` : (years[0] ? String(years[0]) : "Recent");
  const params = [...new Set(dsets.map(d => d.parameter))];
  const journals = [...new Set(pubs.map(p => p.journal))];
  const regions  = [...new Set([...dsets.map(d => d.region), ...exps.map(e => e.region)])];
  const totalSize = dsets.reduce((sum, d) => sum + parseFloat(d.size), 0);

  const facts: { label: string; value: string; color: string }[] = [
    { label: "Selected Sources",  value: String(sources.length),                       color: "#1e40af" },
    { label: "Publications",      value: String(pubs.length),                           color: "#7c3aed" },
    { label: "Datasets",          value: String(dsets.length),                          color: "#16a34a" },
    { label: "Expeditions",       value: String(exps.length),                           color: "#2563eb" },
  ];

  if (pubs.length > 0)   facts.push({ label: "Journals Covered", value: String(journals.length),              color: "#d97706" });
  if (dsets.length > 0)  facts.push({ label: "Parameters",        value: params.join(", ").slice(0, 20) || "–", color: "#0891b2" });
  if (dsets.length > 0)  facts.push({ label: "Total Data Size",   value: `${totalSize.toFixed(1)} GB`,          color: "#dc2626" });
  if (regions.length > 0) facts.push({ label: "Regions",          value: regions.join(", ").slice(0, 20),        color: "#ea580c" });
  if (years.length > 0)  facts.push({ label: "Coverage Period",   value: span,                                   color: "#0e7490" });
  if (exps.length > 0)   facts.push({ label: "Expedition Status", value: exps.map(e => e.status).join(", "),     color: "#7c3aed" });

  return { title: `Source Snapshot — ${sources.length} NCPOR Source(s)`, facts: facts.slice(0, 8) };
}

function genDataTable(sources: WorkspaceSource[]): { headers: string[]; rows: string[][] } {
  const resolved = resolveAll(sources);

  const rows = resolved.map(r => {
    if (r.pub) return [
      " Publication",
      r.pub.title.slice(0, 38) + (r.pub.title.length > 38 ? "…" : ""),
      r.pub.authors.split(",")[0] + " et al.",
      r.pub.journal,
      String(r.pub.year),
      r.pub.doi,
      "SOURCE-BACKED",
    ];
    if (r.ds) return [
      " Dataset",
      r.ds.title.slice(0, 38) + (r.ds.title.length > 38 ? "…" : ""),
      r.ds.parameter,
      r.ds.region,
      String(r.ds.year),
      `${r.ds.format} · ${r.ds.size}`,
      "OPEN ACCESS",
    ];
    if (r.exp) return [
      " Expedition",
      r.exp.title.slice(0, 38) + (r.exp.title.length > 38 ? "…" : ""),
      r.exp.region,
      r.exp.dates,
      String(r.exp.year),
      r.exp.status,
      "SOURCE-BACKED",
    ];
    return ["–", r.ws.title.slice(0, 38), "–", "–", r.ws.date || "–", "–", "–"];
  });

  const hasPublications = resolved.some(r => r.pub);
  const headers = hasPublications
    ? ["Type", "Title", "Author / Parameter", "Journal / Region", "Year", "DOI / Format", "Status"]
    : ["Type", "Title", "Parameter / Region", "Region / Dates", "Year", "Format / Status", "Evidence"];

  return { headers, rows: rows.length > 0 ? rows : [["–", "No sources selected", "–", "–", "–", "–", "–"]] };
}

type SearchResult = { id: string; type: SourceType; title: string; meta: string; date?: string; origin?: string };

function searchAllSources(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  if (!q) return [];
  publications.filter(p => p.title.toLowerCase().includes(q) || p.journal.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q)).slice(0, 4).forEach(p =>
    results.push({ id: `pub-${p.id}`, type: "publication", title: p.title, meta: `${p.journal} · ${p.year}`, date: String(p.year), origin: "NCPOR Publications" })
  );
  datasets.filter(d => d.title.toLowerCase().includes(q) || d.parameter.toLowerCase().includes(q)).slice(0, 3).forEach(d =>
    results.push({ id: `ds-${d.id}`, type: "dataset", title: d.title, meta: `${d.format} · ${d.size}`, date: String(d.year), origin: "NCPOR Datasets" })
  );
  expeditions.filter(e => e.title.toLowerCase().includes(q) || e.region.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)).slice(0, 3).forEach(e =>
    results.push({ id: `exp-${e.id}`, type: "expedition", title: e.title, meta: `${e.region} · ${e.dates}`, date: e.dates, origin: "NCPOR Expeditions" })
  );
  return results.slice(0, 8);
}

function MindMapView({ sources }: { sources: WorkspaceSource[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const resolved = resolveAll(sources);
  const angleStep = (2 * Math.PI) / Math.max(sources.length, 1);
  const radius = Math.min(34, 10 + sources.length * 5);

  const typeColor: Record<string, string> = {
    publication: "#7c3aed", dataset: "#16a34a",
    expedition: "#2563eb", media: "#d97706",
    event: "#0891b2", station: "#dc2626", researcher: "#ea580c",
  };
  function childNodes(r: ResolvedSource, px: number, py: number) {
    const children: { label: string; cx: number; cy: number; color: string }[] = [];
    const push = (label: string, dx: number, dy: number) =>
      children.push({ label, cx: px + dx, cy: py + dy, color: typeColor[r.ws.type] });
    if (r.pub) { push(r.pub.journal.split(" ")[0], -8, -7); push(String(r.pub.year), 8, -7); push(r.pub.authors.split(",")[0], 0, 8); }
    if (r.ds)  { push(r.ds.parameter, -8, -7); push(r.ds.region.split(" ")[0], 8, -7); push(r.ds.format, 0, 8); }
    if (r.exp) { push(r.exp.region, -8, -7); push(r.exp.status, 8, -7); push(r.exp.dates.split("–")[0].trim(), 0, 8); }
    return children;
  }

  const nodePositions = sources.map((_, i) => ({
    x: 50 + radius * Math.cos(angleStep * i - Math.PI / 2),
    y: 50 + radius * Math.sin(angleStep * i - Math.PI / 2),
  }));

  const centreLabel = sources.length === 1
    ? (resolved[0]?.pub?.title.split(" ").slice(0, 3).join(" ") || resolved[0]?.ds?.parameter || resolved[0]?.exp?.title || "Source")
    : `${sources.length} Sources`;

  return (
    <div className="rounded-xl overflow-hidden relative" style={{ background: "var(--surface-secondary)", border: "1px solid var(--border)", height: 300 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ cursor: "default" }}>
        
        <circle cx="50" cy="50" r="11" fill="#1e40af18" stroke="#1e40af" strokeWidth="0.8"/>
        <text x="50" y="48.5" textAnchor="middle" fontSize="3" fill="#1e40af" fontWeight="700">{centreLabel.slice(0, 14)}</text>
        <text x="50" y="53" textAnchor="middle" fontSize="2.3" fill="#1e40af" opacity="0.7">NCPOR</text>

        {nodePositions.map((pos, i) => {
          const r = resolved[i];
          const color = typeColor[r.ws.type] || "#64748b";
          const label = r.ws.title.split(" ").slice(0, 3).join(" ");
          const isSelected = selected === i;
          const children = isSelected ? childNodes(r, pos.x, pos.y) : [];

          return (
            <g key={i} style={{ cursor: "pointer" }} onClick={() => setSelected(isSelected ? null : i)}>
              
              <line x1="50" y1="50" x2={pos.x} y2={pos.y} stroke={color} strokeWidth={isSelected ? 0.9 : 0.5} opacity={isSelected ? 0.8 : 0.4} strokeDasharray={isSelected ? "none" : "2,1"}/>
              
              {children.map((ch, ci) => (
                <g key={ci}>
                  <line x1={pos.x} y1={pos.y} x2={ch.cx} y2={ch.cy} stroke={ch.color} strokeWidth="0.4" opacity="0.5"/>
                  <circle cx={ch.cx} cy={ch.cy} r="4.5" fill={ch.color + "18"} stroke={ch.color} strokeWidth="0.5"/>
                  <text x={ch.cx} y={ch.cy + 0.8} textAnchor="middle" fontSize="2.5" fill={ch.color} fontWeight="500">{ch.label.slice(0, 10)}</text>
                </g>
              ))}
              
              <circle cx={pos.x} cy={pos.y} r={isSelected ? 9 : 7.5} fill={color + (isSelected ? "28" : "18")} stroke={color} strokeWidth={isSelected ? 1 : 0.7}/>
              <text x={pos.x} y={pos.y - 0.5} textAnchor="middle" fontSize="2.8" fill={color} fontWeight="700">{label.slice(0, 10)}</text>
              <text x={pos.x} y={pos.y + 3.2} textAnchor="middle" fontSize="2" fill={color} opacity="0.75">{r.ws.type}</text>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-2 left-2 right-2 text-center text-[9px]" style={{ color: "var(--text-muted)" }}>
        Click a node to expand its attributes
      </div>
    </div>
  );
}

function FlashcardViewer({ cards }: { cards: FlashCard[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[idx];
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>Card {idx + 1} of {cards.length}</div>
      <div onClick={() => setFlipped(f => !f)} className="cursor-pointer select-none rounded-xl p-5 min-h-[120px] flex flex-col justify-between transition-all" style={{ background: flipped ? "var(--accent-light)" : "white", border: `2px solid ${flipped ? "var(--accent-border)" : "var(--border)"}` }}>
        <div className="text-[9px] font-semibold uppercase" style={{ color: "var(--text-muted)" }}>{flipped ? "ANSWER" : "QUESTION"}</div>
        <div className="text-sm font-medium leading-snug mt-2" style={{ color: "var(--text-primary)" }}>{flipped ? card.a : card.q}</div>
        <div className="text-[9px] mt-3" style={{ color: "var(--text-muted)" }}>Source: {card.source} · Click to {flipped ? "see question" : "reveal answer"}</div>
      </div>
      <div className="flex gap-2">
        <button className="btn-outline btn-sm flex-1" onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={idx === 0}>← Prev</button>
        <button className="btn-outline btn-sm flex-1" onClick={() => setFlipped(f => !f)}>Flip</button>
        <button className="btn-outline btn-sm flex-1" onClick={() => { setIdx(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); }} disabled={idx === cards.length - 1}>Next →</button>
      </div>
    </div>
  );
}

function QuizViewer({ questions }: { questions: QuizQ[] }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[idx];
  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
  }
  function next() {
    if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); }
    else setDone(true);
  }
  if (done) return (
    <div className="text-center py-6">
      <div className="text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>{score}/{questions.length}</div>
      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Score · {Math.round(score / questions.length * 100)}%</div>
      <button className="btn-primary btn-sm mt-4" onClick={() => { setIdx(0); setSelected(null); setScore(0); setDone(false); }}>Retry Quiz</button>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>Q{idx + 1} of {questions.length}</span>
        <span className="text-[11px]" style={{ color: "var(--accent)" }}>Score: {score}</span>
      </div>
      <div className="font-medium text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{q.q}</div>
      <div className="space-y-1.5">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correct;
          let bg = "white", border = "var(--border)", color = "var(--text-primary)";
          if (selected !== null) {
            if (isCorrect) { bg = "var(--success-bg)"; border = "#86efac"; color = "var(--success)"; }
            else if (isSelected) { bg = "#fef2f2"; border = "#fca5a5"; color = "#991b1b"; }
          }
          return (
            <button key={i} onClick={() => choose(i)} className="w-full text-left text-[11px] px-3 py-2 rounded-lg border transition-all" style={{ background: bg, borderColor: border, color }}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="text-[10px] p-2 rounded" style={{ background: "#f0f9ff", border: "1px solid #bae6fd", color: "#0c4a6e" }}>
          {q.explanation} · Source: {q.source}
        </div>
      )}
      {selected !== null && <button className="btn-primary btn-sm w-full" onClick={next}>{idx < questions.length - 1 ? "Next Question →" : "See Results"}</button>}
    </div>
  );
}

function SlidesViewer({ slides }: { slides: Slide[] }) {
  const [idx, setIdx] = useState(0);
  const s = slides[idx];
  return (
    <div className="space-y-3">
      <div className="rounded-xl p-5 min-h-[160px] flex flex-col justify-between" style={{ background: "linear-gradient(135deg, var(--header-bg) 0%, var(--accent) 100%)", color: "white" }}>
        <div className="text-[9px] uppercase tracking-widest opacity-60">Slide {idx + 1} of {slides.length}</div>
        <div>
          <div className="text-base font-bold mb-3">{s.title}</div>
          <ul className="space-y-1">
            {s.bullets.map((b, i) => <li key={i} className="text-[11px] opacity-90 flex gap-1.5"><span className="opacity-50 flex-shrink-0">›</span>{b}</li>)}
          </ul>
        </div>
        <div className="text-[9px] opacity-50 mt-3">Source: {s.source}</div>
      </div>
      <div className="flex gap-2">
        <button className="btn-outline btn-sm flex-1" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>← Prev</button>
        <button className="btn-outline btn-sm flex-1" onClick={() => setIdx(i => Math.min(slides.length - 1, i + 1))} disabled={idx === slides.length - 1}>Next →</button>
      </div>
    </div>
  );
}

function InfographicView({ data }: { data: ReturnType<typeof genInfographic> }) {
  return (
    <div>
      <div className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>{data.title}</div>
      <div className="grid grid-cols-2 gap-2">
        {data.facts.map((f, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ background: f.color + "12", border: `1px solid ${f.color}40` }}>
            <div className="text-lg font-black" style={{ color: f.color }}>{f.value}</div>
            <div className="text-[9px] mt-0.5" style={{ color: "var(--text-secondary)" }}>{f.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTableView({ data }: { data: ReturnType<typeof genDataTable> }) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
      <table className="w-full text-[10px]">
        <thead>
          <tr style={{ background: "var(--surface-secondary)", borderBottom: "1px solid var(--border)" }}>
            {data.headers.map(h => <th key={h} className="text-left px-2.5 py-2 font-semibold" style={{ color: "var(--text-secondary)" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 ? "var(--surface-secondary)" : "white" }}>
              {row.map((cell, j) => <td key={j} className="px-2.5 py-2" style={{ color: "var(--text-primary)" }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PolarAI({
  onNavigate,
  workspaceSources = [],
  onAddToWorkspace,
  onOpenStudio,
}: {
  onNavigate?: (p: string) => void;
  workspaceSources?: WorkspaceSource[];
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", agent: "research", text: "Welcome to the Polar Knowledge Workspace. Select sources from the left panel, then ask questions in Chat or create outputs in Studio. Every answer shows its evidence and confidence level." },
  ]);
  const [input, setInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("research");
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [actionAnswer, setActionAnswer] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<"chat" | "studio" | "history">("chat");
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [toolOutput, setToolOutput] = useState<any>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([
    { id: "a1", tool: "report", icon: "", title: "Antarctic Climate Synthesis", sourceCount: 3, status: "draft", createdAt: "2024-11-14", content: "" },
    { id: "a2", tool: "mindmap", icon: "", title: "Sea Ice Knowledge Map", sourceCount: 4, status: "saved", createdAt: "2024-11-10", content: "" },
    { id: "a3", tool: "quiz", icon: "", title: "Expedition History Quiz", sourceCount: 2, status: "approved", createdAt: "2024-11-08", content: "" },
  ]);

  const searchResults = searchAllSources(sourceSearch);
  const activeAgent = aiAgents.find(a => a.id === selectedAgent)!;
  function ask(q: string) {
    const userMsg: Message = { role: "user", text: q };
    const found = RESPONSES[q];
    const assistantMsg: Message = found
      ? { role: "assistant", ...found, agent: selectedAgent }
      : {
          role: "assistant", agent: selectedAgent,
          text: `Based on NCPOR's indexed knowledge${workspaceSources.length > 0 ? ` and your ${workspaceSources.length} selected source(s)` : ""}, I found relevant information on "${q}". Note: this response reflects available repository sources only — absence of a record does not indicate absence of scientific work.`,
          evidenceStatus: "insufficient_evidence",
          confidence: 40,
          sources: workspaceSources.length > 0 ? workspaceSources.map(s => s.title) : ["NCPOR Research Archive (incomplete coverage)"],
          relatedLinks: [{ label: "Browse Publications", dest: "publications" }, { label: "Browse Datasets", dest: "datasets" }],
        };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput(""); setActionAnswer(null);
  }

  function handleAction(action: string) {
    const result = ACTION_RESULTS[action];
    if (result) setActionAnswer(result);
  }
  function addSource(result: SearchResult) {
    if (addedIds.has(result.id)) return;
    onAddToWorkspace?.({ id: result.id, type: result.type, title: result.title, meta: result.meta, date: result.date, origin: result.origin });
    setAddedIds(prev => new Set(prev).add(result.id));
  }

  function isAlreadyInWorkspace(id: string) {
    return workspaceSources.some(s => s.id === id) || addedIds.has(id);
  }
  function runTool(toolId: string) {
    if (workspaceSources.length === 0) return;
    setSelectedTool(toolId);
    setGenerating(true);
    setToolOutput(null);
    setTimeout(() => {
      let output: any;
      switch (toolId) {
        case "report":      output = genReport(workspaceSources); break;
        case "slides":      output = genSlides(workspaceSources); break;
        case "audio":       output = genAudioScript(workspaceSources); break;
        case "video":       output = genVideoStoryboard(workspaceSources); break;
        case "mindmap":     output = workspaceSources; break;
        case "flashcards":  output = genFlashcards(workspaceSources); break;
        case "quiz":        output = genQuiz(workspaceSources); break;
        case "infographic": output = genInfographic(workspaceSources); break;
        case "datatable":   output = genDataTable(workspaceSources); break;
        default: output = null;
      }
      setToolOutput(output);
      setGenerating(false);
      const tool = STUDIO_TOOLS.find(t => t.id === toolId)!;
      const artifact: Artifact = {
        id: `a${Date.now()}`, tool: toolId, icon: tool.icon,
        title: `${tool.label} — ${new Date().toLocaleDateString("en-IN")}`,
        sourceCount: workspaceSources.length, status: "draft",
        createdAt: new Date().toISOString().slice(0, 10), content: output,
      };
      setArtifacts(prev => [artifact, ...prev]);
    }, 1400);
  }

  function renderToolOutput() {
    if (!toolOutput) return null;
    switch (selectedTool) {
      case "report": case "audio":
        return <pre className="text-[10px] leading-relaxed whitespace-pre-wrap font-mono p-3 rounded-lg overflow-auto max-h-72" style={{ background: "var(--surface-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>{toolOutput}</pre>;
      case "slides":     return <SlidesViewer slides={toolOutput} />;
      case "flashcards": return <FlashcardViewer cards={toolOutput} />;
      case "quiz":       return <QuizViewer questions={toolOutput} />;
      case "infographic":return <InfographicView data={toolOutput} />;
      case "datatable":  return <DataTableView data={toolOutput} />;
      case "mindmap":    return <MindMapView sources={toolOutput} />;
      case "video":      return (
        <div className="space-y-2">
          {(toolOutput as Scene[]).map((scene) => (
            <div key={scene.scene} className="rounded-lg p-3" style={{ background: "var(--surface-secondary)", border: "1px solid var(--border)" }}>
              <div className="text-[9px] font-bold uppercase mb-1" style={{ color: "var(--accent)" }}>Scene {scene.scene}</div>
              <div className="text-[11px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>{scene.narration}</div>
              <div className="text-[10px] italic" style={{ color: "var(--text-muted)" }}>Visual: {scene.visual}</div>
              <div className="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>Source: {scene.source}</div>
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  }

  const activeTool = STUDIO_TOOLS.find(t => t.id === selectedTool);

  return (
    <div className="h-full flex overflow-hidden" style={{ background: "var(--content-bg)" }}>
      <aside className="w-[250px] xl:w-[270px] flex-shrink-0 flex flex-col overflow-hidden bg-white" style={{ borderRight: "1px solid var(--border)" }}>
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Sources</div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>Trusted NCPOR knowledge</div>
            </div>
            {workspaceSources.length > 0 && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--accent)", color: "white" }}>{workspaceSources.length}</span>}
          </div>
          <button onClick={() => setAddSourceOpen(v => !v)} className="w-full btn-primary btn-sm mt-3">+ Add Sources</button>
        </div>

        {addSourceOpen && (
          <div className="flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-secondary)" }}>
            <div className="p-3">
              <input className="search-input w-full text-[11px]" placeholder="Search publications, datasets..." value={sourceSearch} onChange={e => setSourceSearch(e.target.value)} autoFocus />
            </div>
            {sourceSearch && (
              <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
                {searchResults.length === 0 ? (
                  <div className="px-3 py-4 text-center text-[10px]" style={{ color: "var(--text-muted)" }}>No results for "{sourceSearch}"</div>
                ) : searchResults.map(r => {
                  const already = isAlreadyInWorkspace(r.id);
                  return (
                    <div key={r.id} className="px-3 py-2 flex items-start gap-2" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="flex-shrink-0 text-sm mt-0.5">{typeIcon[r.type]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium leading-snug" style={{ color: "var(--text-primary)" }}>{r.title.slice(0, 42)}{r.title.length > 42 ? "…" : ""}</div>
                        <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{r.meta}</div>
                      </div>
                      <button onClick={() => addSource(r)} disabled={already} className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: already ? "var(--success-bg)" : "var(--accent)", color: already ? "var(--success)" : "white", cursor: already ? "default" : "pointer" }}>{already ? "OK" : "Add"}</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3">
          {workspaceSources.length === 0 ? (
            <div className="rounded-xl p-5 text-center" style={{ background: "var(--surface-secondary)", border: "1px dashed var(--accent-border)" }}>
              <div className="text-2xl mb-2"></div>
              <div className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>No sources selected</div>
              <div className="text-[9px] leading-relaxed mt-1" style={{ color: "var(--text-muted)" }}>Add publications, datasets or expedition records to ground PolarAI.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {workspaceSources.map(s => (
                <div key={s.id} className="rounded-xl p-3" style={{ background: "var(--accent-light)", border: "1px solid var(--accent-border)" }}>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 text-sm">{typeIcon[s.type]}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{s.title}</div>
                      <div className="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>{s.meta}</div>
                      {s.version && <div className="text-[8px] mt-1" style={{ color: "var(--text-muted)" }}>Version {s.version}</div>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-[9px] text-center pt-1 font-medium" style={{ color: "var(--accent)" }}>OK AI answers grounded in selected sources</div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Evidence Trust</div>
          <div className="grid grid-cols-2 gap-1.5">{(["source_backed", "synthesis", "insufficient_evidence", "conflicting"] as const).map(s => <EvidenceBadge key={s} status={s} />)}</div>
        </div>
      </aside>

      <section className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white" style={{ borderRight: "1px solid var(--border)" }}>
        <div className="flex-shrink-0 px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="page-header-title">PolarAI</h1>
              <p className="page-header-sub">Source-grounded polar intelligence</p>
            </div>
            <button className="btn-outline btn-sm flex-shrink-0" onClick={() => setAgentPanelOpen(v => !v)}>{activeAgent.icon} {activeAgent.name} ▾</button>
          </div>
          {agentPanelOpen && (
            <div className="mt-3 card p-3">
              <div className="grid grid-cols-2 gap-2">
                {aiAgents.map(agent => (
                  <button key={agent.id} onClick={() => { setSelectedAgent(agent.id); setAgentPanelOpen(false); }} className="p-2 rounded-lg text-left border transition-all" style={{ border: selectedAgent === agent.id ? "1px solid var(--accent-border)" : "1px solid transparent", background: selectedAgent === agent.id ? "var(--accent-light)" : "transparent" }}>
                    <div className="text-base mb-0.5">{agent.icon}</div>
                    <div className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>{agent.name}</div>
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{agent.purpose.slice(0, 45)}…</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {mainTab === "history" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Generated Artifacts</h2><div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{artifacts.length} artifact(s)</div></div>
              {artifacts.map(a => (
                <div key={a.id} className="card p-4 flex items-center gap-3">
                  <div className="text-2xl">{a.icon}</div><div className="flex-1 min-w-0"><div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{a.title}</div><div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{a.sourceCount} source(s) · {a.createdAt}</div></div>
                  <div className="flex items-center gap-2"><span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: a.status === "approved" ? "var(--success-bg)" : a.status === "saved" ? "var(--accent-light)" : "var(--warning-bg)", color: a.status === "approved" ? "var(--success)" : a.status === "saved" ? "var(--accent)" : "var(--warning)" }}>{a.status}</span><button className="btn-outline btn-sm text-[10px]" onClick={() => { setMainTab("studio"); setSelectedTool(a.tool); if (workspaceSources.length > 0) runTool(a.tool); }}>Open</button></div>
                </div>
              ))}
              {artifacts.length === 0 && <div className="card p-8 text-center"><div className="text-3xl mb-2"></div><div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>No artifacts yet</div><button className="btn-primary btn-sm mt-3" onClick={() => setMainTab("studio")}>Open Studio →</button></div>}
            </div>
          ) : (
            <div className="h-full flex flex-col min-h-0">
              <div className="flex-shrink-0 flex items-center gap-1 mb-3 p-1 rounded-lg w-fit" style={{ background: "var(--surface-secondary)", border: "1px solid var(--border)" }}>
                <button className={`px-3 py-1.5 rounded-md text-[10px] font-semibold ${mainTab === "chat" ? "shadow-sm" : ""}`} style={{ background: mainTab === "chat" ? "white" : "transparent", color: mainTab === "chat" ? "var(--accent)" : "var(--text-muted)" }} onClick={() => setMainTab("chat")}>Conversation</button>
                <button className={`px-3 py-1.5 rounded-md text-[10px] font-semibold`} style={{ color: "var(--text-muted)" }} onClick={() => setMainTab("history")}>History {artifacts.length > 0 && `(${artifacts.length})`}</button>
              </div>
              <div className="flex-1 min-h-0 card flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      {msg.role === "assistant" ? <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm" style={{ background: "var(--accent-light)", border: "1px solid var(--accent-border)" }}>{aiAgents.find(a => a.id === msg.agent)?.icon || ""}</div> : <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm" style={{ background: "var(--surface-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>R</div>}
                      <div className={`max-w-xl flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        {msg.role === "assistant" && msg.agent && i > 0 && <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{aiAgents.find(a => a.id === msg.agent)?.name} · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>}
                        {msg.role === "user" ? <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white" style={{ background: "var(--accent)" }}>{msg.text}</div> : <div className="space-y-2 w-full"><div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed" style={{ background: "var(--accent-light)", color: "var(--text-primary)", border: "1px solid var(--accent-border)" }}>{msg.text}</div>{msg.evidenceStatus && <EvidenceBadge status={msg.evidenceStatus} confidence={msg.confidence} />}{msg.sources && msg.sources.map((src, si) => <div key={si} className="flex items-start gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}><span style={{ color: "var(--accent)" }}></span>{src}</div>)}{msg.evidenceStatus === "insufficient_evidence" && <div className="text-[10px] rounded-lg p-2" style={{ background: "var(--warning-bg)", color: "var(--warning)", border: "1px solid var(--warning-border)" }}>Warning: Insufficient evidence in available NCPOR sources. Absence of records does not indicate absence of work.</div>}{msg.actions && <div className="flex flex-wrap gap-1.5">{msg.actions.map((a, ai) => <button key={ai} onClick={() => handleAction(a)} className="btn-outline btn-sm text-[10px]">{a}</button>)}</div>}{msg.relatedLinks && <div className="flex flex-wrap gap-1.5">{msg.relatedLinks.map((l, li) => <button key={li} onClick={() => onNavigate?.(l.dest)} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--accent-border)", color: "var(--accent)" }}>→ {l.label}</button>)}</div>}</div>}
                      </div>
                    </div>
                  ))}
                  {actionAnswer && <div className="mx-11 p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap" style={{ background: "var(--success-bg)", border: "1px solid var(--success-border)", color: "var(--success)" }}><div className="font-semibold mb-1 text-[10px] uppercase">Action Result · AI Generated · Not Official</div>{actionAnswer}</div>}
                </div>
                <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
                  {workspaceSources.length > 0 && <div className="text-[9px] mb-2 flex items-center gap-1.5" style={{ color: "var(--accent)" }}> Grounded in {workspaceSources.length} selected source(s): {workspaceSources.slice(0, 2).map(s => s.title.slice(0, 20)).join(", ")}{workspaceSources.length > 2 ? `…+${workspaceSources.length - 2}` : ""}</div>}
                  <div className="flex gap-2"><input className="search-input flex-1" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && input.trim() && ask(input)} placeholder="Ask about polar science..."/><button className="btn-primary px-4" onClick={() => input.trim() && ask(input)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div>
                  <div className="mt-2 flex flex-wrap gap-1.5">{EXAMPLE_QUESTIONS.slice(0, 4).map(q => <button key={q} onClick={() => ask(q)} className="text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "white" }}>{q}</button>)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <aside className="w-[250px] xl:w-[285px] flex-shrink-0 flex flex-col overflow-hidden bg-white">
        <div className="px-4 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Studio</div>
          <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>Create knowledge outputs</div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {STUDIO_TOOLS.map(tool => <button key={tool.id} onClick={() => workspaceSources.length > 0 && runTool(tool.id)} disabled={workspaceSources.length === 0} className="w-full card p-3 text-left transition-all" style={{ border: selectedTool === tool.id ? "1px solid var(--accent)" : "1px solid var(--border)", background: selectedTool === tool.id ? "var(--accent-light)" : "white", opacity: workspaceSources.length === 0 ? 0.55 : 1 }}><div className="flex items-start gap-3"><div className="text-lg flex-shrink-0">{tool.icon}</div><div className="min-w-0"><div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>{tool.label}</div><div className="text-[9px] mt-0.5 leading-snug" style={{ color: "var(--text-muted)" }}>{tool.desc}</div></div></div></button>)}
        </div>
        <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="rounded-lg p-2.5 text-[9px]" style={{ background: "var(--surface-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{workspaceSources.length > 0 ? `${workspaceSources.length} source(s) ready for generation.` : "Add sources to enable Studio tools."}</div>
        </div>
      </aside>

      {selectedTool && toolOutput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(15, 23, 42, 0.28)" }} onClick={() => setSelectedTool(null)}>
          <div className="w-full max-w-4xl max-h-[85vh] card flex flex-col overflow-hidden bg-white" onClick={e => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2"><span className="text-lg">{activeTool?.icon}</span><div><div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{activeTool?.label}</div><div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{workspaceSources.length} source(s) · AI Generated Draft</div></div></div>
              <div className="flex gap-1.5"><button className="btn-outline btn-sm text-[10px]" onClick={() => runTool(selectedTool)}>Regenerate</button><button className="btn-outline btn-sm text-[10px]">Save</button>{selectedTool === "report" && <button className="btn-outline btn-sm text-[10px]">Submit for Review</button>}<button className="btn-outline btn-sm text-[10px]" onClick={() => setSelectedTool(null)}>Close</button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{generating ? <div className="py-16 text-center"><div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"/><div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Generating {activeTool?.label}…</div><div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>Analyzing {workspaceSources.length} source(s)</div></div> : renderToolOutput()}<div className="mt-4 p-2 rounded text-[9px]" style={{ background: "var(--warning-bg)", border: "1px solid var(--warning-border)", color: "var(--warning)" }}>AI-generated content · Not an official NCPOR document · Requires review before publication</div></div>
          </div>
        </div>
      )}
    </div>
  );
}