/**
 * API response envelopes matching the backend contract.
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
