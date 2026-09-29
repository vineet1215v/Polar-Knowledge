import { useState, useMemo, useRef, useEffect } from "react";
import type { WorkspaceSource } from "../workspaceStore";
import InteractiveStudioViewer, { StudioTool } from "../components/studio/InteractiveStudioViewer";

interface Props {
  onNavigate?: (p: string) => void;
  workspaceSources?: WorkspaceSource[];
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}

export interface NotebookSource {
  id: string;
  title: string;
  type: "publication" | "dataset" | "expedition" | "text" | "pdf";
  citationNumber: number;
  authorOrOrigin: string;
  yearOrDate: string;
  wordCount: number;
  snippet: string;
  fullContent: string;
  selected: boolean;
  doiOrRef?: string;
}

export interface NotebookCitation {
  num: number;
  sourceId: string;
  sourceTitle: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations?: NotebookCitation[];
  timestamp: string;
  savedToNotes?: boolean;
}

export interface UserNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  sourceTag?: string;
}

const INITIAL_NOTEBOOK_SOURCES: NotebookSource[] = [
  {
    id: "src-1",
    citationNumber: 1,
    title: "Changing Sea Ice Dynamics in the Southern Ocean (2024)",
    type: "publication",
    authorOrOrigin: "Journal of Glaciology · Dr. M. Ravichandran et al.",
    yearOrDate: "2024",
    wordCount: 14200,
    doiOrRef: "DOI: 10.1017/jog.2024.001",
    snippet:
      "Satellite microwave radiometry confirms that in February 2023, Antarctic sea ice extent plummeted to 1.79 million km², establishing an unprecedented 44-year satellite-era minimum. The retreat was particularly pronounced in the Bellingshausen, Amundsen, and Weddell Sea sectors.",
    fullContent:
      "TITLE: Changing Sea Ice Dynamics in the Southern Ocean (Journal of Glaciology, 2024)\nAUTHORS: Dr. M. Ravichandran, Dr. Thamban Meloth, NCPOR Glaciology Group\n\nABSTRACT & KEY FINDINGS:\n1. Satellite-derived sea ice concentration records (1979–2024) demonstrate a rapid transition from a modest positive expansion trend (+1.5% per decade up to 2015) to consecutive record-low minimums in 2022 and 2023.\n2. The February 2023 minimum reached 1.79 million km² (1.03 million km² below the 1981–2010 mean).\n3. Ice-Albedo Feedback: Open sea surface absorbs 93% of incident solar radiation, whereas snow-covered pack ice reflects 85%. This has triggered ocean mixed-layer heat anomalies of +1.8°C across the upper 100m.\n4. Teleconnections to Indian Monsoon: Lag-correlation analysis indicates that suppressed Weddell Sea ice leads to a weakened Mascarene High and delayed onset of the Indian Summer Monsoon by 4 to 9 days.\n5. Antarctic Bottom Water (AABW) production in the Weddell and Ross gyres has declined by approximately 18% over the past decade due to freshening from meltwater.",
    selected: true,
  },
  {
    id: "src-2",
    citationNumber: 2,
    title: "Maitri & Bharati Stations Long-Term Environmental Telemetry",
    type: "dataset",
    authorOrOrigin: "National Polar Data Center (NPDC) · NCPOR Goa",
    yearOrDate: "2023–2024",
    wordCount: 18500,
    doiOrRef: "NPDC-DS-2024-IAE46-092",
    snippet:
      "High-frequency AWS SYNOP logging and Brewer spectrophotometer observations at Maitri (70°46′S, 11°44′E) and Bharati (69°24′S, 76°11′E). Documents sub-zero boundary layer meteorological extremes and total column ozone recovery cycles.",
    fullContent:
      "TITLE: Long-Term Environmental Telemetry of India's Antarctic Observatories (2024)\nDATASET ID: NPDC-DS-2024-IAE46-092\nCOVERAGE: Continuous automated recordings at Maitri (1989–2024) and Bharati (2012–2024)\n\nKEY OBSERVATIONS:\n1. Maitri Station (Schirmacher Oasis): Mean annual temperature is -9.8°C; absolute minimum recorded is -38.4°C (July polar night). Barometric pressure averages 986.2 hPa. Wind velocities exceed 45 m/s (blizzard conditions) on average 28 days per year.\n2. Priyadarshini Lake: Permanent freshwater ice cover averages 1.85m. Microbial mat genomics reveal diverse psychrophilic cyanobacteria and tardigrade micro-biota.\n3. Bharati Station (Larsemann Hills): Positioned at 69°24′S, 76°11′E, facing Prydz Bay. Serves as dual oceanographic laboratory and satellite telemetry ground terminal with ISRO X/S-band radomes tracking Cartosat and Oceansat.\n4. Atmospheric Ozone Column: Brewer spectrophotometer records confirm spring ozone column depths dropping to 110–135 Dobson Units (DU) during September-October, with signs of gradual healing post-2019.",
    selected: true,
  },
  {
    id: "src-3",
    citationNumber: 3,
    title: "46th Indian Antarctic Expedition (IAE-46) Operational Dossier",
    type: "expedition",
    authorOrOrigin: "Ministry of Earth Sciences, Govt of India",
    yearOrDate: "2024",
    wordCount: 9400,
    doiOrRef: "MoES/NCPOR/IAE-46/OPS",
    snippet:
      "Field science mission report covering 44 ongoing projects across glaciology, space weather, oceanography, and biology. Features deep ice-core drilling at Dronning Maud Land and CTD profiling in Prydz Bay.",
    fullContent:
      "TITLE: 46th Indian Antarctic Expedition (IAE-46) Science Report\nLEADERSHIP: National Centre for Polar and Ocean Research (NCPOR)\nPARTICIPANTS: 58 scientists from 14 national research institutes (NCPOR, IMD, WIHG, CMFRI, NHO, ISRO)\n\nKEY SCIENTIFIC MISSIONS:\n1. Deep Ice Core Drilling: Retrieved 120m ice core from Princess Astrid Coast to reconstruct Holocene climate and volcanic aerosol deposition.\n2. Prydz Bay Marine Biology: Plankton net tows and CTD rosettes down to 1,200m depth mapping Euphausia superba swarms and Dissostichus mawsoni (toothfish) population density.\n3. Geomagnetic Pulsation Array: Coordinated fluxgate magnetometer observations linking solar wind perturbations to high-latitude auroral electrojet currents.\n4. Logistics & Sustainability: Upgraded Maitri's waste bio-digesters and commissioned new containerized solar-wind hybrid microgrid reducing diesel reliance by 22%.",
    selected: true,
  },
  {
    id: "src-4",
    citationNumber: 4,
    title: "IndARC Mooring & Kongsfjorden Arctic Climate Telemetry",
    type: "publication",
    authorOrOrigin: "Polar Research · Indian Arctic Program",
    yearOrDate: "2023",
    wordCount: 11800,
    doiOrRef: "DOI: 10.33265/polar.v42.8912",
    snippet:
      "IndARC, India's multi-sensor underwater observatory moored at 192m depth in Kongsfjorden, Svalbard (78°55′N), provides unbroken year-round observations of Atlantic water intrusion into the Arctic fjord.",
    fullContent:
      "TITLE: Physical Oceanography of Kongsfjorden During Polar Night (Polar Research, 2023)\nSTATION: Himadri Station, Ny-Ålesund, Spitsbergen, Svalbard\n\nKEY FINDINGS:\n1. IndARC Mooring: Deployed at 192m depth in Kongsfjorden since 2014. Records continuous temperature, salinity, currents, and acoustic ambient noise.\n2. Atlantification: Demonstrates seasonal intrusion of warm, saline West Spitsbergen Current (Atlantic Water) during late autumn, delaying fjord surface freezing.\n3. Arctic Amplification: Surface temperatures in Svalbard have warmed at 3.5 times the global rate over the last 30 years.\n4. Teleconnection: Highlights thermodynamic links between high-latitude Arctic freshening and mid-latitude jet stream waviness.",
    selected: true,
  },
];

export interface RepoSourceItem {
  id: string;
  title: string;
  repository: string;
  category: "Publications" | "Datasets" | "Expeditions" | "eDNA" | "Otoliths";
  type: "publication" | "dataset" | "expedition" | "text" | "pdf";
  authorOrOrigin: string;
  yearOrDate: string;
  wordCount: number;
  doiOrRef: string;
  snippet: string;
  fullContent: string;
}

const REPO_OPTIONS = [
  "NCPOR",
  "IndARC",
  "MoES",
  "IMD",
  "BAS",
  "USAP",
  "All Repositories",
];

const CATEGORY_OPTIONS = [
  "All",
  "Publications",
  "Datasets",
  "Expeditions",
  "eDNA",
  "Otoliths",
];

const ALL_REPOSITORY_SOURCES: RepoSourceItem[] = [
  {
    id: "repo-1",
    title: "Changing Sea Ice Dynamics in the Southern Ocean (2024)",
    repository: "NCPOR",
    category: "Publications",
    type: "publication",
    authorOrOrigin: "Journal of Glaciology · Dr. M. Ravichandran et al.",
    yearOrDate: "2024",
    wordCount: 14200,
    doiOrRef: "DOI: 10.1017/jog.2024.001",
    snippet:
      "Satellite microwave radiometry confirms that in February 2023, Antarctic sea ice extent plummeted to 1.79 million km², establishing an unprecedented 44-year satellite-era minimum.",
    fullContent:
      "TITLE: Changing Sea Ice Dynamics in the Southern Ocean (Journal of Glaciology, 2024)\nAUTHORS: Dr. M. Ravichandran, Dr. Thamban Meloth, NCPOR Glaciology Group\n\nABSTRACT & KEY FINDINGS:\n1. Satellite-derived sea ice concentration records (1979–2024) demonstrate a rapid transition from a modest positive expansion trend (+1.5% per decade up to 2015) to consecutive record-low minimums in 2022 and 2023.\n2. The February 2023 minimum reached 1.79 million km² (1.03 million km² below the 1981–2010 mean).\n3. Ice-Albedo Feedback: Open sea surface absorbs 93% of incident solar radiation, whereas snow-covered pack ice reflects 85%. This has triggered ocean mixed-layer heat anomalies of +1.8°C across the upper 100m.\n4. Teleconnections to Indian Monsoon: Lag-correlation analysis indicates that suppressed Weddell Sea ice leads to a weakened Mascarene High and delayed onset of the Indian Summer Monsoon by 4 to 9 days.\n5. Antarctic Bottom Water (AABW) production in the Weddell and Ross gyres has declined by approximately 18% over the past decade due to freshening from meltwater.",
  },
  {
    id: "repo-2",
    title: "Maitri & Bharati Stations Long-Term Environmental Telemetry",
    repository: "NCPOR",
    category: "Datasets",
    type: "dataset",
    authorOrOrigin: "National Polar Data Center (NPDC) · NCPOR Goa",
    yearOrDate: "2023–2024",
    wordCount: 18500,
    doiOrRef: "NPDC-DS-2024-IAE46-092",
    snippet:
      "High-frequency AWS SYNOP logging and Brewer spectrophotometer observations at Maitri (70°46′S, 11°44′E) and Bharati (69°24′S, 76°11′E). Documents sub-zero boundary layer meteorology and ozone recovery cycles.",
    fullContent:
      "TITLE: Long-Term Environmental Telemetry of India's Antarctic Observatories (2024)\nDATASET ID: NPDC-DS-2024-IAE46-092\nCOVERAGE: Continuous automated recordings at Maitri (1989–2024) and Bharati (2012–2024)\n\nKEY OBSERVATIONS:\n1. Maitri Station (Schirmacher Oasis): Mean annual temperature is -9.8°C; absolute minimum recorded is -38.4°C. Wind velocities exceed 45 m/s (blizzard conditions) on average 28 days per year.\n2. Priyadarshini Lake: Permanent freshwater ice cover averages 1.85m. Microbial mat genomics reveal diverse psychrophilic cyanobacteria and tardigrade micro-biota.\n3. Bharati Station (Larsemann Hills): Positioned at 69°24′S, 76°11′E, facing Prydz Bay. Serves as dual oceanographic laboratory and satellite telemetry ground terminal with ISRO X/S-band radomes tracking Cartosat and Oceansat.\n4. Atmospheric Ozone Column: Brewer spectrophotometer records confirm spring ozone column depths dropping to 110–135 Dobson Units (DU) during September-October.",
  },
  {
    id: "repo-3",
    title: "46th Indian Antarctic Expedition (IAE-46) Operational Dossier",
    repository: "MoES",
    category: "Expeditions",
    type: "expedition",
    authorOrOrigin: "Ministry of Earth Sciences, Govt of India",
    yearOrDate: "2024",
    wordCount: 9400,
    doiOrRef: "MoES/NCPOR/IAE-46/OPS",
    snippet:
      "Field science mission report covering 44 ongoing projects across glaciology, space weather, oceanography, and biology. Features deep ice-core drilling at Dronning Maud Land and CTD profiling in Prydz Bay.",
    fullContent:
      "TITLE: 46th Indian Antarctic Expedition (IAE-46) Science Report\nLEADERSHIP: National Centre for Polar and Ocean Research (NCPOR)\nPARTICIPANTS: 58 scientists from 14 national research institutes (NCPOR, IMD, WIHG, CMFRI, NHO, ISRO)\n\nKEY SCIENTIFIC MISSIONS:\n1. Deep Ice Core Drilling: Retrieved 120m ice core from Princess Astrid Coast to reconstruct Holocene climate and volcanic aerosol deposition.\n2. Prydz Bay Marine Biology: Plankton net tows and CTD rosettes down to 1,200m depth mapping Euphausia superba swarms and Dissostichus mawsoni (toothfish) population density.\n3. Geomagnetic Pulsation Array: Coordinated fluxgate magnetometer observations linking solar wind perturbations to high-latitude auroral electrojet currents.\n4. Logistics & Sustainability: Upgraded Maitri's waste bio-digesters and commissioned new containerized solar-wind hybrid microgrid reducing diesel reliance by 22%.",
  },
  {
    id: "repo-4",
    title: "IndARC Mooring & Kongsfjorden Arctic Climate Telemetry",
    repository: "IndARC",
    category: "Publications",
    type: "publication",
    authorOrOrigin: "Polar Research · Indian Arctic Program",
    yearOrDate: "2023",
    wordCount: 11800,
    doiOrRef: "DOI: 10.33265/polar.v42.8912",
    snippet:
      "IndARC, India's multi-sensor underwater observatory moored at 192m depth in Kongsfjorden, Svalbard (78°55′N), provides unbroken year-round observations of Atlantic water intrusion into the Arctic fjord.",
    fullContent:
      "TITLE: Physical Oceanography of Kongsfjorden During Polar Night (Polar Research, 2023)\nSTATION: Himadri Station, Ny-Ålesund, Spitsbergen, Svalbard\n\nKEY FINDINGS:\n1. IndARC Mooring: Deployed at 192m depth in Kongsfjorden since 2014. Records continuous temperature, salinity, currents, and acoustic ambient noise.\n2. Atlantification: Demonstrates seasonal intrusion of warm, saline West Spitsbergen Current (Atlantic Water) during late autumn, delaying fjord surface freezing.\n3. Arctic Amplification: Surface temperatures in Svalbard have warmed at 3.5 times the global rate over the last 30 years.\n4. Teleconnection: Highlights thermodynamic links between high-latitude Arctic freshening and mid-latitude jet stream waviness.",
  },
  {
    id: "repo-5",
    title: "Kongsfjorden Atlantic Inflow & IndARC CTD Moorings (2024)",
    repository: "IndARC",
    category: "Datasets",
    type: "dataset",
    authorOrOrigin: "Indian Arctic Research Programme · Himadri Station",
    yearOrDate: "2024",
    wordCount: 16400,
    doiOrRef: "INDARC-CTD-2024-SVALBARD",
    snippet:
      "High-resolution time series of temperature, salinity, turbidity, dissolved oxygen, and acoustic current profiler vectors from the 192-meter subsea mooring in Kongsfjorden.",
    fullContent:
      "TITLE: Kongsfjorden Atlantic Inflow Mooring Data Series (2024)\nDATASET IDENTIFIER: INDARC-CTD-2024-SVALBARD\nCOORDINATES: 78°55.2′ N, 11°56.4′ E | DEPTH: 192 m\n\nOVERVIEW:\nContinuous CTD profiling by the IndARC array confirms a 1.2°C temperature elevation in the intermediate winter water column compared to the 2014–2020 baseline.\n1. West Spitsbergen Current pulses peaked during late November, coinciding with open-water leads in the outer fjord.\n2. Salinity anomalies (+0.18 PSU) indicate heightened saline Atlantic water mass transport toward the inner fjord glaciers (Kongbreen and Kronebreen).\n3. Acoustic Doppler current velocities measured periodic subsurface eddies reaching 0.38 m/s along the southern fjord boundary.",
  },
  {
    id: "repo-6",
    title: "Larsemann Hills Limnology & Antarctic Microbial Mat eDNA Survey",
    repository: "NCPOR",
    category: "eDNA",
    type: "dataset",
    authorOrOrigin: "NCPOR Polar Biology Division · Bharati Station",
    yearOrDate: "2023",
    wordCount: 12800,
    doiOrRef: "NCPOR-BIO-eDNA-LH-044",
    snippet:
      "High-throughput Illumina metagenomic sequencing of 16S and 18S rDNA from 14 proglacial freshwater lakes surrounding Bharati Station, characterizing psychrotolerant microbiomes.",
    fullContent:
      "TITLE: Microbial Biodiversity and eDNA Profiling across Larsemann Hills Lakes\nPROJECT: NCPOR Polar Genomics & Limnological Survey\nLOCALITY: Larsemann Hills, Princess Elizabeth Land (Bharati Station hinterland)\n\nGENOMIC HIGHLIGHTS:\n1. Identified 420 Operational Taxonomic Units (OTUs) spanning Cyanobacteria (Phormidium, Nostoc), Chlorophyta, and Tardigrada.\n2. Detected unique cold-adapted antifreeze protein gene cassettes in cyanobacterial mats that maintain cellular integrity down to -32°C.\n3. Water column eDNA markers indicate micro-crustacean persistence under seasonal 2.2m ice caps, showing strong bio-indicator potential for tracking regional deglaciation rates.",
  },
  {
    id: "repo-7",
    title: "Dissostichus mawsoni (Antarctic Toothfish) Otolith Sagitta Annuli Catalog",
    repository: "NCPOR",
    category: "Otoliths",
    type: "publication",
    authorOrOrigin: "CCAMLR & NCPOR Marine Living Resources",
    yearOrDate: "2023",
    wordCount: 11200,
    doiOrRef: "NCPOR-OTOLITH-DM-2023-V1",
    snippet:
      "Precision sagittal otolith micrographs, annual growth increments, and micro-chemical LA-ICP-MS strontium/calcium ratios for Antarctic toothfish specimens from the Ross Sea and Indian Ocean sector.",
    fullContent:
      "TITLE: Sagittal Otolith Morphometry and Age Determination of Dissostichus mawsoni\nINSTITUTION: National Centre for Polar and Ocean Research (NCPOR)\nSPECIMENS: 184 sagittal otolith pairs collected during the 43rd and 44th IAE longline surveys.\n\nRESEARCH SUMMARY:\n1. Annuli validation demonstrates that alternating translucent (fast summer growth) and opaque (slow winter starvation) bands yield accurate age calibrations up to 34 years.\n2. Strontium/Calcium (Sr/Ca) microchemical transects across otolith nuclei trace larval drift from bathypelagic spawning ridges into coastal continental shelf nurseries.\n3. Morphometric indices (otolith length-to-width ratio, circularity, and rectangularity) provide species-specific diagnostics separating D. mawsoni from sub-Antarctic D. eleginoides.",
  },
  {
    id: "repo-8",
    title: "Trematomus bernacchii Otolith Microstructure & Age Determination",
    repository: "NCPOR",
    category: "Otoliths",
    type: "dataset",
    authorOrOrigin: "NCPOR Polar Living Resources Division",
    yearOrDate: "2024",
    wordCount: 8900,
    doiOrRef: "NCPOR-OTOLITH-TB-2024-08",
    snippet:
      "Reference catalog of emerald rockcod (Trematomus bernacchii) sagittal and asteriscus otoliths collected near Prydz Bay, documenting daily micro-increments in juvenile specimens.",
    fullContent:
      "TITLE: High-Resolution Otolith Archives of Emerald Rockcod (Trematomus bernacchii)\nGEOGRAPHIC ZONE: Prydz Bay, East Antarctica (Station Bharati)\n\nKEY DATA:\n1. Translucent winter growth rings correlate with sea ice platelet formation under the fast ice.\n2. Otolith daily increment widths decline by 64% during the polar night (May to August).\n3. Trace elemental mapping reveals barium depletion during the spring sea ice algal bloom, reflecting intense biogenic consumption in surface waters.",
  },
  {
    id: "repo-9",
    title: "Atmospheric Aerosol & Black Carbon Profiles at Himadri (2022–2024)",
    repository: "NCPOR",
    category: "Publications",
    type: "publication",
    authorOrOrigin: "Atmospheric Science Group · MoES / NCPOR",
    yearOrDate: "2024",
    wordCount: 15100,
    doiOrRef: "DOI: 10.1016/j.atmosenv.2024.119854",
    snippet:
      "Aerosol optical depth, equivalent black carbon (eBC) mass concentrations, and snow albedo reduction over the Ny-Ålesund glacier basin measured via 7-wavelength aethalometer.",
    fullContent:
      "TITLE: Long-Range Transport of Carbonaceous Aerosols into the High Arctic (Atmospheric Environment, 2024)\nOBSERVATION POST: Gruvebadet Atmospheric Laboratory & Himadri Station, Svalbard\n\nCORE FINDINGS:\n1. Springtime Arctic Haze events produced eBC peak concentrations exceeding 180 ng/m³, primarily originating from Eurasian biomass burning and industrial emissions.\n2. Radiative transfer modeling indicates local snow albedo decreases of 1.4% to 2.8%, accelerating seasonal snowpack ablation by 6 to 11 days.\n3. Simultaneous IndARC meteorological mast logs verify that northward-migrating low-pressure cyclones serve as primary atmospheric conduits transporting mid-latitude pollution plumes.",
  },
  {
    id: "repo-10",
    title: "Weddell Sea AABW Export and Deep Boundary Currents (2024)",
    repository: "BAS",
    category: "Datasets",
    type: "dataset",
    authorOrOrigin: "British Antarctic Survey & NCPOR Collaborative Exchange",
    yearOrDate: "2024",
    wordCount: 20300,
    doiOrRef: "BAS-NCPOR-AABW-EXP-2024",
    snippet:
      "Deep-sea acoustic Doppler current profiler (ADCP) arrays tracing the northward flow of dense Antarctic Bottom Water (AABW) spilling through the Weddell-Scotia Confluence.",
    fullContent:
      "TITLE: Circulation Dynamics of Antarctic Bottom Water Export in the Weddell Sea\nCOLLABORATION: BAS & NCPOR Polar Oceanographic Program\nOBSERVATION PLATFORM: Bottom-anchored deep moorings at depths between 3,200m and 4,600m.\n\nSCIENTIFIC SUMMARY:\n1. Net kinematic transport of dense shelf water (< -0.7°C, > 34.64 PSU) decreased from 8.2 Sv in 2012 to 6.7 Sv in 2024.\n2. Freshening of source waters is directly linked to enhanced basal melting of the Larsen C and Ronne Ice Shelves.\n3. Decadal slowdown in bottom water ventilation impacts the global oceanic overturning conveyor belt and thermohaline heat uptake in the South Atlantic.",
  },
  {
    id: "repo-11",
    title: "Cryoconite Hole Microbiota & Nitrogen Fixation in Dronning Maud Land",
    repository: "NCPOR",
    category: "eDNA",
    type: "dataset",
    authorOrOrigin: "NCPOR Cryobiology & Glaciology Laboratory",
    yearOrDate: "2024",
    wordCount: 10800,
    doiOrRef: "NCPOR-eDNA-CRYOCON-2024-11",
    snippet:
      "16S rRNA gene amplicon sequencing and nifH gene quantification identifying active diazotrophic cyanobacteria and tardigrada in supraglacial dust holes across Schirmacher Oasis.",
    fullContent:
      "TITLE: Biological Function and Nitrogen Fixation in Antarctic Cryoconite Ecosystems\nSTUDY LOCATION: Schirmacher Oasis & continental ice margin near Maitri Station\n\nDATA OVERVIEW:\n1. Amplicon sequencing revealed abundant Nostocales, Microcoleus, and Oscillatoriales dominating dark biogenic sediment.\n2. Acetylene reduction assays confirm active biological nitrogen fixation at temperatures as low as +0.5°C during the peak summer melt season.\n3. Demonstrates that supraglacial cryoconite holes serve as regional biodiversity hotspots and primary nitrogen providers for peripheral terrestrial oasis ecosystems.",
  },
  {
    id: "repo-12",
    title: "Amundsen Sea Polynya Sea Ice Thickness & Freeboard Radar Altimetry",
    repository: "USAP",
    category: "Datasets",
    type: "dataset",
    authorOrOrigin: "United States Antarctic Program & NCPOR Bilateral Initiative",
    yearOrDate: "2023",
    wordCount: 17600,
    doiOrRef: "USAP-AMUNDSEN-POL-2023-ALT",
    snippet:
      "Airborne and satellite Ka-band radar altimetry measuring snow depth, ice freeboard, and coastal polynya opening events along the Pine Island and Thwaites glacier margins.",
    fullContent:
      "TITLE: Radar Altimetry of Sea Ice Freeboard in the Amundsen Sea Coastal Polynya\nCOLLABORATING AGENCIES: USAP (NSF) & NCPOR (MoES)\n\nKEY TELEMETRY FINDINGS:\n1. Coastal polynya opening frequency increased by 22% during the 2022–2023 austral summer due to strong katabatic offshore gales.\n2. Average sea ice thickness in the coastal leads was 0.85m, compared to 1.62m in the perennial pack ice.\n3. Intense heat flux from the exposed open ocean to the atmosphere reached 240 W/m², driving localized convection and rapid salt rejection that sustains shelf bottom water formation.",
  },
  {
    id: "repo-13",
    title: "High-Altitude Antarctic Weather Mast SYNOP Micro-Meteorology",
    repository: "IMD",
    category: "Datasets",
    type: "dataset",
    authorOrOrigin: "India Meteorological Department (IMD) · Maitri Meteorological Post",
    yearOrDate: "2024",
    wordCount: 13400,
    doiOrRef: "IMD-ANT-SYNOP-2024-001",
    snippet:
      "Minute-by-minute automatic weather station (AWS) recordings from the 28-meter meteorological tower at Maitri, recording wind gusts, radiation balance, and katabatic wind onset.",
    fullContent:
      "TITLE: Continuous AWS Micro-Meteorology at Maitri Station (IMD, 2024)\nSTATION IDENTIFIER: 89514 (WMO Registered Site, Maitri)\n\nOBSERVATIONAL RECORDS:\n1. Maximum instantaneous wind gust recorded during 2024: 51.4 m/s (100 knots) on 14 August during an intense polar low cyclone.\n2. Katabatic wind events were documented on 142 days, characterized by a sudden 6–10°C temperature drop and 15–25 m/s southerly gravity currents flowing off the Antarctic ice sheet.\n3. Direct and diffuse solar radiation records confirm continuous 24-hour insolation averaging 380 W/m² throughout December.",
  },
];

export default function PolarAI({
  onNavigate,
  workspaceSources = [],
  onAddToWorkspace,
}: Props) {
  // Notebook Title
  const [notebookTitle, setNotebookTitle] = useState("Polar Knowledge Notebook");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Sources State
  const [sources, setSources] = useState<NotebookSource[]>(INITIAL_NOTEBOOK_SOURCES);
  const [activeSourceReader, setActiveSourceReader] = useState<NotebookSource | null>(null);
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  const [newSourceText, setNewSourceText] = useState("");
  const [newSourceTitle, setNewSourceTitle] = useState("");
  const [activeCitationExcerpt, setActiveCitationExcerpt] = useState<NotebookCitation | null>(null);

  // Repository Search Controls State
  const [selectedRepo, setSelectedRepo] = useState("NCPOR");
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState("");
  const [isRepoExplorerOpen, setIsRepoExplorerOpen] = useState(false);
  const [previewRepoItem, setPreviewRepoItem] = useState<RepoSourceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleShareNotebook = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      showToast("Notebook link copied to clipboard!");
    } catch {
      showToast("Notebook link copied!");
    }
  };

  // Selected active sources count
  const selectedSources = useMemo(() => sources.filter((s) => s.selected), [sources]);
  const areAllSourcesSelected = sources.length > 0 && sources.every((s) => s.selected);

  const handleToggleSelectAll = () => {
    const nextVal = !areAllSourcesSelected;
    setSources((prev) => prev.map((s) => ({ ...s, selected: nextVal })));
  };

  // Add a repository source to the notebook
  const handleAddRepoSourceToNotebook = (item: RepoSourceItem) => {
    if (sources.some((s) => s.title.toLowerCase() === item.title.toLowerCase())) {
      showToast(`"${item.title}" is already in your notebook sources`);
      return;
    }

    const nextCitationNum = sources.length + 1;
    const newSource: NotebookSource = {
      id: `src-repo-${Date.now()}-${item.id}`,
      citationNumber: nextCitationNum,
      title: item.title,
      type: item.type,
      authorOrOrigin: item.authorOrOrigin,
      yearOrDate: item.yearOrDate,
      wordCount: item.wordCount,
      doiOrRef: item.doiOrRef,
      snippet: item.snippet,
      fullContent: item.fullContent,
      selected: true,
    };

    setSources((prev) => [...prev, newSource]);
    showToast(`Added source [${nextCitationNum}]: "${item.title}"`);
  };

  // Remove source from notebook
  const handleRemoveSource = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSources((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, citationNumber: idx + 1 }));
    });
    showToast("Source removed from notebook");
  };

  // Filtered Repository Sources for Explorer
  const filteredRepoSources = useMemo(() => {
    return ALL_REPOSITORY_SOURCES.filter((item) => {
      if (selectedRepo !== "All" && selectedRepo !== "All Repositories") {
        if (item.repository !== selectedRepo) return false;
      }
      if (selectedCategory !== "All") {
        if (item.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      if (repoSearchQuery.trim()) {
        const q = repoSearchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSnippet = item.snippet.toLowerCase().includes(q);
        const matchesOrigin = item.authorOrOrigin.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSnippet && !matchesOrigin && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [selectedRepo, selectedCategory, repoSearchQuery]);

  // Sources filtered by search query if typing
  const displayedSources = useMemo(() => {
    if (!repoSearchQuery.trim()) return sources;
    const q = repoSearchQuery.toLowerCase();
    return sources.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.snippet.toLowerCase().includes(q) ||
        s.authorOrOrigin.toLowerCase().includes(q)
    );
  }, [sources, repoSearchQuery]);

  // Chat Conversation State
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Notes & Studio State
  const [notes, setNotes] = useState<UserNote[]>([
    {
      id: "note-1",
      title: "Antarctic Sea Ice Record Low (2023)",
      content:
        "Key figure: In Feb 2023, Antarctic sea ice fell to 1.79M km². This exerts a 4-9 day lag delay on the Indian Summer Monsoon onset through modulation of the Mascarene High.",
      createdAt: "Today",
      sourceTag: "Changing Sea Ice Dynamics",
    },
    {
      id: "note-2",
      title: "Maitri & Bharati Key Capabilities",
      content:
        "• Maitri (est. 1989): High-latitude weather mast, Brewer ozone, Priyadarshini Lake.\n• Bharati (est. 2012): ISRO X-band satellite tracking radomes, deep-sea CTD.",
      createdAt: "Yesterday",
      sourceTag: "Station Telemetry",
    },
  ]);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");

  // Audio Overview State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackSec, setAudioPlaybackSec] = useState(18);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Active Interactive Studio Tool & Toast
  const [activeStudioTool, setActiveStudioTool] = useState<StudioTool | null>(null);
  const [studioToast, setStudioToast] = useState<string | null>(null);

  // Studio Sources derivation
  const studioSources: WorkspaceSource[] = useMemo(() => {
    const sel = sources.filter((s) => s.selected);
    const target = sel.length > 0 ? sel : sources;
    return target.map((s) => ({
      id: s.id,
      type: (s.type === "dataset" || s.type === "expedition" ? s.type : "publication") as any,
      title: s.title,
      meta: `${s.authorOrOrigin} · ${s.yearOrDate}`,
      version: "v1.0",
      date: s.yearOrDate,
      origin: s.authorOrOrigin,
    }));
  }, [sources]);

  // Studio Document Modal State
  const [activeStudioDoc, setActiveStudioDoc] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);

  // Notice banner dismissal
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isGeneratingChat]);

  // Audio timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioPlaybackSec((prev) => (prev >= 255 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const toggleSourceSelection = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  // Grounded Answering Engine
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsGeneratingChat(true);

    setTimeout(() => {
      const qLower = query.toLowerCase();
      let answerText = "";
      let citations: NotebookCitation[] = [];

      if (qLower.includes("sea ice") || qLower.includes("albedo") || qLower.includes("minimum")) {
        answerText =
          "According to your indexed sources [1], Antarctic sea ice extent experienced an unprecedented decline in February 2023, dropping to 1.79 million km² — the lowest recorded in 44 years of satellite monitoring [1].\n\nKey mechanisms detailed in the text:\n• Ice-Albedo Loop: The retreat of reflective sea ice exposes open oceanic waters, absorbing 93% of solar irradiance and warming the mixed layer by +1.8°C [1].\n• Monsoonal Teleconnections: Reduced sea ice over the Weddell Sea alters the Mascarene High atmospheric pressure system, delaying the Indian Summer Monsoon by 4 to 9 days [1].\n• Bottom Water Slowdown: Antarctic Bottom Water (AABW) export from the Weddell and Ross gyres has declined by approximately 18% [1].";
        citations = [
          {
            num: 1,
            sourceId: "src-1",
            sourceTitle: "Changing Sea Ice Dynamics in the Southern Ocean (2024)",
            excerpt: "The February 2023 minimum reached 1.79 million km² (1.03 million km² below the 1981–2010 mean).",
          },
        ];
      } else if (qLower.includes("maitri") || qLower.includes("bharati") || qLower.includes("station")) {
        answerText =
          "Your sources document India's two permanent operational Antarctic stations [2][3]:\n\n1. Maitri Station (est. 1989) [2]:\n• Located in the rocky Schirmacher Oasis at 70°46′S, 11°44′E (elevation 117m) [2].\n• Operates continuous SYNOP weather mast, Brewer ozone spectrophotometer, and Priyadarshini freshwater lake observatory [2].\n• Winter-over team: 24 personnel [2].\n\n2. Bharati Station (est. 2012) [2]:\n• Positioned on the eastern coast of Prydz Bay at 69°24′S, 76°11′E [2].\n• Built from 134 ISO modular containers with ultra-low environmental footprint [2].\n• Hosts ISRO X/S-band satellite tracking radomes downloading remote-sensing telemetry from Cartosat and Oceansat [2].";
        citations = [
          {
            num: 2,
            sourceId: "src-2",
            sourceTitle: "Maitri & Bharati Stations Long-Term Environmental Telemetry",
            excerpt: "Continuous automated recordings at Maitri (1989–2024) and Bharati (2012–2024).",
          },
          {
            num: 3,
            sourceId: "src-3",
            sourceTitle: "46th Indian Antarctic Expedition (IAE-46) Operational Dossier",
            excerpt: "Commissioned containerized solar-wind hybrid microgrid reducing diesel reliance by 22%.",
          },
        ];
      } else if (qLower.includes("himadri") || qLower.includes("arctic") || qLower.includes("indarc")) {
        answerText =
          "The sources detail India's Arctic footprint anchored at Himadri Station in Ny-Ålesund, Svalbard (78°55′N) [4]:\n\n• IndARC Observatory: India's landmark underwater mooring stationed at 192m depth in Kongsfjorden [4].\n• Year-Round Telemetry: Logs water temperature, salinity, and ambient acoustics uninterrupted during the months-long Arctic polar night [4].\n• Atlantification: Records demonstrate regular intrusion of warm, salty Atlantic water through the West Spitsbergen Current, altering the fjord's freezing regime [4].\n• Arctic Amplification: Svalbard surface air temperatures are warming at 3.5 times the global rate [4].";
        citations = [
          {
            num: 4,
            sourceId: "src-4",
            sourceTitle: "IndARC Mooring & Kongsfjorden Arctic Climate Telemetry",
            excerpt: "IndARC, India's multi-sensor underwater observatory moored at 192m depth in Kongsfjorden.",
          },
        ];
      } else {
        answerText = `Based on synthesis across your ${selectedSources.length} selected notebook sources [1][2][3]:\n\n1. Polar Cryosphere & Sea Ice: The 2023 Southern Ocean sea ice retreat (1.79M km²) is accelerating regional thermodynamic ocean warming [1].\n2. Antarctic Observatories: Maitri and Bharati provide continuous synoptic meteorological, ozone, and satellite telemetry [2].\n3. Arctic Linkages: IndARC mooring at 192m in Kongsfjorden tracks ongoing fjord Atlantification [4].\n4. Field Expedition Program: IAE-46 completed 120m ice-core retrieval and commissioned green hybrid microgrids [3].`;
        citations = [
          { num: 1, sourceId: "src-1", sourceTitle: "Changing Sea Ice Dynamics", excerpt: "Record sea ice minimum 1.79 million km²." },
          { num: 2, sourceId: "src-2", sourceTitle: "Station Telemetry", excerpt: "Continuous automated recordings at Maitri and Bharati." },
        ];
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        text: answerText,
        citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsGeneratingChat(false);
    }, 600);
  };

  const handleSaveToNotes = (msg: ChatMessage) => {
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      title: `Saved: ${msg.text.slice(0, 32)}...`,
      content: msg.text,
      createdAt: "Just now",
      sourceTag: "Chat Synthesis",
    };
    setNotes((prev) => [newNote, ...prev]);
    setChatMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, savedToNotes: true } : m))
    );
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const note: UserNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim(),
      content: newNoteBody.trim(),
      createdAt: "Just now",
      sourceTag: "User Note",
    };
    setNotes((prev) => [note, ...prev]);
    setNewNoteTitle("");
    setNewNoteBody("");
    setIsCreatingNote(false);
  };

  const handleAddCustomSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitle.trim() || !newSourceText.trim()) return;
    const newSrc: NotebookSource = {
      id: `src-${Date.now()}`,
      citationNumber: sources.length + 1,
      title: newSourceTitle.trim(),
      type: "text",
      authorOrOrigin: "User Added Document",
      yearOrDate: new Date().getFullYear().toString(),
      wordCount: newSourceText.trim().split(/\s+/).length,
      snippet: newSourceText.slice(0, 200) + "...",
      fullContent: newSourceText,
      selected: true,
    };
    setSources((prev) => [newSrc, ...prev]);
    setNewSourceTitle("");
    setNewSourceText("");
    setIsAddSourceModalOpen(false);
  };

  const handleLaunchStudioTool = (toolId: string) => {
    const normalizedTool = (toolId === "reports" ? "report" : toolId) as StudioTool;
    setActiveStudioTool(normalizedTool);
  };

  return (
    <div
      className="h-full overflow-hidden flex flex-col"
      style={{ background: "var(--content-bg, #f1f5f9)" }}
    >
      {/* ── TOP NAV BAR (MATCHING SCREENSHOT WITH WEBSITE THEME) ─────────────── */}
      <header className="bg-white border-b border-slate-200/90 px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-2xs">
        {/* Left: Brand Icon + Editable Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#003366] text-white flex items-center justify-center font-bold shadow-xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={notebookTitle}
                onChange={(e) => setNotebookTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                className="font-bold text-slate-900 text-base border-b-2 border-[#003366] outline-none focus:outline-none focus:ring-0 bg-transparent"
                style={{ outline: "none", boxShadow: "none" }}
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="font-bold text-slate-900 text-base sm:text-lg tracking-tight cursor-pointer hover:text-[#003366] flex items-center gap-1.5"
                title="Click to rename notebook"
              >
                <span>{notebookTitle}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 text-slate-400">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </h1>
            )}
          </div>
        </div>

        {/* Right: Actions Matching Screenshot */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setNotebookTitle("Polar Research Notebook");
              setChatMessages([]);
              setHasStartedChat(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create notebook</span>
          </button>

          <button
            type="button"
            onClick={handleShareNotebook}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>Share</span>
          </button>

          {/* Profile Circle */}
          <div className="w-7 h-7 rounded-full bg-[#003366] text-white font-bold text-xs flex items-center justify-center shadow-xs ml-1">
            V
          </div>
        </div>
      </header>

      {/* ── 3-PANEL NOTEBOOKLM WORKSPACE ─────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── LEFT PANEL: "SOURCES" CARD (3 COLS) ───────────────────────────── */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col h-full overflow-hidden">
          {/* Sources Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <h2 className="font-bold text-sm text-slate-900">
              Sources
            </h2>
            <div className="w-5 h-5 rounded-md text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
          </div>

          {/* "+ Add sources" Large Button */}
          <div className="p-3.5 pb-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsAddSourceModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add sources</span>
            </button>
          </div>

          {/* Search Bar matching screenshot */}
          <div className="px-3.5 pb-2 flex-shrink-0 relative">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 focus-within:border-[#003366] focus-within:bg-white transition shadow-2xs">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={repoSearchQuery}
                  onChange={(e) => setRepoSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsRepoExplorerOpen(true);
                    }
                  }}
                  placeholder="Search repository for new sources"
                  className="w-full text-[11px] text-slate-800 placeholder-slate-400 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none shadow-none ring-0 pr-5"
                  style={{ outline: "none", boxShadow: "none", border: "none" }}
                />
                {repoSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setRepoSearchQuery("")}
                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                  {/* Repo Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRepoDropdownOpen(!isRepoDropdownOpen);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-1 transition cursor-pointer shadow-2xs text-[10px] font-medium text-slate-700 ${
                        isRepoDropdownOpen ? "border-[#003366] text-[#003366]" : ""
                      }`}
                    >
                      <span>{selectedRepo}</span>
                      <span className="text-[8px] text-slate-400">▼</span>
                    </button>

                    {isRepoDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsRepoDropdownOpen(false)}
                        />
                        <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-40 animate-fadeIn">
                          <div className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Select Repository
                          </div>
                          {REPO_OPTIONS.map((repo) => (
                            <button
                              key={repo}
                              type="button"
                              onClick={() => {
                                setSelectedRepo(repo);
                                setIsRepoDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                                selectedRepo === repo
                                  ? "text-[#003366] font-bold bg-blue-50/60"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{repo}</span>
                              {selectedRepo === repo && (
                                <span className="text-[#003366] font-bold">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                        setIsRepoDropdownOpen(false);
                      }}
                      className={`px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-1 transition cursor-pointer shadow-2xs text-[10px] font-medium text-slate-700 ${
                        isCategoryDropdownOpen ? "border-[#003366] text-[#003366]" : ""
                      }`}
                    >
                      <span>{selectedCategory}</span>
                      <span className="text-[8px] text-slate-400">▼</span>
                    </button>

                    {isCategoryDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsCategoryDropdownOpen(false)}
                        />
                        <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-40 animate-fadeIn">
                          <div className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Source Category
                          </div>
                          {CATEGORY_OPTIONS.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(cat);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                                selectedCategory === cat
                                  ? "text-[#003366] font-bold bg-blue-50/60"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{cat}</span>
                              {selectedCategory === cat && (
                                <span className="text-[#003366] font-bold">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow Button */}
                <button
                  type="button"
                  title="Search & browse repository sources"
                  onClick={() => setIsRepoExplorerOpen(true)}
                  className="w-6 h-6 rounded-full bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-[#003366] flex items-center justify-center text-slate-700 cursor-pointer shadow-2xs transition"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Instant Floating Suggestions Popover */}
            {repoSearchQuery.trim().length > 0 && (
              <div className="absolute left-3.5 right-3.5 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-40 max-h-64 overflow-y-auto space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-100 text-[10px] text-slate-500 font-semibold">
                  <span>Matching Polar Repository ({filteredRepoSources.length})</span>
                  <button
                    type="button"
                    onClick={() => setIsRepoExplorerOpen(true)}
                    className="text-[#003366] hover:underline cursor-pointer"
                  >
                    View all &rarr;
                  </button>
                </div>
                {filteredRepoSources.length === 0 ? (
                  <div className="text-[11px] text-slate-400 p-2 text-center">
                    No repository matches found for "{repoSearchQuery}"
                  </div>
                ) : (
                  filteredRepoSources.slice(0, 4).map((item) => {
                    const isAdded = sources.some(
                      (s) => s.title.toLowerCase() === item.title.toLowerCase()
                    );
                    return (
                      <div
                        key={item.id}
                        className="p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-bold font-mono px-1 rounded bg-blue-50 text-[#003366] border border-blue-200">
                              {item.repository}
                            </span>
                            <span className="text-[9px] text-slate-400">{item.category}</span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-800 truncate">
                            {item.title}
                          </div>
                        </div>
                        {isAdded ? (
                          <span className="text-[10px] text-emerald-600 font-bold px-1.5 py-0.5 rounded bg-emerald-50">
                            ✓ Added
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddRepoSourceToNotebook(item)}
                            className="px-2 py-1 rounded bg-[#003366] hover:bg-[#002244] text-white text-[10px] font-bold cursor-pointer whitespace-nowrap"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Sources List / Empty State */}
          <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-2">
            {/* Select All Row */}
            {sources.length > 0 && (
              <div className="flex items-center justify-between px-1 pb-1 text-[11px] text-slate-500 font-medium border-b border-slate-100">
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800">
                  <input
                    type="checkbox"
                    checked={areAllSourcesSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded text-[#003366] cursor-pointer w-3.5 h-3.5"
                  />
                  <span>Select all ({sources.length})</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedSources.length} active
                </span>
              </div>
            )}

            {sources.length === 0 ? (
              <div className="py-12 px-3 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="font-bold text-xs text-slate-800">
                  Saved sources will appear here
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Add publications, datasets, or notes. Then ask questions or create studio artifacts based on these sources.
                </p>
                <div
                  onClick={() => setIsRepoExplorerOpen(true)}
                  className="text-xs text-[#003366] font-semibold hover:underline cursor-pointer pt-2"
                >
                  Browse polar repository sources &rarr;
                </div>
              </div>
            ) : displayedSources.length === 0 ? (
              <div className="py-8 px-2 text-center text-xs text-slate-500 space-y-1.5">
                <div>No notebook sources match "{repoSearchQuery}"</div>
                <button
                  type="button"
                  onClick={() => setRepoSearchQuery("")}
                  className="text-xs text-[#003366] font-semibold hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              displayedSources.map((src) => (
                <div
                  key={src.id}
                  className={`p-2.5 rounded-xl border transition-all group relative ${
                    src.selected
                      ? "bg-blue-50/40 border-blue-200 text-slate-900 shadow-2xs"
                      : "bg-white border-slate-200 text-slate-500 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={src.selected}
                      onChange={() => toggleSourceSelection(src.id)}
                      className="mt-1 rounded text-[#003366] cursor-pointer"
                    />

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setActiveSourceReader(src)}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[9px] font-mono font-bold text-[#003366] bg-blue-50 px-1 rounded border border-blue-200">
                          [{src.citationNumber}] {src.type.toUpperCase()}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {Math.round(src.wordCount / 1000)}k w
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-slate-900 leading-snug line-clamp-1 hover:text-[#003366]">
                        {src.title}
                      </h4>
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {src.authorOrOrigin}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleRemoveSource(src.id, e)}
                      title="Remove source from notebook"
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 p-0.5 rounded transition cursor-pointer text-xs leading-none"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── CENTER PANEL: BLANK CANVAS / CHAT (6 COLS) ────────────────────── */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col h-full overflow-hidden">
          {/* Main Content Area */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-between">
            {!hasStartedChat ? (
              /* "Let's start your notebook..." Prompt Screen (Exact Match to Screenshot) */
              <div className="max-w-xl mx-auto my-auto space-y-6 text-center sm:text-left py-6">
                {/* Hand Wave Icon */}
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto sm:mx-0 shadow-2xs border border-amber-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6 text-amber-600">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  </svg>
                </div>

                {/* Main Heading */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Let's start your notebook...
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    This is your blank canvas to understand, create, or make progress on polar research. I can help you get started or you can go ahead and explore your {selectedSources.length} active sources.
                  </p>
                </div>

                {/* "What would you like this notebook to help you do?" */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    What would you like this notebook to help you do?
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSendMessage("Learn about Southern Ocean sea ice dynamics and climate change")}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-xs font-semibold text-slate-800 transition cursor-pointer text-left shadow-2xs"
                    >
                      Learn about a new topic &rarr;
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLaunchStudioTool("slides")}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-xs font-semibold text-slate-800 transition cursor-pointer text-left shadow-2xs"
                    >
                      Create something new &rarr;
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage("Compare Maitri, Bharati, and Himadri station operational capabilities")}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-xs font-semibold text-slate-800 transition cursor-pointer text-left shadow-2xs"
                    >
                      Make progress on a project &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Active Chat Stream */
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-[#003366] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
                        AI
                      </div>
                    )}

                    <div
                      className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                        msg.role === "user"
                          ? "bg-[#003366] text-white rounded-tr-sm shadow-xs"
                          : "bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-sm shadow-2xs"
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                        {msg.text}
                      </div>

                      {/* Inline Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Sources:
                          </span>
                          {msg.citations.map((c, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setActiveCitationExcerpt(c)}
                              className="px-2 py-0.5 rounded bg-blue-50 text-[#003366] font-mono text-[10px] font-bold border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                            >
                              [{c.num}] {c.sourceTitle.slice(0, 16)}...
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Action Bar on Response */}
                      {msg.role === "assistant" && (
                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                          <button
                            type="button"
                            onClick={() => handleSaveToNotes(msg)}
                            disabled={msg.savedToNotes}
                            className={`font-semibold flex items-center gap-1 cursor-pointer ${
                              msg.savedToNotes ? "text-emerald-700" : "text-[#003366] hover:underline"
                            }`}
                          >
                            <span>{msg.savedToNotes ? "Saved to Notes" : "Save to Note"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(msg.text)}
                            className="text-slate-400 hover:text-slate-700 text-xs"
                          >
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isGeneratingChat && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 w-fit">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#003366] border-t-transparent animate-spin" />
                    <span>Analyzing notebook sources and synthesizing grounded response...</span>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Capsule Input Bar (Matching Screenshot) */}
            <div className="pt-4 space-y-1.5">
              <div className="rounded-full border border-slate-300 bg-white shadow-xs p-1.5 pl-5 pr-2 flex items-center justify-between gap-3 focus-within:border-[#003366] focus-within:shadow-sm transition">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask a question or create something"
                  className="flex-1 text-xs sm:text-sm text-slate-900 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none shadow-none ring-0"
                  style={{ outline: "none", boxShadow: "none", border: "none" }}
                />

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedSources.length} sources
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    className="w-8 h-8 rounded-full bg-[#003366] hover:bg-[#002244] text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                    title="Send"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center">
                Polar Knowledge Notebook can make mistakes, so double-check with indexed sources.
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: "STUDIO" CARD (3 COLS) ───────────────────────────── */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col h-full overflow-hidden relative">
          {/* Studio Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <h2 className="font-bold text-sm text-slate-900">
              Studio
            </h2>
            <div className="w-5 h-5 rounded-md text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {/* Multilingual Audio Overview Banner (Matching Screenshot) */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-slate-700 space-y-1">
              <div className="font-semibold text-[#003366] text-[10px] uppercase tracking-wider">
                Create an Audio Overview in:
              </div>
              <div className="text-[10px] text-slate-600 leading-relaxed font-sans">
                हिन्दी, বাংলা, ગુજરાતી, ಕನ್ನಡ, മലയാളം, मराठी, ਪੰਜਾਬੀ, தமிழ், తెలుగు
              </div>
            </div>

            {/* Feature Banner (Matching Screenshot) */}
            {showNoticeBanner && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-800 leading-snug">
                  <strong>New:</strong> You can now create Interactive Reports!
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLaunchStudioTool("reports")}
                    className="px-2 py-0.5 rounded-lg bg-[#003366] text-white text-[10px] font-bold"
                  >
                    Try it
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNoticeBanner(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs"
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}

            {/* 9 STUDIO TOOL BUTTONS (2-COLUMN GRID MATCHING SCREENSHOT) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* 1. Audio Overview */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("audio")}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366] truncate">
                  Audio Overv...
                </span>
              </button>

              {/* 2. Slide Deck */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("slides")}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366] truncate">
                  Slide Deck
                </span>
              </button>

              {/* 3. Video Overview */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("video")}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366] truncate">
                  Video Overv...
                </span>
              </button>

              {/* 4. Mind Map */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("mindmap")}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366] truncate">
                  Mind Map
                </span>
              </button>

              {/* 5. Reports (New!) */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("reports")}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366] truncate">
                  Rep... <span className="text-[10px] text-rose-600 font-bold">New!</span>
                </span>
              </button>

              {/* 6. Flashcards */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("flashcards")}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <rect x="2" y="6" width="16" height="12" rx="2" />
                    <path d="M6 2h14a2 2 0 0 1 2 2v12" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366] truncate">
                  Flashcards
                </span>
              </button>

              {/* 7. Quiz */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("quiz")}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366] truncate">
                  Quiz
                </span>
              </button>

              {/* 8. Infographic */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("infographic")}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366] truncate">
                  Infographic
                </span>
              </button>

              {/* 9. Data Table */}
              <button
                type="button"
                onClick={() => handleLaunchStudioTool("datatable")}
                className="col-span-2 p-3 rounded-xl border border-slate-200 hover:border-[#003366] hover:bg-slate-50 text-left transition cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-blue-50 text-[#003366] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                  </svg>
                </div>
                <span className="font-semibold text-xs text-slate-800 group-hover:text-[#003366]">
                  Data Table
                </span>
              </button>
            </div>

            {/* Saved Written Notes List */}
            <div className="pt-2 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Saved Notes ({notes.length})
              </div>
              {notes.map((nt) => (
                <div
                  key={nt.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1 relative group"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{nt.title}</h5>
                    <button
                      type="button"
                      onClick={() => setNotes((prev) => prev.filter((n) => n.id !== nt.id))}
                      className="text-slate-300 hover:text-rose-600 text-xs opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {nt.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating "+ Add note" Pill Button Matching Screenshot */}
          <div className="p-3 border-t border-slate-100 bg-white flex flex-col items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsCreatingNote(true)}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Add note</span>
            </button>

            <span className="text-[10px] text-slate-400 text-center mt-1.5">
              Studio outputs and notes are saved here.
            </span>
          </div>
        </div>
      </div>

      {/* ── MODAL: REAL INTERACTIVE STUDIO VIEWER (POLAR KNOWLEDGE) ─────────── */}
      {activeStudioTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveStudioTool(null)}
        >
          <div
            className="w-full max-w-5xl h-[88vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#003366] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {activeStudioTool === "audio" && "🎙️"}
                  {activeStudioTool === "video" && "🎬"}
                  {activeStudioTool === "slides" && "📊"}
                  {activeStudioTool === "mindmap" && "🧠"}
                  {activeStudioTool === "flashcards" && "🗂️"}
                  {activeStudioTool === "quiz" && "🎯"}
                  {activeStudioTool === "infographic" && "📈"}
                  {activeStudioTool === "datatable" && "📋"}
                  {activeStudioTool === "report" && "📄"}
                  {activeStudioTool === "social" && "🌐"}
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#003366] font-bold uppercase tracking-wider">
                    Polar Knowledge Studio · Real Interactive Engine
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {activeStudioTool === "audio" && "Audio Overview & Host Synthesis"}
                    {activeStudioTool === "video" && "Expedition Video Documentary & Storyboard"}
                    {activeStudioTool === "slides" && "Interactive Slide Deck Presentation"}
                    {activeStudioTool === "mindmap" && "Interactive Visual Concept Mind Map"}
                    {activeStudioTool === "flashcards" && "Interactive 3D Study Flashcards"}
                    {activeStudioTool === "quiz" && "Interactive Knowledge Quiz & XP Rewards"}
                    {activeStudioTool === "infographic" && "Visual Infographic & Metric Dashboard"}
                    {activeStudioTool === "datatable" && "Polar Station Telemetry Data Matrix"}
                    {activeStudioTool === "report" && "Executive Cryosphere Research Brief"}
                    {activeStudioTool === "social" && "Multi-Channel Social Syndication Suite"}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newNote: UserNote = {
                      id: `note-${Date.now()}`,
                      title: `Studio: ${activeStudioTool.toUpperCase()} Output`,
                      content: `Grounded studio generation for ${activeStudioTool} synthesized from ${studioSources.length} selected notebook sources.`,
                      createdAt: "Just now",
                      sourceTag: "Studio Synthesis",
                    };
                    setNotes((prev) => [newNote, ...prev]);
                    setStudioToast("Saved record to your Notes panel!");
                    setTimeout(() => setStudioToast(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition"
                >
                  Save as Note
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioTool(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 text-xl leading-none transition cursor-pointer"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Interactive Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
              <InteractiveStudioViewer
                tool={activeStudioTool}
                sources={studioSources}
                onBackToTools={() => setActiveStudioTool(null)}
                onOpenSocial={() => {
                  setActiveStudioTool("social");
                }}
                onToast={(msg) => {
                  setStudioToast(msg);
                  setTimeout(() => setStudioToast(null), 3500);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {studioToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003366] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl border border-blue-400 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>💡</span>
          <span>{studioToast}</span>
          <button onClick={() => setStudioToast(null)} className="ml-2 text-white/70 hover:text-white cursor-pointer">&times;</button>
        </div>
      )}

      {/* ── MODAL: SOURCE READER ──────────────────────────────────────────────── */}
      {activeSourceReader && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs"
          onClick={() => setActiveSourceReader(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  SOURCE [{activeSourceReader.citationNumber}]
                </span>
                <h3 className="font-bold text-slate-900 text-sm truncate max-w-md">
                  {activeSourceReader.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSourceReader(null)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs leading-relaxed text-slate-800 bg-slate-50 whitespace-pre-line">
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 font-sans text-xs">
                <div><strong>Origin:</strong> {activeSourceReader.authorOrOrigin}</div>
                <div><strong>Year:</strong> {activeSourceReader.yearOrDate}</div>
                <div><strong>Reference:</strong> {activeSourceReader.doiOrRef || "NCPOR Archive"}</div>
              </div>

              <div>{activeSourceReader.fullContent}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: STUDIO DOCUMENT VIEWER ─────────────────────────────────────── */}
      {activeStudioDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs"
          onClick={() => setActiveStudioDoc(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-slate-900 text-sm">
                {activeStudioDoc.title}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newNote: UserNote = {
                      id: `note-${Date.now()}`,
                      title: activeStudioDoc.title,
                      content: activeStudioDoc.content,
                      createdAt: "Just now",
                      sourceTag: "Studio Output",
                    };
                    setNotes((prev) => [newNote, ...prev]);
                    setActiveStudioDoc(null);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#003366] text-white text-xs font-semibold cursor-pointer"
                >
                  Save as Note
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioDoc(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg leading-none"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-slate-800 bg-slate-50 whitespace-pre-line">
              {activeStudioDoc.content}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD SOURCE ─────────────────────────────────────────────────── */}
      {isAddSourceModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs"
          onClick={() => setIsAddSourceModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Add Source to Notebook
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSourceModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-xs text-[#003366]">Looking for Polar Repository Datasets?</div>
                <div className="text-[11px] text-slate-500">Search and import validated NCPOR, IndARC, and Southern Ocean expedition sources directly.</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddSourceModalOpen(false);
                  setIsRepoExplorerOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-semibold cursor-pointer whitespace-nowrap shadow-2xs flex-shrink-0"
              >
                Browse Repository &rarr;
              </button>
            </div>

            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[10px] text-slate-400 uppercase font-semibold tracking-wider absolute">
                or add custom text
              </span>
            </div>

            <form onSubmit={handleAddCustomSource} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Source Title / Document Name:
                </label>
                <input
                  type="text"
                  required
                  value={newSourceTitle}
                  onChange={(e) => setNewSourceTitle(e.target.value)}
                  placeholder="e.g. Kongsfjorden Phytoplankton Bloom Report 2024"
                  className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 transition"
                  style={{ outline: "none", boxShadow: "none" }}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Paste Text Content or Excerpt:
                </label>
                <textarea
                  rows={6}
                  required
                  value={newSourceText}
                  onChange={(e) => setNewSourceText(e.target.value)}
                  placeholder="Paste research document text, PDF extracts or data summary..."
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 transition"
                  style={{ outline: "none", boxShadow: "none" }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSourceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-semibold shadow-xs"
                >
                  Add to Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CITATION EXCERPT ───────────────────────────────────────────── */}
      {activeCitationExcerpt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30"
          onClick={() => setActiveCitationExcerpt(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                CITATION [{activeCitationExcerpt.num}]
              </span>
              <button
                type="button"
                onClick={() => setActiveCitationExcerpt(null)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                &times;
              </button>
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 mb-1">
                {activeCitationExcerpt.sourceTitle}
              </h4>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs italic text-slate-700 leading-relaxed font-mono">
                "{activeCitationExcerpt.excerpt}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD NOTE INLINE ────────────────────────────────────────────── */}
      {isCreatingNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs"
          onClick={() => setIsCreatingNote(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add New Note</h3>
              <button
                type="button"
                onClick={() => setIsCreatingNote(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 transition"
                style={{ outline: "none", boxShadow: "none" }}
              />
              <textarea
                rows={5}
                required
                value={newNoteBody}
                onChange={(e) => setNewNoteBody(e.target.value)}
                placeholder="Write your observation, notes, or ideas..."
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 transition"
                style={{ outline: "none", boxShadow: "none" }}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNote(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#003366] text-white font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: POLAR REPOSITORY EXPLORER (SEARCH & DISCOVERY) ────────────── */}
      {isRepoExplorerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-2xs animate-fadeIn"
          onClick={() => setIsRepoExplorerOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex-shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#003366] text-white flex items-center justify-center font-bold shadow-xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    National Polar Repository Sources
                  </h3>
                  <p className="text-xs text-slate-500">
                    Search and import validated NCPOR, IndARC, MoES, and Southern Ocean expedition datasets into your notebook.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRepoExplorerOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Filter and Search Bar inside Modal */}
            <div className="p-4 border-b border-slate-100 bg-white space-y-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={repoSearchQuery}
                    onChange={(e) => setRepoSearchQuery(e.target.value)}
                    placeholder="Search by keywords (e.g. 'sea ice', 'eDNA', 'otolith', 'Kongsfjorden', 'Maitri')..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 outline-none focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 transition"
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {repoSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRepoSearchQuery("")}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                {/* Repository Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Repository:
                  </span>
                  {REPO_OPTIONS.map((repo) => (
                    <button
                      key={repo}
                      type="button"
                      onClick={() => setSelectedRepo(repo)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        selectedRepo === repo
                          ? "bg-[#003366] text-white shadow-2xs font-semibold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {repo}
                    </button>
                  ))}
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Category:
                  </span>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white shadow-2xs font-semibold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="px-5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
              <span>
                Showing <strong>{filteredRepoSources.length}</strong> repository items
                {selectedRepo !== "All" && selectedRepo !== "All Repositories" && (
                  <span> from <strong>{selectedRepo}</strong></span>
                )}
                {selectedCategory !== "All" && (
                  <span> in <strong>{selectedCategory}</strong></span>
                )}
              </span>
              <span>
                {sources.length} active notebook {sources.length === 1 ? "source" : "sources"}
              </span>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {filteredRepoSources.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No matching repository sources found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your repository filter or search keywords, or reset filters to explore all available records.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRepo("All Repositories");
                      setSelectedCategory("All");
                      setRepoSearchQuery("");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredRepoSources.map((item) => {
                  const isAlreadyAdded = sources.some(
                    (s) => s.title.toLowerCase() === item.title.toLowerCase()
                  );

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#003366] border border-blue-200">
                            {item.repository}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.yearOrDate}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            · {Math.round(item.wordCount / 1000)}k words
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            · {item.doiOrRef}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {item.title}
                        </h4>

                        <div className="text-xs text-slate-600 font-medium">
                          {item.authorOrOrigin}
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {item.snippet}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setPreviewRepoItem(item)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer w-full sm:w-28 text-center"
                        >
                          Preview
                        </button>

                        {isAlreadyAdded ? (
                          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1 w-full sm:w-28">
                            <span>✓ In Notes</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddRepoSourceToNotebook(item)}
                            className="px-3 py-1.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full sm:w-28"
                          >
                            <span>+ Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-slate-500">
                Tip: All added sources will immediately power AI Q&A and Studio tools.
              </span>
              <button
                type="button"
                onClick={() => setIsRepoExplorerOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PREVIEW REPOSITORY ITEM ────────────────────────────────────── */}
      {previewRepoItem && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs animate-fadeIn"
          onClick={() => setPreviewRepoItem(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex-shrink-0">
                  {previewRepoItem.repository}
                </span>
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  {previewRepoItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewRepoItem(null)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs leading-relaxed text-slate-800 bg-white whitespace-pre-line">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 font-sans text-xs">
                <div><strong>Origin:</strong> {previewRepoItem.authorOrOrigin}</div>
                <div><strong>Year:</strong> {previewRepoItem.yearOrDate}</div>
                <div><strong>Category:</strong> {previewRepoItem.category}</div>
                <div><strong>Identifier:</strong> {previewRepoItem.doiOrRef}</div>
              </div>

              <div>{previewRepoItem.fullContent}</div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setPreviewRepoItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Back to Repository
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAddRepoSourceToNotebook(previewRepoItem);
                  setPreviewRepoItem(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold cursor-pointer shadow-2xs"
              >
                + Add to Notebook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-slideUp">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}