import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { PanelProvider } from "@/context/PanelContext";
import GlobalPanel from "@/components/SlidePanel/GlobalPanel";

export const metadata: Metadata = {
  title: "MAE",
  description: "MAE Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
