import type { ReactNode } from "react";

type PageHeroVariant = "gradient" | "light";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: PageHeroVariant;
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  variant = "gradient",
  children,
}: PageHeroProps) {
  return (
    <header className={`page-hero page-hero--${variant}`}>
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
