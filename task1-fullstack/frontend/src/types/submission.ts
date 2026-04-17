/**
 * Submission shapes used by the landing form and dashboard API client.
 */

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
