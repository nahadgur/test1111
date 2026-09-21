import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lianne Manongsong | Broker Sales Associate",
  description: "Connect with Lianne Manongsong and explore the 2026 FAI Sales Kit.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
