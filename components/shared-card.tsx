"use client";

import { useEffect, useState } from "react";
import { decodeCardData, type CardData } from "@/components/card-data";
import { ScrollVcard } from "@/components/scroll-vcard";

export function SharedCard() {
  const [card, setCard] = useState<CardData | null>(null);
  const [encoded, setEncoded] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    try {
      const value = new URLSearchParams(window.location.hash.slice(1)).get("data");
      if (!value) throw new Error("Missing card data");
      setEncoded(value);
      setCard(decodeCardData(value));
    } catch {
      setInvalid(true);
    }
  }, []);

  if (invalid) {
    return <main className="shared-card-error"><div><span>Card unavailable</span><h1>This card link is incomplete.</h1><p>Create a fresh card or ask the sender for a new link.</p><a href="/builder">Open card builder</a></div></main>;
  }

  if (!card) return <main className="shared-card-loading" aria-label="Loading digital card"><span /></main>;

  return (
    <>
      <ScrollVcard data={card} />
      <a className="shared-edit-link" href={`/builder#data=${encoded}`}>Edit this card</a>
    </>
  );
}
