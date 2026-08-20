import type {
  ApplicationStage,
  ApplicationStatus,
} from './application';

export interface Admin {
  id: number;
  email: string;
  phone: string;
  enabled: boolean;
  createdAt?: string;
}

export interface AdminList {
  admins: Admin[];
  total: number;
}

export interface CreateAdminRequest {
  email: string;
  phone: string;
  password: string;
}

export interface BulkCreateAdminRequest {
  admins: CreateAdminRequest[];
}

export interface EnableAdminRequest {
  id: number;
  enabled: boolean;
}

export interface AdminApplication {
  applicationId: number;
  userId: number;
  applicantEmail: string;
  applicantPhone: string;
  applicantName: string | null;
  requestedAmount: number | null;
  tenure: number | null;
  currentStage: ApplicationStage;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
  rejectionReason?: string | null;
}