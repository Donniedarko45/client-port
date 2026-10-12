"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/data/portfolio";
import { ArrowUp } from "@/components/ui/Icons";

const noop = () => () => {};

/** The current year, read on the client only so the page can be prerendered. */
function useYear() {
  return useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => null,
  );
}

export function Footer() {
  const year = useYear();

  return (
    <footer className="border-t border-hairline">
      <div className="shell flex flex-col gap-6 py-10 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year ? `${year} ` : ""}
          {site.name.first} {site.name.last} · {site.location}
        </p>
        <div className="flex items-center gap-8">
          <a href={site.contact.linkedin} target="_blank" rel="noreferrer" className="nav__link">
            LinkedIn
          </a>
          <a href={`mailto:${site.contact.email}`} className="nav__link">
            Email
          </a>
          <a href="#home" className="pill" data-variant="outline" data-size="sm">
            <span className="pill__label">Back to top</span>
            <span className="pill__icon">
              <ArrowUp size={12} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
