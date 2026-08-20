package com.ezfinanz.loan_platform.dto;

import jakarta.validation.constraints.*;

public record EligibilityRequest(

        @NotNull
        @Positive
        Double monthlyIncome,

        @NotNull
        @Positive
        Double requestedAmount,

        @NotNull
        @Min(300)
        @Max(900)
        Integer cibilScore,

        @NotNull
        @PositiveOrZero
        Double existingDebt,

        @NotBlank
        String employerName,

        @NotBlank
        String designation
) {
}