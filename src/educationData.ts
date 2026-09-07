// Educational study content, AI lectures, infographics, slide decks, and flashcards

export interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  callout?: string;
  graphicType: "diagram" | "comparison" | "stats" | "map";
  graphicData?: Record<string, any>;
  notes: string;
}

export interface SlideDeck {
  id: string;
  topic: string;
  title: string;
  duration: string;
  slidesCount: number;
  slides: SlideItem[];
}

export interface InfographicHotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
  stat?: string;
  category: "atmosphere" | "ice" | "ocean" | "biology";
}

export interface Infographic {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  image: string;
  summary: string;
  keyInsights: { label: string; value: string; desc: string }[];
  hotspots: InfographicHotspot[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  tag: string;
  difficulty: "Easy" | "Medium" | "Advanced";
}

export interface LectureChapter {
  time: string; // e.g. "02:15"
  seconds: number;
  title: string;
  slideSummary: string;
  transcriptSnippet: string;
}

export interface AILecture {
  id: string;
  title: string;
  speaker: string;
  role: string;
  institution: string;
  duration: string;
  videoThumb: string;
  topic: string;
  overview: string;
  keyFormulasOrTakeaways: string[];
  chapters: LectureChapter[];
  fullTranscript: { time: string; speaker: string; text: string }[];
}

export interface TeacherActivity {
  id: string;
  title: string;
  gradeLevel: string;
  duration: string;
  materials: string[];
  learningObjective: string;
  stepByStep: string[];
  expectedResult: string;
  ncertAlignment: string;
}

export interface CurriculumGuideItem {
  grade: string;
  theme: string;
  ncertChapterRef: string;
  learningOutcomes: string[];
  ncporPublicationsRef: string;
  hours: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SLIDE DECKS
// ─────────────────────────────────────────────────────────────────────────────
export const slideDecks: Record<string, SlideDeck> = {
  sea_ice: {
    id: "sea_ice",
    topic: "Sea Ice",
    title: "Dynamics & Climatology of Polar Sea Ice",
    duration: "10 mins",
    slidesCount: 5,
    slides: [
      {
        id: 1,
        title: "What Exactly is Sea Ice?",
        subtitle: "Oceanic Freezing vs Freshwater Glaciers",
        bulletPoints: [
          "Sea ice forms directly from salty ocean water once it drops below -1.8°C (28.8°F).",
          "Unlike icebergs and glaciers (which originate on land from compacted snowfall), sea ice grows, floats, and melts entirely at sea.",
          "As it freezes, salt brine is expelled through microscopic drainage channels into the ocean below.",
        ],
        callout: "Key Law: Because salt lowers the freezing point of water, seawater stays liquid until -1.8°C!",
        graphicType: "comparison",
        graphicData: {
          left: { title: "Sea Ice", origin: "Frozen seawater", thickness: "1–3 meters", salinity: "Fresh to Brackish" },
          right: { title: "Glaciers & Icebergs", origin: "Compacted snowfall on land", thickness: "100–4,000 meters", salinity: "100% Pure Fresh" },
        },
        notes: "Emphasize that sea ice does not directly raise global sea levels when it melts, just like an ice cube melting in a full glass of water does not overflow.",
      },
      {
        id: 2,
        title: "The Albedo Planetary Mirror",
        subtitle: "How White Surfaces Guard Earth's Climate",
        bulletPoints: [
          "Albedo is the fraction of solar radiation reflected by a surface without absorption.",
          "Clean, snow-covered sea ice reflects up to 85% of incoming solar heat back into outer space.",
          "Open, dark blue ocean water reflects only ~7%, absorbing 93% of solar heat energy.",
          "When sea ice melts, darker waters are exposed, warming faster and causing further melting (Ice-Albedo Positive Feedback Loop).",
        ],
        callout: "Physics Fact: Ice Albedo = 0.85; Open Ocean Albedo = 0.07.",
        graphicType: "stats",
        graphicData: {
          reflectionIce: "85% Reflected",
          reflectionOcean: "7% Reflected",
          absorptionOcean: "93% Absorbed as Heat",
        },
        notes: "Explain the positive feedback loop: warming causes melting, lower albedo causes more heat absorption, which triggers faster melting.",
      },
      {
        id: 3,
        title: "The Seasonal Pulse: Freeze and Melt",
        subtitle: "The Greatest Annual Surface Transformation on Earth",
        bulletPoints: [
          "In Antarctic winter (September), sea ice reaches its maximum extent: expanding to ~19 million km² (doubling the continent's size).",
          "In Antarctic summer (February), it retreats to a record minimum (~1.79 million km² recorded in 2023).",
          "This seasonal cycle drives global deep-ocean thermohaline circulation by pumping cold, hyper-saline dense water downwards.",
        ],
        callout: "NCPOR Observation: Feb 2023 marked the lowest Antarctic sea ice extent recorded in 45 years of satellite telemetry.",
        graphicType: "diagram",
        notes: "Point students to satellite microwave radiometer datasets archived in the NCPOR Data Centre.",
      },
      {
        id: 4,
        title: "Micro-Ecosystem Beneath the Floe",
        subtitle: "The Ice-Algae Engine Supporting Whales and Penguins",
        bulletPoints: [
          "The bottom surface of sea ice is honeycombed with brine pockets colonized by micro-algae (diatoms).",
          "Antarctic krill (Euphausia superba) graze on this under-ice algae nursery throughout the dark polar winter.",
          "Without sea ice algae, the entire Antarctic food web—including Adelie penguins, crabeater seals, and blue whales—collapses.",
        ],
        callout: "Biological Fact: Krill biomass exceeds 400 million tonnes—more weight than all human beings combined!",
        graphicType: "stats",
        notes: "Highlight the connection between physical oceanography and marine biodiversity.",
      },
      {
        id: 5,
        title: "NCPOR Field Research in Action",
        subtitle: "How Indian Scientists Measure Sea Ice",
        bulletPoints: [
          "Indian Antarctic Expeditions drill ice core samples across fast ice shelves around Maitri and Bharati stations.",
          "Scientists deploy Autonomous Underwater Vehicles (AUVs) and airborne LIDAR sensors to map ice floe thickness.",
          "Data feeds into the Indian Antarctic Sea-Ice Atlas and climate forecast models for the Indian Monsoon.",
        ],
        callout: "Monsoon Connection: Southern Ocean sea-ice anomalies have direct teleconnections to the strength of the Indian Summer Monsoon!",
        graphicType: "diagram",
        notes: "Emphasize why India studies the distant polar regions to safeguard domestic agricultural rainfall predictability.",
      },
    ],
  },
  glaciers: {
    id: "glaciers",
    topic: "Glaciology",
    title: "Glaciers, Ice Shelves & Continental Ice Sheets",
    duration: "12 mins",
    slidesCount: 4,
    slides: [
      {
        id: 1,
        title: "The Anatomy of a Glacier",
        subtitle: "From Fluffy Snowflakes to Flowing Blue Ice",
        bulletPoints: [
          "Glaciers form when annual snowfall accumulates faster than it melts over centuries.",
          "Under immense weight, air is squeezed out, recrystallizing granular 'firn' into dense, blue glacial ice.",
          "Glaciers behave like ultra-viscous fluids, creeping downhill under the force of gravity.",
        ],
        callout: "Glacial Fact: Blue color occurs because dense ice absorbs red wavelengths of light and scatters blue.",
        graphicType: "diagram",
        notes: "Review the accumulation zone versus ablation zone concepts.",
      },
      {
        id: 2,
        title: "Ice Sheets vs Floating Ice Shelves",
        subtitle: "Understanding Grounded vs Floating Mass",
        bulletPoints: [
          "Ice Sheet: Grounded continental ice resting on bedrock (Antarctica holds 90% of Earth's ice and 70% of fresh water).",
          "Ice Shelf: Floating tongue of glacial ice that extends out over the deep ocean while still attached to the land.",
          "Ice shelves act as natural 'buttresses' or dams, holding back the massive interior ice sheet from surging into the sea.",
        ],
        callout: "Crucial Rule: Melting floating ice shelves does not raise sea levels directly, but losing them uncorks continental ice sheets which do!",
        graphicType: "comparison",
        notes: "Use the analogy of removing a cork from a champagne bottle.",
      },
      {
        id: 3,
        title: "Ice Cores: Nature's Time Capsules",
        subtitle: "Reading 800,000 Years of Atmospheric History",
        bulletPoints: [
          "Ice coring drills extract long vertical cylinders of ice from high-altitude polar domes.",
          "Trapped microscopic air bubbles preserve ancient atmospheric samples from thousands of years ago.",
          "Heavy oxygen isotopes (O-18 / O-16) calculate exact ancient temperatures during past ice ages.",
        ],
        callout: "Indian Record: NCPOR drills ice cores from coastal Dronning Maud Land and Himalayan glaciers.",
        graphicType: "stats",
        notes: "Show how CO2 levels and temperature have tracked each other in lockstep across four glacial cycles.",
      },
      {
        id: 4,
        title: "Himalayas: The Third Polar Reservoir",
        subtitle: "India's Glacial Lifeline",
        bulletPoints: [
          "The Hindu Kush Himalayas store more snow and ice than anywhere outside the Arctic and Antarctic.",
          "Over 1.5 billion people rely on rivers fed by Himalayan meltwater (Ganga, Indus, Brahmaputra).",
          "NCPOR operates the high-altitude 'Himansh' research station in Spiti Valley at 4,080 meters to monitor glacial retreat.",
        ],
        callout: "National Importance: Understanding Himalayan glaciers is essential for India's water and energy security.",
        graphicType: "stats",
        notes: "Connect the Polar mission directly to Indian geography and water resources.",
      },
    ],
  },
  biodiversity: {
    id: "biodiversity",
    topic: "Biodiversity",
    title: "Extremophiles & Polar Marine Ecosystems",
    duration: "8 mins",
    slidesCount: 4,
    slides: [
      {
        id: 1,
        title: "Surviving at -60°C: Biological Superpowers",
        subtitle: "Anti-Freeze Proteins & Cellular Adaptations",
        bulletPoints: [
          "Antarctic notothenioid fish produce specialized Glycoprotein Anti-freeze proteins that bind to micro-ice crystals in their blood, preventing freezing.",
          "Emperor penguins conserve heat with dense double-layer plumage, fat blubber, and continuous cooperative communal huddling.",
          "Microscopic tardigrades and mosses enter cryptobiosis—drying up completely and halting metabolism until summer thaw.",
        ],
        callout: "Biological Wonder: Antarctic icefish have clear blood with zero hemoglobin; oxygen is dissolved directly into blood plasma!",
        graphicType: "comparison",
        notes: "Discuss how evolutionary pressure leads to extreme biochemical specialization.",
      },
      {
        id: 2,
        title: "The Keystone Species: Antarctic Krill",
        subtitle: "The Tiny Shrimps That Fuel the Ocean",
        bulletPoints: [
          "Euphausia superba forms enormous swarms stretching tens of kilometers that can be spotted from space.",
          "Krill serve as the sole dietary bridge transferring energy from micro-diatoms to seals, whales, and seabirds.",
          "A single blue whale consumes up to 4 tonnes of krill daily during the polar summer feeding frenzy.",
        ],
        callout: "Carbon Pump: Krill fecal pellets sink thousands of meters down, sequestering millions of tonnes of carbon to the seafloor.",
        graphicType: "diagram",
        notes: "Relate krill to the oceanic biological carbon pump.",
      },
      {
        id: 3,
        title: "Schirmacher Oasis Microbiome",
        subtitle: "The Microbial World at India's Maitri Station",
        bulletPoints: [
          "Schirmacher Oasis is an ice-free rocky plateau hosting over 100 freshwater glacial lakes.",
          "NCPOR scientists isolated novel psychrophilic (cold-loving) bacteria producing enzymes active at near-freezing temperatures.",
          "These enzymes are revolutionizing biotechnology, cold-water detergents, and pharmaceutical synthesis.",
        ],
        callout: "Discovery: Indian scientists named several new bacterial strains isolated from Priyadarshini Lake!",
        graphicType: "stats",
        notes: "Explain practical industrial applications of polar microbial research.",
      },
      {
        id: 4,
        title: "Threats: Warming, Acidification & Invasives",
        subtitle: "Conserving the World's Last Wilderness",
        bulletPoints: [
          "Ocean acidification reduces carbonate ions needed by pteropods (sea butterflies) to construct delicate calcium shells.",
          "Shifting sea-ice edges force Adelie penguins to walk further for food, starving nesting chicks.",
          "Strict Antarctic Treaty Protocols mandate sterilization of all cargo entering India's research bases to prevent invasive species.",
        ],
        callout: "Treaty Protocol: Under the Madrid Protocol, Antarctica is designated a 'natural reserve, devoted to peace and science'.",
        graphicType: "stats",
        notes: "Emphasize environmental stewardship and international law.",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. INTERACTIVE INFOGRAPHICS
// ─────────────────────────────────────────────────────────────────────────────
export const infographics: Record<string, Infographic> = {
  sea_ice: {
    id: "sea_ice",
    title: "Anatomy of Polar Sea Ice & The Albedo Engine",
    subtitle: "Interactive Cross-Section of the Polar Ocean Interface",
    topic: "Sea Ice",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
    summary: "Sea ice is not merely a frozen sheet—it is an active thermodynamic membrane that reflects solar heat, drives global oceanic conveyor belts, and hosts millions of photosynthetic algae.",
    keyInsights: [
      { label: "Reflection Ratio", value: "85%", desc: "Solar energy reflected back into space by dry snow cover" },
      { label: "Brine Drainage", value: "35 PSU", desc: "Heavy hyper-saline water sinking to create Antarctic Bottom Water" },
      { label: "Winter Expansion", value: "19M km²", desc: "Doubles the surface area of Antarctica every August-September" },
    ],
    hotspots: [
      {
        id: "h1",
        x: 25,
        y: 20,
        title: "Snow Pack Surface (Albedo Mirror)",
        description: "Fresh polar snow has an albedo of 0.80 to 0.90, reflecting nearly all visible sunlight and preventing solar heat from penetrating the ice.",
        stat: "Albedo: 0.85",
        category: "atmosphere",
      },
      {
        id: "h2",
        x: 50,
        y: 45,
        title: "Columnar Ice & Brine Pockets",
        description: "As vertical ice crystals freeze downward, saline pockets are trapped inside. Over time, heavy brine drains out through micro-tubules into the sea.",
        stat: "Salinity: 4–10 PSU",
        category: "ice",
      },
      {
        id: "h3",
        x: 75,
        y: 70,
        title: "Under-Ice Algae Habitat",
        description: "Photosynthetic diatoms flourish in the porous bottom few centimeters of ice, sustaining juvenile krill throughout the 24-hour winter darkness.",
        stat: "Chlorophyll-a: 40 mg/m³",
        category: "biology",
      },
      {
        id: "h4",
        x: 35,
        y: 85,
        title: "Antarctic Bottom Water (AABW) Injection",
        description: "Cold, dense brine sinking off the continental shelf sinks to the bottom of the world ocean, powering the global thermohaline conveyor belt.",
        stat: "Temp: -0.8°C",
        category: "ocean",
      },
    ],
  },
  ice_shelf: {
    id: "ice_shelf",
    title: "Glacial Dynamics: Ice Sheet to Deep Ocean",
    subtitle: "How Grounded Continental Ice Feeds Floating Shelves & Calves Icebergs",
    topic: "Glaciology",
    image: "https://images.unsplash.com/photo-1548232979-6c557ee14752?w=1200&q=80",
    summary: "Visualizing the journey of Antarctic precipitation from high inland domes across nunataks and grounding lines down into massive tabular icebergs.",
    keyInsights: [
      { label: "Ice Sheet Volume", value: "27M km³", desc: "Contains 70% of Earth's total fresh water supply" },
      { label: "Potential Sea Level", value: "58 meters", desc: "Total global sea level rise if all Antarctic ice melted" },
      { label: "Creep Velocity", value: "1.2 km/yr", desc: "Speed of fast-flowing outlet ice streams into the Amery Ice Shelf" },
    ],
    hotspots: [
      {
        id: "h1",
        x: 18,
        y: 25,
        title: "Inland Accumulation Dome",
        description: "At 3,000m above sea level, extreme cold prevents melting. Annual snow layers compress into blue ice, trapping ancient greenhouse gas samples.",
        stat: "Elevation: 3,200m",
        category: "ice",
      },
      {
        id: "h2",
        x: 48,
        y: 52,
        title: "The Grounding Line",
        description: "The critical boundary where the ice sheet detaches from bedrock and begins floating on seawater. Vulnerable to warm deep water intrusion.",
        stat: "Depth: 800m below sea level",
        category: "ice",
      },
      {
        id: "h3",
        x: 82,
        y: 65,
        title: "Tabular Iceberg Calving Front",
        description: "Giant rifts propagate through floating shelves under ocean swell stress, releasing flat tabular icebergs the size of small nations.",
        stat: "Thickness: 250m",
        category: "ocean",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. FLASHCARD DECKS
// ─────────────────────────────────────────────────────────────────────────────
export const flashcardDecks: Record<string, Flashcard[]> = {
  sea_ice: [
    {
      id: "fc1",
      front: "What is the key difference between Sea Ice and an Iceberg?",
      back: "Sea ice forms from freezing ocean water at sea (saline, 1–3m thick). Icebergs are chunks that broke off land-based freshwater glaciers/ice sheets (pure fresh water, hundreds of meters thick).",
      hint: "Think about where the water came from before it froze.",
      tag: "Polar Basics",
      difficulty: "Easy",
    },
    {
      id: "fc2",
      front: "Why does open ocean water absorb more solar heat than sea ice?",
      back: "Because of Albedo! Sea ice has high albedo (~0.85), reflecting 85% of solar radiation. Dark ocean water has low albedo (~0.07), absorbing 93% of the heat.",
      hint: "Which surface is lighter in color?",
      tag: "Climate Physics",
      difficulty: "Medium",
    },
    {
      id: "fc3",
      front: "What is 'Brine Rejection' and why is it important for global oceans?",
      back: "When seawater freezes, salt cannot fit in the ice crystal lattice and is pushed out into liquid brine. This ultra-dense, cold, salty water sinks to the ocean floor, driving deep global ocean currents (Antarctic Bottom Water).",
      hint: "What happens to the salt when ocean water turns to ice?",
      tag: "Oceanography",
      difficulty: "Advanced",
    },
    {
      id: "fc4",
      front: "How does Antarctic sea ice retreat in February affect global weather?",
      back: "Low sea ice reduces Earth's reflectivity, warming the Southern Ocean. This alters the southern jet stream, tropical weather patterns, and the monsoon rainfall cycle over the Indian subcontinent.",
      hint: "Remember the teleconnection to India's summer rainfall.",
      tag: "Teleconnections",
      difficulty: "Advanced",
    },
  ],
  glaciers: [
    {
      id: "fc5",
      front: "What is an Ice Core and how does it record ancient atmospheric CO2?",
      back: "A cylinder drilled from deep ice sheets. As snow compacted over millennia, tiny air bubbles were sealed in the ice. Scientists melt or crush the ice under vacuum to extract and measure ancient air samples.",
      hint: "Look inside the trapped bubbles.",
      tag: "Paleoclimate",
      difficulty: "Medium",
    },
    {
      id: "fc6",
      front: "Why is the Himalayan region referred to as the 'Third Pole'?",
      back: "The Hindu Kush Himalayas contain the largest volume of permanent ice and snow outside the Arctic and Antarctic, feeding 10 major river basins that support over 1.5 billion people.",
      hint: "Count Earth's largest ice stores.",
      tag: "Himalayan Science",
      difficulty: "Easy",
    },
    {
      id: "fc7",
      front: "What is the 'Grounding Line' of an ice sheet?",
      back: "The physical point where grounded continental ice resting on solid bedrock lifts off and begins floating as an ice shelf on the sea. It is the frontline of ice shelf stability.",
      hint: "Where land ends and ocean flotation begins.",
      tag: "Glaciology",
      difficulty: "Advanced",
    },
  ],
  biodiversity: [
    {
      id: "fc8",
      front: "How do Antarctic fish survive freezing without their blood turning to ice?",
      back: "They produce Anti-freeze Glycoproteins (AFGPs) that bind directly to microscopic ice nuclei in their bodily fluids, preventing the crystals from growing.",
      hint: "A natural biochemical antifreeze in their blood.",
      tag: "Adaptations",
      difficulty: "Medium",
    },
    {
      id: "fc9",
      front: "Why are Antarctic krill considered a 'Keystone Species'?",
      back: "Krill directly consume primary producer ice-algae and are the dominant food source for penguins, seals, squid, and baleen whales. If krill populations decline, the entire food web suffers.",
      hint: "They bridge microscopic plants to massive whales.",
      tag: "Ecology",
      difficulty: "Easy",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. AI LECTURES (VIDEO SIMULATION + TRANSCRIPT + AI DOUBT ENGINE)
// ─────────────────────────────────────────────────────────────────────────────
export const aiLectures: AILecture[] = [
  {
    id: "lec1",
    title: "50,000 Years of Climate Secrets Locked in Antarctic Ice Cores",
    speaker: "Dr. Thamban Meloth",
    role: "Director & Chief Glaciologist",
    institution: "National Centre for Polar and Ocean Research (NCPOR), Goa",
    duration: "18:42",
    videoThumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    topic: "Glaciology & Paleoclimate",
    overview: "In this keynote lecture, Dr. Meloth explains how Indian expeditions extract and analyze deep ice cores from coastal Antarctica to reconstruct past atmospheric carbon levels, volcanic eruptions, and monsoon teleconnections.",
    keyFormulasOrTakeaways: [
      "δ18O (Oxygen-18 isotope ratio) = Precise proxy for ancient polar surface temperatures",
      "Air bubble occlusion occurs at 60–100m depth under ~900 kg/m³ firn density",
      "Current atmospheric CO2 (424 ppm) is higher than any period in the last 800,000 years of ice records",
    ],
    chapters: [
      {
        time: "00:00",
        seconds: 0,
        title: "Introduction: Why Antarctica is Earth's Hard Drive",
        slideSummary: "Antarctica stores undisturbed layers of snow deposited over hundreds of thousands of years without surface melting.",
        transcriptSnippet: "Welcome students and educators. When we look at Antarctica from satellite images, we see a frozen desert. But to a glaciologist, every snowfall event is a written page in Earth's climate diary...",
      },
      {
        time: "03:45",
        seconds: 225,
        title: "The Physics of Ice Coring at -40°C",
        slideSummary: "Using hollow electromechanical drill barrels to extract 3-meter core sections from depths exceeding 1,000 meters.",
        transcriptSnippet: "Indian scientists at Maitri and Bharati use specialized electromechanical drill heads. We drill inside insulated subterranean trenches to prevent thermal shock from cracking the brittle ice cores...",
      },
      {
        time: "08:12",
        seconds: 492,
        title: "Trapping Ancient Air Bubbles",
        slideSummary: "How firn densification seals atmospheric samples from the Roman era, Bronze age, and Pleistocene.",
        transcriptSnippet: "Notice this photomicrograph. Those tiny spherical voids are literally the ancient atmosphere of Earth, sealed off from the sky when the snow turned to firn thousands of years ago...",
      },
      {
        time: "13:30",
        seconds: 810,
        title: "Teleconnections: Antarctic Ice and the Indian Monsoon",
        slideSummary: "Statistical proof connecting Southern Ocean pressure anomalies to Indian summer agricultural rainfall.",
        transcriptSnippet: "Here is the discovery our team published: when sea ice extent shifts in the Weddell and Prydz Bay sectors, it alters the Mascarene High pressure ridge, modulating monsoon moisture transport towards India...",
      },
      {
        time: "17:00",
        seconds: 1020,
        title: "Q&A and Conclusions for Future Polar Scientists",
        slideSummary: "India's ongoing ice core projects and opportunities for young students at NCPOR.",
        transcriptSnippet: "We need young researchers in physics, chemistry, biology, and computer science. The polar regions hold answers to the greatest existential climate questions of our century...",
      },
    ],
    fullTranscript: [
      { time: "00:00", speaker: "Dr. Meloth", text: "Welcome everyone. Antarctica is not an isolated wilderness—it is Earth's climate engine and ultimate hard drive." },
      { time: "01:15", speaker: "Dr. Meloth", text: "Because temperatures at the high inland polar plateau never rise above freezing, snow never melts. It accumulates layer by layer, year after year." },
      { time: "03:45", speaker: "Dr. Meloth", text: "When we drill a core down 1,000 meters, we are physically pulling up ice that fell as snow before modern human civilization existed." },
      { time: "06:20", speaker: "Dr. Meloth", text: "By measuring the ratio of heavy oxygen-18 to light oxygen-16 in water molecules, we determine the exact temperature of the atmosphere at the moment the snowflake formed." },
      { time: "09:50", speaker: "Dr. Meloth", text: "And crucially, the trapped bubbles give us the exact composition of greenhouse gases. We know with 100% mathematical certainty that current carbon levels are unprecedented." },
      { time: "14:10", speaker: "Dr. Meloth", text: "For India, this research is crucial. The polar atmosphere teleconnects directly with the Indian Summer Monsoon, determining our agricultural security." },
    ],
  },
  {
    id: "lec2",
    title: "Marine Ecology of the Southern Ocean & The Krill Engine",
    speaker: "Dr. Rahul Mohan",
    role: "Senior Marine Scientist",
    institution: "NCPOR Polar Biology Division",
    duration: "15:20",
    videoThumb: "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=800&q=80",
    topic: "Polar Marine Biology",
    overview: "Explore the extraordinary adaptations of Antarctic krill, penguins, and deep-sea cold corals, and how the biological carbon pump sequesters gigatonnes of carbon to the Southern Ocean abyssal plain.",
    keyFormulasOrTakeaways: [
      "Southern Ocean accounts for ~40% of all oceanic anthropogenic carbon uptake",
      "Krill biomass (400–500 Mt) is the largest animal biomass on Earth",
      "Ocean acidification poses immediate dissolution hazards to aragonite-shelled pteropods",
    ],
    chapters: [
      {
        time: "00:00",
        seconds: 0,
        title: "Life in Sub-Zero Waters",
        slideSummary: "How marine life thrives in liquid seawater at -1.8°C.",
        transcriptSnippet: "Most people think polar waters are barren. In reality, the Southern Ocean during summer is one of the most biologically productive marine environments on Earth...",
      },
      {
        time: "04:30",
        seconds: 270,
        title: "The Algal Under-Ice Nursery",
        slideSummary: "Diatoms embedded in sea ice provide essential lipids for the polar food web.",
        transcriptSnippet: "Underneath every square meter of first-year sea ice lies a green carpet of micro-diatoms. When the sun returns in October, this triggers a massive biological bloom...",
      },
      {
        time: "09:15",
        seconds: 555,
        title: "The Biological Carbon Pump",
        slideSummary: "How feeding krill and salps pump carbon from the surface down 4,000 meters.",
        transcriptSnippet: "When krill consume micro-algae at the surface, their dense fecal pellets sink rapidly into the deep abyss, locking carbon away for centuries...",
      },
      {
        time: "13:40",
        seconds: 820,
        title: "Safeguarding the Marine Protected Areas",
        slideSummary: "CCAMLR international treaties and India's role in Southern Ocean conservation.",
        transcriptSnippet: "Under CCAMLR, India actively advocates for science-based conservation quotas and marine protected areas across the Ross Sea and East Antarctic sectors...",
      },
    ],
    fullTranscript: [
      { time: "00:00", speaker: "Dr. Mohan", text: "Good morning students. Today we journey into the frigid depths of the Southern Ocean surrounding our Maitri and Bharati bases." },
      { time: "02:10", speaker: "Dr. Mohan", text: "The nutrient-rich upwelling waters here fuel extraordinary blooms of phytoplankton, which support the keystone species: Antarctic krill." },
      { time: "07:30", speaker: "Dr. Mohan", text: "Notice how these krill larvae utilize sea-ice crevasses to shelter from predatory Adelie penguins and petrels." },
      { time: "11:45", speaker: "Dr. Mohan", text: "Without polar sea ice, this entire food chain collapses from the bottom up. Protecting polar ice is protecting global marine life." },
    ],
  },
  {
    id: "lec3",
    title: "Engineering India's Bharati Station in Larsemann Hills",
    speaker: "Dr. K. Sharma",
    role: "Polar Architecture & Expedition Leader",
    institution: "NCPOR Engineering & Logistics Division",
    duration: "21:10",
    videoThumb: "https://images.unsplash.com/photo-1462888387064-2a2ea232edb8?w=800&q=80",
    topic: "Station Engineering & Logistics",
    overview: "Discover how India designed and erected Bharati—one of the world's most modern, eco-friendly polar research stations—using 134 prefabricated shipping containers built on stilts to withstand 300 km/h blizzards.",
    keyFormulasOrTakeaways: [
      "Aerodynamic elevated stilt design prevents snowdrift accumulation around foundation",
      "Combined Heat and Power (CHP) cogeneration plant achieves >85% thermal efficiency",
      "Zero-effluent discharge: gray and black water treated through biological membrane bioreactors",
    ],
    chapters: [
      {
        time: "00:00",
        seconds: 0,
        title: "The Vision for a Third Antarctic Base",
        slideSummary: "Why India expanded from Schirmacher Oasis to the rugged Larsemann Hills.",
        transcriptSnippet: "In 2010, India embarked on an ambitious engineering feat: establishing Bharati Station at 69°S on a rocky promontory overlooking Prydz Bay...",
      },
      {
        time: "05:15",
        seconds: 315,
        title: "Modular Containerized Architecture",
        slideSummary: "134 prefabricated containers wrapped in insulated aluminum composite panels.",
        transcriptSnippet: "Because our construction window in Antarctic summer is barely 100 days, everything had to be pre-engineered, trial-assembled in Germany, shipped via ice-class vessels, and erected like giant Lego blocks...",
      },
      {
        time: "11:30",
        seconds: 690,
        title: "Withstanding Katabatic Gale Winds",
        slideSummary: "Aerodynamic wind tunnel modeling to withstand 320 km/h wind gusts.",
        transcriptSnippet: "Katabatic winds accelerate down continental ice slopes like a locomotive. By elevating the station 4 meters on steel pilings, wind passes underneath, blowing snow away rather than burying the building...",
      },
      {
        time: "17:40",
        seconds: 1060,
        title: "Life Support & Satellite Telemetry",
        slideSummary: "High-speed satellite connectivity transmitting earth-observation data to Hyderabad in real-time.",
        transcriptSnippet: "Bharati is a crucial ground station for ISRO's IRS remote sensing satellites. Raw satellite passes are ingested and beamed in near-real-time to NRSC in India...",
      },
    ],
    fullTranscript: [
      { time: "00:00", speaker: "Dr. Sharma", text: "Welcome students. Surviving in Antarctica is purely an engineering problem. At -40°C with winds over 200 km/h, human life depends 100% on technology." },
      { time: "04:30", speaker: "Dr. Sharma", text: "Bharati Station is wrapped in high-grade marine aluminum to withstand both saline ocean spray and scouring ice crystals." },
      { time: "10:15", speaker: "Dr. Sharma", text: "Notice the curved aerodynamic prow of the main building. Just like an airplane wing in reverse, it deflects violent storms over the roof." },
      { time: "16:00", speaker: "Dr. Sharma", text: "Our water purification systems recycle 95% of water, ensuring zero environmental contamination under the Antarctic Treaty Madrid Protocol." },
    ],
  },
  {
    id: "lec4",
    title: "Atmospheric Physics & The Ozone Recovery Story over Maitri",
    speaker: "Dr. S. Iyer",
    role: "Senior Atmospheric Scientist",
    institution: "Indian Institute of Geomagnetism & NCPOR",
    duration: "14:35",
    videoThumb: "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800&q=80",
    topic: "Atmospheric Science & Ozone",
    overview: "Explore the physics of the Antarctic Polar Vortex, stratospheric ozone depletion, and how NCPOR's regular ozonesonde balloon launches from Maitri verify the historic recovery of the global ozone layer.",
    keyFormulasOrTakeaways: [
      "1 Dobson Unit (DU) = 0.01 mm pure ozone thickness at STP",
      "Polar Stratospheric Clouds (PSCs) form only below -78°C in winter vortex",
      "Montreal Protocol (1987) phaseout of CFCs is driving full Antarctic ozone layer recovery by ~2066",
    ],
    chapters: [
      {
        time: "00:00",
        seconds: 0,
        title: "The Discovery of the Polar Ozone Hole",
        slideSummary: "How British and Indian scientists first detected stratospheric ozone loss in 1985.",
        transcriptSnippet: "In the 1980s, instruments at Halley and India's Dakshin Gangotri detected an alarming drop in spring ozone levels over Antarctica...",
      },
      {
        time: "04:10",
        seconds: 250,
        title: "The Chemistry of Polar Stratospheric Clouds",
        slideSummary: "Heterogeneous chlorine activation on nitric acid trihydrate crystals.",
        transcriptSnippet: "During the pitch-black polar winter, temperatures inside the vortex drop below -80°C. This allows beautiful, iridescent nacreous clouds to form...",
      },
      {
        time: "08:50",
        seconds: 530,
        title: "Launching Ozonesondes from Maitri",
        slideSummary: "Hydrogen weather balloon launches reaching 35 km altitude.",
        transcriptSnippet: "Every week at Maitri, our atmospheric physics team releases specialized electrochemical ozonesonde balloons. As the balloon ascends through the stratosphere, it transmits real-time partial pressure of ozone...",
      },
      {
        time: "12:15",
        seconds: 735,
        title: "A Triumph of Global Science & Policy",
        slideSummary: "Evidence that international environmental treaties actually succeed.",
        transcriptSnippet: "The ozone story is the greatest environmental success story in human history. It proves that when science leads policy, humanity can repair planetary damage...",
      },
    ],
    fullTranscript: [
      { time: "00:00", speaker: "Dr. Iyer", text: "Hello young scientists. The ozone layer is our planet's sunscreen. Without it, high-energy UV-B radiation would sterilize surface life on Earth." },
      { time: "03:40", speaker: "Dr. Iyer", text: "When chlorofluorocarbons or CFCs from old refrigerators were released, they drifted into the Antarctic polar vortex, releasing reactive chlorine atoms." },
      { time: "08:15", speaker: "Dr. Iyer", text: "A single chlorine free radical can destroy over 100,000 ozone molecules through catalytic chain reactions." },
      { time: "11:50", speaker: "Dr. Iyer", text: "Thanks to our weekly data from Maitri, we can confirm the ozone hole is closing. By 2066, the polar ozone layer will return to 1980 levels!" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. TEACHER RESOURCES & CURRICULUM ALIGNMENT PACKS
// ─────────────────────────────────────────────────────────────────────────────
export const teacherActivities: TeacherActivity[] = [
  {
    id: "act1",
    title: "Lab Simulation: Sea-Ice Albedo & Ocean Heat Absorption",
    gradeLevel: "Grades 7–10 (Science / Physics / Earth Science)",
    duration: "45 mins",
    learningObjective: "Demonstrate experimentally how surface color and reflectance (albedo) control temperature rise in water bodies.",
    materials: [
      "Two identical clear glass bowls filled with 500ml cold water",
      "One sheet of clean white foam/styrofoam (representing sea ice)",
      "Two digital thermometers or standard lab thermometers",
      "One 100W incandescent lamp or direct sunlight",
      "Student observation recording sheet",
    ],
    stepByStep: [
      "Fill both bowls with equal amounts of water at the exact same starting temperature (~15°C).",
      "Float the white reflective foam over Bowl A (simulating sea ice cover). Leave Bowl B uncovered (simulating open dark ocean).",
      "Position the lamp 30cm above both bowls equidistant from the centers.",
      "Record water temperature every 3 minutes for 30 minutes in the lab table.",
      "Graph Temperature (°C) vs Time (minutes) for both conditions.",
    ],
    expectedResult: "Bowl B (open water) will heat up 3x to 5x faster than Bowl A (ice-covered) because water absorbs 93% of radiation while the white cover reflects the heat.",
    ncertAlignment: "NCERT Class 7 Science: Chapter on Heat & Light; Class 9 Science: Natural Resources & Climate.",
  },
  {
    id: "act2",
    title: "Ice Core Salinity & Brine Rejection Lab",
    gradeLevel: "Grades 8–12 (Chemistry / Environmental Science)",
    duration: "60 mins",
    learningObjective: "Observe how salt is excluded during crystallization of seawater, creating freshwater ice and dense brine.",
    materials: [
      "Plastic graduated cylinder or clear 500ml bottle",
      "Water mixed with 35g table salt per liter (simulated seawater) with 2 drops of blue food coloring",
      "Home or school freezer (-15°C)",
      "Hydrometer or refractometer (optional) or mass balance to measure density",
    ],
    stepByStep: [
      "Fill cylinder with colored saltwater and place in freezer upright for 6–8 hours until half-frozen.",
      "Remove cylinder and examine the ice block at the top versus the liquid at the bottom.",
      "Melt a piece of the top ice and taste or test its salinity; measure density of the remaining liquid underneath.",
    ],
    expectedResult: "The ice block is clear/pale blue with very low salinity (~4 PSU), while the liquid brine at the bottom is dark blue, hyper-saline (>55 PSU) and significantly denser.",
    ncertAlignment: "NCERT Class 9 Chemistry: Solutions & Separation Techniques; Class 11 Geography: Ocean Water Salinity & Density.",
  },
  {
    id: "act3",
    title: "Antarctic Food Web & Krill Trophic Cascade Simulation",
    gradeLevel: "Grades 6–9 (Biology / Ecology)",
    duration: "40 mins",
    learningObjective: "Model how changes in sea ice extent propagate up trophic levels from diatoms to apex predators.",
    materials: [
      "Colored cards representing Diatoms (green), Krill (orange), Fish (silver), Penguins (black), Whales (blue)",
      "Ball of yarn to trace feeding connections",
      "Classroom roleplay instructions",
    ],
    stepByStep: [
      "Assign each student an organism card. Sit in a circle.",
      "Connect dependent feeding relationships using the yarn (e.g. Diatom holds yarn and throws to Krill).",
      "Introduce a 'Climate Perturbation Event': 30% reduction in winter sea ice.",
      "Remove 3 out of 5 Diatom students; have them gently tug the yarn. Any organism that feels the slack must stand up.",
    ],
    expectedResult: "Students visually and physically experience how a change at the base of the food web immediately impacts whales and penguins.",
    ncertAlignment: "NCERT Class 8 Science: Conservation of Plants & Animals; Class 10 Biology: Our Environment & Food Webs.",
  },
];

export const curriculumGuides: CurriculumGuideItem[] = [
  {
    grade: "Grades 6–8 (Middle School)",
    theme: "Polar Geography, Ice Types & Antarctic Explorations",
    ncertChapterRef: "Social Science: The Earth Our Habitat; Science: Motion and Measurement",
    learningOutcomes: [
      "Identify the Arctic Ocean (frozen sea) vs Antarctica (continent covered in ice)",
      "Locate India's Dakshin Gangotri, Maitri, Bharati, and Himadri research stations on a polar projection map",
      "Differentiate between icebergs, sea ice, and continental glaciers",
    ],
    ncporPublicationsRef: "NCPOR Technical Reports, Vol 42–46 (Field Station Operations)",
    hours: 8,
  },
  {
    grade: "Grades 9–10 (Secondary)",
    theme: "Thermodynamics, Climate Feedback Loops & Extreme Ecosystems",
    ncertChapterRef: "Class 9 Science: Climate; Class 10 Science: Heredity and Evolution & Natural Resources",
    learningOutcomes: [
      "Calculate albedo reflectance percentages and explain positive feedback mechanisms",
      "Analyze adaptations: anti-freeze glycoproteins, blubber insulation, and cryptobiosis",
      "Explain the Antarctic Treaty System and environmental protocols for peaceful scientific research",
    ],
    ncporPublicationsRef: "Journal of Glaciology (2024), Sea-Ice Dynamics (Sharma et al.)",
    hours: 12,
  },
  {
    grade: "Grades 11–12 (Higher Secondary)",
    theme: "Paleoclimatology, Ocean Biogeochemistry & Teleconnections",
    ncertChapterRef: "Class 11 Geography: Oceans & Atmosphere; Class 12 Physics & Chemistry: Thermodynamics & Nuclear Isotopes",
    learningOutcomes: [
      "Interpret ice core δ18O paleotemperature records and trapped greenhouse gas concentrations",
      "Model Antarctic Bottom Water formation and thermohaline ocean circulation",
      "Analyze atmospheric teleconnections linking the Southern Ocean to the Indian Summer Monsoon",
    ],
    ncporPublicationsRef: "Geophysical Research Letters (2023), Indian Arctic Atmosphere (Verma et al.)",
    hours: 16,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. SMART STUDENT AI DOUBT ENGINE (ACCURATE POLAR RESPONSES)
// ─────────────────────────────────────────────────────────────────────────────
export const studentAiAnswers: Record<string, string> = {
  "what is sea ice?":
    " **Sea ice** is simply frozen ocean water! Unlike glaciers or icebergs (which form on land from centuries of compacted snowfall and are made of pure freshwater), sea ice forms, grows, and melts entirely in the open sea.\n\nBecause seawater contains salt, it doesn't freeze at 0°C (32°F)—it freezes at **-1.8°C (28.8°F)**. As it freezes, the salt is pushed out into deep cold ocean currents, leaving behind ice that is mostly fresh. Sea ice acts like a massive white sunshield for Earth, reflecting 85% of solar heat back into space!",

  "why is antarctica cold?":
    " Antarctica is the coldest, windiest, and driest continent on Earth for three major scientific reasons:\n\n1. **High Elevation:** Antarctica is the highest continent on Earth, with an average elevation over 2,500 meters (8,200 ft). The higher you climb, the colder the air gets!\n2. **Extreme High Albedo:** Antarctica is covered by a massive white ice sheet that reflects nearly 90% of all incoming solar radiation.\n3. **Polar Isolation (The Antarctic Circumpolar Current):** Unlike the Arctic (which is surrounded by warm continents), Antarctica is isolated in the Southern Ocean by fierce westerly winds and the world's strongest ocean current, blocking warm equatorial heat from reaching it.",

  "what do polar scientists do?":
    " Indian scientists at NCPOR's stations (**Maitri** and **Bharati** in Antarctica, and **Himadri** in the Arctic) conduct cutting-edge research across many fields:\n\n- **Glaciologists** drill deep ice cores to read ancient climate history from thousands of years ago.\n- **Meteorologists** launch weather balloons into the polar stratosphere to track ozone recovery and polar vortex winds.\n- **Marine Biologists** study how tiny krill and deep-sea organisms survive sub-zero temperatures using natural anti-freeze proteins.\n- **Geophysicists** monitor Earth's magnetic field and cosmic rays, which enter near the magnetic poles.",

  "what animals live in antarctica?":
    "EXP Antarctica is surrounded by rich marine life, but very few animals live permanently on the frozen inland ice sheet:\n\n- **Penguins:** Emperor penguins (who nest during the brutal winter) and Adelie penguins (who nest on coastal rocks in summer).\n- **Seals:** Weddell seals (who can dive over 600m deep!), Crabeater seals, and predatory Leopard seals.\n- **Whales:** Blue whales, Humpback whales, and Orcas that feed on dense swarms of Antarctic krill during summer.\n- **Land Wildlife:** The largest purely terrestrial animal living on mainland Antarctica year-round is the **Belgica antarctica**—a tiny wingless midge only 6mm long!",

  "how do ice cores tell the past?":
    " Think of ice sheets like a giant climate tree ring! Every single year, a new layer of snow falls in Antarctica without ever melting. As more snow piles on top, the bottom layers get squeezed into dense blue ice.\n\nInside that ice, **tiny bubbles of ancient air** get trapped forever. When scientists drill an ice core and crush it under vacuum, they release and breathe air that was trapped during the time of the Egyptian pharaohs or ice age mammoths! By measuring the gases, they can calculate the exact temperature and CO2 levels of that year.",

  "what is the difference between arctic and antarctic?":
    " The easiest way to remember:\n\n- **The Arctic is a frozen ocean surrounded by continents** (North America, Europe, Asia). It has polar bears, indigenous human communities (Inuit), and land-based vegetation in summer.\n- **Antarctica is a frozen continent surrounded by ocean**. It has no native human population, no land mammals, but is home to millions of penguins and massive floating ice shelves.",
};

export function getStudentAIResponse(query: string): string {
  const clean = query.trim().toLowerCase().replace(/[?!.,]/g, "");
  for (const [key, answer] of Object.entries(studentAiAnswers)) {
    if (clean.includes(key) || key.includes(clean)) {
      return answer;
    }
  }

  // Fallback intelligent response generator grounded in NCPOR science
  if (clean.includes("ozone") || clean.includes("hole")) {
    return " **The Antarctic Ozone Layer:** The ozone layer high in the stratosphere absorbs harmful ultraviolet (UV) radiation from the Sun. In polar winter, extreme cold (-80°C) creates Polar Stratospheric Clouds (PSCs), which accelerate chemical reactions involving chlorofluorocarbons (CFCs). Thanks to the global Montreal Protocol treaty banning CFCs, NCPOR atmospheric monitors confirm the ozone hole is now steadily healing!";
  }
  if (clean.includes("penguin") || clean.includes("krill")) {
    return "EXP **Polar Food Web:** In the Southern Ocean, the entire ecosystem revolves around Antarctic Krill (*Euphausia superba*). Krill graze on algae under the sea ice and form swarms so massive they can be seen from space! Penguins, seals, and giant baleen whales rely on krill for their survival.";
  }
  return ` **Polar Science Insight:** Great question about "${query}"! According to NCPOR research publications and observational telemetry, high-latitude polar dynamics play an indispensable role in moderating global climate, reflecting solar energy via the albedo effect, and powering global deep ocean currents. You can explore our interactive Slide Decks and Flashcards in this module to discover more about this phenomenon!`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. UNIFIED LMS (PHYSICSWALLAH / GATEWALLAH STYLE LMS COURSES)
// ─────────────────────────────────────────────────────────────────────────────
export interface LMSLesson {
  id: string;
  lessonNumber: number;
  title: string;
  date?: string;
  duration: string;
  speaker: string;
  role: string;
  institution: string;
  videoThumb: string;
  summary: string;
  chapters: LectureChapter[];
  fullTranscript: { time: string; speaker: string; text: string }[];
  keyFormulas: string[];
  slideDeck: SlideItem[];
  infographic?: Infographic;
  dppCards: Flashcard[];
  quizQuestions: { q: string; options: string[]; correct: number; explanation: string }[];
  commonDoubts: { q: string; a: string; time: string }[];
}

export interface LMSChapter {
  id: string;
  title: string;
  lecturesCount: number;
  notesCount: number;
  dppCount: number;
  exercisesCount: number;
  progressPct?: number;
  lectures: LMSLesson[];
}

export interface LMSSubject {
  id: string;
  title: string;
  icon: string;
  iconType?: "notices" | "server" | "glacier" | "science";
  chaptersCount: number;
  lecturesCount: number;
  isNotice?: boolean;
  chapters: LMSChapter[];
}

export interface LMSCourse {
  id: string;
  title: string;
  code: string;
  faculty: string;
  badge: string;
  category?: string;
  startDate?: string;
  targetAudience?: string;
  bannerImage?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  totalLectures: number;
  totalHours: string;
  subjects?: LMSSubject[];
  lessons: LMSLesson[];
}

export const lmsCourses: LMSCourse[] = [
  {
    id: "course-glaciology",
    title: "Antarctic Cryosphere & Paleoclimate Masterclass",
    code: "NCPOR-GLAC-101",
    faculty: "Dr. Thamban Meloth & Senior Glaciology Faculty",
    badge: "Flagship Masterclass",
    category: "Glaciology & Cryosphere",
    startDate: "15 Aug 2025",
    targetAudience: "For Polar Science, Glaciology & Climate Research Fellows",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    level: "Advanced",
    totalLectures: 32,
    totalHours: "48 hours",
    subjects: [
      {
        id: "subj-glac-notices",
        title: "Notices & Bulletins",
        icon: "",
        iconType: "notices",
        chaptersCount: 0,
        lecturesCount: 0,
        isNotice: true,
        chapters: [],
      },
      {
        id: "subj-glac-icecores",
        title: "Ice Core Climatology & Deep Ice Drilling",
        icon: "",
        iconType: "ice",
        chaptersCount: 4,
        lecturesCount: 20,
        isNotice: false,
        chapters: [
          {
            id: "chap-glac-icecores",
            title: "Deep Ice Cores & Paleothermometry",
            lecturesCount: 5,
            notesCount: 20,
            dppCount: 5,
            exercisesCount: 5,
            progressPct: 20,
            lectures: [
              {
                id: "l1-ice-cores",
                lessonNumber: 1,
                title: "Antarctic Cryosphere 01 : 50,000 Years of Climate Secrets in Antarctic Ice Cores",
                date: "15 Aug 2025",
                duration: "18:42",
                speaker: "Dr. Thamban Meloth",
                role: "Director & Chief Glaciologist",
                institution: "NCPOR, Goa",
                videoThumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
                summary: "Detailed physical breakdown of electromechanical ice coring, firn air occlusion, oxygen-18 paleothermometry, and monsoon teleconnections.",
                chapters: aiLectures[0].chapters,
                fullTranscript: aiLectures[0].fullTranscript,
                keyFormulas: [
                  "δ18O (‰) = [(18O/16O)sample / (18O/16O)SMOW - 1] × 1000",
                  "Firn densification threshold: ρ = 830 kg/m³ (pore close-off depth ~70m)",
                  "Modern Atmospheric CO2: 424 ppm (highest in >800,000 years of ice records)",
                ],
                slideDeck: slideDecks.glaciers.slides,
                infographic: infographics.ice_shelf,
                dppCards: flashcardDecks.glaciers,
                quizQuestions: [
                  {
                    q: "How do ice cores preserve historical samples of Earth's atmosphere?",
                    options: [
                      "Chemical crystallization of carbon into ice lattice",
                      "Trapping microscopic air bubbles between compacted snowflakes",
                      "Dissolving gas directly into deep subglacial lakes",
                      "Surface snow sublimation",
                    ],
                    correct: 1,
                    explanation: "As annual snow piles up, pressure seals microscopic spherical bubbles of atmospheric air permanently inside dense blue ice.",
                  },
                  {
                    q: "Which isotopic ratio is the primary proxy used by NCPOR to reconstruct past temperature?",
                    options: [
                      "Carbon-14 to Carbon-12",
                      "Oxygen-18 to Oxygen-16 (δ18O)",
                      "Uranium-238 to Lead-206",
                      "Helium-3 to Helium-4",
                    ],
                    correct: 1,
                    explanation: "Heavier 18O isotopes require more thermal energy to evaporate; lower δ18O values directly signify colder polar epochs.",
                  },
                ],
                commonDoubts: [
                  {
                    q: "Why do we drill ice cores in Antarctica instead of the Himalayas for ancient records?",
                    a: "Because Himalayan glaciers experience summer surface melting that washes away air bubbles. The high Antarctic plateau stays below -30°C year-round, preserving an undisturbed continuous 800,000-year record.",
                    time: "03:45",
                  },
                  {
                    q: "What depth do we have to drill before bubbles seal?",
                    a: "Typically 60 to 100 meters below the surface. This transition layer is called the 'firn-ice transition' where density reaches ~830 kg/m³.",
                    time: "08:12",
                  },
                ],
              },
              {
                id: "l2-grounding-line",
                lessonNumber: 2,
                title: "Antarctic Cryosphere 02 : Ice Sheet Flow Dynamics, Glen's Flow Law & Grounding Line Retreat",
                date: "17 Aug 2025",
                duration: "14:15",
                speaker: "Dr. A. Verma",
                role: "Senior Glaciology Scientist",
                institution: "NCPOR Cryosphere Division",
                videoThumb: "https://images.unsplash.com/photo-1548232979-6c557ee14752?w=800&q=80",
                summary: "Understanding the Marine Ice Sheet Instability (MISI) hypothesis, grounding line retreat, and satellite interferometry.",
                chapters: [
                  { time: "00:00", seconds: 0, title: "Anatomy of the Grounding Line", slideSummary: "Where bedrock contact ends and ocean buoyancy begins.", transcriptSnippet: "The grounding line is the physical hinge of the entire Antarctic ice sheet..." },
                  { time: "05:10", seconds: 310, title: "Warm Circumpolar Deep Water Intrusion", slideSummary: "How +1°C water melts ice shelf cavities from underneath.", transcriptSnippet: "Deep ocean currents are funneling warm saline water directly into sub-ice shelf cavities..." },
                  { time: "10:30", seconds: 630, title: "Buttressing Effect of Tabular Shelves", slideSummary: "Why ice shelves act as safety dams.", transcriptSnippet: "Without ice shelves, inland ice streams accelerate 300% faster into the sea..." },
                ],
                fullTranscript: [
                  { time: "00:00", speaker: "Dr. Verma", text: "Today we inspect the most critical structural feature in glaciology: the grounding line." },
                  { time: "06:00", speaker: "Dr. Verma", text: "When warm water thins an ice shelf from below, the grounding line retreats inland onto retrograde bedrock." },
                ],
                keyFormulas: [
                  "Glen's Flow Law: ε̇ = A · τⁿ (where n ≈ 3 for ice creep)",
                  "Hydrostatic flotation: h_ice · ρ_ice = h_water · ρ_seawater",
                ],
                slideDeck: slideDecks.glaciers.slides,
                infographic: infographics.ice_shelf,
                dppCards: flashcardDecks.glaciers,
                quizQuestions: [
                  {
                    q: "What is the primary factor that makes a marine-grounded ice sheet vulnerable to runaway retreat?",
                    options: [
                      "Retrograde bedrock sloping downward toward the continent interior",
                      "Low surface snowfall",
                      "Cold winter winds",
                      "Crustal earthquakes",
                    ],
                    correct: 0,
                    explanation: "Retrograde bed slopes cause the ice thickness at the grounding line to increase as it retreats, accelerating discharge.",
                  },
                ],
                commonDoubts: [
                  {
                    q: "How does NCPOR measure grounding line movement?",
                    a: "We use satellite Synthetic Aperture Radar Interferometry (InSAR) which measures tidal bending of the ice down to millimeter accuracy.",
                    time: "02:20",
                  },
                ],
              },
              {
                id: "l3-third-pole",
                lessonNumber: 3,
                title: "Antarctic Cryosphere 03 : The Third Pole: Himalayan Glaciers & Chandra-Bhaga Mass Balance",
                date: "20 Aug 2025",
                duration: "15:10",
                speaker: "Dr. Thamban Meloth",
                role: "Lead Glaciologist",
                institution: "Himansh Station, Spiti / NCPOR",
                videoThumb: "https://images.unsplash.com/photo-1462888387064-2a2ea232edb8?w=800&q=80",
                summary: "NCPOR field operations at Himansh Observatory (4,080m) tracking glacier mass balance of Chandra and Bhaga basins.",
                chapters: [
                  { time: "00:00", seconds: 0, title: "Why the Himalayas are the 'Third Pole'", slideSummary: "Stores the largest volume of permanent ice outside polar regions.", transcriptSnippet: "Over 1.5 billion people depend on Himalayan meltwater streams..." },
                  { time: "06:40", seconds: 400, title: "Measuring Glacier Mass Balance at Himansh", slideSummary: "Ablation stakes, ground penetrating radar, and automatic weather stations.", transcriptSnippet: "Every summer, our expedition team measures snow stakes across Chhota Shigri glacier..." },
                ],
                fullTranscript: [
                  { time: "00:00", speaker: "Dr. Meloth", text: "India's glaciological mission connects Antarctica directly to our own Himalayas." },
                ],
                keyFormulas: [
                  "Mass Balance: Bn = c (accumulation) - a (ablation)",
                  "Equilibrium Line Altitude (ELA): elevation where net accumulation equals zero",
                ],
                slideDeck: slideDecks.glaciers.slides,
                infographic: infographics.ice_shelf,
                dppCards: flashcardDecks.glaciers,
                quizQuestions: [
                  {
                    q: "What is India's high-altitude research station in the Himalayas operated by NCPOR?",
                    options: ["Maitri", "Bharati", "Himansh", "Himadri"],
                    correct: 2,
                    explanation: "Himansh Station is located at 4,080m in Spiti Valley, Himachal Pradesh, dedicated to Himalayan glacier monitoring.",
                  },
                ],
                commonDoubts: [
                  {
                    q: "What is the difference between Himadri and Himansh?",
                    a: "Himadri is India's Arctic station located in Svalbard, Norway. Himansh is India's Himalayan research station located in Spiti Valley, Himachal Pradesh.",
                    time: "01:10",
                  },
                ],
              },
              {
                id: "l4-firn-gas",
                lessonNumber: 4,
                title: "Antarctic Cryosphere 04 : Firn Air Occlusion & Atmospheric Greenhouse Gas Reconstructions",
                date: "22 Aug 2025",
                duration: "16:30",
                speaker: "Dr. Manish Tiwari",
                role: "Senior Paleoclimatologist",
                institution: "NCPOR Paleoclimate Lab",
                videoThumb: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
                summary: "Micro-porous diffusion, gravitational settling, and Δage delta corrections between ice matrix and trapped gas phase.",
                chapters: [
                  { time: "00:00", seconds: 0, title: "The Firn Porosity Gradient", slideSummary: "From freshly deposited snow (300 kg/m³) to impermeable ice (830 kg/m³).", transcriptSnippet: "Air can freely circulate in the top firn layer before it is permanently sealed..." },
                  { time: "08:15", seconds: 495, title: "Gravitational Fractionation Correction", slideSummary: "Heavy isotopes settling downwards under gravity in stagnant firn air columns.", transcriptSnippet: "We correct measured 15N/14N and 40Ar/36Ar ratios to remove barometric fractionation..." },
                ],
                fullTranscript: [
                  { time: "00:00", speaker: "Dr. Tiwari", text: "Today we discover how firn acts as a physical filter before sealing the paleoclimate record." },
                ],
                keyFormulas: [
                  "Δage = Age(ice) - Age(gas) at the lock-in depth",
                  "Gravitational enrichment: δ = (Δm · g · z) / (R · T)",
                ],
                slideDeck: slideDecks.glaciers.slides,
                infographic: infographics.ice_shelf,
                dppCards: flashcardDecks.glaciers,
                quizQuestions: [
                  {
                    q: "Why is the gas in an ice core younger than the surrounding ice matrix at the same depth?",
                    options: [
                      "Gas travels through cracks after freezing",
                      "Air circulates freely in the porous firn before bubble close-off",
                      "Microbes create new gas underground",
                      "Gas is heated by geothermal heat",
                    ],
                    correct: 1,
                    explanation: "Snow takes decades to centuries to compact into solid ice, during which air diffuses freely from the surface down to ~70m.",
                  },
                ],
                commonDoubts: [
                  {
                    q: "What is Δage in ice core research?",
                    a: "Δage is the age difference between the ice matrix and the trapped gas bubbles at that exact depth. In cold, low-snowfall regions like Dome C, Δage can exceed 2,000 years!",
                    time: "04:15",
                  },
                ],
              },
              {
                id: "l5-insar-grav",
                lessonNumber: 5,
                title: "Antarctic Cryosphere 05 : Satellite InSAR Radar & CryoSat-2 Ice Mass Balance",
                date: "25 Aug 2025",
                duration: "19:05",
                speaker: "Dr. Shridhar Jawak",
                role: "Remote Sensing Specialist",
                institution: "NCPOR Geo-Informatics",
                videoThumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
                summary: "Combining Synthetic Aperture Radar Interferometry with GRACE gravity recovery to quantify Antarctic mass loss in Gigatonnes per year.",
                chapters: [
                  { time: "00:00", seconds: 0, title: "Altimetry vs Gravimetry Comparison", slideSummary: "Surface height changes (CryoSat-2) vs direct mass changes (GRACE-FO).", transcriptSnippet: "Satellite radar altimetry measures ice surface elevation change dh/dt..." },
                  { time: "09:40", seconds: 580, title: "Pine Island & Thwaites Acceleration", slideSummary: "Amundsen Sea Embayment ice loss velocities mapped by radar interferometry.", transcriptSnippet: "Sentinel-1 radar tracks crevasse propagation and ice stream acceleration up to 4 km/year..." },
                ],
                fullTranscript: [
                  { time: "00:00", speaker: "Dr. Jawak", text: "Welcome. Today we quantify continental ice sheet loss using spaceborne sensors." },
                ],
                keyFormulas: [
                  "Mass Rate: dM/dt = ρ_ice · ∫ (dh/dt) dA - GIA_correction",
                  "1 Gigatonne (Gt) of ice = 1 cubic kilometer of fresh water",
                ],
                slideDeck: slideDecks.glaciers.slides,
                infographic: infographics.ice_shelf,
                dppCards: flashcardDecks.glaciers,
                quizQuestions: [
                  {
                    q: "Which satellite mission measures ice sheet mass loss directly via gravitational perturbations?",
                    options: ["CryoSat-2", "GRACE / GRACE-FO", "Landsat 9", "MODIS Terra"],
                    correct: 1,
                    explanation: "GRACE twin satellites measure minute variations in distance caused by gravity changes as ice mass melts into the ocean.",
                  },
                ],
                commonDoubts: [
                  {
                    q: "What is Glacial Isostatic Adjustment (GIA)?",
                    a: "GIA is the ongoing rebound of the Earth's solid crust as the weight of ancient ice sheets is removed. We must subtract GIA from satellite gravity data to isolate actual ice loss.",
                    time: "06:10",
                  },
                ],
              },
            ],
          },
          {
            id: "chap-glac-firn",
            title: "Firn Densification & Gas Occlusion",
            lecturesCount: 4,
            notesCount: 16,
            dppCount: 4,
            exercisesCount: 4,
            progressPct: 0,
            lectures: [],
          },
          {
            id: "chap-glac-subglacial",
            title: "Subglacial Lakes & Ice Dynamics",
            lecturesCount: 6,
            notesCount: 22,
            dppCount: 6,
            exercisesCount: 6,
            progressPct: 0,
            lectures: [],
          },
          {
            id: "chap-glac-pyq",
            title: "Research Questions & Expedition Case Studies",
            lecturesCount: 5,
            notesCount: 15,
            dppCount: 5,
            exercisesCount: 5,
            progressPct: 0,
            lectures: [],
          },
        ],
      },
      {
        id: "subj-glac-dynamics",
        title: "Glacier Dynamics & Ice Shelf Mechanics",
        icon: "",
        iconType: "glacier",
        chaptersCount: 3,
        lecturesCount: 12,
        isNotice: false,
        chapters: [
          {
            id: "chap-glac-misi",
            title: "Marine Ice Sheet Instability (MISI)",
            lecturesCount: 4,
            notesCount: 12,
            dppCount: 4,
            exercisesCount: 4,
            progressPct: 0,
            lectures: [],
          },
          {
            id: "chap-glac-cavity",
            title: "Sub-Ice Shelf Cavity Oceanography",
            lecturesCount: 4,
            notesCount: 14,
            dppCount: 4,
            exercisesCount: 4,
            progressPct: 0,
            lectures: [],
          },
          {
            id: "chap-glac-calving",
            title: "Calving Front Mechanics & Cleaving Dynamics",
            lecturesCount: 4,
            notesCount: 10,
            dppCount: 4,
            exercisesCount: 4,
            progressPct: 0,
            lectures: [],
          },
        ],
      },
    ],
    lessons: [
      {
        id: "l1-ice-cores",
        lessonNumber: 1,
        title: "Antarctic Cryosphere 01 : 50,000 Years of Climate Secrets in Antarctic Ice Cores",
        duration: "18:42",
        speaker: "Dr. Thamban Meloth",
        role: "Director & Chief Glaciologist",
        institution: "NCPOR, Goa",
        videoThumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
        summary: "Detailed physical breakdown of electromechanical ice coring, firn air occlusion, oxygen-18 paleothermometry, and monsoon teleconnections.",
        chapters: aiLectures[0].chapters,
        fullTranscript: aiLectures[0].fullTranscript,
        keyFormulas: [
          "δ18O (‰) = [(18O/16O)sample / (18O/16O)SMOW - 1] × 1000",
          "Firn densification threshold: ρ = 830 kg/m³ (pore close-off depth ~70m)",
          "Modern Atmospheric CO2: 424 ppm (highest in >800,000 years of ice records)",
        ],
        slideDeck: slideDecks.glaciers.slides,
        infographic: infographics.ice_shelf,
        dppCards: flashcardDecks.glaciers,
        quizQuestions: [
          {
            q: "How do ice cores preserve historical samples of Earth's atmosphere?",
            options: [
              "Chemical crystallization of carbon into ice lattice",
              "Trapping microscopic air bubbles between compacted snowflakes",
              "Dissolving gas directly into deep subglacial lakes",
              "Surface snow sublimation",
            ],
            correct: 1,
            explanation: "As annual snow piles up, pressure seals microscopic spherical bubbles of atmospheric air permanently inside dense blue ice.",
          },
          {
            q: "Which isotopic ratio is the primary proxy used by NCPOR to reconstruct past temperature?",
            options: [
              "Carbon-14 to Carbon-12",
              "Oxygen-18 to Oxygen-16 (δ18O)",
              "Uranium-238 to Lead-206",
              "Helium-3 to Helium-4",
            ],
            correct: 1,
            explanation: "Heavier 18O isotopes require more thermal energy to evaporate; lower δ18O values directly signify colder polar epochs.",
          },
        ],
        commonDoubts: [
          {
            q: "Why do we drill ice cores in Antarctica instead of the Himalayas for ancient records?",
            a: "Because Himalayan glaciers experience summer surface melting that washes away air bubbles. The high Antarctic plateau stays below -30°C year-round, preserving an undisturbed continuous 800,000-year record.",
            time: "03:45",
          },
        ],
      },
      {
        id: "l2-grounding-line",
        lessonNumber: 2,
        title: "Antarctic Cryosphere 02 : Ice Sheet Flow Dynamics & The Grounding Line",
        duration: "14:15",
        speaker: "Dr. A. Verma",
        role: "Senior Glaciology Scientist",
        institution: "NCPOR Cryosphere Division",
        videoThumb: "https://images.unsplash.com/photo-1548232979-6c557ee14752?w=800&q=80",
        summary: "Understanding the Marine Ice Sheet Instability (MISI) hypothesis, grounding line retreat, and satellite interferometry.",
        chapters: [
          { time: "00:00", seconds: 0, title: "Anatomy of the Grounding Line", slideSummary: "Where bedrock contact ends and ocean buoyancy begins.", transcriptSnippet: "The grounding line is the physical hinge of the entire Antarctic ice sheet..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Verma", text: "Today we inspect the most critical structural feature in glaciology: the grounding line." },
        ],
        keyFormulas: [
          "Glen's Flow Law: ε̇ = A · τⁿ (where n ≈ 3 for ice creep)",
        ],
        slideDeck: slideDecks.glaciers.slides,
        infographic: infographics.ice_shelf,
        dppCards: flashcardDecks.glaciers,
        quizQuestions: [
          {
            q: "What is the primary factor that makes a marine-grounded ice sheet vulnerable to runaway retreat?",
            options: [
              "Retrograde bedrock sloping downward toward the continent interior",
              "Low surface snowfall",
              "Cold winter winds",
              "Crustal earthquakes",
            ],
            correct: 0,
            explanation: "Retrograde bed slopes cause the ice thickness at the grounding line to increase as it retreats, accelerating discharge.",
          },
        ],
        commonDoubts: [],
      },
      {
        id: "l3-third-pole",
        lessonNumber: 3,
        title: "Antarctic Cryosphere 03 : The Third Pole: Himalayan Glaciers & India's Water Lifeline",
        duration: "15:10",
        speaker: "Dr. Thamban Meloth",
        role: "Lead Glaciologist",
        institution: "Himansh Station, Spiti / NCPOR",
        videoThumb: "https://images.unsplash.com/photo-1462888387064-2a2ea232edb8?w=800&q=80",
        summary: "NCPOR field operations at Himansh Observatory (4,080m) tracking glacier mass balance of Chandra and Bhaga basins.",
        chapters: [
          { time: "00:00", seconds: 0, title: "Why the Himalayas are the 'Third Pole'", slideSummary: "Stores the largest volume of permanent ice outside polar regions.", transcriptSnippet: "Over 1.5 billion people depend on Himalayan meltwater streams..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Meloth", text: "India's glaciological mission connects Antarctica directly to our own Himalayas." },
        ],
        keyFormulas: [
          "Mass Balance: Bn = c (accumulation) - a (ablation)",
        ],
        slideDeck: slideDecks.glaciers.slides,
        infographic: infographics.ice_shelf,
        dppCards: flashcardDecks.glaciers,
        quizQuestions: [
          {
            q: "What is India's high-altitude research station in the Himalayas operated by NCPOR?",
            options: ["Maitri", "Bharati", "Himansh", "Himadri"],
            correct: 2,
            explanation: "Himansh Station is located at 4,080m in Spiti Valley, Himachal Pradesh, dedicated to Himalayan glacier monitoring.",
          },
        ],
        commonDoubts: [],
      },
      {
        id: "l4-firn-gas",
        lessonNumber: 4,
        title: "Antarctic Cryosphere 04 : Firn Air Occlusion & Atmospheric Greenhouse Gas Reconstructions",
        duration: "16:30",
        speaker: "Dr. Manish Tiwari",
        role: "Senior Paleoclimatologist",
        institution: "NCPOR Paleoclimate Lab",
        videoThumb: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
        summary: "Micro-porous diffusion, gravitational settling, and Δage delta corrections between ice matrix and trapped gas phase.",
        chapters: [
          { time: "00:00", seconds: 0, title: "The Firn Porosity Gradient", slideSummary: "From freshly deposited snow to impermeable ice.", transcriptSnippet: "Air can freely circulate in the top firn layer..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Tiwari", text: "Today we discover how firn acts as a physical filter before sealing the paleoclimate record." },
        ],
        keyFormulas: [
          "Δage = Age(ice) - Age(gas) at the lock-in depth",
        ],
        slideDeck: slideDecks.glaciers.slides,
        infographic: infographics.ice_shelf,
        dppCards: flashcardDecks.glaciers,
        quizQuestions: [
          {
            q: "Why is the gas in an ice core younger than the surrounding ice matrix at the same depth?",
            options: [
              "Gas travels through cracks after freezing",
              "Air circulates freely in the porous firn before bubble close-off",
              "Microbes create new gas underground",
              "Gas is heated by geothermal heat",
            ],
            correct: 1,
            explanation: "Snow takes decades to centuries to compact into solid ice, during which air diffuses freely from the surface down to ~70m.",
          },
        ],
        commonDoubts: [],
      },
      {
        id: "l5-insar-grav",
        lessonNumber: 5,
        title: "Antarctic Cryosphere 05 : Satellite InSAR Radar & CryoSat-2 Ice Mass Balance",
        duration: "19:05",
        speaker: "Dr. Shridhar Jawak",
        role: "Remote Sensing Specialist",
        institution: "NCPOR Geo-Informatics",
        videoThumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        summary: "Combining Synthetic Aperture Radar Interferometry with GRACE gravity recovery to quantify Antarctic mass loss in Gigatonnes per year.",
        chapters: [
          { time: "00:00", seconds: 0, title: "Altimetry vs Gravimetry Comparison", slideSummary: "Surface height changes vs direct mass changes.", transcriptSnippet: "Satellite radar altimetry measures ice surface elevation change dh/dt..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Jawak", text: "Welcome. Today we quantify continental ice sheet loss using spaceborne sensors." },
        ],
        keyFormulas: [
          "Mass Rate: dM/dt = ρ_ice · ∫ (dh/dt) dA - GIA_correction",
        ],
        slideDeck: slideDecks.glaciers.slides,
        infographic: infographics.ice_shelf,
        dppCards: flashcardDecks.glaciers,
        quizQuestions: [
          {
            q: "Which satellite mission measures ice sheet mass loss directly via gravitational perturbations?",
            options: ["CryoSat-2", "GRACE / GRACE-FO", "Landsat 9", "MODIS Terra"],
            correct: 1,
            explanation: "GRACE twin satellites measure minute variations in distance caused by gravity changes as ice mass melts into the ocean.",
          },
        ],
        commonDoubts: [],
      },
    ],
  },
  {
    id: "course-seaice",
    title: "Polar Sea Ice Physics & Monsoon Teleconnections",
    code: "NCPOR-PHYS-102",
    faculty: "Dr. A. Sharma (Chief Oceanographer)",
    badge: "Physics & Thermodynamics",
    category: "Ocean & Sea Ice",
    startDate: "20 Aug 2025",
    targetAudience: "For Physical Oceanography & Indian Monsoon Teleconnection Studies",
    bannerImage: "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=800&q=80",
    level: "Intermediate",
    totalLectures: 24,
    totalHours: "36 hours",
    lessons: [
      {
        id: "l1-albedo",
        lessonNumber: 1,
        title: "Thermodynamics of Polar Sea Ice & The Albedo Engine",
        duration: "13:40",
        speaker: "Dr. A. Sharma",
        role: "Chief Oceanographer",
        institution: "NCPOR Oceanography Lab",
        videoThumb: "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=800&q=80",
        summary: "Understanding the freezing point depression of seawater (-1.8°C), brine exclusion, and the positive ice-albedo climate feedback loop.",
        chapters: [
          { time: "00:00", seconds: 0, title: "Freezing Seawater at -1.8°C", slideSummary: "Salinity depressant effect on the liquid-solid phase boundary.", transcriptSnippet: "Seawater does not freeze at zero degrees because dissolved sodium and chloride ions disrupt hydrogen bonding..." },
          { time: "04:30", seconds: 270, title: "Brine Rejection & Dense Water Cascades", slideSummary: "Formation of Antarctic Bottom Water.", transcriptSnippet: "As ice crystals form, heavy salt brine is expelled downwards through microscopic channels..." },
          { time: "09:00", seconds: 540, title: "Albedo Radiation Mirror", slideSummary: "85% reflection vs 93% ocean heat absorption.", transcriptSnippet: "Sea ice is Earth's white planetary sunshield..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Sharma", text: "Welcome students. Today we study the physics of sea ice and its planetary thermostat role." },
        ],
        keyFormulas: [
          "Freezing point depression: ΔTf = i · Kf · m (for seawater, Tf ≈ -1.8°C)",
          "Planetary Albedo: α_ice ≈ 0.85, α_ocean ≈ 0.07",
          "Radiative forcing feedback: dF/dT = -S₀/4 · (dα/dT)",
        ],
        slideDeck: slideDecks.sea_ice.slides,
        infographic: infographics.sea_ice,
        dppCards: flashcardDecks.sea_ice,
        quizQuestions: [
          {
            q: "At what temperature does typical seawater (35 PSU salinity) freeze?",
            options: ["0.0°C", "-1.8°C", "-4.2°C", "-10.0°C"],
            correct: 1,
            explanation: "Dissolved mineral salts depress the freezing point of ocean water from 0°C down to approximately -1.8°C.",
          },
          {
            q: "What is the albedo percentage of clean, snow-covered sea ice?",
            options: ["~7%", "~30%", "~50%", "~85%"],
            correct: 3,
            explanation: "Fresh snow-covered sea ice reflects roughly 80–85% of incoming solar radiation back into space.",
          },
        ],
        commonDoubts: [
          {
            q: "Can you drink melted sea ice water?",
            a: "Yes! Multi-year sea ice has drained out almost all of its salt brine pockets over consecutive summers, leaving behind water fresh enough to drink in polar survival situations.",
            time: "06:15",
          },
        ],
      },
      {
        id: "l2-monsoon",
        lessonNumber: 2,
        title: "Teleconnections: Antarctic Sea Ice & The Indian Monsoon",
        duration: "14:20",
        speaker: "Dr. A. Sharma",
        role: "Climate Modeling Lead",
        institution: "NCPOR / MoES",
        videoThumb: "https://images.unsplash.com/photo-1672570289260-d430df31d893?w=800&q=80",
        summary: "How anomalies in the Southern Ocean pressure field modulate moisture transport over the Arabian Sea and Indian subcontinent.",
        chapters: [
          { time: "00:00", seconds: 0, title: "The Mascarene High Cross-Equatorial Flow", slideSummary: "Southern Indian Ocean high-pressure engine.", transcriptSnippet: "The summer monsoon is driven by the pressure gradient between the Mascarene High and the Tibetan Plateau..." },
          { time: "07:15", seconds: 435, title: "Antarctic Teleconnections", slideSummary: "Sea ice extent shifts in Weddell Sea.", transcriptSnippet: "When Antarctic sea ice expands in the Indian sector, it intensifies cross-equatorial southerly winds..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Sharma", text: "Why does India spend resources in Antarctica? The answer is right here: the Indian monsoon." },
        ],
        keyFormulas: [
          "Cross-Equatorial Moisture Flux: Q = (1/g) ∫ q · v dp",
          "Southern Annular Mode (SAM) Index teleconnection correlation r = 0.58",
        ],
        slideDeck: slideDecks.sea_ice.slides,
        infographic: infographics.sea_ice,
        dppCards: flashcardDecks.sea_ice,
        quizQuestions: [
          {
            q: "Which high-pressure system in the Southern Ocean drives the cross-equatorial monsoon winds toward India?",
            options: ["Mascarene High", "Siberian High", "Azores High", "Bermuda High"],
            correct: 0,
            explanation: "The Mascarene High off Madagascar in the Southern Indian Ocean pumps monsoon moisture northward across the equator.",
          },
        ],
        commonDoubts: [
          {
            q: "Does less sea ice in Antarctica mean less rain in India?",
            a: "Studies by NCPOR show complex phase couplings: significant sea ice anomalies alter the position of the subtropical jet stream, creating drought spells or extreme localized rainfall events over Central India.",
            time: "08:40",
          },
        ],
      },
    ],
  },
  {
    id: "course-biology",
    title: "Southern Ocean Marine Ecology & Extremophiles",
    code: "NCPOR-BIO-103",
    faculty: "Dr. Rahul Mohan (Senior Marine Scientist)",
    badge: "Ecology & Extremophiles",
    category: "Polar Biology",
    startDate: "1 Sep 2025",
    targetAudience: "For Marine Ecologists, Astrobiologists & Psychrophile Researchers",
    bannerImage: "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=800&q=80",
    level: "Beginner",
    totalLectures: 20,
    totalHours: "28 hours",
    lessons: [
      {
        id: "l1-krill",
        lessonNumber: 1,
        title: "The Krill Engine & Under-Ice Diatom Nursery",
        duration: "15:20",
        speaker: "Dr. Rahul Mohan",
        role: "Senior Marine Scientist",
        institution: "NCPOR Marine Biology Lab",
        videoThumb: "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=800&q=80",
        summary: "Euphausia superba biology, lipid dynamics, and the keystone bridge from diatoms to baleen whales.",
        chapters: aiLectures[1].chapters,
        fullTranscript: aiLectures[1].fullTranscript,
        keyFormulas: [
          "Total Krill Biomass: 400–500 Million Tonnes",
          "Trophic Transfer Efficiency: η ≈ 15% from diatoms to krill",
        ],
        slideDeck: slideDecks.biodiversity.slides,
        infographic: infographics.sea_ice,
        dppCards: flashcardDecks.biodiversity,
        quizQuestions: [
          {
            q: "What organism forms the biological cornerstone of the Antarctic marine food web?",
            options: ["Antarctic Krill (Euphausia superba)", "Jellyfish", "Crab larvae", "Arctic Fox"],
            correct: 0,
            explanation: "Antarctic Krill is the keystone species transferring photosynthetic energy from micro-diatoms to seals, penguins, and whales.",
          },
        ],
        commonDoubts: [
          {
            q: "How can krill survive winter when the sun never rises?",
            a: "They graze upside-down on microscopic algae trapped in sea-ice brine pores, and can down-regulate their metabolic rate by up to 50% (quiescence).",
            time: "04:30",
          },
        ],
      },
      {
        id: "l2-extremophiles",
        lessonNumber: 2,
        title: "Biochemical Adaptations: Antifreeze Glycoproteins & Microbes",
        duration: "11:10",
        speaker: "Dr. Rahul Mohan",
        role: "Extremophile Researcher",
        institution: "NCPOR Biology Division",
        videoThumb: "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=800&q=80",
        summary: "Anti-freeze proteins in notothenioid fish, clear-blooded icefish, and cold-active psychrophilic enzymes from Priyadarshini Lake.",
        chapters: [
          { time: "00:00", seconds: 0, title: "Non-Colligative Freezing Point Depression", slideSummary: "AFGPs binding to micro-ice nuclei.", transcriptSnippet: "Antarctic fish blood contains specialized proteins that stop ice crystals from growing..." },
          { time: "05:20", seconds: 320, title: "Psychrophilic Bacteria in Priyadarshini Lake", slideSummary: "Cold-active enzymes for industrial biotechnology.", transcriptSnippet: "Indian scientists isolated novel bacteria from lake sediments near Maitri Station..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Mohan", text: "Life finds a way even in liquid seawater at -1.8°C." },
        ],
        keyFormulas: [
          "Thermal Hysteresis: Separation between melting point and non-equilibrium freezing point (ΔT ≈ 1.5°C)",
        ],
        slideDeck: slideDecks.biodiversity.slides,
        infographic: infographics.sea_ice,
        dppCards: flashcardDecks.biodiversity,
        quizQuestions: [
          {
            q: "What adaptation enables Antarctic notothenioid fish to survive without freezing?",
            options: [
              "Antifreeze Glycoproteins (AFGPs)",
              "Blubber layer",
              "High body temperature",
              "Thick fur",
            ],
            correct: 0,
            explanation: "AFGPs bind to embryonic ice crystal faces in bodily fluids, arresting further crystal growth.",
          },
        ],
        commonDoubts: [
          {
            q: "Why don't penguins' feet freeze to the ice?",
            a: "They have a countercurrent heat exchange system in their legs! Arterial warm blood flowing down warms the cold venous blood flowing up, keeping feet just above freezing while preventing core heat loss.",
            time: "03:10",
          },
        ],
      },
    ],
  },
  {
    id: "course-engineering",
    title: "Polar Station Engineering, Logistics & Habitation",
    code: "NCPOR-ENG-104",
    faculty: "Dr. K. Sharma & Cmdr. Rajesh Kumar",
    badge: "Station Architecture",
    category: "Polar Engineering",
    startDate: "10 Sep 2025",
    targetAudience: "For Expedition Engineers, Architecture & Extreme Logistics Personnel",
    bannerImage: "https://images.unsplash.com/photo-1462888387064-2a2ea232edb8?w=800&q=80",
    level: "Intermediate",
    totalLectures: 18,
    totalHours: "25 hours",
    lessons: [
      {
        id: "l1-bharati",
        lessonNumber: 1,
        title: "Engineering India's Bharati Station in Larsemann Hills",
        duration: "21:10",
        speaker: "Dr. K. Sharma",
        role: "Polar Architecture Lead",
        institution: "NCPOR Logistics Division",
        videoThumb: "https://images.unsplash.com/photo-1462888387064-2a2ea232edb8?w=800&q=80",
        summary: "134 prefabricated shipping containers on stilts, CHP cogeneration, zero-effluent wastewater, and 300 km/h wind deflection.",
        chapters: aiLectures[2].chapters,
        fullTranscript: aiLectures[2].fullTranscript,
        keyFormulas: [
          "Wind loading pressure: q = 0.613 · v² (at 300 km/h, wind force exceeds 4.2 kPa)",
          "Thermal Insulation: U-value < 0.12 W/m²K for composite envelope",
        ],
        slideDeck: slideDecks.glaciers.slides,
        infographic: infographics.ice_shelf,
        dppCards: flashcardDecks.glaciers,
        quizQuestions: [
          {
            q: "Why is India's Bharati Station elevated 4 meters on steel pilings?",
            options: [
              "To prevent dangerous katabatic snowdrifts from burying the station",
              "To keep away polar bears",
              "To get closer to the sun",
              "To protect from ocean tides",
            ],
            correct: 0,
            explanation: "Elevating the structure allows hurricane-force katabatic winds to pass underneath, blowing snow clear instead of accumulating gigantic drifts.",
          },
        ],
        commonDoubts: [
          {
            q: "How does Bharati Station generate electricity?",
            a: "Using a Combined Heat and Power (CHP) plant with polar-grade JP-8 fuel generators. Waste heat from the engine coolant is captured to heat the living quarters and melt ice for drinking water.",
            time: "07:30",
          },
        ],
      },
      {
        id: "l2-ozone",
        lessonNumber: 2,
        title: "Atmospheric Physics & The Ozone Recovery Story over Maitri",
        duration: "14:35",
        speaker: "Dr. S. Iyer",
        role: "Senior Atmospheric Scientist",
        institution: "IIG & NCPOR",
        videoThumb: "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800&q=80",
        summary: "Stratospheric polar vortex dynamics, polar stratospheric clouds (PSCs), catalytic chlorine cycles, and ozonesonde telemetry.",
        chapters: aiLectures[3].chapters,
        fullTranscript: aiLectures[3].fullTranscript,
        keyFormulas: [
          "Catalytic cycle: Cl + O₃ → ClO + O₂ ; ClO + O → Cl + O₂ (Net: O₃ + O → 2O₂)",
          "1 Dobson Unit (DU) = 2.69 × 10¹⁶ ozone molecules/cm²",
        ],
        slideDeck: slideDecks.sea_ice.slides,
        infographic: infographics.sea_ice,
        dppCards: flashcardDecks.sea_ice,
        quizQuestions: [
          {
            q: "At what critical temperature do Polar Stratospheric Clouds (PSCs) form in the winter vortex?",
            options: ["-10°C", "-40°C", "-78°C", "-120°C"],
            correct: 2,
            explanation: "PSCs form only in extreme cold below -78°C, providing catalytic crystal surfaces that convert inert chlorine into ozone-destroying radicals.",
          },
        ],
        commonDoubts: [
          {
            q: "When will the Antarctic ozone hole fully heal?",
            a: "According to WMO/UNEP and NCPOR observational data, thanks to the Montreal Protocol, the Antarctic ozone layer is projected to return to 1980 baseline levels by around 2066.",
            time: "12:15",
          },
        ],
      },
    ],
  },
  {
    id: "course-arctic-climate",
    title: "Arctic Oceanography & Rapid Sea-Ice Decline Masterclass",
    code: "NCPOR-ARCTIC-201",
    faculty: "Dr. K. P. Krishnan (Senior Arctic Scientist, Himadri)",
    badge: "Arctic Expedition",
    category: "Arctic & Climate",
    startDate: "18 Sep 2025",
    targetAudience: "For Arctic Geopolitics, Svalbard Research & Boreal Climate Scientists",
    bannerImage: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&q=80",
    level: "Intermediate",
    totalLectures: 22,
    totalHours: "32 hours",
    lessons: [
      {
        id: "l-arctic-01",
        lessonNumber: 1,
        title: "Arctic Oceanography 01 : Rapid Arctic Amplification & Fram Strait Hydrography",
        duration: "17:45",
        speaker: "Dr. K. P. Krishnan",
        role: "Senior Arctic Scientist",
        institution: "Himadri Station, Ny-Ålesund / NCPOR",
        videoThumb: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&q=80",
        summary: "Investigating the Atlantification of the Barents Sea, warm Atlantic water inflow through Fram Strait, and Kongsfjorden fjord dynamics.",
        chapters: [
          { time: "00:00", seconds: 0, title: "What is Arctic Amplification?", slideSummary: "Why the Arctic warms 3 to 4 times faster than the global mean.", transcriptSnippet: "Diminishing white sea ice exposes dark ocean water, accelerating solar absorption in an irreversible loop..." },
          { time: "08:30", seconds: 510, title: "Kongsfjorden Long-Term Mooring", slideSummary: "NCPOR underwater observatory moored in Svalbard.", transcriptSnippet: "Our subsurface mooring IndARC monitors year-round salinity, temperature and biogeochemical flux..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Krishnan", text: "Welcome to Himadri Station in Ny-Ålesund, Svalbard (79° North). Today we analyze rapid Arctic warming." },
        ],
        keyFormulas: [
          "Polar Amplification Factor: PAF = ΔT_Arctic / ΔT_Global ≈ 3.8",
          "Heat Transport through Fram Strait: Q = ρ · Cp · ∫ v · (T - T_ref) dA",
        ],
        slideDeck: slideDecks.sea_ice.slides,
        infographic: infographics.sea_ice,
        dppCards: flashcardDecks.sea_ice,
        quizQuestions: [
          {
            q: "Where is India's permanent Arctic research station Himadri located?",
            options: ["Ny-Ålesund, Svalbard, Norway", "Greenland Summit", "Murmansk, Russia", "Point Barrow, Alaska"],
            correct: 0,
            explanation: "Himadri Station was inaugurated by India in 2008 at the international research base in Ny-Ålesund, Svalbard.",
          },
        ],
        commonDoubts: [
          {
            q: "What is India's underwater observatory in the Arctic called?",
            a: "IndARC. It is an anchored multisensor moored observatory deployed in Kongsfjorden since 2014.",
            time: "09:15",
          },
        ],
      },
    ],
  },
  {
    id: "course-himalayan-cryo",
    title: "Himalayan Glaciology & Glacial Lake Outburst Floods (GLOF)",
    code: "NCPOR-HIM-202",
    faculty: "Dr. Parmanand Sharma (Himansh Observatory Lead)",
    badge: "Third Pole Expedition",
    category: "Himalayan Cryosphere",
    startDate: "25 Sep 2025",
    targetAudience: "For Himalayan Water Security, Hydrologists & GLOF Disaster Planners",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    level: "Advanced",
    totalLectures: 26,
    totalHours: "38 hours",
    lessons: [
      {
        id: "l-him-01",
        lessonNumber: 1,
        title: "Himalayan Cryosphere 01 : Chhota Shigri Glacier Mass Balance & GLOF Early Warning",
        duration: "20:15",
        speaker: "Dr. Parmanand Sharma",
        role: "Glaciology Lead",
        institution: "Himansh Observatory, Spiti / NCPOR",
        videoThumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
        summary: "Field measurements on benchmark Chhota Shigri glacier (Himachal Pradesh), supraglacial lake expansion, and dam-break hydrodynamic modelling.",
        chapters: [
          { time: "00:00", seconds: 0, title: "Chhota Shigri Benchmark Observatory", slideSummary: "Continuous glaciological mass balance monitoring since 2002.", transcriptSnippet: "Chhota Shigri glacier spans 9 km in length and acts as India's climate benchmark for the Western Himalayas..." },
          { time: "11:20", seconds: 680, title: "Moraine Dam Failure Mechanics", slideSummary: "Piping, overtopping, and seismic triggers of GLOF events.", transcriptSnippet: "Loose moraine dams can breach suddenly when supraglacial lakes exceed critical hydrostatic volumes..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Sharma", text: "India's Himalayan glaciers sustain the Indus and Ganges river basins. Let us examine their stability." },
        ],
        keyFormulas: [
          "Specific Mass Balance: b = ∫ (accumulation - ablation) dt",
          "GLOF Peak Discharge: Q_max = 0.72 · (V_lake)⁰·⁵³",
        ],
        slideDeck: slideDecks.glaciers.slides,
        infographic: infographics.ice_shelf,
        dppCards: flashcardDecks.glaciers,
        quizQuestions: [
          {
            q: "What causes a Glacial Lake Outburst Flood (GLOF)?",
            options: [
              "Sudden failure of an unstable moraine or ice dam holding back a glacial melt lake",
              "Excessive winter snowfall",
              "Deep subterranean boiling",
              "Solar flares",
            ],
            correct: 0,
            explanation: "As glaciers retreat, meltwater pools behind unconsolidated moraines which can breach cataclysmically when overwhelmed.",
          },
        ],
        commonDoubts: [
          {
            q: "At what altitude is NCPOR's Himansh Observatory situated?",
            a: "Himansh is perched at 4,080 meters (13,500 ft) above sea level in the high-altitude desert of Spiti Valley, Himachal Pradesh.",
            time: "04:10",
          },
        ],
      },
    ],
  },
  {
    id: "course-polar-remotesensing",
    title: "Satellite Remote Sensing, Radar Altimetry & Polar GIS",
    code: "NCPOR-GIS-301",
    faculty: "Dr. Shridhar Jawak (Geo-Informatics Specialist)",
    badge: "Space Geo-Informatics",
    category: "Remote Sensing & GIS",
    startDate: "2 Oct 2025",
    targetAudience: "For Earth Observation, SAR Interferometry & CryoSat Altimetry",
    bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    level: "Advanced",
    totalLectures: 28,
    totalHours: "42 hours",
    lessons: [
      {
        id: "l-rs-01",
        lessonNumber: 1,
        title: "Polar Remote Sensing 01 : SAR Interferometry & CryoSat Altimetry on Ice Sheets",
        duration: "18:50",
        speaker: "Dr. Shridhar Jawak",
        role: "Geo-Informatics Specialist",
        institution: "NCPOR Polar GIS Facility",
        videoThumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        summary: "Radar penetration through snowpack, SAR speckle filtering, D-InSAR deformation mapping, and digital elevation models of ice shelves.",
        chapters: [
          { time: "00:00", seconds: 0, title: "Microwave Penetration in Dry Snow", slideSummary: "C-band (Sentinel-1) vs L-band (NISAR) penetration depths.", transcriptSnippet: "Microwaves penetrate dry polar snow, requiring dielectric permittivity correction factors..." },
          { time: "10:15", seconds: 615, title: "Interferometric Phase to Height Conversion", slideSummary: "Unwrapping phase fringes into sub-centimeter elevation maps.", transcriptSnippet: "Differential interferometry enables us to measure grounding line tidal hinge flexing down to millimeters..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Jawak", text: "Today we leverage satellite Synthetic Aperture Radar (SAR) to observe polar ice sheets through cloud and darkness." },
        ],
        keyFormulas: [
          "Interferometric Phase: Δφ = (4π / λ) · ΔR",
          "Altitude of Ambiguity: ha = (λ · R · sin θ) / (2 · B_perp)",
        ],
        slideDeck: slideDecks.glaciers.slides,
        infographic: infographics.ice_shelf,
        dppCards: flashcardDecks.glaciers,
        quizQuestions: [
          {
            q: "Why is Synthetic Aperture Radar (SAR) preferred over optical sensors for polar ice mapping?",
            options: [
              "SAR operates independently of sunlight and penetrates through clouds and polar darkness",
              "Optical cameras don't work in freezing temperatures",
              "SAR satellites are closer to the ground",
              "Optical imagery is banned in Antarctica",
            ],
            correct: 0,
            explanation: "Active microwave radar illuminates the surface with its own signal, penetrating cloud cover and illuminating months of polar night.",
          },
        ],
        commonDoubts: [
          {
            q: "What is NISAR?",
            a: "NISAR is the joint NASA-ISRO Synthetic Aperture Radar satellite providing dual-frequency (L-band and S-band) radar imaging to track glacier velocities worldwide.",
            time: "14:20",
          },
        ],
      },
    ],
  },
  {
    id: "course-polar-meteorology",
    title: "Antarctic Atmospheric Physics, Katabatic Winds & Ozone Dynamics",
    code: "NCPOR-ATM-203",
    faculty: "Dr. Manoj M. G. (Atmospheric Sciences Lead)",
    badge: "Atmospheric Physics",
    category: "Atmospheric Science",
    startDate: "12 Oct 2025",
    targetAudience: "For Dynamic Meteorologists, Radiosonde Observers & Climatologists",
    bannerImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    level: "Intermediate",
    totalLectures: 16,
    totalHours: "22 hours",
    lessons: [
      {
        id: "l-atm-01",
        lessonNumber: 1,
        title: "Atmospheric Physics 01 : Halley Bay Ozone Hole Dynamics & 200 km/h Katabatic Winds",
        duration: "16:20",
        speaker: "Dr. Manoj M. G.",
        role: "Atmospheric Sciences Lead",
        institution: "NCPOR Atmosphere Group",
        videoThumb: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
        summary: "Radiative cooling over the Antarctic plateau, negative buoyancy acceleration down continental slopes, and stratospheric ozone depletion kinetics.",
        chapters: [
          { time: "00:00", seconds: 0, title: "Mechanics of Katabatic Winds", slideSummary: "Dense air chilled by radiative heat loss accelerating down 3,000m ice slopes.", transcriptSnippet: "When radiation chills boundary air, gravitational acceleration produces howling gale-force winds exceeding 200 km/h..." },
          { time: "09:10", seconds: 550, title: "The Polar Vortex Trap", slideSummary: "How circumpolar westerly jets isolate Antarctic air in winter.", transcriptSnippet: "The polar vortex creates an isolated stratospheric refrigerator where temperature plummets below -80°C..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Manoj", text: "Welcome. Today we examine the most ferocious winds on Earth and the physics of the Antarctic ozone hole." },
        ],
        keyFormulas: [
          "Katabatic Acceleration: a = g · (Δθ / θ₀) · sin α - friction",
          "Coriolis Deflection: f = 2Ω sin φ",
        ],
        slideDeck: slideDecks.sea_ice.slides,
        infographic: infographics.sea_ice,
        dppCards: flashcardDecks.sea_ice,
        quizQuestions: [
          {
            q: "What drives the ferocious katabatic winds of Antarctica?",
            options: [
              "Dense, radiatively cooled air sliding downhill under gravity from the high plateau to the coast",
              "Ocean tidal friction",
              "Solar wind flares",
              "Volcanic hot spots",
            ],
            correct: 0,
            explanation: "The high Antarctic dome intensely cools the lowest air layer, creating extremely dense air that rushes down steep coastal slopes.",
          },
        ],
        commonDoubts: [
          {
            q: "Why do katabatic winds subside just a few kilometers offshore?",
            a: "Because once the cold air hits the ocean surface, boundary layer friction and convective mixing with warmer ocean air destroy the slope-driven acceleration.",
            time: "11:40",
          },
        ],
      },
    ],
  },
  {
    id: "course-southern-ocean-geochem",
    title: "Southern Ocean Biogeochemical Cycles & Carbon Sequestration",
    code: "NCPOR-OCN-401",
    faculty: "Dr. Sarat Chandra Tripathy (Senior Ocean Biogeochemist)",
    badge: "Ocean Carbon Pump",
    category: "Ocean & Sea Ice",
    startDate: "20 Oct 2025",
    targetAudience: "For Marine Biogeochemists, Carbon Accountants & Expedition Scientists",
    bannerImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    level: "Advanced",
    totalLectures: 20,
    totalHours: "30 hours",
    lessons: [
      {
        id: "l-ocn-01",
        lessonNumber: 1,
        title: "Ocean Biogeochemistry 01 : The Southern Ocean Carbon Sink & Biological Pump",
        duration: "19:30",
        speaker: "Dr. Sarat Chandra Tripathy",
        role: "Senior Ocean Biogeochemist",
        institution: "NCPOR Biogeochemistry Facility",
        videoThumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        summary: "High-Nutrient Low-Chlorophyll (HNLC) regions, the iron limitation hypothesis (John Martin), and deep sinking organic carbon export fluxes.",
        chapters: [
          { time: "00:00", seconds: 0, title: "The Southern Ocean's 40% Carbon Sink", slideSummary: "Why 40% of all anthropogenic ocean carbon uptake occurs south of 30°S.", transcriptSnippet: "Vigorous wind-driven upwelling and deep bottom water formation make the Southern Ocean Earth's primary marine carbon sink..." },
          { time: "10:20", seconds: 620, title: "Iron Fertilization & The HNLC Paradox", slideSummary: "Excess nitrate and phosphate that phytoplankton cannot consume due to nanomolar iron scarcity.", transcriptSnippet: "Dissolved iron in the Southern Ocean is measured in picomoles; adding trace iron stimulates massive diatom blooms..." },
        ],
        fullTranscript: [
          { time: "00:00", speaker: "Dr. Tripathy", text: "Today we board the Sagar Kanya expedition to quantify Earth's greatest natural carbon sponge." },
        ],
        keyFormulas: [
          "Redfield Ratio: C:N:P = 106:16:1",
          "Export Efficiency: e-ratio = POC_export / Net_Primary_Production",
        ],
        slideDeck: slideDecks.biodiversity.slides,
        infographic: infographics.sea_ice,
        dppCards: flashcardDecks.biodiversity,
        quizQuestions: [
          {
            q: "What micronutrient primarily limits phytoplankton growth in the High-Nutrient Low-Chlorophyll (HNLC) Southern Ocean?",
            options: ["Dissolved Iron (Fe)", "Nitrate", "Phosphate", "Silicate"],
            correct: 0,
            explanation: "Despite abundant nitrogen and phosphorus, microscopic diatoms cannot synthesize chlorophyll without trace nanomolar quantities of iron.",
          },
        ],
        commonDoubts: [
          {
            q: "Where does natural iron in the Southern Ocean come from?",
            a: "Natural iron sources include glacial meltwater runoff, upwelling from hydrothermal vents on the seafloor, and dust transported by Patagonian westerly winds.",
            time: "13:10",
          },
        ],
      },
    ],
  },
];
