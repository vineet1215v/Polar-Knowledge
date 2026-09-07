import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { gameStore } from "../gameStore";

interface Props {
  onNavigate: (p: string) => void;
  onToast: (msg: string) => void;
}

interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "Indian" | "Indian Arctic" | "Historic" | "International";
  desc: string;
  temp: number;
  wind: string;
  established: string;
  status: string;
  expeditions: number;
  datasets: number;
  publications: number;
}

const STATIONS: Station[] = [
  {
    id: "maitri",
    name: "Maitri Station",
    lat: -70.7669,
    lng: 11.7370,
    type: "Indian",
    desc: "Schirmacher Oasis, Dronning Maud Land",
    temp: -18.4,
    wind: "34 km/h ESE",
    established: "1989",
    status: "Active (Year-Round)",
    expeditions: 40,
    datasets: 85,
    publications: 320,
  },
  {
    id: "bharati",
    name: "Bharati Station",
    lat: -69.4065,
    lng: 76.1927,
    type: "Indian",
    desc: "Larsemann Hills, Prydz Bay coast",
    temp: -12.1,
    wind: "28 km/h ENE",
    established: "2012",
    status: "Active (Year-Round)",
    expeditions: 12,
    datasets: 42,
    publications: 96,
  },
  {
    id: "dakshin",
    name: "Dakshin Gangotri",
    lat: -70.0831,
    lng: 12.0061,
    type: "Historic",
    desc: "Princess Astrid Coast · First Indian Antarctic station",
    temp: -22.0,
    wind: "42 km/h SE",
    established: "1983",
    status: "Submerged in Ice / Auto Sensor Marker",
    expeditions: 6,
    datasets: 18,
    publications: 62,
  },
  {
    id: "himadri",
    name: "Himadri Station (Arctic)",
    lat: 78.9268,
    lng: 11.9350,
    type: "Indian Arctic",
    desc: "Ny-Ålesund, Svalbard, Norway",
    temp: -4.8,
    wind: "16 km/h N",
    established: "2008",
    status: "Active (Seasonal/Year-Round)",
    expeditions: 14,
    datasets: 31,
    publications: 89,
  },
  {
    id: "indarc",
    name: "IndARC Underwater Mooring",
    lat: 79.0000,
    lng: 12.0000,
    type: "Indian Arctic",
    desc: "Kongsfjorden Fjord Subsurface Mooring",
    temp: -1.2,
    wind: "Current 0.38 m/s",
    established: "2014",
    status: "Subsurface Profiling",
    expeditions: 10,
    datasets: 24,
    publications: 45,
  },
  {
    id: "southpole",
    name: "Amundsen-Scott (USA)",
    lat: -89.9999,
    lng: 0,
    type: "International",
    desc: "Geographic South Pole",
    temp: -38.5,
    wind: "22 km/h S",
    established: "1956",
    status: "Active",
    expeditions: 0,
    datasets: 0,
    publications: 0,
  },
  {
    id: "mcmurdo",
    name: "McMurdo Station (USA)",
    lat: -77.8419,
    lng: 166.6863,
    type: "International",
    desc: "Ross Island, Ross Sea",
    temp: -14.2,
    wind: "30 km/h W",
    established: "1956",
    status: "Active",
    expeditions: 0,
    datasets: 0,
    publications: 0,
  },
];

const VESSELS = [
  {
    id: "sagar",
    name: "MV Sagar Nidhi",
    lat: -56.4,
    lng: 28.5,
    speed: "11.4 kts",
    heading: "165° SSE",
    task: "Southern Ocean Biogeochemical & CTD Profiling",
    status: "Underway",
  },
  {
    id: "papanin",
    name: "Ivan Papanin",
    lat: -67.8,
    lng: 73.2,
    speed: "9.2 kts",
    heading: "140° SE",
    task: "Expedition Fuel & Cargo Airlift approach to Bharati",
    status: "Approaching Fast Ice",
  },
];

const ROUTES = [
  {
    id: "r46",
    label: "46th IAE (2024)",
    color: "#38bdf8",
    coords: [[-33.9, 18.4], [-40, 10], [-50, 8], [-60, 9], [-65, 10], [-70.7669, 11.737]] as [number, number][],
  },
  {
    id: "r45",
    label: "45th IAE (2023)",
    color: "#a855f7",
    coords: [[-33.9, 18.4], [-42, 30], [-52, 45], [-62, 60], [-68, 70], [-69.4065, 76.1927]] as [number, number][],
  },
  {
    id: "ra23",
    label: "Arctic 2023 Cruise",
    color: "#34d399",
    coords: [[60.39, 5.32], [65, 8], [70, 10], [75, 11.5], [78.9268, 11.935]] as [number, number][],
  },
];

const BASEMAPS = [
  {
    id: "esri",
    name: "Satellite (ESRI)",
    icon: "",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri",
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    icon: "",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  },
  {
    id: "topo",
    name: "Topographic",
    icon: "",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "© OpenTopoMap contributors",
  },
];

function makeStationIcon(st: Station, selected: boolean) {
  const colors: Record<string, string> = {
    Indian: selected ? "#2563eb" : "#ef4444",
    "Indian Arctic": selected ? "#0284c7" : "#06b6d4",
    Historic: "#f59e0b",
    International: "#8b5cf6",
  };
  const color = colors[st.type] || "#ef4444";
  const size = selected ? 22 : 16;
  const pulse = st.type === "Indian"
    ? `<div style="position:absolute;top:50%;left:50%;width:${size + 14}px;height:${size + 14}px;transform:translate(-50%,-50%);border-radius:50%;border:2px solid ${color};animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;opacity:0.6;"></div>`
    : "";

  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">
        ${pulse}
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid #ffffff;box-shadow:0 3px 10px rgba(0,0,0,0.5);transition:all 0.15s ease;"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function makeVesselIcon(v: typeof VESSELS[0]) {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;cursor:pointer;">
        <div style="position:absolute;top:50%;left:50%;width:26px;height:26px;transform:translate(-50%,-50%);border-radius:50%;background:rgba(34,197,94,0.3);animation:ping 2s infinite;"></div>
        <div style="background:#16a34a;color:white;border-radius:50%;width:18px;height:18px;border:2px solid white;display:flex;align-items:center;justify-center;font-size:10px;box-shadow:0 2px 8px rgba(0,0,0,0.4);">
          
        </div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function DashboardPolarMap({ onNavigate, onToast }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routesRef = useRef<L.LayerGroup | null>(null);
  const vesselsRef = useRef<L.LayerGroup | null>(null);

  const [basemapId, setBasemapId] = useState("esri");
  const [layers, setLayers] = useState({ stations: true, routes: true, vessels: true });
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<typeof VESSELS[0] | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-68, 45],
      zoom: 3,
      zoomControl: false,
      attributionControl: true,
      maxBounds: [[-90, -180], [90, 180]],
      minZoom: 2,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    // Initial Satellite Tile Layer
    const bm = BASEMAPS[0];
    const tileLayer = L.tileLayer(bm.url, { attribution: bm.attribution, maxZoom: 18 });
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer Groups
    markersRef.current = L.layerGroup().addTo(map);
    routesRef.current = L.layerGroup().addTo(map);
    vesselsRef.current = L.layerGroup().addTo(map);

    // Mouse coordinate tracker
    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      setMouseCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    map.on("mouseout", () => setMouseCoords(null));

    mapRef.current = map;

    // Small delay to ensure container dimensions are set
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    if (!mapRef.current) return;
    const bm = BASEMAPS.find(b => b.id === basemapId) || BASEMAPS[0];
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = L.tileLayer(bm.url, { attribution: bm.attribution, maxZoom: 18 });
    newTile.addTo(mapRef.current);
    tileLayerRef.current = newTile;
  }, [basemapId]);

  // Render Stations
  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return;
    markersRef.current.clearLayers();

    if (!layers.stations) return;

    STATIONS.forEach(st => {
      const isSelected = selectedStation?.id === st.id;
      const marker = L.marker([st.lat, st.lng], {
        icon: makeStationIcon(st, isSelected),
      });

      marker.bindTooltip(
        `<div class="font-bold text-[11px] leading-tight">${st.name}</div><div class="text-[9px] text-slate-300">${st.type} · ${st.temp}°C</div>`,
        { permanent: true, direction: "top", offset: [0, -10], className: "station-tooltip-permanent" }
      );

      marker.on("click", () => {
        setSelectedStation(st);
        setSelectedVessel(null);
        gameStore.addXP(25, `Inspected ${st.name} on Polar Radar`, 5);
        onToast(`Inspected ${st.name} telemetry (+25 XP )`);
      });

      marker.addTo(markersRef.current!);
    });
  }, [layers.stations, selectedStation]);

  // Render Routes
  useEffect(() => {
    if (!routesRef.current || !mapRef.current) return;
    routesRef.current.clearLayers();

    if (!layers.routes) return;

    ROUTES.forEach(r => {
      const polyline = L.polyline(r.coords, {
        color: r.color,
        weight: 2.5,
        opacity: 0.85,
        dashArray: "4, 6",
      });

      polyline.bindTooltip(`<div class="font-bold text-[10px] text-white">${r.label}</div>`, {
        direction: "center",
        className: "station-tooltip-permanent",
      });

      polyline.addTo(routesRef.current!);
    });
  }, [layers.routes]);

  // Render Vessels
  useEffect(() => {
    if (!vesselsRef.current || !mapRef.current) return;
    vesselsRef.current.clearLayers();

    if (!layers.vessels) return;

    VESSELS.forEach(v => {
      const marker = L.marker([v.lat, v.lng], {
        icon: makeVesselIcon(v),
      });

      marker.bindTooltip(
        `<div class="font-bold text-[11px] text-emerald-300">${v.name}</div><div class="text-[9px] text-slate-300">Speed: ${v.speed}</div>`,
        { permanent: true, direction: "bottom", offset: [0, 10], className: "station-tooltip-permanent" }
      );

      marker.on("click", () => {
        setSelectedVessel(v);
        setSelectedStation(null);
        gameStore.addXP(20, `Tracked vessel ${v.name}`, 5);
        onToast(`Vessel ${v.name}: ${v.task} (+20 XP )`);
      });

      marker.addTo(vesselsRef.current!);
    });
  }, [layers.vessels]);

  // Fly-To Actions
  const flyTo = (lat: number, lng: number, zoom: number, msg: string) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    onToast(msg);
  };

  return (
    <div className="card overflow-hidden rounded-2xl border border-slate-200 shadow-sm flex flex-col bg-white">
      {/* ── Top Bar Controls (Matches Dashboard card header theme) ────── */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-900">
              Interactive Polar Operations Map
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 font-mono">
              REAL SATELLITE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Photorealistic satellite basemaps, real Antarctic & Arctic stations, live vessels, and navigation transects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Basemap Switcher (Matches Dashboard tab selector) */}
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
            {BASEMAPS.map(bm => (
              <button
                key={bm.id}
                onClick={() => setBasemapId(bm.id)}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  basemapId === bm.id
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{bm.icon}</span>
                <span>{bm.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate("map")}
            className="btn-primary btn-sm flex items-center gap-1 text-xs"
          >
            <span>Launch Full Map</span> →
          </button>
        </div>
      </div>

      {/* ── Quick Jump Toolbar & Layer Toggles ───────────────────────────── */}
      <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        {/* Quick View Jump Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-[11px] text-slate-500 uppercase">Focus:</span>
          <button
            onClick={() => flyTo(-72, 45, 3, "Navigated to Antarctica Overview")}
            className="btn-outline btn-sm text-[11px] py-0.5 px-2 bg-white"
          >
            Antarctica Antarctica
          </button>
          <button
            onClick={() => flyTo(78.9, 12, 4, "Navigated to Arctic Svalbard (Himadri)")}
            className="btn-outline btn-sm text-[11px] py-0.5 px-2 bg-white"
          >
             Arctic (Himadri)
          </button>
          <button
            onClick={() => flyTo(-70.7669, 11.7370, 7, "Zoomed into Maitri Station (Schirmacher)")}
            className="btn-outline btn-sm text-[11px] py-0.5 px-2 bg-white"
          >
             Maitri
          </button>
          <button
            onClick={() => flyTo(-69.4065, 76.1927, 7, "Zoomed into Bharati Station (Prydz Bay)")}
            className="btn-outline btn-sm text-[11px] py-0.5 px-2 bg-white"
          >
             Bharati
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-3 text-slate-600 font-medium text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={layers.stations}
              onChange={e => setLayers(l => ({ ...l, stations: e.target.checked }))}
              className="rounded text-blue-600 accent-blue-600"
            />
            <span> Stations</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={layers.routes}
              onChange={e => setLayers(l => ({ ...l, routes: e.target.checked }))}
              className="rounded text-blue-600 accent-blue-600"
            />
            <span> Routes</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={layers.vessels}
              onChange={e => setLayers(l => ({ ...l, vessels: e.target.checked }))}
              className="rounded text-blue-600 accent-blue-600"
            />
            <span> Vessels (2)</span>
          </label>
        </div>
      </div>

      {/* ── Map Canvas Container ────────────────────────────────────────── */}
      <div className="relative w-full h-[420px] bg-slate-900 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Mouse Coordinates HUD (Matches PolarMap theme) */}
        {mouseCoords && (
          <div
            className="absolute bottom-3 right-3 z-10 text-[10px] font-mono px-2.5 py-1 rounded-md shadow-sm pointer-events-none flex items-center gap-2"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <span>LAT: {Math.abs(mouseCoords.lat).toFixed(4)}°{mouseCoords.lat >= 0 ? "N" : "S"}</span>
            <span className="text-slate-300">|</span>
            <span>LNG: {Math.abs(mouseCoords.lng).toFixed(4)}°{mouseCoords.lng >= 0 ? "E" : "W"}</span>
          </div>
        )}

        {/* Map Legend (Matches PolarMap / Dashboard light theme) */}
        <div
          className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 text-[10px] px-3 py-1.5 rounded-lg shadow-sm font-medium"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/><span>Indian</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"/><span>Arctic</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/><span>Historic</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/><span>Vessels</span></div>
          <div className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block"/><span>Routes</span></div>
        </div>

        {/* Selected Station Popover Card (Matches clean white card theme) */}
        {selectedStation && (
          <div className="absolute top-3 left-3 z-20 w-80 card p-3.5 shadow-xl animate-in fade-in zoom-in-95 space-y-2.5 bg-white/95 backdrop-blur-md border border-slate-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-mono">
                  {selectedStation.type} Station · {selectedStation.status}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{selectedStation.name}</h4>
                <div className="text-[10px] text-slate-500 leading-snug">{selectedStation.desc}</div>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                x
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
              <div><span className="text-slate-500 text-[10px]">Temp:</span> <span className="font-bold text-blue-700">{selectedStation.temp}°C</span></div>
              <div><span className="text-slate-500 text-[10px]">Wind:</span> <span className="font-bold text-slate-800">{selectedStation.wind}</span></div>
              <div><span className="text-slate-500 text-[10px]">Est:</span> <span className="font-bold text-slate-700">{selectedStation.established}</span></div>
              <div><span className="text-slate-500 text-[10px]">Status:</span> <span className="font-bold text-emerald-600">Active</span></div>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <div className="text-center p-1.5 rounded bg-blue-50/70 border border-blue-100">
                <div className="text-xs"></div>
                <div className="font-bold text-xs text-blue-700">{selectedStation.expeditions}</div>
                <div className="text-[8px] text-slate-500">Exped.</div>
              </div>
              <div className="text-center p-1.5 rounded bg-blue-50/70 border border-blue-100">
                <div className="text-xs"></div>
                <div className="font-bold text-xs text-blue-700">{selectedStation.datasets}</div>
                <div className="text-[8px] text-slate-500">Datasets</div>
              </div>
              <div className="text-center p-1.5 rounded bg-blue-50/70 border border-blue-100">
                <div className="text-xs"></div>
                <div className="font-bold text-xs text-blue-700">{selectedStation.publications}</div>
                <div className="text-[8px] text-slate-500">Pubs</div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  onNavigate("media");
                  onToast(`Launching 360° Virtual Tour of ${selectedStation.name}`);
                }}
                className="btn-primary btn-sm flex-1 justify-center text-xs"
              >
                <span>⊙</span> 360° VR Tour
              </button>
              <button
                onClick={() => {
                  onNavigate("datasets");
                  onToast(`Filtering datasets for ${selectedStation.name}`);
                }}
                className="btn-outline btn-sm flex-1 justify-center text-xs"
              >
                <span></span> Datasets
              </button>
            </div>
          </div>
        )}

        {/* Selected Vessel Popover Card (Matches clean white card theme) */}
        {selectedVessel && (
          <div className="absolute top-3 left-3 z-20 w-80 card p-3.5 shadow-xl animate-in fade-in zoom-in-95 space-y-2.5 bg-white/95 backdrop-blur-md border border-slate-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono">
                  Active Research Vessel
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{selectedVessel.name}</h4>
                <div className="text-[10px] text-slate-500 leading-snug">{selectedVessel.task}</div>
              </div>
              <button
                onClick={() => setSelectedVessel(null)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                x
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
              <div><span className="text-slate-500 text-[10px]">Speed:</span> <span className="font-bold text-emerald-700">{selectedVessel.speed}</span></div>
              <div><span className="text-slate-500 text-[10px]">Heading:</span> <span className="font-bold text-slate-800">{selectedVessel.heading}</span></div>
              <div className="col-span-2"><span className="text-slate-500 text-[10px]">Status:</span> <span className="font-bold text-emerald-600">{selectedVessel.status}</span></div>
            </div>

            <button
              onClick={() => onNavigate("expeditions")}
              className="btn-primary btn-sm w-full justify-center text-xs bg-emerald-600 hover:bg-emerald-700"
            >
              View Expedition Voyage Log →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

