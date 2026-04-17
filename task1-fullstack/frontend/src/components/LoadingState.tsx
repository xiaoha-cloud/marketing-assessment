type LoadingStateProps = {
  /** Shown while waiting on network. */
  message?: string;
};

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <p className="loading-state" role="status">
      {message}
    </p>
  );
}
