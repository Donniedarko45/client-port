"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";
import { motion } from "@/lib/motion";

export type CloudIcon = { label: string; src: string };

type Point = { x: number; y: number; z: number };

/** Evenly spread `count` points over a unit sphere. */
function fibonacciSphere(count: number): Point[] {
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    return { x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
  });
}

const SPRITE = 96; // px per icon bitmap, before device pixel ratio
const IDLE = { x: 0.0012, y: 0.0035 }; // radians per frame with no cursor
const DRAG = 0.005; // radians per pixel dragged
const FRICTION = 0.94; // velocity kept per frame after a fling

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * Interactive 3D cloud of technology icons, after Magic UI's Icon Cloud
 * (magicui.design/docs/components/icon-cloud). Same sphere, cursor steering,
 * drag and click-to-focus — reworked for this site: state lives in refs and
 * one loop on GSAP's ticker (no React renders per frame), the canvas is sized
 * to its container at device resolution, and it stops drawing off screen.
 */
export function IconCloud({ icons, className }: { icons: readonly CloudIcon[]; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Reduced motion starts the cloud paused; the button overrides either way.
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? reduced;
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx || icons.length === 0) return;

    const m = motion();

    const points = fibonacciSphere(icons.length);
    const rotation = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let pointer: { x: number; y: number } | null = null;
    let drag: { x: number; y: number } | null = null;
    let focusing: gsap.core.Tween | null = null;
    let size = 0;
    let dpr = 1;
    let dirty = true;

    // Rasterise each SVG once, at the largest size it is ever drawn.
    const sprites = icons.map((icon) => {
      const bitmap = document.createElement("canvas");
      const entry = { bitmap, ready: false };
      const img = new Image();
      img.src = icon.src;
      img
        .decode()
        .then(() => {
          bitmap.width = bitmap.height = Math.round(SPRITE * dpr);
          bitmap.getContext("2d")?.drawImage(img, 0, 0, bitmap.width, bitmap.height);
          entry.ready = true;
          dirty = true;
        })
        .catch(() => {});
      return entry;
    });

    const resize = () => {
      size = wrap.clientWidth;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = canvas.height = Math.round(size * dpr);
      dirty = true;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    // The original's projection, kept as-is: it is what gives the cloud its feel.
    const project = (p: Point) => {
      const cx = Math.cos(rotation.x);
      const sx = Math.sin(rotation.x);
      const cy = Math.cos(rotation.y);
      const sy = Math.sin(rotation.y);
      const x = p.x * cy - p.z * sy;
      const z = p.x * sy + p.z * cy;
      const y = p.y * cx + z * sx;
      return { x, y, z };
    };

    const layout = () => {
      const radius = size * 0.36;
      const iconSize = size * 0.11;
      return points
        .map((p, i) => {
          const r = project(p);
          return {
            i,
            x: size / 2 + r.x * radius,
            y: size / 2 + r.y * radius,
            z: r.z,
            scale: (r.z + 2) / 3,
            opacity: Math.max(0.15, Math.min(1, (r.z + 1.5) / 2)),
            iconSize,
          };
        })
        .sort((a, b) => a.z - b.z);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      for (const item of layout()) {
        const sprite = sprites[item.i];
        if (!sprite.ready) continue;
        const s = item.iconSize * item.scale;
        ctx.globalAlpha = item.opacity;
        ctx.drawImage(sprite.bitmap, item.x - s / 2, item.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (_time: number, deltaMs: number) => {
      const frames = Math.min(3, deltaMs / (1000 / 60));
      if (!drag && !focusing) {
        if (Math.abs(velocity.x) + Math.abs(velocity.y) > 0.0001) {
          rotation.x += velocity.x * frames;
          rotation.y += velocity.y * frames;
          velocity.x *= FRICTION;
          velocity.y *= FRICTION;
          dirty = true;
        } else if (!pausedRef.current && pointer) {
          // The cursor steers the spin: further from the centre, faster.
          const dx = (pointer.x - size / 2) / size;
          const dy = (pointer.y - size / 2) / size;
          const speed = 0.004 + Math.hypot(dx, dy) * 0.014;
          rotation.x += dy * speed * frames;
          rotation.y += dx * speed * frames;
          dirty = true;
        } else if (!pausedRef.current) {
          rotation.x += IDLE.x * frames;
          rotation.y += IDLE.y * frames;
          dirty = true;
        }
      }
      if (focusing) dirty = true;
      if (dirty) {
        draw();
        dirty = false;
      }
    };

    // Only spend frames while the cloud is on screen.
    let running = false;
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) gsap.ticker.add(tick);
      if (!entry.isIntersecting && running) gsap.ticker.remove(tick);
      running = entry.isIntersecting;
    });
    visibility.observe(wrap);

    const local = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onDown = (event: PointerEvent) => {
      const at = local(event);
      // Front-most icon under the pointer: spin it to face the viewer.
      const hit = layout()
        .reverse()
        .find((item) => Math.hypot(at.x - item.x, at.y - item.y) < (item.iconSize * item.scale) / 2);
      if (hit) {
        const p = points[hit.i];
        const targetX = -Math.atan2(p.y, Math.hypot(p.x, p.z));
        let targetY = Math.atan2(p.x, p.z);
        targetY = rotation.y + Math.atan2(Math.sin(targetY - rotation.y), Math.cos(targetY - rotation.y));
        const distance = Math.hypot(targetX - rotation.x, targetY - rotation.y);
        velocity.x = velocity.y = 0;
        focusing?.kill();
        focusing = gsap.to(rotation, {
          x: targetX,
          y: targetY,
          duration: Math.min(2, Math.max(0.8, distance)),
          ease: m.ease.out,
          onComplete: () => {
            focusing = null;
          },
        });
        return;
      }
      focusing?.kill();
      focusing = null;
      drag = at;
      velocity.x = velocity.y = 0;
      canvas.setPointerCapture(event.pointerId);
    };

    const onMove = (event: PointerEvent) => {
      const at = local(event);
      pointer = at;
      if (!drag) return;
      velocity.x = (at.y - drag.y) * DRAG;
      velocity.y = (at.x - drag.x) * DRAG;
      rotation.x += velocity.x;
      rotation.y += velocity.y;
      drag = at;
      dirty = true;
    };

    const onUp = () => {
      drag = null;
    };
    const onLeave = () => {
      pointer = null;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      visibility.disconnect();
      resizeObserver.disconnect();
      gsap.ticker.remove(tick);
      focusing?.kill();
    };
  }, [icons]);


  return (
    <div ref={wrapRef} className={["icon-cloud", className].filter(Boolean).join(" ")}>
      <canvas
        ref={canvasRef}
        className="icon-cloud__canvas"
        role="img"
        aria-label={`Technologies: ${icons.map((icon) => icon.label).join(", ")}`}
      />
      <button
        type="button"
        onClick={() => setChoice(!paused)}
        className="pill icon-cloud__toggle"
        data-variant="outline"
        data-size="sm"
      >
        <span className="pill__label">
          {paused ? "Play" : "Pause"}
          <span className="sr-only"> icon cloud rotation</span>
        </span>
      </button>
    </div>
  );
}
