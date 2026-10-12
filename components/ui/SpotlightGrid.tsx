"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Mouse-tracking spotlight. One pointer listener on the grid writes the cursor
 * position into --x / --y on every `[data-spotlight]` card, relative to that
 * card, so the light spills onto the borders of neighbouring cards too.
 * Reads all rects first, then writes, at most once per frame.
 */
export function SpotlightGrid({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let inside = false;
    let pointerX = 0;
    let pointerY = 0;

    const paint = () => {
      frame = 0;
      const cards = grid.querySelectorAll<HTMLElement>("[data-spotlight]");
      const rects = Array.from(cards, (card) => card.getBoundingClientRect());
      cards.forEach((card, i) => {
        card.style.setProperty("--x", `${pointerX - rects[i].left}px`);
        card.style.setProperty("--y", `${pointerY - rects[i].top}px`);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onMove = (event: PointerEvent) => {
      inside = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      schedule();
    };
    const onLeave = () => {
      inside = false;
    };
    // The page glides under a still cursor, so keep the light pinned to it.
    const onScroll = () => {
      if (inside) schedule();
    };

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={["spotlight-grid", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
