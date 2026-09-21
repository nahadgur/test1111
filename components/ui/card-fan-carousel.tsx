"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { PropertyCard } from "@/components/property-cards";

export function CardFanCarousel({ cards }: { cards: PropertyCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * .82, 420), behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const atStart = track.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth && event.deltaY > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    };
    track.addEventListener("wheel", handleWheel, { passive: false });
    return () => track.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section className="v2-carousel" aria-label="Property sales kits">
      <div className="v2-scroll-shell">
        <button className="v2-edge-control is-previous" type="button" onClick={() => move(-1)} aria-label="Previous properties">‹</button>
        <div className="v2-scroll-track" ref={trackRef}>
          {cards.map((card, index) => (
            <a className="v2-fan-card" href={card.href} target="_blank" rel="noopener noreferrer" key={card.id} aria-label={`Open ${card.name} sales materials`}>
              <Image src={card.image} alt={`${card.name} property`} fill sizes="(max-width: 599px) 78vw, (max-width: 1100px) 40vw, 22rem" className="v2-card-image" priority={index < 2} />
              <span className="v2-card-shade" />
              <span className="v2-card-copy"><small>{card.type}</small><strong>{card.name}</strong><i>Open sales kit <span>↗</span></i></span>
            </a>
          ))}
        </div>
        <button className="v2-edge-control is-next" type="button" onClick={() => move(1)} aria-label="Next properties">›</button>
      </div>
      <p className="variant-browse-cue"><span />Scroll or swipe to browse all {cards.length}</p>
    </section>
  );
}
