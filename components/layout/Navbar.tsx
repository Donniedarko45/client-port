"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/data/portfolio";
import { ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { ArrowUpRight } from "@/components/ui/Icons";
import { PillButton } from "@/components/ui/PillButton";

/** A stretch of the 0 → 1 range. */
type Span = { start: number; end: number };
/** `spans`: where each section sits in the page's scroll range. `layout`: where its clip is drawn. */
type Timeline = { spans: Span[]; layout: Span[] };

const sections = site.nav;
const pad = (n: number) => String(n).padStart(2, "0");
const total = pad(sections.length);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

/** Narrow sections still get a clip wide enough to read and hit. */
const MIN_CLIP = 0.06;

const evenly: Timeline = (() => {
  const spans = sections.map((_, i) => ({ start: i / sections.length, end: (i + 1) / sections.length }));
  return { spans, layout: spans };
})();

function measureTimeline(): Timeline {
  const max = maxScroll();
  const starts = sections.map(({ href }) => {
    const el = document.querySelector<HTMLElement>(href);
    return el ? clamp01((el.getBoundingClientRect().top + window.scrollY) / max) : 0;
  });
  const spans = starts.map((start, i) => ({ start, end: i < starts.length - 1 ? starts[i + 1] : 1 }));
  // Clip widths follow section lengths, with a floor, renormalised to fill the track.
  const widths = spans.map((s) => Math.max(MIN_CLIP, s.end - s.start));
  const sum = widths.reduce((a, b) => a + b, 0);
  let cursor = 0;
  const layout = widths.map((w) => {
    const span = { start: cursor, end: cursor + w / sum };
    cursor = span.end;
    return span;
  });
  return { spans, layout };
}

/** Scroll progress → position on the drawn track (piecewise, clip by clip). */
function toTrack(progress: number, t: Timeline) {
  const i = Math.max(0, t.spans.findIndex((s) => progress < s.end || s === t.spans[t.spans.length - 1]));
  const s = t.spans[i];
  const d = t.layout[i];
  const within = s.end > s.start ? clamp01((progress - s.start) / (s.end - s.start)) : 0;
  return d.start + within * (d.end - d.start);
}

/** Position on the drawn track → scroll progress, and which section it falls in. */
function fromTrack(x: number, t: Timeline) {
  const i = Math.max(0, t.layout.findIndex((d) => x < d.end || d === t.layout[t.layout.length - 1]));
  const s = t.spans[i];
  const d = t.layout[i];
  const within = d.end > d.start ? clamp01((x - d.start) / (d.end - d.start)) : 0;
  return { index: i, progress: s.start + within * (s.end - s.start) };
}

/**
 * The navbar is the page's timeline. Each section is a clip sized by its
 * length; a lime playhead tracks scroll. Click a clip to jump to it, drag
 * anywhere on the track to scrub the whole page (hero video included), and
 * hover for a seek preview. Phones get the same timeline as a thin strip.
 */
export function Navbar() {
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeline, setTimeline] = useState<Timeline>(evenly);
  const timelineRef = useRef(timeline);
  const progressRef = useRef(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const miniRef = useRef<HTMLDivElement>(null);
  const miniPlayedRef = useRef<HTMLSpanElement>(null);
  const miniHeadRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { lock, scrollTo } = useSmoothScroll();

  // Move the playheads. Called every scroll frame: DOM writes only, no React.
  const paintRef = useRef((progress: number) => {
    progressRef.current = progress;
    const x = toTrack(progress, timelineRef.current);
    for (const head of [headRef.current, miniHeadRef.current]) if (head) head.style.transform = `translateX(${x * 100}%)`;
    for (const bar of [playedRef.current, miniPlayedRef.current]) if (bar) bar.style.transform = `scaleX(${x})`;
  });

  useEffect(() => {
    timelineRef.current = timeline;
    paintRef.current(progressRef.current);
  }, [timeline]);

  // Measure the sections whenever ScrollTrigger re-measures the page.
  useEffect(() => {
    const measure = () => setTimeline(measureTimeline());
    const frame = requestAnimationFrame(measure);
    ScrollTrigger.addEventListener("refresh", measure);
    return () => {
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener("refresh", measure);
    };
  }, []);

  // Scroll progress, the active section, and whether we've left the top.
  useEffect(() => {
    const paint = paintRef.current;
    const triggers = sections.flatMap(({ href }, i) => {
      const section = document.querySelector(href);
      if (!section) return [];
      return ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(i),
      });
    });
    triggers.push(
      ScrollTrigger.create({ start: 24, end: "max", onToggle: (self) => setScrolled(self.isActive) }),
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => paint(self.progress) }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Scrubbing: drag along a track to move the page; a plain click on the
  // desktop track is left to the clip links, a tap on the strip jumps there.
  useEffect(() => {
    const jump = (progress: number, immediate: boolean) => scrollTo(progress * maxScroll(), { immediate });

    const attach = (el: HTMLElement, { tapJumps, preview }: { tapJumps: boolean; preview?: (clientX: number | null) => void }) => {
      let downX: number | null = null;
      let dragging = false;
      let swallowClick = false;
      const at = (clientX: number) => {
        const r = el.getBoundingClientRect();
        return fromTrack(clamp01((clientX - r.left) / r.width), timelineRef.current);
      };
      const end = () => {
        downX = null;
        dragging = false;
        delete el.dataset.scrubbing;
      };
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        downX = e.clientX;
        dragging = false;
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "mouse") preview?.(e.clientX);
        if (downX === null) return;
        if (!dragging && Math.abs(e.clientX - downX) > 4) {
          dragging = true;
          el.setPointerCapture(e.pointerId);
          el.dataset.scrubbing = "true";
        }
        if (dragging) jump(at(e.clientX).progress, true);
      };
      const onUp = (e: PointerEvent) => {
        if (dragging) swallowClick = true;
        else if (downX !== null && tapJumps) jump(at(e.clientX).progress, false);
        end();
      };
      // A drag that ends over a clip must not also follow the link.
      const onClick = (e: MouseEvent) => {
        if (!swallowClick) return;
        swallowClick = false;
        e.preventDefault();
        e.stopPropagation();
      };
      const onLeave = () => preview?.(null);

      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", end);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("click", onClick, true);
      return () => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", end);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("click", onClick, true);
      };
    };

    const track = trackRef.current;
    const ghost = ghostRef.current;
    const tip = tipRef.current;
    const mini = miniRef.current;
    const cleanups: (() => void)[] = [];

    if (track && ghost && tip) {
      cleanups.push(
        attach(track, {
          tapJumps: false,
          preview: (clientX) => {
            if (clientX === null) {
              track.dataset.hover = "false";
              return;
            }
            const r = track.getBoundingClientRect();
            const x = clamp01((clientX - r.left) / r.width);
            const { index, progress } = fromTrack(x, timelineRef.current);
            ghost.style.transform = `translateX(${x * 100}%)`;
            tip.textContent = `${sections[index].label} · ${Math.round(progress * 100)}%`;
            track.dataset.hover = "true";
          },
        }),
      );
    }
    if (mini) cleanups.push(attach(mini, { tapJumps: true }));
    return () => cleanups.forEach((fn) => fn());
  }, [scrollTo]);

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

  const clipStyle = (span: Span): CSSProperties => ({
    left: `calc(${span.start * 100}% + 2px)`,
    width: `calc(${(span.end - span.start) * 100}% - 4px)`,
  });

  return (
    <>
      <header className="nav" data-scrolled={scrolled || open}>
        <div className="shell flex h-full items-center gap-6 lg:gap-8">
          <a href="#home" className="nav__brand shrink-0 text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
            {site.name.first}
            <span className="hidden text-ink-subtle sm:inline"> {site.name.last}</span>
          </a>

          <nav aria-label="Primary" className="hidden min-w-0 flex-1 lg:block">
            <div ref={trackRef} className="tl" data-hover="false">
              <span aria-hidden="true" className="tl__ruler" />
              <span ref={playedRef} aria-hidden="true" className="tl__played" />
              <ul className="tl__clips">
                {sections.map((item, i) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={i === 0 ? "tl__clip tl__clip--film" : "tl__clip"}
                      style={clipStyle(timeline.layout[i])}
                      aria-current={active === i || undefined}
                      draggable={false}
                    >
                      <span aria-hidden="true" className="tl__idx">
                        {pad(i + 1)}
                      </span>
                      <span className="tl__name">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <span ref={headRef} aria-hidden="true" className="tl__head" />
              <span ref={ghostRef} aria-hidden="true" className="tl__ghost">
                <span ref={tipRef} className="tl__tip" />
              </span>
            </div>
          </nav>

          <p aria-hidden="true" className="tl-readout ml-auto hidden sm:flex lg:ml-0">
            <span className="tl-readout__count">
              {pad(active + 1)}
              <span className="text-ink-subtle"> / {total}</span>
            </span>
            <span className="tl-readout__name">{sections[active].label}</span>
          </p>

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:ml-0">
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

        {/* Phones and tablets: the same timeline, as a strip along the bar's edge. */}
        <div ref={miniRef} aria-hidden="true" className="tl-mini lg:hidden">
          <span className="tl-mini__track">
            {timeline.layout.map((span, i) => (
              <span key={sections[i].href} className="tl-mini__seg" data-active={active === i} style={clipStyle(span)} />
            ))}
          </span>
          <span ref={miniPlayedRef} className="tl-mini__played" />
          <span ref={miniHeadRef} className="tl-mini__head" />
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
            {sections.map((item, i) => (
              <li key={item.href} className="menu__item" style={{ "--i": i } as CSSProperties}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === i || undefined}
                  className="flex items-baseline gap-4 py-1 text-[clamp(36px,10vw,64px)] font-extrabold uppercase leading-[1.05] tracking-[-0.04em] text-ink-muted aria-[current=true]:text-ink"
                >
                  <span className="type-eyebrow tabular-nums text-ink-subtle">{pad(i + 1)}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={`mailto:${site.contact.email}`}
          className="menu__item text-sm text-ink-muted"
          style={{ "--i": sections.length } as CSSProperties}
        >
          {site.contact.email}
        </a>
      </div>
    </>
  );
}
