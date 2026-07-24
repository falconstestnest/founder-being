import Link from "next/link";
import { Logo } from "@/components/Logo";
import { navLinks, siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0B0B0B] pb-12 pt-16">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo variant="lockup-white" height={52} />
            <p className="mt-8 max-w-xs font-serif text-xl leading-snug text-fb-body">
              Building Healthier Founders.
              <br />
              Building Better Companies.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
              Navigate
            </p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fb-body transition-colors duration-300 hover:text-fb-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-sm text-fb-body transition-colors duration-300 hover:text-fb-text"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-fb-body transition-colors duration-300 hover:text-fb-text"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-fb-body transition-colors duration-300 hover:text-fb-text"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
              Connect
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={siteConfig.social.instagram}
                  className="text-sm text-fb-body transition-colors duration-300 hover:text-fb-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.linkedin}
                  className="text-sm text-fb-body transition-colors duration-300 hover:text-fb-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm text-fb-body transition-colors duration-300 hover:text-fb-text"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-lg">
              <p className="font-serif text-xl text-fb-text">
                Already part of the Founder-Being community?
              </p>
              <p className="mt-3 type-small">
                Access your workspace, upcoming gatherings, applications and
                community resources.
              </p>
              <p className="mt-3 text-xs text-fb-meta">
                Secure access for members, patrons, volunteers, reviewers and
                the Founder-Being team.
              </p>
            </div>
            <Link href="/login" className="btn btn-secondary shrink-0">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs tracking-wide text-fb-meta sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-fb-secondary">Quiet. Intentional. Timeless.</p>
        </div>
      </div>
    </footer>
  );
}
