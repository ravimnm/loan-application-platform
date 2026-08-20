package com.ezfinanz.loan_platform.dto;

import com.ezfinanz.loan_platform.entity.ApplicationStage;
import com.ezfinanz.loan_platform.entity.LoanApplicationStatus;

import java.time.LocalDateTime;

public record AdminApplicationResponse(

        Long applicationId,

        Long userId,

        String applicantEmail,

        String applicantPhone,

        String applicantName,

        Double requestedAmount,

        Integer tenure,

        ApplicationStage currentStage,

        LoanApplicationStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        String rejectionReason
) {
}