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
  title: "Move Adapt Evolve",
  description: "MAE - Fysiotherapie & Leefstijlcoaching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <FontStyles />
        <Script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js" type="module" strategy="beforeInteractive" />
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
