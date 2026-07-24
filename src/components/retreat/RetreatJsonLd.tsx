import { kodaikanalRetreat, formatInr } from "@/lib/retreats/kodaikanal-2026";
import { siteConfig } from "@/lib/site";

export function RetreatJsonLd() {
  const r = kodaikanalRetreat;
  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: r.title,
    description: r.subheadline,
    startDate: r.startsAt,
    endDate: r.endsAt,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: r.locationPublic,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kodaikanal",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
    image: [`${siteConfig.url}/brand/lockup-white.png`],
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Early bird",
        price: r.earlyBirdPriceInr,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${siteConfig.url}${r.path}`,
        description: `First ${r.earlyBirdCapacity} selected founders who complete the reservation deposit. ${formatInr(r.earlyBirdPriceInr)}.`,
      },
      {
        "@type": "Offer",
        name: "Standard",
        price: r.standardPriceInr,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${siteConfig.url}${r.path}`,
      },
    ],
    url: `${siteConfig.url}${r.path}`,
    maximumAttendeeCapacity: r.capacity,
  };

  if (r.facilitatorPublic) {
    Object.assign(event, {
      performer: {
        "@type": "Person",
        name: r.facilitator.name,
        description: r.facilitator.role,
      },
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
    />
  );
}
