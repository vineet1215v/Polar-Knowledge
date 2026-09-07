import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { gameStore } from "../gameStore";

export interface RouteWaypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  day: string;
  category: "departure" | "transit" | "oceanography" | "pack_ice" | "arrival" | "fieldwork";
  seaTemp: string;
  iceThickness: string;
  windSpeed: string;
  notes: string;
  action: string;
}

export interface ExpeditionRoute {
  id: string;
  name: string;
  expeditionTitle: string;
  vessel: string;
  vesselType: string;
  iceClass: string;
  region: "Antarctic" | "Arctic" | "Southern Ocean";
  year: number;
  duration: string;
  distanceNm: number;
  color: string;
  waypoints: RouteWaypoint[];
  center: [number, number];
  zoom: number;
}

export const EXPEDITION_ROUTES: ExpeditionRoute[] = [
  {
    id: "route_46_maitri",
    name: "Maitri Supply & Science Corridor",
    expeditionTitle: "46th Indian Antarctic Expedition (2024–25)",
    vessel: "MV Vasiliy Golovnin / Polar Explorer",
    vesselType: "Ice-Class Cargo & Research Ship",
    iceClass: "DNV ICE-1A Super",
    region: "Antarctic",
    year: 2024,
    duration: "75 Days at Sea",
    distanceNm: 6840,
    color: "#2563eb",
    center: [-45, 25],
    zoom: 3,
    waypoints: [
      {
        id: "w1",
        name: "Mormugao Port, Goa",
        lat: 15.41,
        lng: 73.80,
        day: "Day 01",
        category: "departure",
        seaTemp: "28.4°C",
        iceThickness: "0.0 m",
        windSpeed: "12 kts NW",
        notes: "Departure from Indian mainland. Staged 85 containers of scientific fuel, provisions, and snowmobiles.",
        action: "Scientific payload loaded & expedition flags hoisted.",
      },
      {
        id: "w2",
        name: "Port Louis, Mauritius",
        lat: -20.16,
        lng: 57.50,
        day: "Day 09",
        category: "transit",
        seaTemp: "25.1°C",
        iceThickness: "0.0 m",
        windSpeed: "16 kts SE",
        notes: "Mid-ocean logistics stop. Refueled low-sulfur marine gas oil; medical fitness recertification of 42 members.",
        action: "Calibrated atmospheric aerosol counters on upper monkey bridge.",
      },
      {
        id: "w3",
        name: "Cape Town Gateway, RSA",
        lat: -33.92,
        lng: 18.42,
        day: "Day 18",
        category: "transit",
        seaTemp: "16.8°C",
        iceThickness: "0.0 m",
        windSpeed: "22 kts S",
        notes: "Antarctic staging hub. Boarded polar ice pilots, helicopter aviation crew, and polar survival gear.",
        action: "Loaded 2 Kamov Ka-32 heavy-lift expedition helicopters.",
      },
      {
        id: "w4",
        name: "Roaring Forties Crossing",
        lat: -43.20,
        lng: 16.50,
        day: "Day 24",
        category: "oceanography",
        seaTemp: "9.2°C",
        iceThickness: "0.0 m",
        windSpeed: "42 kts WSW",
        notes: "High-latitude storm front. Swells reached 6.2 meters. Severe pitching; ship navigated at 9.5 knots.",
        action: "Continuous Sea Surface Salinity and Chlorophyll fluorometer logging.",
      },
      {
        id: "w5",
        name: "Furious Fifties & Subantarctic Front",
        lat: -52.80,
        lng: 14.10,
        day: "Day 29",
        category: "oceanography",
        seaTemp: "2.4°C",
        iceThickness: "0.0 m",
        windSpeed: "35 kts SW",
        notes: "Subantarctic oceanographic boundary. Sharp drop in water temperature; first wandering albatross sighting.",
        action: "Deployed 3 ARGO deep-profiling ocean floats to 2,000m depth.",
      },
      {
        id: "w6",
        name: "Marginal Pack Ice Edge",
        lat: -62.40,
        lng: 12.80,
        day: "Day 33",
        category: "pack_ice",
        seaTemp: "-1.2°C",
        iceThickness: "1.1 m",
        windSpeed: "20 kts E",
        notes: "Entered consolidated first-year pack ice. Icebreaking operations commenced with hull water-deluge active.",
        action: "Drilled fast ice core samples; measured biological algae concentration.",
      },
      {
        id: "w7",
        name: "India Bay Fast Ice Edge",
        lat: -69.95,
        lng: 11.95,
        day: "Day 38",
        category: "arrival",
        seaTemp: "-1.8°C",
        iceThickness: "2.3 m",
        windSpeed: "26 kts ESE",
        notes: "Moored against permanent shelf ice. Heavy cargo offloading onto sledges pulled by PistenBully tractors.",
        action: "Helicopter airlift of 14 scientists directly to Schirmacher Oasis.",
      },
      {
        id: "w8",
        name: "Maitri Research Base",
        lat: -70.77,
        lng: 11.74,
        day: "Day 42",
        category: "fieldwork",
        seaTemp: "Frozen",
        iceThickness: "3.2 m (Ice cap)",
        windSpeed: "30 kts ENE",
        notes: "Station operations active. Commenced annual maintenance of geomagnetic sensors and atmospheric LIDAR.",
        action: "Handover to 46th Wintering team (+40 XP awarded).",
      },
    ],
  },
  {
    id: "route_45_bharati",
    name: "Bharati & Prydz Bay Transect",
    expeditionTitle: "45th Indian Antarctic Expedition (2023–24)",
    vessel: "MV Ivan Papanin",
    vesselType: "Polar Research & Supply Vessel",
    iceClass: "Russian Arc7 / Icebreaker",
    region: "Antarctic",
    year: 2023,
    duration: "82 Days at Sea",
    distanceNm: 7120,
    color: "#0284c7",
    center: [-50, 65],
    zoom: 3,
    waypoints: [
      {
        id: "b1",
        name: "Cape Town Port",
        lat: -33.92,
        lng: 18.42,
        day: "Day 01",
        category: "departure",
        seaTemp: "17.2°C",
        iceThickness: "0.0 m",
        windSpeed: "18 kts SSE",
        notes: "Expedition departure towards Eastern Antarctica sector.",
        action: "Oceanographic CTD winch certified.",
      },
      {
        id: "b2",
        name: "Agulhas Return Current",
        lat: -40.50,
        lng: 36.20,
        day: "Day 08",
        category: "oceanography",
        seaTemp: "14.1°C",
        iceThickness: "0.0 m",
        windSpeed: "28 kts W",
        notes: "Studied Agulhas retroflection eddy ring and warm core water heat transfer.",
        action: "Surface water sampling for microplastics and plankton.",
      },
      {
        id: "b3",
        name: "Kerguelen Marine Plateau",
        lat: -49.30,
        lng: 69.80,
        day: "Day 18",
        category: "oceanography",
        seaTemp: "3.6°C",
        iceThickness: "0.0 m",
        windSpeed: "38 kts WNW",
        notes: "Volcanic submarine plateau. High nutrient zone supporting massive krill swarms.",
        action: "Acoustic biomass survey at 38 kHz and 120 kHz echo-sounders.",
      },
      {
        id: "b4",
        name: "Prydz Bay Coastal Polynya",
        lat: -67.80,
        lng: 75.40,
        day: "Day 27",
        category: "pack_ice",
        seaTemp: "-1.7°C",
        iceThickness: "1.6 m",
        windSpeed: "24 kts NE",
        notes: "Open water area surrounded by sea ice. Crucial breeding ground for Adelie penguins.",
        action: "Water column vertical CTD profiles to 1,500m depth.",
      },
      {
        id: "b5",
        name: "Bharati Station, Larsemann Hills",
        lat: -69.41,
        lng: 76.19,
        day: "Day 32",
        category: "arrival",
        seaTemp: "-1.8°C",
        iceThickness: "Fast ice 1.8m",
        windSpeed: "22 kts E",
        notes: "Arrived at India's high-tech Bharati Station overlooking Prydz Bay.",
        action: "Activated satellite ground receiving antenna and marine geology drill.",
      },
    ],
  },
  {
    id: "route_arctic_himadri",
    name: "Svalbard & Kongsfjorden High-Arctic Route",
    expeditionTitle: "Indian Arctic Expedition (2023–24)",
    vessel: "RV Lance / Polarsyssel",
    vesselType: "Arctic Research Ship",
    iceClass: "DNV 1A Icebreaker",
    region: "Arctic",
    year: 2023,
    duration: "45 Days",
    distanceNm: 1850,
    color: "#059669",
    center: [75, 15],
    zoom: 5,
    waypoints: [
      {
        id: "a1",
        name: "Tromsø Gateway, Norway",
        lat: 69.65,
        lng: 18.96,
        day: "Day 01",
        category: "departure",
        seaTemp: "8.2°C",
        iceThickness: "0.0 m",
        windSpeed: "14 kts N",
        notes: "Gateway to the Arctic. Coordinated with Norwegian Polar Institute scientists.",
        action: "Equipped Arctic survival drysuits and flare signaling kits.",
      },
      {
        id: "a2",
        name: "Bear Island (Bjørnøya)",
        lat: 74.45,
        lng: 19.05,
        day: "Day 05",
        category: "transit",
        seaTemp: "5.1°C",
        iceThickness: "0.0 m",
        windSpeed: "24 kts NNW",
        notes: "Oceanic front between warm Atlantic Water and cold Barents Sea polar water.",
        action: "Salinity anomaly profiling using underway acoustic doppler current profiler (ADCP).",
      },
      {
        id: "a3",
        name: "Longyearbyen, Svalbard",
        lat: 78.22,
        lng: 15.65,
        day: "Day 09",
        category: "transit",
        seaTemp: "3.4°C",
        iceThickness: "0.0 m",
        windSpeed: "15 kts E",
        notes: "World's northernmost commercial settlement. Rifles and polar bear safety training conducted.",
        action: "Transferred atmospheric soot spectrometers onto fjords utility launch.",
      },
      {
        id: "a4",
        name: "Ny-Ålesund & Himadri Station",
        lat: 78.92,
        lng: 11.93,
        day: "Day 12",
        category: "arrival",
        seaTemp: "1.8°C",
        iceThickness: "Fjord ice chunks",
        windSpeed: "18 kts NE",
        notes: "India's permanent Arctic station at 79° North. Atmospheric physics and glacier monitoring laboratory.",
        action: "Continuous black carbon and microbial DNA air filtration.",
      },
      {
        id: "a5",
        name: "IndARC Mooring (Kongsfjorden Fjord)",
        lat: 78.98,
        lng: 11.85,
        day: "Day 16",
        category: "fieldwork",
        seaTemp: "-0.4°C",
        iceThickness: "Drift ice",
        windSpeed: "22 kts ENE",
        notes: "India's multi-sensor underwater mooring anchored at 192m depth inside Kongsfjorden.",
        action: "Recovered 12-month acoustic and water temperature continuous data reel.",
      },
    ],
  },
  {
    id: "route_southern_ocean",
    name: "Southern Ocean Hydrographic Transect",
    expeditionTitle: "Southern Ocean Research Cruise (ORV Sagar Nidhi)",
    vessel: "ORV Sagar Nidhi",
    vesselType: "Ice-Strengthened Oceanographic Vessel",
    iceClass: "DNV 1B Ice Strengthened",
    region: "Southern Ocean",
    year: 2022,
    duration: "60 Days at Sea",
    distanceNm: 5400,
    color: "#d97706",
    center: [-50, 55],
    zoom: 4,
    waypoints: [
      {
        id: "so1",
        name: "Port Louis, Mauritius",
        lat: -20.16,
        lng: 57.50,
        day: "Day 01",
        category: "departure",
        seaTemp: "26.5°C",
        iceThickness: "0.0 m",
        windSpeed: "15 kts E",
        notes: "Scientific expedition departure with 28 oceanographers and marine geophysicists.",
        action: "Sediment multicorer and CTD carousel pre-flight checks completed.",
      },
      {
        id: "so2",
        name: "Subtropical Front (STF)",
        lat: -41.50,
        lng: 57.50,
        day: "Day 12",
        category: "oceanography",
        seaTemp: "13.2°C",
        iceThickness: "0.0 m",
        windSpeed: "32 kts W",
        notes: "Major climate boundary where warm northern waters plunge beneath colder subantarctic water.",
        action: "Deep water rosette cast down to 3,800m depth.",
      },
      {
        id: "so3",
        name: "Antarctic Polar Front (APF)",
        lat: -53.20,
        lng: 57.50,
        day: "Day 22",
        category: "oceanography",
        seaTemp: "1.9°C",
        iceThickness: "0.0 m",
        windSpeed: "45 kts SW",
        notes: "Antarctic Circumpolar Current core. Highest atmospheric carbon sink zone in world oceans.",
        action: "Dissolved carbon dioxide (pCO2) continuous spectrometer recording.",
      },
      {
        id: "so4",
        name: "Southern Boundary & Marginal Ice Zone",
        lat: -64.50,
        lng: 57.50,
        day: "Day 34",
        category: "pack_ice",
        seaTemp: "-1.5°C",
        iceThickness: "0.8 m pancake ice",
        windSpeed: "28 kts S",
        notes: "Final southern turning latitude before winter ice advance. Abundant minke whale and krill pods.",
        action: "Water sampling for trace metal and bio-optical backscattering profiles.",
      },
    ],
  },
];

interface Props {
  initialRouteId?: string;
  onNavigate: (p: string) => void;
}

export default function ExpeditionRouteMap({ initialRouteId, onNavigate }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialRouteId || "route_46_maitri");
  const [activeWaypointIndex, setActiveWaypointIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<"satellite" | "topo" | "ocean">("satellite");
  const [showWeatherOverlay, setShowWeatherOverlay] = useState<boolean>(true);
  const [simulationFinished, setSimulationFinished] = useState<boolean>(false);

  // Sync if initialRouteId changes from parent
  useEffect(() => {
    if (initialRouteId && initialRouteId !== selectedRouteId) {
      setSelectedRouteId(initialRouteId);
      setActiveWaypointIndex(0);
      setIsPlaying(false);
      setSimulationFinished(false);
    }
  }, [initialRouteId]);

  const activeRoute = EXPEDITION_ROUTES.find(r => r.id === selectedRouteId) || EXPEDITION_ROUTES[0];
  const safeIndex = Math.min(Math.max(0, activeWaypointIndex), activeRoute.waypoints.length - 1);
  const activeWaypoint = activeRoute.waypoints[safeIndex] || activeRoute.waypoints[0];

  // Initialize Leaflet Map safely
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up container if previous instance left _leaflet_id
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch {}
      mapInstanceRef.current = null;
    }

    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: activeRoute.center,
        zoom: activeRoute.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      const markerGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;
      markerGroupRef.current = markerGroup;

      // Base tile
      let tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      let maxZoom = 17;
      if (mapStyle === "topo") {
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}";
        maxZoom = 12;
      } else if (mapStyle === "ocean") {
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";
        maxZoom = 13;
      }
      L.tileLayer(tileUrl, { maxZoom }).addTo(layerGroup);
    } catch (err) {
      console.warn("Leaflet initialization warning:", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Layer safely
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers) return;

    try {
      layers.clearLayers();

      let tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      let maxZoom = 17;

      if (mapStyle === "topo") {
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}";
        maxZoom = 12;
      } else if (mapStyle === "ocean") {
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";
        maxZoom = 13;
      }

      L.tileLayer(tileUrl, { maxZoom }).addTo(layers);
    } catch (err) {
      console.warn("Tile layer switch error:", err);
    }
  }, [mapStyle]);

  // Redraw Route and Markers when route or safeIndex changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markers = markerGroupRef.current;
    if (!map || !markers) return;

    try {
      markers.clearLayers();

      // 1. Draw Path Polyline
      const latLngs: L.LatLngExpression[] = activeRoute.waypoints.map(w => [w.lat, w.lng]);

      // Dashed background line
      L.polyline(latLngs, {
        color: "rgba(255,255,255,0.4)",
        weight: 6,
        lineCap: "round",
      }).addTo(markers);

      // Main route line with animated dash
      L.polyline(latLngs, {
        color: activeRoute.color,
        weight: 3.5,
        dashArray: "8, 6",
        lineCap: "round",
      }).addTo(markers);

      // 2. Add Waypoint Markers
      activeRoute.waypoints.forEach((wp, idx) => {
        const isCurrent = idx === safeIndex;
        const isPast = idx < safeIndex;

        const pinColor = isCurrent ? "#ef4444" : isPast ? "#10b981" : activeRoute.color;
        const symbol = isCurrent ? "" : idx === 0 ? "" : idx === activeRoute.waypoints.length - 1 ? "" : `${idx + 1}`;

        const icon = L.divIcon({
          className: "expedition-waypoint-icon",
          html: `
            <div style="
              width: ${isCurrent ? "34px" : "26px"};
              height: ${isCurrent ? "34px" : "26px"};
              border-radius: 9999px;
              background: ${isCurrent ? "#ffffff" : pinColor};
              border: 2.5px solid ${pinColor};
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${isCurrent ? "16px" : "11px"};
              font-weight: 700;
              color: ${isCurrent ? "#1e293b" : "#ffffff"};
              transform: translate(-50%, -50%);
              transition: all 0.3s ease;
              cursor: pointer;
            ">
              ${symbol}
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([wp.lat, wp.lng], { icon }).addTo(markers);

        marker.on("click", () => {
          setActiveWaypointIndex(idx);
          setIsPlaying(false);
          gameStore.addXp(15, `Inspected Waypoint: ${wp.name}`);
        });
      });

      // Animate map view smoothly to active waypoint
      const curWp = activeRoute.waypoints[safeIndex];
      if (curWp && map.getContainer()) {
        map.panTo([curWp.lat, curWp.lng], { animate: true, duration: 0.6 });
      }
    } catch (err) {
      console.warn("Leaflet redraw error:", err);
    }
  }, [activeRoute, safeIndex]);

  // Voyage Autoplay Simulator Timer (Pure updater, no side effects inside!)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveWaypointIndex(prev => {
        if (prev >= activeRoute.waypoints.length - 1) {
          return prev; // Hold at the end; completion effect will handle it
        }
        return prev + 1;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isPlaying, activeRoute.waypoints.length]);

  // Handle Simulation Completion cleanly outside the updater
  useEffect(() => {
    if (isPlaying && activeWaypointIndex >= activeRoute.waypoints.length - 1) {
      setIsPlaying(false);
      setSimulationFinished(true);
      gameStore.addXp(40, `Completed Voyage Simulation: ${activeRoute.name}`);
    }
  }, [isPlaying, activeWaypointIndex, activeRoute.waypoints.length, activeRoute.name]);

  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId);
    setActiveWaypointIndex(0);
    setIsPlaying(false);
    setSimulationFinished(false);
    const newRoute = EXPEDITION_ROUTES.find(r => r.id === routeId);
    if (newRoute && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.setView(newRoute.center, newRoute.zoom, { animate: true });
      } catch {}
    }
    gameStore.addXp(20, `Loaded Voyage Route: ${newRoute?.name}`);
  };

  const handleStartOrPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // If we are already at the end, restart from waypoint 0
      if (safeIndex >= activeRoute.waypoints.length - 1) {
        setActiveWaypointIndex(0);
      }
      setSimulationFinished(false);
      setIsPlaying(true);
      gameStore.addXp(15, `Started Simulation: ${activeRoute.name}`);
    }
  };

  const handleNextWp = () => {
    setIsPlaying(false);
    if (safeIndex < activeRoute.waypoints.length - 1) {
      setActiveWaypointIndex(safeIndex + 1);
    }
  };

  const handlePrevWp = () => {
    setIsPlaying(false);
    if (safeIndex > 0) {
      setActiveWaypointIndex(safeIndex - 1);
    }
  };

  return (
    <div className="card overflow-hidden shadow-md flex flex-col mb-8 border border-slate-200">
      {/* Top Visualizer Control Bar */}
      <div className="bg-slate-50/90 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h2 className="font-bold text-slate-900 text-base">Interactive Polar Voyage & Telemetry Tracker</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Live Nautical Simulator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize historical and active Indian polar maritime tracks, oceanic fronts, and scientific field stations.
          </p>
        </div>

        {/* Route Select Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/80 p-1 rounded-lg">
          {EXPEDITION_ROUTES.map(route => {
            const isSelected = route.id === selectedRouteId;
            return (
              <button
                key={route.id}
                onClick={() => handleRouteChange(route.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  isSelected
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {route.region === "Antarctic" ? "" : route.region === "Arctic" ? "" : ""} {route.name.split("&")[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map + Side Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative min-h-[520px]">
        {/* Main Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative h-[420px] lg:h-[540px] bg-slate-950 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "100%" }} />

          {/* Floating Map Mode Toolbar */}
          <div className="absolute top-3 left-3 z-[1000] flex gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs">
            <button
              onClick={() => setMapStyle("satellite")}
              className={`px-2 py-1 rounded font-medium transition ${
                mapStyle === "satellite" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapStyle("ocean")}
              className={`px-2 py-1 rounded font-medium transition ${
                mapStyle === "ocean" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Oceanic
            </button>
            <button
              onClick={() => setMapStyle("topo")}
              className={`px-2 py-1 rounded font-medium transition ${
                mapStyle === "topo" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Topographic
            </button>
            <span className="w-px h-4 bg-slate-200 self-center"></span>
            <button
              onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
              className={`px-2 py-1 rounded font-medium transition ${
                showWeatherOverlay ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
              title="Toggle Telemetry HUD Overlay"
            >
              {showWeatherOverlay ? "HUD ON" : "HUD OFF"}
            </button>
          </div>

          {/* Floating Vessel Telemetry HUD (Over Leaflet) */}
          {showWeatherOverlay && activeWaypoint && (
            <div className="absolute bottom-3 left-3 right-3 lg:right-auto z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-lg max-w-sm">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm"></span>
                  <span className="font-bold text-slate-800 text-xs">{activeRoute.vessel}</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 font-semibold">
                  {activeWaypoint.day}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Water Temp</div>
                  <div className="font-bold text-slate-800 mt-0.5">{activeWaypoint.seaTemp}</div>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Ice Pack</div>
                  <div className="font-bold text-slate-800 mt-0.5">{activeWaypoint.iceThickness}</div>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Wind Vector</div>
                  <div className="font-bold text-slate-800 mt-0.5">{activeWaypoint.windSpeed}</div>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 font-medium">
                 {activeWaypoint.lat.toFixed(2)}°, {activeWaypoint.lng.toFixed(2)}° · <span className="text-blue-700">{activeWaypoint.name}</span>
              </div>
            </div>
          )}

          {/* Player Controls (Bottom Right Floating) */}
          <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2">
            <button
              onClick={handlePrevWp}
              disabled={safeIndex === 0}
              className="px-2 h-7 text-xs font-bold flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 font-mono"
              title="Previous Waypoint"
            >
              Prev
            </button>
            <button
              onClick={handleStartOrPause}
              className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs ${
                isPlaying
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : simulationFinished
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isPlaying
                ? "Pause"
                : simulationFinished
                ? "Re-simulate"
                : "Simulate Voyage"}
            </button>
            <button
              onClick={handleNextWp}
              disabled={safeIndex === activeRoute.waypoints.length - 1}
              className="px-2 h-7 text-xs font-bold flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 font-mono"
              title="Next Waypoint"
            >
              Next
            </button>
          </div>
        </div>

        {/* Side Waypoint Scrubber & Scientific Dispatch Log */}
        <div className="lg:col-span-4 bg-white p-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto max-h-[540px]">
          <div>
            {/* Header info */}
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{activeRoute.region} Sector</span>
                <span className="text-xs text-slate-500 font-mono">{activeRoute.distanceNm} Nautical Miles</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-1">{activeRoute.expeditionTitle}</h3>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                  {activeRoute.vesselType}
                </span>
                <span>•</span>
                <span className="text-[10px] text-slate-600 font-medium">{activeRoute.iceClass}</span>
              </div>
            </div>

            {/* Active Waypoint Deep Dive Card */}
            {activeWaypoint && (
              <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    Active Mission Waypoint #{safeIndex + 1}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                    {activeWaypoint.day}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{activeWaypoint.name}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{activeWaypoint.notes}</p>

                {/* Scientific Action Taken */}
                <div className="mt-3 pt-2.5 border-t border-blue-200/60">
                  <div className="text-[10px] font-bold text-blue-900 uppercase">Scientific Payload Action:</div>
                  <p className="text-xs text-blue-950 font-medium mt-0.5">{activeWaypoint.action}</p>
                </div>
              </div>
            )}

            {/* Waypoint Stepper Timeline */}
            <div className="mt-4">
              <h5 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Voyage Waypoints ({activeRoute.waypoints.length})
              </h5>
              <div className="space-y-1.5">
                {activeRoute.waypoints.map((wp, idx) => {
                  const isSelected = idx === safeIndex;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => {
                        setActiveWaypointIndex(idx);
                        setIsPlaying(false);
                        gameStore.addXp(15, `Inspected Waypoint: ${wp.name}`);
                      }}
                      className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            isSelected ? "bg-white text-blue-700" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-medium truncate">{wp.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono ml-2 flex-shrink-0 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                        {wp.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => onNavigate("map")}
              className="btn-outline btn-sm flex-1 text-xs"
            >
              Full Global Polar Map →
            </button>
            <button
              onClick={() => {
                gameStore.addXp(30, "Saved Voyage Route to Workspace");
                alert("Voyage Route & Waypoint telemetries saved to Workspace!");
              }}
              className="btn-primary btn-sm flex-1 text-xs"
            >
              + Save Voyage (+30 XP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
