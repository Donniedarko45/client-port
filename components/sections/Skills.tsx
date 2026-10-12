"use client";

import { useRef } from "react";
import { site } from "@/data/portfolio";
import { useReveal } from "@/lib/useReveal";
import { IconCloud } from "@/components/ui/IconCloud";
import { Glow } from "@/components/ui/Light";
import { SectionLabel } from "@/components/ui/SectionLabel";

const { skills } = site;

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="skills" className="section">
      <Glow strength="strong" className="left-1/2 top-[55%] w-[min(1000px,120vw)] -translate-x-1/2 -translate-y-1/2 opacity-60" />

      <div className="shell">
        <SectionLabel index="03">Skills</SectionLabel>
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          <div>
            <h2 data-reveal-lines className="type-h2 max-w-[12ch]">
              {skills.heading}
            </h2>
            <p data-reveal className="mt-6 flex items-center gap-3 text-sm text-ink-muted">
              <span className="tag__dot" aria-hidden="true" />
              Top skills are lit
            </p>

            <ul className="mt-12 flex flex-wrap gap-3">
              {skills.top.map((skill) => (
                <li key={skill} data-reveal className="tag" data-core="true">
                  <span className="tag__dot" aria-hidden="true" />
                  {skill}
                  <span className="sr-only">(top skill)</span>
                </li>
              ))}
              {skills.additional.map((skill) => (
                <li key={skill} data-reveal className="tag">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="mx-auto w-full max-w-[520px]">
            <IconCloud icons={skills.cloud} />
          </div>
        </div>
      </div>
    </section>
  );
}
