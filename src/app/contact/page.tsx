import type { Metadata } from "next";
import { JoinForm } from "@/components/JoinForm";
import { PublicPage } from "@/components/PublicPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Founder-Being",
  description:
    "General enquiries, partnerships, patron conversations, programme and media enquiries for Founder-Being.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Founder-Being",
    description: "Start a structured conversation with the Founder-Being team.",
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <PublicPage>
      <div className="container-site max-w-2xl py-28">
        <p className="section-label">Contact</p>
        <h1 className="type-h1 section-heading">Start a conversation</h1>
        <p className="section-lead">
          Programme enquiries, partnerships, patron conversations, media, and
          general contact. We respond thoughtfully—not with automated volume.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 type-small">
          {[
            "General enquiry",
            "Partnerships",
            "Patron conversations",
            "Programme enquiries",
            "Media / ecosystem",
          ].map((t) => (
            <li
              key={t}
              className="border border-white/10 px-4 py-3 text-fb-secondary"
            >
              {t}
            </li>
          ))}
        </ul>

        <p className="mt-8 type-small">
          Prefer email?{" "}
          <a className="link-inline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </p>

        <div className="mt-12">
          <JoinForm />
        </div>
      </div>
    </PublicPage>
  );
}
