"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const pills = ["newsletter.pill1", "newsletter.pill2", "newsletter.pill3", "newsletter.pill4"];

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("done");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <section className="py-24 bg-navy-dark relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/4 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(197,150,90,1) 1px, transparent 1px), linear-gradient(90deg, rgba(197,150,90,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Label */}
        <span className="text-gold text-xs font-sans font-medium tracking-[0.3em] uppercase">
          {t("newsletter.label")}
        </span>

        {/* Heading */}
        <h2 className="font-serif text-3xl md:text-4xl font-light text-white mt-4 mb-4 leading-tight">
          {t("newsletter.title")}
        </h2>

        {/* Divider */}
        <div className="flex justify-center mb-5">
          <span className="gold-divider" />
        </div>

        {/* Subtitle */}
        <p className="font-sans font-light text-white/50 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
          {t("newsletter.subtitle")}
        </p>

        {/* Topic pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {pills.map((key) => (
            <span
              key={key}
              className="text-[10px] font-sans font-light text-gold/60 border border-gold/20 rounded-full px-3 py-1 tracking-wide"
            >
              {t(key)}
            </span>
          ))}
        </div>

        {/* Form */}
        {state === "done" ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 border border-gold/30 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gold">
                <path d="M5 12 L10 17 L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-white/70 font-sans font-light text-sm">{t("newsletter.success")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              required
              className="flex-1 bg-white/6 border border-white/12 rounded-sm px-4 py-3 text-white/80 font-sans font-light text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="bg-gold hover:bg-gold-light disabled:opacity-60 text-navy font-sans font-medium text-sm tracking-wide px-6 py-3 rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 whitespace-nowrap"
            >
              {state === "loading" ? "…" : t("newsletter.cta")}
            </button>
          </form>
        )}

        {/* Error */}
        {state === "error" && (
          <p className="text-red-400/70 text-xs font-sans mt-3">
            Something went wrong. Email us directly at joycez@aimehorizon.com
          </p>
        )}

        {/* Privacy note */}
        {state !== "done" && (
          <p className="text-white/25 font-sans text-[11px] mt-4 tracking-wide">
            {t("newsletter.privacy")}
          </p>
        )}
      </div>
    </section>
  );
}
