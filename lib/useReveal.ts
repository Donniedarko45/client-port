"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "./gsap";
import { motion, prefersReducedMotion } from "./motion";

/**
 * Scroll reveals for everything inside `scope`:
 *  - `[data-reveal-lines]` headings rise line by line out of a mask.
 *  - `[data-reveal]` items fade up, staggered with whatever enters alongside.
 * Each plays once. With reduced motion they only fade.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const m = motion();
      const reduced = prefersReducedMotion();

      gsap.utils.toArray<HTMLElement>("[data-reveal-lines]", root).forEach((heading) => {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            gsap.set(heading, { opacity: 1 });
            return gsap.from(self.lines, {
              ...(reduced ? { opacity: 0 } : { yPercent: 105 }),
              duration: m.duration.reveal,
              ease: m.ease.out,
              stagger: m.stagger * 2,
              scrollTrigger: { trigger: heading, start: "top 88%", once: true },
            });
          },
        });
      });

      ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>("[data-reveal]", root), {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: m.duration.reveal,
            ease: m.ease.out,
            stagger: m.stagger,
            overwrite: true,
          }),
      });
    },
    { scope },
  );
}
