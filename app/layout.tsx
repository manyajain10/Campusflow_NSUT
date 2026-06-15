import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner'

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "CampusFlow — NSUT Campus Assistant",
  description: "AI-powered campus assistant for NSUT students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`} style={{ backgroundColor: '#FAF9F6', color: '#0a0a0a' }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
