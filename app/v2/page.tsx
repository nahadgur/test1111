import type { Metadata } from "next";
import Link from "next/link";
import { CardFanCarousel } from "@/components/ui/card-fan-carousel";
import { propertyCards } from "@/components/property-cards";

export const metadata: Metadata = { title: "FAI Sales Kit 2026 | Fan View" };

export default function V2Page() {
  return (
    <main className="variant-page v2-page">
      <header className="variant-header">
        <Link href="/" aria-label="Back to Noel Cobangbang digital card"><span>NC</span><div><strong>Noel N. Cobangbang</strong><small>FAI Sales Kit 2026</small></div></Link>
        <p>Choose a property</p>
      </header>
      <div className="variant-heading"><p>Property portfolio</p><h1>Explore the collection.</h1></div>
      <CardFanCarousel cards={propertyCards} />
    </main>
  );
}
