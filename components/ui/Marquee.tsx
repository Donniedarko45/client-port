function Track({ items, hidden }: { items: readonly string[]; hidden?: boolean }) {
  return (
    <ul className="marquee__track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="marquee__item">
          {item}
          <span className="marquee__sep" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

/**
 * An endless band of phrases. Pure CSS (runs on the compositor); two copies
 * of the track slide one width left and loop. Pauses on hover; with reduced
 * motion it stops and wraps instead.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  return (
    <div className="marquee">
      <Track items={items} />
      <Track items={items} hidden />
    </div>
  );
}
