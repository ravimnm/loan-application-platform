package com.ezfinanz.loan_platform.entity;

public enum LoanApplicationStatus {
    DRAFT,
    ELIGIBLE,
    PARTIALLY_ELIGIBLE,
    NOT_ELIGIBLE,
    SELFIE_PENDING,
    WAITING_FOR_ADMIN_REVIEW,
    APPROVED,
    REJECTED,
    DISBURSED,
    WITHDRAWN
}