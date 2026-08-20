import client from './client';

import type {
  AdminApplicationDetail,
  Application,
} from '../types/application';

import type { AdminApplication } from '../types/admin';

export const adminApi = {

  // =========================================================
  // GET ALL CUSTOMER APPLICATIONS
  // =========================================================

  getApplications: async (): Promise<AdminApplication[]> => {

    const response =
      await client.get<AdminApplication[]>(
        '/api/admin/applications'
      );

    return response.data;
  },

  // =========================================================
  // GET ONE FULL APPLICATION
  //
  // Backend:
  // AdminApplicationDetailResponse
  // =========================================================

  getApplicationDetails: async (
    applicationId: number
  ): Promise<AdminApplicationDetail> => {

    const response =
      await client.get<AdminApplicationDetail>(
        `/api/admin/applications/${applicationId}`
      );

    return response.data;
  },

  // =========================================================
  // APPROVE
  // =========================================================

  approveApplication: async (
    applicationId: number
  ): Promise<Application> => {

    const response =
      await client.post<Application>(
        `/api/admin/applications/${applicationId}/approve`
      );

    return response.data;
  },

  // =========================================================
  // REJECT
  // =========================================================

  rejectApplication: async (
    applicationId: number,
    reason: string
  ): Promise<Application> => {

    const response =
      await client.post<Application>(
        `/api/admin/applications/${applicationId}/reject`,
        {},
        {
          params: {
            reason,
          },
        }
      );

    return response.data;
  },

  // =========================================================
  // DISBURSE
  // =========================================================

  disburseApplication: async (
    applicationId: number
  ): Promise<Application> => {

    const response =
      await client.post<Application>(
        `/api/admin/applications/${applicationId}/disburse`
      );

    return response.data;
  },

  // =========================================================
  // GET KYC DOCUMENT
  // =========================================================

  getKycDocument: async (
    applicationId: number
  ): Promise<string> => {

    const response =
      await client.get<Blob>(
        `/api/admin/applications/${applicationId}/kyc-document`,
        {
          responseType: 'blob',
        }
      );

    return URL.createObjectURL(
      response.data
    );
  },

  // =========================================================
  // GET SELFIE
  // =========================================================

  getSelfie: async (
    applicationId: number
  ): Promise<string> => {

    const response =
      await client.get<Blob>(
        `/api/admin/applications/${applicationId}/selfie`,
        {
          responseType: 'blob',
        }
      );

    return URL.createObjectURL(
      response.data
    );
  },
  // =========================================================
  // VERIFY KYC
  // =========================================================

  verifyKyc: async (
    applicationId: number
  ): Promise<AdminApplicationDetail> => {

    const response =
      await client.post<AdminApplicationDetail>(
        `/api/admin/applications/${applicationId}/kyc/verify`
      );

    return response.data;
  },

  // =========================================================
  // REJECT KYC
  // =========================================================

  rejectKyc: async (
    applicationId: number,
    reason: string
  ): Promise<AdminApplicationDetail> => {

    const response =
      await client.post<AdminApplicationDetail>(
        `/api/admin/applications/${applicationId}/kyc/reject`,
        {},
        {
          params: {
            reason,
          },
        }
      );

    return response.data;
  },
};