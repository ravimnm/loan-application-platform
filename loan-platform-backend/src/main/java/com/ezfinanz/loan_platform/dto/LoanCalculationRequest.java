package com.ezfinanz.loan_platform.dto;

import jakarta.validation.constraints.*;

public record LoanCalculationRequest(

        @NotNull
        @Positive
        Double loanAmount,

        @NotNull
        @Min(6)
        @Max(84)
        Integer tenureMonths
) {
}