import type { ReactNode } from "react";

type PageHeroVariant = "gradient" | "light";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: PageHeroVariant;
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
  const variantClasses =
    variant === "gradient"
      ? "bg-hero text-white"
      : "bg-surface text-ink";

  const rootClass = [
    "mb-9 border-2 border-ink",
    variantClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={rootClass}>
      <div className="px-6 py-9">
        {eyebrow !== undefined && eyebrow !== "" ? (
          <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] opacity-90">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mb-3.5 text-[clamp(2rem,6vw,3.1rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
          {title}
        </h1>
        {subtitle !== undefined && subtitle !== "" ? (
          <p className="max-w-xl text-[1.05rem] leading-relaxed opacity-95">{subtitle}</p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
