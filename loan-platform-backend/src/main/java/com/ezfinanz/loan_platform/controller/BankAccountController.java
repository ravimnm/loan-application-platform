package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.dto.BankAccountRequest;
import com.ezfinanz.loan_platform.entity.BankAccount;
import com.ezfinanz.loan_platform.service.BankAccountService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    public BankAccountController(
            BankAccountService bankAccountService
    ) {
        this.bankAccountService = bankAccountService;
    }

    @PostMapping("/{applicationId}/bank-account")
    public ResponseEntity<BankAccount> submit(
            @PathVariable Long applicationId,
            @Valid @RequestBody BankAccountRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bankAccountService.submitBankAccount(
                        applicationId,
                        authentication.getName(),
                        request
                )
        );
    }
}