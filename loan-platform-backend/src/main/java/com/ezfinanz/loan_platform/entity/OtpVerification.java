package com.ezfinanz.loan_platform.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationType type;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean verified;
    
    @Column
    private String providerVerificationId;

    public OtpVerification() {
    }

    public OtpVerification(
            User user,
            VerificationType type,
            String otp,
            LocalDateTime expiresAt
    ) {
        this.user = user;
        this.type = type;
        this.otp = otp;
        this.expiresAt = expiresAt;
        this.verified = false;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public VerificationType getType() {
        return type;
    }

    public String getOtp() {
        return otp;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public String getProviderVerificationId() {
        return providerVerificationId;
    }

    public void setProviderVerificationId(
            String providerVerificationId
    ) {
        this.providerVerificationId =
                providerVerificationId;
    }

}