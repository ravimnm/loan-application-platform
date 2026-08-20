package com.ezfinanz.loan_platform.dto;

import com.ezfinanz.loan_platform.entity.KycDocumentType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record KycRequest(

        @NotBlank
        String fullName,

        LocalDate dateOfBirth,

        @NotBlank
        String gender,

        @NotBlank
        String address,
        @NotNull
        KycDocumentType idType,

        @NotBlank
        String idNumber
) {
}