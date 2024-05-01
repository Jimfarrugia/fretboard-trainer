import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fretboard Trainer",
  description: "Train your fretboard knowledge!",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C8CEDE" },
    { media: "(prefers-color-scheme: dark)", color: "#2C2E31" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-light-bg text-light-body dark:bg-dark-bg dark:text-dark-body`}
      >
        <Providers>
          <div className="container mx-auto min-h-svh max-w-md px-4 sm:max-w-4xl">
            <Header />
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
