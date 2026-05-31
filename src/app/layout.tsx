import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  fontLato,
  fontLora,
  fontMerriweather,
  fontOpenSans,
  fontPlayfairDisplay,
  fontRoboto,
} from "@/app/fonts";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://resummme.asaa.dev"),
  title: "Resummme | Resume Editor",
  description:
    "A free, open-source resume editor. Write once, preview instantly, export to PDF — no account required",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Resummme | Resume Editor",
    description:
      "A free, open-source resume editor. Write once, preview instantly, export to PDF — no account required",
    url: "/",
    siteName: "Resummme | Resume Editor",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resummme | Resume Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resummme | Resume Editor",
    description:
      "A free, open-source resume editor. Write once, preview instantly, export to PDF — no account required",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        inter.variable,
        geistMono.variable,
        fontLato.variable,
        fontOpenSans.variable,
        fontRoboto.variable,
        fontMerriweather.variable,
        fontPlayfairDisplay.variable,
        fontLora.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
