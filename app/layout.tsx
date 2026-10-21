import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, Kalam } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });
const hand = Kalam({ variable: "--font-kalam", subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Safety Signs, Exit Lights & Evacuation Plans Manufacturer`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "safety signages",
    "safety signs manufacturer",
    "exit lights",
    "emergency lights",
    "photoluminescent signs",
    "evacuation plans",
    "floor marking tapes",
    "ISO 7010 signs",
    "Vasai",
    "Mumbai",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/brand/logo.png", width: 640, height: 414, alt: site.name }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d1d5c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${body.variable} ${display.variable} ${hand.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
