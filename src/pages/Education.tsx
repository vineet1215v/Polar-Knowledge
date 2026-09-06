import { useState } from "react";
import { educationCards } from "../data";
import { learningModules, quizQuestions } from "../knowledgeData";

type Tab = "students" | "teachers" | "modules";
type LearningModule = typeof learningModules[0];

const learningPath = [
  { id: "lm1", done: true  },
  { id: "lm3", done: true  },
  { id: "lm4", done: false },
  { id: "lm2", done: false },
  { id: "lm6", done: false },
];

function QuizModal({ moduleId, onClose }: { moduleId: string; onClose: () => void }) {
  const questions = quizQuestions[moduleId] || [];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
        <div className="card p-6 max-w-sm mx-4 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-2xl mb-2">📝</div>
          <div className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Quiz Coming Soon</div>
          <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>This quiz is being prepared from NCPOR source materials.</p>
          <button className="btn-primary btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const q = questions[idx];

  function answer(optIdx: number) {
    if (answered) return;
    setSelected(optIdx);
    setAnswered(true);
    if (optIdx === q.correct) setScore(s => s + 1);
  }

  function next() {
    if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); setAnswered(false); }
    else setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="card w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        {!done ? (
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Question {idx + 1} of {questions.length}</span>
              <div className="flex gap-1">{questions.map((_, i) => <div key={i} className="w-4 h-1 rounded" style={{ background: i < idx ? "var(--accent)" : i === idx ? "#93c5fd" : "var(--border)" }}/>)}</div>
              <button onClick={onClose} className="text-slate-400">✕</button>
            </div>
            <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>{q.q}</h3>
            <div className="space-y-2 mb-4">
              {q.options.map((opt, oi) => {
                let bg = "var(--border)"; let color = "var(--text-primary)";
                if (answered) { if (oi === q.correct) { bg = "#bbf7d0"; color = "#166534"; } else if (oi === selected) { bg = "#fecaca"; color = "#991b1b"; } }
                return (
                  <button key={oi} onClick={() => answer(oi)} className="w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all border" style={{ borderColor: bg === "var(--border)" ? "var(--border)" : bg, background: answered ? bg : "white", color }}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="rounded-lg p-3 text-xs mb-3" style={{ background: "#f0f7ff", color: "var(--text-primary)" }}>
                <div className="font-semibold mb-0.5">{selected === q.correct ? "✓ Correct!" : "✗ Incorrect"}</div>
                {q.explanation}
              </div>
            )}
            {answered && <button className="btn-primary btn-sm w-full" onClick={next}>{idx < questions.length - 1 ? "Next Question →" : "See Results"}</button>}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-4xl mb-2">{score === questions.length ? "🏆" : score >= questions.length / 2 ? "⭐" : "📚"}</div>
            <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>{score}/{questions.length}</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{score === questions.length ? "Perfect score! Great work." : score >= questions.length / 2 ? "Good effort. Review the explanations to improve." : "Keep learning! Try the module again."}</p>
            <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Quiz based on: NCPOR indexed publications (approved sources)</div>
            <div className="flex gap-2 justify-center">
              <button className="btn-primary btn-sm" onClick={onClose}>Continue Learning →</button>
              <button className="btn-outline btn-sm" onClick={() => { setIdx(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); }}>Retry</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Education({ onNavigate, onOpenStudio }: { onNavigate?: (p: string) => void; onOpenStudio?: () => void }) {
  const [tab, setTab] = useState<Tab>("students");
  const [quizModule, setQuizModule] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiInput, setAiInput] = useState("");

  const completedIds = new Set(learningPath.filter(p => p.done).map(p => p.id));
  const nextModule = learningPath.find(p => !p.done);

  function askStudentAI(q: string) {
    const answers: Record<string, string> = {
      "What is sea ice?": "Sea ice is ocean water that has frozen solid! Think of it like a giant ice cube floating in the sea. It grows bigger in winter and shrinks in summer. It's super important because it reflects sunlight back into space — like a mirror for Earth. Without it, the ocean absorbs more heat and the planet gets warmer. 🧊",
    };
    setAiAnswer(answers[q] || `Great question! Sea ice, Antarctic stations and polar research are fascinating topics. Here is a simplified explanation based on NCPOR's published research... [Full answer available in the Polar Knowledge AI section]`);
    setAiInput(q);
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--content-bg)" }}>
      <div className="p-6">
        <div className="mb-5">
          <h1 className="page-header-title">Learn About Polar Regions</h1>
          <p className="page-header-sub">Interactive learning resources for students, teachers and the public.</p>
        </div>

        <div className="tab-bar w-fit mb-5">
          {([["students","For Students"],["teachers","For Teachers"],["modules","Interactive Modules"]] as const).map(([id, label]) => (
            <button key={id} className={`tab-item ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === "students" && (
          <>
            {/* Personalized Learning Path */}
            <div className="card p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Your Learning Path</h3>
                  <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Personalized based on your progress · {completedIds.size} of {learningPath.length} completed</p>
                </div>
                <div className="text-xs font-semibold" style={{ color: "var(--accent)" }}>{Math.round(completedIds.size / learningPath.length * 100)}% complete</div>
              </div>
              <div className="w-full h-1.5 rounded-full mb-3" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full" style={{ width: `${completedIds.size / learningPath.length * 100}%`, background: "var(--accent)" }}/>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {learningPath.map((lp, i) => {
                  const mod = learningModules.find(m => m.id === lp.id)!;
                  const isCurrent = nextModule?.id === lp.id;
                  return (
                    <div key={lp.id} className={`flex-shrink-0 rounded-lg p-3 border w-36 ${lp.done ? "opacity-70" : isCurrent ? "" : "opacity-50"}`} style={{ borderColor: isCurrent ? "var(--accent)" : "var(--border)", background: lp.done ? "#f0fdf4" : isCurrent ? "var(--accent-light)" : "white" }}>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm">{lp.done ? "✅" : isCurrent ? "▶" : "○"}</span>
                        <span className="text-[9px] font-semibold uppercase" style={{ color: lp.done ? "#16a34a" : isCurrent ? "var(--accent)" : "var(--text-muted)" }}>{lp.done ? "Done" : isCurrent ? "Next" : "Locked"}</span>
                      </div>
                      <div className="text-[11px] font-medium leading-tight mb-1" style={{ color: "var(--text-primary)" }}>{mod?.title}</div>
                      <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{mod?.duration} · {mod?.questions} Qs</div>
                      {isCurrent && <button className="btn-primary btn-sm w-full mt-1.5" onClick={() => setQuizModule(mod?.id || null)}>Start →</button>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {educationCards.map(card => (
                <div key={card.id} className="card overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="relative" style={{ height: 130 }}>
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    <div className="absolute top-2 right-2"><span className="tag">{card.level}</span></div>
                  </div>
                  <div className="p-3">
                    <div className="text-xl mb-1">{card.icon}</div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{card.title}</h3>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>{card.description}</p>
                    <div className="flex gap-1.5">
                      <button className="btn-primary btn-sm flex-1">Explore →</button>
                      <button className="btn-outline btn-sm" onClick={() => setQuizModule("lm1")}>Quiz</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ask Polar for Students */}
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Ask Polar — Student Mode</h3>
              <p className="text-[11px] mb-3" style={{ color: "var(--text-secondary)" }}>Get simple, clear answers based on NCPOR's approved research. Scientific facts are preserved — just explained simply.</p>
              {aiAnswer && (
                <div className="rounded-lg p-3 text-xs leading-relaxed mb-3" style={{ background: "#f0f7ff", color: "var(--text-primary)" }}>
                  <div className="text-[10px] font-semibold text-blue-600 mb-1">Polar Assistant (Student Mode · Education Agent)</div>
                  {aiAnswer}
                  <div className="mt-2 text-[9px]" style={{ color: "var(--text-muted)" }}>Source-grounded · Simplified for student understanding · Not altered scientifically</div>
                </div>
              )}
              <div className="flex gap-2 mb-2">
                <input className="search-input flex-1" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && askStudentAI(aiInput)} placeholder="What is sea ice?"/>
                <button className="btn-primary px-3" onClick={() => askStudentAI(aiInput || "What is sea ice?")}>Ask</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["What is sea ice?","Why is Antarctica cold?","What do polar scientists do?","What animals live in Antarctica?"].map(q => (
                  <button key={q} onClick={() => askStudentAI(q)} className="text-[10px] px-2 py-1 rounded border hover:bg-blue-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>{q}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "teachers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Polar Science Curriculum Guide", desc: "Comprehensive lesson plans aligned with NCERT for grades 6–12. All content sourced from approved NCPOR publications.", icon: "📚", action: "Download Guide", source: "Based on 6 NCPOR publications" },
              { title: "Classroom Activities Pack", desc: "50+ hands-on activities: ice core simulation, sea ice mapping, biodiversity surveys.", icon: "🧪", action: "Get Activities", source: "Reviewed by NCPOR educators" },
              { title: "Expert Video Lectures", desc: "Lectures by NCPOR scientists. Topics: glaciology, oceanography, polar biology. With subtitles and teacher notes.", icon: "🎥", action: "Watch Now", source: "NCPOR Science Division" },
              { title: "Assessment Toolkit", desc: "Quizzes, worksheets and evaluation rubrics linked to curriculum modules. Adaptive difficulty.", icon: "📝", action: "Access Toolkit", source: "Aligned with NCERT standards" },
            ].map((r, i) => (
              <div key={i} className="card p-5 flex gap-4">
                <div className="text-3xl">{r.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{r.title}</h3>
                  <p className="text-xs leading-relaxed mb-1" style={{ color: "var(--text-secondary)" }}>{r.desc}</p>
                  <div className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>Source: {r.source}</div>
                  <button className="btn-primary btn-sm">{r.action}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "modules" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningModules.map(mod => {
              const isDone = completedIds.has(mod.id);
              const isNext = nextModule?.id === mod.id;
              return (
                <div key={mod.id} className="card overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="tag mb-1 inline-block">{mod.topic}</span>
                        <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{mod.title}</h3>
                      </div>
                      <span className={`tag flex-shrink-0 ml-2 ${isDone ? "tag-green" : isNext ? "" : "tag-orange"}`}>
                        {isDone ? "✓ Done" : isNext ? "Next" : mod.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] mb-3" style={{ color: "var(--text-muted)" }}>
                      <span>⏱ {mod.duration}</span>
                      <span>📝 {mod.questions} questions</span>
                      <span>⭐ {mod.xp} XP</span>
                    </div>
                    <div className="text-[10px] mb-3" style={{ color: "var(--text-muted)" }}>
                      Sources: {mod.sourceIds.length} NCPOR publication{mod.sourceIds.length > 1 ? "s" : ""}
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-primary btn-sm flex-1">{isDone ? "Review" : "Start →"}</button>
                      <button className="btn-outline btn-sm" onClick={() => setQuizModule(mod.id)}>Quiz</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {quizModule && <QuizModal moduleId={quizModule} onClose={() => setQuizModule(null)}/>}
    </div>
  );
}
