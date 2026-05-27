"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Leadership() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll(".reveal").forEach((child) => child.classList.add("visible"));
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="leadership" ref={sectionRef} className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal">
            <span className="text-gold text-xs font-sans font-medium tracking-[0.3em] uppercase">
              {t("leadership.label")}
            </span>
          </div>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl md:text-5xl font-light text-navy mt-4 leading-tight">
            {t("leadership.title")}
          </h2>
          <div className="reveal reveal-delay-1 flex justify-center mt-5">
            <span className="gold-divider" />
          </div>
        </div>

        {/* Placeholder card */}
        <div className="reveal reveal-delay-2 max-w-3xl mx-auto">
          <div className="border border-dashed border-navy/15 rounded-sm p-12 text-center bg-white/50">
            {/* Avatar placeholder */}
            <div className="w-24 h-24 rounded-full bg-beige border-2 border-gold/20 mx-auto mb-6 flex items-center justify-center">
              <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10 text-navy/20">
                <circle cx="20" cy="15" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 36 C6 28 12 23 20 23 C28 23 34 28 34 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            <p className="font-sans font-light text-navy/40 text-sm italic mb-6">
              {t("leadership.placeholder")}
            </p>

            {/* Placeholder bio lines */}
            <div className="space-y-2 max-w-sm mx-auto mb-8">
              {[80, 65, 75, 55].map((w, i) => (
                <div
                  key={i}
                  className="h-2 bg-navy/8 rounded-full mx-auto"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-gold font-sans text-sm font-medium hover:text-gold-dark transition-colors duration-300 group"
            >
              {t("leadership.cta")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Case studies placeholder */}
        <div className="reveal reveal-delay-3 mt-12 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {["Case Study", "Case Study", "Case Study"].map((_, i) => (
            <div
              key={i}
              className="border border-dashed border-navy/10 rounded-sm p-6 bg-white/30"
            >
              <div className="h-1.5 w-12 bg-gold/30 rounded-full mb-4" />
              <div className="space-y-1.5">
                <div className="h-2 bg-navy/8 rounded-full w-4/5" />
                <div className="h-2 bg-navy/8 rounded-full w-3/5" />
              </div>
              <p className="mt-3 text-navy/25 text-xs font-sans font-light italic">
                Case study coming soon
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
