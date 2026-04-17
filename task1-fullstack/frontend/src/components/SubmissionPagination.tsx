import { buttonSecondary } from "../ui/buttonClasses.js";

type SubmissionPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
};

/**
 * Simple prev/next controls for the submissions table (client-side pages).
 */
export function SubmissionPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPrevious,
  onNext,
}: SubmissionPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink pt-4 text-[0.88rem] text-ink"
      role="navigation"
      aria-label="Submissions pagination"
    >
      <p className="m-0 text-muted">
        Showing <span className="font-semibold text-ink">{start}</span>–
        <span className="font-semibold text-ink">{end}</span> of{" "}
        <span className="font-semibold text-ink">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonSecondary}
          onClick={onPrevious}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="min-w-[8ch] text-center tabular-nums text-muted">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          className={buttonSecondary}
          onClick={onNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
