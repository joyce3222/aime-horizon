"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { key: "nav.about", href: "#about" },
  { key: "nav.services", href: "#services" },
  { key: "nav.sectors", href: "#sectors" },
  { key: "nav.expertise", href: "#expertise" },
  { key: "nav.leadership", href: "#leadership" },
  { key: "nav.contact", href: "#contact" },
];

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-lg shadow-navy/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex flex-col leading-none group">
          <span className="font-serif text-xl font-semibold tracking-wide text-white group-hover:text-gold transition-colors duration-300">
            AIME Horizon
          </span>
          <span className="text-gold/70 text-[10px] tracking-[0.2em] uppercase mt-0.5 font-sans font-light">
            Strategic Advisory
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-white/80 hover:text-gold text-sm font-sans font-light tracking-wide transition-colors duration-300 relative group"
            >
              {t(link.key)}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          {/* Language toggle */}
          <div className="flex items-center border border-white/20 rounded-full overflow-hidden ml-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-xs font-sans font-medium tracking-wider transition-all duration-300 ${
                lang === "en" ? "bg-gold text-navy" : "text-white/60 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("zh")}
              className={`px-3 py-1 text-xs font-sans font-medium tracking-wider transition-all duration-300 ${
                lang === "zh" ? "bg-gold text-navy" : "text-white/60 hover:text-white"
              }`}
            >
              中文
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          <div className="flex items-center border border-white/20 rounded-full overflow-hidden">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-[10px] font-sans font-medium transition-all duration-300 ${
                lang === "en" ? "bg-gold text-navy" : "text-white/60"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("zh")}
              className={`px-2.5 py-1 text-[10px] font-sans font-medium transition-all duration-300 ${
                lang === "zh" ? "bg-gold text-navy" : "text-white/60"
              }`}
            >
              中文
            </button>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            <div className="w-5 space-y-1.5">
              <span
                className={`block h-px bg-white transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-px bg-white transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px bg-white transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-navy/97 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-white/80 hover:text-gold font-sans font-light text-sm tracking-wide transition-colors duration-300"
            >
              {t(link.key)}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
