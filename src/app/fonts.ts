import {
  Lato,
  Lora,
  Merriweather,
  Open_Sans,
  Playfair_Display,
  Roboto,
} from "next/font/google";

// These fonts are only used inside the editor's resume preview (selected per
// template at runtime). `preload: false` keeps them off the critical path on
// every route — most importantly the landing page, which never uses them. They
// still load on demand (display: swap) when a template actually selects them.
export const fontLato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
  preload: false,
});

export const fontOpenSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  preload: false,
});

export const fontRoboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
  preload: false,
});

export const fontMerriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
  display: "swap",
  preload: false,
});

export const fontPlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  preload: false,
});

export const fontLora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  preload: false,
});
