"use client";

import Image from "next/image";
import { useRef } from "react";
import { site, type Project } from "@/data/portfolio";
import { useReveal } from "@/lib/useReveal";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Beam } from "@/components/ui/Light";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SpotlightGrid } from "@/components/ui/SpotlightGrid";

const { projects } = site;

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  return (
    <article
      data-reveal
      data-spotlight
      className={[
        "spotlight-card flex flex-col gap-6 p-4 sm:p-6",
        featured ? "md:col-span-2 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10" : "",
      ].join(" ")}
    >
      <div className={["card-media aspect-[16/10]", featured ? "lg:order-2" : ""].join(" ")}>
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes={featured ? "(min-width: 1024px) 860px, 92vw" : "(min-width: 768px) 46vw, 92vw"}
          className="object-cover"
        />
        <span aria-hidden="true" className="card-media__tone" />
      </div>

      <div className="flex flex-1 flex-col gap-5 px-2 pb-2 lg:justify-between">
        <div className="flex flex-col gap-5">
          <p className="type-eyebrow flex items-center gap-3 text-ink-subtle">
            <span className="tabular-nums text-ink">{String(index + 1).padStart(2, "0")}</span>
            {project.client && <span>{project.client}</span>}
          </p>
          <h3 className={featured ? "type-h2 type-h2--compact" : "type-h3 text-[clamp(24px,2.4vw,36px)]"}>
            {project.title}
          </h3>
          <p className="type-body max-w-[52ch]">{project.description}</p>
        </div>

        <div className="flex flex-col gap-5">
          <ul className="flex flex-wrap gap-2" aria-label="Technologies">
            {project.tech.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-6 border-t border-hairline pt-5">
              {project.links.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="link-arrow"
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {link.label}
                    <span className="sr-only">: {project.title}</span>
                    <ArrowUpRight />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="projects" className="section">
      <Beam />
      <div className="shell">
        <SectionLabel index="04">Projects</SectionLabel>
        <h2 data-reveal-lines className="type-h2 mt-8 max-w-[16ch]">
          {projects.heading}
        </h2>

        <SpotlightGrid className="mt-16 grid gap-4 md:grid-cols-2 lg:gap-5">
          {projects.items.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} featured={i === 0} />
          ))}
        </SpotlightGrid>
      </div>
    </section>
  );
}
