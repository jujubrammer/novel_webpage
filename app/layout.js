// app/layout.js
// ---------------------------------------------------------------------------
// The ROOT LAYOUT wraps every page in the app. Whatever you put here (fonts,
// <html>/<body> tags, site-wide headers/footers) appears on ALL pages.
// In Next.js you do NOT write <html> or <body> on individual pages — you
// write them once, here, and Next injects each page into `{children}`.
// ---------------------------------------------------------------------------

// `next/font/google` downloads Google Fonts at build time and serves them from
// your own site. That means no extra network request to Google when a visitor
// loads the page (faster + more private). We pick two fonts that fit an
// "ancient archive" mood:
//   - Cinzel: an engraved, Roman-inscription style — great for titles/headings.
//   - EB Garamond: a classic book serif — comfortable for long reading.
import { Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";

// Each font call returns an object with a CSS variable name we choose.
// We attach those variables to <html> below, then use them in globals.css.
const cinzel = Cinzel({
  variable: "--font-display", // used for headings/logos
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-body", // used for body text
  subsets: ["latin"],
});

// `metadata` is how Next.js sets the <title> and <meta> tags for the browser
// tab and search engines / link previews. No need to touch <head> by hand.
export const metadata = {
  title: "If You Had Known — World Archive",
  description:
    "The official encyclopedia and archive for the fantasy world of \"If You Had Known\" — characters, creatures, locations, and lore.",
};

export default function RootLayout({ children }) {
  return (
    // We add both font variables to the <html> tag so they're available
    // everywhere in our CSS as var(--font-display) and var(--font-body).
    <html lang="en" className={`${cinzel.variable} ${ebGaramond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
