export function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <p data-reveal className="section-label type-eyebrow">
      <span className="tabular-nums text-accent">{index}</span>
      <span aria-hidden="true" className="section-label__rule" />
      <span>{children}</span>
    </p>
  );
}
