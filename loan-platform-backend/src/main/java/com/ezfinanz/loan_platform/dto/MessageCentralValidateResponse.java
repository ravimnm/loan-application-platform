package com.ezfinanz.loan_platform.dto;

public record MessageCentralValidateResponse(
        Integer responseCode,
        String message,
        MessageCentralValidateData data
) {
}