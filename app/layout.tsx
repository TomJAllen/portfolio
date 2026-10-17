import "@fontsource-variable/jost";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";

const SITE_URL = "https://tomjallen.me";
const DESCRIPTION =
  "Tom J Allen (Thomas James Allen) is a Sydney-based AI platform and product leader specialising in ontology, knowledge graphs and semantic data models.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tom J Allen | AI platform & ontology, Sydney",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: "Tom J Allen",
    title: "Tom J Allen | Order from chaos, done beautifully",
    description: DESCRIPTION,
    locale: "en_AU",
  },
  twitter: {
    card: "summary",
    title: "Tom J Allen",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2ECE1" },
    { media: "(prefers-color-scheme: dark)", color: "#1B1B1B" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tom J Allen",
  alternateName: ["Thomas James Allen", "Tom Allen"],
  url: SITE_URL,
  email: "mailto:hello@tomjallen.me",
  jobTitle: "Ontology & Standards Manager",
  worksFor: { "@type": "Organization", name: "Decidr" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressRegion: "NSW",
    addressCountry: "AU",
  },
  knowsAbout: [
    "Ontology",
    "Knowledge graphs",
    "Semantic data models",
    "AI platforms",
    "Product management",
  ],
  sameAs: ["https://linkedin.com/in/tom-j-allen", "https://github.com/TomJAllen"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        {/* Apply a saved theme choice before first paint, so there is no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
