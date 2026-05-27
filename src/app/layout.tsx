import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "AIME Horizon | Strategic Advisory — Australia, New Zealand & Asia",
  description:
    "AIME Horizon is a strategic advisory firm specialising in cross-border engagement between Australia, New Zealand and Asia. International business development, market entry, stakeholder engagement and brand positioning.",
  keywords: [
    "strategic advisory",
    "Australia Asia business",
    "New Zealand Asia",
    "cross-border consulting",
    "market entry ANZ",
    "international business development",
    "AIME Horizon",
  ],
  openGraph: {
    title: "AIME Horizon | Strategic Advisory — ANZ & Asia",
    description:
      "Cross-border strategic advisory between Australia, New Zealand and Asia. Market entry, business development, stakeholder engagement.",
    url: "https://www.aimehorizon.com",
    siteName: "AIME Horizon",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
