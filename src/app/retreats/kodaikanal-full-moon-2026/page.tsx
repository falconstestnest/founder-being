import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { ApplicationForm } from "@/components/retreat/ApplicationForm";
import { RetreatJsonLd } from "@/components/retreat/RetreatJsonLd";
import {
  applicationSteps,
  excluded,
  faqs,
  formatInr,
  importantDates,
  included,
  kodaikanalRetreat,
  programme,
  retreatFacts,
  whoShouldApply,
  whyExists,
} from "@/lib/retreats/kodaikanal-2026";
import { siteConfig } from "@/lib/site";

const r = kodaikanalRetreat;

export const metadata: Metadata = {
  title: { absolute: r.seo.title },
  description: r.seo.description,
  alternates: { canonical: r.path },
  openGraph: {
    title: r.seo.title,
    description: r.seo.description,
    url: `${siteConfig.url}${r.path}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: r.seo.title,
    description: r.seo.description,
  },
};

function ApplyCta({ className = "" }: { className?: string }) {
  return (
    <a href="#apply" className={`btn btn-primary ${className}`}>
      Apply to Attend
    </a>
  );
}

export default function KodaikanalRetreatPage() {
  return (
    <>
      <RetreatJsonLd />
      <Header />
      <main className="bg-[#0B0B0B] text-fb-text">
        {/* Hero */}
        <section className="noise relative border-b border-white/10 pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="container-site">
            <p className="section-label">{r.eyebrow}</p>
            <h1 className="type-display max-w-3xl">
              {r.headline}
            </h1>
            <p className="section-lead type-body-lg mt-6">
              {r.subheadline}
            </p>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 type-meta text-secondary">
              <li>{r.datesLabel}</li>
              <li>{r.locationPublic}</li>
              <li>{r.durationLabel}</li>
              <li>Application required</li>
              <li>From {formatInr(r.earlyBirdPriceInr)}</li>
            </ul>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <ApplyCta />
              <a href="#programme" className="btn btn-secondary">
                View the Programme
              </a>
            </div>
            <p className="mt-8 max-w-xl type-small">
              Not a pitch event. Not a panel. Not a productivity workshop. A
              curated space for founders to rest, reconnect and examine what they
              are carrying.
            </p>
          </div>
        </section>

        {/* Facts */}
        <section className="section border-b border-white/10" aria-labelledby="facts-heading">
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Overview</p>
              <h2 id="facts-heading" className="type-h2 section-heading">
                Essential retreat facts
              </h2>
            </FadeIn>
            <dl className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
              {retreatFacts.map((f) => (
                <div key={f.label} className="bg-[#0B0B0B] p-6">
                  <dt className="font-mono text-xs tracking-[0.14em] uppercase text-[#FFAB33]">
                    {f.label}
                  </dt>
                  <dd className="mt-3 text-base text-fb-text">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-fb-body">
              <span className="font-medium text-fb-text">Venue: </span>
              {r.venuePublic}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fb-secondary">
              Departure for group transport: {r.departurePoint}. Capacity:{" "}
              {r.capacity} founders · Minimum cohort: {r.minimumPaid} paid.
            </p>
          </div>
        </section>

        {/* Why */}
        <section className="section border-b border-white/10" aria-labelledby="why-heading">
          <div className="container-site grid gap-12 md:grid-cols-2">
            <FadeIn>
              <p className="section-label">Intent</p>
              <h2 id="why-heading" className="type-h2 section-heading">
                Why this retreat exists
              </h2>
            </FadeIn>
            <FadeIn delayMs={60}>
              <p className="text-narrative">{whyExists.lead}</p>
              <blockquote className="pull-quote">{whyExists.pullQuote}</blockquote>
              <p className="type-small text-secondary" style={{ marginTop: "3rem" }}>
                This retreat creates time and space for founders to:
              </p>
              <ul className="list-intentional">
                {whyExists.points.map((p) => (
                  <li key={p}>
                    <span className="list-mark" aria-hidden>
                      —
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </section>

        {/* Who */}
        <section className="section border-b border-white/10" aria-labelledby="who-heading">
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Cohort</p>
              <h2 id="who-heading" className="type-h2 section-heading">
                Who should apply
              </h2>
              <ul className="list-intentional">
                {whoShouldApply.map((w) => (
                  <li key={w}>
                    <span className="list-mark" aria-hidden>
                      —
                    </span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-xl type-small">
                Not restricted by startup stage, funding status or company size.
                Selection considers fit, intent, willingness to participate and
                cohort balance.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Facilitator */}
        <section className="section border-b border-white/10" aria-labelledby="facilitator-heading">
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Guidance</p>
              <h2 id="facilitator-heading" className="editorial-h text-3xl md:text-4xl">
                Lead facilitator
              </h2>
              {r.facilitatorPublic ? (
                <div className="mt-10 max-w-2xl">
                  <h3 className="font-serif text-2xl text-fb-text">
                    {r.facilitator.name}
                  </h3>
                  <p className="mt-2 font-mono text-xs tracking-[0.14em] uppercase text-[#FFAB33]">
                    {r.facilitator.role}
                  </p>
                  <ul className="mt-8 space-y-2 text-fb-text">
                    {r.facilitator.roles.map((role) => (
                      <li key={role}>— {role}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-10 max-w-xl text-lg text-fb-body">
                  Lead facilitator to be announced.
                </p>
              )}
            </FadeIn>
          </div>
        </section>

        {/* Programme */}
        <section
          id="programme"
          className="section border-b border-white/10"
          aria-labelledby="programme-heading"
        >
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Programme</p>
              <h2 id="programme-heading" className="editorial-h text-3xl md:text-4xl">
                Day-by-day (tentative)
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fb-secondary">
                Timings may change based on weather, group needs and the
                facilitator&apos;s final design.
              </p>
            </FadeIn>
            <ol className="mt-14 space-y-8">
              {programme.map((day) => (
                <li
                  key={day.day}
                  className="grid gap-4 border-t border-white/10 pt-8 md:grid-cols-[10rem_1fr]"
                >
                  <div>
                    <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#FFAB33]">
                      {day.day}
                    </p>
                    <p className="mt-2 text-sm text-fb-secondary">{day.date}</p>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-fb-text">{day.title}</h3>
                    <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-fb-body md:text-base">
                      {day.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-12">
              <ApplyCta />
            </div>
          </div>
        </section>

        {/* Included / excluded */}
        <section className="section border-b border-white/10" aria-labelledby="include-heading">
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Inclusions</p>
              <h2 id="include-heading" className="editorial-h text-3xl md:text-4xl">
                What is included
              </h2>
            </FadeIn>
            <div className="mt-12 grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="font-mono text-xs tracking-[0.14em] uppercase text-[#FFAB33]">
                  Included
                </h3>
                <ul className="mt-6 space-y-3 text-fb-body">
                  {included.map((i) => (
                    <li key={i} className="border-b border-white/10 pb-3">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.14em] uppercase text-[#FFAB33]">
                  Not included
                </h3>
                <ul className="mt-6 space-y-3 text-fb-body">
                  {excluded.map((i) => (
                    <li key={i} className="border-b border-white/10 pb-3">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="section border-b border-white/10" aria-labelledby="pricing-heading">
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Investment</p>
              <h2 id="pricing-heading" className="editorial-h text-3xl md:text-4xl">
                Pricing
              </h2>
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <article className="border border-[#FFAB33]/35 p-8">
                  <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#FFAB33]">
                    Early bird
                  </p>
                  <p className="mt-4 font-serif text-4xl text-fb-text">
                    {formatInr(r.earlyBirdPriceInr)}
                  </p>
                  <p className="mt-4 text-sm text-fb-body">
                    First {r.earlyBirdCapacity} selected founders who complete
                    the reservation deposit.
                  </p>
                </article>
                <article className="border border-white/10 p-8">
                  <p className="font-mono text-xs tracking-[0.14em] uppercase text-fb-secondary">
                    Standard
                  </p>
                  <p className="mt-4 font-serif text-4xl text-fb-text">
                    {formatInr(r.standardPriceInr)}
                  </p>
                  <p className="mt-4 text-sm text-fb-body">
                    Remaining founders after early-bird seats are filled.
                  </p>
                </article>
              </div>
              <p className="mt-8 max-w-2xl text-sm leading-relaxed text-fb-secondary">
                Applying does not reserve a seat. A seat is confirmed only after
                selection and receipt of the required payment. Early-bird
                assignment depends on the order deposits are received, not
                application timestamp alone. Deposit after selection:{" "}
                {formatInr(r.depositInr)} (shared privately).
              </p>
              <div className="mt-10">
                <ApplyCta />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Process */}
        <section className="section border-b border-white/10" aria-labelledby="process-heading">
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Process</p>
              <h2 id="process-heading" className="editorial-h text-3xl md:text-4xl">
                Application and selection
              </h2>
              <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {applicationSteps.map((s, i) => (
                  <li key={s.title} className="border border-white/10 p-6">
                    <span className="font-mono text-xs text-[#FFAB33]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-serif text-xl text-fb-text">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-fb-body">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </div>
        </section>

        {/* Dates */}
        <section className="section border-b border-white/10" aria-labelledby="dates-heading">
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Timeline</p>
              <h2 id="dates-heading" className="editorial-h text-3xl md:text-4xl">
                Important dates
              </h2>
              <dl className="mt-12 max-w-2xl space-y-0">
                {importantDates.map((d) => (
                  <div
                    key={d.label}
                    className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:justify-between sm:gap-8"
                  >
                    <dt className="text-fb-secondary">{d.label}</dt>
                    <dd className="text-fb-text sm:text-right">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>
        </section>

        {/* FAQ */}
        <section className="section border-b border-white/10" aria-labelledby="faq-heading">
          <div className="container-site">
            <FadeIn>
              <p className="section-label">FAQ</p>
              <h2 id="faq-heading" className="editorial-h text-3xl md:text-4xl">
                Frequently asked questions
              </h2>
              <div className="mt-12 max-w-3xl space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="faq-item group">
                    <summary>
                      <span className="flex items-start justify-between gap-4">
                        {f.q}
                        <span
                          className="text-accent transition group-open:rotate-45"
                          aria-hidden
                        >
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="faq-body">{f.a}</p>
                  </details>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Apply form */}
        <section
          id="apply"
          className="section border-b border-white/10"
          aria-labelledby="apply-heading"
        >
          <div className="container-site">
            <FadeIn>
              <p className="section-label">Apply</p>
              <h2 id="apply-heading" className="sr-only">
                Application form
              </h2>
              {r.status === "open" ? (
                <div className="mx-auto max-w-3xl">
                  <ApplicationForm />
                </div>
              ) : (
                <p className="max-w-xl text-lg text-fb-text">
                  Applications for this retreat are currently closed. Join the
                  Founder-Being list on the{" "}
                  <Link href="/contact" className="underline-offset-4 hover:underline">
                    contact page
                  </Link>{" "}
                  to hear about future gatherings.
                </p>
              )}
            </FadeIn>
          </div>
        </section>

        {/* Legal / wellbeing */}
        <section className="section" aria-labelledby="notices-heading">
          <div className="container-site max-w-3xl">
            <h2 id="notices-heading" className="editorial-h text-2xl md:text-3xl">
              Wellbeing and legal notices
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-fb-body">
              <p>
                Founder-Being is a wellbeing and reflective community experience.
                It is not a medical, psychiatric or psychological treatment
                programme. All physical and meditative practices are voluntary.
                Selected participants will be asked privately about relevant
                accessibility, dietary or health considerations so that
                reasonable arrangements can be discussed.
              </p>
              <p>
                If Founder-Being cancels the retreat, payments are refunded in
                full. If the minimum participation is not achieved, applicants
                may choose a full refund or transfer to a rescheduled retreat.
                After official confirmation and vendor commitment, participant
                payments become non-refundable but may be transferable where
                operationally possible. Force-majeure follows resort and
                transport terms.
              </p>
              <p>
                <Link href="/privacy" className="underline-offset-4 hover:underline">
                  Privacy
                </Link>
                {" · "}
                <Link href="/terms" className="underline-offset-4 hover:underline">
                  Terms
                </Link>
                {" · "}
                <a
                  href={`mailto:${r.supportEmail}`}
                  className="underline-offset-4 hover:underline"
                >
                  {r.supportEmail}
                </a>
              </p>
            </div>
            <div className="mt-12 opacity-80">
              <Logo variant="nav-white" height={28} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
