import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EcoTrack",
    template: "%s — EcoTrack",
  },
  description: "Monitorea tu reciclaje y mide tu impacto ecológico. ODS 11 · 12 · 13.",
  openGraph: {
    title: "EcoTrack",
    description: "Monitorea tu reciclaje y mide tu impacto ecológico.",
    url: "https://ecotrack-frontend-beta.vercel.app/",
    siteName: "EcoTrack",
    images: [
      {
        url: "/ecotrack-logo.webp",
        width: 800,
        height: 600,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
