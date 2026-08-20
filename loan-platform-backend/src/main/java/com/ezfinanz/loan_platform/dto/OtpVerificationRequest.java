package com.ezfinanz.loan_platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpVerificationRequest(

        @NotBlank
        String email,

        @NotBlank
        @Pattern(regexp = "^[0-9]{6}$")
        String otp
) {
}