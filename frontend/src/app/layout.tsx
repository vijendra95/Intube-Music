import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "IntubeMedia.live - 24/7 YouTube Live Streaming Platform",
  description:
    "Stream your pre-recorded videos 24/7 on YouTube, Facebook, Twitch and more. No PC required. 99.9% uptime guaranteed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} bg-[#0f0a1e] text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
