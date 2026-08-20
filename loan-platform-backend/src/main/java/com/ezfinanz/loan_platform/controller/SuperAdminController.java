package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.dto.AdminCreateRequest;
import com.ezfinanz.loan_platform.dto.AdminResponse;
import com.ezfinanz.loan_platform.dto.BulkAdminCreateRequest;
import com.ezfinanz.loan_platform.service.SuperAdminService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    public SuperAdminController(
            SuperAdminService superAdminService
    ) {
        this.superAdminService =
                superAdminService;
    }

    // =========================
    // CREATE ADMIN
    // =========================

    @PostMapping("/admins")
    public ResponseEntity<AdminResponse> createAdmin(
            @Valid @RequestBody
            AdminCreateRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        superAdminService.createAdmin(
                                request
                        )
                );
    }
    
    @PostMapping("/admins/bulk")
    public ResponseEntity<List<AdminResponse>> createAdmins(
            @Valid @RequestBody BulkAdminCreateRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        superAdminService.createAdmins(
                                request.admins()
                        )
                );
    }

    // =========================
    // LIST ADMINS
    // =========================

    @GetMapping("/admins")
    public ResponseEntity<List<AdminResponse>>
    getAdmins() {

        return ResponseEntity.ok(
                superAdminService.getAdmins()
        );
    }

    // =========================
    // DISABLE ADMIN
    // =========================

    @PatchMapping("/admins/{id}/disable")
    public ResponseEntity<AdminResponse>
    disableAdmin(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                superAdminService.disableAdmin(id)
        );
    }

    // =========================
    // ENABLE ADMIN
    // =========================

    @PatchMapping("/admins/{id}/enable")
    public ResponseEntity<AdminResponse>
    enableAdmin(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                superAdminService.enableAdmin(id)
        );
    }
}