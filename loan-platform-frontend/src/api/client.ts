import axios, {
  type AxiosInstance,
  type AxiosError,
} from 'axios';

import { storage } from '../utils/storage';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8080';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================

client.interceptors.request.use(
  (config) => {

    const token = storage.getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    /*
     * IMPORTANT:
     *
     * Do NOT globally set Content-Type.
     *
     * Axios/browser will automatically set:
     *
     * multipart/form-data; boundary=...
     *
     * when the request body is FormData.
     */

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

client.interceptors.response.use(
  (response) => {
    return response;
  },

  (error: AxiosError) => {

    // 401 Unauthorized
    if (error.response?.status === 401) {

      storage.clear();

      window.dispatchEvent(
        new CustomEvent('unauthorized')
      );
    }

    // 403 Forbidden
    if (error.response?.status === 403) {

      window.dispatchEvent(
        new CustomEvent('forbidden')
      );
    }

    return Promise.reject(error);
  }
);

export default client;