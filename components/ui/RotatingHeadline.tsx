"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion, prefersReducedMotion } from "@/lib/motion";

/** "Creative Developer" → ["Creative", "Developer"]: two lines, broken at the last space. */
function toLines(phrase: string): [string, string] {
  const cut = phrase.lastIndexOf(" ");
  return cut === -1 ? [phrase, ""] : [phrase.slice(0, cut), phrase.slice(cut + 1)];
}

/**
 * Huge two-line headline that flips vertically through `phrases`.
 * Each line has its own mask; the second line follows the first by one
 * stagger step. Pauses while off screen. Reduced motion: a plain crossfade.
 */
export function RotatingHeadline({ phrases }: { phrases: readonly string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const split = phrases.map(toLines);
  const lines = [split.map((p) => p[0]), split.map((p) => p[1])];

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || phrases.length < 2 || !contextSafe) return;
      const m = motion();
      const reduced = prefersReducedMotion();
      const stacks = gsap.utils.toArray<HTMLElement>(".rotator__stack", root);
      const items = stacks.map((stack) => gsap.utils.toArray<HTMLElement>(".rotator__item", stack));

      items.forEach((list) =>
        gsap.set(list.slice(1), reduced ? { autoAlpha: 0 } : { autoAlpha: 1, yPercent: 100, rotationX: -60 }),
      );

      let current = 0;
      let timer: gsap.core.Tween;

      const step = contextSafe(() => {
        const next = (current + 1) % phrases.length;
        items.forEach((list, line) => {
          const delay = line * m.stagger * 2;
          if (reduced) {
            gsap.to(list[current], { autoAlpha: 0, duration: m.duration.overlay, ease: m.ease.out, delay });
            gsap.to(list[next], { autoAlpha: 1, duration: m.duration.overlay, ease: m.ease.out, delay });
            return;
          }
          const flip = { duration: m.duration.reveal, ease: m.ease.inOut, delay };
          gsap.to(list[current], { yPercent: -100, rotationX: 60, ...flip });
          gsap.fromTo(list[next], { yPercent: 100, rotationX: -60 }, { yPercent: 0, rotationX: 0, ...flip });
        });
        current = next;
        timer = gsap.delayedCall(m.rotatorInterval, step);
      });

      timer = gsap.delayedCall(m.rotatorInterval, step);

      // Sticky elements make unreliable triggers; watch the enclosing section.
      ScrollTrigger.create({
        trigger: root.closest("section") ?? root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => timer.paused(!self.isActive),
      });

      return () => timer.kill();
    },
    { scope: ref, dependencies: [phrases] },
  );

  return (
    <>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span ref={ref} className="rotator" aria-hidden="true">
        {lines.map((variants, line) => (
          <span key={line} className="rotator__mask">
            <span className="rotator__stack">
              {variants.map((text, i) => (
                <span key={i} className="rotator__item">
                  {text || " "}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
