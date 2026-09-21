import type { Metadata } from "next";
import Link from "next/link";
import { ImageStackCarousel } from "@/components/ui/image-stack-carousel";
import { propertyCards } from "@/components/property-cards";

export const metadata: Metadata = { title: "FAI Sales Kit 2026 | Swipe View" };

export default function V3Page() {
  return (
    <main className="variant-page v3-page">
      <header className="variant-header">
        <Link href="/" aria-label="Back to Noel Cobangbang digital card"><span>NC</span><div><strong>Noel N. Cobangbang</strong><small>FAI Sales Kit 2026</small></div></Link>
        <p>Swipe to browse</p>
      </header>
      <div className="variant-heading"><p>Property portfolio</p><h1>Find your next address.</h1></div>
      <ImageStackCarousel cards={propertyCards} />
    </main>
  );
}
