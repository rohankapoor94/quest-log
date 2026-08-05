import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cinzel } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Quest Log — Gamified Daily Task & Habit Tracker",
  description:
    "Turn daily routines into an RPG adventure. Complete quests, earn XP & Gold, level up, maintain streaks, and forge habits with Quest Log.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} dark antialiased`}
    >
      <body className="min-h-dvh bg-background text-foreground">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
