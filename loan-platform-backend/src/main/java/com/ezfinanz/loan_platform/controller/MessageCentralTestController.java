package com.ezfinanz.loan_platform.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ezfinanz.loan_platform.service.MessageCentralService;

@RestController
@RequestMapping("/api/test/message-central")
public class MessageCentralTestController {

    private final MessageCentralService service;

    public MessageCentralTestController(
            MessageCentralService service
    ) {
        this.service = service;
    }

    @PostMapping("/send")
    public ResponseEntity<String> send(
            @RequestParam String phone
    ) {

        String verificationId =
                service.sendOtp(phone);

        return ResponseEntity.ok(
                verificationId
        );
    }
    
    @PostMapping("/verify")
    public ResponseEntity<String> verify(
            @RequestParam String verificationId,
            @RequestParam String otp
    ) {

        boolean verified =
                service.verifyOtp(
                        verificationId,
                        otp
                );

        if (verified) {
            return ResponseEntity.ok(
                    "OTP verified successfully"
            );
        }

        return ResponseEntity.badRequest()
                .body("Invalid OTP");
    }
}
