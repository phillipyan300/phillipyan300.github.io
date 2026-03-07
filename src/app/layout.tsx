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
        <Nav />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <Terminal />
      </body>
    </html>
  );
}
