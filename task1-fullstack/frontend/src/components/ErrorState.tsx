type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__message">{message}</p>
      {onRetry !== undefined ? (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
