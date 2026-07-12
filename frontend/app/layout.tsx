import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BoardGameGuru — AI board game rules assistant",
  description:
    "Ask rules questions about Catan, Ticket to Ride, Pandemic, Carcassonne, and Codenames. Every answer is grounded in the official rulebooks, with sources cited.",
  openGraph: {
    title: "BoardGameGuru — AI board game rules assistant",
    description:
      "Ask rules questions about five classic board games. Every answer is grounded in the official rulebooks, with sources cited.",
    url: "https://board-game-guru.vercel.app",
    siteName: "BoardGameGuru",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
