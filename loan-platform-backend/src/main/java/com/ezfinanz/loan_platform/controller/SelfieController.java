package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.service.SelfieService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/applications")
public class SelfieController {

    private final SelfieService selfieService;

    public SelfieController(
            SelfieService selfieService
    ) {
        this.selfieService = selfieService;
    }

    @PostMapping(
            value = "/{applicationId}/selfie",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<LoanApplication> upload(
            @PathVariable Long applicationId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {

        LoanApplication application =
                selfieService.uploadSelfie(
                        applicationId,
                        authentication.getName(),
                        file
                );

        return ResponseEntity.ok(application);
    }
}