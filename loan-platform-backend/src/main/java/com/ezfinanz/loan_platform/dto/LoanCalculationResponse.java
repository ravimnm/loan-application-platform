package com.ezfinanz.loan_platform.dto;

public record LoanCalculationResponse(

        Long applicationId,

        Double loanAmount,

        Integer tenureMonths,

        Double interestRate,

        Double emi,

        Double totalInterest,

        Double totalRepayment,

        Double processingFee,

        Double gst,

        Double totalCharges,

        Double netDisbursement,

        Double irr
) {
}