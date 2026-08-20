package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class EmailTestController {

    private final EmailService emailService;

    public EmailTestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/email")
    public ResponseEntity<String> sendTestEmail(
            @RequestParam String email
    ) {

        emailService.sendOtp(
                email,
                "123456"
        );

        return ResponseEntity.ok(
                "Test email sent"
        );
    }
}