"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, Record<Language, string>> = {
  // NAV
  "nav.home": { en: "Home", zh: "首页" },
  "nav.about": { en: "About", zh: "关于我们" },
  "nav.services": { en: "Services", zh: "服务" },
  "nav.sectors": { en: "Focus Sectors", zh: "重点领域" },
  "nav.expertise": { en: "Expertise", zh: "跨境专业" },
  "nav.leadership": { en: "Leadership", zh: "领导团队" },
  "nav.contact": { en: "Contact", zh: "联系我们" },

  // HERO
  "hero.title": {
    en: "Connecting Australia, New Zealand and Asia through strategy, partnerships and innovation.",
    zh: "以战略、伙伴关系与创新，连结澳洲、新西兰与亚洲。",
  },
  "hero.subtitle": {
    en: "AIME Horizon supports organisations with cross-border market entry, international business development, public relations, brand positioning and innovation-led growth across ANZ and Asia.",
    zh: "AIME Horizon 协助机构开展跨境市场进入、国际商务拓展、公共关系、品牌定位及创新驱动的业务增长——覆盖澳新与亚洲市场。",
  },
  "hero.cta.services": { en: "Explore Our Services", zh: "探索我们的服务" },
  "hero.cta.contact": { en: "Contact Us", zh: "联系我们" },

  // ABOUT
  "about.label": { en: "About AIME Horizon", zh: "关于 AIME Horizon" },
  "about.title": { en: "Your Gateway to the ANZ–Asia Corridor", zh: "澳新亚洲走廊的战略入口" },
  "about.body1": {
    en: "AIME Horizon is a strategic advisory firm focused on cross-border engagement between Australia, New Zealand and Asia. We work with businesses, educational institutions, government stakeholders and industry leaders to support international partnerships, market expansion and innovation-led growth.",
    zh: "AIME Horizon 是一家专注于澳洲、新西兰与亚洲跨境合作的战略咨询机构。我们与企业、教育机构、政府及产业伙伴合作，推动国际合作、市场拓展与创新驱动的发展机会。",
  },
  "about.body2": {
    en: "With deep expertise across both hemispheres, we translate cultural nuance into strategic advantage — helping our clients build meaningful, lasting relationships across borders.",
    zh: "凭借横跨两个半球的深厚专业知识，我们将文化差异转化为战略优势，帮助客户在跨境环境中建立有意义、可持续的合作关系。",
  },
  "about.stat1.value": { en: "ANZ–Asia", zh: "澳新–亚洲" },
  "about.stat1.label": { en: "Cross-border Focus", zh: "跨境专注领域" },
  "about.stat2.value": { en: "5", zh: "5" },
  "about.stat2.label": { en: "Key Industry Sectors", zh: "重点行业领域" },
  "about.stat3.value": { en: "360°", zh: "360°" },
  "about.stat3.label": { en: "Advisory Coverage", zh: "全方位咨询覆盖" },

  // SERVICES
  "services.label": { en: "Our Services", zh: "我们的服务" },
  "services.title": { en: "What We Do", zh: "服务内容" },
  "services.subtitle": {
    en: "Comprehensive advisory capabilities designed for the complexity of cross-border engagement.",
    zh: "专为跨境合作的复杂性而设计的全面咨询能力。",
  },
  "services.s1.title": { en: "International Business Development", zh: "国际商务拓展" },
  "services.s1.desc": {
    en: "Building strategic pipelines and commercial relationships across ANZ and Asian markets.",
    zh: "在澳新与亚洲市场构建战略业务管道与商业关系。",
  },
  "services.s2.title": { en: "Market Entry Strategy & Operations", zh: "市场进入战略与运营" },
  "services.s2.desc": {
    en: "End-to-end guidance for organisations entering new geographic markets with confidence.",
    zh: "为进入新市场的机构提供端到端指导，助力稳健落地。",
  },
  "services.s3.title": { en: "Public Relations & Strategic Communications", zh: "公共关系与战略传播" },
  "services.s3.desc": {
    en: "Crafting narratives that resonate across cultures and build lasting reputational equity.",
    zh: "打造跨文化共鸣的叙事，构建持久的品牌声誉资产。",
  },
  "services.s4.title": { en: "Brand Positioning", zh: "品牌定位" },
  "services.s4.desc": {
    en: "Positioning your organisation for credibility and impact in international contexts.",
    zh: "助力机构在国际环境中建立公信力与影响力。",
  },
  "services.s5.title": { en: "Government & Stakeholder Engagement", zh: "政府与利益相关方合作" },
  "services.s5.desc": {
    en: "Navigating complex stakeholder landscapes across public and private sectors.",
    zh: "协助客户驾驭公共与私营部门的复杂利益相关方环境。",
  },
  "services.s6.title": { en: "Cross-border Partnership Development", zh: "跨境伙伴关系建立" },
  "services.s6.desc": {
    en: "Identifying, structuring and nurturing high-value partnerships between ANZ and Asia.",
    zh: "识别、构建并培育澳新与亚洲之间的高价值合作关系。",
  },

  // SECTORS
  "sectors.label": { en: "Focus Sectors", zh: "重点领域" },
  "sectors.title": { en: "Where We Work", zh: "我们专注的行业" },
  "sectors.subtitle": {
    en: "Deep sector knowledge enabling precise, relevant advisory across five key industries.",
    zh: "深厚的行业知识，赋能五大关键产业的精准咨询服务。",
  },
  "sectors.s1": { en: "Education", zh: "教育" },
  "sectors.s1.desc": {
    en: "International student pathways, institutional partnerships and education export strategy.",
    zh: "国际留学通道、机构合作与教育出口战略。",
  },
  "sectors.s2": { en: "Energy", zh: "能源" },
  "sectors.s2.desc": {
    en: "Clean energy transition, resource investment and cross-border energy policy advisory.",
    zh: "清洁能源转型、资源投资与跨境能源政策咨询。",
  },
  "sectors.s3": { en: "Technology", zh: "科技" },
  "sectors.s3.desc": {
    en: "Tech ecosystem development, startup expansion and digital innovation partnerships.",
    zh: "科技生态建设、初创企业扩张与数字创新合作。",
  },
  "sectors.s4": { en: "Health & Wellness", zh: "大健康" },
  "sectors.s4.desc": {
    en: "Healthcare market entry, wellness industry partnerships and medtech collaboration.",
    zh: "医疗市场进入、健康产业合作与医疗科技协作。",
  },
  "sectors.s5": { en: "Innovation & Industry", zh: "创新与产业" },
  "sectors.s5.desc": {
    en: "R&D collaboration, industry clusters and innovation-led growth across the region.",
    zh: "研发合作、产业集群与创新驱动的区域增长。",
  },

  // EXPERTISE
  "expertise.label": { en: "Cross-border Expertise", zh: "跨境专业能力" },
  "expertise.title": { en: "Deeply Rooted in Both Markets", zh: "深耕双边市场" },
  "expertise.body": {
    en: "Our team brings first-hand experience operating across Australian, New Zealand and Asian business and government environments. We understand the nuances — cultural, regulatory and commercial — that determine success in cross-border engagements. This dual perspective is our greatest asset for clients.",
    zh: "我们的团队拥有在澳洲、新西兰及亚洲商业与政府环境中实际运营的丰富经验。我们深刻理解跨境合作成功所需的文化、监管与商业细节。这种双重视角，是我们为客户带来的最大价值。",
  },
  "expertise.p1": { en: "Bicultural insight and fluency", zh: "双文化洞察与流通" },
  "expertise.p2": { en: "Established networks across ANZ and Asia", zh: "澳新与亚洲成熟网络" },
  "expertise.p3": { en: "Cross-sector advisory experience", zh: "跨行业咨询经验" },
  "expertise.p4": { en: "Regulatory and market intelligence", zh: "监管与市场情报" },
  "expertise.p5": { en: "Trusted by government and private sector", zh: "获政府与私营机构信赖" },
  "expertise.p6": { en: "Long-term partnership philosophy", zh: "长期合作伙伴理念" },

  // LEADERSHIP
  "leadership.label": { en: "Leadership", zh: "领导团队" },
  "leadership.title": { en: "Our Founder", zh: "创始人" },
  "leadership.placeholder": {
    en: "Founder profile and biography coming soon.",
    zh: "创始人简介及履历即将发布。",
  },
  "leadership.cta": { en: "Get in Touch", zh: "联系我们" },

  // CONTACT
  "contact.label": { en: "Contact", zh: "联系我们" },
  "contact.title": { en: "Start a Conversation", zh: "开始对话" },
  "contact.subtitle": {
    en: "Whether you're exploring a new market, building a partnership or seeking strategic advisory — we'd welcome the conversation.",
    zh: "无论您是在探索新市场、建立合作关系，还是寻求战略咨询——我们期待与您深入交流。",
  },
  "contact.name": { en: "Full Name", zh: "姓名" },
  "contact.org": { en: "Organisation", zh: "机构" },
  "contact.email": { en: "Email Address", zh: "电子邮件" },
  "contact.interest": { en: "Area of Interest", zh: "感兴趣的领域" },
  "contact.message": { en: "Message", zh: "留言" },
  "contact.submit": { en: "Send Message", zh: "发送消息" },
  "contact.interest.placeholder": { en: "Select a service or sector…", zh: "选择服务或行业…" },
  "contact.message.placeholder": {
    en: "Tell us briefly about your organisation and what you're looking to achieve…",
    zh: "简要介绍您的机构及期望实现的目标…",
  },

  // NEWSLETTER
  "newsletter.label": { en: "Intelligence Briefing", zh: "市场情报简报" },
  "newsletter.title": { en: "Australia–China Business Insights", zh: "澳中商业洞察" },
  "newsletter.subtitle": {
    en: "Monthly intelligence on bilateral trade, policy, and market opportunities across the ANZ–Asia corridor — delivered to your inbox.",
    zh: "每月一期，覆盖澳中双边贸易、政策动态与市场机遇，直达您的邮箱。",
  },
  "newsletter.placeholder": { en: "Your email address", zh: "您的电子邮箱" },
  "newsletter.cta": { en: "Subscribe", zh: "立即订阅" },
  "newsletter.privacy": {
    en: "No spam. One email per month. Unsubscribe anytime.",
    zh: "无垃圾邮件，每月一封，随时退订。",
  },
  "newsletter.success": {
    en: "You're subscribed. Welcome aboard.",
    zh: "订阅成功，欢迎加入。",
  },
  "newsletter.pill1": { en: "Policy & Regulation", zh: "政策法规" },
  "newsletter.pill2": { en: "Trade & Investment", zh: "贸易与投资" },
  "newsletter.pill3": { en: "Sector Intelligence", zh: "行业情报" },
  "newsletter.pill4": { en: "Market Opportunities", zh: "市场机遇" },

  // FOOTER
  "footer.tagline": {
    en: "Strategic advisory for cross-border engagement between Australia, New Zealand and Asia.",
    zh: "专注澳新与亚洲跨境合作的战略咨询机构。",
  },
  "footer.rights": { en: "© 2026 AIME Horizon. All rights reserved.", zh: "© 2026 AIME Horizon 版权所有。" },
  "footer.website": { en: "www.aimehorizon.com", zh: "www.aimehorizon.com" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? translations[key]?.en ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
