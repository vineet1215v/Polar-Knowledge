import { useState, useRef, useEffect } from "react"
import type { WorkspaceSource } from "../workspaceStore"

export interface ResearchRoomMember {
  id: string
  name: string
  role: string
  institution: string
  avatar: string
  status: "online" | "in-field" | "idle"
}

export interface ResearchRoomMessage {
  id: string
  sender: string
  role: string
  institution: string
  avatar: string
  timestamp: string
  text: string
  isAI?: boolean
  attachment?: {
    type: "dataset" | "chart" | "code" | "sample"
    label: string
    sizeOrMeta: string
  }
}

export interface ResearchRoomTask {
  id: string
  title: string
  assignee: string
  status: "todo" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
}

export interface ResearchRoom {
  id: string
  title: string
  domain: "Antarctica" | "Arctic" | "Southern Ocean" | "Technology" | "Atmosphere"
  domainColor: string
  station: string
  expeditionRef: string
  leadScientist: {
    name: string
    role: string
    institution: string
    avatar: string
  }
  researchQuestion: string
  hypothesis: string
  activeMembers: ResearchRoomMember[]
  huddleActive: boolean
  huddleParticipants: string[]
  messages: ResearchRoomMessage[]
  connectedDatasets: {
    id: string
    title: string
    format: string
    size: string
    doi: string
    parameters: string[]
  }[]
  notes: string
  tasks: ResearchRoomTask[]
  findings: string[]
}

const INITIAL_ROOMS: ResearchRoom[] = [
  {
    id: "room-iae46-glaciology",
    title: "46th IAE — Princess Astrid Paleoclimate Ice Core & Albedo Synthesis",
    domain: "Antarctica",
    domainColor: "bg-blue-600",
    station: "Maitri Station & Princess Astrid Coast (70°46′S)",
    expeditionRef: "46th Indian Antarctic Expedition",
    leadScientist: {
      name: "Dr. Aarav Sharma",
      role: "Lead Glaciologist",
      institution: "NCPOR · MoES",
      avatar: "👨‍🔬"
    },
    researchQuestion: "What is the correlation between the 2023–2024 Weddell Sea ice minimum and deep Holocene ice core layer thinning along Princess Astrid Coast?",
    hypothesis: "Accelerated austral summer albedo collapse induces regional boundary layer warming, modifying seasonal accumulation bands in the upper 120m firn layers.",
    activeMembers: [
      { id: "m1", name: "Dr. Aarav Sharma", role: "Lead Glaciologist", institution: "NCPOR", avatar: "👨‍🔬", status: "online" },
      { id: "m2", name: "Dr. Maya Sen", role: "Oceanographer", institution: "MoES", avatar: "👩‍🔬", status: "online" },
      { id: "m3", name: "Er. Tenzin Dorji", role: "Drilling Engineer", institution: "WIHG Dehradun", avatar: "👷‍♂️", status: "in-field" },
      { id: "m4", name: "Dr. Sunita Rao", role: "Isotope Geochemist", institution: "IIT Bombay", avatar: "🔬", status: "idle" },
      { id: "m5", name: "PolarAI Copilot", role: "Autonomous Research Agent", institution: "NCPOR AI Core", avatar: "🤖", status: "online" }
    ],
    huddleActive: true,
    huddleParticipants: ["Dr. Aarav Sharma", "Dr. Maya Sen", "PolarAI Copilot"],
    messages: [
      {
        id: "msg-1",
        sender: "Dr. Aarav Sharma",
        role: "Lead Glaciologist",
        institution: "NCPOR",
        avatar: "👨‍🔬",
        timestamp: "09:42 AM",
        text: "Team, the electromechanical drill reached 92 meters depth along Princess Astrid Coast before the katabatic winds surged to 48 knots.",
        attachment: {
          type: "sample",
          label: "Core-Barrel-Section-92m.png",
          sizeOrMeta: "Pristine Ice Cylinder · 92m depth"
        }
      },
      {
        id: "msg-2",
        sender: "Er. Tenzin Dorji",
        role: "Drilling Engineer",
        institution: "WIHG Dehradun",
        avatar: "👷‍♂️",
        timestamp: "09:48 AM",
        text: "Confirmed. Motor torque spiked due to hard firn-to-ice transition at 88.4m. We have sealed the core segments in insulated fiberglass barrels at -22°C."
      },
      {
        id: "msg-3",
        sender: "Dr. Maya Sen",
        role: "Oceanographer",
        institution: "MoES",
        avatar: "👩‍🔬",
        timestamp: "09:55 AM",
        text: "Checking satellite telemetry: the albedo drop in Prydz Bay was 0.18 below climatological mean during extraction week. This strongly corroborates our hypothesis.",
        attachment: {
          type: "dataset",
          label: "NCPOR_SeaIce_Conc_Feb2024.nc",
          sizeOrMeta: "NetCDF · 184 MB · Level-3"
        }
      },
      {
        id: "msg-4",
        sender: "PolarAI Copilot",
        role: "Autonomous Research Agent",
        institution: "NCPOR AI Core",
        avatar: "🤖",
        timestamp: "10:02 AM",
        isAI: true,
        text: "Synthesizing cross-correlation: δ18O depletion trends in your 92m core match the 1998 austral anomaly within 94.2% confidence. Recommended next step: run high-resolution electrical conductivity measurements (ECM) on the 88–92m transition segment."
      }
    ],
    connectedDatasets: [
      {
        id: "ds-1",
        title: "Princess Astrid Coast Deep Ice Core Paleoclimate Profiles",
        format: "NetCDF / CSV",
        size: "248 MB",
        doi: "10.5067/NCPOR-IAE46-IC01",
        parameters: ["Depth (m)", "δ18O (‰)", "δD (‰)", "Dust (ppb)", "Conductivity (μS/cm)"]
      },
      {
        id: "ds-2",
        title: "Maitri Station Automated Weather Station (AWS) 10-Min Telemetry",
        format: "NetCDF",
        size: "1.2 GB",
        doi: "10.5067/NCPOR-MAITRI-AWS24",
        parameters: ["Air Temp (°C)", "Wind Velocity (m/s)", "Relative Humidity", "Solar Radiation (W/m²)"]
      }
    ],
    notes: `### Working Hypothesis & Field Notes — Princess Astrid Project
1. **Core Retrieval Depth**: Target 120m reached 92m as of Day 14. 
2. **Temperature Control**: All core segments buffered in ethylene glycol sleeves at -22°C.
3. **Observation**: Firn-ice transition occurs at 88.4m, ~4m shallower than the 2012 benchmark core.
4. **Action Item**: Schedule courier dispatch to NCPOR CAL (Central Analytical Laboratory, Goa) via reefer container on R/V Kronprins Haakon.`,
    tasks: [
      { id: "t1", title: "Complete high-resolution ECM scanning of Core Barrels 85-92m", assignee: "Dr. Sunita Rao", status: "in-progress", priority: "high" },
      { id: "t2", title: "Verify katabatic wind telemetry sync with AWS station #2", assignee: "Er. Tenzin Dorji", status: "completed", priority: "medium" },
      { id: "t3", title: "Submit preliminary paleoclimate brief for SCAR 2026 symposium", assignee: "Dr. Aarav Sharma", status: "todo", priority: "high" }
    ],
    findings: [
      "Firn-ice transition verified at 88.4m (4.2m shallower than 2012 observation).",
      "Albedo collapse over adjacent fast ice was -0.18 below historical seasonal baseline.",
      "No thermal fracturing observed across 92 retrieved core sections."
    ]
  },
  {
    id: "room-indarc-atlantification",
    title: "IndARC Mooring Telemetry & Arctic Fjord Atlantification Watch",
    domain: "Arctic",
    domainColor: "bg-indigo-600",
    station: "Himadri Station, Ny-Ålesund, Svalbard (78°55′N)",
    expeditionRef: "Indian Arctic Programme 2024",
    leadScientist: {
      name: "Dr. Maya Sen",
      role: "Senior Physical Oceanographer",
      institution: "NCPOR · MoES",
      avatar: "👩‍🔬"
    },
    researchQuestion: "How deeply do pulsed West Spitsbergen Current warm waters intrude the 192m IndARC mooring array during the Svalbard polar night?",
    hypothesis: "Intense winter cyclonic passage drives baroclinic coastal trapped waves that push Atlantic water (>2.5°C) across the Kongsfjorden sill, preventing ice cover formation.",
    activeMembers: [
      { id: "m2-1", name: "Dr. Maya Sen", role: "Oceanographer", institution: "MoES", avatar: "👩‍🔬", status: "online" },
      { id: "m2-2", name: "Dr. Hans Kristiansen", role: "Cryosphere Lead", institution: "Norwegian Polar Institute", avatar: "👨‍🏫", status: "online" },
      { id: "m2-3", name: "Shri Vivek Verma", role: "ADCP Telemetry Specialist", institution: "NIO Goa", avatar: "👨‍💻", status: "online" },
      { id: "m2-4", name: "PolarAI Copilot", role: "Autonomous Research Agent", institution: "NCPOR AI Core", avatar: "🤖", status: "online" }
    ],
    huddleActive: false,
    huddleParticipants: [],
    messages: [
      {
        id: "ind-1",
        sender: "Shri Vivek Verma",
        role: "ADCP Telemetry Specialist",
        institution: "NIO Goa",
        avatar: "👨‍💻",
        timestamp: "Yesterday, 04:15 PM",
        text: "Acoustic modem link to IndARC mooring at 192m is operational. 75kHz ADCP telemetry shows current velocity pulses reaching 34 cm/s into the fjord."
      },
      {
        id: "ind-2",
        sender: "Dr. Maya Sen",
        role: "Oceanographer",
        institution: "MoES",
        avatar: "👩‍🔬",
        timestamp: "Yesterday, 05:20 PM",
        text: "Look at the temperature profile at 150m: water stayed above +2.8°C throughout the continuous darkness of December. Kongsfjorden had zero fast ice again."
      },
      {
        id: "ind-3",
        sender: "Dr. Hans Kristiansen",
        role: "Cryosphere Lead",
        institution: "NPI",
        avatar: "👨‍🏫",
        timestamp: "Today, 08:30 AM",
        text: "This matches our glacier calving observations at Kronebreen terminus. Atlantification is accelerating terminus retreat by ~14 meters per month."
      }
    ],
    connectedDatasets: [
      {
        id: "ds-ind-1",
        title: "Kongsfjorden IndARC 192m Mooring Hourly Hydrographic Time Series",
        format: "NetCDF",
        size: "820 MB",
        doi: "10.5067/INDARC-KONG-2024",
        parameters: ["Depth", "Water Temp (°C)", "Practical Salinity (PSU)", "Turbidity (NTU)", "Dissolved O2"]
      }
    ],
    notes: `### IndARC Scientific Watch Notes
- **Mooring Location**: Kongsfjorden center (78°55'N, 11°53'E)
- **Deployment Depth**: 192 meters
- **Key finding**: Atlantic water pulses now occur 11 times per polar night season compared to 3 times in 2014.`,
    tasks: [
      { id: "t-ind-1", title: "Calibrate CTD conductivity cells before austral acoustic recovery", assignee: "Shri Vivek Verma", status: "in-progress", priority: "high" },
      { id: "t-ind-2", title: "Publish joint NCPOR-NPI Kongsfjorden winter heat flux report", assignee: "Dr. Maya Sen", status: "todo", priority: "medium" }
    ],
    findings: [
      "Subsurface temperatures at 150m depth never dropped below +2.6°C during polar night.",
      "West Spitsbergen Current inflow volume increased 18% over the five-year rolling average."
    ]
  },
  {
    id: "room-cmlre-otolith-acidification",
    title: "Antarctic Toothfish Otolith Micro-CT & Southern Ocean Acidification",
    domain: "Southern Ocean",
    domainColor: "bg-purple-600",
    station: "Bharati Station BioLab / Prydz Bay (69°24′S)",
    expeditionRef: "CCAMLR Scientific Survey 2024",
    leadScientist: {
      name: "Dr. Ramesh Rao",
      role: "Polar Biologist",
      institution: "NCPOR Goa · MoES",
      avatar: "👨‍🔬"
    },
    researchQuestion: "Does shoaling of the aragonite saturation horizon in the Indian sector of the Southern Ocean alter sagittal otolith CaCO3 ring density?",
    hypothesis: "Lower winter pH (<7.92) impairs calcium carbonate crystallization rates in juvenile Dissostichus mawsoni, producing detectable microstructural porosity in otolith growth rings.",
    activeMembers: [
      { id: "m3-1", name: "Dr. Ramesh Rao", role: "Polar Biologist", institution: "NCPOR", avatar: "👨‍🔬", status: "online" },
      { id: "m3-2", name: "Dr. Ananya Joshi", role: "Micro-CT Specialist", institution: "NCPOR", avatar: "👩‍🔬", status: "online" },
      { id: "m3-3", name: "PolarAI Copilot", role: "Autonomous Research Agent", institution: "NCPOR AI Core", avatar: "🤖", status: "online" }
    ],
    huddleActive: false,
    huddleParticipants: [],
    messages: [
      {
        id: "ot-1",
        sender: "Dr. Ramesh Rao",
        role: "Polar Biologist",
        institution: "NCPOR",
        avatar: "👨‍🔬",
        timestamp: "Yesterday, 11:10 AM",
        text: "We completed 3D tomographic scanning of 2,450 sagittal otolith vouchers from our Southern Ocean cruises. The data vouchers are officially uploaded to the open portal."
      },
      {
        id: "ot-2",
        sender: "Dr. Ananya Joshi",
        role: "Micro-CT Specialist",
        institution: "NCPOR",
        avatar: "👩‍🔬",
        timestamp: "Yesterday, 02:40 PM",
        text: "Micro-CT slices show a 14% decrease in mean otolith ring density for specimens collected south of 65°S compared to 2014 baseline specimens."
      }
    ],
    connectedDatasets: [
      {
        id: "ds-ot-1",
        title: "Southern Ocean Dissostichus mawsoni Otolith Tomography Repository",
        format: "TIFF 3D / HDF5",
        size: "3.4 GB",
        doi: "10.5067/NCPOR-OTOLITH-SO24",
        parameters: ["Specimen ID", "Otolith Mass (mg)", "Volume (mm³)", "CaCO3 Density (g/cm³)", "Ring Count"]
      }
    ],
    notes: `### Otolith Micro-CT Analysis Framework
- 2,450 otolith specimens digitized with 2.4 micron voxel resolution.
- Coupled with CTD pH and dissolved inorganic carbon (DIC) transects across Prydz Bay.`,
    tasks: [
      { id: "t-ot-1", title: "Correlate Otolith density with NetCDF ocean acidification grids", assignee: "Dr. Ananya Joshi", status: "in-progress", priority: "high" },
      { id: "t-ot-2", title: "Submit voucher samples to National Polar Biodiversity Repository", assignee: "Dr. Ramesh Rao", status: "todo", priority: "low" }
    ],
    findings: [
      "Significant decrease in otolith core density detected in post-2020 toothfish cohorts.",
      "Aragonite saturation state (Ω_arag) dropped below 1.1 at depths > 400m during austral winter."
    ]
  },
  {
    id: "room-maitri-microgrid",
    title: "Maitri Clean Energy Transition & Hybrid Microgrid Study",
    domain: "Technology",
    domainColor: "bg-emerald-600",
    station: "Maitri Station, Schirmacher Oasis",
    expeditionRef: "Green Polar Stations Initiative",
    leadScientist: {
      name: "Er. Vikram Deshmukh",
      role: "Renewable Energy Lead",
      institution: "MoES & NCPOR",
      avatar: "⚡"
    },
    researchQuestion: "Can containerized vertical-axis wind turbines paired with bifacial solar panels and lithium-iron-phosphate storage achieve >20% diesel displacement in Antarctica?",
    hypothesis: "High Antarctic wind speeds combined with high albedo reflection from surrounding snow cover provide steady energy generation to reduce generator fossil fuel burn.",
    activeMembers: [
      { id: "m4-1", name: "Er. Vikram Deshmukh", role: "Renewable Energy Lead", institution: "MoES", avatar: "⚡", status: "online" },
      { id: "m4-2", name: "Er. Sanjay Mehta", role: "Station Electrical Engineer", institution: "Maitri Winter Crew", avatar: "👷", status: "online" },
      { id: "m4-3", name: "PolarAI Copilot", role: "Autonomous Research Agent", institution: "NCPOR AI Core", avatar: "🤖", status: "online" }
    ],
    huddleActive: false,
    huddleParticipants: [],
    messages: [
      {
        id: "mg-1",
        sender: "Er. Vikram Deshmukh",
        role: "Renewable Energy Lead",
        institution: "MoES",
        avatar: "⚡",
        timestamp: "Today, 07:15 AM",
        text: "Maitri microgrid logs for the past 30 days confirm: 22.4% reduction in diesel consumption! The vertical-axis turbine survived a 68-knot gust without over-revving."
      },
      {
        id: "mg-2",
        sender: "Er. Sanjay Mehta",
        role: "Station Electrical Engineer",
        institution: "Maitri Winter Crew",
        avatar: "👷",
        timestamp: "Today, 08:00 AM",
        text: "Battery thermal enclosure stayed at +14°C using recycled waste heat from the generator exhaust. Storage capacity has not degraded despite -34°C ambient conditions."
      }
    ],
    connectedDatasets: [
      {
        id: "ds-mg-1",
        title: "Maitri Station Hybrid Microgrid Electrical Generation & Fuel Displacement Logs",
        format: "CSV / JSON",
        size: "68 MB",
        doi: "10.5067/MAITRI-MICROGRID-2024",
        parameters: ["Wind Power (kW)", "Solar Bifacial (kW)", "Diesel Baseline (L/h)", "Battery SOC (%)"]
      }
    ],
    notes: `### Maitri Zero-Emission Station Project
- **Objective**: Target 40% clean power by 2028 before commissioning Maitri-II.
- **Microgrid Specs**: 2x 15kW VAWT turbines + 40kW bifacial PV + 120kWh LFP battery array.`,
    tasks: [
      { id: "t-mg-1", title: "Inspect vertical turbine guy wires after winter blizzard", assignee: "Er. Sanjay Mehta", status: "completed", priority: "high" },
      { id: "t-mg-2", title: "Model solar-wind hybrid scalability for Bharati-II station design", assignee: "Er. Vikram Deshmukh", status: "in-progress", priority: "medium" }
    ],
    findings: [
      "22.4% measured reduction in station diesel dependency achieved in first quarter.",
      "Bifacial solar panels generated 28% additional power via snow surface albedo reflection."
    ]
  }
]

interface Props {
  onNavigate?: (p: string) => void
  onAddToWorkspace?: (source: WorkspaceSource) => void
}

export default function ResearchRooms({ onNavigate, onAddToWorkspace }: Props) {
  const [rooms, setRooms] = useState<ResearchRoom[]>(INITIAL_ROOMS)
  const [selectedRoomId, setSelectedRoomId] = useState<string>("room-iae46-glaciology")
  const [selectedTab, setSelectedTab] = useState<"comms" | "datasets" | "notes" | "tasks" | "ai">("comms")
  const [filterDomain, setFilterDomain] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Room Communication State
  const [newMessageText, setNewMessageText] = useState("")
  const [isAudioHuddleActive, setIsAudioHuddleActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [editableNotes, setEditableNotes] = useState("")
  const [notesSavedToast, setNotesSavedToast] = useState(false)

  // New Room Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newRoomTitle, setNewRoomTitle] = useState("")
  const [newRoomDomain, setNewRoomDomain] = useState<ResearchRoom["domain"]>("Antarctica")
  const [newRoomStation, setNewRoomStation] = useState("")
  const [newRoomQuestion, setNewRoomQuestion] = useState("")

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Active Room
  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0]

  // Initialize editable notes when room changes
  useEffect(() => {
    if (activeRoom) {
      setEditableNotes(activeRoom.notes)
    }
  }, [selectedRoomId])

  // Scroll messages to bottom
  useEffect(() => {
    if (selectedTab === "comms") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeRoom.messages, selectedTab])

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchDomain = filterDomain === "All" || r.domain === filterDomain
    const query = searchQuery.toLowerCase().trim()
    const matchQuery =
      !query ||
      r.title.toLowerCase().includes(query) ||
      r.station.toLowerCase().includes(query) ||
      r.researchQuestion.toLowerCase().includes(query) ||
      r.leadScientist.name.toLowerCase().includes(query)
    return matchDomain && matchQuery
  })

  // Send a new message in the room
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newMessageText.trim()) return

    const newMsg: ResearchRoomMessage = {
      id: `user-msg-${Date.now()}`,
      sender: "Dr. You (Current Scientist)",
      role: "Visiting Research Fellow",
      institution: "NCPOR User Workspace",
      avatar: "👨‍🔬",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: newMessageText.trim()
    }

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === activeRoom.id) {
          return {
            ...r,
            messages: [...r.messages, newMsg]
          }
        }
        return r
      })
    )

    const sentText = newMessageText.trim()
    setNewMessageText("")

    // Simulated responsive AI Co-pilot reply if question asked
    if (sentText.includes("?") || sentText.toLowerCase().includes("ai") || sentText.toLowerCase().includes("data")) {
      setTimeout(() => {
        const aiReply: ResearchRoomMessage = {
          id: `ai-reply-${Date.now()}`,
          sender: "PolarAI Copilot",
          role: "Autonomous Research Agent",
          institution: "NCPOR AI Core",
          avatar: "🤖",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isAI: true,
          text: `Analysis grounded in ${activeRoom.title}: Your inquiry has been matched against the active telemetry and NetCDF metadata. We observe consistent parameter alignment with the project's primary hypothesis.`
        }
        setRooms((prev) =>
          prev.map((r) => {
            if (r.id === activeRoom.id) {
              return {
                ...r,
                messages: [...r.messages, aiReply]
              }
            }
            return r
          })
        )
      }, 1200)
    }
  }

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === activeRoom.id) {
          return {
            ...r,
            tasks: r.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    status: t.status === "completed" ? "todo" : "completed"
                  }
                : t
            )
          }
        }
        return r
      })
    )
    showToast("Task status updated!")
  }

  // Save Notes
  const handleSaveNotes = () => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === activeRoom.id) {
          return {
            ...r,
            notes: editableNotes
          }
        }
        return r
      })
    )
    setNotesSavedToast(true)
    setTimeout(() => setNotesSavedToast(false), 2500)
    showToast("Research notes saved and synced to room participants!")
  }

  // Create New Room
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomTitle.trim()) return

    const newRoom: ResearchRoom = {
      id: `room-${Date.now()}`,
      title: newRoomTitle.trim(),
      domain: newRoomDomain,
      domainColor:
        newRoomDomain === "Antarctica"
          ? "bg-blue-600"
          : newRoomDomain === "Arctic"
            ? "bg-indigo-600"
            : newRoomDomain === "Southern Ocean"
              ? "bg-purple-600"
              : newRoomDomain === "Technology"
                ? "bg-emerald-600"
                : "bg-amber-600",
      station: newRoomStation.trim() || "Maitri / Himadri Station",
      expeditionRef: "Initiated by Polar Knowledge Portal",
      leadScientist: {
        name: "Dr. You (Current Scientist)",
        role: "Project Principal Investigator",
        institution: "NCPOR User Workspace",
        avatar: "👨‍🔬"
      },
      researchQuestion: newRoomQuestion.trim() || "Investigate polar environmental variables and teleconnections.",
      hypothesis: "Empirical observation will establish causal links between polar anomalies and global climate drivers.",
      activeMembers: [
        { id: "m-new-1", name: "Dr. You", role: "Principal Investigator", institution: "NCPOR", avatar: "👨‍🔬", status: "online" },
        { id: "m-new-2", name: "PolarAI Copilot", role: "Research Assistant", institution: "NCPOR AI Core", avatar: "🤖", status: "online" }
      ],
      huddleActive: false,
      huddleParticipants: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "PolarAI Copilot",
          role: "Autonomous Research Agent",
          institution: "NCPOR AI Core",
          avatar: "🤖",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isAI: true,
          text: `Welcome to the new research room "${newRoomTitle}". I am your grounded AI research partner. You can attach NetCDF datasets, initiate audio huddles, and collaborate with scientists here.`
        }
      ],
      connectedDatasets: [],
      notes: `### Project Working Notes: ${newRoomTitle}\n- **Principal Investigator**: Dr. You\n- **Objective**: ${newRoomQuestion}\n- Status: Initialized`,
      tasks: [
        { id: "t-init-1", title: "Attach primary NetCDF or CTD dataset", assignee: "Dr. You", status: "todo", priority: "high" },
        { id: "t-init-2", title: "Draft first research brief and protocol", assignee: "Dr. You", status: "todo", priority: "medium" }
      ],
      findings: ["Room initialized with active real-time communication."]
    }

    setRooms([newRoom, ...rooms])
    setSelectedRoomId(newRoom.id)
    setIsCreateModalOpen(false)
    setNewRoomTitle("")
    setNewRoomStation("")
    setNewRoomQuestion("")
    showToast(`Created new Research Room: "${newRoom.title.slice(0, 30)}..."`)
  }

  const domains = ["All", "Antarctica", "Arctic", "Southern Ocean", "Technology", "Atmosphere"]

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "var(--content-bg, #f8fafc)" }}>
      {/* ── TOP HEADER ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                <span>COLLABORATIVE SCIENCE PLATFORM</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                MoES · NCPOR · Real-Time Research Rooms
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#003366] tracking-tight">
              Polar Research Rooms
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Secure multi-disciplinary rooms for scientists across Antarctic and Arctic expeditions to communicate, analyze NetCDF datasets, and co-author findings.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-linear-to-r from-[#003366] to-[#0284c7] hover:from-[#002244] hover:to-[#0369a1] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>➕</span>
              <span>Create Research Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: ROOMS LIST SIDEBAR + ACTIVE ROOM WORKSPACE ────── */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-3 md:p-5 gap-4">
        {/* LEFT COLUMN: ACTIVE ROOMS DIRECTORY ─────────────────────────────── */}
        <div className="w-72 md:w-80 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden flex-shrink-0">
          {/* Search & Domain Filter */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50/70">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms, scientists, ice..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-hidden focus:border-[#003366]"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {domains.map((dom) => (
                <button
                  key={dom}
                  onClick={() => setFilterDomain(dom)}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                    filterDomain === dom
                      ? "bg-[#003366] text-white shadow-2xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1.5 space-y-1">
            {filteredRooms.map((room) => {
              const isSelected = room.id === activeRoom.id
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`p-3 rounded-xl transition cursor-pointer flex flex-col gap-1.5 border ${
                    isSelected
                      ? "bg-blue-50/90 border-blue-300 shadow-2xs"
                      : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${room.domainColor}`}>
                      {room.domain}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{room.activeMembers.length} active</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                    {room.title}
                  </h3>

                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <span>{room.leadScientist.avatar}</span>
                    <span className="truncate">{room.leadScientist.name}</span>
                    <span>·</span>
                    <span className="truncate max-w-[90px]">{room.station.split(",")[0]}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Live Comms Status */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>NCPOR Secure Mesh Active</span>
            </span>
            <span>{rooms.length} Rooms Total</span>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE RESEARCH ROOM WORKSPACE ────────────────────── */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Room Header Strip */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <div>
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${activeRoom.domainColor}`}>
                  {activeRoom.domain}
                </span>
                <span className="font-bold text-slate-600 text-[11px]">
                  📍 {activeRoom.station}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 text-[11px] font-mono">
                  {activeRoom.expeditionRef}
                </span>
              </div>
              <h2 className="font-extrabold text-base md:text-lg text-slate-900">
                {activeRoom.title}
              </h2>
            </div>

            {/* Room Actions: Audio Huddle + Invite */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Audio Huddle Button */}
              <button
                onClick={() => {
                  setIsAudioHuddleActive(!isAudioHuddleActive)
                  showToast(isAudioHuddleActive ? "Left Audio Huddle" : "Joined Polar Audio Huddle 🎙️")
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                  isAudioHuddleActive
                    ? "bg-emerald-600 text-white border-emerald-500 animate-pulse"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <span>{isAudioHuddleActive ? "🎙️ In Huddle" : "📞 Join Audio"}</span>
                {isAudioHuddleActive && (
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-white animate-bounce" />
                    <span className="w-1 h-4 bg-white animate-bounce delay-75" />
                    <span className="w-1 h-2 bg-white animate-bounce delay-150" />
                  </span>
                )}
              </button>

              {/* Members Avatars */}
              <div className="flex items-center -space-x-1.5">
                {activeRoom.activeMembers.map((m) => (
                  <div
                    key={m.id}
                    className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs shadow-2xs"
                    title={`${m.name} (${m.role}, ${m.institution}) - ${m.status}`}
                  >
                    {m.avatar}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Audio Huddle Bar (when active) */}
          {isAudioHuddleActive && (
            <div className="bg-linear-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold tracking-wide text-emerald-200">
                  🎙️ LIVE AUDIO HUDDLE ACTIVE
                </span>
                <span className="text-emerald-300">·</span>
                <span className="text-emerald-100 text-[11px]">
                  Speaking: Dr. Aarav Sharma (Princess Astrid Field Station)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    isMuted ? "bg-rose-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                >
                  {isMuted ? "🔇 Unmute Mic" : "🎙️ Mute Mic"}
                </button>
                <button
                  onClick={() => setIsAudioHuddleActive(false)}
                  className="px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/40 text-xs font-semibold cursor-pointer"
                >
                  Leave
                </button>
              </div>
            </div>
          )}

          {/* Room Navigation Tabs */}
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs flex-shrink-0">
            {[
              ["comms", "💬 Project Communication"],
              ["datasets", `📊 Connected Datasets (${activeRoom.connectedDatasets.length})`],
              ["notes", "📝 Research Notes"],
              ["tasks", `✅ Action Tasks (${activeRoom.tasks.filter((t) => t.status !== "completed").length})`],
              ["ai", "🤖 In-Room AI Copilot"],
            ].map(([tabKey, label]) => (
              <button
                key={tabKey}
                onClick={() => setSelectedTab(tabKey as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedTab === tabKey
                    ? "bg-[#003366] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── WORKSPACE CONTENT AREA ──────────────────────────────────────── */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* ── 1. COMMS TAB: REAL-TIME DISCUSSION STREAM ─────────────────── */}
            {selectedTab === "comms" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Hypothesis Callout Banner */}
                <div className="p-3 bg-blue-50/80 border-b border-blue-100 text-xs text-slate-700 flex items-start gap-2.5 flex-shrink-0">
                  <span className="text-base flex-shrink-0">🔬</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#003366] block text-[11px] uppercase tracking-wide">
                      Active Research Question &amp; Hypothesis
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      "{activeRoom.researchQuestion}"
                    </p>
                  </div>
                </div>

                {/* Messages Chat Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {activeRoom.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        msg.isAI ? "bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                        {msg.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-xs text-slate-900">
                            {msg.sender}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {msg.role} · {msg.institution}
                          </span>
                          {msg.isAI && (
                            <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                              AI COPILOT
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono ml-auto">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {msg.text}
                        </p>

                        {/* Message Attachment Preview if any */}
                        {msg.attachment && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between max-w-md">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {msg.attachment.type === "dataset" ? "📊" : "🔬"}
                              </span>
                              <div>
                                <div className="font-bold text-xs text-slate-800">
                                  {msg.attachment.label}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {msg.attachment.sizeOrMeta}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => showToast(`Accessing attachment: ${msg.attachment?.label}`)}
                              className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-bold text-[#003366] cursor-pointer"
                            >
                              Inspect
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Comms Chips */}
                <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] flex-shrink-0">
                  <span className="text-slate-400 font-semibold flex-shrink-0">Quick Post:</span>
                  {[
                    "Deploy CTD probe at 150m",
                    "Blizzard warning: Winds > 45 kts",
                    "NetCDF telemetry sync complete",
                    "Ask PolarAI to check correlation",
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setNewMessageText(chip)}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition whitespace-nowrap cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0"
                >
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder={`Communicate with researchers in ${activeRoom.title}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#003366] focus:outline-hidden transition"
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send</span>
                    <span>&rarr;</span>
                  </button>
                </form>
              </div>
            )}

            {/* ── 2. DATASETS TAB: CONNECTED SCIENTIFIC FILES ───────────────── */}
            {selectedTab === "datasets" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Connected Datasets &amp; Sensor Telemetry
                    </h3>
                    <p className="text-xs text-slate-500">
                      All research findings in this room are directly grounded in these verified repositories.
                    </p>
                  </div>
                  <button
                    onClick={() => showToast("Upload/Link NetCDF feature opened.")}
                    className="btn-outline btn-sm text-xs cursor-pointer"
                  >
                    ➕ Attach NetCDF Dataset
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeRoom.connectedDatasets.map((ds) => (
                    <div
                      key={ds.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                          {ds.format} · {ds.size}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          DOI: {ds.doi}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {ds.title}
                      </h4>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Variables &amp; Channels
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {ds.parameters.map((p, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            onAddToWorkspace?.({
                              id: ds.id,
                              title: ds.title,
                              type: "dataset",
                              meta: `${ds.format} · ${ds.size}`,
                              version: "v2024.1"
                            })
                            showToast(`Added "${ds.title.slice(0, 28)}..." to Polar Workspace!`)
                          }}
                          className="btn-outline btn-xs text-[#003366] cursor-pointer"
                        >
                          + Add to Workspace
                        </button>
                        <button
                          onClick={() => showToast(`Initiating download for ${ds.title}`)}
                          className="btn-primary btn-xs cursor-pointer"
                        >
                          Download Data
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 3. NOTES TAB: COLLABORATIVE DOCUMENTATION ──────────────────── */}
            {selectedTab === "notes" && (
              <div className="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Collaborative Research Notebook &amp; Synthesis
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time shared field documentation synchronized with room participants.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {notesSavedToast && (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg animate-in fade-in">
                        ✓ Saved &amp; Synced
                      </span>
                    )}
                    <button
                      onClick={handleSaveNotes}
                      className="px-3.5 py-1.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] transition cursor-pointer"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>

                <textarea
                  value={editableNotes}
                  onChange={(e) => setEditableNotes(e.target.value)}
                  className="flex-1 w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-[#003366] focus:outline-hidden resize-none transition"
                  placeholder="Enter scientific observations, calibration factors, or draft publication sections..."
                />
              </div>
            )}

            {/* ── 4. TASKS TAB: ACTIONABLE MILESTONES ────────────────────────── */}
            {selectedTab === "tasks" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Expedition &amp; Paper Milestones
                    </h3>
                    <p className="text-xs text-slate-500">
                      Track action items, instrument maintenance, and co-authorship checklists.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const title = prompt("Enter new action task:")
                      if (title && title.trim()) {
                        const newTask: ResearchRoomTask = {
                          id: `t-custom-${Date.now()}`,
                          title: title.trim(),
                          assignee: "Dr. You",
                          status: "todo",
                          priority: "medium"
                        }
                        setRooms((prev) =>
                          prev.map((r) =>
                            r.id === activeRoom.id ? { ...r, tasks: [...r.tasks, newTask] } : r
                          )
                        )
                        showToast("Task added!")
                      }
                    }}
                    className="btn-primary btn-sm text-xs cursor-pointer"
                  >
                    ➕ Add Action Item
                  </button>
                </div>

                <div className="space-y-2">
                  {activeRoom.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                        task.status === "completed"
                          ? "bg-slate-50/70 border-slate-200 opacity-60 line-through"
                          : "bg-white border-slate-200 hover:border-blue-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.status === "completed"}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-blue-600 cursor-pointer pointer-events-none"
                        />
                        <span className="font-medium text-xs text-slate-900">
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            task.priority === "high"
                              ? "bg-rose-100 text-rose-700"
                              : task.priority === "medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-lg">
                          👤 {task.assignee}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 5. AI TAB: GROUNDED RESEARCH COPILOT ──────────────────────── */}
            {selectedTab === "ai" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 rounded-2xl bg-linear-to-r from-blue-900 to-indigo-900 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <h3 className="font-bold text-sm">
                      In-Room Autonomous Research Agent (PolarAI)
                    </h3>
                  </div>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    This AI copilot is strictly constrained to {activeRoom.title}, its connected datasets, and logged research notes. No model hallucination or unverified claims.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Suggested Research Workflows:
                  </div>
                  {[
                    "Cross-correlate 92m core depth with 2023 Antarctic sea ice albedo collapse.",
                    "Draft the Methodology section for the SCAR 2026 conference paper.",
                    "Verify sensor calibration drift across 192m Kongsfjorden IndARC ADCP telemetry.",
                    "Calculate net diesel displacement percentage from Maitri winter microgrid logs.",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedTab("comms")
                        setNewMessageText(prompt)
                      }}
                      className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-[#003366] hover:bg-blue-50/50 transition cursor-pointer text-xs text-slate-800 flex items-center justify-between group"
                    >
                      <span>💬 {prompt}</span>
                      <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                        &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CREATE ROOM MODAL ─────────────────────────────────────────────────── */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  NCPOR SCIENTIFIC COLLABORATION
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                  Create New Research Room
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Research Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="e.g. Weddell Sea Deep Water Convection & Polynya Dynamics"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#003366] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Domain *
                  </label>
                  <select
                    value={newRoomDomain}
                    onChange={(e) => setNewRoomDomain(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#003366] focus:outline-hidden"
                  >
                    <option value="Antarctica">Antarctica</option>
                    <option value="Arctic">Arctic</option>
                    <option value="Southern Ocean">Southern Ocean</option>
                    <option value="Technology">Technology</option>
                    <option value="Atmosphere">Atmosphere</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Station / Coordinates
                  </label>
                  <input
                    type="text"
                    value={newRoomStation}
                    onChange={(e) => setNewRoomStation(e.target.value)}
                    placeholder="e.g. Bharati Station (69°S)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#003366] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Research Question &amp; Hypothesis *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newRoomQuestion}
                  onChange={(e) => setNewRoomQuestion(e.target.value)}
                  placeholder="What empirical question will this team solve using NetCDF telemetry?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#003366] focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-outline btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary btn-sm text-xs cursor-pointer"
                >
                  Initialize Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ──────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-70 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
