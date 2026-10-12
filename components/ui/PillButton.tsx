import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Common = {
  variant?: "outline" | "solid";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children: ReactNode;
};

type LinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; loading?: boolean };

/** Rounded pill used for every call to action. Links render <a>, the rest <button>. */
export function PillButton(props: LinkProps | ButtonProps) {
  if (props.href !== undefined) {
    const { variant = "outline", size = "md", icon, children, className, ...rest } = props;
    return (
      <a {...rest} className={["pill", className].filter(Boolean).join(" ")} data-variant={variant} data-size={size}>
        <span className="pill__label">{children}</span>
        {icon && <span className="pill__icon">{icon}</span>}
      </a>
    );
  }

  const { variant = "outline", size = "md", icon, children, className, loading, type = "button", ...rest } = props;
  return (
    <button
      {...rest}
      type={type}
      className={["pill", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
    >
      <span className="pill__label">{children}</span>
      {icon && <span className="pill__icon">{icon}</span>}
    </button>
  );
}
