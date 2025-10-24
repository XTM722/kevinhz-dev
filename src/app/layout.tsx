"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react"; // ✅ Added import

const Navbar = dynamic(() => import("@/components/NavBar"), { ssr: false });

const geistSans = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Wrap everything inside SessionProvider */}
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
              <Navbar />
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
