"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/portfolio";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ServiceVisual } from "@/components/ui/ServiceVisual";

const { services } = site.expertise;
const pad = (n: number) => String(n).padStart(2, "0");
const total = pad(services.length);

/**
 * Desktop: a big typographic index. The row crossing the reading line (or
 * the one under the cursor) is lit, a spotlight slides to it, and the sticky
 * stage beside it shows that service with its illustration running.
 * Phones: a swipeable rail of cards; only the card in view animates.
 */
export function Services() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const spotRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-service-row]", listRef.current).forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
      });
    },
    { scope: listRef },
  );

  // Park the spotlight on the active row, and keep it there through resizes.
  useEffect(() => {
    const list = listRef.current;
    const spot = spotRef.current;
    if (!list || !spot) return;
    const place = () => {
      const row = list.children[active] as HTMLElement | undefined;
      if (!row) return;
      spot.style.transform = `translateY(${row.offsetTop + row.offsetHeight / 2 - spot.offsetHeight / 2}px)`;
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

  // Phones: the card that is mostly in view is the live one.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const card = entry.target as HTMLElement;
          card.dataset.live = String(entry.isIntersecting);
          if (entry.isIntersecting && counterRef.current) {
            counterRef.current.textContent = pad(Number(card.dataset.index) + 1);
          }
        }
      },
      { root: rail, threshold: 0.6 },
    );
    rail.querySelectorAll("[data-service-card]").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="services">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h3 data-reveal className="type-h2 type-h2--compact">
          Services<sup className="services__count">({total})</sup>
        </h3>
        <p data-reveal className="type-eyebrow text-ink-subtle">
          <span className="hidden lg:inline">Scroll or hover to explore</span>
          <span className="lg:hidden" aria-hidden="true">
            Swipe · <span ref={counterRef} className="text-ink">01</span> / {total}
          </span>
        </p>
      </div>

      <div className="mt-12 hidden gap-12 lg:grid lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] xl:gap-20">
        <div className="relative">
          <span ref={spotRef} aria-hidden="true" className="services__spot" />
          <ol ref={listRef} className="services__list">
            {services.map((service, i) => (
              <li
                key={service.title}
                data-service-row
                data-reveal
                data-active={active === i}
                className="services__row"
                onPointerEnter={(event) => event.pointerType === "mouse" && setActive(i)}
              >
                <span className="services__index">{pad(i + 1)}</span>
                <h4 className="services__title">{service.title}</h4>
                <span className="services__arrow" aria-hidden="true">
                  <ArrowUpRight size={22} />
                </span>
                <p className="sr-only">
                  {service.summary} {service.tags.join(", ")}.
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div data-reveal className="services__stage" aria-hidden="true">
            {services.map((service, i) => (
              <div key={service.title} className="services__panel" data-live={active === i}>
                <span className="services__ghost">{pad(i + 1)}</span>
                <div className="services__visual">
                  <ServiceVisual kind={service.visual} />
                </div>
                <div>
                  <p className="type-eyebrow text-ink-subtle">
                    <span className="text-ink">{pad(i + 1)}</span> / {total}
                  </p>
                  <p className="type-h3 mt-3">{service.title}</p>
                  <p className="type-body mt-3 max-w-[46ch]">{service.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul ref={railRef} data-reveal data-lenis-prevent-horizontal className="services__rail lg:hidden" aria-label="Services">
        {services.map((service, i) => (
          <li key={service.title} data-service-card data-index={i} data-live="false" className="services__card">
            <div className="services__visual">
              <ServiceVisual kind={service.visual} />
            </div>
            <p className="type-eyebrow text-ink-subtle">
              <span className="text-ink">{pad(i + 1)}</span> / {total}
            </p>
            <h4 className="type-h3">{service.title}</h4>
            <p className="type-body">{service.summary}</p>
            <ul className="flex flex-wrap gap-2" aria-label="Includes">
              {service.tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
