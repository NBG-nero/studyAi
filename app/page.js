"use client";
import { useState, useRef } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  body: { minHeight:"100vh", fontFamily:"var(--font)", color:"#e2f0ea" },
  header: { background:"rgba(6,14,26,0.85)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
  logo: { fontSize:17, fontWeight:800, color:"var(--green)" },
  backBtn: { background:"rgba(52,211,153,0.08)", border:"1px solid var(--border)", color:"var(--green)", padding:"7px 14px", borderRadius:8, fontSize:13 },
  main: { flex:1, padding:20, maxWidth:780, margin:"0 auto", width:"100%" },
  // upload
  hero: { textAlign:"center", padding:"40px 0 28px" },
  h1: { fontSize:"clamp(22px,6vw,34px)", fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:10 },
  heroSub: { color:"var(--green3)", fontSize:14, lineHeight:1.7, maxWidth:400, margin:"0 auto" },
  uploadZone: (drag) => ({ border:`2px dashed ${drag?"var(--green)":"var(--border)"}`, borderRadius:20, padding:"40px 24px", textAlign:"center", cursor:"pointer", background: drag?"rgba(52,211,153,0.06)":"var(--card)", margin:"20px 0", position:"relative", transition:"all .3s" }),
  uploadIcon: { fontSize:44, marginBottom:12 },
  uploadH: { color:"#fff", fontSize:16, marginBottom:6 },
  uploadP: { color:"var(--green3)", fontSize:12 },
  fileChip: { display:"flex", alignItems:"center", gap:10, background:"rgba(52,211,153,0.08)", border:"1px solid var(--border)", borderRadius:12, padding:"12px 16px", marginBottom:8 },
  fname: { flex:1, color:"#fff", fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  textarea: { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)", borderRadius:12, color:"#fff", padding:"14px 16px", fontSize:14, resize:"vertical", outline:"none", marginBottom:12, minHeight:90 },
  input: { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)", borderRadius:12, color:"#fff", padding:"14px 16px", fontSize:14, outline:"none", marginBottom:12 },
  genBtn: (dis) => ({ width:"100%", background: dis?"rgba(52,211,153,0.3)":"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", padding:16, borderRadius:14, fontSize:16, fontWeight:700, marginTop:8, opacity: dis?0.6:1, cursor: dis?"not-allowed":"pointer" }),
  hint: { textAlign:"center", marginTop:14, color:"rgba(110,231,183,0.35)", fontSize:11 },
  // loading
  loadWrap: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24, padding:40 },
  spinner: { width:56, height:56, border:"3px solid rgba(52,211,153,0.15)", borderTopColor:"var(--green)", borderRadius:"50%", animation:"spin 1s linear infinite" },
  loadStep: { color:"var(--green)", fontSize:18, fontWeight:700, textAlign:"center" },
  loadText: { color:"var(--green3)", fontSize:14, textAlign:"center" },
  // home
  subjBadge: { textAlign:"center", marginBottom:24 },
  subjName: { fontSize:22, fontWeight:800, color:"#fff", marginBottom:4 },
  subjSub: { color:"var(--green3)", fontSize:13 },
  qaGrid: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:24 },
  qaBtn: (bg) => ({ border:"none", borderRadius:12, padding:"14px 10px", background:bg, color:"#fff", display:"flex", flexDirection:"column", alignItems:"center", gap:5, fontSize:12, fontWeight:700 }),
  qaIcon: { fontSize:22 },
  sectionTitle: { color:"var(--green)", fontSize:14, fontWeight:700, marginBottom:12 },
  topicGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10, marginBottom:24 },
  topicCard: { background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:16, cursor:"pointer", transition:"all .2s" },
  topicIcon: { fontSize:24, marginBottom:6 },
  topicTitle: { fontSize:13, fontWeight:700, color:"var(--green)", marginBottom:3, lineHeight:1.3 },
  topicCount: { fontSize:11, color:"var(--green3)" },
  topicBtns: { display:"flex", gap:6, marginTop:10 },
  tBtn: (c,b) => ({ flex:1, padding:7, borderRadius:7, border:`1px solid ${b}`, background:`rgba(${c},0.08)`, color:b, fontSize:11, fontWeight:600 }),
  tipsBox: { background:"rgba(0,0,0,0.2)", border:"1px solid var(--border)", borderRadius:14, padding:16, marginTop:4 },
  tipsH: { color:"var(--green)", fontSize:13, fontWeight:700, marginBottom:10 },
  tipsP: { color:"var(--green3)", fontSize:12, lineHeight:1.9 },
  newDocBtn: { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px dashed var(--border)", color:"var(--green3)", padding:13, borderRadius:12, fontSize:13, marginTop:10, transition:"all .2s" },
  // flashcard
  flashTopicH: { textAlign:"center", marginBottom:20 },
  flashIcon: { fontSize:28 },
  flashTitle: { fontSize:18, fontWeight:800, color:"var(--green)" },
  flashcard: (flipped) => ({ width:"100%", minHeight:200, background: flipped?"rgba(52,211,153,0.07)":"var(--card)", border:`1px solid ${flipped?"var(--green)":"var(--border)"}`, borderRadius:20, padding:"28px 24px", cursor:"pointer", textAlign:"center", transition:"all .3s", userSelect:"none", WebkitUserSelect:"none" }),
  flashLabel: { fontSize:10, color:"var(--green3)", letterSpacing:2, marginBottom:14, fontFamily:"var(--mono)" },
  flashQ: { fontSize:16, lineHeight:1.7, color:"#fff" },
  flashA: { fontSize:14, lineHeight:1.8, color:"var(--green3)", whiteSpace:"pre-line" },
  flashNav: { display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginTop:16 },
  navBtn: { background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.25)", color:"var(--green)", padding:"10px 18px", borderRadius:10, fontSize:13 },
  progressText: { color:"var(--green)", fontSize:13, fontWeight:600 },
  dotsRow: { display:"flex", gap:5, flexWrap:"wrap", justifyContent:"center", marginTop:14, maxWidth:320, marginLeft:"auto", marginRight:"auto" },
  dot: (active, past) => ({ width:9, height:9, borderRadius:"50%", cursor:"pointer", background: active?"var(--green)": past?"var(--green2)":"rgba(255,255,255,0.18)" }),
  // quiz
  quizMeta: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, fontSize:12, color:"var(--green3)" },
  quizCard: { background:"rgba(0,0,0,0.2)", border:"1px solid var(--border)", borderRadius:16, padding:22 },
  quizQ: { fontSize:16, lineHeight:1.65, color:"#fff", marginBottom:18 },
  quizTA: { width:"100%", minHeight:70, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(52,211,153,0.18)", borderRadius:10, color:"#fff", padding:12, fontSize:14, resize:"vertical", outline:"none" },
  revealBtn: { background:"rgba(251,191,36,0.08)", border:"1px solid var(--yellow)", color:"var(--yellow)", padding:"10px 18px", borderRadius:9, fontSize:13, marginTop:10, width:"100%" },
  answerBox: { background:"rgba(52,211,153,0.07)", border:"1px solid var(--green)", borderRadius:12, padding:16, marginTop:14, color:"var(--green3)", whiteSpace:"pre-line", fontSize:14, lineHeight:1.7 },
  verdictBtns: { display:"flex", gap:10, marginTop:14 },
  vBtn: (c) => ({ flex:1, padding:12, borderRadius:10, border:`1px solid ${c}`, background:`${c}22`, color:c, fontSize:13, fontWeight:700 }),
  // quiz done
  quizDone: { textAlign:"center", padding:"48px 24px" },
  resultPct: { fontSize:58, color:"var(--green)", fontWeight:800 },
  resultEmoji: { fontSize:50, marginBottom:14 },
  resultSub: { color:"var(--green3)", margin:"8px 0 28px", fontSize:14 },
  resultRow: { display:"flex", justifyContent:"center", gap:32, marginBottom:28 },
  bigBtn: (bg, border, color) => ({ width:"100%", background: bg||"linear-gradient(135deg,#10b981,#059669)", border: border||"none", color: color||"#fff", padding:16, borderRadius:14, fontSize:16, fontWeight:700, marginBottom:10 }),
  // past q
  searchBar: { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)", borderRadius:12, color:"#fff", padding:"13px 16px", fontSize:14, outline:"none", marginBottom:6 },
  pqCount: { color:"var(--green3)", fontSize:12, marginBottom:16 },
  pqItem: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(52,211,153,0.1)", borderRadius:14, padding:16, marginBottom:10 },
  pqBadge: { display:"inline-flex", alignItems:"center", gap:4, background:"rgba(52,211,153,0.08)", border:"1px solid var(--border)", color:"var(--green)", borderRadius:6, padding:"2px 8px", fontSize:10, marginBottom:8 },
  pqNum: { fontSize:10, color:"var(--green)", marginBottom:5, letterSpacing:1, fontFamily:"var(--mono)" },
  pqQ: { fontSize:14, color:"#fff", marginBottom:10, lineHeight:1.6 },
  pqReveal: { background:"rgba(52,211,153,0.08)", border:"1px solid var(--border)", color:"var(--green)", padding:"6px 12px", borderRadius:7, fontSize:12 },
  pqAns: { background:"rgba(52,211,153,0.06)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:10, padding:12, marginTop:10, color:"var(--green3)", fontSize:13, lineHeight:1.7 },
  // toast
  toast: (show) => ({ position:"fixed", bottom:24, left:"50%", transform:`translateX(-50%) translateY(${show?0:80}px)`, background:"#0f2132", border:"1px solid var(--border)", borderRadius:12, padding:"12px 20px", fontSize:13, color:"var(--green3)", opacity: show?1:0, transition:"all .3s", zIndex:999, whiteSpace:"nowrap", pointerEvents:"none" }),
};

const LOADING_STEPS = [
  ["📖 Reading your documents...", "AI is parsing the content..."],
  ["🧠 Identifying key concepts...", "Extracting important topics..."],
  ["🃏 Building flashcards...", "Creating study questions..."],
  ["🎯 Generating quiz questions...", "Adding exam-style patterns..."],
  ["✨ Finishing up...", "Almost ready!"],
];

export default function StudyAI() {
  const [screen, setScreen] = useState("upload");
  const [files, setFiles] = useState([]);
  const [pasteText, setPasteText] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [drag, setDrag] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [appData, setAppData] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [error, setError] = useState("");

  // flash state
  const [flashTopic, setFlashTopic] = useState(null);
  const [flashIdx, setFlashIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // quiz state
  const [quizQs, setQuizQs] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizWrong, setQuizWrong] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizTopicRef, setQuizTopicRef] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [userAns, setUserAns] = useState("");

  // past q
  const [pqSearch, setPqSearch] = useState("");
  const [pqReveals, setPqReveals] = useState({});

  const fileRef = useRef();

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFiles = (newFiles) => {
    setFiles(prev => {
      const merged = [...prev];
      [...newFiles].forEach(f => { if (!merged.find(x => x.name === f.name)) merged.push(f); });
      return merged;
    });
  };

  const readFileText = (file) => new Promise((res) => {
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const bytes = new Uint8Array(e.target.result);
        let out = "";
        for (let i = 0; i < bytes.length && out.length < 8000; i++) {
          const c = bytes[i];
          if (c >= 32 && c < 127) out += String.fromCharCode(c);
          else if (c === 10 || c === 13) out += "\n";
        }
        res(`[${file.name}]\n${out.replace(/\n{3,}/g, "\n\n")}`);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => res(`[${file.name}]\n${e.target.result.substring(0, 8000)}`);
      reader.readAsText(file);
    }
  });

  // ── Generate ───────────────────────────────────────────────────────────────
  const startGenerate = async () => {
    const fileTexts = await Promise.all(files.map(readFileText));
    const combined = [pasteText, ...fileTexts].filter(Boolean).join("\n\n").trim();
    if (combined.length < 20) { showToast("Please add some content first"); return; }

    setScreen("loading");
    setError("");
    let step = 0;
    setLoadStep(0);
    const timer = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length) setLoadStep(step);
    }, 2800);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: combined, subjectName: subjectInput || "My Course" }),
      });
      clearInterval(timer);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error " + res.status);
      if (!data.topics || !data.topics.length) throw new Error("AI returned empty data");
      setAppData(data);
      setScreen("home");
    } catch (err) {
      clearInterval(timer);
      setError(err.message);
      setScreen("upload");
      showToast("❌ " + err.message);
    }
  };

  // ── Study ──────────────────────────────────────────────────────────────────
  const startStudy = (topic) => {
    setFlashTopic(topic);
    setFlashIdx(0);
    setFlipped(false);
    setScreen("study");
  };

  const startQuiz = (topic) => {
    const pool = topic ? [...topic.notes] : [...(appData?.pastQuestions || [])];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    setQuizQs(shuffled);
    setQuizIdx(0);
    setQuizCorrect(0);
    setQuizWrong(0);
    setQuizDone(false);
    setQuizTopicRef(topic);
    setRevealed(false);
    setUserAns("");
    setScreen("quiz");
  };

  const quizAnswer = (correct) => {
    if (correct) setQuizCorrect(c => c + 1); else setQuizWrong(w => w + 1);
    if (quizIdx + 1 >= quizQs.length) { setQuizDone(true); }
    else { setQuizIdx(i => i + 1); setRevealed(false); setUserAns(""); }
  };

  const filteredPQ = pqSearch
    ? (appData?.pastQuestions || []).filter(q =>
        q.q.toLowerCase().includes(pqSearch.toLowerCase()) ||
        q.a.toLowerCase().includes(pqSearch.toLowerCase()))
    : (appData?.pastQuestions || []);

  const totalNotes = appData?.topics?.reduce((s, t) => s + t.notes.length, 0) || 0;
  const quizPct = (quizCorrect + quizWrong) ? Math.round(quizCorrect / (quizCorrect + quizWrong) * 100) : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.body}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.6}50%{opacity:1} }
        .load-text { animation: pulse 2s ease-in-out infinite; }
        input::placeholder, textarea::placeholder { color: rgba(110,231,183,0.35); }
        .topic-card:hover { background: rgba(52,211,153,0.08) !important; border-color: var(--green) !important; }
        .back-btn:hover { background: rgba(52,211,153,0.14) !important; }
        .new-doc-btn:hover { border-color: var(--green) !important; color: var(--green) !important; }
      `}</style>

      {/* ── UPLOAD ── */}
      {screen === "upload" && (
        <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <div style={s.main}>
            <div style={s.hero}>
              <div style={s.h1}>Turn Your Docs Into<br/><span style={{ color:"var(--green)" }}>A Study App</span></div>
              <p style={s.heroSub}>Upload notes, PDFs, or paste text — get instant flashcards, quizzes & past questions powered by AI.</p>
            </div>

            {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid var(--red)", borderRadius:12, padding:"12px 16px", marginBottom:12, color:"#fca5a5", fontSize:13 }}>⚠️ {error}</div>}

            {files.map((f, i) => (
              <div key={i} style={s.fileChip}>
                <span style={{ fontSize:18 }}>{f.name.endsWith(".pdf") ? "📕" : "📄"}</span>
                <span style={s.fname}>{f.name}</span>
                <span onClick={() => setFiles(files.filter((_,j) => j !== i))} style={{ color:"var(--red)", cursor:"pointer", fontSize:18, padding:"2px 6px" }}>×</span>
              </div>
            ))}

            <div
              style={s.uploadZone(drag)}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" multiple style={{ display:"none" }} onChange={e => handleFiles(e.target.files)} />
              <div style={s.uploadIcon}>📄</div>
              <div style={s.uploadH}>Drop files here or tap to browse</div>
              <div style={s.uploadP}>.txt · .pdf · .doc · .docx — multiple files OK</div>
            </div>

            <div style={{ textAlign:"center", color:"var(--green3)", fontSize:12, marginBottom:8 }}>— or paste your notes below —</div>
            <textarea
              style={s.textarea}
              placeholder="Paste lecture notes, textbook content, or any study material here..."
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
            />
            <input
              style={s.input}
              type="text"
              placeholder="Course name (e.g. GST101 — Use of English)"
              value={subjectInput}
              onChange={e => setSubjectInput(e.target.value)}
              maxLength={80}
            />
            <button
              style={s.genBtn(!pasteText && !files.length)}
              disabled={!pasteText && !files.length}
              onClick={startGenerate}
            >✨ Generate My Study App</button>
            <div style={s.hint}>Your content is only used to generate your study material</div>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {screen === "loading" && (
        <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <div style={s.loadWrap}>
            <div style={s.spinner} />
            <div style={s.loadStep}>{LOADING_STEPS[loadStep][0]}</div>
            <div className="load-text" style={s.loadText}>{LOADING_STEPS[loadStep][1]}</div>
          </div>
        </div>
      )}

      {/* ── HOME ── */}
      {screen === "home" && appData && (
        <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <div style={s.header}>
            <div style={s.logo}>📗 {appData.subjectName}</div>
            <button style={s.backBtn} onClick={() => setScreen("upload")}>+ New Doc</button>
          </div>
          <div style={s.main}>
            <div style={s.subjBadge}>
              <div style={s.subjName}>{appData.subjectName}</div>
              <div style={{ color:"var(--green3)", fontSize:13 }}>{appData.topics.length} topics · {totalNotes} flashcards · {appData.pastQuestions.length} past questions</div>
            </div>
            <div style={s.qaGrid}>
              <button style={s.qaBtn("linear-gradient(135deg,#d97706,#b45309)")} onClick={() => { setPqSearch(""); setPqReveals({}); setScreen("pastq"); }}>
                <span style={s.qaIcon}>📝</span>Past Questions
              </button>
              <button style={s.qaBtn("linear-gradient(135deg,#10b981,#047857)")} onClick={() => startQuiz(null)}>
                <span style={s.qaIcon}>🎯</span>Random Quiz
              </button>
              <button style={s.qaBtn("linear-gradient(135deg,#6366f1,#4338ca)")} onClick={() => startStudy(appData.topics[0])}>
                <span style={s.qaIcon}>🃏</span>Flashcards
              </button>
            </div>
            <div style={s.sectionTitle}>📖 Study by Topic</div>
            <div style={s.topicGrid}>
              {appData.topics.map(t => (
                <div key={t.id} className="topic-card" style={s.topicCard}>
                  <div style={s.topicIcon}>{t.icon || "📖"}</div>
                  <div style={s.topicTitle}>{t.title}</div>
                  <div style={s.topicCount}>{t.notes.length} study points</div>
                  <div style={s.topicBtns}>
                    <button style={s.tBtn("52,211,153","var(--green)")} onClick={() => startStudy(t)}>🃏 Flashcards</button>
                    <button style={s.tBtn("251,191,36","var(--yellow)")} onClick={() => startQuiz(t)}>🎯 Quiz</button>
                  </div>
                </div>
              ))}
            </div>
            {appData.tips && (
              <div style={s.tipsBox}>
                <div style={s.tipsH}>💡 Key Study Tips</div>
                <div style={s.tipsP}>
                  {appData.tips.split("\n").filter(Boolean).map((tip, i) => (
                    <span key={i}>{i + 1}. {tip}<br /></span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FLASHCARD ── */}
      {screen === "study" && flashTopic && (
        <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <div style={s.header}>
            <div style={s.logo}>📗 Flashcards</div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={s.backBtn} onClick={() => startQuiz(flashTopic)}>🎯 Quiz This</button>
              <button style={s.backBtn} onClick={() => setScreen("home")}>← Home</button>
            </div>
          </div>
          <div style={s.main}>
            <div style={s.flashTopicH}>
              <div style={s.flashIcon}>{flashTopic.icon}</div>
              <div style={s.flashTitle}>{flashTopic.title}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
              <div style={s.flashcard(flipped)} onClick={() => setFlipped(!flipped)}>
                <div style={s.flashLabel}>{flipped ? "ANSWER" : "QUESTION — tap to flip"}</div>
                {!flipped
                  ? <div style={s.flashQ}>{flashTopic.notes[flashIdx].q}</div>
                  : <div style={s.flashA}>{flashTopic.notes[flashIdx].a}</div>
                }
              </div>
              <div style={s.flashNav}>
                <button style={s.navBtn} onClick={() => { setFlashIdx(i => i-1); setFlipped(false); }} disabled={flashIdx === 0}>← Prev</button>
                <span style={s.progressText}>{flashIdx+1} / {flashTopic.notes.length}</span>
                <button style={s.navBtn} onClick={() => { setFlashIdx(i => i+1); setFlipped(false); }} disabled={flashIdx === flashTopic.notes.length-1}>Next →</button>
              </div>
              <div style={s.dotsRow}>
                {flashTopic.notes.map((_, i) => (
                  <div key={i} style={s.dot(i===flashIdx, i<flashIdx)} onClick={() => { setFlashIdx(i); setFlipped(false); }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {screen === "quiz" && (
        <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <div style={s.header}>
            <div style={s.logo}>📗 Quiz</div>
            <button style={s.backBtn} onClick={() => setScreen("home")}>✕ Exit</button>
          </div>
          <div style={s.main}>
            {!quizDone ? (
              <>
                <div style={s.quizMeta}>
                  <span>Question {quizIdx+1} of {quizQs.length}</span>
                  <div style={{ display:"flex", gap:10 }}>
                    <span style={{ color:"var(--green)", fontWeight:700 }}>✓ {quizCorrect}</span>
                    <span style={{ color:"var(--red)", fontWeight:700 }}>✗ {quizWrong}</span>
                  </div>
                </div>
                <div style={s.quizCard}>
                  <div style={s.quizQ}>{quizQs[quizIdx]?.q}</div>
                  <textarea style={s.quizTA} placeholder="Type your answer (optional)..." value={userAns} onChange={e => setUserAns(e.target.value)} />
                  {!revealed
                    ? <button style={s.revealBtn} onClick={() => setRevealed(true)}>👁 Reveal Answer</button>
                    : <>
                        <div style={s.answerBox}><strong>✅ Model Answer:</strong><br/><br/>{quizQs[quizIdx]?.a}</div>
                        <div style={s.verdictBtns}>
                          <button style={s.vBtn("var(--green)")} onClick={() => quizAnswer(true)}>✓ Got It Right</button>
                          <button style={s.vBtn("var(--red)")} onClick={() => quizAnswer(false)}>✗ Need Review</button>
                        </div>
                      </>
                  }
                </div>
              </>
            ) : (
              <div style={s.quizDone}>
                <div style={s.resultEmoji}>{quizPct>=70?"🎉":quizPct>=50?"💪":"📖"}</div>
                <div style={s.resultPct}>{quizPct}%</div>
                <div style={s.resultSub}>{quizCorrect} correct out of {quizCorrect+quizWrong} questions</div>
                <div style={s.resultRow}>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:30, color:"var(--green)", fontWeight:800 }}>{quizCorrect}</div><div style={{ color:"#888", fontSize:12 }}>Correct</div></div>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:30, color:"var(--red)", fontWeight:800 }}>{quizWrong}</div><div style={{ color:"#888", fontSize:12 }}>Review</div></div>
                </div>
                <button style={s.bigBtn()} onClick={() => startQuiz(quizTopicRef)}>🔄 Try Again</button>
                <button style={s.bigBtn("rgba(255,255,255,0.06)","1px solid var(--border)","var(--green)")} onClick={() => setScreen("home")}>← Back to Home</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PAST QUESTIONS ── */}
      {screen === "pastq" && appData && (
        <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <div style={s.header}>
            <div style={s.logo}>📗 Past Questions</div>
            <button style={s.backBtn} onClick={() => setScreen("home")}>← Home</button>
          </div>
          <div style={s.main}>
            <input style={s.searchBar} placeholder="🔍 Search past questions..." value={pqSearch} onChange={e => setPqSearch(e.target.value)} />
            <div style={s.pqCount}>{filteredPQ.length} question{filteredPQ.length!==1?"s":""} found</div>
            {filteredPQ.map((pq, i) => {
              const t = appData.topics.find(x => x.id === pq.topic);
              return (
                <div key={i} style={s.pqItem}>
                  {t && <div style={s.pqBadge}>{t.icon} {t.title}</div>}
                  <div style={s.pqNum}>QUESTION {i+1}</div>
                  <div style={s.pqQ}>{pq.q}</div>
                  <button style={s.pqReveal} onClick={() => setPqReveals(r => ({ ...r, [i]: !r[i] }))}>
                    {pqReveals[i] ? "🙈 Hide" : "👁 Show Answer"}
                  </button>
                  {pqReveals[i] && <div style={s.pqAns}>{pq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      <div style={s.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
