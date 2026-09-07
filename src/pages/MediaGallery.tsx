import { useState, useRef, useEffect } from "react";
import { mediaItems as initialMediaItems, type MediaItem } from "../data";
import AddToWorkspace from "../components/AddToWorkspace";
import type { WorkspaceSource } from "../workspaceStore";
import { gameStore } from "../gameStore";

type Tab = "all" | "photo" | "video" | "360";

interface MediaGalleryProps {
  onNavigate?: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
}

// ── Toast Notification Component ──────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <span className="text-emerald-400 text-base">OK</span>
      <span className="text-xs font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white text-xs">x</button>
    </div>
  );
}

// ── Interactive 360 Panorama Viewer ─────────────────────────────────────────
function PanoramaViewer({ item }: { item: MediaItem }) {
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<{ id: string; label: string; info: string } | null>(null);

  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setYaw(prev => (prev + 0.15) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setYaw(prev => (prev - dx * 0.12 + 100) % 100);
    setPitch(prev => Math.max(-25, Math.min(25, prev - dy * 0.1)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Compass heading direction
  const headings = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const headingIndex = Math.floor((yaw / 100) * 8) % 8;
  const currentHeading = headings[headingIndex];

  return (
    <div
      className="relative w-full h-full min-h-[360px] bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Panorama Surface */}
      <div
        className="w-full h-full transition-transform duration-75"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundPosition: `${yaw}% ${50 + pitch}%`,
          backgroundSize: `${220 * zoom}% auto`,
          backgroundRepeat: "repeat-x",
          filter: "brightness(0.95)",
        }}
      />

      {/* 360 Overlay UI Controls */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"/>
        <span className="font-semibold text-[11px] tracking-wide">360° VIRTUAL PANORAMA</span>
        <span className="text-white/40">|</span>
        <span className="text-[10px] text-sky-300 font-mono">Compass: {currentHeading} ({Math.round((yaw / 100) * 360)}°)</span>
      </div>

      {/* Quick Interactive Hotspots */}
      {item.hotspots?.map(hs => {
        const hotspotX = ((hs.x - yaw + 100) % 100);
        if (hotspotX < 5 || hotspotX > 95) return null;
        return (
          <div
            key={hs.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
            style={{ left: `${hotspotX}%`, top: `${hs.y + pitch * 0.5}%` }}
            onClick={e => {
              e.stopPropagation();
              setActiveHotspot(hs);
            }}
          >
            <div className="relative flex items-center justify-center cursor-pointer">
              <span className="absolute w-7 h-7 rounded-full bg-blue-500/40 animate-ping"/>
              <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[11px] font-bold hover:scale-125 transition-transform">
                ⊙
              </div>
              <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-md border border-slate-700 whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                {hs.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Hotspot Info Card */}
      {activeHotspot && (
        <div className="absolute bottom-16 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-blue-500/30 shadow-2xl z-30 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="font-semibold text-xs text-sky-400 flex items-center gap-1.5">
              <span></span> {activeHotspot.label}
            </div>
            <button onClick={() => setActiveHotspot(null)} className="text-slate-400 hover:text-white text-xs">x</button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{activeHotspot.info}</p>
        </div>
      )}

      {/* Pan & Zoom On-Screen Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-lg border border-white/10 z-20">
        <button
          onClick={() => setZoom(z => Math.min(1.8, z + 0.2))}
          title="Zoom In"
          className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded text-sm font-bold"
        >
          +
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.8, z - 0.2))}
          title="Zoom Out"
          className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded text-sm font-bold"
        >
          -
        </button>
        <button
          onClick={() => { setZoom(1); setPitch(0); setYaw(50); }}
          title="Reset View"
          className="px-2 h-7 flex items-center justify-center text-[10px] text-white/80 hover:bg-white/20 rounded"
        >
          Reset
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
          className={`px-2 h-7 flex items-center gap-1 rounded text-[10px] ${autoRotate ? "bg-blue-600 text-white font-medium" : "text-white/70 hover:bg-white/20"}`}
        >
          <span>⟳</span> {autoRotate ? "Auto" : "Paused"}
        </button>
      </div>

      <div className="absolute bottom-3 left-3 text-[10px] text-white/60 bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs pointer-events-none">
        Drag to look around 360° · Click ⊙ hotspots
      </div>
    </div>
  );
}

// ── Interactive Video Player ───────────────────────────────────────────────
function VideoPlayer({ item }: { item: MediaItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[360px] bg-black flex flex-col items-center justify-center group overflow-hidden select-none">
      <video
        ref={videoRef}
        src={item.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
        poster={item.image}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Play Overlay when Paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity group-hover:bg-black/30"
        >
          <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-blue-600 transition-all">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-1">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 pt-6 flex flex-col gap-2 transition-opacity duration-300">
        {/* Seek Bar */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
        />

        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="hover:text-blue-400 p-1" title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>

            {/* Time */}
            <span className="text-[11px] font-mono text-white/80">
              {formatTime(currentTime)} / {formatTime(duration || (item.duration ? 862 : 0))}
            </span>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <button onClick={toggleMute} className="hover:text-blue-400 p-1" title={isMuted ? "Unmute" : "Mute"}>
                {isMuted || volume === 0 ? "Muted" : volume < 0.5 ? "Volume" : "Volume"}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded cursor-pointer accent-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Resolution Tag */}
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 font-mono">{item.resolution.split(" ")[0]}</span>

            {/* Speed Button */}
            <button
              onClick={changeSpeed}
              className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] font-semibold"
              title="Playback Speed"
            >
              {speed}x
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="hover:text-blue-400 p-1" title="Fullscreen">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                {isFullscreen ? (
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                ) : (
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail & Intelligence Modal ───────────────────────────────────────────
function MediaIntelligencePanel({
  item,
  onClose,
  onNavigate,
  onAddToWorkspace,
  onOpenStudio,
  onUpdateItem,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  itemIndex,
  totalItems,
  onToast,
}: {
  item: MediaItem;
  onClose: () => void;
  onNavigate?: (p: string) => void;
  onAddToWorkspace?: (s: WorkspaceSource) => void;
  onOpenStudio?: () => void;
  onUpdateItem: (updated: MediaItem) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  itemIndex: number;
  totalItems: number;
  onToast: (msg: string) => void;
}) {
  const [aiTab, setAiTab] = useState<"context" | "ai" | "story">("context");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetAudience, setTargetAudience] = useState("General Public");
  const [storyAngle, setStoryAngle] = useState("Climate & Cryosphere");

  const [suggestions, setSuggestions] = useState([
    {
      id: "s1",
      field: "Caption / Description",
      current: item.description || item.title,
      suggested: `${item.title} — documented during ${item.expedition} at ${item.location} (${item.coordinates}). Contributes to long-term cryospheric observation at NCPOR.`,
      confidence: 88,
      status: "pending" as "pending" | "accepted" | "rejected",
    },
    {
      id: "s2",
      field: "Scientific Keywords",
      current: item.tags.join(", "),
      suggested: `${item.tags.join(", ")}, Cryosphere Dynamics, Polar Observation, NCPOR Archive, Environmental Monitoring`,
      confidence: 94,
      status: "pending" as "pending" | "accepted" | "rejected",
    },
    {
      id: "s3",
      field: "Connected Research",
      current: "Unlinked",
      suggested: "Southern Ocean Boundary Layer & Sea Ice Evolution (2024 - NCPOR/MoES)",
      confidence: 76,
      status: "pending" as "pending" | "accepted" | "rejected",
    },
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, onPrev, onNext, onClose]);

  const handleAccept = (sId: string) => {
    const target = suggestions.find(s => s.id === sId);
    if (!target) return;

    setSuggestions(prev => prev.map(s => s.id === sId ? { ...s, status: "accepted" } : s));

    if (sId === "s1") {
      onUpdateItem({ ...item, description: target.suggested });
      gameStore.addXP(30, "Accepted AI Metadata Suggestion", 10);
      onToast("Updated description with AI suggestion! (+30 XP )");
    } else if (sId === "s2") {
      const newTags = Array.from(new Set([...item.tags, "Cryosphere Dynamics", "Polar Observation"]));
      onUpdateItem({ ...item, tags: newTags });
      gameStore.addXP(25, "Enhanced Taxonomy Tags", 5);
      onToast("Added AI tags to media asset! (+25 XP )");
    } else {
      gameStore.addXP(20, "Linked Research Publication", 5);
      onToast("Linked connected research paper! (+20 XP )");
    }
  };

  const handleReject = (sId: string) => {
    setSuggestions(prev => prev.map(s => s.id === sId ? { ...s, status: "rejected" } : s));
    onToast("Dismissed AI suggestion");
  };

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setSuggestions([
        {
          id: "s1",
          field: "Refined Caption",
          current: item.description,
          suggested: `Validated ${item.category} documentation at ${item.location} (${item.coordinates}) during ${item.expedition}. Sensor calibrated against satellite pass.`,
          confidence: 96,
          status: "pending",
        },
        {
          id: "s2",
          field: "Enhanced Taxonomy",
          current: item.tags.join(", "),
          suggested: `${item.tags.join(", ")}, Fast Ice, CryoSat-2 Calibration, ISO 19115 Compliant`,
          confidence: 91,
          status: "pending",
        },
        {
          id: "s3",
          field: "Direct Dataset Link",
          current: "Unlinked",
          suggested: `Antarctic Meteorological & Cryospheric Observations (${item.year})`,
          confidence: 89,
          status: "pending",
        },
      ]);
      onToast("AI re-analysis complete!");
    }, 1200);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = item.image;
    link.target = "_blank";
    link.download = `${item.title.toLowerCase().replace(/\s+/g, "_")}.${item.type === "video" ? "mp4" : "jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast(`Downloading ${item.title} (${item.fileSize})...`);
  };

  const handleDownloadMetadata = () => {
    const metadataStr = JSON.stringify(item, null, 2);
    const blob = new Blob([metadataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.title.replace(/\s+/g, "_")}_metadata.json`;
    link.click();
    URL.revokeObjectURL(url);
    onToast("Metadata downloaded in JSON format!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onToast("Media archive link copied to clipboard!");
  };

  const handleCopyStory = () => {
    const storyText = `FOR IMMEDIATE RELEASE: Polar Discovery & Cryosphere Insights\n\nTitle: ${item.title}\nExpedition: ${item.expedition} | Location: ${item.location} (${item.coordinates})\nAudience: ${targetAudience} | Theme: ${storyAngle}\n\nSummary:\n${item.description}\n\nKey Highlights:\n- Scientific classification: ${item.category}\n- Keywords: ${item.tags.join(", ")}\n- Documented under National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Government of India.\n\nLearn more at NCPOR Polar Data Repository.`;
    navigator.clipboard.writeText(storyText);
    onToast("Story package press draft copied to clipboard!");
  };

  const handleExportStoryMarkdown = () => {
    const mdContent = `# Outreach Story Package: ${item.title}\n\n**Expedition:** ${item.expedition}  \n**Location:** ${item.location} (${item.coordinates})  \n**Target Audience:** ${targetAudience}  \n**Angle:** ${storyAngle}  \n**Date:** ${item.date}  \n\n---\n\n## Overview\n${item.description}\n\n## Attached Assets\n- Media asset: ${item.image}\n- Format: ${item.format} (${item.resolution})\n- Rights: Open Access (CC BY-NC 4.0)\n\n## Connected Knowledge References\n- Dataset: NCPOR Antarctic Cryospheric Observations\n- Publication: Southern Ocean dynamics & ice sheet stability\n\n*Generated by NCPOR Polar Knowledge Intelligence*`;
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `story_${item.id}_${item.title.replace(/\s+/g, "_")}.md`;
    link.click();
    URL.revokeObjectURL(url);
    onToast("Story package exported as Markdown!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-600 uppercase tracking-wider">
              {item.type === "360" ? "360° Virtual Tour" : item.type.toUpperCase()}
            </span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-md">{item.title}</span>
            <span className="text-[11px] text-slate-500 font-mono">({itemIndex + 1} of {totalItems})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
              title="Previous Item (Left Arrow)"
            >
              ←
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
              title="Next Item (Right Arrow)"
            >
              →
            </button>
            <div className="h-4 w-px bg-slate-700 mx-1"/>
            <button onClick={handleShare} className="p-1.5 rounded hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1" title="Copy Link">
               Share
            </button>
            <button onClick={handleDownload} className="p-1.5 rounded hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1" title="Download File">
               Download
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white text-sm ml-1" title="Close (Esc)">
              x
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Media Display */}
          <div className="flex-1 bg-slate-950 relative flex items-center justify-center min-h-[300px] md:min-h-0 overflow-hidden">
            {item.type === "video" ? (
              <VideoPlayer item={item} />
            ) : item.type === "360" ? (
              <PanoramaViewer item={item} />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-w-full max-h-[72vh] object-contain rounded shadow-lg"
                />
                <div className="absolute bottom-3 left-4 right-4 p-3 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className="text-[10px] text-slate-300">{item.location} · {item.expedition} · {item.date}</div>
                  </div>
                  <div className="text-[10px] font-mono text-sky-300">{item.resolution}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Intelligence Drawer */}
          <div className="w-full md:w-84 lg:w-96 flex-shrink-0 bg-white flex flex-col border-t md:border-t-0 md:border-l border-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 p-1">
              {([["context", "Science Context"], ["ai", "AI Suggestions"], ["story", "Outreach Story"]] as const).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setAiTab(id)}
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${aiTab === id ? "bg-white text-blue-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiTab === "context" && (
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Documentation Scope</div>
                    <p className="text-xs leading-relaxed text-slate-700 p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Scientific Metadata</div>
                    <div className="space-y-1.5 divide-y divide-slate-100 text-[11px]">
                      {[
                        ["Expedition", item.expedition],
                        ["Year", item.year.toString()],
                        ["Category", item.category],
                        ["Location", item.location],
                        ["Coordinates", item.coordinates],
                        ["Date Captured", item.date],
                        ["Photographer / Team", item.photographer],
                        ["Resolution / Spec", item.resolution],
                        ["File Size", item.fileSize],
                        ["File Format", item.format],
                        ["Rights / License", "CC BY-NC 4.0 (MoES/NCPOR)"],
                        ["Data Status", "Open Access Verified"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center pt-1.5 first:pt-0">
                          <span className="text-slate-500 font-medium">{k}</span>
                          <span className="text-slate-800 font-semibold text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Taxonomy & Keywords</div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Connected Knowledge Graph</div>
                    <div className="space-y-1">
                      {[
                        { icon: "", label: "View Related Publication", dest: "publications" },
                        { icon: "", label: "View Related Dataset", dest: "datasets" },
                        { icon: "", label: "View Expedition Log", dest: "expeditions" },
                        { icon: "", label: "Inspect on Polar Map", dest: "map" },
                      ].map(link => (
                        <button
                          key={link.label}
                          onClick={() => { onClose(); onNavigate?.(link.dest); }}
                          className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span>{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                          </span>
                          <span className="text-blue-500">→</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <AddToWorkspace
                        source={{
                          id: `media-${item.id}`,
                          type: "media",
                          title: item.title,
                          meta: `${item.expedition} · ${item.location}`,
                          origin: "NCPOR Polar Archive",
                        }}
                        onAdd={s => {
                          onAddToWorkspace?.(s);
                          onToast(`Added "${item.title}" to your Workspace!`);
                        }}
                      />
                      <button
                        onClick={handleDownloadMetadata}
                        className="w-full py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span></span> Export Metadata JSON
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {aiTab === "ai" && (
                <div className="space-y-3.5">
                  <div className="text-[11px] p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                    <span className="text-sm">Warning:</span>
                    <span>AI-generated metadata suggestions. Review carefully before accepting changes into official archive records.</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Proposed Adjustments</span>
                    <button
                      onClick={handleReanalyze}
                      disabled={isAnalyzing}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <span></span> {isAnalyzing ? "Analyzing..." : "Re-Analyze"}
                    </button>
                  </div>

                  {isAnalyzing && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-2 text-xs text-slate-600">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/>
                      <span>Running Polar AI Computer Vision & Telemetry Alignment...</span>
                    </div>
                  )}

                  {!isAnalyzing && suggestions.map(s => (
                    <div key={s.id} className={`p-3 rounded-lg border text-xs space-y-2 transition-all ${s.status === "accepted" ? "bg-emerald-50/70 border-emerald-300" : s.status === "rejected" ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200 shadow-2xs"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{s.field}</span>
                        <div className="flex items-center gap-1.5">
                          {s.status === "accepted" ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">OK Accepted</span>
                          ) : s.status === "rejected" ? (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">x Rejected</span>
                          ) : (
                            <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{s.confidence}% match</span>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 line-through">
                        {s.current}
                      </div>

                      <div className="text-[11px] p-2 rounded bg-blue-50/70 text-slate-800 font-medium border border-blue-100">
                        {s.suggested}
                      </div>

                      {s.status === "pending" ? (
                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            onClick={() => handleReject(s.id)}
                            className="px-2.5 py-1 text-[11px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAccept(s.id)}
                            className="px-2.5 py-1 text-[11px] rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-xs"
                          >
                            Accept Suggestion
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSuggestions(prev => prev.map(sugg => sugg.id === s.id ? { ...sugg, status: "pending" } : sugg))}
                          className="text-[10px] text-blue-600 hover:underline"
                        >
                          Undo decision
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate?.("ai");
                      }}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span></span> Open in Polar AI Assistant →
                    </button>
                  </div>
                </div>
              )}

              {aiTab === "story" && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Source-Grounded Science Story</div>
                    <p className="text-[11px] text-slate-500">Synthesize an outreach package or media release linking this asset with related datasets.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-500">Target Audience</label>
                    <select
                      value={targetAudience}
                      onChange={e => setTargetAudience(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-blue-500"
                    >
                      <option>General Public & Press</option>
                      <option>Policy & Ministry Brief</option>
                      <option>Educational / K-12 Outreach</option>
                      <option>Scientific Community</option>
                    </select>

                    <label className="block text-[10px] uppercase font-bold text-slate-500 pt-1">Narrative Theme</label>
                    <select
                      value={storyAngle}
                      onChange={e => setStoryAngle(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-blue-500"
                    >
                      <option>Climate & Cryosphere Evolution</option>
                      <option>Station Life & Engineering Marvels</option>
                      <option>Polar Biodiversity & Fragile Ecosystems</option>
                      <option>India's Polar Leadership & History</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-600">Attached Knowledge Bundle</div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5"><span></span> {item.title}</div>
                      <div className="flex items-center gap-1.5"><span></span> Cryospheric Sensor Array #{item.year}</div>
                      <div className="flex items-center gap-1.5"><span></span> Research Paper: Antarctic Observations (2024)</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenStudio) {
                          onOpenStudio();
                        } else {
                          onNavigate?.("news");
                        }
                        onToast("Story package opened in Studio!");
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span></span> Launch in Story Studio →
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleCopyStory}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-[11px] transition-colors flex items-center justify-center gap-1"
                      >
                        <span></span> Copy Press Draft
                      </button>
                      <button
                        onClick={handleExportStoryMarkdown}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-[11px] transition-colors flex items-center justify-center gap-1"
                      >
                        <span></span> Export .md Package
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Upload Media Modal ────────────────────────────────────────────────────
function UploadMediaModal({
  isOpen,
  onClose,
  onAddMedia,
  onToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddMedia: (item: MediaItem) => void;
  onToast: (msg: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"photo" | "video" | "360">("photo");
  const [category, setCategory] = useState<"Landscapes" | "Wildlife" | "Stations" | "Research">("Landscapes");
  const [expedition, setExpedition] = useState("IAE 2024");
  const [location, setLocation] = useState("Maitri Station, Antarctica");
  const [coordinates, setCoordinates] = useState("70°45'S, 11°44'E");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("NCPOR, Antarctica, Science");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a title for the media item.");
      return;
    }

    const newItem: MediaItem = {
      id: Date.now(),
      title: title.trim(),
      type,
      category,
      expedition,
      year: parseInt(expedition.replace(/\D/g, ""), 10) || 2024,
      location: location.trim(),
      coordinates: coordinates.trim() || "70°00'S, 12°00'E",
      image: imageUrl.trim() || "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=800&q=80",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      photographer: "NCPOR Expedition Contributor",
      resolution: type === "video" ? "1080p FHD" : "3840 × 2160 px",
      fileSize: "6.5 MB",
      format: type === "video" ? "MP4" : type === "360" ? "WebVR Pan" : "JPEG",
      likes: 1,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      description: description.trim() || `Contributed media asset documented during ${expedition} at ${location}.`,
    };

    onAddMedia(newItem);
    gameStore.addXP(100, "Contributed Media to Polar Archive", 25);
    onToast(`Added "${newItem.title}" to Media Archive! (+100 XP )`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg"></span>
            <h3 className="font-semibold text-sm">Contribute Media to Polar Archive</h3>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-full hover:bg-white/20 text-slate-300 flex items-center justify-center text-xs">x</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Ice Core Sampling at Schirmacher Oasis"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Media Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="360">360° Virtual Tour</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Landscapes">Landscapes</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Stations">Stations</option>
                <option value="Research">Research</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expedition</label>
              <select
                value={expedition}
                onChange={e => setExpedition(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="IAE 2024">IAE 2024</option>
                <option value="IAE 2023">IAE 2023</option>
                <option value="IAE 2022">IAE 2022</option>
                <option value="IAE 2021">IAE 2021</option>
                <option value="IAE 2020">IAE 2020</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Coordinates</label>
            <input
              type="text"
              value={coordinates}
              onChange={e => setCoordinates(e.target.value)}
              placeholder="e.g. 70°45'S, 11°44'E"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Image / Thumbnail URL</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 font-mono text-[11px]"
            />
            {imageUrl && (
              <div className="mt-2 h-24 rounded-lg overflow-hidden border border-slate-200 relative">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"/>
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[9px]">Preview</div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g., Ice Core, Cryosphere, Drilling"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Scientific Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what this media documents..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm"
            >
              Submit to Archive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Media Gallery Page Component ─────────────────────────────────────
export default function MediaGallery({ onNavigate, onAddToWorkspace, onOpenStudio }: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>(initialMediaItems);
  const [tab, setTab] = useState<Tab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expeditionFilter, setExpeditionFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za" | "likes">("newest");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([3, 4, 12]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => setToastMessage(msg);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(x => x !== id));
      showToast("Removed from favorites");
    } else {
      setFavorites(prev => [...prev, id]);
      gameStore.addXP(15, "Favorited Polar Media Asset", 2);
      showToast("Added to favorites! (+15 XP )");
    }
  };

  const filtered = items.filter(m => {
    if (tab === "photo" && m.type !== "photo") return false;
    if (tab === "video" && m.type !== "video") return false;
    if (tab === "360" && m.type !== "360") return false;

    if (categoryFilter && m.category !== categoryFilter) return false;
    if (expeditionFilter && !m.expedition.includes(expeditionFilter)) return false;
    if (yearFilter && m.year.toString() !== yearFilter) return false;
    if (favoritesOnly && !favorites.includes(m.id)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchLocation = m.location.toLowerCase().includes(q);
      const matchExpedition = m.expedition.toLowerCase().includes(q);
      const matchTags = m.tags.some(t => t.toLowerCase().includes(q));
      const matchDesc = m.description.toLowerCase().includes(q);
      if (!matchTitle && !matchLocation && !matchExpedition && !matchTags && !matchDesc) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return b.year - a.year || b.id - a.id;
    if (sortBy === "oldest") return a.year - b.year || a.id - b.id;
    if (sortBy === "az") return a.title.localeCompare(b.title);
    if (sortBy === "za") return b.title.localeCompare(a.title);
    if (sortBy === "likes") return (b.likes + (favorites.includes(b.id) ? 1 : 0)) - (a.likes + (favorites.includes(a.id) ? 1 : 0));
    return 0;
  });

  const resetFilters = () => {
    setTab("all");
    setSearchQuery("");
    setExpeditionFilter("");
    setYearFilter("");
    setCategoryFilter("");
    setSortBy("newest");
    setFavoritesOnly(false);
    showToast("Filters reset to default");
  };

  const isFiltered = Boolean(searchQuery || expeditionFilter || yearFilter || categoryFilter || favoritesOnly || tab !== "all");

  const selectedIndex = sorted.findIndex(m => m.id === selectedId);
  const selectedItem = selectedIndex !== -1 ? sorted[selectedIndex] : null;

  const openMediaItem = (id: number) => {
    setSelectedId(id);
    const target = items.find(m => m.id === id);
    if (target?.type === "360") {
      gameStore.addXP(50, "Explored 360° Virtual Station Node", 15);
      gameStore.completeQuest("q_tour");
    } else {
      gameStore.addXP(15, "Inspected Media Asset", 3);
    }
  };

  const handleUpdateItem = (updated: MediaItem) => {
    setItems(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedId(sorted[selectedIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (selectedIndex < sorted.length - 1) {
      setSelectedId(sorted[selectedIndex + 1].id);
    }
  };

  const handleQuickDownload = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = item.image;
    link.target = "_blank";
    link.download = `${item.title.toLowerCase().replace(/\s+/g, "_")}.${item.type === "video" ? "mp4" : "jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${item.title}...`);
  };

  const handleQuickShare = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}#media-${item.id}`);
    showToast(`Copied direct link for "${item.title}"`);
  };

  const photoCount = items.filter(m => m.type === "photo").length;
  const videoCount = items.filter(m => m.type === "video").length;
  const tourCount = items.filter(m => m.type === "360").length;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Title & Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="page-header-title text-2xl font-bold tracking-tight text-slate-900">
              Polar Media & Virtual Archive
            </h1>
            <p className="page-header-sub text-slate-500 text-xs mt-1">
              Explore photographic evidence, expedition video documentaries, and interactive 360° virtual tours from NCPOR stations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUploadOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>+</span> Upload Media
            </button>

            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${favoritesOnly ? "bg-rose-50 border-rose-300 text-rose-700 font-semibold" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <span>{favoritesOnly ? "" : ""}</span> Favorites ({favorites.length})
            </button>

            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded text-xs transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"}`}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded text-xs transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"}`}
                title="List View"
              >
                ≡
              </button>
            </div>
          </div>
        </div>

        {/* Tab Bar with dynamic badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="tab-bar w-fit">
            <button
              className={`tab-item flex items-center gap-1.5 ${tab === "all" ? "active" : ""}`}
              onClick={() => setTab("all")}
            >
              <span>All Media</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">{items.length}</span>
            </button>
            <button
              className={`tab-item flex items-center gap-1.5 ${tab === "photo" ? "active" : ""}`}
              onClick={() => setTab("photo")}
            >
              <span>Photos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">{photoCount}</span>
            </button>
            <button
              className={`tab-item flex items-center gap-1.5 ${tab === "video" ? "active" : ""}`}
              onClick={() => setTab("video")}
            >
              <span>Videos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">{videoCount}</span>
            </button>
            <button
              className={`tab-item flex items-center gap-1.5 ${tab === "360" ? "active" : ""}`}
              onClick={() => setTab("360")}
            >
              <span>360° Virtual Tours</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">{tourCount}</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></span>
            <input
              type="text"
              placeholder="Search by title, location, station, or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
              >
                x
              </button>
            )}
          </div>

          <select
            className="filter-select text-xs py-1.5 bg-white border border-slate-200 rounded-lg px-2.5 text-slate-700"
            value={expeditionFilter}
            onChange={e => setExpeditionFilter(e.target.value)}
          >
            <option value="">All Expeditions</option>
            <option value="IAE 2024">IAE 2024</option>
            <option value="IAE 2023">IAE 2023</option>
            <option value="IAE 2022">IAE 2022</option>
            <option value="IAE 2021">IAE 2021</option>
            <option value="IAE 2020">IAE 2020</option>
          </select>

          <select
            className="filter-select text-xs py-1.5 bg-white border border-slate-200 rounded-lg px-2.5 text-slate-700"
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>

          <select
            className="filter-select text-xs py-1.5 bg-white border border-slate-200 rounded-lg px-2.5 text-slate-700"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Landscapes">Landscapes</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Stations">Stations</option>
            <option value="Research">Research</option>
          </select>

          <select
            className="filter-select text-xs py-1.5 bg-white border border-slate-200 rounded-lg px-2.5 text-slate-700"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="az">Sort: Title (A-Z)</option>
            <option value="za">Sort: Title (Z-A)</option>
            <option value="likes">Sort: Most Favorited</option>
          </select>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1"
            >
              <span>x</span> Reset
            </button>
          )}
        </div>

        {/* Results Info Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
          <div>
            Showing <span className="font-semibold text-slate-800">{sorted.length}</span> of {items.length} media assets
            {isFiltered && <span className="ml-1 text-blue-600">(filtered)</span>}
          </div>
          {favoritesOnly && (
            <span className="text-rose-600 font-medium text-[11px]">Filtered by Favorites</span>
          )}
        </div>

        {/* Empty State */}
        {sorted.length === 0 && (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 my-4 space-y-3">
            <div className="text-4xl"></div>
            <h3 className="font-semibold text-sm text-slate-800">No media found matching criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, switching categories, or clearing active filters.
            </p>
            <button
              onClick={resetFilters}
              className="btn-primary btn-sm mt-2"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* ── 360° Tours Dedicated Layout ──────────────────────────────────── */}
        {tab === "360" && sorted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {sorted.map(item => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="card overflow-hidden cursor-pointer group border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all rounded-xl flex flex-col"
                  onClick={() => openMediaItem(item.id)}
                >
                  <div className="relative h-60 bg-slate-900 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-14 h-14 rounded-full border-2 border-white/80 bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-2xl shadow-xl group-hover:scale-110 group-hover:bg-blue-600 transition-all">
                        ⊙
                      </div>
                      <span className="text-white text-xs font-semibold mt-2 tracking-wide uppercase bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        Click to Launch 360° Tour
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="tag text-[10px] font-bold bg-purple-600 text-white shadow-xs">360° VR</span>
                      <span className="tag text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">{item.hotspots?.length || 4} Hotspots</span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={e => toggleFavorite(e, item.id)}
                        className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-xs hover:bg-black/70 flex items-center justify-center text-sm transition-transform active:scale-90"
                        title={isFav ? "Remove Favorite" : "Add to Favorites"}
                      >
                        {isFav ? "" : ""}
                      </button>
                      <button
                        onClick={e => handleQuickDownload(e, item)}
                        className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-xs hover:bg-black/70 text-white flex items-center justify-center text-xs transition-transform active:scale-90"
                        title="Download Pan Image"
                      >
                        
                      </button>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 text-white flex items-end justify-between pointer-events-none">
                      <div>
                        <div className="font-bold text-sm tracking-tight drop-shadow-md">{item.title}</div>
                        <div className="text-xs text-white/80 drop-shadow-xs">{item.location} · {item.expedition}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <AddToWorkspace
                        compact
                        source={{
                          id: `media-${item.id}`,
                          type: "media",
                          title: item.title,
                          meta: `${item.expedition} · ${item.location}`,
                          origin: "NCPOR 360 Archive",
                        }}
                        onAdd={s => {
                          onAddToWorkspace?.(s);
                          showToast(`Added "${item.title}" to Workspace`);
                        }}
                      />
                      <button
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors flex items-center gap-1"
                        onClick={e => { e.stopPropagation(); openMediaItem(item.id); }}
                      >
                        Tour & Intelligence →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Standard Grid View ───────────────────────────────────────────── */}
        {tab !== "360" && viewMode === "grid" && sorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {sorted.map(item => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="card overflow-hidden cursor-pointer group border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all rounded-xl flex flex-col bg-white"
                  onClick={() => openMediaItem(item.id)}
                >
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-blue-600/90 text-white shadow-lg group-hover:scale-110 group-hover:bg-blue-600 transition-all">
                          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    {item.type === "360" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-lg bg-black/40">
                          ⊙
                        </div>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs uppercase">
                        {item.type}
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-700/80 text-white backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1 z-10" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={e => toggleFavorite(e, item.id)}
                        className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-xs hover:bg-black/75 flex items-center justify-center text-xs transition-transform active:scale-90"
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        {isFav ? "" : ""}
                      </button>
                      <button
                        onClick={e => handleQuickDownload(e, item)}
                        className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-xs hover:bg-black/75 text-white flex items-center justify-center text-[11px] transition-transform active:scale-90"
                        title="Download"
                      >
                        
                      </button>
                    </div>

                    {item.duration && (
                      <div className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/75 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {item.duration}
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="text-white text-xs font-semibold truncate">{item.title}</div>
                      <div className="text-white/70 text-[10px] truncate">{item.location}</div>
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                      <span className="font-medium text-slate-700">{item.expedition}</span>
                      <span className="font-mono">{item.date}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <AddToWorkspace
                        compact
                        source={{
                          id: `media-${item.id}`,
                          type: "media",
                          title: item.title,
                          meta: `${item.expedition} · ${item.location}`,
                          origin: "NCPOR Media Archive",
                        }}
                        onAdd={s => {
                          onAddToWorkspace?.(s);
                          showToast(`Added "${item.title}" to Workspace`);
                        }}
                      />

                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => handleQuickShare(e, item)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 text-xs"
                          title="Share Link"
                        >
                          
                        </button>
                        <button
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                          onClick={e => { e.stopPropagation(); openMediaItem(item.id); }}
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Detailed Table / List View ──────────────────────────────────── */}
        {tab !== "360" && viewMode === "list" && sorted.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Expedition / Year</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Resolution</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {sorted.map(item => {
                    const isFav = favorites.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                        onClick={() => openMediaItem(item.id)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.title} className="w-12 h-10 object-cover rounded shadow-xs flex-shrink-0"/>
                            <div>
                              <div className="font-semibold text-slate-900">{item.title}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-xs">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${item.type === "video" ? "bg-amber-100 text-amber-800" : item.type === "360" ? "bg-purple-100 text-purple-800" : "bg-sky-100 text-sky-800"}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{item.category}</td>
                        <td className="py-3 px-4 text-slate-600">{item.expedition}</td>
                        <td className="py-3 px-4 text-slate-600">{item.location}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{item.resolution.split(" ")[0]}</td>
                        <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={e => toggleFavorite(e, item.id)}
                              className="p-1 text-sm rounded hover:bg-slate-100"
                              title="Favorite"
                            >
                              {isFav ? "" : ""}
                            </button>
                            <button
                              onClick={e => handleQuickDownload(e, item)}
                              className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                              title="Download"
                            >
                              
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); openMediaItem(item.id); }}
                              className="px-2.5 py-1 text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Media Intelligence & Viewer Modal ─────────────────────────────── */}
      {selectedItem && (
        <MediaIntelligencePanel
          item={selectedItem}
          itemIndex={selectedIndex}
          totalItems={sorted.length}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < sorted.length - 1}
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={() => setSelectedId(null)}
          onNavigate={onNavigate}
          onAddToWorkspace={onAddToWorkspace}
          onOpenStudio={onOpenStudio}
          onUpdateItem={handleUpdateItem}
          onToast={showToast}
        />
      )}

      {/* ── Upload Media Modal ────────────────────────────────────────────── */}
      <UploadMediaModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onAddMedia={newItem => {
          setItems(prev => [newItem, ...prev]);
        }}
        onToast={showToast}
      />
    </div>
  );
}
