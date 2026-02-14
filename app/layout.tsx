import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import { MathJaxContext } from "better-react-mathjax";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const monsterrat = Montserrat({
  variable: "--font-monsterrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eclipse",
  description: "Created by Phoenix",
};

const configMath = {
  loader: { load: ["input/tex", "output/svg"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
  },
  options: {
    enableMenu: false, // Disabling the context menu speeds up initial rendering
    renderActions: {
      addMenu: [], // Further optimizes performance by removing menu logic
    },
  },
  svg: {
    fontCache: "global",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          fontFamily: monsterrat.style.fontFamily,
        },
        theme: dark,
      }}
    >
      <html lang="en" className="dark">
        <MathJaxContext config={configMath}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased ubuntu-medium selection:bg-secondary focus-glow`}
          >
            <main>{children}</main>
            <Toaster />
          </body>
        </MathJaxContext>
      </html>
    </ClerkProvider>
  );
}
