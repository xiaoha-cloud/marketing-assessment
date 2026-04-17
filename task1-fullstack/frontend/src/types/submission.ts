/**
 * Submission shapes used by the landing form and dashboard API client.
 */

/** Rows per page on the submissions dashboard (client-side pagination). */
export const SUBMISSIONS_PAGE_SIZE = 10;

export type LandingSubmissionRequest = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

export type SubmissionListItem = {
  id: number;
  campaignId: number;
  campaignName?: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  submittedAt: string;
};
