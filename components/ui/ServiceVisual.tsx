import type { CSSProperties, ReactNode } from "react";
import type { ServiceVisual as Kind } from "@/data/portfolio";

/**
 * Small monochrome illustrations, one per service. Each SVG is drawn in its
 * finished state; when an ancestor carries data-live="true" its parts loop
 * through a short build-up (see "Service visuals" in globals.css). With
 * reduced motion they stay finished and still.
 */

/** Delay before a part starts, in seconds. */
const at = (seconds: number, extra?: Record<string, string>) =>
  ({ "--d": `${seconds}s`, ...extra }) as CSSProperties;

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 250" className="sv" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function Layout() {
  return (
    <Frame>
      <rect className="sv-panel" x="20" y="14" width="360" height="222" rx="14" />
      {[38, 50, 62].map((cx) => (
        <circle key={cx} className="sv-dim" cx={cx} cy="30" r="3.5" />
      ))}
      <rect className="sv-dim" x="150" y="24" width="100" height="12" rx="6" />
      <g className="sv-pop" style={at(0)}>
        <rect className="sv-ink" x="38" y="52" width="54" height="8" rx="4" />
        <rect className="sv-dim" x="262" y="52" width="100" height="8" rx="4" />
      </g>
      <rect className="sv-ink sv-pop" style={at(0.15)} x="38" y="76" width="176" height="18" rx="5" />
      <rect className="sv-ink sv-pop" style={at(0.25)} x="38" y="100" width="132" height="18" rx="5" />
      <g className="sv-pop" style={at(0.4)}>
        <rect className="sv-dim" x="38" y="130" width="150" height="7" rx="3.5" />
        <rect className="sv-dim" x="38" y="143" width="118" height="7" rx="3.5" />
      </g>
      <rect className="sv-ink sv-pop" style={at(0.55)} x="38" y="162" width="66" height="20" rx="10" />
      <g className="sv-pop" style={at(0.7)}>
        <rect className="sv-tile" x="236" y="76" width="126" height="106" rx="10" />
        <circle className="sv-dim" cx="334" cy="102" r="10" />
        <path className="sv-dim" d="M246 172 L282 128 L304 152 L320 136 L352 172 Z" />
      </g>
      {[38, 148, 258].map((x, i) => (
        <rect key={x} className="sv-tile sv-pop" style={at(0.9 + i * 0.12)} x={x} y="196" width="104" height="26" rx="7" />
      ))}
    </Frame>
  );
}

function Code() {
  const lines = [
    [0, 118, "sv-ink"],
    [1, 86, "sv-dim"],
    [1, 150, "sv-ink"],
    [2, 104, "sv-dim"],
    [2, 132, "sv-ink"],
    [1, 64, "sv-dim"],
    [0, 34, "sv-ink"],
  ] as const;
  return (
    <Frame>
      <rect className="sv-panel" x="20" y="14" width="360" height="222" rx="14" />
      <line className="sv-line" x1="20" y1="42" x2="380" y2="42" />
      <text className="sv-label" x="36" y="32">
        plugin.php
      </text>
      {lines.map(([indent, width, tone], n) => (
        <g key={n}>
          <text className="sv-label" x="34" y={68 + n * 22}>
            {n + 1}
          </text>
          <rect
            className={`${tone} sv-grow-x`}
            style={at(n * 0.28)}
            x={56 + indent * 18}
            y={60 + n * 22}
            width={width}
            height="9"
            rx="4.5"
          />
        </g>
      ))}
      <rect className="sv-ink sv-blink" x="96" y="191" width="7" height="12" rx="1" />
      <g className="sv-pop" style={at(2.2)}>
        <rect className="sv-outline" x="282" y="54" width="80" height="24" rx="12" />
        <circle className="sv-ink" cx="296" cy="66" r="3" />
        <text className="sv-tag" x="306" y="70">
          200 OK
        </text>
      </g>
    </Frame>
  );
}

function Performance() {
  const metrics = ["LCP", "CLS", "INP"];
  return (
    <Frame>
      <rect className="sv-panel" x="20" y="14" width="360" height="222" rx="14" />
      <circle className="sv-track" cx="124" cy="126" r="62" strokeWidth="10" />
      <circle
        className="sv-stroke sv-draw"
        cx="124"
        cy="126"
        r="62"
        strokeWidth="10"
        strokeLinecap="round"
        pathLength={1}
        transform="rotate(-90 124 126)"
      />
      <text className="sv-score sv-fade" style={at(1.4)} x="124" y="136">
        100
      </text>
      <text className="sv-label" x="124" y="156" textAnchor="middle" letterSpacing="2">
        PERFORMANCE
      </text>
      {metrics.map((name, i) => (
        <g key={name}>
          <text className="sv-label" x="232" y={82 + i * 40}>
            {name}
          </text>
          <text className="sv-tag" x="360" y={82 + i * 40} textAnchor="end">
            GOOD
          </text>
          <rect className="sv-dim" x="232" y={90 + i * 40} width="128" height="6" rx="3" />
          <rect className="sv-ink sv-grow-x" style={at(0.5 + i * 0.25)} x="232" y={90 + i * 40} width={[112, 124, 104][i]} height="6" rx="3" />
        </g>
      ))}
    </Frame>
  );
}

function Pen() {
  return (
    <Frame>
      <text className="sv-label" x="40" y="20">
        Artboard — Desktop
      </text>
      <rect className="sv-dashed" x="40" y="28" width="320" height="194" />
      {[
        [40, 28],
        [360, 28],
        [40, 222],
        [360, 222],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} className="sv-handle" x={x - 3.5} y={y - 3.5} width="7" height="7" />
      ))}
      <g transform="rotate(-10 109 85)">
        <rect className="sv-ink sv-pop" style={at(1.6)} x="86" y="62" width="46" height="46" rx="6" />
      </g>
      <circle className="sv-ring sv-pop" style={at(1.8)} cx="292" cy="170" r="30" />
      <path
        className="sv-stroke sv-draw"
        d="M70 190 C 120 40, 190 40, 214 124 S 300 214, 336 72"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
      />
      <g className="sv-pop" style={at(1.2)}>
        <line className="sv-line" x1="184" y1="92" x2="244" y2="156" />
        <circle className="sv-handle" cx="184" cy="92" r="3.5" />
        <circle className="sv-handle" cx="244" cy="156" r="3.5" />
      </g>
      {[
        [70, 190],
        [214, 124],
        [336, 72],
      ].map(([x, y], i) => (
        <rect key={x} className="sv-ink sv-pop" style={at(1.1 + i * 0.1)} x={x - 4} y={y - 4} width="8" height="8" />
      ))}
    </Frame>
  );
}

function Timeline() {
  const wave = Array.from({ length: 56 }, (_, i) => {
    const x = 30 + i * 6;
    const h = 4 + 16 * Math.abs(Math.sin(x * 0.07) * Math.cos(x * 0.023));
    return { x, h };
  });
  return (
    <Frame>
      <rect className="sv-panel" x="130" y="10" width="140" height="84" rx="8" />
      <path className="sv-ink" d="M192 38 L214 52 L192 66 Z" />
      <line className="sv-line" x1="20" y1="114" x2="380" y2="114" />
      {Array.from({ length: 19 }, (_, i) => (
        <line key={i} className="sv-line" x1={20 + i * 20} y1="114" x2={20 + i * 20} y2={i % 5 === 0 ? 124 : 119} />
      ))}
      {[
        [30, 88],
        [124, 120],
        [250, 110],
      ].map(([x, w]) => (
        <rect key={x} className="sv-clip" x={x} y="132" width={w} height="24" rx="5" />
      ))}
      {[
        [62, 70],
        [178, 140],
      ].map(([x, w]) => (
        <rect key={x} className="sv-tile" x={x} y="164" width={w} height="24" rx="5" />
      ))}
      {wave.map(({ x, h }) => (
        <rect key={x} className="sv-dim" x={x} y={208 - h / 2} width="3" height={h} rx="1.5" />
      ))}
      <g className="sv-playhead">
        <path className="sv-ink" d="M24 100 h12 v6 l-6 6 l-6 -6 z" />
        <line className="sv-stroke" x1="30" y1="106" x2="30" y2="226" strokeWidth="1.5" />
      </g>
    </Frame>
  );
}

function Backup() {
  return (
    <Frame>
      {[70, 110, 150].map((y, i) => (
        <g key={y}>
          <rect className="sv-panel" x="40" y={y} width="112" height="32" rx="8" />
          <circle className="sv-ink sv-led" style={at(i * 0.4)} cx="56" cy={y + 16} r="3" />
          <rect className="sv-dim" x="70" y={y + 13} width="62" height="6" rx="3" />
        </g>
      ))}
      <line className="sv-line" x1="162" y1="126" x2="252" y2="126" strokeDasharray="4 6" />
      {[0, 0.8, 1.6].map((d) => (
        <circle key={d} className="sv-ink sv-packet" style={at(d, { "--dx": "88px", "--dy": "0px" })} cx="162" cy="126" r="4" />
      ))}
      <circle className="sv-orbit sv-spin" cx="306" cy="126" r="52" />
      <circle className="sv-tile" cx="306" cy="126" r="36" />
      <path className="sv-stroke sv-draw" style={at(0.4)} d="M290 126 l10 10 l20 -22" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      <text className="sv-label" x="306" y="204" textAnchor="middle" letterSpacing="2">
        BACKED UP
      </text>
    </Frame>
  );
}

function Network() {
  const nodes = Array.from({ length: 6 }, (_, k) => {
    const angle = ((k * 60 - 90) * Math.PI) / 180;
    return { x: 200 + 128 * Math.cos(angle), y: 125 + 88 * Math.sin(angle) };
  });
  return (
    <Frame>
      {nodes.map((n, k) => {
        const next = nodes[(k + 1) % nodes.length];
        return (
          <g key={k}>
            <line className="sv-line" x1="200" y1="125" x2={n.x} y2={n.y} />
            <line className="sv-line" x1={n.x} y1={n.y} x2={next.x} y2={next.y} strokeDasharray="3 6" />
          </g>
        );
      })}
      {[0, 2, 4].map((k) => (
        <circle
          key={k}
          className="sv-ink sv-packet"
          style={at(k * 0.4, { "--dx": `${nodes[k].x - 200}px`, "--dy": `${nodes[k].y - 125}px` })}
          cx="200"
          cy="125"
          r="3"
        />
      ))}
      <circle className="sv-wave" cx="200" cy="125" r="16" />
      <circle className="sv-wave" style={at(1.2)} cx="200" cy="125" r="16" />
      <circle className="sv-ink" cx="200" cy="125" r="16" />
      <circle className="sv-hole" cx="200" cy="125" r="6" />
      {nodes.map((n, k) => (
        <circle key={k} className="sv-node sv-pulse" style={at(k * 0.4)} cx={n.x} cy={n.y} r="9" />
      ))}
    </Frame>
  );
}

function Growth() {
  const heights = [46, 62, 58, 86, 104, 128, 156];
  const tops = heights.map((h, i) => ({ x: 64 + i * 44, y: 214 - h - 14 }));
  return (
    <Frame>
      {[60, 100, 140, 180].map((y) => (
        <line key={y} className="sv-line" x1="40" y1={y} x2="360" y2={y} strokeDasharray="2 6" />
      ))}
      <line className="sv-line" x1="40" y1="214" x2="360" y2="214" />
      {heights.map((h, i) => (
        <rect
          key={i}
          className={`${i === heights.length - 1 ? "sv-ink" : "sv-dim"} sv-grow-y`}
          style={at(i * 0.12)}
          x={52 + i * 44}
          y={214 - h}
          width="24"
          height={h}
          rx="5"
        />
      ))}
      <polyline
        className="sv-stroke sv-draw"
        style={at(1)}
        points={tops.map((p) => `${p.x},${p.y}`).join(" ")}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
      />
      <circle className="sv-wave" style={at(1.8)} cx={tops[6].x} cy={tops[6].y} r="6" />
      <circle className="sv-ink sv-pop" style={at(1.8)} cx={tops[6].x} cy={tops[6].y} r="6" />
      <g className="sv-pop" style={at(2)}>
        <rect className="sv-outline" x="40" y="24" width="40" height="24" rx="12" />
        <path className="sv-stroke" d="M54 42 l12 -12 M58 30 h8 v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

function Search() {
  const others = [1, 2, 3];
  return (
    <Frame>
      <rect className="sv-panel" x="40" y="18" width="320" height="38" rx="19" />
      <circle className="sv-stroke" cx="62" cy="37" r="7" strokeWidth="2" />
      <line className="sv-stroke" x1="67" y1="42" x2="72" y2="47" strokeWidth="2" strokeLinecap="round" />
      <rect className="sv-ink sv-grow-x" x="84" y="33" width="124" height="8" rx="4" />
      {others.map((n) => (
        <g key={n} className="sv-rank-down">
          <rect className="sv-panel" x="40" y={70 + n * 42} width="320" height="34" rx="10" />
          <circle className="sv-dim" cx="58" cy={87 + n * 42} r="6" />
          <rect className="sv-dim" x="72" y={80 + n * 42} width={[132, 168, 110][n - 1]} height="7" rx="3.5" />
          <rect className="sv-dim" x="72" y={92 + n * 42} width="86" height="5" rx="2.5" />
        </g>
      ))}
      <g className="sv-rank-up">
        <rect className="sv-panel sv-panel--lit" x="40" y="70" width="320" height="34" rx="10" />
        <circle className="sv-ink" cx="58" cy="87" r="6" />
        <rect className="sv-ink" x="72" y="80" width="150" height="7" rx="3.5" />
        <rect className="sv-dim" x="72" y="92" width="96" height="5" rx="2.5" />
        <text className="sv-tag sv-fade" style={at(2.8)} x="346" y="91" textAnchor="end">
          #1
        </text>
      </g>
    </Frame>
  );
}

function Support() {
  return (
    <Frame>
      <circle className="sv-ink" cx="34" cy="26" r="3" />
      <text className="sv-label" x="44" y="29" letterSpacing="2">
        500+ TICKETS RESOLVED
      </text>
      <rect className="sv-panel" x="24" y="40" width="352" height="194" rx="14" />
      <g className="sv-pop" style={at(0)}>
        <rect className="sv-tile" x="42" y="56" width="174" height="42" rx="14" />
        <rect className="sv-dim" x="58" y="69" width="124" height="6" rx="3" />
        <rect className="sv-dim" x="58" y="81" width="82" height="6" rx="3" />
      </g>
      <g className="sv-pop" style={at(0.9)}>
        <rect className="sv-ink" x="182" y="108" width="176" height="42" rx="14" />
        <rect className="sv-hole" x="198" y="121" width="132" height="6" rx="3" />
        <rect className="sv-hole" x="198" y="133" width="92" height="6" rx="3" />
      </g>
      <g className="sv-pop" style={at(1.8)}>
        <rect className="sv-tile" x="42" y="160" width="122" height="30" rx="14" />
        <rect className="sv-dim" x="58" y="172" width="84" height="6" rx="3" />
      </g>
      <g className="sv-pop" style={at(2.3)}>
        <rect className="sv-tile" x="300" y="162" width="58" height="26" rx="13" />
        {[316, 329, 342].map((cx, i) => (
          <circle key={cx} className="sv-ink sv-bounce" style={at(i * 0.15)} cx={cx} cy="175" r="3" />
        ))}
      </g>
      <g className="sv-pop" style={at(3)}>
        <rect className="sv-outline" x="140" y="200" width="120" height="24" rx="12" />
        <path className="sv-stroke" d="M156 212 l4 4 l8 -8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text className="sv-tag" x="176" y="216">
          RESOLVED
        </text>
      </g>
    </Frame>
  );
}

const visuals: Record<Kind, () => ReactNode> = {
  layout: Layout,
  code: Code,
  performance: Performance,
  pen: Pen,
  timeline: Timeline,
  backup: Backup,
  network: Network,
  growth: Growth,
  search: Search,
  support: Support,
};

export function ServiceVisual({ kind }: { kind: Kind }) {
  const Visual = visuals[kind];
  return <Visual />;
}
