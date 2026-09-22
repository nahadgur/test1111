"use client";

import { useEffect, useRef, useState } from "react";
import { displayName, type ProfileData } from "@/components/card-data";
import { createVCard, downloadVCard, vCardFilename } from "@/components/vcard-utils";

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

export function SaveContactButton({ profile, downloadUrl }: { profile: ProfileData; downloadUrl?: string }) {
  const { message, show } = useToast();
  const [showBrowserHelp, setShowBrowserHelp] = useState(false);
  const helpDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = helpDialogRef.current;
    if (!dialog) return;
    if (showBrowserHelp && !dialog.open) dialog.showModal();
    if (!showBrowserHelp && dialog.open) dialog.close();
  }, [showBrowserHelp]);

  async function saveContact() {
    const filename = vCardFilename(profile);
    const file = new File([createVCard(profile)], filename, { type: "text/vcard;charset=utf-8" });
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    const isRestrictedInAppBrowser = /FBAN|FBAV|Instagram|Messenger/i.test(userAgent);
    const canShareFile = isMobile && typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });

    if (canShareFile) {
      try {
        await navigator.share({ files: [file], title: `${displayName(profile)} contact` });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    if (isRestrictedInAppBrowser) {
      setShowBrowserHelp(true);
      return;
    }

    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      show("Opening contact card");
      return;
    }

    downloadVCard(profile);
    show("Contact file downloaded");
  }

  return (
    <>
      <button className="action-button action-primary" type="button" onClick={saveContact}>
        <DownloadIcon />
        Save contact
      </button>
      <div className={`toast ${message ? "show" : ""}`} role="status" aria-live="polite">{message}</div>
      <dialog className="contact-help-dialog" ref={helpDialogRef} aria-labelledby="contact-help-title" onClose={() => setShowBrowserHelp(false)} onClick={(event) => { if (event.target === event.currentTarget) setShowBrowserHelp(false); }}>
        <section className="contact-help">
          <span>Save on your phone</span>
          <h2 id="contact-help-title">Open this page in your browser</h2>
          <p>Messenger blocks contact downloads. Tap <strong>•••</strong> above, choose <strong>Open in browser</strong> or <strong>Open in Safari</strong>, then tap Save contact again.</p>
          <button type="button" autoFocus onClick={() => setShowBrowserHelp(false)}>Got it</button>
        </section>
      </dialog>
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
