import type { Metadata, Viewport } from "next";
import { Public_Sans, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { RouteTransition } from "@/components/chrome/RouteTransition";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Curtain } from "@/components/chrome/Curtain";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-schibsted",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Marketing and engineering, one team`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "marketing agency",
    "brand building",
    "web development",
    "app development",
    "AI workflows",
    "product consulting",
    site.contact.city,
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.shortDescription,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a1733",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${schibsted.variable} ${publicSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* The intro curtain plays once per session. Marks repeat loads before
            first paint, and marks the intro done once it has played. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement;if(sessionStorage.getItem("bb-intro")){d.dataset.intro="seen"}else{sessionStorage.setItem("bb-intro","1");setTimeout(function(){d.dataset.intro="seen"},2400)}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        <Curtain />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:rounded-full focus:bg-saffron focus:px-5 focus:py-3 focus:font-bold focus:text-midnight"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <RouteTransition />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
