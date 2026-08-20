package com.ezfinanz.loan_platform.dto;

import jakarta.validation.constraints.AssertTrue;

public record DeclarationRequest(

        @AssertTrue(
                message = "Declaration must be accepted"
        )
        boolean accepted
) {
}