package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.service.LoanApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class LoanApplicationController {

    private final LoanApplicationService applicationService;

    public LoanApplicationController(
            LoanApplicationService applicationService
    ) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<LoanApplication> createApplication(
            Authentication authentication
    ) {

        LoanApplication application =
                applicationService.createApplication(
                        authentication.getName()
                );

        return ResponseEntity.ok(application);
    }
    
    @GetMapping
    public ResponseEntity<List<LoanApplication>> getApplications(
            Authentication authentication
    ) {

        List<LoanApplication> applications =
                applicationService.getApplications(
                        authentication.getName()
                );

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/current")
    public ResponseEntity<LoanApplication> getCurrentApplication(
            Authentication authentication
    ) {

        LoanApplication application =
                applicationService.getCurrentApplication(
                        authentication.getName()
                );

        return ResponseEntity.ok(application);
    }
    
    @GetMapping("/{applicationId}")
    public ResponseEntity<LoanApplication> getApplication(
            @PathVariable Long applicationId,
            Authentication authentication
    ) {

        LoanApplication application =
                applicationService.getApplication(
                        applicationId,
                        authentication.getName()
                );

        return ResponseEntity.ok(application);
    }
    
    @PostMapping("/{applicationId}/withdraw")
    public ResponseEntity<LoanApplication> withdrawApplication(
            @PathVariable Long applicationId,
            Authentication authentication
    ) {

        LoanApplication application =
                applicationService.withdrawApplication(
                        applicationId,
                        authentication.getName()
                );

        return ResponseEntity.ok(application);
    }
}