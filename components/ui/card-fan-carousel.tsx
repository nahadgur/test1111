"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { PropertyCard } from "@/components/property-cards";

const MAX_VISIBLE = 7;
const HALF = 3;
const FAN_POSITIONS = [
  { rot: -21, scale: .78, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: .85, x: -22, y: 4, zIndex: 2 },
  { rot: -7, scale: .935, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rot: 7, scale: .935, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: .85, x: 22, y: 4, zIndex: 2 },
  { rot: 21, scale: .78, x: 30, y: 7.3, zIndex: 1 },
];

function responsiveMultiplier(width: number) {
  if (width < 480) return .28;
  if (width < 640) return .38;
  if (width < 768) return .5;
  if (width < 1024) return .75;
  return 1;
}

export function CardFanCarousel({ cards }: { cards: PropertyCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const enteredRef = useRef(false);
  const directionRef = useRef<"left" | "right">("right");
  const previousVisibleRef = useRef<Set<number>>(new Set());
  const gestureStartXRef = useRef<number | null>(null);
  const draggedRef = useRef(false);
  const lastWheelAtRef = useRef(0);
  const [centerIndex, setCenterIndex] = useState(0);
  const [viewportVersion, setViewportVersion] = useState(0);
  const total = cards.length;

  const visibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    const count = Math.min(total, MAX_VISIBLE);
    for (let slot = 0; slot < count; slot += 1) {
      map.set(((center + slot - HALF) % total + total) % total, slot);
    }
    return map;
  }, [total]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (animatingRef.current || total < 2) return;
    animatingRef.current = true;
    directionRef.current = direction;
    setCenterIndex((current) => direction === "right" ? (current + 1) % total : (current - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 16) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelAtRef.current < 520) return;
      lastWheelAtRef.current = now;
      cycle(delta > 0 ? "right" : "left");
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [cycle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !total) return;
    const elements = Array.from(container.querySelectorAll<HTMLElement>(".v2-fan-card"));
    const currentVisible = visibleMap(centerIndex);
    const previousVisible = previousVisibleRef.current;
    const firstMount = !enteredRef.current;
    const multiplier = responsiveMultiplier(window.innerWidth);
    let completed = 0;

    const finish = () => {
      completed += 1;
      if (completed >= currentVisible.size) {
        animatingRef.current = false;
        enteredRef.current = true;
      }
    };

    elements.forEach((element, cardIndex) => {
      const slot = currentVisible.get(cardIndex);
      if (slot !== undefined) {
        const position = FAN_POSITIONS[slot];
        const target = {
          x: `${position.x * multiplier}rem`,
          y: `${position.y * Math.min(1, window.innerHeight / 760)}rem`,
          rotation: position.rot,
          scale: position.scale,
          opacity: 1,
          zIndex: position.zIndex,
        };
        if (firstMount) {
          gsap.set(element, { x: 0, y: "8rem", rotation: 0, scale: .62, opacity: 0 });
          gsap.to(element, { ...target, duration: .72, delay: .055 * slot, ease: "back.out(1.18)", onComplete: finish });
        } else if (!previousVisible.has(cardIndex)) {
          const enterX = directionRef.current === "right" ? 36 : -36;
          gsap.set(element, { x: `${enterX}rem`, opacity: 0, scale: .58, rotation: enterX > 0 ? 24 : -24 });
          gsap.to(element, { ...target, duration: .46, ease: "power2.out", onComplete: finish });
        } else {
          gsap.to(element, { ...target, duration: .42, ease: "power2.out", onComplete: finish });
        }
      } else if (previousVisible.has(cardIndex)) {
        const exitX = directionRef.current === "right" ? -36 : 36;
        gsap.to(element, { x: `${exitX}rem`, opacity: 0, scale: .58, duration: .32, ease: "power2.in", zIndex: 0 });
      } else if (firstMount) {
        gsap.set(element, { opacity: 0, scale: .4, zIndex: 0 });
      }
    });

    previousVisibleRef.current = new Set(currentVisible.keys());
    let resizeFrame: number | null = null;
    const onResize = () => {
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => setViewportVersion((version) => version + 1));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
      gsap.killTweensOf(elements);
    };
  }, [centerIndex, total, viewportVersion, visibleMap]);

  const renderedVisible = visibleMap(centerIndex);

  return (
    <section className="v2-carousel" aria-label="Property sales kits">
      <div
        className="v2-fan-layout"
        ref={containerRef}
        onPointerDown={(event) => {
          gestureStartXRef.current = event.clientX;
          draggedRef.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => { if (gestureStartXRef.current !== null && Math.abs(event.clientX - gestureStartXRef.current) > 12) draggedRef.current = true; }}
        onPointerUp={(event) => {
          const start = gestureStartXRef.current;
          gestureStartXRef.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          if (start === null || Math.abs(event.clientX - start) < 42) return;
          cycle(event.clientX < start ? "right" : "left");
        }}
        onPointerCancel={() => { gestureStartXRef.current = null; }}
        onClickCapture={(event) => { if (draggedRef.current) { event.preventDefault(); draggedRef.current = false; } }}
      >
        {cards.map((card, index) => (
          <a className="v2-fan-card" href={card.href} target="_blank" rel="noopener noreferrer" draggable={false} key={card.id} aria-label={`Open ${card.name} sales materials`} aria-hidden={!renderedVisible.has(index)} tabIndex={renderedVisible.has(index) ? 0 : -1}>
            <Image src={card.image} alt="" fill sizes="(max-width: 600px) 54vw, 19rem" className="v2-card-image" priority={index === centerIndex} draggable={false} />
            <span className="v2-card-shade" />
            <span className="v2-card-copy"><small>{card.type}</small><strong>{card.name}</strong><i>Open sales kit ↗</i></span>
          </a>
        ))}
      </div>
      <div className="v2-controls">
        <button type="button" onClick={() => cycle("left")} aria-label="Previous property">‹</button>
        <div className="v2-dots" aria-hidden="true">
          {cards.map((card, index) => <span className={index === centerIndex ? "is-active" : ""} key={card.id} />)}
        </div>
        <button type="button" onClick={() => cycle("right")} aria-label="Next property">›</button>
      </div>
      <p className="v2-input-hint">Swipe, scroll, or use the arrows</p>
    </section>
  );
}
