"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 18 18 6M9 6h9v9" /></svg>;
}

function FacebookIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 8.2V6.8c0-.7.5-.9 1-.9h2.8V2.1L14.5 2C11.2 2 9 4 9 7.3v.9H6v4.3h3V22h4.5v-9.5h3.3l.6-4.3H14Z" /></svg>;
}

export function ScrollVcard() {
  const storyRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const update = () => {
      const story = storyRef.current;
      if (!story) return;
      const rect = story.getBoundingClientRect();
      const travel = Math.max(story.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setActiveStep(Math.round(progress * properties.length));
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const propertyStep = Math.max(0, activeStep - 1);
  const heroIsActive = activeStep === 0;

  return (
    <main className="page-shell">
      <section
        className="scroll-story"
        ref={storyRef}
        style={{ height: `${(properties.length + 1) * 100}svh` }}
        aria-label="Noel Cobangbang digital business card"
      >
        <div className="sticky-frame">
          <article className={`vcard ${heroIsActive ? "show-profile" : "show-projects"}`}>
            <header className="persistent-header">
              <div className="brand-lockup"><span className="brand-mark" aria-hidden="true" /><span>FAI Sales Kit</span></div>
              <CopyPageLinkButton />
            </header>

            <section className="hero-panel" aria-hidden={!heroIsActive}>
              <Image className="hero-photo" src="/assets/noel-profile.png" alt="Noel N. Cobangbang" fill priority sizes="(max-width: 640px) 100vw, 540px" />
              <div className="hero-shade" aria-hidden="true" />
              <div className="hero-content">
                <p className="role">AYS Neopreneur</p>
                <h1>Noel N. Cobangbang</h1>
                <p className="location">Philippines&nbsp;&nbsp;·&nbsp;&nbsp;Business &amp; Technology</p>
                <div className="primary-actions">
                  <SaveContactButton />
                  <a className="action-button action-secondary" href="https://www.facebook.com/noel.cobangbang.7" target="_blank" rel="noopener noreferrer" tabIndex={heroIsActive ? 0 : -1}>
                    <FacebookIcon />Facebook
                  </a>
                </div>
                <div className="scroll-cue" aria-hidden="true"><span>Scroll to explore</span><i /></div>
              </div>
            </section>

            <section className="projects-panel" aria-labelledby="sales-kit-title" aria-hidden={heroIsActive}>
              <div className="profile-strip">
                <Image src="/assets/noel-profile.png" alt="" width={52} height={52} />
                <div><strong>Noel N. Cobangbang</strong><span>AYS Neopreneur</span></div>
              </div>

              <div className="projects-heading">
                <p>Property portfolio</p>
                <h2 id="sales-kit-title">Find the right<br />Filinvest property.</h2>
              </div>

              <div className="property-stage" aria-live="polite">
                {properties.map((property, index) => {
                  const isActive = !heroIsActive && index === propertyStep;
                  return (
                    <a className={`property-card ${isActive ? "is-active" : ""}`} href={property.href} target="_blank" rel="noopener noreferrer" key={property.name} aria-hidden={!isActive} tabIndex={isActive ? 0 : -1}>
                      <span className="property-type">{property.type}</span>
                      <strong>{property.name}</strong>
                      <span className="property-action">View sales materials<span className="arrow"><ArrowIcon /></span></span>
                    </a>
                  );
                })}
              </div>

              <div className="progress-track" aria-hidden="true">
                {properties.map((property, index) => <span className={index <= propertyStep ? "is-complete" : ""} key={property.name} />)}
              </div>
              <p className="scroll-direction">
                {propertyStep === properties.length - 1 ? "Portfolio complete" : "Keep scrolling"}
              </p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
