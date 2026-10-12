"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type ScrollApi = {
  /** Scrolls to an element, a selector such as "#about", or a pixel offset. */
  scrollTo: (target: HTMLElement | string | number) => void;
  /** Freezes page scroll, e.g. while the mobile menu is open. */
  lock: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

export function useSmoothScroll() {
  const api = useContext(ScrollContext);
  if (!api) throw new Error("useSmoothScroll must be used inside <SmoothScroll>");
  return api;
}

/**
 * Lenis drives the page scroll and GSAP's ticker drives Lenis, so
 * ScrollTrigger and the smooth scroll share one frame loop. Lenis honours
 * prefers-reduced-motion on its own (1:1 scrolling, instant jumps).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo(target) {
        lenisRef.current?.scrollTo(target, { force: true });
      },
      lock(locked) {
        const lenis = lenisRef.current;
        if (!lenis) return;
        if (locked) lenis.stop();
        else lenis.start();
      },
    }),
    [],
  );

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Webfonts change line lengths; re-measure every trigger once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // In-page links ("#about") glide instead of jumping, and move focus to
    // the section so keyboard and screen-reader users land there too.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      const hash = link.getAttribute("href") ?? "#";
      const section = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
      if (!section) return;
      lenis.scrollTo(hash === "#home" ? 0 : section, { force: true });
      if (!section.hasAttribute("tabindex")) section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
