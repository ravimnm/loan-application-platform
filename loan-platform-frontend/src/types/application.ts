// =========================================================
// KYC
// =========================================================

export type KYCIdType =
  | 'PAN'
  | 'AADHAAR'
  | 'DRIVING_LICENSE'
  | 'PASSPORT'
  | 'VOTER_ID';

export interface KYCData {

  fullName: string;

  dateOfBirth: string;

  gender: string;

  address: string;

  idType: KYCIdType;

  idNumber: string;
}


// =========================================================
// ELIGIBILITY
// =========================================================

export interface EligibilityData {

  monthlyIncome: number;

  requestedAmount: number;

  cibilScore: number;

  existingDebt: number;

  employerName: string;

  designation: string;
}

export interface EligibilityResult {

  applicationId?: number;

  status: string;

  debtToIncomeRatio: number;

  interestRate: number;

  eligibleAmount: number;

  eligible: boolean;

  message: string;

}

// =========================================================
// EMI
// =========================================================

export interface EMICalculationRequest {

  loanAmount: number;

  tenureMonths: number;
}

export interface EMICalculationResult {

  monthlyEmi: number;

  totalInterest: number;

  totalRepayment: number;

  charges?: number;

  netDisbursement?: number;

  interestRate?: number;
}


// =========================================================
// BANK ACCOUNT
// =========================================================

export interface BankAccountData {

  accountHolderName: string;

  accountNumber: string;

  ifsc: string;

  bankName: string;
}


// =========================================================
// DECLARATION
// =========================================================

export interface DeclarationData {

  accepted: boolean;
}


// =========================================================
// APPLICATION STAGE
// =========================================================

export type ApplicationStage =

  | 'KYC'

  | 'ELIGIBILITY'

  | 'EMI_SELECTION'

  | 'BANK_ACCOUNT'

  | 'DECLARATION'

  | 'SELFIE'

  | 'ADMIN_REVIEW'

  | 'DISBURSEMENT'

  | 'COMPLETED';


// =========================================================
// APPLICATION STATUS
// =========================================================

export type ApplicationStatus =

  | 'DRAFT'

  | 'IN_PROGRESS'

  | 'ELIGIBLE'

  | 'PARTIALLY_ELIGIBLE'

  | 'NOT_ELIGIBLE'

  | 'SELFIE_PENDING'

  | 'WAITING_FOR_ADMIN_REVIEW'

  | 'APPROVED'

  | 'REJECTED'

  | 'DISBURSED'

  | 'WITHDRAWN';


// =========================================================
// CUSTOMER APPLICATION
// =========================================================

export interface Application {

  id: number;

  currentStage: ApplicationStage;

  status: ApplicationStatus;

  kyc?: KYCData;

  eligibility?: EligibilityResult;

  emi?: EMICalculationResult;

  bankAccount?: BankAccountData;

  selfieUrl?: string;

  createdAt?: string;

  updatedAt?: string;

  rejectionReason?: string;
}


// =========================================================
// ADMIN KYC DETAIL
// =========================================================

// =========================================================
// ADMIN KYC DETAIL
// =========================================================

export interface AdminKycData {

  fullName: string;

  dateOfBirth: string | null;

  gender: string | null;

  address: string;

  idType: KYCIdType;

  idNumber: string;

  documentUploaded: boolean;

  documentUploadedAt: string | null;

  // KYC verification
  verificationStatus:
    | 'PENDING'
    | 'VERIFIED'
    | 'REJECTED';

  verifiedAt: string | null;

  verificationReason: string | null;
}


// =========================================================
// ADMIN APPLICATION DETAIL
//
// Matches:
// AdminApplicationDetailResponse.java
// =========================================================

export interface AdminApplicationDetail {

  applicationId: number;

  // User

  userId: number;

  email: string;

  phone: string | null;

  emailVerified: boolean;

  phoneVerified: boolean;

  // KYC

  kyc: AdminKycData | null;

  // Application

  currentStage: ApplicationStage;

  status: ApplicationStatus;

  createdAt: string | null;

  updatedAt: string | null;

  // Loan

  requestedAmount: number | null;

  tenure: number | null;

  monthlyIncome: number | null;

  existingDebt: number | null;

  cibilScore: number | null;

  debtToIncomeRatio: number | null;

  employerName: string | null;

  designation: string | null;

  // Calculation

  interestRate: number | null;

  emi: number | null;

  totalInterest: number | null;

  totalRepayment: number | null;

  processingFee: number | null;

  gst: number | null;

  totalCharges: number | null;

  netDisbursement: number | null;

  irr: number | null;

  // Declaration

  declarationAccepted: boolean;

  declarationAcceptedAt: string | null;

  // Selfie

  selfiePath: string | null;

  selfieUploadedAt: string | null;

  // Rejection

  rejectionReason: string | null;
}