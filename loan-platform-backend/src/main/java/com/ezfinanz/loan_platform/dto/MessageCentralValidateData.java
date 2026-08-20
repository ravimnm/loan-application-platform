package com.ezfinanz.loan_platform.dto;

public record MessageCentralValidateData(
        String verificationId,
        String mobileNumber,
        String responseCode,
        String errorMessage,
        String verificationStatus,
        String transactionId
) {
}