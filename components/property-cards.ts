export interface PropertyCard {
  id: string;
  name: string;
  type: string;
  href: string;
  image: string;
}

export const propertyCards: PropertyCard[] = [
  { id: "botanika", name: "Botanika Nature Residences", type: "Luxury residences", href: "https://linktr.ee/BotanikaNatureResidences2026", image: "/assets/properties/botanika.webp" },
  { id: "parkway", name: "1001 Parkway Residences", type: "High-rise residences", href: "https://linktr.ee/1001ParkwayResidences", image: "/assets/properties/parkway.webp" },
  { id: "golf-ridge", name: "Golf Ridge Private Estate", type: "Private estate", href: "https://linktr.ee/GolfRidgePrivateEstate2026", image: "/assets/properties/golf-ridge.webp" },
  { id: "brentville", name: "Brentville International Community", type: "Residential community", href: "https://linktr.ee/BrentvilleInternational2026", image: "/assets/properties/brentville.webp" },
  { id: "parkway-corporate", name: "Parkway Corporate Center", type: "Office spaces", href: "https://linktr.ee/ParkwayCorporateCenter2026", image: "/assets/properties/parkway-corporate.webp" },
  { id: "levels", name: "The Levels", type: "Condominiums", href: "https://linktr.ee/TheLevels2026", image: "/assets/properties/levels.webp" },
  { id: "studio-n", name: "Studio N Alabang", type: "Studio residences", href: "https://linktr.ee/StudioNAlabang2026", image: "/assets/properties/studio-n.webp" },
  { id: "celestia", name: "Celestia at Timberland Heights", type: "Highland residences", href: "https://linktr.ee/CelestiaTimberlandHeights2026", image: "/assets/properties/celestia.webp" },
  { id: "glades", name: "The Glades at Timberland Heights", type: "Residential lots", href: "https://linktr.ee/TheGlades", image: "/assets/properties/glades.webp" },
  { id: "commercial", name: "Filinvest Commercial Lots", type: "Commercial lots", href: "https://linktr.ee/FAICommercialLots", image: "/assets/properties/commercial.webp" },
  { id: "livable", name: "Filinvest Livable Condos", type: "Ready for occupancy", href: "https://linktr.ee/FilinvestLivableCondosRFOs", image: "/assets/properties/livable.webp" },
];
