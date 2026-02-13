import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { PanelProvider } from "@/context/PanelContext";
import { SharedVideoProvider } from "@/context/SharedVideoContext";
import GlobalPanel from "@/components/SlidePanel/GlobalPanel";
import TitleRotator from "@/components/TitleRotator";
import FontStyles from "@/components/FontStyles";
import Navigation from "@/components/Navigation";

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
      </head>
      <body>
        <TitleRotator />
        <SharedVideoProvider>
          <PanelProvider>
            <SmoothScroll>
              <Navigation />
              {children}
              <GlobalPanel />
            </SmoothScroll>
          </PanelProvider>
        </SharedVideoProvider>
      </body>
    </html>
  );
}
