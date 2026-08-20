import { isAxiosError } from 'axios';

export const getAuthErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError(error)) return fallback;

  switch (error.response?.status) {
    case 400:
      return 'Please check the information and try again.';
    case 401:
      return 'The email or password is incorrect.';
    case 403:
      return 'This account is not allowed to continue.';
    case 404:
      return 'We could not find that account.';
    default:
      return error.response && error.response.status >= 500
        ? 'The service is temporarily unavailable. Please try again later.'
        : fallback;
  }
};
