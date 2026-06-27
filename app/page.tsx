"use client";

import { useState, useRef, useEffect } from "react";
import { Send, BookOpen, CheckCircle, BarChart2, Volume2, Mic, MicOff } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }
interface Session { correct: number; incorrect: number; current_topic: string; mastery: number; lesson_complete: boolean; }

const COLORS = { bg: "#080d1a", surface: "#0d1526", card: "#111d35", border: "#1a2d50", accent: "#059669", accentLight: "#10b981", accentDim: "#064e3b", text: "#f1f5f9", muted: "#64748b", danger: "#ef4444", warning: "#f59e0b", navy: "#0a1628" };

function lsSet(key: string, value: string) {
  if (typeof window !== "undefined") localStorage.setItem(key, value);
}
function lsGet(key: string): string | null {
  if (typeof window !== "undefined") return localStorage.getItem(key);
  return null;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hallo! I am your German tutor. I will take you from A1 all the way to C1 - the level you need for nursing Ausbildung in Germany.\n\nLet us begin with Lesson 1: Greetings and Introductions.\n\nAre you ready to start?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [expectedText, setExpectedText] = useState("");
  const [session, setSession] = useState<Session>({ correct: 0, incorrect: 0, current_topic: "Greetings", mastery: 0, lesson_complete: false });
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [curriculumIndex, setCurriculumIndex] = useState<any[]>([]);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/lesson").then(r => r.json()).then(d => setCurriculumIndex(d.index ?? []));
    const savedLessonId = lsGet("dt_lesson_id") || "A1-L01"
    const savedMessages = lsGet("dt_messages")
    const savedSession = lsGet("dt_session")
    if (savedMessages) { try { setMessages(JSON.parse(savedMessages)); } catch {} }
    if (savedSession) { try { setSession(JSON.parse(savedSession)); } catch {} }
    fetch("/api/lesson?id=" + savedLessonId).then(r => r.json()).then(d => {
      if (d.lesson) setCurrentLesson(d.lesson);
    });
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function loadLesson(id: string) {
    const res = await fetch("/api/lesson?id=" + id);
    const data = await res.json();
    if (data.lesson) {
      const newSession = { correct: 0, incorrect: 0, current_topic: data.lesson.title, mastery: 0, lesson_complete: false };
      const newMessages = [{ role: "assistant" as const, content: "New lesson: " + data.lesson.title + "\n\nAre you ready to begin?" }];
      setCurrentLesson(data.lesson);
      setSession(newSession);
      setMessages(newMessages);
      setShowCurriculum(false);
      lsSet("dt_lesson_id", data.lesson.id);
lsSet("dt_messages", JSON.stringify(newMessages));
lsSet("dt_session", JSON.stringify(newSession));
    }
  }

  function mergeSession(current: Session, update: any): Session {
    return {
      correct: update.correct ?? current.correct,
      incorrect: update.incorrect ?? current.incorrect,
      current_topic: update.current_topic ?? current.current_topic,
      mastery: update.mastery ?? current.mastery,
      lesson_complete: update.lesson_complete ?? current.lesson_complete,
    };
  }

  async function sendMessage(text?: string) {
    const userMessage = text ?? input.trim();
    if (!userMessage || loading) return;
    setInput("");
    setLoading(true);
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, conversationHistory: messages.map(m => ({ role: m.role, content: m.content })), lesson: currentLesson, session })
      });
      const data = await res.json();
      const updatedSession = mergeSession(session, data.sessionUpdate ?? {});
      const updatedMessages = [...newMessages, { role: "assistant", content: data.response ?? "" }];
      setSession(updatedSession);
      setMessages(updatedMessages);
      lsSet("dt_messages", JSON.stringify(updatedMessages));
lsSet("dt_session", JSON.stringify(updatedSession));

    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  }

  async function startSpeaking(expected: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      setListening(true);
      setExpectedText(expected);
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setListening(false);
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "audio.webm", { type: "audio/webm" });
        const form = new FormData();
        form.append("audio", file);
        form.append("expected", expected);
        try {
          const res = await fetch("/api/pronounce", { method: "POST", body: form });
          const data = await res.json();
          if (data.error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Could not process audio. Please try again." }]);
          } else {
            setMessages(prev => [...prev, { role: "assistant", content: data.feedback }]);
            if (data.score > 0) {
              await sendMessage(`[SPOKEN] ${data.spoken}`);
            }
            setTimeout(() => {
              const u = new SpeechSynthesisUtterance(expected);
              u.lang = "de-DE";
              u.rate = 1.1;
              window.speechSynthesis.speak(u);
            }, 500);
          }
        } catch {
          setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
        }
      };
      setTimeout(() => { recorder.start(); setTimeout(() => recorder.stop(), 4000); }, 1000);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Could not access microphone. Please check your browser permissions." }]);
    }
  }

  const masteryColor = session.mastery >= 80 ? COLORS.accentLight : session.mastery >= 50 ? COLORS.warning : COLORS.danger;
  const circumference = 2 * Math.PI * 40;
  const total = session.correct + session.incorrect;
  const accuracy = total > 0 ? Math.round((session.correct / total) * 100) : 0;
  const lesson = currentLesson;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: COLORS.navy, borderBottom: "1px solid " + COLORS.border, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><BookOpen size={18} color="white" /></div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>Deutsch <span style={{ color: COLORS.accentLight }}>Tutor</span></div>
            <div style={{ fontSize: "10px", color: COLORS.muted }}>A1 to C1 - Nursing Ausbildung Prep</div>
          </div>
        </div>
        <div onClick={() => setShowCurriculum(true)} style={{ display: "flex", alignItems: "center", gap: "8px", background: COLORS.accentDim, border: "1px solid " + COLORS.accent, borderRadius: "20px", padding: "7px 14px", cursor: "pointer" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS.accentLight }} />
          <span style={{ fontSize: "12px", color: COLORS.accentLight, fontWeight: 600 }}>{lesson ? lesson.id + " - " + lesson.level : "Loading..."} - tap to change</span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        <div style={{ width: "40%", display: "flex", flexDirection: "column", borderRight: "1px solid " + COLORS.border }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid " + COLORS.border, background: COLORS.surface }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.accentLight, display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle size={14} />Chat with your tutor</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start" }}>
                {m.role === "assistant" && <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}><BookOpen size={14} color="white" /></div>}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "80%" }}>
                  <div style={{ padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? COLORS.accent : COLORS.card, color: m.role === "user" ? "white" : COLORS.text, fontSize: "13px", lineHeight: 1.6, border: m.role === "assistant" ? "1px solid " + COLORS.border : "none", whiteSpace: "pre-wrap" }}>
                    {(m.content ?? "").split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        const word = part.slice(2, -2);
                        return <strong key={j} onClick={() => {
  if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "de-DE"; u.rate = 1.1;
  u.onend = () => setSpeaking(false);
  setSpeaking(true);
  window.speechSynthesis.speak(u);
}} style={{ color: COLORS.accentLight, cursor: "pointer", textDecoration: "underline dotted" }}>{word}</strong>;
                      }
                      return part;
                    })}
                  </div>
                  {m.role === "assistant" && (
                    <button onClick={() => {
  if (speaking) {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  } else {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(m.content.replace(/\*\*/g, ""));
    u.lang = "de-DE";
    u.rate = 1.1;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }
}} style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", color: COLORS.muted, display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", padding: "2px 4px" }}>
                      <Volume2 size={11} /> {speaking ? "stop" : "speak"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BookOpen size={14} color="white" /></div>
                <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: COLORS.card, border: "1px solid " + COLORS.border, fontSize: "13px", color: COLORS.muted }}>Thinking...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid " + COLORS.border, background: COLORS.surface, display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => {
                const fallback = [...messages].reverse().find(m => m.role === "assistant")?.content ?? "";
                startSpeaking(expectedText || fallback);
              }}
              disabled={listening}
              style={{ width: "36px", height: "36px", borderRadius: "50%", background: listening ? COLORS.danger : COLORS.card, border: "1px solid " + (listening ? COLORS.danger : COLORS.border), display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
            >
              {listening ? <MicOff size={16} color="white" /> : <Mic size={16} color={COLORS.accentLight} />}
            </button>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={listening ? "Listening... speak now" : "Type your answer or use the mic..."} style={{ flex: 1, background: COLORS.card, border: "1px solid " + (listening ? COLORS.danger : COLORS.border), borderRadius: "10px", padding: "10px 14px", color: COLORS.text, fontSize: "13px", outline: "none" }} />
            <button onClick={() => sendMessage()} disabled={loading} style={{ width: "36px", height: "36px", borderRadius: "50%", background: COLORS.accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Send size={15} color="white" /></button>
          </div>
          <div style={{ textAlign: "center", fontSize: "10px", color: COLORS.muted, padding: "6px", background: COLORS.surface }}>Deutsch Tutor - A1 to C1</div>
        </div>

        <div style={{ width: "30%", display: "flex", flexDirection: "column", borderRight: "1px solid " + COLORS.border }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid " + COLORS.border, background: COLORS.surface }}>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>{lesson ? lesson.title : "Loading lesson..."}</div>
            <div style={{ fontSize: "11px", color: COLORS.muted, marginTop: "2px" }}>Level {lesson ? lesson.level : "A1"} - Goethe-aligned</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {lesson && (
              <>
                <div style={{ background: COLORS.card, borderRadius: "10px", padding: "12px", border: "1px solid " + COLORS.border }}>
                  <div style={{ fontSize: "11px", color: COLORS.accentLight, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Objectives</div>
                  {lesson.objectives.map((obj: string, i: number) => (
                    <div key={i} style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "4px" }}>
                      <span style={{ color: COLORS.accentLight, fontSize: "11px", marginTop: "2px" }}>+</span>
                      <span style={{ fontSize: "12px", color: COLORS.text, lineHeight: 1.5 }}>{obj}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: COLORS.card, borderRadius: "10px", padding: "12px", border: "1px solid " + COLORS.border }}>
                  <div style={{ fontSize: "11px", color: COLORS.accentLight, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Grammar</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>{lesson.grammar.topic}</div>
                  {Object.entries(lesson.grammar.forms).map(([german, english], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < Object.entries(lesson.grammar.forms).length - 1 ? "1px solid " + COLORS.border : "none" }}>
                      <span style={{ fontSize: "12px", color: COLORS.accentLight, fontWeight: 600 }}>{german}</span>
                      <span style={{ fontSize: "12px", color: COLORS.muted }}>{String(english)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: COLORS.card, borderRadius: "10px", padding: "12px", border: "1px solid " + COLORS.border }}>
                  <div style={{ fontSize: "11px", color: COLORS.accentLight, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Vocabulary ({lesson.vocabulary.length} words)</div>
                  {lesson.vocabulary.map((v: any, i: number) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: i < lesson.vocabulary.length - 1 ? "1px solid " + COLORS.border : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button onClick={() => { const u = new SpeechSynthesisUtterance(v.word); u.lang = "de-DE"; u.rate = 1.1; window.speechSynthesis.speak(u); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.accentLight, display: "flex", alignItems: "center", padding: "2px" }}><Volume2 size={12} /></button>
                        <button onClick={() => { window.speechSynthesis.cancel(); setTimeout(() => startSpeaking(v.word), 300); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, display: "flex", alignItems: "center", padding: "2px" }}><Mic size={12} /></button>
                        <span style={{ fontSize: "12px", color: COLORS.text, fontWeight: 500 }}>{v.word}</span>
                      </div>
                      <span style={{ fontSize: "12px", color: COLORS.muted }}>{v.translation}</span>
                    </div>
                  ))}
                </div>
                {lesson.nursing_note && (
                  <div style={{ background: COLORS.accentDim, borderRadius: "10px", padding: "12px", border: "1px solid " + COLORS.accent }}>
                    <div style={{ fontSize: "11px", color: COLORS.accentLight, fontWeight: 600, marginBottom: "4px" }}>Nursing Note</div>
                    <div style={{ fontSize: "11px", color: COLORS.text, lineHeight: 1.5 }}>{lesson.nursing_note}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ width: "30%", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid " + COLORS.border, background: COLORS.surface }}>
            <div style={{ fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}><BarChart2 size={14} color={COLORS.accentLight} />Session Progress</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: COLORS.card, borderRadius: "12px", padding: "16px", border: "1px solid " + COLORS.border, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: COLORS.muted }}>Mastery Score</div>
              <div style={{ position: "relative", width: "100px", height: "100px" }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke={COLORS.border} strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={masteryColor} strokeWidth="10" strokeDasharray={String(circumference)} strokeDashoffset={String(circumference * (1 - session.mastery / 100))} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: masteryColor }}>{session.mastery}</div>
                  <div style={{ fontSize: "9px", color: COLORS.muted }}>/ 100</div>
                </div>
              </div>
              <div style={{ fontSize: "11px", color: COLORS.muted, textAlign: "center" }}>{(session as any).stage ?? "INTRODUCTION"}</div>
              <div style={{ fontSize: "11px", color: session.mastery >= 80 ? COLORS.accentLight : COLORS.muted, textAlign: "center" }}>{session.mastery >= 80 ? "Pass mark reached (80%)" : session.mastery > 0 ? "Need " + (80 - session.mastery) + " more points to pass" : "Complete the lesson to see your score"}</div>
            </div>
            <div style={{ background: COLORS.card, borderRadius: "12px", padding: "14px", border: "1px solid " + COLORS.border }}>
              <div style={{ fontSize: "11px", color: COLORS.muted, fontWeight: 600, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>This Session</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "12px", color: COLORS.muted }}>Current topic</span><span style={{ fontSize: "12px", fontWeight: 600 }}>{session.current_topic}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "12px", color: COLORS.muted }}>Correct</span><span style={{ fontSize: "12px", fontWeight: 600, color: COLORS.accentLight }}>{session.correct}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "12px", color: COLORS.muted }}>Incorrect</span><span style={{ fontSize: "12px", fontWeight: 600, color: session.incorrect > 0 ? COLORS.danger : COLORS.muted }}>{session.incorrect}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "12px", color: COLORS.muted }}>Accuracy</span><span style={{ fontSize: "12px", fontWeight: 600, color: accuracy >= 80 ? COLORS.accentLight : COLORS.warning }}>{total > 0 ? accuracy + "%" : "-"}</span></div>
              </div>
            </div>
            <div style={{ background: COLORS.card, borderRadius: "12px", padding: "14px", border: "1px solid " + COLORS.border }}>
              <div style={{ fontSize: "11px", color: COLORS.muted, fontWeight: 600, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Journey</div>
              {["A1","A2","B1","B2","C1"].map((level, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: lesson && lesson.level === level ? COLORS.accent : COLORS.surface, border: "1px solid " + (lesson && lesson.level === level ? COLORS.accent : COLORS.border), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: lesson && lesson.level === level ? "white" : COLORS.muted, flexShrink: 0 }}>{level}</div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: lesson && lesson.level === level ? COLORS.text : COLORS.muted }}>
                    {level === "A1" && "Beginner - In progress"}
                    {level === "A2" && "Elementary"}
                    {level === "B1" && "Intermediate - Visa minimum"}
                    {level === "B2" && "Upper Intermediate - Ausbildung"}
                    {level === "C1" && "Advanced - Target level"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {showCurriculum && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: COLORS.card, borderRadius: "16px", border: "1px solid " + COLORS.border, width: "100%", maxWidth: "500px", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid " + COLORS.border, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: 700 }}>A1 Curriculum - 18 Lessons</div>
              <button onClick={() => setShowCurriculum(false)} style={{ background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: "8px", padding: "6px 12px", color: COLORS.text, fontSize: "12px", cursor: "pointer" }}>Close</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
              {curriculumIndex.map((l, i) => (
                <div key={i} onClick={() => loadLesson(l.id)} style={{ padding: "10px 14px", marginBottom: "6px", background: lesson && lesson.id === l.id ? COLORS.accentDim : COLORS.surface, border: "1px solid " + (lesson && lesson.id === l.id ? COLORS.accent : COLORS.border), borderRadius: "10px", cursor: "pointer" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: lesson && lesson.id === l.id ? COLORS.accentLight : COLORS.text }}>{l.id} - {l.title}</div>
                  <div style={{ fontSize: "11px", color: COLORS.muted, marginTop: "2px" }}>{l.grammar_topic}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
