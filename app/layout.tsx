import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSCR Rental Check — Fair-Market Rent & DSCR Analysis",
  description:
    "Enter a property address to get an estimated fair-market rent backed by comparable rentals, plus a DSCR and cash-flow analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
