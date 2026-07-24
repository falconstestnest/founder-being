import { Logo } from "@/components/Logo";
import { navLinks, siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0B0B0B] pb-12 pt-16">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo height={40} />
            <p className="mt-6 max-w-xs font-serif text-xl leading-snug text-[#F8F8F8]/85">
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
                  <a
                    href={link.href}
                    className="text-sm text-[#F8F8F8]/65 transition-colors duration-300 hover:text-[#F8F8F8]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-[#F8F8F8]/65 transition-colors duration-300 hover:text-[#F8F8F8]"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-[#F8F8F8]/65 transition-colors duration-300 hover:text-[#F8F8F8]"
                >
                  Terms
                </a>
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
                  className="text-sm text-[#F8F8F8]/65 transition-colors duration-300 hover:text-[#F8F8F8]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.linkedin}
                  className="text-sm text-[#F8F8F8]/65 transition-colors duration-300 hover:text-[#F8F8F8]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm text-[#F8F8F8]/65 transition-colors duration-300 hover:text-[#F8F8F8]"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs tracking-wide text-[#F8F8F8]/4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Quiet. Intentional. Timeless.</p>
        </div>
      </div>
    </footer>
  );
}
