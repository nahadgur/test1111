import { propertyCards, type PropertyCard } from "@/components/property-cards";

export interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  company: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  image: string;
}

export interface SupportData {
  name: string;
  title: string;
  phone: string;
  email: string;
}

export interface CardData {
  profile: ProfileData;
  support: SupportData;
  portfolioLabel: string;
  portfolioTitle: string;
  properties: PropertyCard[];
}

export const defaultCardData: CardData = {
  profile: {
    firstName: "Lianne",
    middleName: "",
    lastName: "Manongsong",
    role: "Broker Sales Associate",
    company: "Filinvest Alabang, Inc.",
    location: "Filinvest Alabang, Inc.",
    phone: "+639157453449",
    email: "julie.manongsong@filinvestcity.com",
    website: "https://test1111-tan.vercel.app/",
    facebook: "https://www.facebook.com/loveliannne",
    image: "/assets/lianne-cutout.png",
  },
  support: {
    name: "Lianne Manongsong",
    title: "Broker Sales Associate",
    phone: "+639157453449",
    email: "julie.manongsong@filinvestcity.com",
  },
  portfolioLabel: "Property portfolio",
  portfolioTitle: "Find the right Filinvest property.",
  properties: propertyCards,
};

export function displayName(profile: ProfileData) {
  return [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.slice(0, 500) : fallback;
}

function webUrl(value: unknown, fallback = "") {
  const candidate = text(value, fallback).trim();
  if (!candidate) return "";
  try {
    const parsed = new URL(candidate, "https://example.com");
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? candidate : fallback;
  } catch {
    return fallback;
  }
}

export function sanitizeCardData(value: unknown): CardData {
  const input = typeof value === "object" && value ? value as Partial<CardData> : {};
  const profile = typeof input.profile === "object" && input.profile ? input.profile as Partial<ProfileData> : {};
  const support = typeof input.support === "object" && input.support ? input.support as Partial<SupportData> : {};
  const rawProperties = Array.isArray(input.properties) ? input.properties : defaultCardData.properties;
  const properties = rawProperties.slice(0, 24).flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const property = item as Partial<PropertyCard>;
    const name = text(property.name).trim();
    const href = webUrl(property.href);
    if (!name || !href) return [];
    return [{
      id: text(property.id, `property-${index + 1}`) || `property-${index + 1}`,
      name,
      type: text(property.type, "Property"),
      href,
      image: webUrl(property.image) || (text(property.image).startsWith("/") ? text(property.image) : "/assets/properties/botanika.webp"),
    }];
  });

  return {
    profile: {
      firstName: text(profile.firstName, defaultCardData.profile.firstName),
      middleName: text(profile.middleName, defaultCardData.profile.middleName),
      lastName: text(profile.lastName, defaultCardData.profile.lastName),
      role: text(profile.role, defaultCardData.profile.role),
      company: text(profile.company, defaultCardData.profile.company),
      location: text(profile.location, defaultCardData.profile.location),
      phone: text(profile.phone),
      email: text(profile.email),
      website: webUrl(profile.website, defaultCardData.profile.website),
      facebook: webUrl(profile.facebook),
      image: webUrl(profile.image) || (text(profile.image).startsWith("/") ? text(profile.image) : defaultCardData.profile.image),
    },
    support: {
      name: text(support.name),
      title: text(support.title),
      phone: text(support.phone),
      email: text(support.email),
    },
    portfolioLabel: text(input.portfolioLabel, defaultCardData.portfolioLabel),
    portfolioTitle: text(input.portfolioTitle, defaultCardData.portfolioTitle),
    properties: properties.length ? properties : [defaultCardData.properties[0]],
  };
}

export function encodeCardData(data: CardData) {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return window.btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeCardData(encoded: string) {
  const normalized = encoded.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = window.atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return sanitizeCardData(JSON.parse(new TextDecoder().decode(bytes)));
}
