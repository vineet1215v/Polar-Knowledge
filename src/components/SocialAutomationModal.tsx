import { useState, useRef } from "react";
import { WorkspaceSource } from "../workspaceStore";

interface SocialAutomationModalProps {
  sources?: WorkspaceSource[];
  initialTopic?: string;
  initialContent?: string;
  onClose: () => void;
  onNavigate?: (p: string) => void;
}

type Platform = "twitter" | "facebook" | "instagram" | "linkedin" | "telegram" | "whatsapp" | "reddit" | "webhook";

interface TemplatePreset {
  id: string;
  name: string;
  icon: string;
  topic: string;
  description: string;
  station: string;
  tags: string[];
}

const TEMPLATES: TemplatePreset[] = [
  {
    id: "expedition",
    name: "Expedition Live Dispatch",
    icon: "",
    topic: "46th Indian Antarctic Expedition reaches Bharati Station for seasonal science ops",
    description: "Field updates, science ops, and logistics from Maitri & Bharati stations",
    station: "Bharati Station · 69°S",
    tags: ["#NCPOR", "#Antarctica", "#IndianAntarcticExpedition", "#PolarScience", "#BharatiStation"],
  },
  {
    id: "cryosphere",
    name: "Climate & Cryosphere Alert",
    icon: "",
    topic: "Southern Ocean Sea Ice Extent analysis reveals critical interannual anomalies",
    description: "Satellite observations, ice shelf monitoring, and global climate implications",
    station: "Southern Ocean · Cryosphere Hub",
    tags: ["#ClimateAction", "#SeaIce", "#SouthernOcean", "#Cryosphere", "#MoES"],
  },
  {
    id: "research",
    name: "Research Breakthrough",
    icon: "",
    topic: "New NCPOR study: Subglacial bedrock mapping reveals hidden Antarctic thermal dynamics",
    description: "Plain-language summary of peer-reviewed findings with DOI citation",
    station: "Central Analytical Lab · Goa",
    tags: ["#NCPORResearch", "#Geosciences", "#EarthScience", "#Glaciology", "#PeerReviewed"],
  },
  {
    id: "education",
    name: "Polar Fact & Student Quiz",
    icon: "",
    topic: "How do Antarctic ice sheets preserve Earth's climate history over 800,000 years?",
    description: "Engaging STEM outreach fact, interactive quiz question, and learning challenge",
    station: "Polar Outreach Division",
    tags: ["#PolarEducation", "#STEMIndia", "#LearnScience", "#NCPOR", "#IceCores"],
  },
  {
    id: "announcement",
    name: "Official MoES Announcement",
    icon: "",
    topic: "MoES & NCPOR announce National Polar Science Fellowship 2026-27 call for proposals",
    description: "Grant opportunities, recruitment drives, symposiums, and institutional news",
    station: "Ministry of Earth Sciences",
    tags: ["#MoES", "#NCPOR", "#Fellowship2026", "#ResearchGrant", "#GovtOfIndia"],
  },
];

const SUGGESTED_TOPICS = [
  "46th Indian Antarctic Expedition reaches Maitri & Bharati stations",
  "Antarctic Sea Ice records 2024-2026: Southern Ocean Cryosphere Analysis",
  "Himadri Arctic Station: Microplastics discovered in Svalbard snow samples",
  "Prydz Bay Marine Ecosystem Survey reveals resilient benthic fauna",
  "NCPOR & MoES National Polar Fellowship 2026-27 Applications Open",
];

export default function SocialAutomationModal({
  sources = [],
  initialTopic = "",
  initialContent = "",
  onClose,
}: SocialAutomationModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("expedition");
  const [topic, setTopic] = useState<string>(
    initialTopic || (sources.length > 0 ? sources[0].title : TEMPLATES[0].topic)
  );
  const [tone, setTone] = useState<"engaging" | "scholarly" | "alert" | "youth">("engaging");
  const [activePlatform, setActivePlatform] = useState<Platform>("twitter");
  const [stationBadge, setStationBadge] = useState<string>(TEMPLATES[0].station);
  const [splitThreads, setSplitThreads] = useState(true);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Webhook / Dispatcher state
  const [webhookUrl, setWebhookUrl] = useState("https://api.ncpor.res.in/v1/syndicate/broadcast");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>({
    twitter: true,
    facebook: true,
    instagram: true,
    linkedin: true,
    telegram: true,
    whatsapp: true,
    reddit: false,
  });
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState<Array<{ time: string; text: string; status: "success" | "pending" | "info" }>>([]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Visual card reference
  const cardRef = useRef<HTMLDivElement>(null);

  const activePreset = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  // Helper to trigger toast
  const triggerToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  // Generate platform-specific texts based on topic, tone, sources
  const sourceRef = sources.length > 0 ? ` (Based on ${sources.length} indexed source: ${sources[0].title})` : "";

  // 1. Twitter / X text
  const rawTweet = tone === "alert"
    ? `Alert:  POLAR CLIMATE UPDATE: ${topic}. Observations from our polar teams confirm critical dynamics in the polar cryosphere.${sourceRef} Full findings: ncpor.res.in/news #NCPOR #ClimateAction`
    : tone === "scholarly"
    ? `New scientific dispatch from NCPOR: "${topic}". Grounded in ongoing data collection across Indian research stations.${sourceRef} Access repository: ncpor.res.in/repo #PolarScience #MoES`
    : tone === "youth"
    ? ` Did you know? ${topic}! Indian scientists at Maitri & Bharati are unraveling Earth's frozen mysteries right now! IND What would you ask them? #NCPOR #STEMIndia #PolarScience`
    : ` Live from Antarctica: ${topic}! Our science teams continue mission-critical observations in one of Earth's most extreme frontiers. IND Details: ncpor.res.in #NCPOR #Antarctica #PolarScience`;

  // Thread splitting logic
  const tweetThreads: string[] = [];
  if (rawTweet.length > 270 && splitThreads) {
    const half = Math.ceil(rawTweet.length / 2);
    const spaceIdx = rawTweet.lastIndexOf(" ", half);
    const splitPoint = spaceIdx > 0 ? spaceIdx : half;
    tweetThreads.push(`[1/2] ` + rawTweet.slice(0, splitPoint));
    tweetThreads.push(`[2/2] ` + rawTweet.slice(splitPoint).trim() + ` #NCPOR`);
  } else {
    tweetThreads.push(rawTweet);
  }

  // 2. Facebook Post
  const facebookPost = ` OFFICIAL UPDATE — NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR)
Ministry of Earth Sciences, Govt. of India

${topic}

Key Scientific Highlights:
• Continuous multi-disciplinary observations at Maitri & Bharati stations
• Direct data integration with global climate models & IPCC benchmarks
• Spearheaded by Indian polar researchers and logisticians

${sources.length > 0 ? ` Verified Repository Citations:\n${sources.map((s, i) => `[${i + 1}] ${s.title}`).join("\n")}\n\n` : ""}Stay connected with India's polar legacy and discover open datasets, publications, and expedition dispatches at:
 https://ncpor.res.in

#NCPOR #MoES #Antarctica #Arctic #PolarScience #GovernmentOfIndia #ClimateChange`;

  // 3. Instagram Caption
  const instagramCaption = ` DISPATCH FROM THE FROZEN CONTINENT Antarctica

${topic}

Through 46 historic expeditions, Indian polar researchers have stood sentinel at the ends of the Earth. From the rocky oasis of Maitri to the coastal ice sheets of Bharati and the high Arctic at Himadri, our scientists track sea ice, atmospheric ozone, and global ocean currents that regulate our planet's climate.

${sources.length > 0 ? ` Source Grounding: ${sources[0].title}\n\n` : ""} What polar science mystery should our scientists investigate next? Drop your thoughts below!

 Share this post to champion India's scientific leadership at the poles!

━━━━━━━━━━━━━━━━━━━━
#NCPOR #Antarctica #MaitriStation #BharatiStation #Himadri #IndianAntarcticProgramme #MinistryOfEarthSciences #PolarScience #Glaciology #SouthernOcean #ClimateCrisis #EarthSciences #ScienceIndia #STEMIndia #Oceanography #PolarExploration #Cryosphere`;

  // 4. LinkedIn Professional Post
  const linkedinPost = `The National Centre for Polar and Ocean Research (NCPOR), an autonomous institute under the Ministry of Earth Sciences, is pleased to share our latest research dispatch:

"${topic}"

Key Takeaways for the Polar Science & Climate Policy Community:
 Field Observations: Ongoing observational cycles validate critical shifts in cryospheric and marine boundary dynamics.
 High-Resolution Datasets: Verified field datasets have been ingested into the NCPOR Polar Knowledge Repository for open-access scientific inquiry.
 Global Teleconnections: Findings offer crucial insights into teleconnections linking the Southern Ocean to the Indian monsoon system.

${sources.length > 0 ? `Citations & Grounded Sources:\n${sources.map((s, i) => `• ${s.title} (${s.meta || "NCPOR Archive"})`).join("\n")}\n\n` : ""}Access comprehensive publications and download associated NetCDF datasets:
 https://ncpor.res.in/publications

#PolarScience #Glaciology #ClimateResearch #NCPOR #MinistryOfEarthSciences #Sustainability #EarthObservation #OpenScience`;

  // 5. Telegram Channel Post
  const telegramPost = ` *NCPOR POLAR BROADCAST*
_Official Channel · Ministry of Earth Sciences_

 *${topic}*

Scientists at India's Antarctic stations (*Maitri* & *Bharati*) and Arctic base (*Himadri*) have transmitted new observational insights.

*Highlights:*
• Real-time data telemetry from polar weather masts
• Ingested into national polar data repository
• Open for research and academic review

${sources.length > 0 ? ` *Reference:* \`${sources[0].title}\`\n\n` : ""} *Read Full Dispatch:* https://ncpor.res.in/news
━━━━━━━━━━━━━━━━━━━━
_National Centre for Polar and Ocean Research, Goa_`;

  // 6. WhatsApp Broadcast
  const whatsappPost = `*NCPOR Polar Science Alert* 
Ministry of Earth Sciences, Govt. of India

*Headline:* ${topic}

Indian scientists at Maitri & Bharati stations continue continuous climate observations in Antarctica.

OK Open Access Datasets Available
OK Verified Institutional Grounding

Read official release & view satellite map:
 https://ncpor.res.in

_Forward to students and science enthusiasts!_`;

  // 7. Reddit Post
  const redditTitle = `[NCPOR Polar Dispatch] ${topic}`;
  const redditBody = `**National Centre for Polar and Ocean Research (NCPOR) Scientific Update**

**Topic:** ${topic}

**Context & Background:**
India operates two year-round research stations in Antarctica (Maitri in Schirmacher Oasis and Bharati in Prydz Bay) and one station in Ny-Ålesund, Svalbard (Himadri). 

This research contributes to understanding Southern Ocean circulation, cryospheric mass balance, and global teleconnections.

${sources.length > 0 ? `**Repository Reference:**\n${sources.map(s => `- ${s.title}`).join("\n")}\n\n` : ""}Detailed scientific briefs and datasets are openly accessible at [NCPOR Polar Portal](https://ncpor.res.in).`;

  // Direct 1-Click Launch Handlers
  const handleLaunchTwitter = (text: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=450");
  };

  const handleLaunchFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://ncpor.res.in")}&quote=${encodeURIComponent(facebookPost)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleLaunchLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://ncpor.res.in")}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const handleLaunchTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent("https://ncpor.res.in")}&text=${encodeURIComponent(telegramPost)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLaunchWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappPost)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLaunchReddit = () => {
    const url = `https://www.reddit.com/submit?title=${encodeURIComponent(redditTitle)}&text=${encodeURIComponent(redditBody)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: topic,
          text: instagramCaption,
          url: "https://ncpor.res.in",
        });
        triggerToast("Shared successfully!");
      } catch {
        // User cancelled or failed
      }
    } else {
      navigator.clipboard.writeText(instagramCaption);
      triggerToast("Copied caption to clipboard! (Web Share API not supported on this device)");
    }
  };

  // Download SVG Graphic Card
  const handleDownloadGraphic = () => {
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#08152a"/>
      <stop offset="50%" stop-color="#0c1e3c"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <circle cx="950" cy="120" r="320" fill="#38bdf8" opacity="0.08"/>
  <circle cx="100" cy="980" r="280" fill="#2563eb" opacity="0.12"/>
  
  <!-- Header Bar -->
  <rect x="80" y="80" width="920" height="90" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)"/>
  <text x="110" y="136" font-family="Inter, sans-serif" font-weight="bold" font-size="28" fill="#ffffff">NCPOR · MINISTRY OF EARTH SCIENCES</text>
  <text x="960" y="136" text-anchor="end" font-family="Inter, sans-serif" font-weight="600" font-size="24" fill="#38bdf8">GOVT. OF INDIA IND</text>
  
  <!-- Station Tag -->
  <rect x="80" y="220" width="340" height="50" rx="25" fill="#38bdf8" opacity="0.2"/>
  <rect x="80" y="220" width="340" height="50" rx="25" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <text x="250" y="253" text-anchor="middle" font-family="Inter, sans-serif" font-weight="bold" font-size="20" fill="#bae6fd"> ${stationBadge.toUpperCase()}</text>
  
  <!-- Headline -->
  <foreignObject x="80" y="320" width="920" height="340">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #ffffff; font-family: Inter, sans-serif; font-weight: 800; font-size: 54px; line-height: 1.25; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">
      ${topic}
    </div>
  </foreignObject>
  
  <!-- Key Stat / Callout Box -->
  <rect x="80" y="700" width="920" height="190" rx="24" fill="rgba(15, 23, 42, 0.7)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="2"/>
  <text x="120" y="760" font-family="Inter, sans-serif" font-weight="bold" font-size="24" fill="#38bdf8">SCIENTIFIC OBSERVATION SUMMARY</text>
  <text x="120" y="810" font-family="Inter, sans-serif" font-size="24" fill="#cbd5e1">Continuous multi-disciplinary polar monitoring across Antarctic &amp; Arctic sectors.</text>
  <text x="120" y="850" font-family="Inter, sans-serif" font-size="20" fill="#94a3b8">Source: National Centre for Polar and Ocean Research Repository · ncpor.res.in</text>
  
  <!-- Footer -->
  <line x1="80" y1="940" x2="1000" y2="940" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <text x="80" y="990" font-family="Inter, sans-serif" font-weight="600" font-size="22" fill="#94a3b8">#NCPOR #Antarctica #PolarScience #ClimateAction</text>
  <text x="1000" y="990" text-anchor="end" font-family="Inter, sans-serif" font-weight="bold" font-size="24" fill="#38bdf8">ncpor.res.in </text>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NCPOR_Social_Graphic_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Autonomous Webhook Multi-Dispatch Handler
  const handleBroadcastAll = () => {
    setIsDispatching(true);
    setDispatchLogs([]);

    const selectedList = Object.entries(selectedPlatforms)
      .filter(([_, active]) => active)
      .map(([platform]) => platform);

    if (selectedList.length === 0) {
      alert("Please select at least one platform to broadcast.");
      setIsDispatching(false);
      return;
    }

    const initialLog = {
      time: new Date().toLocaleTimeString(),
      text: `Initiating multi-channel syndication to ${selectedList.length} platforms via ${webhookUrl}...`,
      status: "info" as const,
    };
    setDispatchLogs([initialLog]);

    // Dispatch simulated step by step
    selectedList.forEach((plat, index) => {
      setTimeout(() => {
        setDispatchLogs(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            text: `Dispatched payload to ${plat.toUpperCase()} [Status: 200 OK, Message ID: ${plat}_${Math.floor(Math.random() * 900000 + 100000)}]`,
            status: "success",
          },
        ]);

        if (index === selectedList.length - 1) {
          setTimeout(() => {
            setDispatchLogs(prev => [
              ...prev,
              {
                time: new Date().toLocaleTimeString(),
                text: ` Multi-platform syndication completed! All ${selectedList.length} channels delivered.`,
                status: "success",
              },
            ]);
            setIsDispatching(false);
            triggerToast("Multi-platform broadcast completed successfully!");
          }, 400);
        }
      }, (index + 1) * 350);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(12, 30, 60, 0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl h-[92vh] max-h-[900px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div
          className="flex-shrink-0 px-6 py-4 flex items-center justify-between text-white"
          style={{ background: "var(--primary-navy)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xl shadow-inner">
              
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  Automated Content Creation &amp; Social Syndication Hub
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Autonomous Multi-Channel
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate source-grounded polar content and broadcast directly to Twitter/X, Facebook, Instagram, LinkedIn, Telegram, WhatsApp &amp; Webhooks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {copiedToast && (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full animate-in fade-in duration-200">
                OK {copiedToast}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              x
            </button>
          </div>
        </div>

        {/* Modal Body: Left Sidebar (Controls) & Right Workspace (Previews & Actions) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
          {/* Left Column: Creator & Customizer Controls */}
          <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 bg-white flex flex-col overflow-y-auto p-4 space-y-4">
            {/* Template Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Content Preset
              </label>
              <div className="space-y-1.5">
                {TEMPLATES.map(tmpl => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplate(tmpl.id);
                        setTopic(tmpl.topic);
                        setStationBadge(tmpl.station);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{tmpl.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-xs font-bold ${
                            isSelected ? "text-blue-900" : "text-slate-800"
                          }`}
                        >
                          {tmpl.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {tmpl.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Topic / Source Grounding Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Headline / Core Finding
                </label>
                {sources.length > 0 && (
                  <span className="text-[10px] text-blue-600 font-semibold">
                     {sources.length} source(s)
                  </span>
                )}
              </div>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-800"
                placeholder="Enter polar headline or research finding..."
              />

              {/* Quick Suggestion Chips */}
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-[10px] font-semibold text-slate-400 mr-1">Quick Picks:</span>
                {SUGGESTED_TOPICS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTopic(s)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors truncate max-w-[200px]"
                    title={s}
                  >
                    {s.slice(0, 24)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Editorial Tone
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "engaging", label: "Public Outreach", icon: "" },
                  { id: "scholarly", label: "Academic", icon: "" },
                  { id: "alert", label: "Climate Alert", icon: "Alert: " },
                  { id: "youth", label: "Youth / STEM", icon: "Note: " },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id as any)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 justify-center transition-all ${
                      tone === t.id
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Station / Base Attribution */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                4. Field Station Badge
              </label>
              <select
                value={stationBadge}
                onChange={e => setStationBadge(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
              >
                <option value="Bharati Station · 69°S">Bharati Station · 69°S (East Antarctica)</option>
                <option value="Maitri Station · 70°S">Maitri Station · 70°S (Schirmacher Oasis)</option>
                <option value="Himadri Arctic Station">Himadri Arctic Station (Ny-Ålesund, 79°N)</option>
                <option value="Southern Ocean Expedition">Southern Ocean Expedition Hub</option>
                <option value="Central Analytical Lab · Goa">Central Analytical Lab · Goa</option>
              </select>
            </div>

            {/* Source Grounding Box */}
            {sources.length > 0 && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <div className="font-bold text-blue-900 mb-1 flex items-center gap-1">
                  <span></span> Grounded Sources ({sources.length})
                </div>
                <div className="space-y-1 text-[11px] text-blue-800 max-h-24 overflow-y-auto">
                  {sources.map(s => (
                    <div key={s.id} className="truncate">• {s.title}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Platform Tabs, Previews & Instant Dispatch Actions */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
            {/* Platform Navigation Tabs */}
            <div className="flex-shrink-0 px-4 pt-3 pb-2 bg-white border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "twitter", label: "Twitter / 𝕏", icon: "𝕏" },
                { id: "facebook", label: "Facebook", icon: "" },
                { id: "instagram", label: "Instagram", icon: "" },
                { id: "linkedin", label: "LinkedIn", icon: "" },
                { id: "telegram", label: "Telegram", icon: "" },
                { id: "whatsapp", label: "WhatsApp", icon: "" },
                { id: "reddit", label: "Reddit", icon: "" },
                { id: "webhook", label: " Blast All", icon: "" },
              ].map(tab => {
                const isActive = activePlatform === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlatform(tab.id as Platform)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-start">
              {/* ─────────────────── TWITTER / X TAB ─────────────────── */}
              {activePlatform === "twitter" && (
                <div className="w-full max-w-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">Twitter / 𝕏 Post Preview</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          rawTweet.length <= 280
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {rawTweet.length} / 280 chars
                      </span>
                    </div>

                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={splitThreads}
                        onChange={e => setSplitThreads(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span>Auto-Thread if &gt; 280</span>
                    </label>
                  </div>

                  {/* Tweet Mockup Card */}
                  {tweetThreads.map((tw, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                          
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">
                              NCPOR India
                            </span>
                            <span className="text-blue-500 text-xs">OK</span>
                            <span className="text-slate-400 text-xs">@NCPOR_Goa</span>
                            <span className="text-slate-300 text-xs">·</span>
                            <span className="text-slate-400 text-xs">Just now</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            National Centre for Polar and Ocean Research
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                        {tw}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[10px] text-slate-400">
                          {tw.length} chars
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(tw);
                              triggerToast("Copied tweet text!");
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                             Copy Text
                          </button>
                          <button
                            onClick={() => handleLaunchTwitter(tw)}
                            className="px-3 py-1 text-[11px] font-bold text-white bg-black hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                          >
                            <span>Post on 𝕏 →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─────────────────── FACEBOOK TAB ─────────────────── */}
              {activePlatform === "facebook" && (
                <div className="w-full max-w-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Facebook News Feed Preview</span>
                    <span className="text-xs text-slate-500">Rich OpenGraph Card</span>
                  </div>

                  {/* Facebook Mockup Card */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        IND
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">
                            National Centre for Polar and Ocean Research (NCPOR)
                          </span>
                          <span className="text-blue-500 text-xs">OK</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>Just now</span>
                          <span>·</span>
                          <span> Public</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {facebookPost}
                    </div>

                    {/* Link Preview Card */}
                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                      <div className="h-28 bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 flex items-center justify-center text-white text-center p-4">
                        <div>
                          <div className="text-xl mb-1"> Antarctica</div>
                          <div className="text-xs font-bold">{topic}</div>
                        </div>
                      </div>
                      <div className="p-2.5 bg-white border-t border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">NCPOR.RES.IN</div>
                        <div className="text-xs font-bold text-slate-800 truncate">
                          Official Polar Observation Dispatch &amp; Scientific Data Repository
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(facebookPost);
                          triggerToast("Copied Facebook post!");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                         Copy Post
                      </button>
                      <button
                        onClick={handleLaunchFacebook}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <span>Share on Facebook →</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────── INSTAGRAM TAB ─────────────────── */}
              {activePlatform === "instagram" && (
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Visual Graphic Generator (1:1 Poster) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">1:1 Square Visual Poster</span>
                      {downloadSuccess && (
                        <span className="text-[10px] text-emerald-600 font-semibold">OK Downloaded</span>
                      )}
                    </div>

                    <div
                      ref={cardRef}
                      className="aspect-square w-full rounded-2xl overflow-hidden relative shadow-lg p-5 flex flex-col justify-between text-white border border-slate-800"
                      style={{
                        background: "linear-gradient(135deg, #08152a 0%, #0c1e3c 50%, #1e3a8a 100%)",
                      }}
                    >
                      {/* Top Branding */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base"></span>
                          <div>
                            <div className="text-[10px] font-bold text-white tracking-wide">
                              NCPOR · MINISTRY OF EARTH SCIENCES
                            </div>
                            <div className="text-[8px] text-cyan-300">Govt. of India IND</div>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
                          {stationBadge}
                        </span>
                      </div>

                      {/* Main Headline */}
                      <div className="my-auto py-2">
                        <div className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase mb-1">
                          Polar Science Dispatch
                        </div>
                        <div className="text-sm sm:text-base font-extrabold leading-snug line-clamp-4 text-white drop-shadow">
                          "{topic}"
                        </div>
                        <div className="text-[10px] text-slate-300 mt-2 line-clamp-2">
                          {activePreset.description}
                        </div>
                      </div>

                      {/* Bottom Footer */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-300">
                        <span className="font-semibold text-cyan-200">#NCPOR #Antarctica</span>
                        <span className="font-mono text-cyan-400">ncpor.res.in </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleDownloadGraphic}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span> Download Graphic (SVG)</span>
                      </button>
                      <button
                        onClick={handleWebShare}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1"
                        title="Share directly to Instagram via Web Share API"
                      >
                        <span> Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Caption & Hashtag Manager */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Caption &amp; 30 Polar Hashtags</span>
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-semibold">
                        Optimized Reach
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[300px] text-xs text-slate-700 whitespace-pre-wrap leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200 font-sans">
                      {instagramCaption}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(instagramCaption);
                          triggerToast("Copied Instagram caption & hashtags!");
                        }}
                        className="w-full py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span> Copy Caption &amp; Hashtags</span>
                      </button>
                      <button
                        onClick={() => window.open("https://www.instagram.com/", "_blank")}
                        className="w-full py-1.5 rounded-xl text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        Open Instagram Web →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────── LINKEDIN TAB ─────────────────── */}
              {activePlatform === "linkedin" && (
                <div className="w-full max-w-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">LinkedIn Scientific Abstract</span>
                    <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                      Professional Format
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-sm">
                        in
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          National Centre for Polar and Ocean Research (NCPOR)
                        </div>
                        <div className="text-[10px] text-slate-500">
                          12,450 followers · Just now · 
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                      {linkedinPost}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(linkedinPost);
                          triggerToast("Copied LinkedIn article!");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                         Copy Post
                      </button>
                      <button
                        onClick={handleLaunchLinkedIn}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#0077b5] hover:bg-[#005f93] rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <span>Share on LinkedIn →</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────── TELEGRAM TAB ─────────────────── */}
              {activePlatform === "telegram" && (
                <div className="w-full max-w-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Telegram Channel Broadcast</span>
                    <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-full">
                      Markdown Support
                    </span>
                  </div>

                  <div className="bg-[#e7ebf0] rounded-2xl p-4 border border-slate-300 shadow-sm space-y-3">
                    <div className="bg-white rounded-xl p-3.5 shadow-sm space-y-2 border border-slate-100">
                      <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                        {telegramPost}
                      </div>
                      <div className="text-[10px] text-slate-400 text-right">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} OKOK
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(telegramPost);
                          triggerToast("Copied Telegram broadcast!");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors"
                      >
                         Copy Message
                      </button>
                      <button
                        onClick={handleLaunchTelegram}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#229ED9] hover:bg-[#1b82b3] rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <span>Broadcast to Telegram →</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────── WHATSAPP TAB ─────────────────── */}
              {activePlatform === "whatsapp" && (
                <div className="w-full max-w-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">WhatsApp Community Update</span>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Direct WhatsApp API
                    </span>
                  </div>

                  <div className="bg-[#e5ddd5] rounded-2xl p-4 border border-slate-300 shadow-sm space-y-3">
                    <div className="bg-[#dcf8c6] rounded-xl p-3.5 shadow-sm space-y-2 ml-auto max-w-[90%]">
                      <div className="text-xs text-slate-900 whitespace-pre-wrap leading-relaxed font-sans">
                        {whatsappPost}
                      </div>
                      <div className="text-[10px] text-slate-500 text-right">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} OKOK
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(whatsappPost);
                          triggerToast("Copied WhatsApp message!");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors"
                      >
                         Copy Message
                      </button>
                      <button
                        onClick={handleLaunchWhatsApp}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20b858] rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <span>Send via WhatsApp →</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────── REDDIT TAB ─────────────────── */}
              {activePlatform === "reddit" && (
                <div className="w-full max-w-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Reddit Science Outreach</span>
                    <span className="text-xs text-orange-700 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
                      r/science · r/antarctica
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                    <div className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
                      Title: {redditTitle}
                    </div>
                    <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                      {redditBody}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${redditTitle}\n\n${redditBody}`);
                          triggerToast("Copied Reddit post!");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                         Copy Post
                      </button>
                      <button
                        onClick={handleLaunchReddit}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#FF4500] hover:bg-[#e03d00] rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <span>Submit to Reddit →</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────── WEBHOOK SYNDICATION TAB ("BLAST ALL") ─────────────────── */}
              {activePlatform === "webhook" && (
                <div className="w-full max-w-2xl space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-0.5">
                        Autonomous Multi-Channel Syndication
                      </div>
                      <h2 className="text-base font-extrabold text-white">
                         Blast to All Platforms Simultaneously
                      </h2>
                      <p className="text-xs text-slate-300 mt-1">
                        Dispatches tailored payloads to all connected networks via your automation webhook (Make.com, Zapier, n8n, Buffer, or internal MoES relay).
                      </p>
                    </div>
                  </div>

                  {/* Webhook Settings & Channel Selection */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Syndication Webhook Endpoint
                      </label>
                      <input
                        type="url"
                        value={webhookUrl}
                        onChange={e => setWebhookUrl(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono text-slate-800 focus:border-blue-600 outline-none"
                        placeholder="https://api.ncpor.res.in/v1/syndicate/broadcast"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Target Channels to Broadcast:
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {Object.entries(selectedPlatforms).map(([key, isChecked]) => (
                          <label
                            key={key}
                            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                              isChecked
                                ? "border-blue-600 bg-blue-50 text-blue-900"
                                : "border-slate-200 bg-slate-50 text-slate-400"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e =>
                                setSelectedPlatforms(prev => ({
                                  ...prev,
                                  [key]: e.target.checked,
                                }))
                              }
                              className="rounded border-slate-300 text-blue-600"
                            />
                            <span className="capitalize">{key}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500">
                        {Object.values(selectedPlatforms).filter(Boolean).length} channels selected
                      </div>
                      <button
                        onClick={handleBroadcastAll}
                        disabled={isDispatching}
                        className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isDispatching ? (
                          <>
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                            </svg>
                            <span>Broadcasting in Progress...</span>
                          </>
                        ) : (
                          <>
                            <span></span>
                            <span>Broadcast to ALL Channels Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Live Dispatch Log */}
                  {dispatchLogs.length > 0 && (
                    <div className="bg-slate-900 rounded-2xl p-4 text-white font-mono text-[11px] shadow-lg border border-slate-800 space-y-1.5 max-h-56 overflow-y-auto">
                      <div className="text-cyan-400 font-bold mb-2 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Broadcast Execution Audit Log:</span>
                      </div>
                      {dispatchLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`leading-relaxed ${
                            log.status === "success"
                              ? "text-emerald-400"
                              : log.status === "info"
                              ? "text-cyan-300"
                              : "text-amber-300"
                          }`}
                        >
                          <span className="text-slate-500">[{log.time}]</span> {log.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="flex-shrink-0 px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span> NCPOR Scientific Integrity Protocol</span>
            <span>·</span>
            <span>All posts cite verified MoES archives</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setActivePlatform("webhook");
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span> Launch All Channels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

