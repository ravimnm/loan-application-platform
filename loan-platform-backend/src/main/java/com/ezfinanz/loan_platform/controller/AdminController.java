package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.dto.AdminApplicationDetailResponse;
import com.ezfinanz.loan_platform.dto.AdminApplicationResponse;
import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.service.AdminService;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService
    ) {
        this.adminService = adminService;
    }

    // =========================================================
    // GET ALL APPLICATIONS
    // =========================================================

    @GetMapping("/applications")
    public ResponseEntity<List<AdminApplicationResponse>>
    getApplications() {

        return ResponseEntity.ok(
                adminService.getApplications()
        );
    }

    // =========================================================
    // GET ONE FULL APPLICATION
    // =========================================================

    @GetMapping("/applications/{id}")
    public ResponseEntity<AdminApplicationDetailResponse>
    getApplication(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminService.getApplicationDetails(id)
        );
    }

    // =========================================================
    // APPROVE
    // =========================================================

    @PostMapping("/applications/{id}/approve")
    public ResponseEntity<LoanApplication>
    approve(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminService.approveApplication(id)
        );
    }

    // =========================================================
    // REJECT
    // =========================================================

    @PostMapping("/applications/{id}/reject")
    public ResponseEntity<LoanApplication>
    reject(
            @PathVariable Long id,
            @RequestParam(required = false)
            String reason
    ) {

        return ResponseEntity.ok(
                adminService.rejectApplication(
                        id,
                        reason
                )
        );
    }

    // =========================================================
    // DISBURSE
    // =========================================================

    @PostMapping("/applications/{id}/disburse")
    public ResponseEntity<LoanApplication>
    disburse(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminService.disburseApplication(id)
        );
    }

    // =========================================================
    // GET KYC DOCUMENT
    // =========================================================

    @GetMapping("/applications/{id}/kyc-document")
    public ResponseEntity<Resource>
    getKycDocument(
            @PathVariable Long id
    ) {

        return adminService.getKycDocument(id);
    }

    // =========================================================
    // GET SELFIE
    // =========================================================

    @GetMapping("/applications/{id}/selfie")
    public ResponseEntity<Resource>
    getSelfie(
            @PathVariable Long id
    ) {

        return adminService.getSelfie(id);
    }
    
    @PostMapping("/applications/{id}/kyc/verify")
    public ResponseEntity<AdminApplicationDetailResponse> verifyKyc(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                adminService.verifyKyc(id)
        );
    }
    
    @PostMapping("/applications/{id}/kyc/reject")
    public ResponseEntity<AdminApplicationDetailResponse> rejectKyc(
            @PathVariable Long id,
            @RequestParam String reason
    ) {
        return ResponseEntity.ok(
                adminService.rejectKyc(id, reason)
        );
    }
}