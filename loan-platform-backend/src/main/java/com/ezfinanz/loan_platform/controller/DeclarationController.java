package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.dto.DeclarationRequest;
import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.service.DeclarationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class DeclarationController {

    private final DeclarationService declarationService;

    public DeclarationController(
            DeclarationService declarationService
    ) {
        this.declarationService = declarationService;
    }

    @PostMapping("/{applicationId}/declaration")
    public ResponseEntity<LoanApplication> accept(
            @PathVariable Long applicationId,
            @Valid @RequestBody DeclarationRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                declarationService.acceptDeclaration(
                        applicationId,
                        authentication.getName(),
                        request
                )
        );
    }
}