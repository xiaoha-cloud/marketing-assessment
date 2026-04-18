type LoadingStateProps = {
  /** Shown while waiting on network. */
  message?: string;
};

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <p className="mb-4 text-[0.95rem] text-muted" role="status">
      {message}
    </p>
  );
}
