"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/data/portfolio";
import { ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { ArrowUpRight } from "@/components/ui/Icons";
import { PillButton } from "@/components/ui/PillButton";

export function Navbar() {
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { lock } = useSmoothScroll();

  // Which section is under the middle of the screen, and whether we've left the top.
  useEffect(() => {
    const triggers = site.nav.flatMap(({ href }) => {
      const section = document.querySelector(href);
      if (!section) return [];
      return ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(href),
      });
    });
    triggers.push(
      ScrollTrigger.create({ start: 24, end: "max", onToggle: (self) => setScrolled(self.isActive) }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Mobile menu: freeze the page, close on Escape, and hand focus back.
  useEffect(() => {
    lock(open);
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, lock]);

  return (
    <>
      <header className="nav" data-scrolled={scrolled || open}>
        <div className="shell flex h-full items-center justify-between gap-6">
          <a href="#home" className="nav__brand text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
            {site.name.first}
            <span className="hidden text-ink-subtle sm:inline"> {site.name.last}</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="nav__link text-[13px] font-medium" aria-current={active === item.href || undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <PillButton href={site.resume} target="_blank" rel="noreferrer" size="sm" icon={<ArrowUpRight size={12} />}>
              Resume
            </PillButton>
            <button
              ref={toggleRef}
              type="button"
              className="pill lg:hidden"
              data-variant="outline"
              data-size="sm"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="pill__label">{open ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        className="menu lg:hidden"
        data-open={open}
        inert={!open}
        aria-label="Site menu"
        role="dialog"
        aria-modal="true"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {site.nav.map((item, i) => (
              <li key={item.href} className="menu__item" style={{ "--i": i } as CSSProperties}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === item.href || undefined}
                  className="flex items-baseline gap-4 py-1 text-[clamp(36px,10vw,64px)] font-extrabold uppercase leading-[1.05] tracking-[-0.04em] text-ink-muted aria-[current=true]:text-ink"
                >
                  <span className="type-eyebrow tabular-nums text-ink-subtle">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={`mailto:${site.contact.email}`}
          className="menu__item text-sm text-ink-muted"
          style={{ "--i": site.nav.length } as CSSProperties}
        >
          {site.contact.email}
        </a>
      </div>
    </>
  );
}
