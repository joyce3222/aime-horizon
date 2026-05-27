"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadForm {
  name: string;
  email: string;
  organisation: string;
  interest: string;
}

// ─── Nova avatar (same DiceBear seed used in Leadership) ──────────────────────

function NovaAvatar({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Nova-Digital&backgroundColor=C5965A"
      alt="Nova"
      width={size}
      height={size}
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
}

// ─── Lead-capture form shown inside the chat ─────────────────────────────────

function LeadCapture({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: LeadForm) => void;
}) {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    organisation: "",
    interest: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
      setTimeout(() => onSubmit(form), 1400);
    } catch {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-12 h-12 border border-gold/40 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gold">
            <path d="M5 12 L10 17 L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-white/80 font-sans text-sm font-light text-center">
          Thank you! Joyce will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-sm border border-white/10 p-4 mx-1 my-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gold text-xs font-sans font-medium tracking-wide">
          Connect with Joyce
        </p>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Your name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-sans font-light text-xs placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
        />
        <input
          type="email"
          placeholder="Email address *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-sans font-light text-xs placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
        />
        <input
          type="text"
          placeholder="Organisation (optional)"
          value={form.organisation}
          onChange={(e) => setForm({ ...form, organisation: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-sans font-light text-xs placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
        />
        <input
          type="text"
          placeholder="How can we help? (optional)"
          value={form.interest}
          onChange={(e) => setForm({ ...form, interest: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-sans font-light text-xs placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
        />
        <button
          type="submit"
          disabled={sending}
          className="w-full bg-gold hover:bg-gold-light disabled:opacity-60 text-navy font-sans font-medium text-xs tracking-wide py-2.5 rounded-sm transition-all duration-300 mt-1"
        >
          {sending ? "Sending…" : "Send →"}
        </button>
      </form>
    </div>
  );
}

// ─── Main Nova widget ─────────────────────────────────────────────────────────

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm Nova, AIME Horizon's AI Digital Strategy Consultant. I'm here to help with questions about our ANZ–Asia advisory services — market entry, brand strategy, stakeholder engagement, and more. What can I help you with today?",
};

export default function Nova() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [unread, setUnread] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showLead]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setShowLead(false);

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setStreaming(true);

    // Placeholder assistant message
    const assistantPlaceholder: Message = { role: "assistant", content: "" };
    setMessages([...updated, assistantPlaceholder]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const { text: delta } = JSON.parse(data);
            accumulated += delta;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", content: accumulated };
              return next;
            });
          } catch {
            // ignore parse errors on partial chunks
          }
        }
      }

      // After response — nudge toward lead capture if they seem interested
      const lowerText = text.toLowerCase();
      const leadKeywords = [
        "interested", "help", "service", "work with", "partner", "expand",
        "market", "entry", "consulting", "contact", "joyce", "price", "cost",
        "how much", "engage", "hire", "感兴趣", "合作", "联系", "咨询", "价格", "帮助",
      ];
      const seemsInterested = leadKeywords.some((kw) => lowerText.includes(kw));

      if (seemsInterested && !leadSubmitted && !open) {
        setUnread((n) => n + 1);
      }
      if (seemsInterested && !leadSubmitted && Math.random() > 0.5) {
        setShowLead(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: "Sorry, I'm having trouble connecting right now. Please try again or email joycez@aimehorizon.com directly.",
          };
          return next;
        });
      }
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming, leadSubmitted, open]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeadSubmit = (data: LeadForm) => {
    setLeadSubmitted(true);
    setShowLead(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Thank you, ${data.name}! Joyce will reach out to you at ${data.email} soon. Is there anything else I can help you with in the meantime?`,
      },
    ]);
  };

  return (
    <>
      {/* ── Chat window ───────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-24 right-5 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col"
          style={{
            height: "min(520px, calc(100dvh - 120px))",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(197,150,90,0.15)",
            borderRadius: "6px",
            overflow: "hidden",
            background: "#0B1F3A",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#0a1b33] border-b border-white/8 flex-shrink-0">
            <NovaAvatar size={34} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-sans font-medium text-sm leading-none">Nova</p>
              <p className="text-white/40 font-sans font-light text-[10px] mt-0.5 tracking-wide">
                AI Digital Strategy Consultant
              </p>
            </div>
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/35 font-sans text-[10px] tracking-wide">Online</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
              aria-label="Close chat"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 mt-0.5">
                    <NovaAvatar size={26} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-sm px-3.5 py-2.5 text-sm font-sans font-light leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gold/20 text-white/90 rounded-tr-none"
                      : "bg-white/8 text-white/85 rounded-tl-none"
                  }`}
                >
                  {msg.content === "" && streaming ? (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Lead capture form */}
            {showLead && !leadSubmitted && (
              <LeadCapture onClose={() => setShowLead(false)} onSubmit={handleLeadSubmit} />
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-white/8 px-3 py-3 flex-shrink-0 bg-[#0a1b33]">
            {!leadSubmitted && !showLead && (
              <button
                onClick={() => setShowLead(true)}
                className="w-full text-gold/60 hover:text-gold font-sans text-[11px] tracking-wide transition-colors duration-200 text-center pb-2.5 flex items-center justify-center gap-1.5 group"
              >
                <span className="w-3 h-px bg-gold/30 group-hover:bg-gold/60 transition-colors" />
                Connect with Joyce
                <span className="w-3 h-px bg-gold/30 group-hover:bg-gold/60 transition-colors" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about our services…"
                disabled={streaming}
                className="flex-1 bg-white/6 border border-white/10 rounded-sm px-3.5 py-2.5 text-white/80 font-sans font-light text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/35 transition-colors disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={streaming || !input.trim()}
                aria-label="Send message"
                className="w-9 h-9 bg-gold hover:bg-gold-light disabled:opacity-40 rounded-sm flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-navy">
                  <path d="M2 8 L14 8 M9 3 L14 8 L9 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="text-white/18 font-sans text-[9px] tracking-wider text-center mt-2">
              Powered by AIME Horizon AI
            </p>
          </div>
        </div>
      )}

      {/* ── Floating button ───────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Nova chat" : "Chat with Nova"}
        className="fixed bottom-5 right-5 sm:right-6 z-50 flex items-center gap-2.5 group"
        style={{
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))",
        }}
      >
        <div
          className={`relative flex items-center gap-2.5 bg-navy border border-gold/30 hover:border-gold/60 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gold/15 ${
            open ? "px-3 py-2" : "px-4 py-2.5"
          }`}
        >
          <NovaAvatar size={28} />
          {!open && (
            <span className="text-white/85 font-sans font-light text-sm tracking-wide pr-0.5">
              Ask Nova
            </span>
          )}
          {open && (
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white/60">
              <path d="M3 8 L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {/* Unread badge */}
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center text-[9px] font-sans font-bold text-navy">
              {unread}
            </span>
          )}
        </div>
      </button>
    </>
  );
}
