"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const points = [
  "expertise.p1",
  "expertise.p2",
  "expertise.p3",
  "expertise.p4",
  "expertise.p5",
  "expertise.p6",
];

export default function CrossBorderExpertise() {
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
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="expertise" ref={sectionRef} className="py-28 bg-beige-dark relative overflow-hidden">
      {/* Decorative background lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute right-0 top-0 h-full w-1/2 opacity-5" viewBox="0 0 600 800" fill="none" preserveAspectRatio="xMidYMid slice">
          <circle cx="600" cy="400" r="350" stroke="#0B1F3A" strokeWidth="1"/>
          <circle cx="600" cy="400" r="250" stroke="#0B1F3A" strokeWidth="1"/>
          <circle cx="600" cy="400" r="150" stroke="#0B1F3A" strokeWidth="1"/>
          <line x1="250" y1="0" x2="600" y2="800" stroke="#0B1F3A" strokeWidth="0.5"/>
          <line x1="600" y1="0" x2="0" y2="800" stroke="#0B1F3A" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <div className="reveal order-2 lg:order-1">
            <div className="relative bg-navy rounded-sm p-10 overflow-hidden">
              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

              {/* World map SVG hint */}
              <svg viewBox="0 0 400 220" className="w-full opacity-80 relative z-10" fill="none">
                {/* Stylised map with two nodes connected */}
                {/* ANZ region */}
                <ellipse cx="300" cy="150" rx="55" ry="35" stroke="#C5965A" strokeWidth="0.8" strokeDasharray="3 2"/>
                <circle cx="290" cy="145" r="3" fill="#C5965A" opacity="0.9"/>
                <circle cx="310" cy="158" r="2.5" fill="#C5965A" opacity="0.7"/>
                <text x="290" y="185" fill="#C5965A" fontSize="9" textAnchor="middle" opacity="0.6" fontFamily="sans-serif">Australia & NZ</text>

                {/* Asia region */}
                <ellipse cx="100" cy="90" rx="70" ry="50" stroke="#C5965A" strokeWidth="0.8" strokeDasharray="3 2"/>
                <circle cx="95" cy="80" r="3" fill="#C5965A" opacity="0.9"/>
                <circle cx="115" cy="100" r="2.5" fill="#C5965A" opacity="0.7"/>
                <circle cx="80" cy="95" r="2" fill="#C5965A" opacity="0.5"/>
                <text x="100" y="48" fill="#C5965A" fontSize="9" textAnchor="middle" opacity="0.6" fontFamily="sans-serif">Asia</text>

                {/* Connection arc */}
                <path d="M 165 90 Q 200 50 255 130" stroke="url(#grad1)" strokeWidth="1.5" strokeDasharray="5 3"/>
                <path d="M 165 90 Q 210 120 255 135" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="3 4" opacity="0.5"/>

                {/* Animated dots along path */}
                <circle cx="200" cy="62" r="2" fill="#D4AF7A" opacity="0.8"/>
                <circle cx="230" cy="95" r="1.5" fill="#D4AF7A" opacity="0.5"/>

                {/* AIME Horizon node */}
                <circle cx="200" cy="130" r="5" fill="#C5965A" opacity="0.3"/>
                <circle cx="200" cy="130" r="3" fill="#C5965A" opacity="0.7"/>
                <text x="200" y="150" fill="#C5965A" fontSize="8" textAnchor="middle" opacity="0.5" fontFamily="sans-serif">AIME Horizon</text>

                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C5965A" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#C5965A" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
              </svg>

              {/* Caption */}
              <p className="text-white/40 text-xs font-sans font-light text-center mt-4 tracking-wider">
                Cross-border Network · ANZ ↔ Asia
              </p>
            </div>

            {/* Small offset card */}
            <div className="absolute -bottom-3 -left-3 w-20 h-20 border border-gold/15 rounded-sm -z-10 hidden lg:block" />
          </div>

          {/* Right: Text */}
          <div className="order-1 lg:order-2">
            <div className="reveal">
              <span className="text-gold text-xs font-sans font-medium tracking-[0.3em] uppercase">
                {t("expertise.label")}
              </span>
            </div>
            <h2 className="reveal reveal-delay-1 font-serif text-4xl md:text-5xl font-light text-navy mt-4 mb-6 leading-tight">
              {t("expertise.title")}
            </h2>
            <div className="reveal reveal-delay-1">
              <span className="gold-divider mb-7" />
            </div>
            <p className="reveal reveal-delay-2 font-sans font-light text-navy/65 leading-relaxed mb-9">
              {t("expertise.body")}
            </p>

            {/* Capability points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {points.map((key, i) => (
                <div
                  key={key}
                  className={`reveal reveal-delay-${Math.min(i + 2, 6)} flex items-start gap-3`}
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span className="font-sans font-light text-navy/70 text-sm leading-relaxed">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
