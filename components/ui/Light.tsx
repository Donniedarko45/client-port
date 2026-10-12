import type { CSSProperties } from "react";

type GlowProps = {
  /** Position and size, e.g. "left-[-10%] top-[20%] w-[60vw]". */
  className?: string;
  strength?: "soft" | "medium" | "strong";
  style?: CSSProperties;
};

/** A soft white radial spotlight. Purely decorative, never animated per frame. */
export function Glow({ className, strength = "medium", style }: GlowProps) {
  return <span aria-hidden="true" className={["glow", className].filter(Boolean).join(" ")} data-strength={strength} style={style} />;
}

/** A light falling from the top edge of a section. */
export function Beam() {
  return <span aria-hidden="true" className="beam" />;
}
