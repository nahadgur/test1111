import Image from "next/image";
import { CopyPageLinkButton, SaveContactButton } from "@/components/profile-actions";

const properties = [
  { name: "Botanika Nature Residences", href: "https://linktr.ee/BotanikaNatureResidences2026", type: "Luxury residences" },
  { name: "1001 Parkway Residences", href: "https://linktr.ee/1001ParkwayResidences", type: "High-rise residences" },
  { name: "Golf Ridge Private Estate", href: "https://linktr.ee/GolfRidgePrivateEstate2026", type: "Private estate" },
  { name: "Brentville International Community", href: "https://linktr.ee/BrentvilleInternational2026", type: "Residential community" },
  { name: "Parkway Corporate Center", href: "https://linktr.ee/ParkwayCorporateCenter2026", type: "Office spaces" },
  { name: "The Levels", href: "https://linktr.ee/TheLevels2026", type: "Condominiums" },
  { name: "Studio N Alabang", href: "https://linktr.ee/StudioNAlabang2026", type: "Studio residences" },
  { name: "Celestia at Timberland Heights", href: "https://linktr.ee/CelestiaTimberlandHeights2026", type: "Highland residences" },
  { name: "The Glades at Timberland Heights", href: "https://linktr.ee/TheGlades", type: "Residential lots" },
  { name: "Filinvest Commercial Lots", href: "https://linktr.ee/FAICommercialLots", type: "Commercial lots" },
  { name: "Filinvest Livable Condos", href: "https://linktr.ee/FilinvestLivableCondosRFOs", type: "Ready for occupancy" },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14 8.2V6.8c0-.7.5-.9 1-.9h2.8V2.1L14.5 2C11.2 2 9 4 9 7.3v.9H6v4.3h3V22h4.5v-9.5h3.3l.6-4.3H14Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <article className="vcard" aria-label="Noel Cobangbang digital business card">
        <header className="profile">
          <div className="topbar">
            <a className="monogram" href="#top" aria-label="Back to top">NC</a>
            <CopyPageLinkButton />
          </div>

          <div className="portrait-wrap" id="top">
            <div className="portrait-ring" aria-hidden="true" />
            <Image
              className="portrait"
              src="/assets/noel-profile.png"
              alt="Noel N. Cobangbang"
              width={512}
              height={512}
              priority
              sizes="112px"
            />
          </div>

          <p className="eyebrow">AYS Neopreneur</p>
          <h1>Noel N.<br />Cobangbang</h1>
          <p className="location">Philippines <span aria-hidden="true">•</span> Business &amp; Technology</p>

          <div className="primary-actions">
            <SaveContactButton />
            <a
              className="action-button action-secondary"
              href="https://www.facebook.com/noel.cobangbang.7"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
              Facebook
            </a>
          </div>
        </header>

        <section className="sales-kit" aria-labelledby="sales-kit-title">
          <div className="section-intro">
            <div>
              <p className="section-kicker">Explore</p>
              <h2 id="sales-kit-title">FAI Sales Kit</h2>
            </div>
            <span className="link-count">{properties.length} properties</span>
          </div>

          <nav className="property-list" aria-label="FAI property resources">
            {properties.map((property, index) => (
              <a
                className="property-link"
                href={property.href}
                target="_blank"
                rel="noopener noreferrer"
                key={property.name}
                style={{ "--item-index": index } as React.CSSProperties}
              >
                <span className="property-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="property-copy">
                  <strong>{property.name}</strong>
                  <small>{property.type}</small>
                </span>
                <span className="arrow"><ArrowIcon /></span>
              </a>
            ))}
          </nav>
        </section>

        <footer>
          <span>Digital card</span>
          <span className="footer-mark" aria-hidden="true" />
          <span>2026</span>
        </footer>
      </article>
    </main>
  );
}
