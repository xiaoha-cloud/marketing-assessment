type LoadingStateProps = {
  /** Shown while waiting on network; defaults to campaign list copy. */
  message?: string;
};

export function LoadingState({
  message = "Loading campaigns…",
}: LoadingStateProps) {
  return <p role="status">{message}</p>;
}
