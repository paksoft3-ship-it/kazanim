import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import "./globals.css";

import { getSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B1E3A",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.defaultSeoTitle,
      template: `%s | ${settings.companyName}`,
    },
    description: settings.defaultSeoDescription,
    applicationName: settings.companyName,
    ...(settings.googleSiteVerification
      ? { verification: { google: settings.googleSiteVerification } }
      : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${manrope.variable} scroll-smooth`}
    >
      <body>{children}</body>
    </html>
  );
}
