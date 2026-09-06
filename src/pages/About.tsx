import { useState } from "react";

interface Props { onNavigate?: (p: string) => void; }

const researchDomains = [
  { name: "Glaciology & Ice Core Science", icon: "🧊", count: { datasets: 42, pubs: 187, researchers: 18 }, dest: "datasets", tags: ["Sea Ice","Ice Cores","Glacier Dynamics","Mass Balance"], desc: "Study of glaciers, ice sheets, ice cores and cryosphere dynamics in polar regions." },
  { name: "Physical Oceanography", icon: "🌊", count: { datasets: 38, pubs: 214, researchers: 22 }, dest: "datasets", tags: ["Southern Ocean","Water Masses","Currents","Thermohaline"], desc: "Physical properties and dynamics of polar oceans including the Southern Ocean and Arctic." },
  { name: "Marine Biology & Ecology", icon: "🦭", count: { datasets: 29, pubs: 96, researchers: 14 }, dest: "datasets", tags: ["Phytoplankton","Krill","Benthic","Biodiversity"], desc: "Marine ecosystems, biodiversity, and biological productivity in polar waters." },
  { name: "Atmospheric & Climate Science", icon: "🌬️", count: { datasets: 31, pubs: 143, researchers: 16 }, dest: "datasets", tags: ["Aerosols","GHG","Ozone","Boundary Layer"], desc: "Atmospheric composition, climate variability, and polar vortex dynamics." },
  { name: "Seismology & Geoscience", icon: "🗻", count: { datasets: 14, pubs: 57, researchers: 9 }, dest: "datasets", tags: ["Bedrock","Tectonic","Gravity","Permafrost"], desc: "Geological structure, tectonic history and geophysics of polar continental shelves." },
  { name: "Paleoclimate & Proxies", icon: "📜", count: { datasets: 17, pubs: 88, researchers: 11 }, dest: "publications", tags: ["Ice Core Proxies","Sediment","Climate Reconstruction","Holocene"], desc: "Reconstruction of past climate using ice cores, marine sediment, and other paleoclimate proxies." },
];

const facilities = [
  { name: "Maitri Station", location: "Antarctica (Schirmacher Oasis, 70°S)", type: "Permanent", since: 1989, icon: "🏔️", desc: "India's second Antarctic station and primary year-round facility. Supports 25+ researchers during winter. Houses meteorology, seismic monitoring, and atmospheric labs.", connected: { expeditions: 32, datasets: 148, pubs: 320 }, dest: "expeditions" },
  { name: "Bharati Station", location: "Antarctica (Prydz Bay, 69°S)", type: "Permanent", since: 2012, icon: "🧊", desc: "India's third and newest Antarctic station, strategically located near Prydz Bay. Purpose-built for oceanography, sea ice monitoring, and biodiversity studies.", connected: { expeditions: 14, datasets: 89, pubs: 176 }, dest: "expeditions" },
  { name: "Himadri Station", location: "Svalbard, Arctic (79°N)", type: "Seasonal", since: 2008, icon: "❄️", desc: "India's first Arctic research station, operational during summer months. Focus on atmospheric science, glaciology and Arctic amplification studies.", connected: { expeditions: 16, datasets: 67, pubs: 94 }, dest: "expeditions" },
  { name: "MV Sagar Nidhi", location: "Southern Ocean operations", type: "Research Vessel", since: 2006, icon: "🚢", desc: "Multi-purpose oceanographic research vessel. Equipped for deep sea coring, acoustic Doppler, CTD rosettes, and underway sampling.", connected: { expeditions: 28, datasets: 203, pubs: 271 }, dest: "expeditions" },
  { name: "Central Analytical Laboratory", location: "Vasco-da-Gama, Goa", type: "Land Facility", since: 1998, icon: "🔬", desc: "Houses ICP-MS, isotope ratio mass spectrometry, gas chromatography, and scanning electron microscopy. Processes samples from all NCPOR field programmes.", connected: { expeditions: 46, datasets: 0, pubs: 512 }, dest: "datasets" },
  { name: "Polar Archive & Data Centre", location: "Vasco-da-Gama, Goa", type: "Data Centre", since: 1998, icon: "💾", desc: "Repository for polar ice cores, sediment samples, and scientific data. Maintains over 350 datasets in compliance with SCAR data protocols.", connected: { expeditions: 46, datasets: 352, pubs: 0 }, dest: "datasets" },
];

const programs = [
  { name: "Indian Antarctic Programme (IAP)", since: 1981, status: "Active", desc: "India's flagship polar programme managing annual Antarctic expeditions, overwintering operations, and long-term monitoring at Maitri and Bharati.", expeditions: 46, budget: "₹85 Cr/year (est.)" },
  { name: "Indian Arctic Programme", since: 2007, status: "Active", desc: "Annual Arctic research campaigns from Himadri station and associated expeditions aboard international platforms.", expeditions: 16, budget: "₹12 Cr/year (est.)" },
  { name: "Southern Ocean Studies", since: 2004, status: "Active", desc: "Dedicated Southern Ocean research cruises aboard MV Sagar Nidhi, investigating climate–biology–chemistry interactions.", expeditions: 28, budget: "₹35 Cr/year (est.)" },
  { name: "Ice Core Research Programme", since: 1999, status: "Active", desc: "Recovery and analysis of ice cores from East Antarctica for paleoclimate reconstruction. India holds a 220m core from Maitri region.", expeditions: 12, budget: "₹8 Cr/year (est.)" },
];

const connectedInstitutions = [
  { name: "SCAR", full: "Scientific Committee on Antarctic Research", type: "Governing body", domain: "International" },
  { name: "IASC", full: "International Arctic Science Committee", type: "Governing body", domain: "International" },
  { name: "COMNAP", full: "Council of Managers of National Antarctic Programs", type: "Operations body", domain: "International" },
  { name: "British Antarctic Survey", full: "BAS", type: "Research partner", domain: "UK" },
  { name: "Alfred Wegener Institute", full: "AWI", type: "Research partner", domain: "Germany" },
  { name: "Australian Antarctic Division", full: "AAD", type: "Research partner", domain: "Australia" },
  { name: "NIPR Japan", full: "National Institute of Polar Research", type: "Research partner", domain: "Japan" },
  { name: "MoES", full: "Ministry of Earth Sciences", type: "Parent ministry", domain: "India" },
  { name: "IITM Pune", full: "Indian Institute of Tropical Meteorology", type: "Collaborating institute", domain: "India" },
  { name: "NIO Goa", full: "National Institute of Oceanography", type: "Collaborating institute", domain: "India" },
  { name: "PRL Ahmedabad", full: "Physical Research Laboratory", type: "Collaborating institute", domain: "India" },
  { name: "IISc Bangalore", full: "Indian Institute of Science", type: "Collaborating institute", domain: "India" },
];

const keyPublications = [
  { title: "Four decades of Indian polar research: achievements and future directions", journal: "Current Science", year: 2023, domain: "Institutional Review", evidence: "source_backed" },
  { title: "Southern Ocean dynamics and its teleconnection to Indian monsoon", journal: "Climate Dynamics", year: 2022, domain: "Oceanography", evidence: "source_backed" },
  { title: "Holocene climate reconstruction from East Antarctic ice cores", journal: "Quaternary Science Reviews", year: 2021, domain: "Paleoclimate", evidence: "source_backed" },
  { title: "Sea ice variability in Prydz Bay from satellite and in-situ observations", journal: "Remote Sensing of Environment", year: 2023, domain: "Glaciology", evidence: "synthesis" },
  { title: "Arctic amplification and its influence on Indian weather patterns", journal: "Geophysical Research Letters", year: 2022, domain: "Atmospheric Science", evidence: "synthesis" },
];

export default function About({ onNavigate }: Props) {
  const [tab, setTab] = useState("overview");
  const [selectedFacility, setSelectedFacility] = useState<typeof facilities[0] | null>(null);
  const [domainFilter, setDomainFilter] = useState("All");

  const institutionTypes = ["All", "International", "India", "UK", "Germany", "Australia", "Japan"];
  const filteredInstitutions = connectedInstitutions.filter(i => domainFilter === "All" || i.domain === domainFilter);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img src="https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=1400&q=80" alt="NCPOR" className="w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(14,31,61,0.9) 0%, rgba(14,31,61,0.4) 100%)" }}/>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-1">Ministry of Earth Sciences · Government of India</div>
          <h1 className="text-2xl font-bold text-white">About NCPOR</h1>
          <p className="text-blue-200 text-sm mt-1">National Centre for Polar and Ocean Research · Since 1981</p>
        </div>
      </div>

      <div className="p-6">
        <div className="tab-bar w-fit mb-5">
          {[["overview","Overview"],["domains","Research Domains"],["facilities","Facilities & Stations"],["programs","Key Programs"],["network","Research Network"]].map(([id, label]) => (
            <button key={id} className={`tab-item ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-10 rounded flex items-center justify-center text-2xl flex-shrink-0 border" style={{ borderColor: "var(--border)" }}>🇮🇳</div>
                  <div>
                    <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>National Centre for Polar and Ocean Research</h2>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Autonomous institute · Ministry of Earth Sciences · Vasco-da-Gama, Goa</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                  NCPOR (formerly NCAOR) coordinates India's national programmes in Antarctica, the Arctic and the Southern Ocean. Established in 1998, it is India's nodal agency for polar science and manages three permanent research stations on two continents.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  India's Antarctic engagement predates NCPOR — the first Indian Antarctic Expedition was conducted in 1981 by the Department of Ocean Development. NCPOR has since grown into a multi-disciplinary institution with research spanning glaciology, oceanography, atmospheric science, marine biology, and paleoclimatology.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-3">
                {[["46","Antarctic Expeditions"],["3","Research Stations"],["1,200+","Publications"],["350+","Datasets"]].map(([v,l]) => (
                  <div key={l} className="card p-4 text-center">
                    <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>{v}</div>
                    <div className="text-xs mt-1 leading-tight" style={{ color: "var(--text-secondary)" }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Recent key publications */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Selected Institutional Publications</h3>
                  <button className="text-xs font-semibold" style={{ color: "var(--accent)" }} onClick={() => onNavigate?.("publications")}>View all →</button>
                </div>
                <div className="space-y-2">
                  {keyPublications.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => onNavigate?.("publications")}>
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-sm" style={{ background: "var(--accent-light)" }}>📄</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium leading-snug" style={{ color: "var(--text-primary)" }}>{p.title}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{p.journal} · {p.year} · {p.domain}</div>
                      </div>
                      <span className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${p.evidence === "source_backed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{p.evidence === "source_backed" ? "Source-backed" : "Synthesis"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card overflow-hidden">
                <img src="https://images.unsplash.com/photo-1766699623469-32a2c3b17a17?w=400&q=80" alt="Bharati Station" className="w-full object-cover" style={{ height: 150 }}/>
                <div className="p-3">
                  <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Bharati Station, Prydz Bay</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Operational since 2012 · Prydz Bay, East Antarctica</div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Connected Knowledge</h3>
                <div className="space-y-1.5">
                  {[["🚢","46 Indian Antarctic Expeditions","expeditions"],["📄","1,200+ Publications indexed","publications"],["💾","350+ Datasets archived","datasets"],["🗺️","Explore station locations","map"],["🎓","Learning resources","education"]].map(([icon, label, dest]) => (
                    <button key={dest as string} onClick={() => onNavigate?.(dest as string)} className="w-full flex items-center gap-2 text-xs px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left" style={{ color: "var(--text-secondary)" }}>
                      <span className="text-base">{icon as string}</span>
                      <span className="flex-1">{label as string}</span>
                      <span style={{ color: "var(--accent)" }}>→</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>Vision</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>To be a globally recognized leader in polar and ocean research, advancing India's scientific interests in polar regions and contributing to global climate understanding.</p>
              </div>
            </div>
          </div>
        )}

        {/* RESEARCH DOMAINS */}
        {tab === "domains" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Institutional Research Domains</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Each domain links to connected datasets, publications, and researchers in the knowledge base.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchDomains.map(d => (
                <div key={d.name} className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl flex-shrink-0">{d.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{d.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{d.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {d.tags.map(t => <span key={t} className="tag text-[9px]">{t}</span>)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[["Datasets", d.count.datasets, "datasets"],["Publications", d.count.pubs, "publications"],["Researchers", d.count.researchers, "expeditions"]].map(([label, count, dest]) => (
                      <button key={label as string} onClick={() => onNavigate?.(dest as string)} className="text-center p-1.5 rounded hover:bg-slate-50 transition-colors">
                        <div className="font-bold text-sm" style={{ color: "var(--accent)" }}>{count as number}</div>
                        <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{label as string}</div>
                      </button>
                    ))}
                  </div>
                  <button className="btn-outline btn-sm w-full text-[10px]" onClick={() => onNavigate?.(d.dest)}>
                    Browse {d.name.split(" ")[0]} Knowledge →
                  </button>
                </div>
              ))}
            </div>
            <div className="card p-4 mt-2">
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Note:</span> Dataset and publication counts reflect records currently indexed in the NCPOR knowledge base. Actual institutional output may exceed indexed records. Gaps are labelled as "potential repository coverage gap" — not a scientific absence.
              </div>
            </div>
          </div>
        )}

        {/* FACILITIES */}
        {tab === "facilities" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {facilities.map(f => (
              <div key={f.name} className={`card p-5 cursor-pointer border-2 transition-all hover:shadow-md ${selectedFacility?.name === f.name ? "border-blue-400" : "border-transparent"}`} onClick={() => setSelectedFacility(selectedFacility?.name === f.name ? null : f)}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{f.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{f.name}</h3>
                      <span className="tag flex-shrink-0 text-[9px]">{f.type}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-3 h-3 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{f.location}</span>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>· Since {f.since}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                    {/* Entity connections */}
                    <div className="flex gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                      {f.connected.expeditions > 0 && (
                        <button className="flex items-center gap-1 text-[10px] hover:underline" style={{ color: "var(--accent)" }} onClick={e => { e.stopPropagation(); onNavigate?.("expeditions"); }}>
                          🚢 {f.connected.expeditions} expeditions
                        </button>
                      )}
                      {f.connected.datasets > 0 && (
                        <button className="flex items-center gap-1 text-[10px] hover:underline" style={{ color: "var(--accent)" }} onClick={e => { e.stopPropagation(); onNavigate?.("datasets"); }}>
                          💾 {f.connected.datasets} datasets
                        </button>
                      )}
                      {f.connected.pubs > 0 && (
                        <button className="flex items-center gap-1 text-[10px] hover:underline" style={{ color: "var(--accent)" }} onClick={e => { e.stopPropagation(); onNavigate?.("publications"); }}>
                          📄 {f.connected.pubs} publications
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {selectedFacility?.name === f.name && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button className="btn-primary btn-sm text-[10px]" onClick={e => { e.stopPropagation(); onNavigate?.("map"); }}>View on Map →</button>
                      <button className="btn-outline btn-sm text-[10px]" onClick={e => { e.stopPropagation(); onNavigate?.("expeditions"); }}>Expeditions →</button>
                      <button className="btn-outline btn-sm text-[10px]" onClick={e => { e.stopPropagation(); onNavigate?.("ai"); }}>Ask Polar →</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* KEY PROGRAMS */}
        {tab === "programs" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map(p => (
                <div key={p.name} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm leading-snug pr-2" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                    <span className={`flex-shrink-0 text-[9px] px-2 py-0.5 rounded-full font-semibold ${p.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{p.status}</span>
                  </div>
                  <div className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>Established {p.since}</div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
                  <div className="flex gap-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "var(--accent)" }}>{p.expeditions}</div>
                      <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>Expeditions</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "var(--accent)" }}>{p.budget}</div>
                      <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>Annual budget (est.)</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-outline btn-sm text-[10px]" onClick={() => onNavigate?.("expeditions")}>Expeditions →</button>
                    <button className="btn-outline btn-sm text-[10px]" onClick={() => onNavigate?.("publications")}>Publications →</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-4">
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Budget figures are illustrative estimates based on public reporting. Official programme budgets are published by Ministry of Earth Sciences in Annual Reports. <button className="underline" style={{ color: "var(--accent)" }} onClick={() => onNavigate?.("publications")}>See institutional publications →</button></div>
            </div>
          </div>
        )}

        {/* RESEARCH NETWORK */}
        {tab === "network" && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Connected Institutions</h2>
                <div className="flex gap-1.5 flex-wrap">
                  {institutionTypes.map(t => (
                    <button key={t} onClick={() => setDomainFilter(t)} className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${domainFilter === t ? "border-blue-400 bg-blue-50 text-blue-700 font-semibold" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredInstitutions.map(inst => (
                  <div key={inst.name} className="card p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{inst.name}</span>
                      <span className="tag text-[9px] flex-shrink-0 ml-2">{inst.domain}</span>
                    </div>
                    <div className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>{inst.full}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{inst.type}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>International Agreements & Data Sharing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Antarctic Treaty System", desc: "India is an original consultative party (1983). All research outputs from Antarctica subject to Antarctic Treaty obligations on data sharing and environmental protection.", link: "expeditions" },
                  { title: "SCAR Data Policy", desc: "NCPOR follows SCAR's Open Data Policy. Datasets from expeditions are progressively released to global repositories including PANGAEA and NSDIC.", link: "datasets" },
                  { title: "MoU with 12+ Institutions", desc: "Active memoranda of understanding with BAS, AWI, AAD, NIPR, KOPRI and others for joint expeditions, data exchange, and researcher mobility.", link: "publications" },
                ].map(item => (
                  <div key={item.title}>
                    <h4 className="font-semibold text-xs mb-1.5" style={{ color: "var(--text-primary)" }}>{item.title}</h4>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                    <button className="text-[10px] font-semibold" style={{ color: "var(--accent)" }} onClick={() => onNavigate?.(item.link)}>View related records →</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Institutional Knowledge Connections</h3>
              <div className="flex flex-wrap gap-2">
                {[["Browse all researchers","expeditions"],["Publications by domain","publications"],["Collaborative datasets","datasets"],["Station knowledge panels","map"],["Ask about NCPOR","ai"]].map(([label, dest]) => (
                  <button key={dest as string} className="btn-outline btn-sm text-[10px]" onClick={() => onNavigate?.(dest as string)}>{label as string} →</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
