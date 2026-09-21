"use client";

import { useEffect, useRef, useState } from "react";
import { displayName, type ProfileData } from "@/components/card-data";
import { downloadVCard } from "@/components/vcard-utils";

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
    </svg>
  );
}

function useToast() {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  function show(messageText: string) {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setMessage(messageText);
    timeoutRef.current = window.setTimeout(() => setMessage(""), 2400);
  }

  return { message, show };
}

export function SaveContactButton({ profile }: { profile: ProfileData }) {
  const { message, show } = useToast();

  function saveContact() {
    downloadVCard(profile);
    show("Contact saved");
  }

  return (
    <>
      <button className="action-button action-primary" type="button" onClick={saveContact}>
        <DownloadIcon />
        Save contact
      </button>
      <div className={`toast ${message ? "show" : ""}`} role="status" aria-live="polite">{message}</div>
    </>
  );
}

export function CopyPageLinkButton({ profile }: { profile: ProfileData }) {
  const { message, show } = useToast();

  async function sharePage() {
    try {
      if (navigator.share) {
        await navigator.share({ title: displayName(profile), url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      show("Link copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      show("Sharing is unavailable");
    }
  }

  return (
    <>
      <button className="icon-button" type="button" onClick={sharePage} aria-label="Share this card">
        <ShareIcon />
      </button>
      <div className={`toast ${message ? "show" : ""}`} role="status" aria-live="polite">{message}</div>
    </>
  );
}
