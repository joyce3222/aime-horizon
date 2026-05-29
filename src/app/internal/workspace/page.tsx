"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADVISORS = [
  {
    id: "strategy",
    title: "Cross-Border Strategy",
    titleZh: "跨境战略顾问",
    role: "Senior Strategy Consultant",
    icon: "◈",
    color: "from-blue-900/40 to-navy-light",
    description: "Market entry, go-to-market strategy, AU-China business engagement",
  },
  {
    id: "policy",
    title: "Policy Intelligence",
    titleZh: "政策情报顾问",
    role: "Government & Policy Analyst",
    icon: "◉",
    color: "from-indigo-900/40 to-navy-light",
    description: "Policy monitoring, government grants, geopolitical briefings",
  },
  {
    id: "proposals",
    title: "Proposals & Grants",
    titleZh: "提案与申请顾问",
    role: "Proposal & Grant Specialist",
    icon: "◇",
    color: "from-violet-900/40 to-navy-light",
    description: "Grant writing, partnership papers, capability statements",
  },
  {
    id: "relationships",
    title: "Stakeholder Relations",
    titleZh: "利益相关方关系顾问",
    role: "Strategic Relationship Manager",
    icon: "◎",
    color: "from-teal-900/40 to-navy-light",
    description: "Outreach drafts, meeting summaries, stakeholder briefings",
  },
  {
    id: "china",
    title: "China Communications",
    titleZh: "中国市场传播顾问",
    role: "China Market Specialist",
    icon: "◐",
    color: "from-rose-900/40 to-navy-light",
    description: "Brand localisation, Xiaohongshu content, bilingual storytelling",
  },
  {
    id: "education",
    title: "Education Partnerships",
    titleZh: "教育合作顾问",
    role: "International Education Consultant",
    icon: "◑",
    color: "from-emerald-900/40 to-navy-light",
    description: "TAFE pathways, AQF alignment, transnational education",
  },
  {
    id: "research",
    title: "AI Research",
    titleZh: "AI产业研究顾问",
    role: "AI & Innovation Analyst",
    icon: "◆",
    color: "from-cyan-900/40 to-navy-light",
    description: "AI trends, industrial AI, innovation ecosystem briefings",
  },
  {
    id: "founder",
    title: "Founder Office",
    titleZh: "创始人办公室AI",
    role: "Chief of Staff AI",
    icon: "★",
    color: "from-amber-900/40 to-navy-light",
    description: "Founder communications, strategic thinking, correspondence",
  },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationMap {
  [advisorId: string]: Message[];
}

export default function WorkspacePage() {
  const [activeAdvisor, setActiveAdvisor] = useState(ADVISORS[0]);
  const [conversations, setConversations] = useState<ConversationMap>({});
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"zh-CN" | "en-US">("zh-CN");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/internal/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.username) {
          setUsername(data.username);
          setIsAdmin(data.isAdmin || false);
          return fetch("/api/internal/conversations");
        }
        router.push("/internal");
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((data) => {
        if (data?.conversations) setConversations(data.conversations);
      })
      .catch(() => router.push("/internal"));
  }, [router]);

  const currentMessages = conversations[activeAdvisor.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeAdvisor.id]);

  function switchAdvisor(advisor: typeof ADVISORS[0]) {
    setActiveAdvisor(advisor);
    setInput("");
  }

  async function sendMessage() {
    if (!input.trim() || streaming) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const advisorId = activeAdvisor.id;

    setConversations((prev) => ({
      ...prev,
      [advisorId]: [...(prev[advisorId] || []), userMessage],
    }));
    setInput("");
    setStreaming(true);

    const allMessages = [...(conversations[advisorId] || []), userMessage];

    try {
      const res = await fetch("/api/internal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, advisorId }),
      });

      if (res.status === 401) {
        router.push("/internal");
        return;
      }

      const assistantMessage: Message = { role: "assistant", content: "" };
      setConversations((prev) => ({
        ...prev,
        [advisorId]: [...(prev[advisorId] || []), userMessage, assistantMessage],
      }));

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const { text } = JSON.parse(data);
            setConversations((prev) => {
              const msgs = [...(prev[advisorId] || [])];
              const last = msgs[msgs.length - 1];
              if (last?.role === "assistant") {
                msgs[msgs.length - 1] = { ...last, content: last.content + text };
              }
              return { ...prev, [advisorId]: msgs };
            });
          } catch {}
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStreaming(false);
      setConversations((prev) => {
        fetch("/api/internal/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversations: prev }),
        }).catch(() => {});
        return prev;
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function toggleVoice() {
    const SR = (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SR) {
      alert("您的浏览器不支持语音识别，请升级至最新版本的 Chrome、Edge 或 Safari。");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const rec = new SR();
    rec.lang = voiceLang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    rec.start();
  }

  function clearConversation() {
    setConversations((prev) => {
      const next = { ...prev, [activeAdvisor.id]: [] };
      fetch("/api/internal/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversations: next }),
      }).catch(() => {});
      return next;
    });
  }

  async function handleLogout() {
    await fetch("/api/internal/auth", { method: "DELETE" });
    router.push("/internal");
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Top bar */}
      <header className="border-b border-cream/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif text-cream text-lg font-light">AIME Horizon</span>
          <span className="text-cream/20">·</span>
          <span className="text-gold text-xs tracking-widest uppercase font-sans">AI Workforce</span>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <a
              href="/internal/admin"
              className="text-gold/50 hover:text-gold text-xs font-sans tracking-wide transition-colors"
            >
              Admin
            </a>
          )}
          {username && (
            <span className="text-cream/40 text-xs font-sans">{username}</span>
          )}
          <button
            onClick={handleLogout}
            className="text-cream/30 hover:text-cream/60 text-xs font-sans tracking-wide transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-cream/10 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-cream/10">
            <p className="text-cream/30 text-xs font-sans tracking-widest uppercase">Advisors</p>
          </div>
          <nav className="flex-1 p-2">
            {ADVISORS.map((advisor) => {
              const msgCount = (conversations[advisor.id] || []).length;
              const isActive = advisor.id === activeAdvisor.id;
              return (
                <button
                  key={advisor.id}
                  onClick={() => switchAdvisor(advisor)}
                  className={`w-full text-left px-3 py-3 rounded mb-1 transition-colors group ${
                    isActive
                      ? "bg-gold/15 border border-gold/30"
                      : "hover:bg-cream/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-base ${isActive ? "text-gold" : "text-cream/40 group-hover:text-cream/60"}`}>
                      {advisor.icon}
                    </span>
                    <span className={`text-xs font-sans font-medium leading-tight ${isActive ? "text-cream" : "text-cream/60"}`}>
                      {advisor.titleZh}
                    </span>
                    {msgCount > 0 && (
                      <span className="ml-auto text-xs text-gold/60 font-sans">{Math.floor(msgCount / 2)}</span>
                    )}
                  </div>
                  <p className={`text-xs font-sans pl-6 leading-tight ${isActive ? "text-cream/50" : "text-cream/30"}`}>
                    {advisor.role}
                  </p>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="border-b border-cream/10 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold text-lg">{activeAdvisor.icon}</span>
                <h2 className="font-serif text-cream text-xl font-light">{activeAdvisor.titleZh}</h2>
              </div>
              <p className="text-cream/40 text-xs font-sans mt-0.5">{activeAdvisor.description}</p>
            </div>
            {currentMessages.length > 0 && (
              <button
                onClick={clearConversation}
                className="text-cream/20 hover:text-cream/50 text-xs font-sans tracking-wide transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {currentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <span className="text-gold/30 text-5xl mb-4">{activeAdvisor.icon}</span>
                <h3 className="font-serif text-cream/60 text-2xl font-light mb-2">{activeAdvisor.titleZh}</h3>
                <p className="text-cream/30 text-sm font-sans max-w-sm leading-relaxed">{activeAdvisor.description}</p>
                <div className="mt-6 w-8 h-px bg-gold/30" />
              </div>
            ) : (
              currentMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-2xl rounded-lg px-4 py-3 text-sm font-sans leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-gold/20 text-cream border border-gold/20"
                        : "bg-navy-light text-cream/85 border border-cream/10"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-cream/10">
                        <span className="text-gold text-xs">{activeAdvisor.icon}</span>
                        <span className="text-gold/70 text-xs tracking-wide">{activeAdvisor.titleZh}</span>
                      </div>
                    )}
                    {msg.content}
                    {msg.role === "assistant" && msg.content === "" && streaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-gold/60 animate-pulse ml-0.5" />
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-cream/10 p-4 flex-shrink-0">
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`向${activeAdvisor.titleZh}提问…`}
                rows={1}
                className="flex-1 bg-navy-light border border-cream/10 focus:border-gold/40 text-cream placeholder-cream/25 px-4 py-3 font-sans text-sm rounded resize-none outline-none transition-colors"
                style={{ minHeight: "48px", maxHeight: "160px" }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 160) + "px";
                }}
              />
              <button
                onClick={() => setVoiceLang((l) => l === "zh-CN" ? "en-US" : "zh-CN")}
                title="切换语音语言"
                className="flex-shrink-0 w-11 h-11 rounded flex items-center justify-center bg-navy-light border border-cream/10 text-cream/40 hover:text-cream/70 hover:border-cream/30 transition-colors font-sans text-xs"
              >
                {voiceLang === "zh-CN" ? "中" : "EN"}
              </button>
              <button
                onClick={toggleVoice}
                title={listening ? "停止录音" : "语音输入"}
                className={`flex-shrink-0 w-11 h-11 rounded flex items-center justify-center transition-colors border ${
                  listening
                    ? "bg-red-500/20 border-red-400/50 text-red-400 animate-pulse"
                    : "bg-navy-light border-cream/10 text-cream/40 hover:text-cream/70 hover:border-cream/30"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 17.93V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.07A8 8 0 0 0 20 11a1 1 0 0 0-2 0 6 6 0 0 1-12 0 1 1 0 0 0-2 0 8 8 0 0 0 7 7.93z"/>
                </svg>
              </button>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || streaming}
                className="bg-gold hover:bg-gold-dark disabled:opacity-30 text-navy px-5 py-3 rounded font-sans text-sm tracking-wide transition-colors flex-shrink-0"
              >
                {streaming ? "…" : "Send"}
              </button>
            </div>
            <p className="text-cream/20 text-xs font-sans mt-2 text-center">
              Enter to send · Shift+Enter for new line · 点击中/EN切换语音语言
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
