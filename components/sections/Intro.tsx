"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion, prefersReducedMotion } from "@/lib/motion";
import { About } from "./About";
import { Hero } from "./Hero";

/**
 * Where the portrait's face sits vertically when the 4:5 video is cropped
 * into the square About slot: 30% of the excess comes off the top, 70% off
 * the bottom. Match this when you crop the About photo.
 */
const FOCUS_Y = 0.3;

type Landing = { x: number; y: number; scale: number; clip: string };

/**
 * Where the portrait must move so it sits exactly over the About slot.
 *
 * Measured from layout offsets, not from where things happen to be on screen:
 * once the sticky stage releases, the hero and the About section scroll
 * together, so the distance between the portrait and the slot is constant.
 */
function measureLanding(section: HTMLElement, stage: HTMLElement, anchor: HTMLElement, slot: HTMLElement): Landing {
  const a = anchor.getBoundingClientRect();
  const st = stage.getBoundingClientRect();
  const sec = section.getBoundingClientRect();
  const s = slot.getBoundingClientRect();

  // The anchor's top once the stage has come to rest at the bottom of the hero.
  const anchorTop = sec.bottom - st.height + (a.top - st.top);

  // Cover-fit the portrait into the slot, then crop the overflow away.
  const scale = Math.max(s.width / a.width, s.height / a.height);
  const cropX = a.width - s.width / scale;
  const cropY = a.height - s.height / scale;
  const left = cropX / 2;
  const top = cropY * FOCUS_Y;
  const radius = parseFloat(getComputedStyle(slot).borderTopLeftRadius) / scale;

  return {
    x: s.left - a.left - left * scale,
    y: s.top - anchorTop - top * scale,
    scale,
    clip: `inset(${top}px ${cropX - left}px ${cropY - top}px ${left}px round ${radius}px)`,
  };
}

/**
 * Hero + About, plus the shared-element transition between them: as the hero
 * scrolls away, the portrait shrinks and travels left into the About photo
 * slot, then hands over to the still photo.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const pick = (name: string) => root.querySelector<HTMLElement>(`[data-portrait="${name}"]`);
      const section = pick("section");
      const stage = pick("stage");
      const anchor = pick("anchor");
      const mover = pick("mover");
      const about = pick("about");
      const slot = pick("slot");
      const photo = pick("photo");
      const badge = pick("badge");
      if (!section || !stage || !anchor || !mover || !about || !slot || !photo || !badge) return;

      const m = motion();
      const reduced = prefersReducedMotion();
      const frame = mover.firstElementChild as HTMLElement;
      const startRadius = parseFloat(getComputedStyle(frame).borderTopLeftRadius);

      // The hero copy dims as the stage releases. On phones the portrait
      // slides down through it, so it has to be gone sooner.
      gsap.to(root.querySelectorAll("[data-hero-text]"), {
        opacity: 0,
        y: reduced ? 0 : -m.travel * 4,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: () => (window.innerWidth < 900 ? "bottom 82%" : "bottom 45%"),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: about,
          start: "top bottom",
          // Land by the time About reaches the top, which is where the nav
          // link takes you — on short screens the slot's centre never gets
          // high enough to finish a centre-based landing.
          end: "top 12%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      if (reduced) {
        // No travel: the portrait fades out where it is and the photo fades in.
        tl.to(mover, { autoAlpha: 0, ease: "none", duration: 0.5 }, 0)
          .to(photo, { opacity: 1, ease: "none", duration: 0.5 }, 0.5)
          .to(badge, { opacity: 1, ease: "none", duration: 0.2 }, 0.8);
        return;
      }

      let landing: Landing | null = null;
      const land = () => (landing ??= measureLanding(section, stage, anchor, slot));
      const forget = () => {
        landing = null;
      };
      ScrollTrigger.addEventListener("refreshInit", forget);

      tl.fromTo(
        mover,
        { x: 0, y: 0, scale: 1, clipPath: `inset(0px 0px 0px 0px round ${startRadius}px)` },
        {
          x: () => land().x,
          y: () => land().y,
          scale: () => land().scale,
          clipPath: () => land().clip,
          ease: m.ease.inOut,
          duration: 1,
        },
        0,
      )
        // Hand-off: the photo is fully in before the moving portrait leaves.
        .to(photo, { opacity: 1, ease: "none", duration: 0.08 }, 0.92)
        .to(mover, { autoAlpha: 0, ease: "none", duration: 0.06 }, 1)
        .fromTo(badge, { opacity: 0, y: m.travel }, { opacity: 1, y: 0, ease: "none", duration: 0.08 }, 1);

      return () => ScrollTrigger.removeEventListener("refreshInit", forget);
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Hero />
      <About />
    </div>
  );
}
