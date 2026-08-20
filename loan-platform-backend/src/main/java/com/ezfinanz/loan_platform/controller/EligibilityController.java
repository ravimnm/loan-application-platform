package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.dto.EligibilityRequest;
import com.ezfinanz.loan_platform.dto.EligibilityResponse;
import com.ezfinanz.loan_platform.service.EligibilityService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class EligibilityController {

    private final EligibilityService eligibilityService;

    public EligibilityController(
            EligibilityService eligibilityService
    ) {
        this.eligibilityService = eligibilityService;
    }

    @PostMapping("/{applicationId}/eligibility")
    public ResponseEntity<EligibilityResponse> evaluate(
            @PathVariable Long applicationId,
            @Valid @RequestBody EligibilityRequest request,
            Authentication authentication
    ) {

        EligibilityResponse response =
                eligibilityService.evaluate(
                        applicationId,
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }
}