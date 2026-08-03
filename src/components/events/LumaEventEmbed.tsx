"use client";

import { useEffect, useRef, useState } from "react";
import { trackCta } from "@/lib/analytics/cta";
import {
  isTrustedLumaEmbedUrl,
  isTrustedLumaPublicUrl,
} from "@/lib/events/luma";

export type LumaEventEmbedProps = {
  embedUrl: string;
  publicEventUrl?: string;
  title: string;
  /** Analytics event id (catalogue or Luma id) */
  eventId?: string;
};

/**
 * Responsive Luma registration iframe with loading + fallback.
 * Does not claim registration completion (cross-origin).
 */
export function LumaEventEmbed({
  embedUrl,
  publicEventUrl,
  title,
  eventId,
}: LumaEventEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const viewed = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const safeEmbed = isTrustedLumaEmbedUrl(embedUrl) ? embedUrl : null;
  const hasDistinctPublic =
    Boolean(publicEventUrl) &&
    isTrustedLumaPublicUrl(publicEventUrl!) &&
    publicEventUrl !== embedUrl;
  // Prefer real public Luma page; only fall back to embed URL if no public page yet
  const safePublic = hasDistinctPublic
    ? publicEventUrl!
    : publicEventUrl && isTrustedLumaPublicUrl(publicEventUrl)
      ? publicEventUrl
      : safeEmbed;
  const fallbackLabel = hasDistinctPublic
    ? "Registration not loading? Open it in Luma."
    : "Registration not loading? Open registration in a new tab.";

  useEffect(() => {
    if (!safeEmbed || viewed.current || !sectionRef.current) return;
    const el = sectionRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          viewed.current = true;
          void trackCta("cta_started", {
            cta_name: "luma_embed_viewed",
            source_page:
              typeof window !== "undefined" ? window.location.pathname : "",
            event_id: eventId ?? null,
          });
          io.disconnect();
        }
      },
      { rootMargin: "120px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [safeEmbed, eventId]);

  if (!safeEmbed) {
    return (
      <p className="text-sm text-fb-secondary">
        Registration is temporarily unavailable. Please contact{" "}
        <a href="mailto:hello@founderbeing.org" className="link-inline">
          hello@founderbeing.org
        </a>
        .
      </p>
    );
  }

  return (
    <div ref={sectionRef} className="luma-embed-section">
      <div className="luma-embed-container">
        {!loaded && (
          <p
            className="luma-embed-loading type-small text-fb-secondary"
            aria-live="polite"
          >
            Loading registration…
          </p>
        )}
        <iframe
          src={safeEmbed}
          title={
            title
              ? `Register for ${title} through Luma`
              : "Register for the Founder-Being gathering through Luma"
          }
          className="luma-embed"
          width={600}
          height={450}
          allow="fullscreen; payment"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={0}
          onLoad={() => {
            setLoaded(true);
            void trackCta("cta_completed", {
              cta_name: "luma_embed_loaded",
              source_page:
                typeof window !== "undefined" ? window.location.pathname : "",
              event_id: eventId ?? null,
            });
          }}
        />
      </div>

      {safePublic && (
        <p className="mt-4 text-center type-small">
          <a
            href={safePublic}
            target="_blank"
            rel="noopener noreferrer"
            className="link-inline"
            onClick={() => {
              void trackCta("cta_clicked", {
                cta_name: "luma_fallback_clicked",
                source_page:
                  typeof window !== "undefined" ? window.location.pathname : "",
                event_id: eventId ?? null,
              });
            }}
          >
            {fallbackLabel}
          </a>
        </p>
      )}
    </div>
  );
}
