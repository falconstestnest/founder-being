"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/lib/data";

export function Voices() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % testimonials.length);
        setVisible(true);
      }, 280);
    }, 7000);

    return () => window.clearInterval(id);
  }, []);

  const current = testimonials[index];

  return (
    <section
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="voices-heading"
      aria-roledescription="carousel"
    >
      <div className="container-site">
        <p className="section-label">08 — Voices</p>
        <h2
          id="voices-heading"
          className="editorial-h max-w-2xl text-4xl text-fb-text md:text-5xl"
        >
          Founder Voices
        </h2>

        <div className="mx-auto mt-16 max-w-[40rem] text-center">
          <blockquote
            className={`transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="font-serif text-3xl leading-snug text-fb-text md:text-4xl">
              “{current.quote}”
            </p>
            <footer className="mt-10 font-mono text-xs tracking-[0.12em] uppercase text-fb-meta">
              {current.attribution}
            </footer>
          </blockquote>

          <div
            className="mt-12 flex items-center justify-center gap-3"
            role="tablist"
            aria-label="Testimonial slides"
          >
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFAB33] ${
                  i === index ? "bg-[#FFAB33]" : "bg-white/25"
                }`}
                onClick={() => {
                  setVisible(false);
                  window.setTimeout(() => {
                    setIndex(i);
                    setVisible(true);
                  }, 200);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
