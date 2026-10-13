"use client";

import { useRef, type CSSProperties } from "react";
import { site } from "@/data/portfolio";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion, prefersReducedMotion } from "@/lib/motion";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Glow } from "@/components/ui/Light";
import { PillButton } from "@/components/ui/PillButton";
import { RotatingHeadline } from "@/components/ui/RotatingHeadline";

const { hero } = site;

function timecode(seconds: number) {
  const s = Math.max(0, seconds);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = (s % 60).toFixed(2).padStart(5, "0");
  return `${mm}:${ss}`;
}

/**
 * The hero is a tall scroll track with a sticky stage inside it. While the
 * stage is stuck, scroll progress scrubs the portrait video's currentTime.
 * The `data-portrait` hooks are picked up by <Intro>, which flies the
 * portrait into the About section once the stage releases.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  // Intro: the portrait wipes up, the headline rises, the rest settles in.
  useGSAP(
    () => {
      const m = motion();
      const reduced = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: m.ease.out, duration: m.duration.reveal } });

      if (reduced) {
        tl.to("[data-hero-portrait], [data-hero-in]", { opacity: 1, stagger: m.stagger });
        tl.set(".rotator__stack", { clearProps: "transform" }, 0);
        return;
      }

      // End on an explicit `none`: clearing the inline style would hand the
      // frame back to its CSS start state, which is fully clipped.
      tl.to("[data-hero-portrait]", { clipPath: "inset(0% 0% 0% 0%)", duration: m.duration.reveal * 1.6, ease: m.ease.drawer })
        .set("[data-hero-portrait]", { clipPath: "none" })
        .from("[data-hero-portrait]", { scale: 1.12, duration: m.duration.reveal * 2, clearProps: "scale" }, 0)
        .to(".rotator__stack", { yPercent: 0, y: 0, stagger: m.stagger * 2 }, m.duration.reveal * 0.4)
        .to("[data-hero-in]", { opacity: 1, y: 0, stagger: m.stagger }, m.duration.reveal * 0.6);
    },
    { scope: sectionRef },
  );

  // Scrub: scroll progress through the sticky stage → video.currentTime.
  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      const fill = fillRef.current;
      const time = timeRef.current;
      if (!section || !video || !fill || !time) return;

      let duration = 0;
      let progress = 0;
      let target = 0;

      // One seek in flight at a time; when it lands, chase the latest target.
      // Queuing a seek per scroll event would make the decoder fall behind.
      const seek = () => {
        if (!duration || video.seeking || Math.abs(video.currentTime - target) < 0.001) return;
        video.currentTime = target;
      };
      const render = () => {
        fill.style.transform = `scaleX(${progress})`;
        time.textContent = `${timecode(target)} / ${timecode(duration)}`;
      };
      const sync = () => {
        duration = Number.isFinite(video.duration) ? video.duration : 0;
        target = progress * Math.max(0, duration - 0.05);
        seek();
        render();
      };

      video.pause();
      video.addEventListener("loadedmetadata", sync);
      video.addEventListener("seeked", seek);
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) sync();

      // iOS will not decode frames for seeking until the video has "played".
      const unlock = () => {
        video
          .play()
          .then(() => {
            video.pause();
            sync();
          })
          .catch(() => {});
      };
      window.addEventListener("touchstart", unlock, { once: true, passive: true });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate(self) {
          progress = self.progress;
          sync();
        },
      });

      return () => {
        video.removeEventListener("loadedmetadata", sync);
        video.removeEventListener("seeked", seek);
        window.removeEventListener("touchstart", unlock);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      data-portrait="section"
      aria-label="Introduction"
      className="hero"
      style={{ "--scrub-screens": hero.video.scrubScreens } as CSSProperties}
    >
      <div data-portrait="stage" className="hero__stage">
        <div className="hero__lights">
          <Glow strength="strong" className="left-1/2 top-[40%] w-[min(1100px,140vw)] -translate-x-1/2 -translate-y-1/2" />
          <Glow strength="soft" className="-left-[20%] -top-[30%] w-[70vw]" />
          <span className="beam" aria-hidden="true" />
        </div>

        <div className="hero__grid">
          <div className="hero__intro" data-hero-text>
            <h1>
              <span data-hero-in className="type-eyebrow block text-ink-muted">
                {hero.greeting}
              </span>
              <RotatingHeadline phrases={hero.rotatingRoles} />
            </h1>
          </div>

          <div className="hero__portrait">
            <figure data-portrait="anchor" className="portrait-anchor" aria-label={hero.video.label}>
              <div data-portrait="mover" className="portrait-mover">
                <div data-hero-portrait className="portrait-frame">
                  <video
                    ref={videoRef}
                    className="portrait-video"
                    poster={hero.video.poster}
                    muted
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    disableRemotePlayback
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    {hero.video.sources.map((source) => (
                      <source key={source.src} src={source.src} type={source.type} />
                    ))}
                  </video>
                </div>
              </div>
            </figure>
          </div>

          <div className="hero__aside" data-hero-text>
            <p data-hero-in className="status-badge type-eyebrow mb-6 hidden min-[900px]:inline-flex">
              <span className="status-badge__dot" aria-hidden="true" />
              {site.about.status.label}
            </p>
            <p data-hero-in className="type-body">
              {hero.tagline.map((line, i) => (
                <span key={line} className={i === 0 ? "block text-ink" : "block"}>
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="hero__footer" data-hero-text>
            <div data-hero-in className="scrub type-eyebrow">
              <span className="hidden sm:inline">{hero.scrollHint}</span>
              <span className="sm:hidden">{hero.scrollHintShort}</span>
              <span className="scrub__track hidden sm:block" aria-hidden="true">
                <span ref={fillRef} className="scrub__fill" />
              </span>
              <span ref={timeRef} className="scrub__time hidden sm:inline" aria-hidden="true">
                00:00.00 / 00:00.00
              </span>
            </div>
            <span data-hero-in className="block">
              <PillButton href={hero.cta.href} variant="solid" icon={<ArrowUpRight />}>
                {hero.cta.label}
              </PillButton>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
