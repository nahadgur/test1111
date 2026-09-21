"use client";

import { useEffect, useState } from "react";
import { decodeCardData, defaultCardData, displayName, encodeCardData, sanitizeCardData, type CardData, type ProfileData, type SupportData } from "@/components/card-data";
import type { PropertyCard } from "@/components/property-cards";

const DRAFT_KEY = "fai-card-builder-v1";

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaultCardData)) as CardData;
}

function Field({ label, value, onChange, type = "text", placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="builder-field">
      <span>{label}{required ? <b aria-hidden="true"> *</b> : null}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} autoComplete="off" />
    </label>
  );
}

function createProperty(index: number): PropertyCard {
  return { id: `property-${Date.now()}-${index}`, name: "New property", type: "Property type", href: "https://", image: "/assets/properties/botanika.webp" };
}

export function CardBuilder() {
  const [data, setData] = useState<CardData>(cloneDefaults);
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      const encoded = new URLSearchParams(window.location.hash.slice(1)).get("data");
      if (encoded) {
        setData(decodeCardData(encoded));
        setStatus("Shared card loaded for editing");
      }
    } catch {
      setStatus("The shared card could not be loaded");
    }
  }, []);

  const updateProfile = (key: keyof ProfileData, value: string) => {
    setData((current) => ({ ...current, profile: { ...current.profile, [key]: value } }));
  };

  const updateSupport = (key: keyof SupportData, value: string) => {
    setData((current) => ({ ...current, support: { ...current.support, [key]: value } }));
  };

  const updateProperty = (index: number, key: keyof PropertyCard, value: string) => {
    setData((current) => ({ ...current, properties: current.properties.map((property, propertyIndex) => propertyIndex === index ? { ...property, [key]: value } : property) }));
  };

  const shareUrl = () => {
    const clean = sanitizeCardData(data);
    return `${window.location.origin}/card#data=${encodeCardData(clean)}`;
  };

  const saveDraft = () => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    setStatus("Draft saved on this device");
  };

  const loadDraft = () => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (!saved) {
        setStatus("No saved draft was found on this device");
        return;
      }
      setData(sanitizeCardData(JSON.parse(saved)));
      setStatus("Saved draft loaded");
    } catch {
      setStatus("The saved draft could not be loaded");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setStatus("Shareable card link copied");
    } catch {
      setStatus("Could not copy the link—use Preview card and copy its address");
    }
  };

  const preview = () => {
    window.location.assign(shareUrl());
  };

  return (
    <main className="builder-page">
      <header className="builder-topbar">
        <a href="/" aria-label="Return to the original digital card"><span>NC</span><strong>FAI Card Builder</strong></a>
        <div><button type="button" className="builder-button secondary" onClick={saveDraft}>Save draft</button><button type="button" className="builder-button primary" onClick={preview}>Preview card</button></div>
      </header>

      <div className="builder-layout">
        <section className="builder-form" aria-labelledby="builder-title">
          <div className="builder-intro">
            <p>Reusable digital card</p>
            <h1 id="builder-title">Create a new profile.</h1>
            <span>Enter the details, add or remove property cards, then copy the generated public link.</span>
          </div>

          <fieldset>
            <legend>Profile details</legend>
            <div className="builder-grid three">
              <Field label="First name" value={data.profile.firstName} onChange={(value) => updateProfile("firstName", value)} required />
              <Field label="Middle name" value={data.profile.middleName} onChange={(value) => updateProfile("middleName", value)} />
              <Field label="Last name" value={data.profile.lastName} onChange={(value) => updateProfile("lastName", value)} required />
            </div>
            <div className="builder-grid two">
              <Field label="Role / title" value={data.profile.role} onChange={(value) => updateProfile("role", value)} required />
              <Field label="Company" value={data.profile.company} onChange={(value) => updateProfile("company", value)} />
              <Field label="Phone" type="tel" value={data.profile.phone} onChange={(value) => updateProfile("phone", value)} placeholder="+63..." />
              <Field label="Email" type="email" value={data.profile.email} onChange={(value) => updateProfile("email", value)} />
              <Field label="Location / descriptor" value={data.profile.location} onChange={(value) => updateProfile("location", value)} />
              <Field label="Portrait image URL" value={data.profile.image} onChange={(value) => updateProfile("image", value)} placeholder="https://... or /assets/..." />
              <Field label="Website" type="url" value={data.profile.website} onChange={(value) => updateProfile("website", value)} />
              <Field label="Facebook" type="url" value={data.profile.facebook} onChange={(value) => updateProfile("facebook", value)} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Broker support</legend>
            <div className="builder-grid two">
              <Field label="Name" value={data.support.name} onChange={(value) => updateSupport("name", value)} />
              <Field label="Title" value={data.support.title} onChange={(value) => updateSupport("title", value)} />
              <Field label="Phone" type="tel" value={data.support.phone} onChange={(value) => updateSupport("phone", value)} />
              <Field label="Email" type="email" value={data.support.email} onChange={(value) => updateSupport("email", value)} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Portfolio introduction</legend>
            <div className="builder-grid two">
              <Field label="Section label" value={data.portfolioLabel} onChange={(value) => setData((current) => ({ ...current, portfolioLabel: value }))} />
              <Field label="Main heading" value={data.portfolioTitle} onChange={(value) => setData((current) => ({ ...current, portfolioTitle: value }))} />
            </div>
          </fieldset>

          <section className="builder-properties" aria-labelledby="property-editor-title">
            <div className="builder-section-heading">
              <div><p>Portfolio links</p><h2 id="property-editor-title">Property cards <span>{data.properties.length}</span></h2></div>
              <button type="button" className="builder-button add" onClick={() => setData((current) => ({ ...current, properties: [...current.properties, createProperty(current.properties.length)] }))}>+ Add card</button>
            </div>
            <div className="property-editor-list">
              {data.properties.map((property, index) => (
                <fieldset className="property-editor" key={property.id}>
                  <legend>Card {index + 1}</legend>
                  <button className="remove-card" type="button" disabled={data.properties.length === 1} onClick={() => setData((current) => ({ ...current, properties: current.properties.filter((_, propertyIndex) => propertyIndex !== index) }))} aria-label={`Remove ${property.name}`}>Remove</button>
                  <div className="builder-grid two">
                    <Field label="Property name" value={property.name} onChange={(value) => updateProperty(index, "name", value)} required />
                    <Field label="Property type" value={property.type} onChange={(value) => updateProperty(index, "type", value)} />
                    <Field label="Sales-kit link" type="url" value={property.href} onChange={(value) => updateProperty(index, "href", value)} required />
                    <Field label="Card image URL" value={property.image} onChange={(value) => updateProperty(index, "image", value)} placeholder="https://... or /assets/..." />
                  </div>
                </fieldset>
              ))}
            </div>
          </section>
        </section>

        <aside className="builder-summary">
          <span className="builder-summary-label">Card ready</span>
          <div className="builder-avatar">{data.profile.firstName.slice(0, 1)}{data.profile.lastName.slice(0, 1)}</div>
          <h2>{displayName(data.profile) || "Untitled profile"}</h2>
          <p>{data.profile.role || "Add a role"}</p>
          <dl><div><dt>Properties</dt><dd>{data.properties.length}</dd></div><div><dt>Contact file</dt><dd>.vcf</dd></div><div><dt>Layout</dt><dd>Mobile first</dd></div></dl>
          <button type="button" className="builder-button primary full" onClick={copyLink}>Copy shareable link</button>
          <button type="button" className="builder-button secondary full" onClick={loadDraft}>Load saved draft</button>
          <button type="button" className="builder-button secondary full" onClick={() => { setData(cloneDefaults()); setStatus("Original details restored"); }}>Restore original data</button>
          <p className="builder-note">The link contains the card data. Save the draft if you also want an editable copy on this device.</p>
          <div className="builder-status" role="status" aria-live="polite">{status}</div>
        </aside>
      </div>
    </main>
  );
}
