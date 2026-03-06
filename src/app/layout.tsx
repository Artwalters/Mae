import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { PanelProvider } from "@/context/PanelContext";
import { SharedVideoProvider } from "@/context/SharedVideoContext";
import GlobalPanel from "@/components/SlidePanel/GlobalPanel";
import TitleRotator from "@/components/TitleRotator";
import FontStyles from "@/components/FontStyles";
import Navigation from "@/components/Navigation";
import InViewObserver from "@/components/InViewObserver";

export const metadata: Metadata = {
  title: {
    default: "MAE — Fysiotherapie & Leefstijlcoaching",
    template: "%s | MAE",
  },
  description: "MAE combineert fysiotherapie en leefstijlcoaching voor duurzaam herstel en een gezondere levensstijl. Persoonlijke begeleiding door Maarten (fysio) en Merel (leefstijlcoach).",
  keywords: ["fysiotherapie", "leefstijlcoaching", "personal coaching", "revalidatie", "krachttraining", "MAE", "Move Adapt Evolve"],
  authors: [{ name: "MAE — Move Adapt Evolve" }],
  metadataBase: new URL("https://moveadaptevolve.nl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://moveadaptevolve.nl",
    siteName: "MAE — Move Adapt Evolve",
    title: "MAE — Fysiotherapie & Leefstijlcoaching",
    description: "Persoonlijke fysiotherapie en leefstijlcoaching. Duurzaam herstel en een gezondere levensstijl met Maarten en Merel.",
    images: [
      {
        url: "https://HAL13xMAE.b-cdn.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MAE — Move Adapt Evolve",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAE — Fysiotherapie & Leefstijlcoaching",
    description: "Persoonlijke fysiotherapie en leefstijlcoaching. Duurzaam herstel en een gezondere levensstijl.",
    images: ["https://HAL13xMAE.b-cdn.net/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#272727" />
        <FontStyles />
        <Script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js" type="module" crossOrigin="anonymous" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              name: "MAE — Move Adapt Evolve",
              description: "Fysiotherapie en leefstijlcoaching. Persoonlijke begeleiding voor duurzaam herstel en een gezondere levensstijl.",
              url: "https://moveadaptevolve.nl",
              logo: "https://HAL13xMAE.b-cdn.net/og-image.jpg",
              email: "info@moveadaptevolve.nl",
              sameAs: [
                "https://www.instagram.com/m.a.e.coaching.fysiotherapie/",
                "https://www.tiktok.com/@maecoaching",
              ],
              knowsAbout: ["Fysiotherapie", "Leefstijlcoaching", "Revalidatie", "Krachttraining", "Personal coaching"],
            }),
          }}
        />
      </head>
      <body>
        <TitleRotator />
        <SharedVideoProvider>
          <PanelProvider>
            <SmoothScroll>
              <Navigation />
              <InViewObserver />
              {children}
              <GlobalPanel />
            </SmoothScroll>
          </PanelProvider>
        </SharedVideoProvider>
      </body>
    </html>
  );
}
