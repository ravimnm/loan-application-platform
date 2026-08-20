package com.ezfinanz.loan_platform.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ezfinanz.loan_platform.dto.AuthResponse;
import com.ezfinanz.loan_platform.dto.LoginRequest;
import com.ezfinanz.loan_platform.dto.OtpVerificationRequest;
import com.ezfinanz.loan_platform.dto.RegisterRequest;
import com.ezfinanz.loan_platform.dto.RegistrationResponse;
import com.ezfinanz.loan_platform.dto.ResendEmailOtpRequest;
import com.ezfinanz.loan_platform.entity.VerificationType;
import com.ezfinanz.loan_platform.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
    	this.authService=authService;
    }
    
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                authService.getCurrentUser(
                        authentication.getName()
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }
    
    @PostMapping("/resend-email-otp")
    public ResponseEntity<String> resendEmailOtp(
            @Valid @RequestBody ResendEmailOtpRequest request
    ) {

        return ResponseEntity.ok(
                authService.resendEmailOtp(
                        request.email()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @Valid @RequestBody OtpVerificationRequest request
    ) {

        String result =
                authService.verifyOtp(
                        request.email(),
                        VerificationType.EMAIL,
                        request.otp()
                );

        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/verify-phone")
    public ResponseEntity<String> verifyPhone(
            @Valid @RequestBody OtpVerificationRequest request
    ) {

        String result =
                authService.verifyOtp(
                        request.email(),
                        VerificationType.PHONE,
                        request.otp()
                );

        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/resend-phone-otp")
    public ResponseEntity<String> resendPhoneOtp(
            @Valid @RequestBody ResendEmailOtpRequest request
    ) {

        return ResponseEntity.ok(
                authService.resendPhoneOtp(
                        request.email()
                )
        );
    }
    
}