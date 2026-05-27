# AIME Horizon — Website

A bilingual (EN/中文) professional website for AIME Horizon, a strategic advisory firm focused on cross-border engagement between Australia, New Zealand and Asia.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Fonts** — Cormorant Garamond (headings) + Inter (body)

---

## Getting Started

### Prerequisites

Make sure you have **Node.js 18+** installed.  
Check with: `node -v`

### 1. Install dependencies

```bash
cd aime-horizon
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm run start
```

---

## Project Structure

```
aime-horizon/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO metadata
│   │   ├── page.tsx            # Main page (assembles all sections)
│   │   └── globals.css         # Global styles, fonts, animations
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky nav with EN/ZH toggle + mobile menu
│   │   ├── Hero.tsx            # Full-screen hero section
│   │   ├── About.tsx           # About section with stats card
│   │   ├── Services.tsx        # 6-service grid
│   │   ├── FocusSectors.tsx    # 5 focus sectors (3+2 layout)
│   │   ├── CrossBorderExpertise.tsx  # Expertise section with map visual
│   │   ├── Leadership.tsx      # Founder placeholder + case study placeholders
│   │   ├── Contact.tsx         # Contact form with success state
│   │   └── Footer.tsx          # Site footer
│   ├── context/
│   │   └── LanguageContext.tsx # Bilingual context + all translations
│   └── hooks/
│       └── useReveal.ts        # Scroll-reveal utility hook
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `navy` | `#0B1F3A` | Primary background, text |
| `gold` | `#C5965A` | Accents, CTAs, highlights |
| `beige` | `#F5F0E8` | Light section backgrounds |
| `cream` | `#FAFAF7` | Off-white backgrounds |

---

## How to Update Content

All copy lives in **`src/context/LanguageContext.tsx`** in the `translations` object.  
Each key has an `en` and `zh` value — update them there and both languages update automatically.

### Adding the Founder Profile

In `src/components/Leadership.tsx`, replace the placeholder `<div>` with a real photo and bio.

### Adding Case Studies

In `src/components/Leadership.tsx`, the three placeholder cards at the bottom are ready to be populated.

### Contact Form

The form currently shows a success message on submit. To connect it to a real backend, edit the `handleSubmit` function in `src/components/Contact.tsx`.

---

## Deployment

The easiest option is [Vercel](https://vercel.com) — it supports Next.js out of the box:

```bash
npm install -g vercel
vercel
```

Or deploy to any Node.js host by running `npm run build && npm run start`.

---

## SEO

Meta title and description are set in `src/app/layout.tsx`.  
Update `openGraph.url` to your live domain when deploying.
