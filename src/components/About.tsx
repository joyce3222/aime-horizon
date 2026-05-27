"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
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
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: t("about.stat1.value"), label: t("about.stat1.label") },
    { value: t("about.stat2.value"), label: t("about.stat2.label") },
    { value: t("about.stat3.value"), label: t("about.stat3.label") },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-28 bg-beige">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="reveal">
              <span className="text-gold text-xs font-sans font-medium tracking-[0.3em] uppercase">
                {t("about.label")}
              </span>
            </div>
            <h2 className="reveal reveal-delay-1 font-serif text-4xl md:text-5xl font-light text-navy mt-4 mb-6 leading-tight">
              {t("about.title")}
            </h2>
            <div className="reveal reveal-delay-1">
              <span className="gold-divider mb-8" />
            </div>
            <p className="reveal reveal-delay-2 font-sans font-light text-navy/70 leading-relaxed mb-6">
              {t("about.body1")}
            </p>
            <p className="reveal reveal-delay-3 font-sans font-light text-navy/70 leading-relaxed">
              {t("about.body2")}
            </p>
          </div>

          {/* Right: Stats + visual */}
          <div className="reveal reveal-delay-2">
            <div className="relative">
              {/* Background card */}
              <div className="bg-navy rounded-sm p-10 relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

                {/* ANZ–Asia connection visual */}
                <div className="relative mb-10">
                  <svg viewBox="0 0 360 100" className="w-full opacity-60">
                    {/* Connecting arc */}
                    <path
                      d="M 40 60 Q 180 10 320 60"
                      stroke="url(#goldGrad)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4 3"
                    />
                    {/* Nodes */}
                    <circle cx="40" cy="60" r="5" fill="#C5965A" opacity="0.8" />
                    <circle cx="180" cy="35" r="3" fill="#C5965A" opacity="0.5" />
                    <circle cx="320" cy="60" r="5" fill="#C5965A" opacity="0.8" />
                    {/* Labels */}
                    <text x="40" y="80" fill="#C5965A" fontSize="9" textAnchor="middle" opacity="0.7" fontFamily="sans-serif">ANZ</text>
                    <text x="320" y="80" fill="#C5965A" fontSize="9" textAnchor="middle" opacity="0.7" fontFamily="sans-serif">ASIA</text>
                    <defs>
                      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C5965A" />
                        <stop offset="50%" stopColor="#D4AF7A" />
                        <stop offset="100%" stopColor="#C5965A" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="font-serif text-2xl md:text-3xl text-gold font-light mb-1">
                        {stat.value}
                      </div>
                      <div className="text-white/50 text-xs font-sans font-light tracking-wide leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offset accent card */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-gold/20 rounded-sm -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
