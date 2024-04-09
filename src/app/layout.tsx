import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fretboard Trainer",
  description: "Train your fretboard knowledge!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-bg text-dark-body`}>
        <div className="container mx-auto max-w-md sm:max-w-4xl px-4">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
