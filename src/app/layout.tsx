import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";
import { ThemeInitScript } from "@/components/ThemeToggle";
import { PwaRegistration } from "@/components/PwaRegistration";
import frenchLogo from "../../french-logo.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Language Tools",
  description: "Interactive language learning games",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Language Tools",
    statusBarStyle: "default",
  },
  icons: {
    icon: frenchLogo.src,
    shortcut: frenchLogo.src,
    apple: frenchLogo.src,
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-full flex flex-col">
        <PwaRegistration />
        <AppHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-border bg-background/95 px-6 py-4 text-center text-sm text-muted-foreground backdrop-blur">
          <p>
            French frequency data adapted from{' '}
            <a
              href="https://github.com/hermitdave/FrequencyWords"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              hermitdave/FrequencyWords
            </a>{' '}
            and credited under{' '}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              CC BY-SA 4.0
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
