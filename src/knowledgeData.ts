// Extended knowledge model — demo/seed data clearly separated from production
// All values are illustrative sample records, not verified NCPOR scientific data

export type EvidenceStatus = "source_backed" | "synthesis" | "insufficient_evidence" | "conflicting";

export interface Researcher {
  id: string;
  name: string;
  role: string;
  domain: string;
  expeditions: string[];
  publications: number;
}

export interface Finding {
  id: string;
  text: string;
  evidenceStatus: EvidenceStatus;
  sourceId: string;
  sourceTitle: string;
  relatedDatasets: string[];
  confidence: number; // 0–100
  year: number;
  domain: string;
}

export interface Project {
  id: string;
  title: string;
  domain: string;
  expeditionIds: number[];
  status: "active" | "completed" | "planned";
  pi: string;
  datasets: number;
  publications: number;
}

export interface KnowledgeGap {
  id: string;
  topic: string;
  signal: string;
  signals: string[];
  coverage: "low" | "medium" | "partial";
  temporalGap: string;
  spatialGap: string;
  sourceCount: number;
  relatedExpeditions: number[];
  opportunities: string[];
  severity: "high" | "medium" | "low";
}

export interface TrendItem {
  id: string;
  topic: string;
  domain: string;
  direction: "up" | "down" | "stable";
  researchActivity: number; // relative 0–100
  repositoryActivity: number;
  contentDemand: number;
  learningInterest: number;
  recentPublications: number;
  note: string;
}

export interface OpportunityCard {
  id: string;
  title: string;
  type: "research" | "education" | "outreach" | "content";
  score: number; // 0–100
  why: string;
  signals: string[];
  evidence: string[];
  relatedResearchers: string[];
  possibleAction: string;
  relatedGapId?: string;
}

export interface KnowledgePulseItem {
  id: string;
  topic: string;
  change: string;
  direction: "up" | "down";
  detail: string;
  timestamp: string;
  type: "research" | "dataset" | "education" | "connection" | "finding";
}

export interface IntelligenceFeedItem {
  id: string;
  type: "insight" | "gap" | "trend" | "action" | "connection" | "opportunity";
  title: string;
  detail: string;
  timestamp: string;
  source: string;
  confidence?: number;
  actionLabel?: string;
  actionTarget?: string;
}

export interface DatasetProvenance {
  datasetId: number;
  source: string;
  expedition: string;
  collectionContext: string;
  version: string;
  lastUpdated: string;
  rights: string;
  access: "open" | "restricted" | "embargo";
  variables: string[];
  temporalCoverage: string;
  spatialCoverage: string;
}

export interface PublicationFinding {
  publicationId: number;
  findings: Finding[];
  relatedDatasetIds: number[];
  expeditionId: number;
  versionHistory: { version: string; date: string; change: string }[];
}

// ── Researchers ───────────────────────────────────────────────
export const researchers: Researcher[] = [
  { id: "r1", name: "Dr. A. Sharma", role: "Glaciologist", domain: "Glaciology", expeditions: ["46th IAE", "45th IAE", "44th IAE"], publications: 42 },
  { id: "r2", name: "Dr. P. Verma", role: "Atmospheric Scientist", domain: "Atmospheric Science", expeditions: ["45th IAE", "43rd IAE"], publications: 31 },
  { id: "r3", name: "Dr. K. Mehta", role: "Marine Biologist", domain: "Polar Biology", expeditions: ["46th IAE", "44th IAE", "42nd IAE"], publications: 27 },
  { id: "r4", name: "Dr. S. Iyer", role: "Physical Oceanographer", domain: "Oceanography", expeditions: ["43rd IAE", "41st IAE", "Arctic 2023"], publications: 38 },
  { id: "r5", name: "Dr. M. Das", role: "Remote Sensing Specialist", domain: "Remote Sensing", expeditions: ["46th IAE", "45th IAE"], publications: 19 },
  { id: "r6", name: "Dr. D. Nair", role: "Glaciologist", domain: "Glaciology", expeditions: ["44th IAE", "43rd IAE", "42nd IAE"], publications: 24 },
  { id: "r7", name: "Dr. R. Gupta", role: "Climate Scientist", domain: "Climate Science", expeditions: ["46th IAE", "Arctic 2023"], publications: 33 },
  { id: "r8", name: "Dr. N. Pillai", role: "Geologist", domain: "Geology", expeditions: ["41st IAE", "40th IAE"], publications: 18 },
  { id: "r9", name: "Dr. J. Krishnamurthy", role: "Ecologist", domain: "Polar Ecology", expeditions: ["45th IAE", "43rd IAE"], publications: 22 },
  { id: "r10", name: "Dr. A. Patel", role: "Atmospheric Chemist", domain: "Atmospheric Chemistry", expeditions: ["46th IAE", "44th IAE"], publications: 16 },
  { id: "r11", name: "Dr. S. Rao", role: "Data Scientist", domain: "Data Science", expeditions: ["46th IAE"], publications: 9 },
  { id: "r12", name: "Dr. L. Bose", role: "Sea Ice Physicist", domain: "Cryosphere", expeditions: ["45th IAE", "46th IAE", "Arctic 2023"], publications: 29 },
];

// ── Projects ──────────────────────────────────────────────────
export const projects: Project[] = [
  { id: "p1", title: "Southern Ocean Carbon Sink Dynamics", domain: "Oceanography", expeditionIds: [1, 2, 3], status: "active", pi: "Dr. S. Iyer", datasets: 7, publications: 5 },
  { id: "p2", title: "Polar Vortex & Southern Hemisphere Climate", domain: "Climate Science", expeditionIds: [1, 2], status: "active", pi: "Dr. R. Gupta", datasets: 4, publications: 3 },
  { id: "p3", title: "Antarctic Microbiome & Biodiversity", domain: "Polar Biology", expeditionIds: [1, 3, 4], status: "active", pi: "Dr. K. Mehta", datasets: 5, publications: 4 },
  { id: "p4", title: "Dakshin Gangotri Glacier Mass Balance", domain: "Glaciology", expeditionIds: [3, 4, 5], status: "completed", pi: "Dr. D. Nair", datasets: 6, publications: 5 },
  { id: "p5", title: "Sea Ice Albedo & Climate Feedback", domain: "Cryosphere", expeditionIds: [1, 2, 7], status: "active", pi: "Dr. L. Bose", datasets: 3, publications: 2 },
  { id: "p6", title: "Atmospheric Aerosols over Antarctica", domain: "Atmospheric Science", expeditionIds: [2, 3], status: "completed", pi: "Dr. P. Verma", datasets: 4, publications: 6 },
  { id: "p7", title: "Remote Sensing of Antarctic Ice Sheet", domain: "Remote Sensing", expeditionIds: [1, 2], status: "active", pi: "Dr. M. Das", datasets: 5, publications: 3 },
  { id: "p8", title: "Polar Biodiversity & Ecosystem Services", domain: "Polar Ecology", expeditionIds: [2, 4], status: "active", pi: "Dr. J. Krishnamurthy", datasets: 3, publications: 2 },
];

// ── Findings ──────────────────────────────────────────────────
export const findings: Finding[] = [
  {
    id: "f1",
    text: "Southern Ocean sea ice extent reached a record minimum of 1.79 million km² in February 2023, 1.03 million km² below the 1981–2010 average.",
    evidenceStatus: "source_backed",
    sourceId: "pub1",
    sourceTitle: "Changing sea ice dynamics in the Southern Ocean (2024)",
    relatedDatasets: ["Antarctic Sea Ice Concentration (2023)"],
    confidence: 94,
    year: 2024,
    domain: "Cryosphere",
  },
  {
    id: "f2",
    text: "Atmospheric black carbon concentrations at Maitri station increased by 12% between 2018–2022, potentially attributable to Southern Hemisphere biomass burning.",
    evidenceStatus: "synthesis",
    sourceId: "pub2",
    sourceTitle: "Atmospheric composition over Antarctica (2023)",
    relatedDatasets: ["Atmospheric Measurements at Maitri (2022)"],
    confidence: 71,
    year: 2023,
    domain: "Atmospheric Science",
  },
  {
    id: "f3",
    text: "A previously undescribed microbial consortium capable of surviving below −20°C was isolated from Schirmacher Oasis soil during the 44th IAE.",
    evidenceStatus: "source_backed",
    sourceId: "pub3",
    sourceTitle: "Biodiversity assessment of Antarctic microbiome (2023)",
    relatedDatasets: [],
    confidence: 88,
    year: 2023,
    domain: "Polar Biology",
  },
  {
    id: "f4",
    text: "Indian Ocean Dipole events are positively correlated with short-term variability in Dakshin Gangotri glacier mass balance (r = 0.73, p < 0.01).",
    evidenceStatus: "source_backed",
    sourceId: "pub5",
    sourceTitle: "Glacial mass balance at Dakshin Gangotri (2022)",
    relatedDatasets: ["Glacier Mass Balance Data (2020)"],
    confidence: 82,
    year: 2022,
    domain: "Glaciology",
  },
  {
    id: "f5",
    text: "Southern Ocean absorbed an estimated 4.3 ± 0.8 Gt C/year over 2010–2020, representing approximately 40% of the global ocean carbon uptake.",
    evidenceStatus: "synthesis",
    sourceId: "pub4",
    sourceTitle: "Indian Arctic Ocean observations and future trends (2022)",
    relatedDatasets: ["Ocean Temperature Profiles – Southern Ocean (2021)"],
    confidence: 76,
    year: 2022,
    domain: "Oceanography",
  },
  {
    id: "f6",
    text: "Polar vortex disruption events show a statistically significant 3–5 day lag correlation with surface warming over the Indian subcontinent.",
    evidenceStatus: "synthesis",
    sourceId: "pub6",
    sourceTitle: "Polar vortex dynamics and Southern Hemisphere climate (2024)",
    relatedDatasets: ["Atmospheric Measurements at Maitri (2022)"],
    confidence: 68,
    year: 2024,
    domain: "Climate Science",
  },
];

// ── Knowledge Gaps ────────────────────────────────────────────
export const knowledgeGaps: KnowledgeGap[] = [
  {
    id: "g1",
    topic: "Deep Ocean Circulation – Prydz Bay",
    signal: "Low source count + temporal gap",
    signals: ["Only 2 datasets in repository covering Prydz Bay below 1000m", "Last measurement: 2019", "No associated publications post-2020"],
    coverage: "low",
    temporalGap: "2020–present (5-year gap)",
    spatialGap: "Prydz Bay, 60°S–70°S",
    sourceCount: 2,
    relatedExpeditions: [2, 3],
    opportunities: ["High-priority candidate for 47th IAE instrument deployment"],
    severity: "high",
  },
  {
    id: "g2",
    topic: "Antarctic Permafrost & Soil Carbon",
    signal: "Potential repository coverage gap",
    signals: ["3 publications found, none post-2021", "No dedicated dataset in portal", "Adjacent SCAR programs have active datasets not yet indexed"],
    coverage: "partial",
    temporalGap: "2021–present",
    spatialGap: "Schirmacher Oasis, Larsemann Hills",
    sourceCount: 3,
    relatedExpeditions: [1, 2],
    opportunities: ["Educational content opportunity", "Potential dataset ingestion from SCAR"],
    severity: "medium",
  },
  {
    id: "g3",
    topic: "Polar Stratospheric Cloud Dynamics",
    signal: "Incomplete metadata",
    signals: ["6 publications but no linked datasets", "Spatial coverage not recorded", "Author affiliations missing in 4 of 6 records"],
    coverage: "partial",
    temporalGap: "Metadata gap, not temporal",
    spatialGap: "Stratosphere above Antarctica",
    sourceCount: 6,
    relatedExpeditions: [3, 4],
    opportunities: ["Metadata enrichment opportunity", "Link existing publications to archived Maitri instrument data"],
    severity: "medium",
  },
  {
    id: "g4",
    topic: "Arctic Glacier Melt Rate (Svalbard)",
    signal: "Low educational coverage",
    signals: ["Only 1 educational resource covers Arctic glaciers", "High public interest signal (top search term)", "5 publications available but not surfaced in Education module"],
    coverage: "partial",
    temporalGap: "Educational content not updated since 2022",
    spatialGap: "Svalbard / Himadri station region",
    sourceCount: 5,
    relatedExpeditions: [7, 8],
    opportunities: ["Create student-friendly explainer from existing publications", "Add quiz module on Arctic glaciers"],
    severity: "low",
  },
  {
    id: "g5",
    topic: "Southern Ocean Microplastics",
    signal: "Emerging topic with no repository records",
    signals: ["0 datasets in portal", "0 publications with NCPOR authorship", "Growing international research interest (trend +38% YoY)", "Relevant expedition samples exist but not digitized"],
    coverage: "low",
    temporalGap: "All years — no baseline",
    spatialGap: "Southern Ocean, 40°S–60°S",
    sourceCount: 0,
    relatedExpeditions: [1],
    opportunities: ["High-value research opportunity", "Potential collaboration with IUCN / UNEP"],
    severity: "high",
  },
];

// ── Knowledge Trends ──────────────────────────────────────────
export const knowledgeTrends: TrendItem[] = [
  { id: "t1", topic: "Antarctic Sea Ice", domain: "Cryosphere", direction: "up", researchActivity: 88, repositoryActivity: 72, contentDemand: 91, learningInterest: 85, recentPublications: 12, note: "Record minimum 2023 drives global interest. Repository activity reflects 3 new datasets ingested this quarter." },
  { id: "t2", topic: "Southern Ocean Carbon", domain: "Oceanography", direction: "up", researchActivity: 74, repositoryActivity: 61, contentDemand: 66, learningInterest: 52, recentPublications: 7, note: "Growing focus on carbon sink efficiency. New ARGO float data being processed." },
  { id: "t3", topic: "Polar Biodiversity", domain: "Biology", direction: "up", researchActivity: 58, repositoryActivity: 44, contentDemand: 73, learningInterest: 80, recentPublications: 4, note: "High educational interest. COP-related media driving public awareness." },
  { id: "t4", topic: "Ice Sheet Dynamics", domain: "Glaciology", direction: "stable", researchActivity: 65, repositoryActivity: 55, contentDemand: 60, learningInterest: 58, recentPublications: 6, note: "Steady research output. GRACE-FO satellite data integration planned." },
  { id: "t5", topic: "Polar Atmospheric Chemistry", domain: "Atmospheric Science", direction: "down", researchActivity: 41, repositoryActivity: 38, contentDemand: 34, learningInterest: 29, recentPublications: 2, note: "Reduced expedition focus this cycle. Opportunity to surface archived data." },
];

// ── Research Opportunities ─────────────────────────────────────
export const opportunities: OpportunityCard[] = [
  {
    id: "o1",
    title: "Publish Deep Ocean Prydz Bay Dataset",
    type: "research",
    score: 87,
    why: "High-signal repository gap in a high-interest topic. Existing instrument data from 42nd IAE likely covers this period.",
    signals: ["5-year temporal gap", "No post-2019 records", "3 international groups recently published on same region"],
    evidence: ["Prydz Bay CTD records (42nd IAE, unprocessed)", "SCAR registry shows 4 related datasets from other nations"],
    relatedResearchers: ["Dr. S. Iyer", "Dr. R. Gupta"],
    possibleAction: "Retrieve 42nd IAE physical oceanography instrument logs and initiate dataset preparation",
    relatedGapId: "g1",
  },
  {
    id: "o2",
    title: "Student Explainer: Antarctic Sea Ice Record 2023",
    type: "education",
    score: 92,
    why: "Highest public and learner interest topic with strong existing source material. No student-level content exists in the portal.",
    signals: ["Top search query (Education module)", "91% content demand score", "2 source_backed publications available"],
    evidence: ["Changing sea ice dynamics (2024) — source_backed", "Sea Ice Concentration Dataset 2023"],
    relatedResearchers: ["Dr. L. Bose", "Dr. M. Das"],
    possibleAction: "Generate student explainer from 2024 publication, queue for educator review",
    relatedGapId: "g4",
  },
  {
    id: "o3",
    title: "Outreach Campaign: Southern Ocean Carbon Sink",
    type: "outreach",
    score: 78,
    why: "Strong synthesis evidence available, high global relevance, underrepresented in current outreach content.",
    signals: ["0 outreach articles in portal on this topic", "66% content demand", "COP-adjacent interest"],
    evidence: ["Southern Ocean Carbon Sink Dynamics project (active)", "5 related publications"],
    relatedResearchers: ["Dr. S. Iyer", "Dr. K. Mehta"],
    possibleAction: "Draft article + social post series from Project P1 publications",
    relatedGapId: undefined,
  },
  {
    id: "o4",
    title: "Microplastics Scoping Study — Southern Ocean",
    type: "research",
    score: 71,
    why: "Zero repository coverage on emerging high-interest topic. Sample material may exist from recent expeditions.",
    signals: ["0 NCPOR records", "International publications +38% YoY", "UNEP funding call open"],
    evidence: ["No current NCPOR evidence — potential repository gap, not evidence of absence"],
    relatedResearchers: ["Dr. J. Krishnamurthy", "Dr. K. Mehta"],
    possibleAction: "Conduct sample inventory from 44th–46th IAE; consult IUCN collaboration framework",
    relatedGapId: "g5",
  },
];

// ── Knowledge Pulse ───────────────────────────────────────────
export const knowledgePulse: KnowledgePulseItem[] = [
  { id: "kp1", topic: "Antarctic Sea Ice", change: "↑ research activity", direction: "up", detail: "3 new publications indexed this month", timestamp: "2 hours ago", type: "research" },
  { id: "kp2", topic: "Southern Ocean Carbon", change: "↑ new datasets", direction: "up", detail: "2 new NetCDF files added from 45th IAE processing", timestamp: "1 day ago", type: "dataset" },
  { id: "kp3", topic: "Polar Biodiversity", change: "↑ educational interest", direction: "up", detail: "Top searched topic in Education module this week", timestamp: "3 days ago", type: "education" },
  { id: "kp4", topic: "Prydz Bay Oceanography", change: "New finding connected", direction: "up", detail: "Finding F5 linked to Ocean Temperature dataset", timestamp: "5 days ago", type: "connection" },
  { id: "kp5", topic: "Polar Stratospheric Clouds", change: "Metadata gap detected", direction: "down", detail: "6 publications lack spatial coverage metadata", timestamp: "1 week ago", type: "finding" },
];

// ── Intelligence Feed ─────────────────────────────────────────
export const intelligenceFeed: IntelligenceFeedItem[] = [
  { id: "if1", type: "insight", title: "Sea ice 2023 record now repository-connected", detail: "Finding F1 linked to Dataset D1 and Publication P1 — full provenance chain established.", timestamp: "2h ago", source: "Knowledge Engine", confidence: 94, actionLabel: "View Finding", actionTarget: "publications" },
  { id: "if2", type: "gap", title: "Potential gap: Deep Ocean Prydz Bay", detail: "5-year temporal gap detected with only 2 source records.", timestamp: "1d ago", source: "Gap Detector", confidence: 85, actionLabel: "Inspect Gap", actionTarget: "dashboard" },
  { id: "if3", type: "trend", title: "Antarctic Sea Ice trending ↑ globally", detail: "Research activity score: 88/100. 12 new papers this month.", timestamp: "2d ago", source: "Trend Monitor", actionLabel: "View Trend", actionTarget: "dashboard" },
  { id: "if4", type: "opportunity", title: "Student explainer opportunity identified", detail: "High learner interest + source_backed evidence available on sea ice.", timestamp: "3d ago", source: "Opportunity Engine", confidence: 92, actionLabel: "View Opportunity", actionTarget: "education" },
  { id: "if5", type: "connection", title: "46th IAE connected to 3 new findings", detail: "Automated indexing connected expedition 46 to findings F1, F2, F6.", timestamp: "5d ago", source: "Knowledge Indexer", confidence: 78, actionLabel: "Explore", actionTarget: "expeditions" },
];

// ── Per-expedition Research DNA ───────────────────────────────
export const expeditionDNA: Record<number, {
  researchers: number; projects: number; datasets: number;
  publications: number; findings: number; media: number; educational: number;
  researcherList: string[]; projectList: string[];
}> = {
  1: { researchers: 12, projects: 5, datasets: 21, publications: 14, findings: 37, media: 126, educational: 8, researcherList: ["r1","r3","r5","r7","r10","r11","r12"], projectList: ["p1","p2","p3","p5","p7"] },
  2: { researchers: 10, projects: 4, datasets: 18, publications: 11, findings: 29, media: 98, educational: 6, researcherList: ["r1","r2","r4","r6","r8","r9","r12"], projectList: ["p2","p3","p6","p8"] },
  3: { researchers: 9, projects: 3, datasets: 15, publications: 9, findings: 22, media: 87, educational: 5, researcherList: ["r1","r3","r4","r6","r10"], projectList: ["p1","p4","p6"] },
  4: { researchers: 8, projects: 3, datasets: 12, publications: 8, findings: 18, media: 74, educational: 4, researcherList: ["r3","r6","r8","r9"], projectList: ["p3","p4","p8"] },
};

// ── Dataset provenance ────────────────────────────────────────
export const datasetProvenance: Record<number, DatasetProvenance> = {
  1: { datasetId: 1, source: "MODIS/Aqua Level-3 + NCPOR processing", expedition: "46th IAE (2024)", collectionContext: "Passive microwave satellite + in-situ validation at Maitri", version: "v2.1", lastUpdated: "Mar 2024", rights: "CC BY 4.0", access: "open", variables: ["Sea Ice Concentration (%)", "Ice Extent (km²)", "Ice Age (1st-yr/multi-yr)", "Snow Depth"], temporalCoverage: "Jan–Mar 2023", spatialCoverage: "60°S–90°S, 0°–360°E" },
  2: { datasetId: 2, source: "Maitri Station Instruments", expedition: "45th IAE (2023)", collectionContext: "Continuous monitoring at Maitri SYNOP station", version: "v1.4", lastUpdated: "Jun 2023", rights: "CC BY 4.0", access: "open", variables: ["Black Carbon (ng/m³)", "Ozone (ppb)", "Temperature (°C)", "Wind Speed (m/s)"], temporalCoverage: "Nov 2022 – Mar 2023", spatialCoverage: "70°46′S, 11°44′E (Maitri)" },
  3: { datasetId: 3, source: "Argo Floats + NCPOR CTD casts", expedition: "43rd IAE (2021)", collectionContext: "In-situ profiles during transit and at Maitri/Bharati", version: "v1.0", lastUpdated: "Dec 2021", rights: "CC BY-NC 4.0", access: "open", variables: ["Temperature (°C)", "Salinity (PSU)", "Dissolved Oxygen (µmol/kg)", "Depth (m)"], temporalCoverage: "Nov 2021 – Mar 2022", spatialCoverage: "40°S–70°S, 30°E–80°E" },
};

// ── Publication version history ───────────────────────────────
export const publicationHistory: Record<number, { version: string; date: string; change: string }[]> = {
  1: [
    { version: "v1.0", date: "Jan 2024", change: "Initial submission" },
    { version: "v1.1", date: "Feb 2024", change: "Updated sea ice area figure after reviewer query; confidence interval corrected" },
    { version: "v2.0", date: "Mar 2024", change: "Added 2023 record minimum data. Finding F1 updated." },
  ],
  2: [
    { version: "v1.0", date: "Aug 2023", change: "Initial publication" },
    { version: "v1.1", date: "Oct 2023", change: "Supplemental data table corrected; no change to core findings" },
  ],
};

// ── Agent definitions ─────────────────────────────────────────
export const aiAgents = [
  { id: "research", name: "Research Agent", icon: "", purpose: "Answers questions grounded in NCPOR publications and expedition reports", sourceScope: "Publications, Expedition Reports, Findings", toolScope: "Search, Summarize, Compare, Cite", limitations: "Limited to indexed NCPOR sources; does not access external databases in real-time", version: "v1.2", evidenceBehavior: "Always cites source ID and passage; flags insufficient evidence" },
  { id: "dataset", name: "Dataset Agent", icon: "", purpose: "Helps discover, interpret and compare scientific datasets", sourceScope: "NCPOR Dataset Catalogue, Provenance Records", toolScope: "Search, Filter, Compare, Visualize Summary", limitations: "Cannot access raw data files directly; works with metadata and summaries", version: "v1.1", evidenceBehavior: "Shows dataset provenance and access level; flags if data is restricted" },
  { id: "education", name: "Education Agent", icon: "", purpose: "Creates simplified, source-grounded educational explanations", sourceScope: "Approved publications, Educational resources", toolScope: "Simplify, Explain, Quiz, Recommend", limitations: "Simplifications are clearly labelled; scientific facts are not altered", version: "v1.0", evidenceBehavior: "Shows underlying source for every educational claim" },
  { id: "media", name: "Media Agent", icon: "", purpose: "Helps contextualize and describe media assets from expeditions", sourceScope: "Media catalogue, Expedition records, Station data", toolScope: "Tag, Caption, Link, Contextualize", limitations: "AI suggestions are marked as suggestions; human review required", version: "v0.9", evidenceBehavior: "All captions/tags shown as AI suggestions, not official metadata" },
  { id: "outreach", name: "Outreach Agent", icon: "", purpose: "Drafts outreach content (articles, social posts, scripts) from approved sources", sourceScope: "Approved publications, Expedition reports, Press releases", toolScope: "Draft, Reframe, Target Audience, Channel", limitations: "Generated content must enter review workflow; not auto-published", version: "v1.0", evidenceBehavior: "Retains source IDs in generated content; marks as DRAFT/AI Generated" },
  { id: "curator", name: "Knowledge Curator", icon: "", purpose: "Identifies metadata gaps, disconnected entities and enrichment opportunities", sourceScope: "Full knowledge graph", toolScope: "Audit, Tag, Connect, Suggest", limitations: "Suggestions require human approval; does not auto-modify records", version: "v0.8", evidenceBehavior: "All suggestions shown with confidence score and reasoning" },
  { id: "explorer", name: "Explorer Agent", icon: "", purpose: "Guides discovery of connected knowledge across expeditions, topics and regions", sourceScope: "Full knowledge graph, Spatial records", toolScope: "Discover, Navigate, Summarize, Recommend", limitations: "Discovery is based on repository contents; gaps may exist", version: "v1.0", evidenceBehavior: "Shows relationship type (verified / AI-suggested) for all connections" },
];

// ── Learning content ──────────────────────────────────────────
export const learningModules = [
  { id: "lm1", title: "What is Sea Ice?", topic: "Sea Ice", level: "beginner", duration: "8 min", sourceIds: ["pub1"], xp: 100, questions: 5 },
  { id: "lm2", title: "Why Does Sea Ice Matter for Climate?", topic: "Sea Ice", level: "intermediate", duration: "12 min", sourceIds: ["pub1", "pub6"], xp: 150, questions: 7 },
  { id: "lm3", title: "Ocean Circulation Explained", topic: "Oceanography", level: "beginner", duration: "10 min", sourceIds: ["pub4"], xp: 120, questions: 6 },
  { id: "lm4", title: "Glaciers as Climate Records", topic: "Glaciology", level: "intermediate", duration: "15 min", sourceIds: ["pub5"], xp: 180, questions: 8 },
  { id: "lm5", title: "Antarctic Biodiversity", topic: "Biology", level: "beginner", duration: "8 min", sourceIds: ["pub3"], xp: 100, questions: 5 },
  { id: "lm6", title: "Polar Atmosphere & Ozone", topic: "Atmospheric Science", level: "advanced", duration: "18 min", sourceIds: ["pub2"], xp: 220, questions: 10 },
];

export const quizQuestions: Record<string, { q: string; options: string[]; correct: number; explanation: string }[]> = {
  lm1: [
    { q: "What is sea ice made of?", options: ["Frozen freshwater", "Frozen ocean water", "Compressed snow", "Glacial ice"], correct: 1, explanation: "Sea ice forms when ocean water freezes, unlike glaciers which form from accumulated snow." },
    { q: "Sea ice in the Southern Ocean reaches its minimum extent in which month (Southern Hemisphere)?", options: ["July", "December", "February", "October"], correct: 2, explanation: "February is midsummer in the Southern Hemisphere, when sea ice is at its annual minimum." },
    { q: "What property of sea ice makes it important for Earth's energy balance?", options: ["High density", "High albedo (reflectivity)", "High salinity", "High carbon content"], correct: 1, explanation: "Sea ice reflects 80–90% of incoming solar radiation, reducing ocean heat absorption." },
  ],
  lm3: [
    { q: "What drives the global thermohaline circulation?", options: ["Wind alone", "Temperature and salinity differences", "Tidal forces", "Earth's rotation"], correct: 1, explanation: "Dense, cold, salty water sinks in polar regions, driving the global conveyor belt." },
    { q: "The Southern Ocean plays what role in the global carbon cycle?", options: ["Carbon source", "Carbon sink", "Carbon neutral", "Carbon buffer only"], correct: 1, explanation: "The Southern Ocean absorbs approximately 40% of global ocean carbon uptake." },
  ],
};
