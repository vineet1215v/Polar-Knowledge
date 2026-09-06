import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RelatedKnowledge from "../components/RelatedKnowledge";
import type { WorkspaceSource } from "../workspaceStore";
import { expeditions, publications, datasets } from "../data";

// ── Map data (real coordinates) ──────────────────────────────────────────────

interface Station {
  id: string; name: string; lat: number; lng: number;
  type: "Indian" | "Indian Arctic" | "Historic" | "International";
  desc: string; established: string; status: "Active" | "Historic" | "Seasonal";
  expeditions: number; datasets: number; publications: number;
  relatedExpeditions: string[];
}

interface Route {
  id: string; label: string; year: number; color: string;
  coords: [number, number][];
  duration: string; datasets: number; publications: number; findings: number;
  expeditionId: number;
}

const STATIONS: Station[] = [
  {
    id: "maitri", name: "Maitri", lat: -70.7669, lng: 11.7370,
    type: "Indian", desc: "Schirmacher Oasis, Dronning Maud Land · 70°46′S 11°44′E",
    established: "1989", status: "Active",
    expeditions: 40, datasets: 85, publications: 320,
    relatedExpeditions: ["46th IAE (2024)", "45th IAE (2023)", "44th IAE (2022)"],
  },
  {
    id: "bharati", name: "Bharati", lat: -69.4065, lng: 76.1927,
    type: "Indian", desc: "Prydz Bay coast, East Antarctica · 69°24′S 76°11′E",
    established: "2012", status: "Seasonal",
    expeditions: 12, datasets: 42, publications: 96,
    relatedExpeditions: ["45th IAE (2023)", "44th IAE (2022)", "43rd IAE (2021)"],
  },
  {
    id: "dakshin", name: "Dakshin Gangotri", lat: -70.0831, lng: 12.0061,
    type: "Historic", desc: "Princess Astrid Coast · 70°05′S 12°00′E · First Indian Antarctic station",
    established: "1983", status: "Historic",
    expeditions: 6, datasets: 18, publications: 62,
    relatedExpeditions: ["3rd IAE (1983)", "4th IAE (1984)", "9th IAE (1989)"],
  },
  {
    id: "himadri", name: "Himadri (Arctic)", lat: 78.9268, lng: 11.9350,
    type: "Indian Arctic", desc: "Ny-Ålesund, Svalbard, Norway · 78°55′N 11°56′E",
    established: "2008", status: "Active",
    expeditions: 14, datasets: 31, publications: 89,
    relatedExpeditions: ["Arctic 2023", "Arctic 2022"],
  },
  {
    id: "mcmurdo", name: "McMurdo (USA)", lat: -77.8419, lng: 166.6863,
    type: "International", desc: "Ross Island, Ross Sea · US Antarctic Programme",
    established: "1956", status: "Active",
    expeditions: 0, datasets: 0, publications: 0,
    relatedExpeditions: [],
  },
  {
    id: "pole", name: "Amundsen-Scott (USA)", lat: -89.9999, lng: 0,
    type: "International", desc: "Geographic South Pole · US Antarctic Programme",
    established: "1956", status: "Active",
    expeditions: 0, datasets: 0, publications: 0,
    relatedExpeditions: [],
  },
];

const ROUTES: Route[] = [
  {
    id: "r46", label: "46th IAE (2024)", year: 2024, color: "#2563eb",
    coords: [[-33.9, 18.4], [-40, 10], [-50, 8], [-60, 9], [-65, 10], [-70.7669, 11.737]],
    duration: "~120 days", datasets: 21, publications: 0, findings: 12, expeditionId: 1,
  },
  {
    id: "r45", label: "45th IAE (2023)", year: 2023, color: "#7c3aed",
    coords: [[-33.9, 18.4], [-42, 30], [-52, 45], [-62, 60], [-68, 70], [-69.4065, 76.1927]],
    duration: "~115 days", datasets: 18, publications: 14, findings: 37, expeditionId: 2,
  },
  {
    id: "r44", label: "44th IAE (2022)", year: 2022, color: "#16a34a",
    coords: [[-33.9, 18.4], [-40, 12], [-55, 11], [-65, 11.5], [-70.7669, 11.737]],
    duration: "~118 days", datasets: 16, publications: 11, findings: 29, expeditionId: 3,
  },
  {
    id: "ra23", label: "Arctic 2023", year: 2023, color: "#0891b2",
    coords: [[60.39, 5.32], [65, 8], [70, 10], [75, 11.5], [78.9268, 11.935]],
    duration: "~60 days", datasets: 9, publications: 6, findings: 18, expeditionId: 7,
  },
];

// Basemap configurations
const BASEMAPS = [
  {
    id: "osm", label: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  },
  {
    id: "topo", label: "Topographic",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '© <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> · © OpenStreetMap contributors',
  },
  {
    id: "esri", label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles © <a href="https://services.arcgisonline.com" target="_blank">Esri</a>',
  },
];

// Station marker icon factory
function makeStationIcon(station: Station, selected: boolean) {
  const colors: Record<string, string> = {
    Indian: selected ? "#1d4ed8" : "#ef4444",
    "Indian Arctic": selected ? "#0e7490" : "#0891b2",
    Historic: selected ? "#d97706" : "#f59e0b",
    International: selected ? "#6d28d9" : "#8b5cf6",
  };
  const color = colors[station.type];
  const size = selected ? 18 : 14;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:all 0.2s;cursor:pointer;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Year filter
const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

const LAYER_DEFS = [
  { id: "stations", label: "Research Stations",  color: "#ef4444" },
  { id: "routes",   label: "Expedition Routes",  color: "#2563eb" },
  { id: "density",  label: "Knowledge Density",  color: "#7c3aed" },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function PolarMap({
  onNavigate,
  onAddToWorkspace,
  onOpenStudio,
}: {
  onNavigate?: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const stationMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLayersRef = useRef<Map<string, L.Polyline>>(new Map());
  const densityLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [activeLayers, setActiveLayers] = useState(new Set(["stations", "routes"]));
  const [activeBasemap, setActiveBasemap] = useState("osm");
  const [timeYear, setTimeYear] = useState(2024);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<(Station | Route)[]>([]);
  const [mapError, setMapError] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [layerPanel, setLayerPanel] = useState(false);

  // Build search results from query
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) { setSearchResults([]); return; }
    const stns = STATIONS.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));
    const rts = ROUTES.filter(r => r.label.toLowerCase().includes(q));
    setSearchResults([...stns, ...rts].slice(0, 6));
  }, [searchQuery]);

  // Initialise Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [-65, 30],
        zoom: 3,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      const bm = BASEMAPS[0];
      const tile = L.tileLayer(bm.url, { attribution: bm.attribution, maxZoom: 18 });
      tile.addTo(map);
      tile.on("load", () => setMapLoading(false));
      tile.on("tileerror", () => setMapError(true));
      tileLayerRef.current = tile;

      // Coordinate tracker
      map.on("mousemove", (e) => setCoords({ lat: e.latlng.lat, lng: e.latlng.lng }));
      map.on("mouseout",  () => setCoords(null));

      // Station markers
      STATIONS.forEach(station => {
        const marker = L.marker([station.lat, station.lng], {
          icon: makeStationIcon(station, false),
          title: station.name,
        });
        marker.on("click", () => {
          setSelectedStation(station);
          setSelectedRoute(null);
          // Update all marker icons
          stationMarkersRef.current.forEach((m, id) => {
            const s = STATIONS.find(st => st.id === id)!;
            m.setIcon(makeStationIcon(s, id === station.id));
          });
        });
        marker.addTo(map);
        stationMarkersRef.current.set(station.id, marker);
      });

      // Route polylines
      ROUTES.forEach(route => {
        const poly = L.polyline(route.coords as L.LatLngExpression[], {
          color: route.color, weight: 2.5,
          opacity: 0.85, dashArray: "8, 5",
        });
        poly.on("click", () => { setSelectedRoute(route); setSelectedStation(null); });
        poly.addTo(map);
        routeLayersRef.current.set(route.id, poly);
      });

      // Knowledge density circles
      const densityGroup = L.layerGroup();
      STATIONS.filter(s => s.type === "Indian" || s.type === "Indian Arctic").forEach(s => {
        if (s.publications > 0) {
          L.circle([s.lat, s.lng], {
            radius: Math.sqrt(s.publications) * 8000,
            color: "#7c3aed", fillColor: "#7c3aed",
            fillOpacity: 0.07, weight: 1, opacity: 0.3,
          }).addTo(densityGroup);
        }
      });
      densityLayerRef.current = densityGroup;

      mapRef.current = map;
    } catch (e) {
      setMapError(true);
      setMapLoading(false);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      stationMarkersRef.current.clear();
      routeLayersRef.current.clear();
    };
  }, []);

  // Toggle layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    stationMarkersRef.current.forEach(m => {
      if (activeLayers.has("stations")) m.addTo(map);
      else map.removeLayer(m);
    });

    routeLayersRef.current.forEach((poly, id) => {
      const route = ROUTES.find(r => r.id === id)!;
      if (activeLayers.has("routes") && route.year <= timeYear) poly.addTo(map);
      else map.removeLayer(poly);
    });

    if (densityLayerRef.current) {
      if (activeLayers.has("density")) densityLayerRef.current.addTo(map);
      else map.removeLayer(densityLayerRef.current);
    }
  }, [activeLayers, timeYear]);

  // Timeline filter — update route visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    routeLayersRef.current.forEach((poly, id) => {
      const route = ROUTES.find(r => r.id === id)!;
      if (activeLayers.has("routes") && route.year <= timeYear) poly.addTo(map);
      else map.removeLayer(poly);
    });
  }, [timeYear, activeLayers]);

  // Switch basemap
  const switchBasemap = useCallback((id: string) => {
    const map = mapRef.current;
    if (!map) return;
    const bm = BASEMAPS.find(b => b.id === id)!;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    const tile = L.tileLayer(bm.url, { attribution: bm.attribution, maxZoom: 18 });
    tile.addTo(map);
    tileLayerRef.current = tile;
    setActiveBasemap(id);
  }, []);

  function flyTo(item: Station | Route) {
    const map = mapRef.current;
    if (!map) return;
    setSearchQuery("");
    setSearchResults([]);
    if ("lat" in item) {
      map.flyTo([item.lat, item.lng], 7, { duration: 1.2 });
      setSelectedStation(item as Station);
      setSelectedRoute(null);
      stationMarkersRef.current.forEach((m, id) => {
        const s = STATIONS.find(st => st.id === id)!;
        m.setIcon(makeStationIcon(s, id === (item as Station).id));
      });
    } else {
      const route = item as Route;
      const mid = Math.floor(route.coords.length / 2);
      map.flyTo(route.coords[mid] as L.LatLngExpression, 4, { duration: 1.2 });
      setSelectedRoute(route);
      setSelectedStation(null);
    }
  }

  function resetView() {
    mapRef.current?.flyTo([-65, 30], 3, { duration: 1 });
  }

  function toggleLayer(id: string) {
    setActiveLayers(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  function addStationSources(station: Station) {
    const exp = expeditions.find(e => station.relatedExpeditions.some(r => e.title.includes(r.slice(0, 6))));
    const pub = publications.find(p => p.title.toLowerCase().includes("antarctic") || p.title.toLowerCase().includes("ocean"));
    const ds  = datasets.find(d => d.region === "Antarctica");
    if (exp) onAddToWorkspace?.({ id: `exp-${exp.id}`, type: "expedition", title: exp.title, meta: `${exp.region} · ${exp.dates}`, date: exp.dates, origin: "NCPOR Expeditions" });
    if (pub) onAddToWorkspace?.({ id: `pub-${pub.id}`, type: "publication", title: pub.title, meta: `${pub.journal} · ${pub.year}`, date: String(pub.year), origin: "NCPOR Publications" });
    if (ds)  onAddToWorkspace?.({ id: `ds-${ds.id}`,  type: "dataset",    title: ds.title,  meta: `${ds.format} · ${ds.size}`,   date: String(ds.year),  origin: "NCPOR Datasets" });
  }

  const visibleRoutes = ROUTES.filter(r => r.year <= timeYear);
  const stationKnowledge = selectedStation ? [
    { type: "expedition" as const, label: `${selectedStation.expeditions} Expeditions`, meta: "Indian Antarctic Expeditions" },
    { type: "dataset" as const,    label: `${selectedStation.datasets} Datasets`,       meta: "Open access · NCPOR" },
    { type: "publication" as const, label: `${selectedStation.publications} Publications`, meta: "Peer-reviewed" },
  ] : [];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "var(--content-bg)" }}>

      {/* Top bar */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2">
        <div className="card px-3 py-2 flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="search-input pl-7 w-full text-[11px]"
              placeholder="Search stations, expeditions… (e.g. Maitri, Arctic)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50" style={{ background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}>
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => flyTo(r)} className="w-full text-left px-3 py-2 text-[11px] hover:bg-blue-50 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)", color: "var(--text-primary)" }}>
                    <span>{"lat" in r ? "📍" : "🚢"}</span>
                    <div>
                      <div className="font-medium">{"lat" in r ? (r as Station).name : (r as Route).label}</div>
                      <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{"lat" in r ? (r as Station).desc.slice(0, 50) : `${(r as Route).year} · ${(r as Route).duration}`}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Basemap selector */}
          <select value={activeBasemap} onChange={e => switchBasemap(e.target.value)} className="filter-select text-[11px] py-1.5">
            {BASEMAPS.map(bm => <option key={bm.id} value={bm.id}>{bm.label}</option>)}
          </select>

          {/* Layer toggle */}
          <button onClick={() => setLayerPanel(v => !v)} className="btn-outline btn-sm text-[11px] flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            Layers
          </button>

          <button onClick={resetView} className="btn-outline btn-sm text-[11px]" title="Reset view">⊹ Reset</button>
        </div>

        {/* Layer panel */}
        {layerPanel && (
          <div className="mt-1 card px-3 py-2 flex flex-wrap items-center gap-4">
            {LAYER_DEFS.map(l => (
              <label key={l.id} className="flex items-center gap-1.5 cursor-pointer">
                <div className="relative w-8 h-4 rounded-full transition-colors flex-shrink-0" style={{ background: activeLayers.has(l.id) ? l.color : "#d1d5db" }}>
                  <div className="absolute top-0.5 rounded-full w-3 h-3 bg-white shadow transition-all" style={{ left: activeLayers.has(l.id) ? "calc(100% - 14px)" : "2px" }}/>
                  <input type="checkbox" className="sr-only" checked={activeLayers.has(l.id)} onChange={() => toggleLayer(l.id)}/>
                </div>
                <span className="text-[11px]" style={{ color: "var(--text-primary)" }}>{l.label}</span>
              </label>
            ))}
            <div className="ml-auto flex gap-3 text-[10px]" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1"><span style={{ color: "#ef4444" }}>●</span>Indian</span>
              <span className="flex items-center gap-1"><span style={{ color: "#f59e0b" }}>●</span>Historic</span>
              <span className="flex items-center gap-1"><span style={{ color: "#0891b2" }}>●</span>Arctic</span>
              <span className="flex items-center gap-1"><span style={{ color: "#8b5cf6" }}>●</span>International</span>
            </div>
          </div>
        )}
      </div>

      {/* Map + Right panel */}
      <div className="flex flex-1 overflow-hidden px-3 pb-2 gap-2">
        {/* Map */}
        <div className="flex-1 relative rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {mapLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: "#b8d4e8" }}>
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-sm font-medium" style={{ color: "#334155" }}>Loading map tiles…</div>
                <div className="text-[10px] mt-0.5" style={{ color: "#64748b" }}>© OpenStreetMap contributors</div>
              </div>
            </div>
          )}
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: "#f8fafc" }}>
              <div className="text-center">
                <div className="text-3xl mb-2">🗺️</div>
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Tile service unavailable</div>
                <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>Check network connection or try another basemap</div>
              </div>
            </div>
          )}

          {/* Leaflet container */}
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 0 }} />

          {/* Coordinate display */}
          {coords && (
            <div className="absolute bottom-8 left-3 z-10 text-[10px] font-mono px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              {coords.lat.toFixed(4)}° {coords.lat >= 0 ? "N" : "S"} · {coords.lng.toFixed(4)}° {coords.lng >= 0 ? "E" : "W"}
            </div>
          )}

          {/* Hint bar when nothing selected */}
          {!selectedStation && !selectedRoute && !mapLoading && (
            <div className="absolute bottom-3 left-3 z-10">
              <div className="text-[10px] px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                Click a station <span style={{ color: "#ef4444" }}>●</span> or route to explore connected knowledge
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-2 flex-shrink-0 overflow-y-auto" style={{ width: 220 }}>

          {/* Station detail */}
          {selectedStation && (
            <div className="card p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[9px] uppercase font-semibold" style={{ color: "var(--text-muted)" }}>{selectedStation.type} Station · {selectedStation.status}</div>
                  <h3 className="font-bold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{selectedStation.name}</h3>
                  <div className="text-[10px] leading-snug mt-0.5" style={{ color: "var(--text-secondary)" }}>{selectedStation.desc}</div>
                  <div className="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>Est. {selectedStation.established}</div>
                </div>
                <button onClick={() => { setSelectedStation(null); stationMarkersRef.current.forEach((m, id) => m.setIcon(makeStationIcon(STATIONS.find(s => s.id === id)!, false))); }} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              {(selectedStation.type === "Indian" || selectedStation.type === "Indian Arctic") && (
                <>
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {[["🚢", selectedStation.expeditions, "Exped."], ["💾", selectedStation.datasets, "Datasets"], ["📄", selectedStation.publications, "Pubs"]].map(([icon, val, label]) => (
                      <div key={label as string} className="text-center p-1.5 rounded" style={{ background: "var(--accent-light)" }}>
                        <div className="text-sm">{icon as string}</div>
                        <div className="font-bold text-xs" style={{ color: "var(--accent)" }}>{val as number}</div>
                        <div className="text-[8px]" style={{ color: "var(--text-muted)" }}>{label as string}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-2">
                    <div className="text-[9px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>RELATED EXPEDITIONS</div>
                    {selectedStation.relatedExpeditions.map(e => (
                      <div key={e} className="text-[10px] flex items-center gap-1.5 py-0.5" style={{ color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--accent)" }}>🚢</span>{e}
                      </div>
                    ))}
                  </div>

                  <RelatedKnowledge entities={stationKnowledge} onNavigate={onNavigate} compact />

                  <div className="space-y-1.5 mt-3">
                    <button className="btn-primary btn-sm w-full" onClick={() => onNavigate?.("ai")}>
                      🤖 Ask Polar about {selectedStation.name.split(" ")[0]}
                    </button>
                    <button className="btn-outline btn-sm w-full" onClick={() => addStationSources(selectedStation)}>
                      📚 Add Related Sources
                    </button>
                    <button className="btn-outline btn-sm w-full" onClick={() => onNavigate?.("expeditions")}>
                      View Expeditions →
                    </button>
                  </div>
                </>
              )}

              {selectedStation.type === "Historic" && (
                <div className="mt-2 p-2 rounded text-[10px]" style={{ background: "var(--warning-bg)", border: "1px solid var(--warning-border)", color: "#92400e" }}>
                  Historic site — no longer operational. Research records preserved in NCPOR archive.
                </div>
              )}
              {selectedStation.type === "International" && (
                <div className="mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>International station — no NCPOR datasets associated.</div>
              )}
            </div>
          )}

          {/* Route detail */}
          {selectedRoute && !selectedStation && (
            <div className="card p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[9px] uppercase font-semibold" style={{ color: "var(--text-muted)" }}>Expedition Route · {selectedRoute.year}</div>
                  <h3 className="font-bold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{selectedRoute.label}</h3>
                </div>
                <button onClick={() => setSelectedRoute(null)} className="text-slate-400">✕</button>
              </div>
              <div className="space-y-1 text-[10px] mb-3" style={{ color: "var(--text-secondary)" }}>
                <div>📅 Duration: {selectedRoute.duration}</div>
                <div>💾 Datasets: {selectedRoute.datasets}</div>
                <div>📄 Publications: {selectedRoute.publications}</div>
                <div>🔍 Findings: {selectedRoute.findings}</div>
              </div>
              <div className="space-y-1.5">
                <button className="btn-primary btn-sm w-full" onClick={() => onNavigate?.("ai")}>🤖 Ask Polar about this Route</button>
                <button className="btn-outline btn-sm w-full" onClick={() => onNavigate?.("expeditions")}>Open Expedition →</button>
              </div>
            </div>
          )}

          {/* Active expeditions */}
          <div className="card p-3">
            <h3 className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>
              Active Routes ({visibleRoutes.length})
            </h3>
            <div className="space-y-1.5">
              {visibleRoutes.map(r => (
                <button key={r.id} onClick={() => flyTo(r)} className="w-full flex items-center gap-2 text-left p-1.5 rounded hover:bg-blue-50 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.color }}/>
                  <div>
                    <div className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>{r.label}</div>
                    <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{r.duration}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ask Polar for region */}
          <div className="card p-3">
            <h3 className="font-semibold text-xs mb-2" style={{ color: "var(--text-primary)" }}>Ask Polar AI</h3>
            <div className="space-y-1.5">
              {["What research near Maitri?", "Sea ice trends, Prydz Bay", "Which expeditions at Bharati?"].map(q => (
                <button key={q} className="w-full text-left text-[10px] px-2 py-1.5 rounded border hover:bg-blue-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }} onClick={() => onNavigate?.("ai")}>
                  {q}
                </button>
              ))}
              <button className="btn-primary btn-sm w-full mt-1" onClick={() => onNavigate?.("ai")}>Open Polar AI →</button>
            </div>
          </div>

          {/* GIS statistics */}
          <div className="card p-3">
            <h3 className="font-semibold text-[10px] mb-2" style={{ color: "var(--text-primary)" }}>Repository Coverage</h3>
            <div className="space-y-1.5">
              {[["📍 Stations", "6 total · 4 NCPOR"], ["🚢 Routes", `${ROUTES.length} mapped`], ["📄 Publications", "320+"], ["💾 Datasets", "120+"], ["🌊 Sea Region", "Southern Ocean / Arctic"]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-[10px]">
                  <span style={{ color: "var(--text-muted)" }}>{k as string}</span>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{v as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-shrink-0 px-3 pb-3">
        <div className="card px-4 py-2 flex items-center gap-4">
          <span className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--text-primary)" }}>Timeline</span>
          <div className="flex items-center gap-1 flex-1">
            {YEARS.map(y => {
              const hasRoute = ROUTES.some(r => r.year === y);
              return (
                <button key={y} onClick={() => setTimeYear(y)}
                  className="flex-1 text-center py-1.5 rounded text-xs font-medium transition-all relative"
                  style={{ background: timeYear === y ? "var(--accent)" : "var(--border)", color: timeYear === y ? "white" : "var(--text-secondary)", fontWeight: timeYear === y ? 700 : 400 }}>
                  {y}
                  {hasRoute && <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full" style={{ background: timeYear === y ? "white" : "var(--accent)" }}/>}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] flex-shrink-0 font-semibold" style={{ color: "var(--accent)" }}>
            {visibleRoutes.length} route(s) shown
          </span>
        </div>
      </div>
    </div>
  );
}
