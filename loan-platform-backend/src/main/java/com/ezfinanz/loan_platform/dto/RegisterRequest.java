package com.ezfinanz.loan_platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Pattern(regexp = "^[0-9]{10}$")
        String phone,

        @NotBlank
        @Size(min = 6, max = 100)
        String password
) {
}