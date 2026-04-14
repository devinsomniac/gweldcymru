// app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GweldCymru — See Wales. Know Your Neighbourhood.",
  description:
    "Explore Welsh neighbourhood data using live geospatial layers from DataMapWales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="font-[family-name:var(--font-body)]">
        <div className="grid grid-cols-[390px_1fr] grid-rows-[auto_1fr] h-screen">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}