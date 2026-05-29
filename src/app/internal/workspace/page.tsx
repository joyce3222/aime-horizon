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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

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
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearConversation() {
    setConversations((prev) => ({ ...prev, [activeAdvisor.id]: [] }));
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
        <button
          onClick={handleLogout}
          className="text-cream/30 hover:text-cream/60 text-xs font-sans tracking-wide transition-colors"
        >
          Sign out
        </button>
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
                onClick={sendMessage}
                disabled={!input.trim() || streaming}
                className="bg-gold hover:bg-gold-dark disabled:opacity-30 text-navy px-5 py-3 rounded font-sans text-sm tracking-wide transition-colors flex-shrink-0"
              >
                {streaming ? "…" : "Send"}
              </button>
            </div>
            <p className="text-cream/20 text-xs font-sans mt-2 text-center">
              Enter to send · Shift+Enter for new line · Conversations are private
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
