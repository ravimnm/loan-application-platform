package com.ezfinanz.loan_platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AdminCreateRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Pattern(
                regexp = "^[0-9]{10}$",
                message = "Phone must contain exactly 10 digits"
        )
        String phone,

        @NotBlank
        @Size(
                min = 8,
                max = 100
        )
        String password
) {
}