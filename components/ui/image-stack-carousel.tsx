"use client";

import Image from "next/image";
import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PropertyCard } from "@/components/property-cards";

const settings = {
  width: 326,
  height: 430,
  swipeThreshold: 82,
  stackRotation: 4,
  stackScale: .035,
  tiltStrength: 16,
};

function StackCard({ card, index, count, onSendToBack }: { card: PropertyCard; index: number; count: number; onSendToBack: () => void }) {
  const isFront = index === 0;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [settings.tiltStrength, -settings.tiltStrength]);
  const rotateY = useTransform(x, [-200, 200], [-settings.tiltStrength, settings.tiltStrength]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const moved = Math.abs(info.offset.x) > settings.swipeThreshold || Math.abs(info.offset.y) > settings.swipeThreshold;
    x.set(0);
    y.set(0);
    if (moved) onSendToBack();
  };

  return (
    <motion.article
      className="v3-stack-card"
      style={{ x: isFront ? x : 0, y: isFront ? y : 0, rotateX: isFront ? rotateX : 0, rotateY: isFront ? rotateY : 0, zIndex: count - index }}
      drag={isFront}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={.42}
      onDragEnd={handleDragEnd}
      animate={{ rotateZ: index * settings.stackRotation, scale: 1 - index * settings.stackScale }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      aria-hidden={!isFront}
    >
      <Image src={card.image} alt="" fill sizes="(max-width: 480px) 78vw, 326px" className="v3-card-image" priority={isFront} />
      <div className="v3-card-shade" />
      <div className="v3-card-copy">
        <small>{card.type}</small>
        <strong>{card.name}</strong>
        <a href={card.href} target="_blank" rel="noopener noreferrer" tabIndex={isFront ? 0 : -1} onPointerDown={(event) => event.stopPropagation()}>View sales materials <span>↗</span></a>
      </div>
    </motion.article>
  );
}

export function ImageStackCarousel({ cards }: { cards: PropertyCard[] }) {
  const wrapRef = useRef<HTMLElement>(null);
  const lastWheelAtRef = useRef(0);
  const [cardList, setCardList] = useState(cards);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 480px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const moveFrontToBack = useCallback(() => {
    setCardList((current) => [...current.slice(1), current[0]]);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 18) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelAtRef.current < 520) return;
      lastWheelAtRef.current = now;
      moveFrontToBack();
    };
    wrap.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", handleWheel);
  }, [moveFrontToBack]);

  const moveToBack = (id: string) => {
    setCardList((current) => {
      const cardIndex = current.findIndex((card) => card.id === id);
      if (cardIndex < 0) return current;
      return [...current.slice(cardIndex + 1), ...current.slice(0, cardIndex + 1)];
    });
  };

  const scale = compact ? .86 : 1;
  const visibleCards = cardList.slice(0, 5);

  return (
    <section className="v3-stack-wrap" aria-label="Swipe through property sales kits" ref={wrapRef}>
      <div className="v3-stack" style={{ width: settings.width, height: settings.height, perspective: 1200, transform: `scale(${scale})` }}>
        {visibleCards.map((card, index) => <StackCard card={card} index={index} count={visibleCards.length} onSendToBack={() => moveToBack(card.id)} key={card.id} />)}
      </div>
      <p>Drag, swipe, or scroll to browse</p>
    </section>
  );
}
