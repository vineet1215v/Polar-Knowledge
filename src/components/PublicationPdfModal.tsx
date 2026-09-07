import { useState } from "react";
import { gameStore } from "../gameStore";

export interface PublicationItem {
  id: number;
  title: string;
  journal: string;
  year: number;
  authors: string;
  thumb: string;
  doi: string;
}

interface Props {
  pub: PublicationItem;
  onClose: () => void;
  onNavigate?: (p: string) => void;
}

export default function PublicationPdfModal({ pub, onClose }: Props) {
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"document" | "figures">("document");
  const [highlightMode, setHighlightMode] = useState<boolean>(false);
  const [paperSearch, setPaperSearch] = useState<string>("");

  const totalPages = 8;

  const handleDownloadPdf = () => {
    gameStore.addXP(25, `Downloaded Manuscript PDF: ${pub.title.slice(0, 30)}...`);
    try {
      const element = document.createElement("a");
      const file = new Blob(
        [
          `%PDF-1.4\n% National Centre for Polar and Ocean Research (NCPOR)\nTitle: ${pub.title}\nAuthors: ${pub.authors}\nJournal: ${pub.journal} (${pub.year})\nDOI: ${pub.doi}\n\n[OFFICIAL SCIENTIFIC MANUSCRIPT REPOSITORY FILE]\n\nAbstract:\nHigh-latitude observations collected during Indian polar expeditions provide critical empirical baselines for understanding global cryospheric climate feedbacks.\n`,
        ],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(file);
      element.href = url;
      element.download = `${pub.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 35)}_NCPOR.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.warn("Download error:", e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Top PDF Reader Control Ribbon */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 flex-shrink-0">
          {/* Document Title & Meta */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-[11px] shadow-xs flex-shrink-0">
              PDF
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm text-white truncate max-w-xs sm:max-w-md md:max-w-lg">
                {pub.title}
              </h3>
              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <span className="text-slate-300 font-medium">{pub.journal}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">DOI: {pub.doi}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Open Access</span>
              </div>
            </div>
          </div>

          {/* Reader Toolbar Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* View Switcher */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab("document")}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  activeTab === "document" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-400 hover:text-white"
                }`}
              >
                 Paper
              </button>
              <button
                onClick={() => setActiveTab("figures")}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  activeTab === "figures" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-400 hover:text-white"
                }`}
              >
                 Figures
              </button>
            </div>

            {/* Page navigation */}
            {activeTab === "document" && (
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg text-xs text-slate-300">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-1.5 py-0.5 rounded hover:bg-slate-700 disabled:opacity-40 font-bold"
                  title="Previous Page"
                >
                  ◀
                </button>
                <span className="font-mono font-bold text-[11px] px-1 text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-1.5 py-0.5 rounded hover:bg-slate-700 disabled:opacity-40 font-bold"
                  title="Next Page"
                >
                  ▶
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            {activeTab === "document" && (
              <div className="hidden md:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg text-xs text-slate-300">
                <button
                  onClick={() => setZoom(prev => Math.max(75, prev - 15))}
                  className="px-1 font-bold hover:text-white"
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="font-mono font-semibold text-[10px] w-8 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom(prev => Math.min(150, prev + 15))}
                  className="px-1 font-bold hover:text-white"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            )}

            {/* Highlighter tool */}
            <button
              onClick={() => {
                setHighlightMode(!highlightMode);
                if (!highlightMode) gameStore.addXP(15, "Activated Scientific Highlighter Tool");
              }}
              className={`px-2 py-1 rounded-lg text-xs transition flex items-center gap-1 ${
                highlightMode ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
              title="Toggle Text Highlight Tool"
            >
              <span></span>
              <span className="hidden sm:inline">Highlight</span>
            </button>

            {/* Download PDF button */}
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <span></span>
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm ml-1"
            >
              x
            </button>
          </div>
        </div>

        {/* Page Thumbnail Strip (When in document mode) */}
        {activeTab === "document" && (
          <div className="bg-slate-800/95 px-4 py-1.5 border-b border-slate-700 flex items-center gap-2 overflow-x-auto text-xs text-slate-300 flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex-shrink-0">
              Jump to Page:
            </span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum);
                  gameStore.addXP(5, `Navigated to Page ${pageNum}`);
                }}
                className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white shadow-xs"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                }`}
              >
                P.{pageNum}
              </button>
            ))}

            {/* Search in paper input */}
            <div className="ml-auto hidden sm:flex items-center gap-1">
              <input
                type="text"
                value={paperSearch}
                onChange={e => setPaperSearch(e.target.value)}
                placeholder="Find in manuscript..."
                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-36"
              />
              {paperSearch && (
                <button
                  onClick={() => setPaperSearch("")}
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  x
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reader Canvas Area */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-3 sm:p-6 flex justify-center">
          {activeTab === "document" && (
            <div
              className="bg-white shadow-xl rounded-sm border border-slate-300 text-slate-900 transition-all duration-200"
              style={{
                width: `${zoom}%`,
                maxWidth: "850px",
                minHeight: "1050px",
                padding: "44px 50px",
                fontFamily: "Charter, Georgia, 'Times New Roman', serif",
              }}
            >
              {/* Header Ribbon */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-slate-900 text-xs font-sans text-slate-600">
                <div className="flex items-center gap-2 font-bold tracking-wider uppercase text-blue-900">
                  <span>{pub.journal}</span>
                  <span>•</span>
                  <span>Vol. 42, Issue 3</span>
                </div>
                <div className="font-mono text-[10px] text-slate-500">NCPOR REPOSITORY OPEN ARCHIVE</div>
              </div>

              {/* PAGE 1: Front Matter & Abstract */}
              {currentPage === 1 && (
                <div>
                  <h1 className="text-2xl font-bold leading-tight mb-3 text-slate-950 font-serif">
                    {pub.title}
                  </h1>

                  <div className="text-sm text-slate-700 mb-1 font-sans font-medium">
                    {pub.authors}
                  </div>

                  <div className="text-xs text-slate-500 font-sans mb-5">
                    National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Headland Sada, Vasco-da-Gama, Goa 403804, India
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 font-sans text-[11px] pb-3 border-b border-slate-200">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                      Received: 14 Oct {pub.year - 1}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      Accepted: 19 Jan {pub.year}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-semibold">
                      DOI: {pub.doi}
                    </span>
                  </div>

                  {/* Abstract Box */}
                  <div
                    className={`p-5 rounded-lg mb-6 border transition ${
                      highlightMode
                        ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-300/40"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
                      Abstract
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-800 text-justify">
                      High-latitude polar observations collected during Indian scientific expeditions provide critical
                      empirical baselines for understanding global cryospheric climate feedbacks. This study synthesizes
                      multi-sensor observations spanning satellite remote sensing, in-situ CTD profiles, ice-core physical
                      stratigraphy, and aerosol optical spectrometry. Our findings demonstrate systematic decadal shifts in
                      boundary layer dynamics and turbulent heat flux partitioning. Quantitative models reveal strong
                      teleconnections between high-latitude sea ice extent and tropical monsoon variability, underscoring
                      the necessity of sustained year-round polar observation arrays at Maitri, Bharati, and Himadri stations.
                    </p>
                    <div className="mt-3 font-sans text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-bold text-slate-800">Keywords:</span>
                      <span>Polar Cryosphere • Sea Ice Dynamics • Oceanographic Circulation • Atmospheric Teleconnections</span>
                    </div>
                  </div>

                  {/* Section 1: Introduction */}
                  <div className="space-y-3 text-sm leading-relaxed text-slate-800 text-justify">
                    <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-200 pb-1">
                      1. Introduction & Scientific Objectives
                    </h3>
                    <p>
                      Polar oceans and ice sheets constitute pivotal heat sinks and thermohaline circulation regulators
                      for the Earth climate system. Over the past four decades, the Indian Antarctic and Arctic programs
                      have maintained sustained scientific observation corridors across the Princess Astrid Coast (Dronning
                      Maud Land), Prydz Bay (Larsemann Hills), and the High-Arctic Svalbard archipelago.
                    </p>
                    <p>
                      Recent satellite scatterometer and passive microwave radiometry records show profound shifts in
                      coastal polynya activity and fast-ice stability. The central objective of this research is to evaluate
                      in-situ hydrographic and glaciological time series to resolve physical mechanisms driving anomalous
                      cryospheric retreat.
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 2: Observation Sites & Logistics */}
              {currentPage === 2 && (
                <div className="space-y-4 text-sm leading-relaxed text-slate-800 text-justify">
                  <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-200 pb-1">
                    2. Geographic Setting & Polar Observatories
                  </h3>
                  <p>
                    Field investigations were coordinated from India's permanent Antarctic stations:{" "}
                    <strong>Maitri</strong> (70°46′S, 11°44′E) situated on the solid bedrock of the Schirmacher Oasis,
                    and <strong>Bharati</strong> (69°24′S, 76°11′E) overlooking Prydz Bay in the Larsemann Hills.
                  </p>
                  <p className={highlightMode ? "bg-amber-200/60 px-1 rounded" : ""}>
                    Maitri station provides continuous atmospheric LIDAR, Dobson spectrophotometer, and fluxgate
                    magnetometer recordings. The station is buffered by Lake Priyadarshini, which acts as a sterile freshwater
                    benchmark for biogeochemical and psychrophilic limnology studies.
                  </p>
                  <p>
                    In the high Arctic, observations were conducted at <strong>Himadri Station</strong> (78°55′N, 11°56′E)
                    in Ny-Ålesund, Svalbard, complemented by the submerged <strong>IndARC</strong> multi-sensor mooring
                    anchored at 192 m depth in Kongsfjorden.
                  </p>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans space-y-1 my-4">
                    <div className="font-bold text-slate-900">Table 1: Primary Indian Polar Field Stations Used in Study</div>
                    <div className="text-slate-600">
                      • Maitri Station (70.77°S, 11.74°E) — Schirmacher Oasis bedrock base (Est. 1989)<br />
                      • Bharati Station (69.41°S, 76.19°E) — Larsemann Hills aerodynamic facility (Est. 2012)<br />
                      • Himadri Station (78.92°N, 11.93°E) — Svalbard High-Arctic atmospheric hub (Est. 2008)<br />
                      • IndARC Mooring (78.98°N, 11.85°E) — Kongsfjorden sub-surface moored array (Est. 2014)
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 3: Methodology & Sensor Instrumentation */}
              {currentPage === 3 && (
                <div className="space-y-4 text-sm leading-relaxed text-slate-800 text-justify">
                  <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-200 pb-1">
                    3. Measurement Methodology & Sensor Payload
                  </h3>
                  <p>
                    Oceanographic profiles were gathered using a Sea-Bird SBE 911plus Conductivity-Temperature-Depth (CTD)
                    system mounted on a 36-bottle rosette carousel. Water samples were analyzed for dissolved oxygen,
                    nutrients, salinity, and trace metal complexes in accordance with GO-SHIP international standards.
                  </p>
                  <p>
                    Ice sheet mass balance and surface firn density were mapped using a 400 MHz ground-penetrating radar
                    (GPR) coupled with dual-frequency geodetic GNSS stakes surveyed at seasonal intervals.
                  </p>
                  <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-xs font-sans space-y-1.5">
                    <span className="font-bold text-blue-900 uppercase tracking-wide">Instrumentation Precision:</span>
                    <ul className="list-disc pl-4 text-blue-950 space-y-1">
                      <li>CTD Temperature Accuracy: ±0.001°C (ITS-90 standard)</li>
                      <li>CTD Conductivity Accuracy: ±0.0003 S/m (equivalent to ±0.002 PSU)</li>
                      <li>GPR Penetration Depth: Up to 120 m in cold polar firn</li>
                      <li>Dobson Spectrophotometer Total Ozone Accuracy: ±1.0% Dobson Units (DU)</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* PAGE 4: High-Res Figure & Data Plot */}
              {currentPage === 4 && (
                <div className="space-y-4">
                  <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-200 pb-1">
                    4. Observational Results & Decadal Time-Series
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 my-4">
                    <div className="rounded-lg overflow-hidden h-64 bg-slate-900 relative">
                      <img src={pub.thumb} alt={pub.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 text-white rounded text-[10px] font-mono">
                        Plate 1: Multi-Sensor Correlation
                      </div>
                    </div>
                    <div className="mt-3 text-xs font-sans text-slate-700">
                      <span className="font-bold text-slate-900">Figure 1: </span>
                      Seasonal anomaly time series and vertical profiles collected during scientific transects.
                      Dashed red line indicates the 10-year rolling climatological mean, while shaded bands represent the
                      interquartile range.
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-800 text-justify">
                    Statistical regression indicates a statistically significant trend (p &lt; 0.01) demonstrating elevated
                    sub-surface heat transport into coastal embayments during austral summer months.
                  </p>
                </div>
              )}

              {/* PAGE 5: Ocean-Atmosphere Feedbacks */}
              {currentPage === 5 && (
                <div className="space-y-4 text-sm leading-relaxed text-slate-800 text-justify">
                  <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-200 pb-1">
                    5. Teleconnections & Indian Ocean Monsoon Couplings
                  </h3>
                  <p>
                    Cross-correlation analysis between Southern Ocean sea surface temperature anomalies and the Indian
                    Ocean Dipole (IOD) reveals a 3-to-4-month phase lag. Southern Annular Mode (SAM) positive phases
                    intensify westerly wind stress, driving enhanced northward Ekman transport.
                  </p>
                  <p className={highlightMode ? "bg-amber-200/60 px-1 rounded" : ""}>
                    This northward transport moderates equatorial Indian Ocean sea surface temperatures, directly altering
                    the moisture convergence pathways that fuel the Southwest Monsoon over the Indian subcontinent.
                  </p>
                </div>
              )}

              {/* PAGE 6: Discussion */}
              {currentPage === 6 && (
                <div className="space-y-4 text-sm leading-relaxed text-slate-800 text-justify">
                  <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-200 pb-1">
                    6. Scientific Discussion & Cryospheric Uncertainty
                  </h3>
                  <p>
                    While regional fast-ice melting exhibits rapid acceleration, internal variability remains high.
                    Coupled ocean-sea ice models often underestimate basal melting beneath ice shelves because boundary-layer
                    friction parameters are inadequately constrained by observational data.
                  </p>
                  <p>
                    The empirical datasets presented here reduce these parametric uncertainties by providing direct,
                    calibrated measurements under extreme polar winter conditions.
                  </p>
                </div>
              )}

              {/* PAGE 7: Data Availability Statement */}
              {currentPage === 7 && (
                <div className="space-y-4 text-sm leading-relaxed text-slate-800 text-justify">
                  <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-200 pb-1">
                    7. Data & Code Availability
                  </h3>
                  <p>
                    The raw and processed data supporting this manuscript are permanently archived in the{" "}
                    <strong>National Centre for Polar and Ocean Research (NCPOR) Open Repository</strong>.
                  </p>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono space-y-1">
                    <div>DOI: {pub.doi}</div>
                    <div>Repository ID: NCPOR-P-2024-{pub.id}</div>
                    <div>License: Creative Commons Attribution 4.0 (CC-BY 4.0)</div>
                    <div>Data Format: NetCDF-4 / CF-1.8 Convention</div>
                  </div>
                  <h4 className="font-sans font-bold text-xs uppercase text-slate-900 mt-4">Acknowledgements</h4>
                  <p className="text-xs text-slate-600 font-sans">
                    We thank the officers and crew of the chartered polar expedition vessels, the logistics personnel of the
                    Indian Antarctic Operations division, and the winter-over teams at Maitri and Bharati research stations.
                  </p>
                </div>
              )}

              {/* PAGE 8: References */}
              {currentPage === 8 && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
                  <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-200 pb-1 mb-3">
                    8. References & Bibliography
                  </h3>
                  <p>
                    [1] Sharma, A., Kumar, R., et al. (2024). Changing sea ice dynamics in the Southern Ocean.{" "}
                    <em>Journal of Glaciology</em>, 42(3), 118–134.
                  </p>
                  <p>
                    [2] Verma, P., Singh, S., et al. (2023). Atmospheric composition and black carbon aerosols over East Antarctica.{" "}
                    <em>Environmental Research Letters</em>, 18, 044012.
                  </p>
                  <p>
                    [3] Mehta, K., Rao, T., et al. (2023). Metagenomic profiling of cryophilic microbiomes in Schirmacher Oasis lakes.{" "}
                    <em>Polar Biology</em>, 46, 501–518.
                  </p>
                  <p>
                    [4] Iyer, S., Das, M., et al. (2022). High-Arctic hydrographic variability from the IndARC Kongsfjorden mooring.{" "}
                    <em>Climate Dynamics</em>, 59, 1289–1306.
                  </p>
                  <p>
                    [5] Nair, D., Pillai, J., et al. (2022). Twelve-year mass balance and ice velocity record at Dakshin Gangotri glacier.{" "}
                    <em>Annals of Glaciology</em>, 63, 45–58.
                  </p>
                  <p>
                    [6] Gupta, R., Patel, A., et al. (2024). Stratospheric polar vortex dynamics and teleconnections to the Indian Ocean.{" "}
                    <em>Geophysical Research Letters</em>, 51, e2024GL001234.
                  </p>
                </div>
              )}

              {/* Page Footer */}
              <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between text-xs font-sans text-slate-400">
                <span>© {pub.year} National Centre for Polar and Ocean Research</span>
                <span className="font-mono font-bold">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          )}

          {/* Tab 2: Figures Tab */}
          {activeTab === "figures" && (
            <div className="w-full max-w-4xl space-y-5">
              <div className="card p-5 border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Figure Plate 1: Time Series & Profile Analysis</h3>
                    <p className="text-xs text-slate-500">Dual-frequency radar and oceanographic CTD carousel data</p>
                  </div>
                  <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-bold border border-blue-100">
                    High Resolution (300 DPI)
                  </span>
                </div>
                <div className="h-96 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <img src={pub.thumb} alt={pub.title} className="w-full h-full object-cover" />
                </div>
                <div className="mt-3 p-3.5 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-200/80">
                  <strong>Figure 1 Description:</strong> Surface anomaly measurements recorded across 14 field sampling stations.
                  Data collected using in-situ CTD rosette probes and satellite scatterometer observations.
                  Shaded boundaries indicate the 95% bootstrap confidence interval.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
