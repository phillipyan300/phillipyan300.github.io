import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Terminal from "@/components/Terminal";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phillip Yan",
  description:
    "Phillip Yan — Columbia '25, CS + Math. Previously at Coinbase. Exploring energy markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black text-center text-sm font-medium py-1.5">
          Under Construction — This site is a work in progress!
        </div>
        <Nav />
        <main className="min-h-screen pt-22">{children}</main>
        <Footer />
        <Terminal />
      </body>
    </html>
  );
}
