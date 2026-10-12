"use client";

import { useRef } from "react";
import { site } from "@/data/portfolio";
import { useReveal } from "@/lib/useReveal";
import { Beam, Glow } from "@/components/ui/Light";
import { Marquee } from "@/components/ui/Marquee";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Services } from "./Services";

const { expertise } = site;

export function Expertise() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="expertise" className="section">
      <Beam />
      <Glow strength="soft" className="-right-[25%] top-[35%] w-[70vw]" />

      <div className="shell">
        <SectionLabel index="02">Expertise</SectionLabel>
        <h2 data-reveal-lines className="type-h2 mt-8 max-w-[14ch]">
          {expertise.heading}
        </h2>
      </div>

      <div data-reveal className="mt-16">
        <Marquee items={expertise.headlineRoles} />
      </div>

      <div className="shell mt-24">
        <h3 data-reveal className="type-eyebrow text-ink-muted">
          Experience
        </h3>
        <ol className="mt-6 border-b border-hairline">
          {expertise.experience.map((job) => (
            <li key={`${job.company}-${job.period}`} data-reveal className="timeline-row">
              <p className="type-eyebrow tabular-nums text-ink-subtle">{job.period}</p>
              <div>
                <p className="type-h3">{job.role}</p>
                <p className="mt-2 text-sm text-ink-muted">
                  {[job.company, job.type, job.location].filter(Boolean).join(" · ")}
                </p>
              </div>
              <p className="type-body">{job.summary}</p>
            </li>
          ))}
        </ol>

        <div className="mt-32">
          <Services />
        </div>
      </div>
    </section>
  );
}
