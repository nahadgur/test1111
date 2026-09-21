import Image from "next/image";
import type { PropertyCard } from "@/components/property-cards";

export function ImageStackCarousel({ cards }: { cards: PropertyCard[] }) {
  return (
    <section className="v3-gallery" aria-label="Property sales kits">
      {cards.map((card, index) => (
        <a className="v3-gallery-card" href={card.href} target="_blank" rel="noopener noreferrer" key={card.id} aria-label={`Open ${card.name} sales materials`}>
          <Image src={card.image} alt={`${card.name} property`} fill sizes="(max-width: 599px) 46vw, (max-width: 999px) 44vw, 28vw" className="v3-card-image" priority={index < 2} />
          <span className="v3-card-shade" />
          <span className="v3-card-copy"><small>{card.type}</small><strong>{card.name}</strong><i>View kit <span>↗</span></i></span>
        </a>
      ))}
    </section>
  );
}
