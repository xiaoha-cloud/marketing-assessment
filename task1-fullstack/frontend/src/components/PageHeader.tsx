import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Use smaller title weight for restrained dashboard pages (e.g. submissions). */
  variant?: "default" | "subdued";
};

export function PageHeader({ title, description, actions, variant = "default" }: PageHeaderProps) {
  const titleClasses =
    variant === "subdued"
      ? "text-[1.55rem] font-bold tracking-[-0.015em]"
      : "text-[1.85rem] font-extrabold tracking-[-0.02em]";

  return (
    <header className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b-2 border-ink pb-5">
      <div>
        <h1 className={`m-0 ${titleClasses}`}>{title}</h1>
        {description !== undefined && description !== "" ? (
          <p className="mt-1.5 max-w-md text-[0.95rem] text-muted">{description}</p>
        ) : null}
      </div>
      {actions !== undefined ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
