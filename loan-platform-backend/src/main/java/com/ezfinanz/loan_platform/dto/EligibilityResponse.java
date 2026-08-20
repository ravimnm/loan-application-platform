package com.ezfinanz.loan_platform.dto;

public record EligibilityResponse(

        Long applicationId,

        String status,

        Double debtToIncomeRatio,

        Double interestRate,

        Double eligibleAmount,

        boolean eligible,

        String message

) {
}