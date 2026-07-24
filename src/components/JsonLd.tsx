import { gatherings, residentialHighlight } from "@/lib/gatherings";
import { siteConfig } from "@/lib/site";

export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
    logo: `${siteConfig.url}/brand/lockup-white.png`,
    image: `${siteConfig.url}/brand/monogram-gold.png`,
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
    slogan: siteConfig.tagline,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
    ],
  };

  const eventSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: residentialHighlight.title,
      description: residentialHighlight.description,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: residentialHighlight.city,
        address: residentialHighlight.meta,
      },
      organizer: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      url: `${siteConfig.url}${residentialHighlight.href}`,
    },
    ...gatherings.map((event) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      description: event.description,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: event.city,
        address: event.meta,
      },
      organizer: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      url: `${siteConfig.url}/#events`,
    })),
  ];

  const payloads = [organization, website, breadcrumb, ...eventSchemas];

  return (
    <>
      {payloads.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
