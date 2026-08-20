package com.ezfinanz.loan_platform.dto;

public record OtpResponse(
        String message,
        String otp
) {
}