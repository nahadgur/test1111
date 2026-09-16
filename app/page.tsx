import Image from "next/image";
import { AppointmentForm } from "@/components/appointment-form";
import { CopyPageLinkButton, SaveContactButton } from "@/components/profile-actions";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { VideoSeries } from "@/components/video-series";

export default function Home() {
  return (
    <>
      <RevealOnScroll />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header" id="top">
        <a className="wordmark" href="#top">Noel Cobangbang</a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#learn">About AYS</a>
          <a href="#news">News</a>
          <a href="#contact">Contact</a>
        </nav>
        <SaveContactButton />
      </header>

      <main id="main">
        <section className="hero">
          <div className="cover-photo">
            <Image src="/assets/cover.webp" alt="Noel Cobangbang attending an AYS community event" width={1600} height={1000} priority />
          </div>

          <div className="profile-card page-width" data-reveal>
            <Image className="profile-photo" src="/assets/noel-profile.png" alt="Noel N. Cobangbang" width={512} height={512} priority />
            <div className="profile-copy">
              <p className="role">AYS Neopreneur</p>
              <h1>Noel N. Cobangbang</h1>
              <p className="intro">I help business owners improve sales and cut manual work with technology.</p>
              <div className="profile-actions">
                <a className="button" href="#contact">Book an appointment</a>
                <a className="button secondary" href="https://www.facebook.com/noel.cobangbang.7" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
            <dl className="profile-details">
              <div><dt>Based in</dt><dd>Philippines</dd></div>
              <div><dt>Focus</dt><dd>Technology and business systems</dd></div>
              <div><dt>Hours</dt><dd>Open daily</dd></div>
            </dl>
          </div>
        </section>

        <section className="about page-width section" id="about" data-reveal>
          <div className="section-label">About Noel</div>
          <div className="about-copy">
            <h2>Practical technology for growing businesses.</h2>
            <div>
              <p>Noel works with entrepreneurs who want a clearer sales process and less manual work. He studies how customers buy, finds the steps that slow a team down, and sets up tools that fit the business.</p>
              <p>His work covers automation and community building through AYS. He helps owners run the business with more control and give customers a better experience.</p>
            </div>
          </div>
          <div className="office-photos">
            <figure data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
              <Image src="/assets/office-overview.webp" alt="AYS company office presentation" width={1600} height={1000} />
              <figcaption>AYS company profile</figcaption>
            </figure>
            <figure data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
              <Image src="/assets/office-team.webp" alt="AYS office and team information" width={1600} height={1000} />
              <figcaption>Company office and team</figcaption>
            </figure>
          </div>
        </section>

        <section className="learn section" id="learn">
          <div className="page-width">
            <div className="section-heading" data-reveal>
              <div><p className="section-label">About AYS</p><h2>Watch the six-part introduction</h2></div>
              <p>Start with the company profile, then work through the business model and community program.</p>
            </div>
            <div data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}><VideoSeries /></div>
            <div className="app-link" data-reveal style={{ "--reveal-delay": "140ms" } as React.CSSProperties}>
              <div><strong>AYS customer app</strong><span>Register with Noel&apos;s referral link.</span></div>
              <a href="https://appyourserbisyo.ph/onboarding?coupon_code=AYS-LSZGTH4" target="_blank" rel="noopener noreferrer">Open the app page</a>
            </div>
          </div>
        </section>

        <section className="news page-width section" id="news">
          <div className="section-heading" data-reveal>
            <div><p className="section-label">Recent work</p><h2>Partnerships and public events</h2></div>
            <p>AYS works with government offices and training organizations across the Philippines.</p>
          </div>

          <div className="news-grid">
            <article data-reveal>
              <Image src="/assets/tesda-ncr.webp" alt="AYS partnership event with TESDA NCR" width={1600} height={900} />
              <div><p>TESDA NCR</p><h3>AYS and TESDA NCR work together on skills and livelihood opportunities.</h3></div>
            </article>
            <article data-reveal style={{ "--reveal-delay": "70ms" } as React.CSSProperties}>
              <Image src="/assets/ormoc-moa.webp" alt="AYS and Ormoc City memorandum of agreement" width={1600} height={900} />
              <div><p>Ormoc City</p><h3>AYS signs a memorandum of agreement with the city government.</h3></div>
            </article>
            <article data-reveal style={{ "--reveal-delay": "140ms" } as React.CSSProperties}>
              <Image src="/assets/tesda-davao.webp" alt="AYS and TESDA Davao Region memorandum of agreement" width={1600} height={900} />
              <div><p>TESDA Davao Region</p><h3>AYS expands its training partnership in Mindanao.</h3></div>
            </article>
            <article data-reveal style={{ "--reveal-delay": "210ms" } as React.CSSProperties}>
              <Image src="/assets/gma7-feature.webp" alt="AYS featured on GMA7" width={1600} height={900} />
              <div><p>GMA7</p><h3>National television feature on AYS and its services.</h3></div>
            </article>
          </div>

          <figure className="endorsements" data-reveal>
            <Image src="/assets/celebrity-endorsements.webp" alt="Public personalities who have used or endorsed AYS services" width={1600} height={1000} />
            <figcaption><strong>Public support for AYS</strong><span>Personalities who have used or shared AYS services.</span></figcaption>
          </figure>
        </section>

        <section className="contact section" id="contact">
          <div className="page-width contact-grid">
            <div className="contact-copy" data-reveal>
              <p className="section-label">Contact</p>
              <h2>Talk with Noel</h2>
              <p>Ask about AYS, sales automation, or setting up a better workflow for your business.</p>
              <div className="contact-links">
                <a href="https://www.facebook.com/noel.cobangbang.7" target="_blank" rel="noopener noreferrer">Message on Facebook</a>
                <CopyPageLinkButton />
              </div>
              <details className="payment-details">
                <summary>UnionBank payment details</summary>
                <div><strong>Neo Network of Technologies Corporation</strong><code>0026 8001 5740</code></div>
              </details>
            </div>
            <div data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><AppointmentForm /></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="page-width footer-inner">
          <div><strong>Noel N. Cobangbang</strong><span>AYS Neopreneur</span></div>
          <p>© 2026 Noel N. Cobangbang</p>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </>
  );
}
