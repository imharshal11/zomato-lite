import type { Metadata, Viewport } from "next";
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
  title: "Zomato Lite",
  description: "Discover and review restaurants",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <main className="flex-1">{children}</main>
        <footer className="bg-[#0a0a0a] border-t border-[#1f1f1f] py-4 z-10 relative">
          <div className="w-full px-4 sm:max-w-[560px] sm:mx-auto text-center">
            <p className="text-xs sm:text-sm text-[#9ca3af]">
              All Rights Reserved &copy; 2026 | Built by Harshal
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}