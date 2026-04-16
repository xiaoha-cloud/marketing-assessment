/**
 * Submission domain, persistence, API input, and export shapes.
 */

export type Submission = {
  id: number;
  campaignId: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  submittedAt: string;
};

export type SubmissionRow = {
  id: number;
  campaign_id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  submitted_at: string;
};

/** Service-layer input when creating a submission (campaign resolved from slug). */
export type CreateSubmissionInput = {
  campaignId: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

/** JSON body for the landing page form (campaign comes from the URL slug). */
export type LandingSubmissionRequest = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

/** Dashboard list row; campaign name is optional until joined in a query. */
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

/** One CSV row; all values as strings for stable export formatting. */
export type SubmissionExportRow = {
  id: string;
  campaignId: string;
  campaignName: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  submittedAt: string;
};
