import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Intube Music - Your Music, Your Way",
  description: "Stream millions of songs, watch music videos, discover new artists. India's premier music streaming platform.",
  keywords: ["music", "streaming", "songs", "playlists", "Indian music", "Bollywood"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full bg-black text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
