"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TeamMember {
  id: string;
  name: string;
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  tags: string[];
  tagsZh: string[];
  affiliationEn?: string;
  affiliationZh?: string;
  isAI: boolean;
  initials: string;
}

const realTeam: TeamMember[] = [
  {
    id: "joyce",
    name: "Joyce",
    titleEn: "Founder & Strategic Advisory Lead",
    titleZh: "创始人 & 战略咨询负责人",
    descEn: "Cross-border strategy specialist with deep expertise in ANZ–Asia market entry and international business development. Biography and full profile coming soon.",
    descZh: "跨境战略专家，深耕澳新亚市场进入与国际商务拓展。详细简介即将发布。",
    tags: ["Strategy", "Market Entry", "International Expansion"],
    tagsZh: ["战略咨询", "市场进入", "国际拓展"],
    affiliationEn: "University of Melbourne",
    affiliationZh: "墨尔本大学",
    isAI: false,
    initials: "J",
  },
  {
    id: "chi",
    name: "Chi",
    titleEn: "Co-founder & Industry Consulting Partner",
    titleZh: "联合创始人 & 产业咨询合伙人",
    descEn: "Specialist in cross-sector industry partnerships and market development across ANZ and Asian business environments. Biography coming soon.",
    descZh: "专注于澳新与亚洲市场的产业合作与跨行业发展，详细简介即将发布。",
    tags: ["Industry Advisory", "Partnerships", "Market Development"],
    tagsZh: ["产业咨询", "伙伴关系", "市场拓展"],
    affiliationEn: "University of Melbourne",
    affiliationZh: "墨尔本大学",
    isAI: false,
    initials: "C",
  },
  {
    id: "jay",
    name: "Jay",
    titleEn: "Co-founder & Education Consulting Partner",
    titleZh: "联合创始人 & 教育咨询合伙人",
    descEn: "Expert in international education pathways and institutional partnerships bridging Australian and Asian education ecosystems. Biography coming soon.",
    descZh: "国际教育通道与澳亚教育机构合作专家，详细简介即将发布。",
    tags: ["Education", "Institutional Partnerships", "Student Pathways"],
    tagsZh: ["教育咨询", "机构合作", "留学通道"],
    affiliationEn: "University of Melbourne",
    affiliationZh: "墨尔本大学",
    isAI: false,
    initials: "J",
  },
];

const aiTeam: TeamMember[] = [
  {
    id: "aria",
    name: "Aria",
    titleEn: "AI Market Intelligence Analyst",
    titleZh: "AI 市场情报分析师",
    descEn: "Delivers real-time market research, competitive intelligence and trend analysis across ANZ and Asian business landscapes to power strategic decision-making.",
    descZh: "提供实时市场研究、竞争情报与趋势分析，为澳新亚跨境战略决策提供数据支持。",
    tags: ["Market Research", "Data Analytics", "Trend Intelligence"],
    tagsZh: ["市场研究", "数据分析", "趋势情报"],
    isAI: true,
    initials: "A",
  },
  {
    id: "nova",
    name: "Nova",
    titleEn: "AI Digital Strategy Consultant",
    titleZh: "AI 数字化战略顾问",
    descEn: "Specialises in AI-driven digital transformation, cross-border brand strategy and online market entry optimisation across the ANZ–Asia corridor.",
    descZh: "专注于 AI 驱动的数字化转型、跨境品牌战略与澳新亚线上市场进入优化。",
    tags: ["Digital Strategy", "Brand Positioning", "Digital Transformation"],
    tagsZh: ["数字战略", "品牌定位", "数字化转型"],
    isAI: true,
    initials: "N",
  },
];

// Geometric avatar SVGs for each member
function Avatar({ member }: { member: TeamMember }) {
  if (member.isAI) {
    // AI: gold gradient with circuit-like pattern
    return (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id={`aiGrad-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C5965A" />
            <stop offset="100%" stopColor="#D4AF7A" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="38" fill={`url(#aiGrad-${member.id})`} />
        {/* Circuit lines */}
        <line x1="20" y1="40" x2="30" y2="40" stroke="#0B1F3A" strokeWidth="1" opacity="0.4"/>
        <line x1="50" y1="40" x2="60" y2="40" stroke="#0B1F3A" strokeWidth="1" opacity="0.4"/>
        <line x1="40" y1="20" x2="40" y2="30" stroke="#0B1F3A" strokeWidth="1" opacity="0.4"/>
        <line x1="40" y1="50" x2="40" y2="60" stroke="#0B1F3A" strokeWidth="1" opacity="0.4"/>
        <circle cx="40" cy="40" r="12" stroke="#0B1F3A" strokeWidth="1" opacity="0.25"/>
        {/* Initial */}
        <text
          x="40" y="46"
          textAnchor="middle"
          fill="#0B1F3A"
          fontSize="22"
          fontFamily="Georgia, serif"
          fontWeight="600"
          opacity="0.85"
        >
          {member.initials}
        </text>
      </svg>
    );
  }

  // Real person: navy with gold initial + subtle geometric accent
  const shapes: Record<string, JSX.Element> = {
    joyce: (
      <>
        <circle cx="64" cy="16" r="18" stroke="#C5965A" strokeWidth="0.8" opacity="0.2"/>
        <circle cx="64" cy="16" r="10" stroke="#C5965A" strokeWidth="0.6" opacity="0.15"/>
      </>
    ),
    chi: (
      <>
        <polygon points="70,10 78,26 62,26" stroke="#C5965A" strokeWidth="0.8" fill="none" opacity="0.2"/>
        <line x1="16" y1="64" x2="30" y2="64" stroke="#C5965A" strokeWidth="0.8" opacity="0.15"/>
      </>
    ),
    jay: (
      <>
        <rect x="58" y="8" width="18" height="18" stroke="#C5965A" strokeWidth="0.8" fill="none" opacity="0.2" transform="rotate(15 67 17)"/>
      </>
    ),
  };

  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#0B1F3A" />
      <circle cx="40" cy="40" r="38" stroke="#C5965A" strokeWidth="0.5" opacity="0.3"/>
      {shapes[member.id]}
      <text
        x="40" y="47"
        textAnchor="middle"
        fill="#C5965A"
        fontSize="26"
        fontFamily="Georgia, serif"
        fontWeight="500"
      >
        {member.initials}
      </text>
    </svg>
  );
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  return (
    <div
      className={`reveal reveal-delay-${Math.min(index + 1, 6)} group relative bg-white border border-navy/6 rounded-sm p-7 card-lift overflow-hidden`}
    >
      {/* Hover tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-navy/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* AI badge */}
      {member.isAI && (
        <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-navy/5 border border-navy/10 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-[9px] font-sans font-medium text-navy/50 tracking-widest uppercase">AI Staff</span>
        </div>
      )}

      {/* Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden mb-5 ring-1 ring-navy/10 group-hover:ring-gold/30 transition-all duration-300">
        <Avatar member={member} />
      </div>

      {/* Name + title */}
      <h3 className="font-serif text-xl font-medium text-navy mb-1 leading-snug">
        {member.name}
      </h3>
      <p className="font-sans text-xs font-medium text-gold tracking-wide mb-3 leading-snug">
        {zh ? member.titleZh : member.titleEn}
      </p>

      {/* Affiliation */}
      {member.affiliationEn && (
        <div className="flex items-center gap-1.5 mb-4">
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-navy/30 flex-shrink-0">
            <path d="M1 5 L6 2 L11 5 L11 10 L1 10 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
            <rect x="4" y="7" width="4" height="3" stroke="currentColor" strokeWidth="0.8"/>
          </svg>
          <span className="text-navy/40 font-sans text-[10px] font-light tracking-wide">
            {zh ? member.affiliationZh : member.affiliationEn}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="font-sans font-light text-navy/55 text-sm leading-relaxed mb-5">
        {zh ? member.descZh : member.descEn}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {(zh ? member.tagsZh : member.tags).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-sans font-light text-navy/45 border border-navy/10 rounded-sm px-2 py-0.5 tracking-wide"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom accent */}
      <div className="mt-5 w-0 h-px bg-gold transition-all duration-500 group-hover:w-8" />
    </div>
  );
}

export default function Leadership() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const zh = lang === "zh";

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
      { threshold: 0.06, rootMargin: "0px 0px -60px 0px" }
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
            {zh ? "我们的团队" : "Our Team"}
          </h2>
          <div className="reveal reveal-delay-1 flex justify-center mt-5 mb-5">
            <span className="gold-divider" />
          </div>
          <p className="reveal reveal-delay-2 font-sans font-light text-navy/55 max-w-xl mx-auto leading-relaxed">
            {zh
              ? "经验丰富的跨境战略顾问团队，结合 AI 技术赋能，为客户提供全面的澳新亚市场支持。"
              : "An experienced cross-border advisory team, augmented by AI-powered capabilities to deliver comprehensive ANZ–Asia market support."}
          </p>
        </div>

        {/* Real team — 3 columns */}
        <div className="reveal reveal-delay-1 mb-3">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-navy/30 text-[10px] font-sans font-medium tracking-[0.25em] uppercase">
              {zh ? "核心顾问团队" : "Advisory Team"}
            </span>
            <span className="flex-1 h-px bg-navy/8" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {realTeam.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {/* AI virtual staff — 2 columns centred */}
        <div className="reveal reveal-delay-2 mb-3">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gold/70 text-[10px] font-sans font-medium tracking-[0.25em] uppercase">
              {zh ? "AI 虚拟员工" : "AI-Powered Staff"}
            </span>
            <span className="flex-1 h-px bg-gold/15" />
            <div className="flex items-center gap-1.5 border border-gold/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" />
              <span className="text-[9px] font-sans text-gold/60 tracking-widest uppercase">
                {zh ? "AI 驱动" : "AI Powered"}
              </span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {aiTeam.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i + 3} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="reveal reveal-delay-4 text-center mt-16">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-gold font-sans text-sm font-medium hover:text-gold-dark transition-colors duration-300 group"
          >
            {t("leadership.cta")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
