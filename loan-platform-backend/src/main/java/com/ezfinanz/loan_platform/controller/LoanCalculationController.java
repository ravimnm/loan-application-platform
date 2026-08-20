package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.dto.LoanCalculationRequest;
import com.ezfinanz.loan_platform.dto.LoanCalculationResponse;
import com.ezfinanz.loan_platform.service.LoanCalculationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class LoanCalculationController {

    private final LoanCalculationService calculationService;

    public LoanCalculationController(
            LoanCalculationService calculationService
    ) {
        this.calculationService = calculationService;
    }

    @PostMapping("/{applicationId}/calculate")
    public ResponseEntity<LoanCalculationResponse> calculate(
            @PathVariable Long applicationId,
            @Valid @RequestBody LoanCalculationRequest request,
            Authentication authentication
    ) {

        LoanCalculationResponse response =
                calculationService.calculate(
                        applicationId,
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }
}