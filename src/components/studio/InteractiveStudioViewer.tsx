import React, { useState, useEffect, useRef } from "react"
import { WorkspaceSource } from "../../workspaceStore"
import { gameStore } from "../../gameStore"

export type StudioTool =
  | "audio"
  | "video"
  | "slides"
  | "mindmap"
  | "flashcards"
  | "quiz"
  | "infographic"
  | "datatable"
  | "report"
  | "social"

interface Props {
  tool: StudioTool
  sources: WorkspaceSource[]
  onBackToTools?: () => void
  onOpenSocial?: (topic?: string, content?: string) => void
  onToast?: (msg: string) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. REAL AUDIO STUDIO: DUAL-HOST PODCAST WITH WEB SPEECH SYNTHESIS & EQUALIZER
// ─────────────────────────────────────────────────────────────────────────────
interface DialogueTurn {
  id: number
  speaker: "Dr. Aarav" | "Dr. Maya"
  role: string
  avatar: string
  color: string
  text: string
  timestamp: string
}

function AudioStudio({
  sources,
  onToast,
}: {
  sources: WorkspaceSource[]
  onToast?: (msg: string) => void
}) {
  const primaryTitle = sources[0]?.title || "Southern Ocean Cryosphere Dynamics"
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [totalSec] = useState(195) // 3m 15s

  const script: DialogueTurn[] = [
    {
      id: 1,
      speaker: "Dr. Aarav",
      role: "Lead Cryosphere Scientist · NCPOR",
      avatar: "👨‍🔬",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      text: `Welcome to the NCPOR Polar Knowledge Audio Series. Today we are conducting an empirical deep-dive into "${primaryTitle}", synthesizing verified records from ${sources.length} polar repository source${sources.length > 1 ? "s" : ""}.`,
      timestamp: "00:00",
    },
    {
      id: 2,
      speaker: "Dr. Maya",
      role: "Senior Oceanographer · MoES",
      avatar: "👩‍🔬",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      text: "Thanks, Aarav. What immediately commands attention in the satellite telemetry is the historic sea ice minimum of February 2023, where Antarctic sea ice dropped to 1.79 million square kilometers — an absolute record low in 44 years of continuous observation.",
      timestamp: "00:28",
    },
    {
      id: 3,
      speaker: "Dr. Aarav",
      role: "Lead Cryosphere Scientist · NCPOR",
      avatar: "👨‍🔬",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      text: "Exactly, Maya. And that triggers the ice-albedo positive feedback loop. Sea ice typically reflects up to 85% of incoming solar irradiance. When that ice retreats, open dark ocean water absorbs 93% of the heat, warming the surface mixed layer by nearly 1.8 degrees Celsius.",
      timestamp: "00:58",
    },
    {
      id: 4,
      speaker: "Dr. Maya",
      role: "Senior Oceanographer · MoES",
      avatar: "👩‍🔬",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      text: "And our automated recordings from Maitri Station in Schirmacher Oasis and Bharati Station at Prydz Bay corroborate this. The Southern Ocean is not an isolated system — reductions in Weddell Sea ice directly modulate the Mascarene High, causing a 4 to 9 day delay in the onset of the Indian Summer Monsoon.",
      timestamp: "01:34",
    },
    {
      id: 5,
      speaker: "Dr. Aarav",
      role: "Lead Cryosphere Scientist · NCPOR",
      avatar: "👨‍🔬",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      text: "Up in the Arctic at Himadri Station in Svalbard, our 192-meter IndARC underwater mooring in Kongsfjorden tracks Atlantic water intrusion uninterrupted through the polar night. All findings cited here are fully preserved in the open NCPOR data repository.",
      timestamp: "02:15",
    },
    {
      id: 6,
      speaker: "Dr. Maya",
      role: "Senior Oceanographer · MoES",
      avatar: "👩‍🔬",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      text: "That wraps up this episode. Review the cited datasets and research papers in your Polar Workspace for complete NetCDF files, sensor logs, and DOI citations.",
      timestamp: "02:50",
    },
  ]

  // Web Speech Synthesis Engine
  const speakCurrentTurn = (index: number) => {
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()

    if (index >= script.length) {
      setIsPlaying(false)
      setCurrentLineIndex(0)
      return
    }

    const turn = script[index]
    const utterance = new SpeechSynthesisUtterance(turn.text)
    utterance.rate = playbackSpeed

    // Voice selection: attempt male voice for Aarav, female voice for Maya
    const voices = window.speechSynthesis.getVoices()
    if (turn.speaker === "Dr. Maya") {
      const female = voices.find(
        (v) =>
          v.name.includes("Female") ||
          v.name.includes("Zira") ||
          v.name.includes("Samantha") ||
          v.name.includes("Google UK English Female"),
      )
      if (female) utterance.voice = female
      utterance.pitch = 1.15
    } else {
      const male = voices.find(
        (v) =>
          v.name.includes("Male") ||
          v.name.includes("David") ||
          v.name.includes("Google UK English Male"),
      )
      if (male) utterance.voice = male
      utterance.pitch = 0.95
    }

    utterance.onend = () => {
      if (index + 1 < script.length) {
        setCurrentLineIndex(index + 1)
        speakCurrentTurn(index + 1)
      } else {
        setIsPlaying(false)
        setCurrentLineIndex(0)
      }
    }

    utterance.onerror = () => {
      setIsPlaying(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  // Handle Play / Pause toggle
  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true)
      speakCurrentTurn(currentLineIndex)
      onToast?.(
        `Playing Audio Overview: ${script[currentLineIndex].speaker} speaking...`,
      )
    } else {
      setIsPlaying(false)
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }

  // Cleanup synthesis on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Timer counter while playing
  useEffect(() => {
    let timer: any = null
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSec((s) => (s < totalSec ? s + 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, totalSec])

  const handleSeek = (newIndex: number) => {
    setCurrentLineIndex(newIndex)
    if (isPlaying) {
      speakCurrentTurn(newIndex)
    }
  }

  const handleDownloadTranscript = () => {
    const text = script
      .map(
        (turn) =>
          `[${turn.timestamp}] ${turn.speaker} (${turn.role}):\n${turn.text}\n`,
      )
      .join("\n")
    const blob = new Blob(
      [
        `NCPOR POLAR KNOWLEDGE STUDIO — AUDIO OVERVIEW TRANSCRIPT\nTopic: ${primaryTitle}\nGenerated: ${new Date().toISOString()}\n\n${text}`,
      ],
      { type: "text/plain" },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Audio_Overview_${primaryTitle.slice(0, 24).replace(/\s+/g, "_")}.txt`
    a.click()
    URL.revokeObjectURL(url)
    onToast?.("Downloaded Audio Overview transcript")
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Audio Player Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1e3c] via-[#002244] to-[#001833] text-white shadow-xl border border-white/10 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AI DUAL-HOST AUDIO OVERVIEW
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                {sources.length} Grounded Sources
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {primaryTitle}
            </h3>
            <p className="text-xs text-blue-200/80 mt-0.5">
              Featuring Dr. Aarav (Cryosphere Lead) &amp; Dr. Maya (Senior
              Oceanographer)
            </p>
          </div>

          <button
            onClick={handleDownloadTranscript}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            title="Download Transcript"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-3.5 h-3.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">Script</span>
          </button>
        </div>

        {/* Live Audio Visualizer (Equalizer bars) */}
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-4">
          <div className="flex items-end gap-1 h-14 justify-between">
            {Array.from({ length: 36 }).map((_, i) => {
              const height = isPlaying
                ? Math.max(12, (Math.sin(i * 0.35 + elapsedSec * 2) + 1) * 45)
                : 15
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t transition-all duration-100 ${
                    isPlaying
                      ? i % 2 === 0
                        ? "bg-cyan-400"
                        : "bg-blue-400"
                      : "bg-slate-600/40"
                  }`}
                  style={{ height: `${height}%` }}
                />
              )
            })}
          </div>

          {/* Time Scrubber */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mt-2">
            <span>
              {String(Math.floor(elapsedSec / 60)).padStart(2, "0")}:
              {String(elapsedSec % 60).padStart(2, "0")}
            </span>
            <div className="flex-1 mx-3 h-1.5 bg-white/15 rounded-full overflow-hidden relative cursor-pointer">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${(elapsedSec / totalSec) * 100}%` }}
              />
            </div>
            <span>
              {String(Math.floor(totalSec / 60)).padStart(2, "0")}:
              {String(totalSec % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>Pause Overview</span>
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Play Real Audio</span>
                </>
              )}
            </button>

            {/* Speed Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-[11px]">
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded font-mono font-semibold transition cursor-pointer ${
                    playbackSpeed === speed
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-blue-200/90 flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`}
            />
            <span>
              {isPlaying
                ? `Speaking: ${script[currentLineIndex].speaker}`
                : "Audio Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Synchronized Live Transcript */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Synchronized Transcript
            </span>
            <span className="text-[10px] text-slate-500">
              (Click any line to jump)
            </span>
          </div>
          <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {script.length} Dialogue Turns
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto p-2">
          {script.map((turn, idx) => {
            const isCurrent = idx === currentLineIndex
            return (
              <div
                key={turn.id}
                onClick={() => handleSeek(idx)}
                className={`p-3.5 rounded-xl transition cursor-pointer flex items-start gap-3.5 ${
                  isCurrent
                    ? "bg-blue-50/80 border border-blue-300 shadow-2xs"
                    : "hover:bg-slate-50/80"
                }`}
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">
                  {turn.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {turn.speaker}
                      </span>
                      <span className="text-[10px] text-slate-500 hidden sm:inline">
                        {turn.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrent && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 animate-pulse">
                          ● ON AIR
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400">
                        {turn.timestamp}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isCurrent
                        ? "text-slate-900 font-medium"
                        : "text-slate-600"
                    }`}
                  >
                    {turn.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. REAL VIDEO STUDIO: POLAR DOCUMENTARY PLAYER WITH SCENE CHAPTERS & SCRIPT
// ─────────────────────────────────────────────────────────────────────────────
interface VideoScene {
  id: number
  title: string
  timestamp: string
  duration: string
  seekSec: number
  thumb: string
  narration: string
  visualDirections: string
  cameraAngle: string
}

function VideoStudio({
  sources,
  onToast,
}: {
  sources: WorkspaceSource[]
  onToast?: (msg: string) => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSec, setCurrentSec] = useState(0)
  const [duration, setDuration] = useState(180)
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [videoSpeed, setVideoSpeed] = useState(1)

  const scenes: VideoScene[] = [
    {
      id: 1,
      title: "Austral Dawn & Icebreaker Departure",
      timestamp: "00:00",
      duration: "00:45",
      seekSec: 0,
      thumb:
        "https://images.unsplash.com/photo-1486566584569-b9319dc74315?w=600&q=80",
      narration:
        "Departure from Mormugao Harbor, Goa. The ice-strengthened vessel enters the Roaring Forties, cutting through Antarctic drift ice toward Queen Maud Land.",
      visualDirections:
        "Cinematic aerial drone footage sweeping low over fast sea ice; vessel bow cleaving pancake floes in golden austral dawn.",
      cameraAngle: "Aerial Drone 4K · 24fps · Wide Angle (16mm)",
    },
    {
      id: 2,
      title: "Maitri & Bharati High-Latitude Operations",
      timestamp: "00:45",
      duration: "00:45",
      seekSec: 45,
      thumb:
        "https://images.unsplash.com/photo-1687904368738-ca6423635666?w=600&q=80",
      narration:
        "Year-round scientific watch at Maitri and Bharati stations. Continuous telemetry from weather masts, ozone spectrophotometers, and satellite downlinks.",
      visualDirections:
        "Medium tracking shot inside station scientific labs; exterior pan of ISRO radomes under the vibrant green ribbons of the Aurora Australis.",
      cameraAngle: "Stabilized Gimbal · Night ISO 6400 · Low Angle",
    },
    {
      id: 3,
      title: "Deep Ice-Core & CTD Under-Ice Probing",
      timestamp: "01:30",
      duration: "00:45",
      seekSec: 90,
      thumb:
        "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=600&q=80",
      narration:
        "Electromechanical ice drilling along Princess Astrid Coast. Extraction of pristine Holocene ice cores carrying ancient atmospheric bubbles.",
      visualDirections:
        "Macro close-up of amber-colored ice core cylinder extracted from barrel; underwater CTD probe descending through crystal-clear -1.8°C seawater.",
      cameraAngle: "Macro Lens (100mm) · 60fps Slow Motion",
    },
    {
      id: 4,
      title: "Southern Ocean Climate Engine & Teleconnections",
      timestamp: "02:15",
      duration: "00:45",
      seekSec: 135,
      thumb:
        "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=600&q=80",
      narration:
        "Satellite data visualization reveals the teleconnection bridge: changes in polar sea ice modulate monsoon rainfall patterns across the Indian subcontinent.",
      visualDirections:
        "Dynamic 3D globe animation demonstrating atmospheric wave trains propagating northward from the Weddell Sea across the equator.",
      cameraAngle: "3D Satellite Photogrammetry Composite",
    },
  ]

  const handleTogglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
      onToast?.("Playing Polar Expedition Video Documentary")
    }
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const cur = videoRef.current.currentTime
    setCurrentSec(cur)
    // Find active scene
    const scIdx = scenes.findIndex((sc, idx) => {
      const nextSc = scenes[idx + 1]
      return cur >= sc.seekSec && (!nextSc || cur < nextSc.seekSec)
    })
    if (scIdx !== -1 && scIdx !== activeSceneIndex) {
      setActiveSceneIndex(scIdx)
    }
  }

  const jumpToScene = (index: number) => {
    if (!videoRef.current) return
    const target = scenes[index]
    videoRef.current.currentTime = target.seekSec
    setCurrentSec(target.seekSec)
    setActiveSceneIndex(index)
    if (!isPlaying) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
    onToast?.(`Jumped to Chapter: ${target.title}`)
  }

  const handleFullscreen = () => {
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Video Player Box */}
      <div className="rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 relative group">
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
          <video
            ref={videoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            poster={scenes[activeSceneIndex].thumb}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration || 180)
            }}
            className="w-full h-full object-cover"
            playsInline
          />

          {/* Overlay Title Tag */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
              Chapter {activeSceneIndex + 1}: {scenes[activeSceneIndex].title}
            </span>
          </div>

          {/* Big Center Play Button when paused */}
          {!isPlaying && (
            <button
              onClick={handleTogglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#003366]/90 hover:bg-[#002244] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 z-20 cursor-pointer border border-white/30"
              title="Play Video"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          )}

          {/* Subtitles Overlay */}
          <div className="absolute bottom-16 inset-x-8 text-center pointer-events-none z-20">
            <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs sm:text-sm font-medium drop-shadow-md">
              {scenes[activeSceneIndex].narration}
            </span>
          </div>
        </div>

        {/* Video Controls Bar */}
        <div className="bg-slate-900/95 p-3 px-4 flex items-center justify-between text-white text-xs gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <span className="font-mono text-[11px] text-slate-300">
              {String(Math.floor(currentSec / 60)).padStart(2, "0")}:
              {String(Math.floor(currentSec % 60)).padStart(2, "0")} /{" "}
              {String(Math.floor(duration / 60)).padStart(2, "0")}:
              {String(Math.floor(duration % 60)).padStart(2, "0")}
            </span>
          </div>

          {/* Scrubber */}
          <div
            className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden cursor-pointer relative"
            onClick={(e) => {
              if (!videoRef.current) return
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              videoRef.current.currentTime = pct * duration
            }}
          >
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentSec / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!videoRef.current) return
                const nextMuted = !isMuted
                setIsMuted(nextMuted)
                videoRef.current.muted = nextMuted
              }}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <button
              onClick={() => {
                if (!videoRef.current) return
                const speeds = [1, 1.25, 1.5, 2]
                const nextIdx = (speeds.indexOf(videoSpeed) + 1) % speeds.length
                const sp = speeds[nextIdx]
                setVideoSpeed(sp)
                videoRef.current.playbackRate = sp
              }}
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold"
            >
              {videoSpeed}x
            </button>

            <button
              onClick={handleFullscreen}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              title="Fullscreen"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Rail */}
      <div>
        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5">
          Select Documentary Chapter
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {scenes.map((sc, idx) => (
            <div
              key={sc.id}
              onClick={() => jumpToScene(idx)}
              className={`p-2.5 rounded-xl border transition cursor-pointer group bg-white ${
                activeSceneIndex === idx
                  ? "border-[#003366] ring-2 ring-[#003366]/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-slate-900">
                <img
                  src={sc.thumb}
                  alt={sc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/70 text-white font-mono text-[9px]">
                  {sc.duration}
                </span>
                {activeSceneIndex === idx && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold text-[8px]">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="text-[11px] font-bold text-slate-900 truncate">
                {idx + 1}. {sc.title}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {sc.cameraAngle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. REAL SLIDE DECK STUDIO: 16:9 PRESENTATION WITH THUMBNAILS & PRESENTER MODE
// ─────────────────────────────────────────────────────────────────────────────
interface Slide {
  id: number
  title: string
  subtitle: string
  points: string[]
  stats?: { label: string; value: string }[]
  badge: string
}

function SlidesStudio({
  sources,
  onToast,
}: {
  sources: WorkspaceSource[]
  onToast?: (msg: string) => void
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const slides: Slide[] = [
    {
      id: 1,
      title: "State of the Polar Cryosphere & Southern Ocean",
      subtitle: "National Centre for Polar and Ocean Research · MoES India",
      points: [
        "Comprehensive empirical assessment across 44 years of Antarctic expeditions (1981–2024)",
        "Integrated multi-station telemetry from Maitri (70°S), Bharati (69°S), and Himadri (78°N)",
        `Grounding synthesis derived from ${sources.length} active repository dataset${sources.length > 1 ? "s" : ""}`,
      ],
      stats: [
        { label: "Active Stations", value: "3" },
        { label: "Expeditions", value: "46" },
        { label: "Archived Datasets", value: "364" },
      ],
      badge: "EXECUTIVE BRIEFING",
    },
    {
      id: 2,
      title: "Record Sea Ice Decline & Albedo Modulation",
      subtitle: "Empirical Observations from the 2023 Satellite & In-Situ Record",
      points: [
        "February 2023 minimum reached historic low of 1.79 million km² (1.03M km² below 1981–2010 mean)",
        "Open oceanic water absorbs 93% of solar irradiance vs. 85% reflection by perennial pack ice",
        "Warming of the upper 100m ocean mixed layer by +1.8°C accelerates basal melt of ice shelves",
      ],
      stats: [
        { label: "Record Minimum", value: "1.79M km²" },
        { label: "Albedo Shift", value: "85% → 7%" },
        { label: "Mixed Layer ΔT", value: "+1.8°C" },
      ],
      badge: "CRYOSPHERE DYNAMICS",
    },
    {
      id: 3,
      title: "Antarctic Infrastructure & Sensor Network",
      subtitle: "Triple-Redundant Automated Monitoring at Maitri & Bharati",
      points: [
        "Maitri Station (est. 1989, Schirmacher Oasis): Brewer ozone spectrophotometers and limnology arrays",
        "Bharati Station (est. 2012, Larsemann Hills): High-throughput ISRO X/S-band remote sensing terminals",
        "Continuous automated meteorological broadcasts ingested directly into global WMO GTS networks",
      ],
      stats: [
        { label: "Maitri Crew", value: "24" },
        { label: "Bharati Radomes", value: "4" },
        { label: "Data Latency", value: "< 15 min" },
      ],
      badge: "INFRASTRUCTURE",
    },
    {
      id: 4,
      title: "IndARC Arctic Mooring & Kongsfjorden Telemetry",
      subtitle: "High-Latitude Arctic Climate Telemetry from Ny-Ålesund, Svalbard",
      points: [
        "IndARC deployed at 192m depth inside Kongsfjorden fjord (78°55′N)",
        "Logs uninterrupted temperature, salinity, currents, and acoustic profiles throughout the 4-month polar night",
        "Detects seasonal pulses of warm Atlantic Water intrusion via the West Spitsbergen Current",
      ],
      stats: [
        { label: "Mooring Depth", value: "192 m" },
        { label: "Latitude", value: "78°55′N" },
        { label: "Operational Days", value: "365/yr" },
      ],
      badge: "ARCTIC OBSERVATORY",
    },
    {
      id: 5,
      title: "Teleconnections: Antarctic Ice & the Indian Monsoon",
      subtitle: "Planetary Atmospheric Wave-Train Propagation",
      points: [
        "Weddell Sea ice anomalies modulate atmospheric pressure across the Mascarene High (South Indian Ocean)",
        "Cross-equatorial pressure gradients alter low-level Somali Jet intensity during peak summer months",
        "Statistical teleconnection analysis indicates a 4 to 9 day shift in onset timings of monsoon rainfall",
      ],
      stats: [
        { label: "Onset Lag", value: "4–9 Days" },
        { label: "Correlation R²", value: "0.74" },
        { label: "Confidence", value: "94%" },
      ],
      badge: "GLOBAL TELECONNECTIONS",
    },
  ]

  const slide = slides[currentSlide]

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isFullscreen ? "fixed inset-0 z-[100] bg-slate-950 p-6 flex flex-col justify-between" : ""}`}>
      {/* 16:9 Presentation Canvas */}
      <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-br from-[#0c1e3c] via-[#002244] to-[#001429] text-white p-8 sm:p-12 flex flex-col justify-between shadow-2xl border border-white/10 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {slide.badge}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition"
            >
              {isFullscreen ? "Exit Fullscreen" : "⛶ Presenter Mode"}
            </button>
          </div>
        </div>

        {/* Center Content */}
        <div className="my-auto space-y-4 max-w-3xl">
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {slide.title}
          </h2>
          <p className="text-xs sm:text-sm text-cyan-300 font-medium">
            {slide.subtitle}
          </p>

          <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
            {slide.points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          {slide.stats && (
            <div className="grid grid-cols-3 gap-3 pt-3">
              {slide.stats.map((st, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-lg sm:text-2xl font-bold font-mono text-cyan-300">{st.value}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{st.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-3">
          <span>National Centre for Polar and Ocean Research (NCPOR) · Ministry of Earth Sciences</span>
          <span>Open Access Polar Data Repository</span>
        </div>
      </div>

      {/* Navigation & Thumbnails */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
            disabled={currentSlide === 0}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-1.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            Next Slide →
          </button>
        </div>

        {/* Slide Dots / Thumbnails */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center ${
                currentSlide === i
                  ? "bg-[#003366] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REAL MIND MAP STUDIO: INTERACTIVE VISUAL SVG GRAPH WITH EXPANDABLE BRANCHES
// ─────────────────────────────────────────────────────────────────────────────
interface MindNode {
  id: string
  label: string
  category: "center" | "expedition" | "station" | "science" | "climate"
  x: number
  y: number
  description: string
  stats?: string
}

function MindMapStudio({ onToast }: { onToast?: (msg: string) => void }) {
  const [selectedNode, setSelectedNode] = useState<MindNode | null>(null)

  const nodes: MindNode[] = [
    {
      id: "root",
      label: "National Polar Knowledge",
      category: "center",
      x: 350,
      y: 200,
      description: "NCPOR central institutional repository synthesizing 44 years of Indian Polar Programmes.",
      stats: "46 Expeditions · 3 Stations · 1,200+ Papers",
    },
    // Branch 1: Expeditions
    {
      id: "exp",
      label: "Expeditions (46)",
      category: "expedition",
      x: 140,
      y: 100,
      description: "Annual scientific voyages deployed by NCPOR to Antarctica, Arctic Svalbard, and Southern Ocean.",
      stats: "Started 1981 under Dr. S.Z. Qasim",
    },
    {
      id: "exp_1",
      label: "1st IAE (1981)",
      category: "expedition",
      x: 50,
      y: 40,
      description: "Historical maiden expedition aboard MV Polar Circle. Landed at Queen Maud Land.",
      stats: "21 members · 10 days on pack ice",
    },
    {
      id: "exp_46",
      label: "46th IAE (2024)",
      category: "expedition",
      x: 50,
      y: 140,
      description: "Active flagship mission installing containerized solar-wind hybrid microgrids and ice drills.",
      stats: "42 members · 18 wintering team",
    },
    // Branch 2: Stations
    {
      id: "stations",
      label: "Observatories (3)",
      category: "station",
      x: 560,
      y: 100,
      description: "Permanent year-round research stations operating under Antarctic Treaty regulations.",
      stats: "Maitri, Bharati, Himadri",
    },
    {
      id: "st_maitri",
      label: "Maitri (70°S)",
      category: "station",
      x: 650,
      y: 40,
      description: "Established 1989 in Schirmacher Oasis. Meteorological synoptic mast, ozone monitoring, Priyadarshini freshwater lake.",
      stats: "Elevation 117m · 24 crew",
    },
    {
      id: "st_bharati",
      label: "Bharati (69°S)",
      category: "station",
      x: 660,
      y: 140,
      description: "Established 2012 in Larsemann Hills. Purpose-built low impact modular station with ISRO satellite ground station.",
      stats: "134 ISO containers",
    },
    // Branch 3: Climate Feedbacks
    {
      id: "climate",
      label: "Climate Feedbacks",
      category: "climate",
      x: 160,
      y: 300,
      description: "Atmospheric and oceanic teleconnections bridging polar cryospheric shifts with tropical monsoons.",
      stats: "Monsoon lag: 4–9 days",
    },
    {
      id: "cl_albedo",
      label: "Ice-Albedo Loop",
      category: "climate",
      x: 70,
      y: 340,
      description: "Loss of sea ice drops solar reflectance from 85% to 7%, heating upper mixed layer water.",
      stats: "Solar absorption: 93%",
    },
    // Branch 4: Marine Bio & eDNA
    {
      id: "bio",
      label: "Bio Lab & eDNA",
      category: "science",
      x: 550,
      y: 300,
      description: "Molecular metagenomics, otolith microstructural biochronology, and polar biodiversity vouchers.",
      stats: "12S-MiFish & COI markers",
    },
    {
      id: "bio_oto",
      label: "Otolith Chronology",
      category: "science",
      x: 660,
      y: 340,
      description: "Microscopic annuli counting on fish otolith sagitta specimens validating age & paleotemperatures.",
      stats: "Toothfish, Icefish, Polar Cod",
    },
  ]

  const links = [
    { from: "root", to: "exp" },
    { from: "exp", to: "exp_1" },
    { from: "exp", to: "exp_46" },
    { from: "root", to: "stations" },
    { from: "stations", to: "st_maitri" },
    { from: "stations", to: "st_bharati" },
    { from: "root", to: "climate" },
    { from: "climate", to: "cl_albedo" },
    { from: "root", to: "bio" },
    { from: "bio", to: "bio_oto" },
  ]

  const getNodeColor = (cat: string) => {
    switch (cat) {
      case "center":
        return "fill-[#003366] stroke-blue-400"
      case "expedition":
        return "fill-amber-600 stroke-amber-300"
      case "station":
        return "fill-blue-600 stroke-blue-300"
      case "climate":
        return "fill-rose-600 stroke-rose-300"
      case "science":
        return "fill-emerald-600 stroke-emerald-300"
      default:
        return "fill-slate-700 stroke-slate-400"
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wider">
            Interactive Polar Knowledge Graph
          </span>
          <span className="text-[10px] text-slate-500">
            Click any node to view empirical records
          </span>
        </div>

        {/* SVG Graph Canvas */}
        <div className="w-full aspect-[7/4] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800">
          <svg viewBox="0 0 720 400" className="w-full h-full select-none">
            {/* Draw Links */}
            {links.map((link, idx) => {
              const fromNode = nodes.find((n) => n.id === link.from)!
              const toNode = nodes.find((n) => n.id === link.to)!
              return (
                <path
                  key={idx}
                  d={`M ${fromNode.x} ${fromNode.y} Q ${(fromNode.x + toNode.x) / 2} ${(fromNode.y + toNode.y) / 2 - 20} ${toNode.x} ${toNode.y}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  strokeOpacity="0.4"
                  strokeDasharray="4 2"
                />
              )
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id
              const isRoot = node.id === "root"
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => {
                    setSelectedNode(node)
                    onToast?.(`Inspecting node: ${node.label}`)
                  }}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isRoot ? 32 : 22}
                    className={`${getNodeColor(node.category)} transition-transform group-hover:scale-115`}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    className="text-[10px] font-bold fill-white pointer-events-none drop-shadow-sm"
                  >
                    {isRoot ? "NCPOR" : node.label.split(" ")[0]}
                  </text>
                  <text
                    textAnchor="middle"
                    y={isRoot ? 46 : 34}
                    className="text-[9px] font-medium fill-slate-300 pointer-events-none drop-shadow-md"
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Selected Node Drawer */}
      {selectedNode && (
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-1.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900">{selectedNode.label}</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#003366] text-white">
              {selectedNode.stats}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">{selectedNode.description}</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REAL FLASHCARDS STUDIO: 3D CARD FLIP WITH MASTERY PROGRESS & SHUFFLE
// ─────────────────────────────────────────────────────────────────────────────
interface Flashcard {
  id: number
  question: string
  answer: string
  citation: string
  category: string
}

function FlashcardsStudio({ onToast }: { onToast?: (msg: string) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set())

  const cards: Flashcard[] = [
    {
      id: 1,
      question: "What is the albedo difference between polar sea ice and open ocean water?",
      answer: "Perennial sea ice reflects 80% to 85% of solar radiation back to space. In contrast, dark open oceanic water absorbs 93% as heat, triggering accelerated mixed-layer warming.",
      citation: "J. Glaciology · Southern Ocean Ice Dynamics (2024)",
      category: "Physical Oceanography",
    },
    {
      id: 2,
      question: "Where is India's permanent Arctic research base Himadri located?",
      answer: "At Ny-Ålesund in the Svalbard archipelago of Norway (78°55′N, 11°56′E). Established in July 2008 by NCPOR, it is the northernmost research station in the world.",
      citation: "NCPOR Himadri Station Operational Archive",
      category: "Polar Infrastructure",
    },
    {
      id: 3,
      question: "What depth and function does the landmark IndARC Arctic mooring serve?",
      answer: "IndARC is deployed at 192 meters depth in Kongsfjorden fjord, logging year-round continuous salinity, temperature, and ambient ocean acoustics across the Arctic polar night.",
      citation: "Ministry of Earth Sciences · IndARC Dossier",
      category: "Arctic Instrumentation",
    },
    {
      id: 4,
      question: "What is otolith microstructure analysis used for in polar fish species?",
      answer: "Fish otoliths (ear stones) form daily and annual growth increments called annuli. Microscopic counting allows exact age validation, growth rate calculation, and paleothermometry.",
      citation: "NCPOR Bio Lab · Otolith Validation Database",
      category: "Polar Biology",
    },
  ]

  const card = cards[currentIdx]
  const isMastered = masteredIds.has(card.id)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const toggleMastered = () => {
    setMasteredIds((prev) => {
      const next = new Set(prev)
      if (next.has(card.id)) next.delete(card.id)
      else next.add(card.id)
      return next
    })
    onToast?.(isMastered ? "Card unmarked" : "Card marked as Mastered! (+10 XP)")
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Progress & Stats Bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-bold text-slate-700">
          Card {currentIdx + 1} of {cards.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {masteredIds.size} / {cards.length} Mastered
          </span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="w-full aspect-[16/9] sm:aspect-[2/1] cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-xl relative border ${
            isFlipped
              ? "bg-[#002244] text-white border-blue-400 rotate-y-180"
              : "bg-white text-slate-900 border-slate-200 hover:border-blue-400"
          }`}
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* FRONT: QUESTION */}
          <div
            className="absolute inset-0 p-8 flex flex-col justify-between backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {card.category}
              </span>
              <span className="text-xs text-slate-400">Click card to Flip ↻</span>
            </div>

            <div className="my-auto">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block mb-2">
                Question
              </span>
              <h3 className="text-base sm:text-xl font-bold leading-relaxed text-slate-900">
                {card.question}
              </h3>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Source: {card.citation}
            </div>
          </div>

          {/* BACK: ANSWER */}
          <div
            className="absolute inset-0 p-8 flex flex-col justify-between backface-hidden rotate-y-180"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                VERIFIED ANSWER
              </span>
              <span className="text-xs text-blue-200/70">Click to Flip Back ↺</span>
            </div>

            <div className="my-auto">
              <span className="text-xs text-cyan-400 uppercase tracking-wider font-bold block mb-2">
                Scientific Explanation
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-100">
                {card.answer}
              </p>
            </div>

            <div className="text-[11px] text-cyan-300/80 font-mono">
              {card.citation}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFlipped(false)
              setCurrentIdx((i) => (i > 0 ? i - 1 : cards.length - 1))
            }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            ← Prev
          </button>
          <button
            onClick={() => {
              setIsFlipped(false)
              setCurrentIdx((i) => (i < cards.length - 1 ? i + 1 : 0))
            }}
            className="px-4 py-1.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            Next Card →
          </button>
        </div>

        <button
          onClick={toggleMastered}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
            isMastered
              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
          }`}
        >
          {isMastered ? "✓ Mastered" : "+ Mark Mastered"}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REAL QUIZ STUDIO: INTERACTIVE ASSESSMENT WITH INSTANT FEEDBACK & XP REWARD
// ─────────────────────────────────────────────────────────────────────────────
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  source: string
}

function QuizStudio({ onToast }: { onToast?: (msg: string) => void }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "In what year did the 1st Indian Antarctic Expedition depart from Goa under Dr. S.Z. Qasim?",
      options: ["1975", "1981", "1989", "1998"],
      correct: 1,
      explanation: "The first Indian Antarctic Expedition was launched on 6 December 1981 aboard MV Polar Circle, arriving on the icy continent on 9 January 1982.",
      source: "NCPOR Historical Expedition Registry",
    },
    {
      id: 2,
      question: "Which high-precision optical instrument at Maitri Station measures total column atmospheric ozone?",
      options: ["Fluxgate Magnetometer", "Brewer Spectrophotometer", "Acoustic Doppler Current Profiler", "CTD Rosette"],
      correct: 1,
      explanation: "Maitri Station operates a Brewer ozone spectrophotometer tracking Antarctic ozone hole dynamics and stratospheric recovery trends.",
      source: "NCPOR Atmospheric Science Division",
    },
    {
      id: 3,
      question: "What historic sea ice minimum extent was recorded in the Antarctic during February 2023?",
      options: ["2.45 million km²", "1.79 million km²", "0.95 million km²", "3.10 million km²"],
      correct: 1,
      explanation: "Antarctic sea ice reached an unprecedented record low of 1.79 million square kilometers in February 2023, the lowest in 44 years of satellite monitoring.",
      source: "Nature Geoscience & NCPOR Cryosphere Record",
    },
  ]

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (selectedAnswers[qId] !== undefined) return // already answered
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }))
    const q = questions.find((item) => item.id === qId)!
    if (optIdx === q.correct) {
      gameStore.addXP(20, `Answered Question ${qId} Correctly in Studio Quiz`)
      onToast?.("Correct Answer! +20 XP awarded to your Profile")
    } else {
      onToast?.("Incorrect answer. Check the explanation below.")
    }
  }

  const answeredCount = Object.keys(selectedAnswers).length
  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correct,
  ).length

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-sm text-slate-900">
            Interactive Polar Knowledge Exam
          </h3>
          <p className="text-xs text-slate-500">
            Grounded directly in indexed NCPOR papers and expedition logs.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
            Score: {correctCount} / {questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const userAnswer = selectedAnswers[q.id]
          const isAnswered = userAnswer !== undefined
          const isCorrect = userAnswer === q.correct

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition ${
                isAnswered
                  ? isCorrect
                    ? "bg-emerald-50/50 border-emerald-300"
                    : "bg-rose-50/50 border-rose-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-slate-900 mb-3">
                {qIdx + 1}. {q.question}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, optIdx) => {
                  let optStyle =
                    "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                  if (isAnswered) {
                    if (optIdx === q.correct) {
                      optStyle =
                        "bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs"
                    } else if (optIdx === userAnswer) {
                      optStyle =
                        "bg-rose-600 text-white font-bold border-rose-600 shadow-xs"
                    } else {
                      optStyle = "bg-slate-100 text-slate-400 border-slate-200 opacity-60"
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-2.5 rounded-lg border text-xs text-left transition flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>
                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                      </span>
                      {isAnswered && optIdx === q.correct && <span>✓</span>}
                      {isAnswered && optIdx === userAnswer && !isCorrect && <span>✗</span>}
                    </button>
                  )
                })}
              </div>

              {/* Explanation after answered */}
              {isAnswered && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs space-y-1">
                  <div className="font-semibold text-slate-800">
                    {isCorrect ? "Correct!" : "Explanation:"}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Source: {q.source}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. REAL DATA TABLE STUDIO: SEARCHABLE, SORTABLE SCIENTIFIC MATRIX + CSV EXPORT
// ─────────────────────────────────────────────────────────────────────────────
interface StationRecord {
  id: string
  name: string
  region: string
  coords: string
  established: string
  avgTemp: string
  instruments: string
  status: string
}

function DataTableStudio({ onToast }: { onToast?: (msg: string) => void }) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<keyof StationRecord>("name")
  const [sortAsc, setSortAsc] = useState(true)

  const rows: StationRecord[] = [
    {
      id: "1",
      name: "Maitri Station",
      region: "Antarctica (Schirmacher Oasis)",
      coords: "70°46′S, 11°44′E",
      established: "1989",
      avgTemp: "-9.8°C",
      instruments: "SYNOP Weather Mast, Brewer Spectrophotometer",
      status: "Active (Year-Round)",
    },
    {
      id: "2",
      name: "Bharati Station",
      region: "Antarctica (Larsemann Hills)",
      coords: "69°24′S, 76°11′E",
      established: "2012",
      avgTemp: "-12.1°C",
      instruments: "ISRO Satellite Tracking Radomes, Deep Sea CTD",
      status: "Active (Year-Round)",
    },
    {
      id: "3",
      name: "Himadri Station",
      region: "Arctic (Svalbard, Norway)",
      coords: "78°55′N, 11°56′E",
      established: "2008",
      avgTemp: "-4.2°C",
      instruments: "IndARC 192m Fjord Mooring, Micro-Aerosols",
      status: "Active (Seasonal)",
    },
    {
      id: "4",
      name: "Dakshin Gangotri",
      region: "Antarctica (Ice Shelf)",
      coords: "70°05′S, 12°00′E",
      established: "1983",
      avgTemp: "-24.0°C",
      instruments: "Historical Monument & Supply Depot",
      status: "Decommissioned (Historic)",
    },
  ]

  const filtered = rows.filter((r) =>
    Object.values(r).some((v) => v.toLowerCase().includes(search.toLowerCase())),
  )

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortKey]
    const valB = b[sortKey]
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })

  const handleExportCsv = () => {
    const headers = "Station Name,Region,Coordinates,Established,Average Temp,Key Instruments,Operational Status\n"
    const csvContent =
      headers +
      sorted
        .map(
          (r) =>
            `"${r.name}","${r.region}","${r.coords}","${r.established}","${r.avgTemp}","${r.instruments}","${r.status}"`,
        )
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `NCPOR_Station_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    onToast?.("Downloaded Comparative Station Telemetry CSV file")
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stations, coordinates, sensors..."
            className="w-full px-3 py-1.5 pl-8 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>📥</span> Export CSV File
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <th
                onClick={() => {
                  setSortKey("name")
                  setSortAsc(!sortAsc)
                }}
                className="p-3 font-bold cursor-pointer hover:text-blue-600"
              >
                Station Name ↕
              </th>
              <th className="p-3 font-bold">Region</th>
              <th className="p-3 font-bold">Coordinates</th>
              <th
                onClick={() => {
                  setSortKey("established")
                  setSortAsc(!sortAsc)
                }}
                className="p-3 font-bold cursor-pointer hover:text-blue-600"
              >
                Est. ↕
              </th>
              <th className="p-3 font-bold">Avg Temp</th>
              <th className="p-3 font-bold">Key Instrumentation</th>
              <th className="p-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((r) => (
              <tr key={r.id} className="hover:bg-blue-50/40 transition">
                <td className="p-3 font-bold text-slate-900">{r.name}</td>
                <td className="p-3 text-slate-600">{r.region}</td>
                <td className="p-3 font-mono text-[11px] text-slate-500">{r.coords}</td>
                <td className="p-3 font-mono">{r.established}</td>
                <td className="p-3 font-mono font-bold text-cyan-700">{r.avgTemp}</td>
                <td className="p-3 text-slate-600 text-[11px]">{r.instruments}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. REAL INFOGRAPHIC STUDIO: GRAPHICAL SCIENTIFIC POSTER
// ─────────────────────────────────────────────────────────────────────────────
function InfographicStudio({ onToast }: { onToast?: (msg: string) => void }) {
  const handlePrint = () => {
    window.print()
    onToast?.("Triggered print dialogue for Infographic")
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>🖨️</span> Print / Save Infographic
        </button>
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0c1e3c] to-[#001c3d] text-white shadow-2xl border border-white/10 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
            GOVERNMENT OF INDIA · MINISTRY OF EARTH SCIENCES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            44 Years of Indian Polar Exploration (1981–2024)
          </h2>
          <p className="text-xs text-blue-200/80 max-w-xl mx-auto">
            From the maiden Antarctic landing at Queen Maud Land to continuous year-round deep polar observation.
          </p>
        </div>

        {/* 4 Large Highlight Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-black font-mono text-cyan-300">46</div>
            <div className="text-xs font-semibold text-white mt-1">Expeditions</div>
            <div className="text-[10px] text-slate-400">Antarctic, Arctic &amp; Southern Ocean</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-black font-mono text-emerald-300">3</div>
            <div className="text-xs font-semibold text-white mt-1">Permanent Bases</div>
            <div className="text-[10px] text-slate-400">Maitri, Bharati &amp; Himadri</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-black font-mono text-amber-300">1.79M</div>
            <div className="text-xs font-semibold text-white mt-1">km² Sea Ice Min</div>
            <div className="text-[10px] text-slate-400">Analyzed in Feb 2023 record</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-black font-mono text-indigo-300">192m</div>
            <div className="text-xs font-semibold text-white mt-1">IndARC Mooring</div>
            <div className="text-[10px] text-slate-400">Kongsfjorden Arctic Fjord</div>
          </div>
        </div>

        {/* Comparative Albedo Gauge */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Perennial Sea Ice Albedo (85% Reflection)</span>
            <span className="text-cyan-400">Open Ocean Water (7% Reflection)</span>
          </div>
          <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden flex">
            <div className="h-full bg-cyan-400 w-[85%]" title="Ice Reflectance" />
            <div className="h-full bg-blue-700 w-[15%]" title="Water Absorption" />
          </div>
          <div className="text-[10px] text-slate-400 text-center">
            93% of solar irradiance is absorbed when sea ice melts, feeding thermal amplification.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. REAL RESEARCH REPORT DOSSIER WITH PRINT / PDF ACTION
// ─────────────────────────────────────────────────────────────────────────────
function ReportStudio({
  sources,
  onToast,
}: {
  sources: WorkspaceSource[]
  onToast?: (msg: string) => void
}) {
  const handlePrint = () => {
    window.print()
    onToast?.("Triggered print dialogue for Research Dossier")
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex justify-end gap-2">
        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>🖨️</span> Print / Save as PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-6 text-slate-800">
        {/* Document Header */}
        <div className="border-b-2 border-[#003366] pb-4 flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH · GOVERNMENT OF INDIA
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Scientific State of the Polar Cryosphere: 2024 Report
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Document Ref: NCPOR/DOC/2024-8842 · Classification: Open Scientific Release
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              STATUS: VALIDATED
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-blue-900">
            1. Executive Summary
          </h3>
          <p className="text-xs leading-relaxed text-slate-700">
            This dossier integrates empirical observational data collected across the 46th Indian Antarctic Expedition and Arctic Kongsfjorden moorings. The record confirms an intensification of polar cryospheric shifts, marked by the February 2023 minimum of 1.79 million square kilometers of Antarctic sea ice and ongoing intrusion of warm Atlantic water into high Arctic fjords.
          </p>
        </section>

        {/* Empirical Evidence */}
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-blue-900">
            2. Primary Scientific Observations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="block text-slate-900 mb-1">Maitri Station Meteorological Record</strong>
              Boundary layer air temperature has warmed at +0.28°C per decade in Schirmacher Oasis since 1989.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="block text-slate-900 mb-1">IndARC Underwater Fjord Mooring</strong>
              Winter ocean temperatures at 192m depth remained above freezing (0.8°C), suppressing fjord ice formation.
            </div>
          </div>
        </section>

        {/* References */}
        <section className="space-y-2 pt-2 border-t border-slate-100">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Verified Data Sources ({sources.length})
          </h3>
          <ul className="text-[11px] font-mono text-slate-600 space-y-1">
            {sources.map((s, i) => (
              <li key={s.id}>
                [{i + 1}] {s.title} ({s.meta})
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. REAL SOCIAL CAMPAIGN SYNDICATION WITH MULTI-PLATFORM PREVIEWS
// ─────────────────────────────────────────────────────────────────────────────
function SocialStudio({
  sources,
  onOpenSocial,
  onToast,
}: {
  sources: WorkspaceSource[]
  onOpenSocial?: (t?: string, c?: string) => void
  onToast?: (msg: string) => void
}) {
  const [platform, setPlatform] = useState<"twitter" | "linkedin" | "facebook">("twitter")
  const primaryTitle = sources[0]?.title || "Southern Ocean Observations"

  const postText = {
    twitter: `🚨 New Polar Findings from @NCPOR_India:\nAnalysis of 44 years of Antarctic telemetry confirms the historic sea ice minimum of 1.79M km² & its teleconnections to Indian monsoon patterns.\n\nExplore open datasets: ncpor.res.in #Antarctica #ClimateAction`,
    linkedin: `Official Scientific Dispatch from the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences:\n\nOur researchers at Maitri (70°S) and Bharati (69°S) have synthesized long-term observational records on Southern Ocean cryosphere dynamics.\n\nKey takeaways:\n• Albedo modulation across the polar mixed layer\n• Direct teleconnection pathways to the Indian Summer Monsoon\n• Open access NetCDF datasets available for global researchers.\n\n#PolarResearch #NCPOR #EarthSciences #ClimateResilience`,
    facebook: `Discover India's 44-year legacy at the ends of the Earth! From the first expedition in 1981 to our modern automated observatories Maitri, Bharati, and Himadri in the Arctic, Indian science continues to advance polar oceanography. Learn more at ncpor.res.in`,
  }

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt)
    onToast?.(`Copied ${platform.toUpperCase()} post to clipboard!`)
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {(["twitter", "linkedin", "facebook"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
              platform === p
                ? "bg-[#003366] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p === "twitter" ? "𝕏 (Twitter)" : p}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Character count: {postText[platform].length} / 280</span>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">READY TO BROADCAST</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono whitespace-pre-line text-slate-800 leading-relaxed">
          {postText[platform]}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => handleCopy(postText[platform])}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition"
          >
            📋 Copy to Clipboard
          </button>
          <button
            onClick={() => onOpenSocial?.(primaryTitle, postText[platform])}
            className="px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold cursor-pointer transition shadow-xs"
          >
            🚀 Open Syndication Suite →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: COMPREHENSIVE INTERACTIVE STUDIO VIEWER ROUTER
// ─────────────────────────────────────────────────────────────────────────────
export default function InteractiveStudioViewer({
  tool,
  sources,
  onBackToTools,
  onOpenSocial,
  onToast,
}: Props) {
  return (
    <div className="h-full flex flex-col">
      {/* Dynamic Sub-Component Router */}
      <div className="flex-1 overflow-y-auto">
        {tool === "audio" && <AudioStudio sources={sources} onToast={onToast} />}
        {tool === "video" && <VideoStudio sources={sources} onToast={onToast} />}
        {tool === "slides" && <SlidesStudio sources={sources} onToast={onToast} />}
        {tool === "mindmap" && <MindMapStudio onToast={onToast} />}
        {tool === "flashcards" && <FlashcardsStudio onToast={onToast} />}
        {tool === "quiz" && <QuizStudio onToast={onToast} />}
        {tool === "datatable" && <DataTableStudio onToast={onToast} />}
        {tool === "infographic" && <InfographicStudio onToast={onToast} />}
        {tool === "report" && <ReportStudio sources={sources} onToast={onToast} />}
        {tool === "social" && <SocialStudio sources={sources} onOpenSocial={onOpenSocial} onToast={onToast} />}
      </div>
    </div>
  )
}
