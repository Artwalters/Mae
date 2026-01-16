import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { PanelProvider } from "@/context/PanelContext";
import GlobalPanel from "@/components/SlidePanel/GlobalPanel";
import TitleRotator from "@/components/TitleRotator";

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
      <body>
        <TitleRotator />
        <PanelProvider>
          <SmoothScroll>
            {children}
            <GlobalPanel />
          </SmoothScroll>
        </PanelProvider>
      </body>
    </html>
  );
}
