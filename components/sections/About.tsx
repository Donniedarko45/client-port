"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/data/portfolio";
import { useReveal } from "@/lib/useReveal";
import { Glow } from "@/components/ui/Light";
import { SectionLabel } from "@/components/ui/SectionLabel";

const { about, name, location } = site;

/**
 * The rounded-square slot (`data-portrait="slot"`) is where the hero
 * portrait lands. Nothing above it may be transformed, or the landing
 * position would be measured wrong — reveal its siblings, not its parents.
 */
export function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="about" data-portrait="about" className="section about">
      <Glow strength="soft" className="-left-[15%] top-[10%] w-[60vw]" />
      <Glow className="right-[-20%] bottom-[-10%] w-[50vw]" />

      <div className="shell">
        <SectionLabel index="01">About</SectionLabel>

        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center lg:gap-16">
          <div className="relative w-full max-w-[460px]">
            <div data-portrait="slot" className="about__slot">
              <Image
                data-portrait="photo"
                src={about.photo.src}
                alt={about.photo.alt}
                fill
                sizes="(min-width: 768px) 460px, 92vw"
                className="object-cover"
              />
            </div>
            <p data-portrait="badge" className="status-badge type-eyebrow absolute bottom-4 left-4">
              <span className="status-badge__dot" aria-hidden="true" />
              {about.status.label}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <h2 data-reveal-lines className="type-h2 type-h2--compact">
              {about.heading}
            </h2>
            <p data-reveal className="type-lead max-w-[62ch]">
              {about.bio}
            </p>

            <dl data-reveal className="grid grid-cols-2 gap-6 border-t border-hairline pt-6 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <dt className="type-eyebrow text-ink-subtle">Experience</dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight">{about.stat.value}</span>
                  <span className="text-sm text-ink-muted">{about.stat.label}</span>
                </dd>
              </div>
              <div>
                <dt className="type-eyebrow text-ink-subtle">Based in</dt>
                <dd className="mt-2 text-sm text-ink-muted">{location}</dd>
              </div>
              <div>
                <dt className="type-eyebrow text-ink-subtle">Pronouns</dt>
                <dd className="mt-2 text-sm text-ink-muted">{name.pronouns}</dd>
              </div>
            </dl>

            <p data-reveal className="text-sm text-ink-muted">
              <span aria-hidden="true" className="text-success">●</span> Open to work as{" "}
              <span className="text-ink">{about.status.roles.join(" · ")}</span>
            </p>
          </div>
        </div>

        <ul className="mt-16 grid gap-4 md:grid-cols-3">
          {about.highlights.map((item) => (
            <li key={item.label} data-reveal className="glow-pill">
              <span className="glow-pill__orb" aria-hidden="true" />
              <span className="flex flex-col gap-1">
                <span className="type-h3">{item.label}</span>
                <span className="text-sm text-ink-muted">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
