"use client";

import { useState } from "react";

function useToast() {
  const [message, setMessage] = useState("");

  function show(messageText: string) {
    setMessage(messageText);
    window.setTimeout(() => setMessage(""), 2400);
  }

  return { message, show };
}

export function SaveContactButton() {
  const { message, show } = useToast();

  function saveContact() {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Noel N. Cobangbang",
      "TITLE:AYS Neopreneur",
      "URL:https://1neoai.com/aysnoelcobangbang",
      "END:VCARD",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "noel-cobangbang.vcf";
    link.click();
    URL.revokeObjectURL(url);
    show("Contact card downloaded");
  }

  return (
    <>
      <button className="text-button" type="button" onClick={saveContact}>Save contact</button>
      <div className={`toast ${message ? "show" : ""}`} role="status" aria-live="polite">{message}</div>
    </>
  );
}

export function CopyPageLinkButton() {
  const { message, show } = useToast();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      show("Profile link copied");
    } catch {
      show("Copy unavailable in this browser");
    }
  }

  return (
    <>
      <button type="button" onClick={copyLink}>Copy this page link</button>
      <div className={`toast ${message ? "show" : ""}`} role="status" aria-live="polite">{message}</div>
    </>
  );
}
