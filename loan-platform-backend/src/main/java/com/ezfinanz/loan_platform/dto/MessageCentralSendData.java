package com.ezfinanz.loan_platform.dto;

public record MessageCentralSendData(
        String verificationId,
        String mobileNumber,
        String responseCode,
        String errorMessage,
        String timeout,
        String transactionId
) {
}