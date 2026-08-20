package com.ezfinanz.loan_platform.dto;

public record AuthResponse(
        String token,
        Long userId,
        String email,
        String role
) {
}