import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noel N. Cobangbang | Digital Card",
  description: "Connect with Noel N. Cobangbang and explore the 2026 FAI Sales Kit.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
