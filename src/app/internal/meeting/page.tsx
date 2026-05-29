"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ActionItem {
  task: string;
  owner: string;
  due: string;
}

interface Minutes {
  summary: string;
  decisions: string[];
  actions: ActionItem[];
  nextSteps: string;
}

export default function MeetingPage() {
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [recording, setRecording] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [minutes, setMinutes] = useState<Minutes | null>(null);
  const [voiceLang, setVoiceLang] = useState<"zh-CN" | "en-US">("zh-CN");
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/internal/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!d?.username) router.push("/internal"); })
      .catch(() => router.push("/internal"));
  }, [router]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  function startRecording() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert("您的浏览器不支持语音识别，请使用 Chrome、Edge 或 Safari。");
      return;
    }

    const rec = new SR();
    rec.lang = voiceLang;
    rec.continuous = true;
    rec.interimResults = true;
    recognitionRef.current = rec;

    rec.onstart = () => {
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    };

    rec.onend = () => {
      setRecording(false);
      setInterimText("");
      if (timerRef.current) clearInterval(timerRef.current);
    };

    rec.onerror = () => {
      setRecording(false);
      setInterimText("");
      if (timerRef.current) clearInterval(timerRef.current);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let interim = "";
      let newFinal = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          newFinal += e.results[i][0].transcript + " ";
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      if (newFinal) {
        setTranscript((prev) => prev + newFinal);
      }
      setInterimText(interim);
    };

    rec.start();
  }

  function stopRecording() {
    recognitionRef.current?.stop();
  }

  async function generateMinutes() {
    if (!transcript.trim()) return;
    setGenerating(true);
    setMinutes(null);

    try {
      const res = await fetch("/api/internal/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, title }),
      });
      const data = await res.json();
      if (data.minutes) setMinutes(data.minutes);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  function exportMinutes() {
    if (!minutes) return;
    const lines = [
      `AIME Horizon — 会议纪要`,
      `会议名称：${title || "未命名会议"}`,
      `生成时间：${new Date().toLocaleString("zh-CN")}`,
      "═".repeat(50),
      "",
      "【会议摘要】",
      minutes.summary,
      "",
      "【关键决策】",
      ...minutes.decisions.map((d, i) => `${i + 1}. ${d}`),
      "",
      "【行动事项】",
      ...minutes.actions.map((a) => `• ${a.task}  负责人：${a.owner}  截止：${a.due}`),
      "",
      "【下一步】",
      minutes.nextSteps,
      "",
      "─".repeat(50),
      "【完整转录】",
      transcript,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `会议纪要_${(title || "未命名").replace(/\s+/g, "_")}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyMinutes() {
    if (!minutes) return;
    const text = [
      `会议摘要\n${minutes.summary}`,
      `\n关键决策\n${minutes.decisions.map((d, i) => `${i + 1}. ${d}`).join("\n")}`,
      `\n行动事项\n${minutes.actions.map((a) => `• ${a.task}  负责人：${a.owner}  截止：${a.due}`).join("\n")}`,
      `\n下一步\n${minutes.nextSteps}`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function reset() {
    setTranscript("");
    setInterimText("");
    setMinutes(null);
    setTitle("");
    setElapsed(0);
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <header className="border-b border-cream/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif text-cream text-lg font-light">AIME Horizon</span>
          <span className="text-cream/20">·</span>
          <span className="text-gold text-xs tracking-widest uppercase font-sans">会议记录</span>
        </div>
        <button
          onClick={() => router.push("/internal/workspace")}
          className="text-cream/30 hover:text-cream/60 text-xs font-sans tracking-wide transition-colors"
        >
          ← 返回工作区
        </button>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="会议名称（选填）"
              className="w-full bg-transparent border-b border-cream/15 focus:border-gold/50 text-cream placeholder-cream/20 py-2 font-serif text-2xl font-light outline-none transition-colors"
            />
          </div>

          {/* Recording controls */}
          <div className="bg-navy-light border border-cream/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {recording && (
                  <span className="flex items-center gap-2 text-red-400 text-sm font-sans">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    录音中 {formatTime(elapsed)}
                  </span>
                )}
                {!recording && elapsed > 0 && (
                  <span className="text-cream/30 text-sm font-sans">已录制 {formatTime(elapsed)}</span>
                )}
              </div>
              {/* Language toggle */}
              <button
                onClick={() => setVoiceLang((l) => l === "zh-CN" ? "en-US" : "zh-CN")}
                disabled={recording}
                className="text-cream/30 hover:text-cream/60 disabled:opacity-30 text-xs font-sans border border-cream/10 px-3 py-1 rounded transition-colors"
              >
                {voiceLang === "zh-CN" ? "中文" : "English"}
              </button>
            </div>

            {/* Big record button */}
            <div className="flex justify-center py-4">
              {!recording ? (
                <button
                  onClick={startRecording}
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center shadow-lg shadow-red-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                    <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 17.93V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.07A8 8 0 0 0 20 11a1 1 0 0 0-2 0 6 6 0 0 1-12 0 1 1 0 0 0-2 0 8 8 0 0 0 7 7.93z"/>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center shadow-lg shadow-red-500/40 ring-4 ring-red-500/20 animate-pulse"
                >
                  <span className="w-7 h-7 rounded bg-white" />
                </button>
              )}
            </div>

            <p className="text-center text-cream/25 text-xs font-sans">
              {recording ? "点击停止录音" : "点击开始录音"}
            </p>
          </div>

          {/* Live transcript */}
          {(transcript || interimText) && (
            <div className="bg-navy-light border border-cream/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-cream/40 text-xs font-sans tracking-widest uppercase">实时转录</p>
                {!recording && transcript && (
                  <button onClick={reset} className="text-cream/20 hover:text-cream/50 text-xs font-sans transition-colors">
                    清空重来
                  </button>
                )}
              </div>
              <div className="text-cream/80 text-sm font-sans leading-relaxed max-h-48 overflow-y-auto">
                <span>{transcript}</span>
                {interimText && <span className="text-cream/30 italic">{interimText}</span>}
              </div>
            </div>
          )}

          {/* Generate button */}
          {transcript && !recording && (
            <button
              onClick={generateMinutes}
              disabled={generating}
              className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-navy font-sans text-sm tracking-widest uppercase py-4 rounded-xl transition-colors"
            >
              {generating ? "正在生成会议纪要…" : "生成会议纪要"}
            </button>
          )}

          {/* Minutes output */}
          {minutes && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-cream text-xl font-light">会议纪要</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyMinutes}
                    className="text-cream/40 hover:text-cream/70 text-xs font-sans border border-cream/10 hover:border-cream/30 px-3 py-1.5 rounded transition-colors"
                  >
                    {copied ? "已复制 ✓" : "复制"}
                  </button>
                  <button
                    onClick={exportMinutes}
                    className="text-gold/60 hover:text-gold text-xs font-sans border border-gold/20 hover:border-gold/50 px-3 py-1.5 rounded transition-colors"
                  >
                    导出 .txt
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-navy-light border border-cream/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-gold rounded-full" />
                  <p className="text-gold text-xs font-sans tracking-widest uppercase">会议摘要</p>
                </div>
                <p className="text-cream/80 text-sm font-sans leading-relaxed whitespace-pre-wrap">{minutes.summary}</p>
              </div>

              {/* Decisions */}
              {minutes.decisions.length > 0 && (
                <div className="bg-navy-light border border-cream/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-blue-400 rounded-full" />
                    <p className="text-blue-400 text-xs font-sans tracking-widest uppercase">关键决策</p>
                  </div>
                  <ul className="space-y-2">
                    {minutes.decisions.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-sans text-cream/80">
                        <span className="text-blue-400/60 mt-0.5 flex-shrink-0">{i + 1}.</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action items */}
              {minutes.actions.length > 0 && (
                <div className="bg-navy-light border border-cream/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                    <p className="text-emerald-400 text-xs font-sans tracking-widest uppercase">行动事项</p>
                  </div>
                  <div className="space-y-2">
                    {minutes.actions.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm font-sans">
                        <span className="text-emerald-400/60 mt-0.5">•</span>
                        <div className="flex-1">
                          <p className="text-cream/80">{a.task}</p>
                          <p className="text-cream/30 text-xs mt-0.5">
                            负责人：{a.owner} · 截止：{a.due}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next steps */}
              {minutes.nextSteps && (
                <div className="bg-navy-light border border-cream/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-violet-400 rounded-full" />
                    <p className="text-violet-400 text-xs font-sans tracking-widest uppercase">下一步</p>
                  </div>
                  <p className="text-cream/80 text-sm font-sans leading-relaxed">{minutes.nextSteps}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
