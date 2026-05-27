"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy"
    >
      {/* Background: abstract geometric lines suggesting cross-border connections */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-navy-light/40 blur-[80px]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(197,150,90,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(197,150,90,1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Horizon line — elegant SVG accent */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80 Q360 20 720 60 Q1080 100 1440 40 L1440 120 L0 120 Z"
            fill="rgba(245,240,232,0.04)"
          />
          <path
            d="M0 100 Q360 50 720 80 Q1080 110 1440 60 L1440 120 L0 120 Z"
            fill="rgba(197,150,90,0.06)"
          />
        </svg>

        {/* Decorative arc suggesting globe / horizon */}
        <svg
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.06]"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="500" cy="100" r="400" stroke="#C5965A" strokeWidth="1" />
          <circle cx="500" cy="100" r="300" stroke="#C5965A" strokeWidth="0.5" />
          <circle cx="500" cy="100" r="200" stroke="#C5965A" strokeWidth="0.5" />
          {/* Meridian lines */}
          <line x1="100" y1="0" x2="600" y2="600" stroke="#C5965A" strokeWidth="0.5" />
          <line x1="300" y1="0" x2="300" y2="600" stroke="#C5965A" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
          <span className="w-8 h-px bg-gold/60" />
          <span className="text-gold/80 text-xs font-sans font-light tracking-[0.3em] uppercase">
            Strategic Advisory
          </span>
          <span className="w-8 h-px bg-gold/60" />
        </div>

        {/* Main heading */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-[1.15] mb-8 animate-fade-up">
          {t("hero.title")}
        </h1>

        {/* Gold divider */}
        <div className="flex justify-center mb-8">
          <span className="gold-divider" />
        </div>

        {/* Subtitle */}
        <p className="font-sans font-light text-white/65 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-12 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          {t("hero.subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#services"
            className="group px-8 py-3.5 bg-gold text-navy font-sans font-medium text-sm tracking-wide rounded-sm hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5"
          >
            {t("hero.cta.services")}
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="group px-8 py-3.5 border border-white/25 text-white/80 font-sans font-light text-sm tracking-wide rounded-sm hover:border-gold/50 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            {t("hero.cta.contact")}
          </a>
        </div>

        {/* Country tags */}
        <div className="flex items-center justify-center gap-6 mt-16 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {["Australia", "New Zealand", "Asia"].map((region, i) => (
            <div key={region} className="flex items-center gap-3">
              <span className="text-white/40 font-sans text-xs font-light tracking-widest uppercase">
                {region}
              </span>
              {i < 2 && <span className="w-1 h-1 rounded-full bg-gold/40" />}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
        style={{ animationDelay: "0.8s" }}
      >
        <span className="text-white/30 text-[10px] font-sans tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
