import type { ReactNode } from "react";

type PageHeroVariant = "gradient" | "light";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: PageHeroVariant;
  /** Optional modifier for page-specific spacing (e.g. campaign list). */
  className?: string;
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  variant = "gradient",
  className,
  children,
}: PageHeroProps) {
  const rootClass = ["page-hero", `page-hero--${variant}`, className].filter(Boolean).join(" ");
  return (
    <header className={rootClass}>
      <div className="page-hero__inner">
        {eyebrow !== undefined && eyebrow !== "" ? (
          <p className="page-hero__eyebrow">{eyebrow}</p>
        ) : null}
        <h1 className="page-hero__title">{title}</h1>
        {subtitle !== undefined && subtitle !== "" ? (
          <p className="page-hero__subtitle">{subtitle}</p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
