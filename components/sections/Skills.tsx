"use client";

import { useRef, type CSSProperties } from "react";
import { site } from "@/data/portfolio";
import { useReveal } from "@/lib/useReveal";
import { IconCloud } from "@/components/ui/IconCloud";
import { Glow } from "@/components/ui/Light";
import { SectionLabel } from "@/components/ui/SectionLabel";

const { skills } = site;
const pad = (n: number) => String(n).padStart(2, "0");
const total = skills.groups.reduce((sum, group) => sum + group.items.length, 0);

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="skills" className="section">
      <Glow strength="strong" className="right-[-10%] top-[45%] w-[min(1000px,110vw)] -translate-y-1/2 opacity-60" />

      <div className="shell">
        <SectionLabel index="03">Skills</SectionLabel>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          <div>
            <h2 data-reveal-lines className="type-h2 max-w-[12ch]">
              {skills.heading}
            </h2>
            <p data-reveal className="type-eyebrow mt-6 text-ink-subtle">
              <span className="text-ink">{total}</span> technologies · <span className="text-ink">{skills.groups.length}</span>{" "}
              disciplines
            </p>

            <div className="mt-12 border-b border-hairline">
              {skills.groups.map((group, i) => (
                <div key={group.label} className="skill-group">
                  <h3 data-reveal className="skill-group__label type-eyebrow">
                    <span className="tabular-nums text-accent">{pad(i + 1)}</span>
                    {group.label}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <li key={skill.name} data-reveal className="tag">
                        {skill.icon && (
                          <span
                            aria-hidden="true"
                            className="tag__icon"
                            style={{ "--icon": `url(${skill.icon})` } as CSSProperties}
                          />
                        )}
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="mx-auto w-full max-w-[340px] lg:max-w-[540px]">
            <IconCloud icons={skills.cloud} />
          </div>
        </div>
      </div>
    </section>
  );
}
