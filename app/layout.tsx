import type {
  Metadata,
  Viewport,
} from "next";

import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "SIMI Aqua",
  description:
    "Dashboard monitoring kegiatan survei",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}