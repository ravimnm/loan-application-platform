package com.ezfinanz.loan_platform.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_details")
public class KycDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "application_id",
            nullable = false,
            unique = true
    )
    private LoanApplication application;

    @Column(nullable = false)
    private String fullName;

    private LocalDate dateOfBirth;

    private String gender;

    @Column(nullable = false, length = 500)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycDocumentType idType;

    @Column(nullable = false)
    private String idNumber;

    /**
     * Stored filesystem path of the uploaded KYC document.
     */
    private String idDocumentPath;

    private LocalDateTime documentUploadedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycVerificationStatus verificationStatus;

    private LocalDateTime verifiedAt;

    private String verificationReason;

    public KycDetails() {
    }

    public KycDetails(
            LoanApplication application,
            String fullName,
            LocalDate dateOfBirth,
            String gender,
            String address,
            KycDocumentType idType,
            String idNumber,
            String idDocumentPath,
            LocalDateTime documentUploadedAt
    ) {
        this.application = application;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.idType = idType;
        this.idNumber = idNumber;
        this.idDocumentPath = idDocumentPath;
        this.documentUploadedAt = documentUploadedAt;

        this.verificationStatus = KycVerificationStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public LoanApplication getApplication() {
        return application;
    }

    public String getFullName() {
        return fullName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getAddress() {
        return address;
    }

    public KycDocumentType getIdType() {
        return idType;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public String getIdDocumentPath() {
        return idDocumentPath;
    }

    public LocalDateTime getDocumentUploadedAt() {
        return documentUploadedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setIdDocumentPath(String idDocumentPath) {
        this.idDocumentPath = idDocumentPath;
    }

    public void setDocumentUploadedAt(
            LocalDateTime documentUploadedAt
    ) {
        this.documentUploadedAt = documentUploadedAt;
    }
    
    public KycVerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public String getVerificationReason() {
        return verificationReason;
    }
    
    public void setVerificationStatus(
            KycVerificationStatus verificationStatus
    ) {
        this.verificationStatus = verificationStatus;
    }

    public void setVerifiedAt(
            LocalDateTime verifiedAt
    ) {
        this.verifiedAt = verifiedAt;
    }

    public void setVerificationReason(
            String verificationReason
    ) {
        this.verificationReason = verificationReason;
    }
}