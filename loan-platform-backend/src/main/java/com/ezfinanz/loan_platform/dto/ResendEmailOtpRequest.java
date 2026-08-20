package com.ezfinanz.loan_platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResendEmailOtpRequest(

        @NotBlank
        @Email
        String email

) {
}