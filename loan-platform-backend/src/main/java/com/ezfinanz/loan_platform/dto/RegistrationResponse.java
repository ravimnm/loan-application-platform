package com.ezfinanz.loan_platform.dto;

public record RegistrationResponse(
        Long userId,
        String email,
        String phone,
        String message
) {
}