package com.ezfinanz.loan_platform.dto;

import com.ezfinanz.loan_platform.entity.ApplicationStage;
import com.ezfinanz.loan_platform.entity.KycDocumentType;
import com.ezfinanz.loan_platform.entity.KycVerificationStatus;
import com.ezfinanz.loan_platform.entity.LoanApplicationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminApplicationDetailResponse(

        Long applicationId,

        // =========================================================
        // USER
        // =========================================================

        Long userId,

        String email,

        String phone,

        boolean emailVerified,

        boolean phoneVerified,

        // =========================================================
        // KYC
        // =========================================================

        KycData kyc,

        // =========================================================
        // APPLICATION STATUS
        // =========================================================

        ApplicationStage currentStage,

        LoanApplicationStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        // =========================================================
        // LOAN
        // =========================================================

        Double requestedAmount,

        Integer tenure,

        Double monthlyIncome,

        Double existingDebt,

        Integer cibilScore,

        Double debtToIncomeRatio,

        String employerName,

        String designation,

        // =========================================================
        // LOAN CALCULATION
        // =========================================================

        Double interestRate,

        Double emi,

        Double totalInterest,

        Double totalRepayment,

        Double processingFee,

        Double gst,

        Double totalCharges,

        Double netDisbursement,

        Double irr,

        // =========================================================
        // DECLARATION
        // =========================================================

        boolean declarationAccepted,

        LocalDateTime declarationAcceptedAt,

        // =========================================================
        // SELFIE
        // =========================================================

        String selfiePath,

        LocalDateTime selfieUploadedAt,

        // =========================================================
        // REJECTION
        // =========================================================

        String rejectionReason
) {

    public record KycData(

            String fullName,

            LocalDate dateOfBirth,

            String gender,

            String address,

            KycDocumentType idType,

            String idNumber,

            boolean documentUploaded,

            LocalDateTime documentUploadedAt,

            KycVerificationStatus verificationStatus,

            LocalDateTime verifiedAt,

            String verificationReason
    ) {
    }
}