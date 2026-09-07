import { useState, useEffect } from "react";
import {
  lmsCourses,
  LMSCourse,
  LMSLesson,
  LMSSubject,
  LMSChapter,
  getStudentAIResponse,
} from "../educationData";
import { gameStore } from "../gameStore";

interface Props {
  onNavigate?: (p: string) => void;
  onOpenStudio?: () => void;
}

// Navigation flow levels matching the requested batch experience
type ViewLevel =
  | "batches_catalog"   // Browse all available batches
  | "batch_details"     // Image 2: Batch banner + SUBJECTS / TESTS / ANNOUNCEMENTS / COMMUNITY
  | "subject_chapters"  // Image 1: Back to Batch Details + 4 Chapter Cards Grid (with stats & progress)
  | "chapter_content"   // Image 3: Back to Chapters + Lectures / Notes / DPP / Solutions / Quiz tabs
  | "lecture_player";   // Full Cinema Player with synchronized notes & AI doubt engine

export default function Education({ onNavigate, onOpenStudio }: Props) {
  // Navigation State - starts on Batches Catalog
  const [viewLevel, setViewLevel] = useState<ViewLevel>("batches_catalog");

  // Selected Course / Batch - defaults to Antarctic Cryosphere Masterclass
  const [selectedCourseId, setSelectedCourseId] = useState<string>("course-glaciology");
  const currentCourse: LMSCourse =
    lmsCourses.find(c => c.id === selectedCourseId) || lmsCourses[0];

  // Batch details main tabs (Image 2)
  const [batchTab, setBatchTab] = useState<"SUBJECTS" | "TESTS" | "ANNOUNCEMENTS" | "COMMUNITY">(
    "SUBJECTS"
  );

  // Selected Subject ID (defaults to Ice Core Climatology)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("subj-glac-icecores");

  // Selected Chapter ID (defaults to Deep Ice Cores)
  const [selectedChapterId, setSelectedChapterId] = useState<string>("chap-glac-icecores");

  // Selected Lesson
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    currentCourse.lessons?.[0]?.id || "l1-ice-cores"
  );

  // Chapter Content Sub-tabs (Image 3)
  const [chapterTab, setChapterTab] = useState<
    "Lectures" | "Notes" | "DPP PDF" | "Solutions" | "DPP Quiz" | "AI Doubts"
  >("Lectures");

  // Favorite / Bookmark Batch State
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Completed Lessons Set
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(["l1-ice-cores"])
  );

  // Modal Dialogs for Top Bar
  const [batchModalOpen, setBatchModalOpen] = useState<boolean>(false);
  const [telegramModalOpen, setTelegramModalOpen] = useState<boolean>(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Video Player Controls & State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);

  // Slide Deck in Class Notes
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // DPP Test / Quiz State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // AI Doubt Engine State
  const [doubtInput, setDoubtInput] = useState<string>("");
  const [doubtLog, setDoubtLog] = useState<
    Array<{ q: string; a: string; timestamp: string; id: string }>
  >([]);

  // ── BATCHES SEARCH & FILTER STATE ──────────────────────────────────────────
  const [batchSearchQuery, setBatchSearchQuery] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  const categoryFilters = [
    { id: "All", label: "All Batches", icon: "" },
    { id: "Glaciology", label: "Glaciology & Cryosphere", icon: "" },
    { id: "Ocean", label: "Ocean & Sea Ice", icon: "" },
    { id: "Arctic", label: "Arctic & Climate", icon: "" },
    { id: "Himalayan", label: "Himalayan Cryosphere", icon: "" },
    { id: "GIS", label: "Remote Sensing & GIS", icon: "" },
    { id: "Biology", label: "Polar Biology", icon: "EXP" },
    { id: "Engineering", label: "Station Engineering", icon: "" },
    { id: "Atmosphere", label: "Atmospheric Science", icon: "" },
  ];

  // Filter batches in catalog
  const filteredCourses = lmsCourses.filter(course => {
    const q = batchSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.code.toLowerCase().includes(q) ||
      course.faculty.toLowerCase().includes(q) ||
      (course.category && course.category.toLowerCase().includes(q)) ||
      (course.badge && course.badge.toLowerCase().includes(q)) ||
      (course.targetAudience && course.targetAudience.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategoryFilter === "All" ||
      (selectedCategoryFilter === "Glaciology" &&
        (course.category?.toLowerCase().includes("glac") ||
          course.category?.toLowerCase().includes("cryo") ||
          course.id.includes("glac"))) ||
      (selectedCategoryFilter === "Ocean" &&
        (course.category?.toLowerCase().includes("ocean") ||
          course.category?.toLowerCase().includes("sea") ||
          course.id.includes("sea") ||
          course.id.includes("ocean"))) ||
      (selectedCategoryFilter === "Arctic" &&
        (course.category?.toLowerCase().includes("arctic") || course.id.includes("arctic"))) ||
      (selectedCategoryFilter === "Himalayan" &&
        (course.category?.toLowerCase().includes("him") || course.id.includes("him"))) ||
      (selectedCategoryFilter === "GIS" &&
        (course.category?.toLowerCase().includes("gis") ||
          course.category?.toLowerCase().includes("remote") ||
          course.id.includes("gis") ||
          course.id.includes("remote"))) ||
      (selectedCategoryFilter === "Biology" &&
        (course.category?.toLowerCase().includes("bio") || course.id.includes("bio"))) ||
      (selectedCategoryFilter === "Engineering" &&
        (course.category?.toLowerCase().includes("eng") || course.id.includes("eng"))) ||
      (selectedCategoryFilter === "Atmosphere" &&
        (course.category?.toLowerCase().includes("atm") || course.id.includes("atm")));

    return matchesQuery && matchesCategory;
  });

  // Construct structured subjects and chapters for the active course
  const subjects: LMSSubject[] =
    currentCourse.subjects && currentCourse.subjects.length > 0
      ? currentCourse.subjects
      : [
          {
            id: "subj-notices",
            title: "Notices",
            icon: "",
            iconType: "notices",
            chaptersCount: 0,
            lecturesCount: 0,
            isNotice: true,
            chapters: [],
          },
          {
            id: "subj-core",
            title: currentCourse.title.split("&")[0].trim() || "Polar Cryosphere Science",
            icon: currentCourse.id.includes("glac")
              ? ""
              : currentCourse.id.includes("sea")
              ? ""
              : currentCourse.id.includes("bio")
              ? "EXP"
              : "",
            iconType: "science",
            chaptersCount: currentCourse.lessons.length,
            lecturesCount: currentCourse.lessons.length,
            isNotice: false,
            chapters: currentCourse.lessons.map((lesson, idx) => ({
              id: `chap-${idx}`,
              title: lesson.title.split(":")[0].replace("50,000 Years of ", "").trim(),
              lecturesCount: 1,
              notesCount: lesson.slideDeck?.length || 1,
              dppCount: lesson.dppCards?.length || 0,
              exercisesCount: lesson.quizQuestions?.length || 0,
              progressPct: completedLessonIds.has(lesson.id) ? 100 : 0,
              lectures: [lesson],
            })),
          },
        ];

  const currentSubject: LMSSubject =
    subjects.find(s => s.id === selectedSubjectId) ||
    subjects.find(s => !s.isNotice) ||
    subjects[0];

  const currentChapter: LMSChapter =
    currentSubject.chapters.find(c => c.id === selectedChapterId) ||
    currentSubject.chapters[0] || {
      id: "chap-default",
      title: "General Orientation",
      lecturesCount: 0,
      notesCount: 0,
      dppCount: 0,
      exercisesCount: 0,
      lectures: [],
    };

  // Resolve current active lesson
  const allAvailableLessons: LMSLesson[] = [
    ...(currentChapter.lectures || []),
    ...(currentCourse.lessons || []),
  ];

  const currentLesson: LMSLesson =
    allAvailableLessons.find(l => l.id === selectedLessonId) ||
    currentChapter.lectures[0] ||
    currentCourse.lessons[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // When changing course / batch
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const target = lmsCourses.find(c => c.id === courseId) || lmsCourses[0];
    const targetSubjects = target.subjects || [];
    const firstSubject = targetSubjects.find(s => !s.isNotice) || targetSubjects[0];
    if (firstSubject) {
      setSelectedSubjectId(firstSubject.id);
      setSelectedChapterId(firstSubject.chapters[0]?.id || "chap-0");
      if (firstSubject.chapters[0]?.lectures?.[0]) {
        setSelectedLessonId(firstSubject.chapters[0].lectures[0].id);
      }
    } else {
      setSelectedLessonId(target.lessons[0]?.id || "l1");
    }
    setCurrentChapterIndex(0);
    setActiveSlideIndex(0);
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setIsQuizAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
    setBatchModalOpen(false);
    setViewLevel("batch_details");
    showToast(`Switched to ${target.title}`);
  };

  // When clicking on a subject in Image 2
  const handleOpenSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const subj = subjects.find(s => s.id === subjectId) || subjects[0];
    if (subj.chapters.length > 0) {
      setSelectedChapterId(subj.chapters[0].id);
      if (subj.chapters[0].lectures.length > 0) {
        setSelectedLessonId(subj.chapters[0].lectures[0].id);
      }
    }
    setViewLevel("subject_chapters");
  };

  // When clicking on a chapter in Image 1
  const handleOpenChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    const chap = currentSubject.chapters.find(c => c.id === chapterId);
    if (chap && chap.lectures.length > 0) {
      setSelectedLessonId(chap.lectures[0].id);
    }
    setChapterTab("Lectures");
    setViewLevel("chapter_content");
  };

  // When clicking on a lecture to watch (Image 3)
  const handleWatchLecture = (lesson: LMSLesson) => {
    setSelectedLessonId(lesson.id);
    setCurrentChapterIndex(0);
    setActiveSlideIndex(0);
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setIsQuizAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
    setIsPlaying(true);
    setViewLevel("lecture_player");
  };

  // Toggle completion checkmark (Image 3 OK button)
  const handleToggleComplete = (lessonId: string, title?: string) => {
    setCompletedLessonIds(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
        showToast("Marked lecture as incomplete");
      } else {
        next.add(lessonId);
        gameStore.addXP(35, `Completed: ${title || "Lecture"}`);
        showToast("OK Marked lecture as completed (+35 XP)");
      }
      return next;
    });
  };

  // Active chapter scrubbing inside cinema player
  const activeLectureChapter =
    currentLesson.chapters?.[currentChapterIndex] ||
    currentLesson.chapters?.[0] || {
      time: "00:00",
      seconds: 0,
      title: "Lecture Introduction",
      slideSummary: "Key concepts and foundation",
      transcriptSnippet: "Welcome to this lecture.",
    };

  useEffect(() => {
    let timer: any;
    if (isPlaying && viewLevel === "lecture_player" && currentLesson.chapters?.length) {
      timer = setInterval(() => {
        setCurrentChapterIndex(prev => {
          if (prev < currentLesson.chapters.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            setCompletedLessonIds(c => new Set(c).add(currentLesson.id));
            gameStore.addXP(50, `Finished Full Lecture: ${currentLesson.title}`);
            return prev;
          }
        });
      }, 7000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, currentLesson, viewLevel]);

  // Handle Doubt Submission
  const handlePostDoubt = (text: string) => {
    if (!text.trim()) return;
    const answer = getStudentAIResponse(text);
    const newEntry = {
      id: Date.now().toString(),
      q: text.trim(),
      a: answer,
      timestamp: activeLectureChapter.time,
    };
    setDoubtLog(prev => [newEntry, ...prev]);
    setDoubtInput("");
    gameStore.addXP(15, `Asked Doubt in ${currentLesson.title}`);
  };

  // Handle Quiz
  const handleQuizAnswer = (optIdx: number) => {
    if (isQuizAnswered) return;
    setSelectedQuizOption(optIdx);
    setIsQuizAnswered(true);
    const currQ = currentLesson.quizQuestions?.[quizIndex];
    if (currQ && optIdx === currQ.correct) {
      setQuizScore(s => s + 1);
    }
  };

  const handleQuizNext = () => {
    if (!currentLesson.quizQuestions) return;
    if (quizIndex < currentLesson.quizQuestions.length - 1) {
      setQuizIndex(i => i + 1);
      setSelectedQuizOption(null);
      setIsQuizAnswered(false);
    } else {
      setQuizFinished(true);
      setCompletedLessonIds(c => new Set(c).add(currentLesson.id));
      const earned = Math.round(
        ((quizScore +
          (selectedQuizOption === currentLesson.quizQuestions[quizIndex]?.correct ? 1 : 0)) /
          currentLesson.quizQuestions.length) *
          100
      );
      gameStore.addXP(earned, `Passed DPP Test for ${currentLesson.title}`);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* ── TOAST NOTIFICATION ────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-blue-500/30 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP ACTION BAR (Matches Image 1 & 2 Action Bar with Existing Theme) ── */}
      <header className="w-full px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* NCPOR Polar LMS Portal Badge */}
          <div
            onClick={() => setBatchModalOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#0c1e3c] flex items-center justify-center shadow-2xs text-white cursor-pointer hover:bg-slate-800 transition"
            title="Browse All Batches"
          >
            <svg
              className="w-4.5 h-4.5 text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-slate-900 tracking-tight">
                NCPOR Polar Learning
              </h1>
              <span className="tag font-semibold">
                Live Batch
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block font-normal">
              National Centre for Polar and Ocean Research • Academic & Polar Research Portal
            </p>
          </div>
        </div>

        {/* Action Buttons: All Batches | Current Batch | Telegram | Whatsapp */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Batches Catalog Button */}
          <button
            onClick={() => setViewLevel("batches_catalog")}
            className={`${
              viewLevel === "batches_catalog" ? "btn-primary" : "btn-outline"
            } btn-sm rounded-xl cursor-pointer flex items-center gap-1.5`}
          >
            <span></span> All Batches
          </button>

          {/* Current Batch button when viewing a specific batch */}
          {viewLevel !== "batches_catalog" && (
            <button
              onClick={() => setViewLevel("batch_details")}
              className={`${
                viewLevel === "batch_details" ? "btn-primary" : "btn-outline"
              } btn-sm rounded-xl cursor-pointer flex items-center gap-1.5`}
              title="Return to current batch overview"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Batch Overview
            </button>
          )}

          {/* Join Telegram Button */}
          <button
            onClick={() => setTelegramModalOpen(true)}
            className="hidden sm:inline-flex btn-outline btn-sm rounded-xl cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-[#229ED9]" viewBox="0 0 24 24">
              <path d="M9.036 15.675l-.396 5.59c.567 0 .813-.244 1.108-.537l2.66-2.54 5.514 4.036c1.011.558 1.726.265 1.988-.937l3.607-16.92.001-.001c.311-1.453-.525-2.02-1.508-1.648L1.14 9.403c-1.412.549-1.392 1.326-.24 1.682l5.906 1.844L19.84 5.9c.613-.39 1.17-.174.71.216"/>
            </svg>
            <span>Join Telegram</span>
          </button>

          {/* Join Whatsapp Button */}
          <button
            onClick={() => setWhatsappModalOpen(true)}
            className="hidden sm:inline-flex btn-outline btn-sm rounded-xl cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.584-5.766-5.768-5.766zm3.385 8.212c-.144.405-.837.774-1.17.824-.312.045-.694.062-1.121-.073-.263-.083-.6-.195-1.033-.385-1.832-.803-3.029-2.658-3.12-2.781-.092-.122-.741-.986-.741-1.882 0-.896.469-1.336.636-1.519.167-.183.365-.229.487-.229.122 0 .244.002.35.006.113.004.264-.043.413.315.153.366.523 1.275.569 1.367.046.092.076.2.015.321-.061.122-.092.198-.183.305-.091.107-.193.24-.275.322-.092.092-.188.192-.081.376.107.183.475.783 1.021 1.269.704.627 1.297.82 1.48.912.183.091.29.076.397-.046.107-.122.457-.534.579-.717.122-.183.244-.153.412-.092.167.062 1.066.503 1.25.594.183.092.305.137.35.214.045.076.045.442-.099.847z"/>
            </svg>
            <span>Join Whatsapp</span>
          </button>

          {/* Polar AI quick link */}
          <button
            onClick={() => onNavigate?.("ai")}
            className="btn-outline btn-sm rounded-xl text-blue-700 bg-blue-50/70 border-blue-200 hover:bg-blue-100 cursor-pointer"
          >
            <span></span> Polar AI
          </button>

          {onOpenStudio && (
            <button
              onClick={onOpenStudio}
              className="btn-outline btn-sm rounded-xl cursor-pointer"
            >
              Studio
            </button>
          )}
        </div>
      </header>

      {/* ── LEVEL 0: BATCHES CATALOG (Search & Batch Cards Grid) ─────────── */}
      {viewLevel === "batches_catalog" && (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 w-full space-y-6 animate-in fade-in duration-200">

          {/* Search Bar & Category Filter Chips */}
          <div className="space-y-4">
            {/* Search Input Box */}
            <div className="card p-2 flex items-center gap-3 shadow-2xs border border-slate-200 rounded-xl bg-white">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                value={batchSearchQuery}
                onChange={e => setBatchSearchQuery(e.target.value)}
                placeholder="Search batches by name (e.g. Glaciology, Sea Ice), subject, instructor, code..."
                className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {batchSearchQuery && (
                <button
                  onClick={() => setBatchSearchQuery("")}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center text-xs cursor-pointer transition"
                  title="Clear search"
                >
                  x
                </button>
              )}
            </div>

            {/* Filter Chips & Batch Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {categoryFilters.map(cat => {
                  const isActive = selectedCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isActive
                          ? "bg-[#0c1e3c] text-white shadow-2xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-800">{filteredCourses.length}</span> of {lmsCourses.length} Batches
              </div>
            </div>
          </div>

          {/* Batches Cards Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course.id)}
                  className="card p-0 overflow-hidden flex flex-col bg-white border border-slate-200 hover:border-blue-400 rounded-2xl transition-all duration-200 hover:shadow-md cursor-pointer group"
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={course.bannerImage || course.lessons?.[0]?.videoThumb}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-white/95 text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {course.badge || "Academic"}
                      </span>
                      <span className="bg-blue-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                        {course.level}
                      </span>
                    </div>

                    {/* Bottom Metadata Overlays */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                      <span className="font-mono bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px]">
                        {course.code}
                      </span>
                      <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-medium">
                        <span></span> {course.totalLectures} Lectures
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2.5">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span></span>
                        <span className="font-medium line-clamp-1">{course.faculty}</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                        {course.targetAudience || "Comprehensive syllabus aligned with academic benchmarks."}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Meta Pills Row */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                        <span className="tag tag-gray text-[10px]">
                           {course.totalHours}
                        </span>
                        <span className="tag tag-gray text-[10px]">
                           {course.startDate || "Live Now"}
                        </span>
                        <span className="tag text-[10px]">
                          FREE
                        </span>
                      </div>

                      {/* Enter Batch Action Button */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleSelectCourse(course.id);
                        }}
                        className="btn-primary w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 group-hover:bg-blue-700 transition cursor-pointer shadow-2xs"
                      >
                        <span>Enter Batch</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="card p-12 text-center rounded-2xl border border-dashed border-slate-300 space-y-3 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl">
                
              </div>
              <h3 className="font-bold text-base text-slate-800">
                No batches found matching &ldquo;{batchSearchQuery}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No matching batches found with current search terms or category filter. Try clearing your search query.
              </p>
              <button
                onClick={() => {
                  setBatchSearchQuery("");
                  setSelectedCategoryFilter("All");
                }}
                className="btn-outline btn-sm rounded-xl cursor-pointer mt-2"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── LEVEL 1: BATCH DETAILS VIEW (Matches Image 2) ────────────────── */}
      {viewLevel === "batch_details" && (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 w-full space-y-5">
          {/* Breadcrumb matching Image 2 */}
          <div className="card px-4 py-2.5 text-xs flex items-center justify-between gap-2 text-slate-600 shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewLevel("batches_catalog")}
                className="hover:text-blue-600 flex items-center gap-1.5 font-medium cursor-pointer transition"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                Batches
              </button>
              <span className="text-slate-300 font-bold">&gt;</span>
              <span className="tag font-semibold">
                {currentCourse.title}
              </span>
            </div>
            <button
              onClick={() => setViewLevel("batches_catalog")}
              className="btn-outline btn-xs rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer flex items-center gap-1 font-medium"
            >
              <span>←</span> All Batches
            </button>
          </div>

          {/* Main Batch Banner Card (Matches Image 2 Layout Exactly with Portal Theme) */}
          <div className="card p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-l-blue-600 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full md:w-auto">
              {/* Batch Banner Image with "FREE BATCH ON NCPOR" badge */}
              <div className="relative w-full sm:w-64 aspect-video rounded-xl overflow-hidden shadow-xs bg-slate-900 flex-shrink-0">
                <img
                  src={currentCourse.bannerImage || currentCourse.lessons?.[0]?.videoThumb}
                  alt={currentCourse.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <span className="text-red-600 text-xs">▶</span> FREE BATCH ON NCPOR
                  </span>
                  <span className="text-[10px] text-white/90 font-mono font-medium">
                    {currentCourse.totalLectures} Lectures
                  </span>
                </div>
              </div>

              {/* Title, Subtitle, and Tag Badges */}
              <div className="space-y-2 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {currentCourse.title}
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  {currentCourse.targetAudience || "For Polar Science, Glaciology & Ocean Research Fellows"}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="tag font-semibold">
                    {currentCourse.badge || "NCPOR Masterclass"}
                  </span>
                  <span className="tag tag-gray">
                    {currentCourse.startDate || "7 Jul 2025"}
                  </span>
                  <span className="tag tag-green">
                     {currentCourse.faculty}
                  </span>
                </div>
              </div>
            </div>

            {/* Favorite / Heart Icon on Top Right (Matches Image 2) */}
            <button
              onClick={() => {
                setIsBookmarked(b => !b);
                showToast(isBookmarked ? "Removed from favorites" : "Added batch to favorites ");
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition self-end md:self-start cursor-pointer ${
                isBookmarked
                  ? "bg-rose-50 text-rose-600 border-rose-200 shadow-xs"
                  : "bg-white text-slate-400 border-slate-200 hover:text-rose-500 hover:bg-slate-50 shadow-2xs"
              }`}
              title={isBookmarked ? "Bookmarked" : "Bookmark Batch"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 ${isBookmarked ? "fill-rose-500 stroke-rose-500" : "fill-none stroke-current"}`}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs (SUBJECTS | TESTS | ANNOUNCEMENTS | COMMUNITY) */}
          <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold">
            {(["SUBJECTS", "TESTS", "ANNOUNCEMENTS", "COMMUNITY"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setBatchTab(tab)}
                className={`pb-2.5 transition relative cursor-pointer ${
                  batchTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: SUBJECTS (Matches Image 2 Subject Cards) */}
          {batchTab === "SUBJECTS" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {subjects.map(subj => (
                <div
                  key={subj.id}
                  onClick={() => handleOpenSubject(subj.id)}
                  className="card p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-center gap-4 group"
                >
                  {/* Left Icon (Megaphone for Notices, Cloud Server for Theory of Computation) */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 transition group-hover:scale-105 ${
                      subj.isNotice
                        ? "bg-slate-100 border border-slate-200 text-slate-700"
                        : "bg-blue-50 border border-blue-200 text-blue-600"
                    }`}
                  >
                    {subj.iconType === "notices" ? (
                      <svg className="w-5.5 h-5.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    ) : (
                      <svg className="w-5.5 h-5.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M9 16h6" />
                      </svg>
                    )}
                  </div>

                  {/* Title & Metadata (e.g. 0 chapters • 0 lectures, 4 chapters • 45 lectures) */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 truncate group-hover:text-blue-600 transition">
                      {subj.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-normal">
                      <span>{subj.chaptersCount} chapters</span>
                      <span>•</span>
                      <span>{subj.lecturesCount} lectures</span>
                    </p>
                  </div>

                  <span className="text-slate-300 group-hover:text-blue-600 text-base font-semibold pr-2 transition">
                    →
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: TESTS */}
          {batchTab === "TESTS" && (
            <div className="space-y-3 pt-1">
              <div className="card p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tag font-semibold">
                      LIVE TEST SERIES
                    </span>
                    <span className="text-xs text-slate-400">NCPOR ACADEMIC 2025-26</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900">
                    {currentCourse.title}: Comprehensive Module Test 01
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-normal">
                     60 mins • 30 Scientific Questions • Standard scoring & detailed formula explanations
                  </p>
                </div>
                <button
                  onClick={() => {
                    const firstActiveSubj = subjects.find(s => !s.isNotice) || subjects[0];
                    handleOpenSubject(firstActiveSubj.id);
                    setChapterTab("DPP Quiz");
                  }}
                  className="btn-primary btn-sm rounded-xl cursor-pointer"
                >
                  Start Test Series →
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: ANNOUNCEMENTS */}
          {batchTab === "ANNOUNCEMENTS" && (
            <div className="card p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="tag font-semibold">
                  OFFICIAL BULLETIN
                </span>
                <span className="text-xs text-slate-400 font-normal">18 Aug 2025</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                {currentCourse.title}: Field Observation Datasets & New Lectures Released
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Lectures covering core paleoclimate proxies, satellite InSAR radar techniques, and ice-core air occlusion have been published. Downloadable slide decks, DPP problem sets, and interactive quizzes are now active under the course subjects.
              </p>
            </div>
          )}

          {/* Tab 4: COMMUNITY */}
          {batchTab === "COMMUNITY" && (
            <div className="card p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-semibold text-slate-900">NCPOR Polar Student & Research Discussion Hub</h4>
                <button
                  onClick={() => onNavigate?.("ai")}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Ask Polar AI Instead →
                </button>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Join our active cohort of polar science fellows, university researchers, and faculty discussing ice dynamics, teleconnections, and expedition findings.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setTelegramModalOpen(true)}
                  className="btn-outline btn-sm rounded-xl cursor-pointer"
                >
                  Open Telegram Group
                </button>
                <button
                  onClick={() => setWhatsappModalOpen(true)}
                  className="btn-outline btn-sm rounded-xl text-emerald-700 bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                >
                  Open WhatsApp Group
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LEVEL 2: SUBJECT CHAPTERS VIEW (Matches Image 1) ─────────────── */}
      {viewLevel === "subject_chapters" && (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 w-full space-y-5">
          {/* Back button (Matches Image 1 style: ← Back to Batch Details) */}
          <div>
            <button
              onClick={() => setViewLevel("batch_details")}
              className="btn-outline btn-sm rounded-xl text-blue-600 border-slate-200 hover:bg-blue-50/40 cursor-pointer"
            >
              <span>←</span> Back to Batch Details
            </button>
          </div>

          {/* Breadcrumb matching Image 1 */}
          <div className="card px-4 py-2.5 text-xs flex items-center gap-2 text-slate-600 shadow-2xs">
            <button
              onClick={() => setViewLevel("batches_catalog")}
              className="hover:text-blue-600 flex items-center gap-1.5 font-medium cursor-pointer transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Batches
            </button>
            <span className="text-slate-300 font-bold">&gt;</span>
            <button
              onClick={() => setViewLevel("batch_details")}
              className="hover:text-blue-600 font-medium cursor-pointer transition"
            >
              {currentCourse.title}
            </button>
            <span className="text-slate-300 font-bold">&gt;</span>
            <span className="tag font-semibold">
              {currentSubject.title}
            </span>
          </div>

          {/* Section Heading with Left Vertical Blue Accent Bar (Matches Image 1) */}
          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-1.5 h-5 rounded-full bg-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {currentSubject.title}
            </h2>
          </div>

          {/* Chapter Cards Grid (Matches Image 1 exact 4-card row with stats and progress) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentSubject.chapters.map(chap => {
              // Calculate dynamic progress
              const completedCount = chap.lectures.filter(l => completedLessonIds.has(l.id)).length;
              const progressPct =
                chap.lectures.length > 0
                  ? Math.round((completedCount / chap.lectures.length) * 100)
                  : chap.progressPct || 0;

              return (
                <div
                  key={chap.id}
                  onClick={() => handleOpenChapter(chap.id)}
                  className="card p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between border-l-4 border-l-blue-600 space-y-3.5"
                >
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 leading-snug line-clamp-2 hover:text-blue-600 transition">
                      {chap.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-normal">
                      {chap.lecturesCount} Lectures | {chap.notesCount} Notes | {chap.dppCount} DPP | {chap.exercisesCount} Exercises
                    </p>
                  </div>

                  {/* Progress Bar & Percentage Underneath (Matches Image 1) */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="text-right text-[11px] font-medium text-slate-400">
                      {progressPct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LEVEL 3: CHAPTER CONTENT VIEW (Matches Image 3) ─────────────── */}
      {viewLevel === "chapter_content" && (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 w-full space-y-5">
          {/* Back button (Matches Image 3 style: ← Back to Chapters) */}
          <div>
            <button
              onClick={() => setViewLevel("subject_chapters")}
              className="btn-outline btn-sm rounded-xl text-blue-600 border-slate-200 hover:bg-blue-50/40 cursor-pointer"
            >
              <span>←</span> Back to Chapters
            </button>
          </div>

          {/* Breadcrumb matching Image 3 */}
          <div className="card px-4 py-2.5 text-xs flex flex-wrap items-center gap-2 text-slate-600 shadow-2xs">
            <button
              onClick={() => setViewLevel("batches_catalog")}
              className="hover:text-blue-600 flex items-center gap-1.5 font-medium cursor-pointer transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Batches
            </button>
            <span className="text-slate-300 font-bold">&gt;</span>
            <button
              onClick={() => setViewLevel("batch_details")}
              className="hover:text-blue-600 font-medium cursor-pointer transition"
            >
              {currentCourse.title}
            </button>
            <span className="text-slate-300 font-bold">&gt;</span>
            <button
              onClick={() => setViewLevel("subject_chapters")}
              className="hover:text-blue-600 font-medium cursor-pointer transition"
            >
              {currentSubject.title}
            </button>
            <span className="text-slate-300 font-bold">&gt;</span>
            <span className="tag font-semibold">
              {currentChapter.title}
            </span>
          </div>

          {/* Section Heading with Left Vertical Blue Accent Bar (Matches Image 3) */}
          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-1.5 h-5 rounded-full bg-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {currentChapter.title}
            </h2>
          </div>

          {/* Sub-tabs Container (Matches Image 3: Lectures | Notes | DPP PDF | Solutions | DPP Quiz) using portal tab-bar system */}
          <div className="tab-bar p-1 rounded-xl flex flex-wrap items-center gap-1">
            {(["Lectures", "Notes", "DPP PDF", "Solutions", "DPP Quiz", "AI Doubts"] as const).map(
              tab => (
                <button
                  key={tab}
                  onClick={() => setChapterTab(tab)}
                  className={`tab-item px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                    chapterTab === tab
                      ? "active bg-blue-600 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 font-medium"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* ── SUB-TAB 1: LECTURES (Matches Image 3 exact 5-column lecture cards) ── */}
          {chapterTab === "Lectures" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-1">
              {(currentChapter.lectures.length > 0
                ? currentChapter.lectures
                : currentCourse.lessons
              ).map((lec, idx) => {
                const isDone = completedLessonIds.has(lec.id);

                return (
                  <div
                    key={lec.id}
                    className="card overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    {/* Thumbnail with Video Play Overlay */}
                    <div
                      onClick={() => handleWatchLecture(lec)}
                      className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={lec.videoThumb}
                        alt={lec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                        <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                          ▶
                        </span>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                          Lec {lec.lessonNumber || idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Title (Matches Image 3) */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        {/* Date & Duration */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-normal">
                          <span className="flex items-center gap-1">
                            <span></span> {lec.date || "4 Aug 2025"}
                          </span>
                          <span className="flex items-center gap-1">
                            <span></span> {lec.duration}
                          </span>
                        </div>

                        {/* Title Clamped to 2 lines */}
                        <h4
                          onClick={() => handleWatchLecture(lec)}
                          className="font-semibold text-xs text-slate-900 leading-snug line-clamp-2 mt-1.5 cursor-pointer hover:text-blue-600 transition"
                          title={lec.title}
                        >
                          {lec.title}
                        </h4>
                      </div>

                      {/* Action Buttons Row: [Attachments] and [OK] */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedLessonId(lec.id);
                            setChapterTab("Notes");
                          }}
                          className="btn-outline btn-sm rounded-lg text-[11px] font-medium text-blue-700 bg-blue-50/60 border-blue-200 hover:bg-blue-100 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span></span> Attachments
                        </button>

                        <button
                          onClick={() => handleToggleComplete(lec.id, lec.title)}
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-semibold transition cursor-pointer ${
                            isDone
                              ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                          }`}
                          title={isDone ? "Completed" : "Mark as Completed"}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── SUB-TAB 2: NOTES (SLIDE DECK & DOWNLOAD) ───────────────────── */}
          {chapterTab === "Notes" && (
            <div className="card p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">
                    Official Slide Deck & Class Notes: {currentLesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    Slide {activeSlideIndex + 1} of {currentLesson.slideDeck?.length || 1}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const el = document.createElement("a");
                    el.href =
                      "data:text/plain;charset=utf-8," +
                      encodeURIComponent(
                        `# Class Notes: ${currentLesson.title}\nFaculty: ${currentLesson.speaker}\n\nSummary:\n${currentLesson.summary}\n\nFormulas / Rules:\n${currentLesson.keyFormulas?.join(
                          "\n"
                        )}`
                      );
                    el.download = `${currentLesson.title.slice(0, 30)}_Notes.txt`;
                    el.click();
                    showToast("Downloaded PDF notes");
                  }}
                  className="btn-primary btn-sm rounded-xl cursor-pointer self-start"
                >
                  <span></span> Download PDF Notes
                </button>
              </div>

              {(() => {
                const slides = currentLesson.slideDeck || [];
                const slide = slides[activeSlideIndex] || slides[0] || {
                  title: "Moore and Mealy Machines Overview",
                  subtitle: "Finite State Transducers with Output Signals",
                  bulletPoints: [
                    "Finite State Automata with output map input sequences to output sequences.",
                    "Moore machine output is determined by the current state alone.",
                    "Mealy machine output is determined by state transitions and input symbols.",
                  ],
                  callout: "Remember: Moore machine output length = n + 1 for input length n.",
                };

                return (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-base font-bold text-slate-900 tracking-tight">{slide.title}</h4>
                    <p className="text-xs font-medium text-slate-500">{slide.subtitle}</p>
                    <div className="space-y-2 my-2">
                      {slide.bulletPoints?.map((bp, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-normal">
                          <span className="text-blue-600 font-bold">●</span>
                          <span>{bp}</span>
                        </div>
                      ))}
                    </div>
                    {slide.callout && (
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700">
                        Note:  {slide.callout}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setActiveSlideIndex(i => Math.max(0, i - 1))}
                        disabled={activeSlideIndex === 0}
                        className="btn-outline btn-sm rounded-lg text-xs font-medium disabled:opacity-30 cursor-pointer"
                      >
                        ← Prev Slide
                      </button>
                      <span className="text-xs font-mono text-slate-400 font-medium">
                        {activeSlideIndex + 1} / {slides.length || 1}
                      </span>
                      <button
                        onClick={() =>
                          setActiveSlideIndex(i =>
                            Math.min((slides.length || 1) - 1, i + 1)
                          )
                        }
                        disabled={activeSlideIndex >= (slides.length || 1) - 1}
                        className="btn-primary btn-sm rounded-lg text-xs font-semibold disabled:opacity-30 cursor-pointer"
                      >
                        Next Slide →
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── SUB-TAB 3: DPP PDF ─────────────────────────────────────────── */}
          {chapterTab === "DPP PDF" && (
            <div className="card p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">
                    Daily Practice Problems (DPP Sheet #{currentLesson.lessonNumber || 1})
                  </h4>
                  <p className="text-xs text-slate-400 font-normal">
                    {currentLesson.dppCards?.length || 2} high-yield problems with complete solution keys
                  </p>
                </div>
                <button
                  onClick={() => {
                    const el = document.createElement("a");
                    el.href =
                      "data:text/plain;charset=utf-8," +
                      encodeURIComponent(
                        `# DPP Sheet: ${currentLesson.title}\n\n` +
                          (currentLesson.dppCards || [])
                            .map((c, i) => `Q${i + 1}: ${c.front}\nAns: ${c.back}\n`)
                            .join("\n")
                      );
                    el.download = `DPP_${currentLesson.title.slice(0, 20)}.txt`;
                    el.click();
                    showToast("Downloaded DPP Sheet");
                  }}
                  className="btn-primary btn-sm rounded-xl cursor-pointer self-start"
                >
                  <span></span> Download DPP PDF
                </button>
              </div>

              <div className="space-y-2.5">
                {(currentLesson.dppCards?.length
                  ? currentLesson.dppCards
                  : [
                      {
                        id: "d1",
                        front: "For an input string of length n, what is the output length of a Moore machine?",
                        back: "n + 1 (initial state output symbol + 1 output for each input consumed).",
                        tag: "Moore Machine",
                        difficulty: "Easy" as const,
                      },
                      {
                        id: "d2",
                        front: "When is state expansion mandatory during Mealy to Moore machine conversion?",
                        back: "When a Mealy state receives transitions with conflicting output symbols.",
                        tag: "State Splitting",
                        difficulty: "Medium" as const,
                      },
                    ]
                ).map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-normal"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-700">Problem {idx + 1}</span>
                      <span className="tag font-semibold">
                        {c.difficulty}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900">{c.front}</p>
                    <div className="pt-2 border-t border-slate-200/60 text-slate-600">
                      <strong className="text-slate-800 font-semibold">Answer Key: </strong>
                      {c.back}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SUB-TAB 4: SOLUTIONS ───────────────────────────────────────── */}
          {chapterTab === "Solutions" && (
            <div className="card p-5 shadow-2xs space-y-3">
              <h4 className="font-semibold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Detailed Solutions & Formal Mathematical Equations
              </h4>
              <div className="space-y-2.5">
                {(currentLesson.keyFormulas?.length
                  ? currentLesson.keyFormulas
                  : [
                      "Moore Machine: M = (Q, Σ, Δ, δ, λ, q₀) where λ: Q → Δ",
                      "Mealy Machine: M = (Q, Σ, Δ, δ, λ, q₀) where λ: Q × Σ → Δ",
                      "Output Length on |w| = n: Moore gives n + 1 symbols; Mealy gives n symbols",
                    ]
                ).map((f, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SUB-TAB 5: DPP QUIZ (INTERACTIVE LIVE TEST) ────────────────── */}
          {chapterTab === "DPP Quiz" && (
            <div className="max-w-xl mx-auto card p-6 shadow-2xs">
              {!quizFinished ? (
                (() => {
                  const questions = currentLesson.quizQuestions?.length
                    ? currentLesson.quizQuestions
                    : [
                        {
                          q: "What is the output length of a Moore machine on an input string of length 10?",
                          options: ["9", "10", "11", "20"],
                          correct: 2,
                          explanation: "A Moore machine outputs the start state's label before reading any input, giving length 10 + 1 = 11.",
                        },
                      ];
                  const q = questions[quizIndex] || questions[0];

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-medium text-slate-500">
                          Question {quizIndex + 1} of {questions.length}
                        </span>
                        <span className="tag font-semibold">
                          Live DPP Test
                        </span>
                      </div>

                      <h4 className="font-semibold text-sm text-slate-900 leading-snug">{q.q}</h4>

                      <div className="space-y-2">
                        {q.options.map((opt, oi) => {
                          let bg = "white";
                          let color = "#1e293b";
                          let border = "#e2e8f0";

                          if (isQuizAnswered) {
                            if (oi === q.correct) {
                              bg = "#dcfce7";
                              color = "#15803d";
                              border = "#86efac";
                            } else if (oi === selectedQuizOption) {
                              bg = "#fee2e2";
                              color = "#b91c1c";
                              border = "#fca5a5";
                            }
                          }
                          return (
                            <button
                              key={oi}
                              onClick={() => handleQuizAnswer(oi)}
                              className="w-full text-left p-3 rounded-xl text-xs font-medium border transition cursor-pointer shadow-2xs"
                              style={{ background: bg, color, borderColor: border }}
                            >
                              <span className="font-semibold mr-2 text-slate-400">
                                {String.fromCharCode(65 + oi)}.
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {isQuizAnswered && (
                        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1 font-normal">
                          <div className="font-semibold text-blue-700">
                            {selectedQuizOption === q.correct ? "OK Correct Answer!" : "x Incorrect"}
                          </div>
                          <div>{q.explanation}</div>
                        </div>
                      )}

                      {isQuizAnswered && (
                        <button
                          onClick={handleQuizNext}
                          className="w-full btn-primary btn-sm py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          {quizIndex < questions.length - 1 ? "Next Question →" : "Submit DPP Test "}
                        </button>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="text-4xl"></div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {quizScore} / {currentLesson.quizQuestions?.length || 1} Score
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">
                    Your DPP performance has been verified and registered in your student profile.
                  </p>
                  <button
                    onClick={() => {
                      setQuizIndex(0);
                      setSelectedQuizOption(null);
                      setIsQuizAnswered(false);
                      setQuizScore(0);
                      setQuizFinished(false);
                    }}
                    className="btn-primary btn-sm rounded-xl text-xs font-semibold cursor-pointer mt-2"
                  >
                    Retake Test ↻
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── SUB-TAB 6: AI DOUBTS ────────────────────────────────────────── */}
          {chapterTab === "AI Doubts" && (
            <div className="max-w-2xl mx-auto card p-5 shadow-2xs space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={doubtInput}
                  onChange={e => setDoubtInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handlePostDoubt(doubtInput)}
                  placeholder="Ask any conceptual question on this lecture..."
                  className="search-input flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 font-normal"
                />
                <button
                  onClick={() => handlePostDoubt(doubtInput)}
                  className="btn-primary btn-sm rounded-xl cursor-pointer"
                >
                  Ask Doubt
                </button>
              </div>

              <div className="space-y-2.5">
                {doubtLog.map(d => (
                  <div key={d.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 font-normal">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-blue-700 font-semibold">Q: {d.q}</span>
                      <span className="text-emerald-600 font-medium">● Polar AI Assistant</span>
                    </div>
                    <div className="text-xs text-slate-700 whitespace-pre-line bg-white p-2.5 rounded-lg border border-slate-100">
                      {d.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LEVEL 4: CINEMA LECTURE PLAYER VIEW ─────────────────────────── */}
      {viewLevel === "lecture_player" && (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 w-full space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewLevel("chapter_content")}
              className="btn-outline btn-sm rounded-xl text-blue-600 border-slate-200 hover:bg-blue-50/40 cursor-pointer"
            >
              <span>←</span> Back to Lectures
            </button>
            <span className="text-xs font-medium text-slate-500">
              {currentCourse.title} • {currentLesson.title}
            </span>
          </div>

          {/* 16:9 Cinema Player Stage */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col">
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={currentLesson.videoThumb}
                alt={currentLesson.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 bg-black/75 text-emerald-400 text-[10px] font-mono font-medium px-2.5 py-1 rounded-lg border border-emerald-500/30 backdrop-blur-xs">
                  <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isPlaying ? "animate-pulse" : ""}`} />
                  {isPlaying ? "LIVE LECTURE" : "PAUSED"}
                </span>
                <span className="bg-blue-600 text-white font-mono text-[10px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  Chapter {currentChapterIndex + 1}/{(currentLesson.chapters?.length || 1)}
                </span>
              </div>

              <div className="absolute bottom-12 left-4 right-4 text-white">
                <div className="text-xs font-medium text-blue-200">
                   {currentLesson.speaker} · {currentLesson.institution}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5 tracking-tight">
                  {currentLesson.title}
                </h2>
              </div>

              <div className="absolute bottom-2.5 left-4 right-4 bg-black/80 backdrop-blur-xs border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 flex items-center gap-2">
                <span className="text-blue-400 font-bold"></span>
                <span className="truncate flex-1 font-normal">{activeLectureChapter.transcriptSnippet}</span>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="bg-slate-900 px-4 py-2.5 border-t border-slate-800 space-y-1.5">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{
                    width: `${(((currentChapterIndex + 1) / (currentLesson.chapters?.length || 1)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-white pt-1">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsPlaying(p => !p)}
                    className="btn-primary btn-sm rounded-lg text-xs font-semibold cursor-pointer font-mono"
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={() => setPlaybackSpeed(s => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1))}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700 cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {activeLectureChapter.time} / {currentLesson.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <button
                    onClick={() => setCurrentChapterIndex(c => Math.max(0, c - 1))}
                    disabled={currentChapterIndex === 0}
                    className="p-1 hover:text-white disabled:opacity-30 cursor-pointer font-mono font-bold"
                  >
                    Prev
                  </button>
                  <span className="font-medium text-slate-200 hidden sm:inline">
                    {activeLectureChapter.title}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentChapterIndex(c =>
                        Math.min((currentLesson.chapters?.length || 1) - 1, c + 1)
                      )
                    }
                    disabled={currentChapterIndex >= (currentLesson.chapters?.length || 1) - 1}
                    className="p-1 hover:text-white disabled:opacity-30 cursor-pointer font-mono font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BATCH SELECTOR MODAL (Add Batches Switcher) ─────────────────── */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="card max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">Explore & Add Batches</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  Select any live Polar Science or Expedition batch to open
                </p>
              </div>
              <button
                onClick={() => setBatchModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition cursor-pointer"
              >
                x
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {lmsCourses.map(course => {
                const isCurrent = course.id === selectedCourseId;
                return (
                  <div
                    key={course.id}
                    onClick={() => handleSelectCourse(course.id)}
                    className={`card p-4 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isCurrent
                        ? "border-blue-600 bg-blue-50/40 shadow-xs"
                        : "hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                        <img
                          src={course.bannerImage || course.lessons?.[0]?.videoThumb}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 truncate">
                            {course.title}
                          </h4>
                          {isCurrent && (
                            <span className="tag font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate font-normal">
                           {course.faculty}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-normal">
                          <span>{course.totalLectures} Lectures</span>
                          <span>•</span>
                          <span>{course.badge}</span>
                        </div>
                      </div>
                    </div>

                    <button className="btn-primary btn-sm rounded-lg text-xs font-semibold flex-shrink-0 cursor-pointer">
                      {isCurrent ? "Viewing" : "Open Batch →"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TELEGRAM COMMUNITY MODAL ────────────────────────────────────── */}
      {telegramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="card max-w-md w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#229ED9]/10 text-[#229ED9] mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-[#229ED9]" viewBox="0 0 24 24">
                <path d="M9.036 15.675l-.396 5.59c.567 0 .813-.244 1.108-.537l2.66-2.54 5.514 4.036c1.011.558 1.726.265 1.988-.937l3.607-16.92.001-.001c.311-1.453-.525-2.02-1.508-1.648L1.14 9.403c-1.412.549-1.392 1.326-.24 1.682l5.906 1.844L19.84 5.9c.613-.39 1.17-.174.71.216"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Join Official Telegram Channel
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
                Access PDF class notes, daily practice sheets, lecture alerts, and peer doubt discussions with faculty.
              </p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
              https://t.me/PolarLMS_NCPOR2026
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText("https://t.me/PolarLMS_NCPOR2026");
                  showToast("Copied Telegram Link");
                }}
                className="btn-outline btn-sm flex-1 rounded-xl cursor-pointer"
              >
                Copy Link
              </button>
              <button
                onClick={() => {
                  window.open("https://telegram.me", "_blank");
                  setTelegramModalOpen(false);
                }}
                className="btn-primary btn-sm flex-1 rounded-xl cursor-pointer"
              >
                Open Telegram →
              </button>
            </div>
            <button
              onClick={() => setTelegramModalOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-normal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── WHATSAPP COMMUNITY MODAL ────────────────────────────────────── */}
      {whatsappModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="card max-w-md w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.584-5.766-5.768-5.766zm3.385 8.212c-.144.405-.837.774-1.17.824-.312.045-.694.062-1.121-.073-.263-.083-.6-.195-1.033-.385-1.832-.803-3.029-2.658-3.12-2.781-.092-.122-.741-.986-.741-1.882 0-.896.469-1.336.636-1.519.167-.183.365-.229.487-.229.122 0 .244.002.35.006.113.004.264-.043.413.315.153.366.523 1.275.569 1.367.046.092.076.2.015.321-.061.122-.092.198-.183.305-.091.107-.193.24-.275.322-.092.092-.188.192-.081.376.107.183.475.783 1.021 1.269.704.627 1.297.82 1.48.912.183.091.29.076.397-.046.107-.122.457-.534.579-.717.122-.183.244-.153.412-.092.167.062 1.066.503 1.25.594.183.092.305.137.35.214.045.076.045.442-.099.847z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Join Official WhatsApp Community
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
                Receive instant notifications on newly uploaded lectures, test schedules, and exam updates directly on your phone.
              </p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
              https://chat.whatsapp.com/PolarScienceNCPOR2026
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText("https://chat.whatsapp.com/PolarScienceNCPOR2026");
                  showToast("Copied WhatsApp Link");
                }}
                className="btn-outline btn-sm flex-1 rounded-xl cursor-pointer"
              >
                Copy Link
              </button>
              <button
                onClick={() => {
                  window.open("https://whatsapp.com", "_blank");
                  setWhatsappModalOpen(false);
                }}
                className="btn-primary btn-sm flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              >
                Open WhatsApp →
              </button>
            </div>
            <button
              onClick={() => setWhatsappModalOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-normal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 text-center py-5 px-4 mt-auto">
        <p className="text-slate-400 text-xs font-normal">
          © 2024-2026 Polar Knowledge Portal • National Centre for Polar and Ocean Research (NCPOR). All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
