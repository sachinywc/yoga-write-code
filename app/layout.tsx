import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Yoga Write Code", template: "%s · Yoga Write Code" },
  description: "AI content operating system for SaaS companies.",
  icons: { icon: "/icon.svg" },
  verification: {
    google: "tL8-FZhkoHwlI57LESE58csCvMLzdQRxxCi6Cs6d7bc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}