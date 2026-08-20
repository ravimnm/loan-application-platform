import client from './client';

import type {
  Application,
  KYCData,
  EligibilityData,
  EligibilityResult,
  EMICalculationRequest,
  EMICalculationResult,
  BankAccountData,
  DeclarationData,
} from '../types/application';

const getCurrentApplication = async (): Promise<Application> => {
  const response = await client.get<Application>(
    '/api/applications/current'
  );

  return response.data;
};

export const applicationApi = {

  // =========================================================
  // CREATE APPLICATION
  // =========================================================

  createApplication: async (): Promise<{ id: number }> => {
    const response = await client.post<{ id: number }>(
      '/api/applications'
    );

    return response.data;
  },

  // =========================================================
  // CURRENT APPLICATION
  // =========================================================

  getCurrentApplication,

  // =========================================================
  // ALL APPLICATIONS
  // =========================================================

  getApplications: async (): Promise<Application[]> => {
    const response = await client.get<Application[]>(
      '/api/applications'
    );

    return response.data;
  },

  // =========================================================
  // SINGLE APPLICATION
  // =========================================================

  getApplication: async (
    applicationId: number
  ): Promise<Application> => {
    const response = await client.get<Application>(
      `/api/applications/${applicationId}`
    );

    return response.data;
  },

  // =========================================================
  // WITHDRAW APPLICATION
  // =========================================================

  withdrawApplication: async (
    applicationId: number
  ): Promise<Application> => {
    const response = await client.post<Application>(
      `/api/applications/${applicationId}/withdraw`
    );

    return response.data;
  },

  // =========================================================
  // KYC SUBMISSION
  // =========================================================

  submitKYC: async (
    applicationId: number,
    data: KYCData,
    document: File
  ): Promise<void> => {

    const formData = new FormData();

    formData.append(
      'kyc',
      new Blob(
        [JSON.stringify(data)],
        {
          type: 'application/json',
        }
      )
    );

    formData.append(
      'document',
      document
    );

    await client.post(
      `/api/applications/${applicationId}/kyc`,
      formData
    );
  },

  // =========================================================
  // ELIGIBILITY
  // =========================================================

  checkEligibility: async (
    applicationId: number,
    data: EligibilityData
  ): Promise<EligibilityResult> => {

    const response = await client.post<EligibilityResult>(
      `/api/applications/${applicationId}/eligibility`,
      data
    );

    return response.data;
  },

  // =========================================================
  // EMI CALCULATION
  // =========================================================

  calculateEMI: async (
    applicationId: number,
    data: EMICalculationRequest
  ): Promise<EMICalculationResult> => {

    const response = await client.post<EMICalculationResult>(
      `/api/applications/${applicationId}/calculate`,
      data
    );

    return response.data;
  },

  // =========================================================
  // BANK ACCOUNT
  // =========================================================

  submitBankAccount: async (
    applicationId: number,
    data: BankAccountData
  ): Promise<Application> => {

    const response = await client.post<Application>(
      `/api/applications/${applicationId}/bank-account`,
      data
    );

    return response.data;
  },

  // =========================================================
  // DECLARATION
  // =========================================================

  submitDeclaration: async (
    applicationId: number,
    data: DeclarationData
  ): Promise<Application> => {

    const response = await client.post<Application>(
      `/api/applications/${applicationId}/declaration`,
      data
    );

    return response.data;
  },

  // =========================================================
  // SELFIE
  // =========================================================

  uploadSelfie: async (
    applicationId: number,
    file: File
  ): Promise<Application> => {

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    const response = await client.post<Application>(
      `/api/applications/${applicationId}/selfie`,
      formData
    );

    return response.data;
  },
};