import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SealSure AI | Product authentication platform",
  description:
    "SealSure AI helps brands protect products with copy-resistant labels, smartphone verification, warranty programs, and location-aware analytics."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
