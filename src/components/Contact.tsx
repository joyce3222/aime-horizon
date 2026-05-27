"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    org: "",
    email: "",
    interest: "",
    message: "",
  });

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
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const interestOptions = [
    "International Business Development",
    "Market Entry Strategy",
    "Public Relations & Communications",
    "Brand Positioning",
    "Government & Stakeholder Engagement",
    "Cross-border Partnership",
    "Education Sector",
    "Energy Sector",
    "Technology Sector",
    "Health & Wellness Sector",
    "Innovation & Industry",
    "Other",
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-28 bg-navy relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(197,150,90,1) 1px, transparent 1px), linear-gradient(90deg, rgba(197,150,90,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Left: heading + details */}
          <div className="lg:col-span-2">
            <div className="reveal">
              <span className="text-gold text-xs font-sans font-medium tracking-[0.3em] uppercase">
                {t("contact.label")}
              </span>
            </div>
            <h2 className="reveal reveal-delay-1 font-serif text-4xl md:text-5xl font-light text-white mt-4 mb-6 leading-tight">
              {t("contact.title")}
            </h2>
            <div className="reveal reveal-delay-1">
              <span className="gold-divider mb-7" />
            </div>
            <p className="reveal reveal-delay-2 font-sans font-light text-white/55 leading-relaxed mb-10">
              {t("contact.subtitle")}
            </p>

            {/* Contact details */}
            <div className="reveal reveal-delay-3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-gold/25 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-gold">
                    <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M8 2 C5 2 2 4.5 2 7.5 C2 11 8 15 8 15 C8 15 14 11 14 7.5 C14 4.5 11 2 8 2Z" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </div>
                <span className="font-sans font-light text-white/55 text-sm">
                  Australia · New Zealand · Asia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-gold/25 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-gold">
                    <rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M2 5 L8 9.5 L14 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <a
                  href="mailto:joycez@aimehorizon.com"
                  className="font-sans font-light text-white/55 text-sm hover:text-gold transition-colors duration-300"
                >
                  joycez@aimehorizon.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-gold/25 rounded-sm flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-gold">
                    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <ellipse cx="8" cy="8" rx="2" ry="5" stroke="currentColor" strokeWidth="1"/>
                    <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
                <a
                  href="https://www.aimehorizon.com"
                  className="font-sans font-light text-white/55 text-sm hover:text-gold transition-colors duration-300"
                >
                  www.aimehorizon.com
                </a>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3 reveal reveal-delay-2">
            {submitted ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-16">
                  <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-gold">
                      <path d="M5 13 L9 17 L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-light text-white mb-3">Thank you</h3>
                  <p className="font-sans font-light text-white/50 text-sm">
                    We'll be in touch shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/5 border border-white/8 rounded-sm p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    label={t("contact.name")}
                    type="text"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    required
                  />
                  <FormField
                    label={t("contact.org")}
                    type="text"
                    value={form.org}
                    onChange={(v) => setForm({ ...form, org: v })}
                  />
                </div>
                <FormField
                  label={t("contact.email")}
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                />
                <div>
                  <label className="block font-sans font-light text-white/50 text-xs tracking-widest uppercase mb-2">
                    {t("contact.interest")}
                  </label>
                  <select
                    value={form.interest}
                    onChange={(e) => setForm({ ...form, interest: e.target.value })}
                    className="w-full bg-white/5 border border-white/12 rounded-sm px-4 py-3 text-white/80 font-sans font-light text-sm focus:outline-none focus:border-gold/40 transition-colors duration-300 appearance-none"
                  >
                    <option value="" className="bg-navy">
                      {t("contact.interest.placeholder")}
                    </option>
                    {interestOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-navy">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-sans font-light text-white/50 text-xs tracking-widest uppercase mb-2">
                    {t("contact.message")}
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t("contact.message.placeholder")}
                    className="w-full bg-white/5 border border-white/12 rounded-sm px-4 py-3 text-white/80 font-sans font-light text-sm focus:outline-none focus:border-gold/40 transition-colors duration-300 resize-none placeholder:text-white/25"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-light text-navy font-sans font-medium text-sm tracking-wide py-4 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 group"
                >
                  {t("contact.submit")}
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-sans font-light text-white/50 text-xs tracking-widest uppercase mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-white/5 border border-white/12 rounded-sm px-4 py-3 text-white/80 font-sans font-light text-sm focus:outline-none focus:border-gold/40 transition-colors duration-300 placeholder:text-white/20"
      />
    </div>
  );
}
