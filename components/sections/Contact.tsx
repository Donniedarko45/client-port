"use client";

import { useRef } from "react";
import { site } from "@/data/portfolio";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useReveal } from "@/lib/useReveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Glow } from "@/components/ui/Light";
import { SectionLabel } from "@/components/ui/SectionLabel";

const { contact, name, location } = site;

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  // The name's halo brightens as the section arrives — opacity only.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".glow-name__halo",
        { opacity: 0 },
        { opacity: 0.45, ease: "none", scrollTrigger: { trigger: ".glow-name", start: "top bottom", end: "center center", scrub: true } },
      );
    },
    { scope: ref },
  );

  const details = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
    { label: "LinkedIn", value: "in/sourabhsinghrajput", href: contact.linkedin },
    { label: "Location", value: location },
  ];

  return (
    <section ref={ref} id="contact" className="section overflow-hidden">
      <Glow strength="strong" className="right-[-15%] top-[30%] w-[70vw] max-w-[1100px]" />

      <div className="shell">
        <SectionLabel index="06">Contact</SectionLabel>
        <h2 data-reveal-lines className="type-h2 mt-8 max-w-[14ch]">
          {contact.heading}
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <ContactForm />
          </div>

          <div className="flex flex-col justify-between gap-12 [container-type:inline-size]">
            <p data-reveal className="glow-name">
              <span className="sr-only">
                {name.first} {name.last}
              </span>
              <span className="glow-name__halo" aria-hidden="true">
                {name.first}
                <br />
                {name.last}
              </span>
              <span className="glow-name__fill" aria-hidden="true">
                {name.first}
                <br />
                {name.last}
              </span>
            </p>

            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {details.map((item) => (
                <div key={item.label} data-reveal className="border-t border-hairline pt-4">
                  <dt className="type-eyebrow text-ink-subtle">{item.label}</dt>
                  <dd className="mt-2 text-sm">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="link-arrow link-arrow--plain"
                        {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {item.value}
                        <ArrowUpRight size={12} />
                      </a>
                    ) : (
                      <span className="text-ink-muted">{item.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
