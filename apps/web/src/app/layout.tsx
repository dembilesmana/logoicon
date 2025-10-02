import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@logoicon/util";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "LogoIcon - Beautiful Icon Library",
  description:
    "Discover thousands of high-quality icons for your projects. Search, filter, and download SVG icons from top brands.",
  keywords: ["icons", "svg", "logos", "brands", "ui", "design"],
  authors: [{ name: "LogoIcon Team" }]
  // viewport: "width=device-width, initial-scale=1", // INFO: must be self exported
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          "bg-hero-50 dark:bg-hero-900 transition-colors duration-300"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto px-4 pt-8 pb-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
