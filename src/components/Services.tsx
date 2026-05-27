"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const serviceIcons = [
  // Globe with connections
  <svg key="s1" viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2" />
    <ellipse cx="16" cy="16" rx="5" ry="12" stroke="currentColor" strokeWidth="1.2" />
    <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.2" />
    <line x1="7" y1="9" x2="25" y2="9" stroke="currentColor" strokeWidth="1" />
    <line x1="7" y1="23" x2="25" y2="23" stroke="currentColor" strokeWidth="1" />
  </svg>,
  // Map pin / arrow
  <svg key="s2" viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <path d="M16 4 L28 16 L22 16 L22 28 L10 28 L10 16 L4 16 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>,
  // Broadcast / signal
  <svg key="s3" viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <circle cx="16" cy="20" r="3" fill="currentColor" opacity="0.8" />
    <path d="M9 27 Q7 22 9 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M23 27 Q25 22 23 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5 30 Q2 22 5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M27 30 Q30 22 27 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>,
  // Diamond / brand
  <svg key="s4" viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <polygon points="16,4 28,14 16,28 4,14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <line x1="4" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1" />
    <line x1="10" y1="4" x2="16" y2="14" stroke="currentColor" strokeWidth="0.8" />
    <line x1="22" y1="4" x2="16" y2="14" stroke="currentColor" strokeWidth="0.8" />
  </svg>,
  // Building / government
  <svg key="s5" viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <rect x="4" y="14" width="24" height="14" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 14 L16 4 L30 14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <rect x="12" y="20" width="8" height="8" stroke="currentColor" strokeWidth="1" />
    <line x1="8" y1="14" x2="8" y2="28" stroke="currentColor" strokeWidth="0.8" />
    <line x1="24" y1="14" x2="24" y2="28" stroke="currentColor" strokeWidth="0.8" />
  </svg>,
  // Handshake / link
  <svg key="s6" viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <path d="M4 18 L10 14 L16 16 L22 12 L28 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 22 L10 18 L16 20 L22 16 L28 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="1.2" />
  </svg>,
];

const serviceKeys = ["s1", "s2", "s3", "s4", "s5", "s6"];

export default function Services() {
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
    <section id="services" ref={sectionRef} className="py-28 bg-cream grid-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal">
            <span className="text-gold text-xs font-sans font-medium tracking-[0.3em] uppercase">
              {t("services.label")}
            </span>
          </div>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl md:text-5xl font-light text-navy mt-4 mb-5 leading-tight">
            {t("services.title")}
          </h2>
          <div className="reveal reveal-delay-1 flex justify-center mb-5">
            <span className="gold-divider" />
          </div>
          <p className="reveal reveal-delay-2 font-sans font-light text-navy/60 max-w-xl mx-auto leading-relaxed">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceKeys.map((key, i) => (
            <div
              key={key}
              className={`reveal reveal-delay-${Math.min(i + 1, 6)} card-lift bg-white border border-navy/6 rounded-sm p-8 group`}
            >
              <div className="text-gold mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 inline-block">
                {serviceIcons[i]}
              </div>
              <h3 className="font-serif text-xl font-medium text-navy mb-3 leading-snug">
                {t(`services.${key}.title`)}
              </h3>
              <p className="font-sans font-light text-navy/60 text-sm leading-relaxed">
                {t(`services.${key}.desc`)}
              </p>
              <div className="mt-5 w-0 h-px bg-gold transition-all duration-500 group-hover:w-8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
