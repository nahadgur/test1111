"use client";

import { useEffect, useRef, useState } from "react";

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

export function SaveContactButton() {
  const { message, show } = useToast();

  function saveContact() {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Cobangbang;Noel;N.;;",
      "FN:Noel N. Cobangbang",
      "TITLE:AYS Neopreneur",
      "URL:https://test1111-tan.vercel.app/",
      "X-SOCIALPROFILE;TYPE=facebook:https://www.facebook.com/noel.cobangbang.7",
      "NOTE:FAI Sales Kit: https://linktr.ee/FAISalesKit2026",
      "END:VCARD",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "noel-cobangbang.vcf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
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

export function CopyPageLinkButton() {
  const { message, show } = useToast();

  async function sharePage() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Noel N. Cobangbang", url: window.location.href });
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
