"use client";

import { CustomEase } from "./gsap";

/**
 * Craft motion tokens, read from the CSS custom properties so GSAP and CSS
 * always share one source of truth (craft/tokens.css + app/globals.css).
 */
export type MotionTokens = {
  ease: { out: string; inOut: string; drawer: string };
  /** Seconds. */
  duration: { press: number; menu: number; overlay: number; drawer: number; reveal: number };
  /** Seconds between staggered items. */
  stagger: number;
  /** Pixels a revealed item travels. */
  travel: number;
  /** Seconds between headline phrases. */
  rotatorInterval: number;
};

let tokens: MotionTokens | null = null;

function read(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function seconds(name: string) {
  const value = read(name);
  const n = parseFloat(value);
  return value.endsWith("ms") ? n / 1000 : n;
}

function ease(id: string, name: string) {
  const points = read(name).match(/cubic-bezier\(([^)]+)\)/)?.[1];
  if (!points) throw new Error(`Motion token ${name} is missing or not a cubic-bezier()`);
  CustomEase.create(id, points.replace(/\s+/g, ""));
  return id;
}

export function motion(): MotionTokens {
  tokens ??= {
    ease: {
      out: ease("craft-out", "--ease-out"),
      inOut: ease("craft-in-out", "--ease-in-out"),
      drawer: ease("craft-drawer", "--ease-drawer"),
    },
    duration: {
      press: seconds("--duration-press"),
      menu: seconds("--duration-menu"),
      overlay: seconds("--duration-overlay"),
      drawer: seconds("--duration-drawer"),
      reveal: seconds("--duration-reveal"),
    },
    stagger: seconds("--stagger-step"),
    travel: parseFloat(read("--reveal-travel")),
    rotatorInterval: seconds("--rotator-interval"),
  };
  return tokens;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
