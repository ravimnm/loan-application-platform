import client from './client';
import type { Admin, CreateAdminRequest, BulkCreateAdminRequest } from '../types/admin';

export const superAdminApi = {
  // Get all admins
  listAdmins: async (): Promise<Admin[]> => {
    const response = await client.get<Admin[]>('/api/super-admin/admins');
    return response.data;
  },

  // Create a single admin
  createAdmin: async (data: CreateAdminRequest): Promise<Admin> => {
    const response = await client.post<Admin>('/api/super-admin/admins', data);
    return response.data;
  },

  // Bulk create admins
  bulkCreateAdmins: async (data: BulkCreateAdminRequest): Promise<Admin[]> => {
    const response = await client.post<Admin[]>('/api/super-admin/admins/bulk', data);
    return response.data;
  },

  // Enable admin
  enableAdmin: async (adminId: number): Promise<Admin> => {
    const response = await client.patch<Admin>(
      `/api/super-admin/admins/${adminId}/enable`,
      { id: adminId, enabled: true }
    );
    return response.data;
  },

  // Disable admin
  disableAdmin: async (adminId: number): Promise<Admin> => {
    const response = await client.patch<Admin>(
      `/api/super-admin/admins/${adminId}/disable`
    );
    return response.data;
  },
};
