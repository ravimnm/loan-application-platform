package com.ezfinanz.loan_platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record BankAccountRequest(

        @NotBlank
        String accountHolderName,

        @NotBlank
        String accountNumber,

        @NotBlank
        @Pattern(
                regexp = "^[A-Z]{4}0[A-Z0-9]{6}$",
                message = "Invalid IFSC code"
        )
        String ifsc,

        @NotBlank
        String bankName
) {
}