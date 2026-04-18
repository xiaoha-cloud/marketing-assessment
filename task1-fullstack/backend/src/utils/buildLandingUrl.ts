/**
 * Builds absolute landing page URLs for email CTAs.
 */

import { getLandingBaseUrl } from "../config/env.js";

export function buildLandingUrl(slug: string): string {
  const trimmedSlug = slug.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  if (trimmedSlug === "") {
    throw new Error("Campaign slug cannot be empty");
  }
  const base = getLandingBaseUrl();
  return `${base}/landing/${encodeURIComponent(trimmedSlug)}`;
}
