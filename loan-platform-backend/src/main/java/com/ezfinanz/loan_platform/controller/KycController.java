package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.dto.KycRequest;
import com.ezfinanz.loan_platform.entity.KycDetails;
import com.ezfinanz.loan_platform.service.KycService;

import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/applications")
public class KycController {

    private final KycService kycService;

    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    @PostMapping(
            value = "/{applicationId}/kyc",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<KycDetails> submitKyc(

            @PathVariable Long applicationId,

            @RequestPart("kyc")
            @Valid KycRequest request,

            @RequestPart("document")
            MultipartFile document,

            Authentication authentication
    ) {

        KycDetails result =
                kycService.submitKyc(
                        applicationId,
                        authentication.getName(),
                        request,
                        document
                );

        return ResponseEntity.ok(result);
    }
}