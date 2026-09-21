"use client";

import Image from "next/image";
import type { ImageLoaderProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BrokerContact } from "@/components/broker-contact";
import { defaultCardData, displayName, type CardData } from "@/components/card-data";
import { CopyPageLinkButton, SaveContactButton } from "@/components/profile-actions";

function passthroughLoader({ src }: ImageLoaderProps) {
  return src;
}

function imageProps(src: string) {
  return /^https?:\/\//i.test(src) ? { loader: passthroughLoader, unoptimized: true } : {};
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 18 18 6M9 6h9v9" /></svg>;
}

function FacebookIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 8.2V6.8c0-.7.5-.9 1-.9h2.8V2.1L14.5 2C11.2 2 9 4 9 7.3v.9H6v4.3h3V22h4.5v-9.5h3.3l.6-4.3H14Z" /></svg>;
}

export function ScrollVcard({ data = defaultCardData }: { data?: CardData }) {
  const storyRef = useRef<HTMLElement>(null);
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gestureStartYRef = useRef<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { profile, support, properties } = data;
  const name = displayName(profile);
  const contactLabel = support.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase()
    ? "Contact details"
    : "Broker support";

  useEffect(() => {
    const stickyFrame = stickyFrameRef.current;
    if (!stickyFrame) return;

    const update = () => {
      const story = storyRef.current;
      if (!story) return;

      if (window.matchMedia("(max-width: 599px)").matches) return;

      const rect = story.getBoundingClientRect();
      const travel = Math.max(story.offsetHeight - stickyFrame.offsetHeight, 1);
      const scrolled = Math.min(travel, Math.max(0, -rect.top));
      const heroScrollShare = Number.parseFloat(
        window.getComputedStyle(story).getPropertyValue("--hero-scroll-share"),
      ) || 0.16;
      const heroHold = travel * heroScrollShare;

      let nextStep = 0;

      if (scrolled >= heroHold) {
        const propertyTravel = Math.max(travel - heroHold, 1);
        const propertyProgress = Math.min(1, (scrolled - heroHold) / propertyTravel);
        nextStep = 1 + Math.round(propertyProgress * (properties.length - 1));
      }

      setActiveStep((currentStep) => currentStep === nextStep ? currentStep : nextStep);
    };

    const scheduleUpdate = () => {
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        update();
      });
    };

    const moveMobileStep = (direction: 1 | -1) => {
      setActiveStep((currentStep) => Math.min(properties.length, Math.max(0, currentStep + direction)));
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!window.matchMedia("(max-width: 599px)").matches || !event.isPrimary) return;
      gestureStartYRef.current = event.clientY;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const startY = gestureStartYRef.current;
      if (startY !== null && Math.abs(startY - event.clientY) > 8) {
        if (!stickyFrame.hasPointerCapture(event.pointerId)) stickyFrame.setPointerCapture(event.pointerId);
        event.preventDefault();
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      const startY = gestureStartYRef.current;
      gestureStartYRef.current = null;
      if (stickyFrame.hasPointerCapture(event.pointerId)) stickyFrame.releasePointerCapture(event.pointerId);
      if (startY === null || Math.abs(startY - event.clientY) < 36) return;
      event.preventDefault();
      moveMobileStep(startY > event.clientY ? 1 : -1);
    };

    const handlePointerCancel = () => { gestureStartYRef.current = null; };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!window.matchMedia("(max-width: 599px)").matches) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") moveMobileStep(1);
      if (event.key === "ArrowUp" || event.key === "PageUp") moveMobileStep(-1);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("keydown", handleKeyDown);
    stickyFrame.addEventListener("pointerdown", handlePointerDown);
    stickyFrame.addEventListener("pointermove", handlePointerMove);
    stickyFrame.addEventListener("pointerup", handlePointerUp);
    stickyFrame.addEventListener("pointercancel", handlePointerCancel);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("keydown", handleKeyDown);
      stickyFrame.removeEventListener("pointerdown", handlePointerDown);
      stickyFrame.removeEventListener("pointermove", handlePointerMove);
      stickyFrame.removeEventListener("pointerup", handlePointerUp);
      stickyFrame.removeEventListener("pointercancel", handlePointerCancel);
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [properties.length]);

  const propertyStep = Math.max(0, activeStep - 1);
  const heroIsActive = activeStep === 0;

  return (
    <main className="page-shell">
      <section
        className="scroll-story"
        ref={storyRef}
        aria-label={`${name} digital business card`}
        style={{ "--story-height": `${Math.max(140, 120 + properties.length * 20)}vh` } as CSSProperties}
      >
        <div className="sticky-frame" ref={stickyFrameRef}>
          <article className={`vcard ${heroIsActive ? "show-profile" : "show-projects"}`}>
            <header className="persistent-header">
              <BrokerContact support={support} label={contactLabel} />
              <CopyPageLinkButton profile={profile} />
            </header>

            <section className="hero-panel" aria-hidden={!heroIsActive}>
              <div className="hero-grid" aria-hidden="true" />
              <div className="hero-media">
                <div className="portrait-halo" aria-hidden="true" />
                <Image className="hero-photo" src={profile.image} alt={name} fill priority sizes="(max-width: 640px) 82vw, 430px" {...imageProps(profile.image)} />
              </div>
              <div className="hero-content">
                <p className="role"><span />{profile.role}</p>
                <h1>{name}</h1>
                <p className="location">{profile.location}</p>
                <div className="primary-actions">
                  <SaveContactButton profile={profile} />
                  {profile.facebook ? <a className="action-button action-secondary" href={profile.facebook} target="_blank" rel="noopener noreferrer" tabIndex={heroIsActive ? 0 : -1}>
                    <FacebookIcon />Facebook
                  </a> : profile.website ? <a className="action-button action-secondary" href={profile.website} target="_blank" rel="noopener noreferrer" tabIndex={heroIsActive ? 0 : -1}><ArrowIcon />Website</a> : null}
                </div>
                <div className="scroll-cue" aria-hidden="true">
                  <span><span className="mobile-copy">Swipe to explore</span><span className="desktop-copy">Scroll to explore</span></span><i />
                </div>
              </div>
            </section>

            <section className="projects-panel" aria-labelledby="sales-kit-title" aria-hidden={heroIsActive}>
              <div className="profile-strip">
                <Image src={profile.image} alt="" width={52} height={52} {...imageProps(profile.image)} />
                <div><strong>{name}</strong><span>{profile.role}</span></div>
              </div>

              <div className="projects-heading">
                <p>{data.portfolioLabel}</p>
                <h2 id="sales-kit-title">{data.portfolioTitle}</h2>
              </div>

              <div className="property-stage" aria-live="polite">
                {properties.map((property, index) => {
                  const isActive = !heroIsActive && index === propertyStep;
                  return (
                    <a className={`property-card ${isActive ? "is-active" : ""}`} href={property.href} target="_blank" rel="noopener noreferrer" key={property.name} aria-hidden={!isActive} tabIndex={isActive ? 0 : -1}>
                      <Image className="property-card-image" src={property.image} alt="" fill sizes="(max-width: 599px) 100vw, 30rem" {...imageProps(property.image)} />
                      <span className="property-type">{property.type}</span>
                      <strong>{property.name}</strong>
                      <span className="property-action">View sales materials<span className="arrow"><ArrowIcon /></span></span>
                    </a>
                  );
                })}
              </div>

              <div className="progress-track" style={{ gridTemplateColumns: `repeat(${properties.length}, 1fr)` }} aria-hidden="true">
                {properties.map((property, index) => <span className={index <= propertyStep ? "is-complete" : ""} key={property.name} />)}
              </div>
              <p className="scroll-direction">
                {propertyStep === properties.length - 1 ? "Portfolio complete" : <><span className="mobile-copy">Swipe to continue</span><span className="desktop-copy">Keep scrolling</span></>}
              </p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
