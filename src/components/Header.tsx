"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled || open
          ? "border-b border-white/10 bg-[#0B0B0B]/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFAB33]"
          aria-label="Founder-Being home"
        >
          <span className="hidden sm:inline-flex">
            <Logo variant="nav-white" height={34} priority />
          </span>
          <span className="inline-flex sm:hidden">
            <Logo variant="monogram-white" height={32} priority />
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.8125rem] tracking-[0.06em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFAB33] ${
                  active
                    ? "text-fb-text"
                    : "text-fb-body hover:text-fb-text"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-fb-text lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFAB33]"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5" aria-hidden>
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-white/10 bg-[#0B0B0B] lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav className="container-site flex flex-col gap-1 py-6" aria-label="Mobile">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 text-base tracking-[0.04em] ${
                  active ? "text-fb-text" : "text-fb-body"
                }`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="mt-2 py-3 text-base text-[#FFAB33]"
            onClick={() => setOpen(false)}
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
