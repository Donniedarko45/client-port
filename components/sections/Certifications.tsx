"use client";

import { useRef } from "react";
import { site } from "@/data/portfolio";
import { useReveal } from "@/lib/useReveal";
import { Award, Cap, Star } from "@/components/ui/Icons";
import { Glow } from "@/components/ui/Light";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SpotlightGrid } from "@/components/ui/SpotlightGrid";

const { certifications } = site;
const { education, review } = certifications;

export function Certifications() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="certifications" className="section">
      <Glow strength="soft" className="-left-[20%] top-[30%] w-[60vw]" />

      <div className="shell">
        <SectionLabel index="05">Certifications</SectionLabel>
        <h2 data-reveal-lines className="type-h2 mt-8 max-w-[14ch]">
          {certifications.heading}
        </h2>

        <SpotlightGrid className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {certifications.items.map((cert) => (
            <article key={cert.title} data-reveal data-spotlight className="spotlight-card flex min-h-[260px] flex-col justify-between gap-10 p-8">
              <span className="text-ink-muted">
                <Award />
              </span>
              <div>
                <p className="type-eyebrow text-ink-subtle">Certification</p>
                <h3 className="type-h3 mt-3">{cert.title}</h3>
                <p className="mt-3 text-sm text-ink-muted">{cert.issuer}</p>
              </div>
            </article>
          ))}

          <article data-reveal data-spotlight className="spotlight-card flex min-h-[260px] flex-col justify-between gap-10 p-8">
            <span className="text-ink-muted">
              <Cap />
            </span>
            <div>
              <p className="type-eyebrow text-ink-subtle">Education · {education.period}</p>
              <h3 className="type-h3 mt-3">{education.title}</h3>
              <p className="mt-3 text-sm text-ink-muted">
                {education.school} · <span className="text-ink">{education.grade}</span>
              </p>
            </div>
          </article>

          <figure data-reveal data-spotlight className="spotlight-card flex flex-col gap-8 p-8 md:col-span-2 md:p-12 lg:col-span-3">
            <div className="flex items-center gap-1 text-ink" role="img" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: review.rating }, (_, i) => (
                <Star key={i} />
              ))}
            </div>
            <blockquote className="text-[clamp(28px,4vw,60px)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-balance">
              “{review.quote}”
            </blockquote>
            <figcaption className="type-eyebrow text-ink-muted">{review.source}</figcaption>
          </figure>
        </SpotlightGrid>
      </div>
    </section>
  );
}
