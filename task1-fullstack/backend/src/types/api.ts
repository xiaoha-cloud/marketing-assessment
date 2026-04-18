/**
 * Shared API response envelopes (JSON over HTTP).
 */

export type ApiSuccessResponse<T> = {
  data: T;
};

export type ApiError = {
  code: string;
  message: string;
};

export type ApiErrorResponse = {
  error: ApiError;
};
