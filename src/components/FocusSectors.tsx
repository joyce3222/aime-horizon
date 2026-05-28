"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SectorItem {
  key: string;
  icon: ReactNode;
  color: string;
  accent: string;
}

const sectorData: SectorItem[] = [
  {
    key: "s1",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M8 32 L8 20 L20 12 L32 20 L32 32" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <rect x="15" y="24" width="10" height="8" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M4 20 L20 8 L36 20" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <line x1="14" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    color: "from-blue-900/30 to-navy/50",
    accent: "border-blue-400/20",
  },
  {
    key: "s2",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M20 8 L20 32" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M12 14 L28 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M14 26 Q20 18 26 26" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3"/>
      </svg>
    ),
    color: "from-emerald-900/30 to-navy/50",
    accent: "border-emerald-400/20",
  },
  {
    key: "s3",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect x="8" y="12" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="12" y1="28" x2="12" y2="32" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="28" y1="28" x2="28" y2="32" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="8" y1="32" x2="32" y2="32" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="25" y1="15" x2="30" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    color: "from-purple-900/30 to-navy/50",
    accent: "border-purple-400/20",
  },
  {
    key: "s4",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M20 10 C14 10 9 15 9 21 C9 27 14 32 20 32 C26 32 31 27 31 21 C31 15 26 10 20 10Z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M15 21 L18 24 L25 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 6 L20 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M20 32 L20 36" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    color: "from-rose-900/30 to-navy/50",
    accent: "border-rose-400/20",
  },
  {
    key: "s5",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <polygon points="20,8 32,24 20,32 8,24" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="8" y1="24" x2="14" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <line x1="32" y1="24" x2="26" y2="20" strokeWidth="1" stroke="currentColor" strokeLinecap="round"/>
        <line x1="20" y1="8" x2="20" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    color: "from-amber-900/30 to-navy/50",
    accent: "border-amber-400/20",
  },
];

export default function FocusSectors() {
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
    <section id="sectors" ref={sectionRef} className="py-28 bg-navy relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle aerial city photo — barely visible, adds depth */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1559628233-100c798642d5?auto=format&fit=crop&w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.07]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold/4 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(197,150,90,1) 1px, transparent 1px), linear-gradient(90deg, rgba(197,150,90,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal">
            <span className="text-gold text-xs font-sans font-medium tracking-[0.3em] uppercase">
              {t("sectors.label")}
            </span>
          </div>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl md:text-5xl font-light text-white mt-4 mb-5 leading-tight">
            {t("sectors.title")}
          </h2>
          <div className="reveal reveal-delay-1 flex justify-center mb-5">
            <span className="gold-divider" />
          </div>
          <p className="reveal reveal-delay-2 font-sans font-light text-white/50 max-w-xl mx-auto leading-relaxed">
            {t("sectors.subtitle")}
          </p>
        </div>

        {/* Sectors: 3 + 2 centred layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {sectorData.slice(0, 3).map((s, i) => (
            <SectorCard key={s.key} s={s} i={i} t={t} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {sectorData.slice(3).map((s, i) => (
            <SectorCard key={s.key} s={s} i={i + 3} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectorCard({
  s,
  i,
  t,
}: {
  s: SectorItem;
  i: number;
  t: (k: string) => string;
}) {
  return (
    <div
      className={`reveal reveal-delay-${Math.min(i + 1, 6)} group relative bg-white/5 border border-white/8 rounded-sm p-8 overflow-hidden hover:bg-white/8 hover:border-gold/20 transition-all duration-400 cursor-default`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      <div className="relative z-10">
        <div className="text-gold/70 group-hover:text-gold mb-5 transition-colors duration-300">
          {s.icon}
        </div>
        <h3 className="font-serif text-xl font-medium text-white mb-3">
          {t(`sectors.${s.key}`)}
        </h3>
        <p className="font-sans font-light text-white/50 text-sm leading-relaxed group-hover:text-white/65 transition-colors duration-300">
          {t(`sectors.${s.key}.desc`)}
        </p>
        <div className="mt-5 w-0 h-px bg-gold transition-all duration-500 group-hover:w-8" />
      </div>
    </div>
  );
}
