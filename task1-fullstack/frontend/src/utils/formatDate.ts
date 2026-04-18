/**
 * Display formatting for ISO-like date strings from the API.
 */

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateOnlyFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export function formatDateTime(isoLike: string): string {
  const parsed = new Date(isoLike);
  if (Number.isNaN(parsed.getTime())) {
    return isoLike;
  }
  return dateTimeFormatter.format(parsed);
}

/** For values that may be date-only (e.g. event dates from the API). */
export function formatDateOrDateTime(isoLike: string): string {
  const parsed = new Date(isoLike);
  if (Number.isNaN(parsed.getTime())) {
    return isoLike;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoLike.trim())) {
    return dateOnlyFormatter.format(parsed);
  }
  return dateTimeFormatter.format(parsed);
}
