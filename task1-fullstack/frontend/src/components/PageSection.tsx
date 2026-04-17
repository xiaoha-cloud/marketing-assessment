import { useId, type ReactNode } from "react";

type PageSectionProps = {
  title?: string;
  titleId?: string;
  children: ReactNode;
  className?: string;
};

export function PageSection({ title, titleId, children, className }: PageSectionProps) {
  const generatedTitleId = useId();
  const resolvedTitleId = title !== undefined ? (titleId ?? generatedTitleId) : undefined;
  const sectionClass = ["mt-8", className].filter(Boolean).join(" ");

  return (
    <section className={sectionClass} aria-labelledby={title !== undefined ? resolvedTitleId : undefined}>
      {title !== undefined ? (
        <h2
          className="mb-3 text-[0.82rem] font-bold uppercase tracking-widest text-ink"
          id={resolvedTitleId}
        >
          {title}
        </h2>
      ) : null}
      <div>{children}</div>
    </section>
  );
}
