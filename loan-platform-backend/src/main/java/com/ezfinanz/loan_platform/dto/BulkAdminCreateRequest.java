package com.ezfinanz.loan_platform.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record BulkAdminCreateRequest(

        @NotEmpty(message = "At least one admin is required")
        @Valid
        List<AdminCreateRequest> admins

) {
}