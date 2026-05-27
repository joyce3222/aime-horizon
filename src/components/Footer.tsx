"use client";

import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { key: "nav.about", href: "#about" },
  { key: "nav.services", href: "#services" },
  { key: "nav.sectors", href: "#sectors" },
  { key: "nav.expertise", href: "#expertise" },
  { key: "nav.leadership", href: "#leadership" },
  { key: "nav.contact", href: "#contact" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-dark border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-4">
              <span className="font-serif text-lg font-semibold text-white tracking-wide">
                AIME Horizon
              </span>
              <span className="text-gold/60 text-[9px] tracking-[0.25em] uppercase mt-1 font-sans font-light">
                Strategic Advisory
              </span>
            </div>
            <p className="font-sans font-light text-white/35 text-xs leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-white/30 text-[9px] font-sans font-medium tracking-[0.25em] uppercase mb-4">
              Navigation
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-white/40 hover:text-gold text-xs font-sans font-light tracking-wide transition-colors duration-300"
                >
                  {t(link.key)}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/30 text-[9px] font-sans font-medium tracking-[0.25em] uppercase mb-4">
              Connect
            </p>
            <div className="space-y-2">
              <a
                href="mailto:joycez@aimehorizon.com"
                className="block text-white/40 hover:text-gold text-xs font-sans font-light transition-colors duration-300"
              >
                joycez@aimehorizon.com
              </a>
              <a
                href="https://www.aimehorizon.com"
                className="block text-white/40 hover:text-gold text-xs font-sans font-light transition-colors duration-300"
              >
                {t("footer.website")}
              </a>
              <p className="text-white/25 text-xs font-sans font-light">
                Australia · New Zealand · Asia
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-[10px] font-sans font-light tracking-wide">
            {t("footer.rights")}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-4 h-px bg-gold/30" />
            <span className="text-gold/40 text-[10px] font-sans tracking-widest uppercase">
              ANZ ↔ ASIA
            </span>
            <span className="w-4 h-px bg-gold/30" />
          </div>
        </div>
      </div>
    </footer>
  );
}
