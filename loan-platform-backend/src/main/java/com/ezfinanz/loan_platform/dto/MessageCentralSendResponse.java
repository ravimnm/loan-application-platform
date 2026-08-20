package com.ezfinanz.loan_platform.dto;

public record MessageCentralSendResponse(
        Integer responseCode,
        String message,
        MessageCentralSendData data
) {
}