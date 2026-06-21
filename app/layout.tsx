import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rent Check by AskBobAI — Fair-market rent & DSCR analysis",
  description:
    "Enter a property address to get an estimated fair-market rent backed by comparable rentals, plus a DSCR and cash-flow analysis. An AskBobAI tool.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* AskBobAI brand fonts: Figtree (system), Instrument Serif (accents),
            JetBrains Mono (numbers / metadata). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
