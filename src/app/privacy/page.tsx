import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy policy for ${siteConfig.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-fb-text">
      <header className="border-b border-white/10">
        <div className="container-site flex h-20 items-center justify-between">
          <Link href="/" aria-label="Founder-Being home">
            <Logo variant="lockup-white" height={44} />
          </Link>
          <Link
            href="/"
            className="text-sm text-fb-body transition-colors hover:text-fb-text"
          >
            Back home
          </Link>
        </div>
      </header>

      <main className="container-site py-20">
        <div className="container-content">
          <p className="section-label">Legal</p>
          <h1 className="editorial-h text-4xl md:text-5xl">Privacy</h1>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-fb-body">
            <p>
              Founder-Being respects your privacy. Information submitted through
              forms on this website is used solely to respond to your enquiry and,
              where you have opted in, to share updates about gatherings and
              related programmes.
            </p>
            <p>
              We do not sell personal data. Access to enquiry details is limited
              to people operating Founder-Being communications.
            </p>
            <p>
              For privacy questions, contact{" "}
              <a
                className="text-[#FFAB33] underline-offset-4 hover:underline"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
              .
            </p>
            <p className="text-sm text-fb-meta">
              This notice will be expanded as the initiative matures. Last
              updated {new Date().getFullYear()}.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
