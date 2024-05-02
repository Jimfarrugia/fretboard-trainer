import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "Fretboard Trainer";
const APP_DEFAULT_TITLE = "Fretboard Trainer";
const APP_TITLE_TEMPLATE = "%s - Fretboard Trainer";
const APP_DESCRIPTION =
  "Train your fretboard knowledge with Fretboard Trainer.";

export const metadata: Metadata = {
  title: "Fretboard Trainer",
  description: "Train your fretboard knowledge!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
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
