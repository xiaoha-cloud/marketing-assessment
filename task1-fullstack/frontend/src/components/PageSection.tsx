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
  return (
    <section
      className={`page-section ${className ?? ""}`.trim()}
      aria-labelledby={title !== undefined ? resolvedTitleId : undefined}
    >
      {title !== undefined ? (
        <h2 className="page-section__title" id={resolvedTitleId}>
          {title}
        </h2>
      ) : null}
      <div className="page-section__body">{children}</div>
    </section>
  );
}
