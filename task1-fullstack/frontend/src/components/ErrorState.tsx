import { buttonSecondary } from "../ui/buttonClasses.js";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mb-5 border-2 border-ink bg-surface p-5" role="alert">
      <p className="m-0 mb-3 text-ink">{message}</p>
      {onRetry !== undefined ? (
        <button type="button" className={buttonSecondary} onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
