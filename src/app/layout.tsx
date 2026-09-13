// src/app/layout.tsx
import type { Metadata } from "next";
import { Cutive_Mono, Special_Elite } from "next/font/google";
import "./globals.css";
import { portfolioData } from "@/data/portfolio";

const cutiveMono = Cutive_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cutive-mono",
  display: "swap",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-special-elite",
  display: "swap",
});

const { config, profile } = portfolioData;

export const metadata: Metadata = {
  title: {
    default: config.title,
    template: `%s | ${profile.name} ${profile.nameItalic.replace(".", "")}`,
  },
  description: config.seoDescription,
  keywords: [
    "frontend developer",
    "react",
    "nextjs",
    "typescript",
    "portfolio",
    "indonesia",
  ],
  authors: [{ name: `${profile.name} ${profile.nameItalic.replace(".", "")}` }],
  openGraph: {
    title: config.title,
    description: config.seoDescription,
    type: "website",
    locale: "en_US",
    images: config.ogImage ? [config.ogImage] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: { url: "/icon.png", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cutiveMono.variable} ${specialElite.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
