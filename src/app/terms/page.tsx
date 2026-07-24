import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F8F8]">
      <header className="border-b border-white/10">
        <div className="container-site flex h-20 items-center justify-between">
          <Link href="/" aria-label="Founder-Being home">
            <Logo height={32} />
          </Link>
          <Link
            href="/"
            className="text-sm text-[#F8F8F8]/65 transition-colors hover:text-[#F8F8F8]"
          >
            Back home
          </Link>
        </div>
      </header>

      <main className="container-site py-20">
        <div className="container-content">
          <p className="section-label">Legal</p>
          <h1 className="editorial-h text-4xl md:text-5xl">Terms</h1>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-[#F8F8F8]/70">
            <p>
              By using founderbeing.org you agree to use this site lawfully and
              respectfully. Content is provided for general information about
              the Founder-Being initiative and does not constitute medical,
              legal, or professional advice.
            </p>
            <p>
              Event details, seating, and programme formats may change.
              Registration interest does not guarantee a place until confirmed
              in writing by Founder-Being.
            </p>
            <p>
              Questions:{" "}
              <a
                className="text-[#FFAB33] underline-offset-4 hover:underline"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
              .
            </p>
            <p className="text-sm text-[#F8F8F8]/45">
              These terms may be updated as the initiative evolves. Last updated{" "}
              {new Date().getFullYear()}.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
