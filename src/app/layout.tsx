import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIFA WC 2026 Predictor — VIP FIFA World Cup Bracket Game",
  description: "Predict FIFA World Cup 2026 matches, compete with friends, and climb the leaderboard. Real scoring, bragging rights.",
  keywords: "World Cup, 2026, FIFA, predictions, bracket, football, soccer",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-vintage-forest text-vintage-cream grain-overlay overflow-x-hidden" suppressHydrationWarning>
        <SessionProvider session={session}>
          <Header />
          <main id="main-content" className="min-h-screen pt-[66px] flex flex-col">{children}</main>
          <Footer />
        </SessionProvider>
        <Toaster position="top-right" theme="dark" toastOptions={{ style: { background: '#1c1c1c', border: '1px solid #333', color: '#fff' } }} />
      </body>
    </html>
  );
}
