package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.AdminApplicationDetailResponse;
import com.ezfinanz.loan_platform.dto.AdminApplicationResponse;
import com.ezfinanz.loan_platform.entity.ApplicationStage;
import com.ezfinanz.loan_platform.entity.KycDetails;
import com.ezfinanz.loan_platform.entity.KycVerificationStatus;
import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.entity.LoanApplicationStatus;
import com.ezfinanz.loan_platform.repository.KycDetailsRepository;
import com.ezfinanz.loan_platform.repository.LoanApplicationRepository;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    private final LoanApplicationRepository applicationRepository;
    private final KycDetailsRepository kycDetailsRepository;

    /*
     * Base directory where uploaded files are stored.
     */
    private final Path uploadDirectory =
            Paths.get("uploads")
                    .toAbsolutePath()
                    .normalize();

    public AdminService(
            LoanApplicationRepository applicationRepository,
            KycDetailsRepository kycDetailsRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.kycDetailsRepository = kycDetailsRepository;
    }

    // =========================================================
    // GET ALL APPLICATIONS
    // =========================================================

    public List<AdminApplicationResponse> getApplications() {

        return applicationRepository.findAll()
                .stream()
                .map(application -> {

                    var user = application.getUser();

                    KycDetails kycDetails =
                            kycDetailsRepository
                                    .findByApplication(application)
                                    .orElse(null);

                    String applicantName =
                            kycDetails != null
                                    ? kycDetails.getFullName()
                                    : null;

                    return new AdminApplicationResponse(
                            application.getId(),
                            user.getId(),
                            user.getEmail(),
                            user.getPhone(),
                            applicantName,
                            application.getRequestedAmount(),
                            application.getTenure(),
                            application.getCurrentStage(),
                            application.getStatus(),
                            application.getCreatedAt(),
                            application.getUpdatedAt(),
                            application.getRejectionReason()
                    );
                })
                .toList();
    }

    // =========================================================
    // GET ONE FULL APPLICATION
    // =========================================================

    public AdminApplicationDetailResponse getApplicationDetails(
            Long id
    ) {

        LoanApplication application =
                getLoanApplication(id);

        var user = application.getUser();

        KycDetails kycDetails =
                kycDetailsRepository
                        .findByApplication(application)
                        .orElse(null);

        AdminApplicationDetailResponse.KycData kyc = null;

        if (kycDetails != null) {

            kyc =
                    new AdminApplicationDetailResponse.KycData(
                            kycDetails.getFullName(),
                            kycDetails.getDateOfBirth(),
                            kycDetails.getGender(),
                            kycDetails.getAddress(),
                            kycDetails.getIdType(),
                            kycDetails.getIdNumber(),

                            // Document uploaded
                            kycDetails.getIdDocumentPath() != null
                                    && !kycDetails
                                            .getIdDocumentPath()
                                            .isBlank(),

                            kycDetails.getDocumentUploadedAt(),

                            // Verification
                            kycDetails.getVerificationStatus(),

                            kycDetails.getVerifiedAt(),

                            kycDetails.getVerificationReason()
                    );
        }

        return new AdminApplicationDetailResponse(

                // =================================================
                // APPLICATION
                // =================================================

                application.getId(),

                // =================================================
                // USER
                // =================================================

                user.getId(),
                user.getEmail(),
                user.getPhone(),
                user.isEmailVerified(),
                user.isPhoneVerified(),

                // =================================================
                // KYC
                // =================================================

                kyc,

                // =================================================
                // STATUS
                // =================================================

                application.getCurrentStage(),
                application.getStatus(),
                application.getCreatedAt(),
                application.getUpdatedAt(),

                // =================================================
                // LOAN
                // =================================================

                application.getRequestedAmount(),
                application.getTenure(),
                application.getMonthlyIncome(),
                application.getExistingDebt(),
                application.getCibilScore(),
                application.getDebtToIncomeRatio(),
                application.getEmployerName(),
                application.getDesignation(),

                // =================================================
                // CALCULATION
                // =================================================

                application.getInterestRate(),
                application.getEmi(),
                application.getTotalInterest(),
                application.getTotalRepayment(),
                application.getProcessingFee(),
                application.getGst(),
                application.getTotalCharges(),
                application.getNetDisbursement(),
                application.getIrr(),

                // =================================================
                // DECLARATION
                // =================================================

                application.isDeclarationAccepted(),
                application.getDeclarationAcceptedAt(),

                // =================================================
                // SELFIE
                // =================================================

                application.getSelfiePath(),
                application.getSelfieUploadedAt(),

                // =================================================
                // REJECTION
                // =================================================

                application.getRejectionReason()
        );
    }

    // =========================================================
    // VERIFY KYC
    // =========================================================

    public AdminApplicationDetailResponse verifyKyc(
            Long applicationId
    ) {

        LoanApplication application =
                getLoanApplication(applicationId);

        KycDetails kyc =
                kycDetailsRepository
                        .findByApplication(application)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "KYC details not found"
                                )
                        );

        /*
         * KYC must have a document before it can be verified.
         */
        if (kyc.getIdDocumentPath() == null ||
                kyc.getIdDocumentPath().isBlank()) {

            throw new RuntimeException(
                    "KYC document has not been uploaded"
            );
        }

        /*
         * Prevent verifying an already verified KYC.
         */
        if (kyc.getVerificationStatus()
                == KycVerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "KYC is already verified"
            );
        }

        /*
         * Mark KYC as verified.
         */
        kyc.setVerificationStatus(
                KycVerificationStatus.VERIFIED
        );

        kyc.setVerifiedAt(
                LocalDateTime.now()
        );

        kyc.setVerificationReason(null);

        kycDetailsRepository.save(kyc);

        /*
         * Return the complete updated application.
         */
        return getApplicationDetails(applicationId);
    }

    // =========================================================
    // REJECT KYC
    // =========================================================

    public AdminApplicationDetailResponse rejectKyc(
            Long applicationId,
            String reason
    ) {

        LoanApplication application =
                getLoanApplication(applicationId);

        KycDetails kyc =
                kycDetailsRepository
                        .findByApplication(application)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "KYC details not found"
                                )
                        );

        if (reason == null ||
                reason.isBlank()) {

            throw new RuntimeException(
                    "KYC rejection reason is required"
            );
        }

        /*
         * Prevent rejecting an already verified KYC.
         */
        if (kyc.getVerificationStatus()
                == KycVerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Verified KYC cannot be rejected"
            );
        }

        /*
         * Mark KYC as rejected.
         */
        kyc.setVerificationStatus(
                KycVerificationStatus.REJECTED
        );

        kyc.setVerifiedAt(
                LocalDateTime.now()
        );

        kyc.setVerificationReason(
                reason.trim()
        );

        kycDetailsRepository.save(kyc);

        /*
         * Return updated application details.
         */
        return getApplicationDetails(applicationId);
    }

    // =========================================================
    // INTERNAL APPLICATION LOOKUP
    // =========================================================

    private LoanApplication getLoanApplication(
            Long id
    ) {

        return applicationRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found"
                        )
                );
    }

    // =========================================================
    // APPROVE APPLICATION
    // =========================================================

    public LoanApplication approveApplication(
            Long id
    ) {

        LoanApplication application =
                getLoanApplication(id);

        if (application.getStatus()
                != LoanApplicationStatus.WAITING_FOR_ADMIN_REVIEW) {

            throw new RuntimeException(
                    "Application is not awaiting admin review"
            );
        }

        application.setStatus(
                LoanApplicationStatus.APPROVED
        );

        application.setCurrentStage(
                ApplicationStage.DISBURSEMENT
        );

        return applicationRepository.save(
                application
        );
    }

    // =========================================================
    // REJECT APPLICATION
    // =========================================================

    public LoanApplication rejectApplication(
            Long id,
            String reason
    ) {

        LoanApplication application =
                getLoanApplication(id);

        if (application.getStatus()
                != LoanApplicationStatus.WAITING_FOR_ADMIN_REVIEW) {

            throw new RuntimeException(
                    "Application is not awaiting admin review"
            );
        }

        application.setStatus(
                LoanApplicationStatus.REJECTED
        );

        application.setRejectionReason(
                reason
        );

        application.setCurrentStage(
                ApplicationStage.COMPLETED
        );

        return applicationRepository.save(
                application
        );
    }

    // =========================================================
    // DISBURSE
    // =========================================================

    public LoanApplication disburseApplication(
            Long id
    ) {

        LoanApplication application =
                getLoanApplication(id);

        if (application.getStatus()
                != LoanApplicationStatus.APPROVED) {

            throw new RuntimeException(
                    "Application must be approved first"
            );
        }

        if (application.getCurrentStage()
                != ApplicationStage.DISBURSEMENT) {

            throw new RuntimeException(
                    "Application is not ready for disbursement"
            );
        }

        application.setStatus(
                LoanApplicationStatus.DISBURSED
        );

        application.setCurrentStage(
                ApplicationStage.COMPLETED
        );

        return applicationRepository.save(
                application
        );
    }

    // =========================================================
    // GET KYC DOCUMENT
    // =========================================================

    public ResponseEntity<Resource> getKycDocument(
            Long id
    ) {

        LoanApplication application =
                getLoanApplication(id);

        KycDetails kycDetails =
                kycDetailsRepository
                        .findByApplication(application)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "KYC details not found"
                                )
                        );

        String storedPath =
                kycDetails.getIdDocumentPath();

        if (storedPath == null ||
                storedPath.isBlank()) {

            throw new RuntimeException(
                    "KYC document has not been uploaded"
            );
        }

        return buildFileResponse(
                storedPath,
                "KYC document"
        );
    }

    // =========================================================
    // GET SELFIE
    // =========================================================

    public ResponseEntity<Resource> getSelfie(
            Long id
    ) {

        LoanApplication application =
                getLoanApplication(id);

        String storedPath =
                application.getSelfiePath();

        if (storedPath == null ||
                storedPath.isBlank()) {

            throw new RuntimeException(
                    "Selfie has not been uploaded"
            );
        }

        return buildFileResponse(
                storedPath,
                "Selfie"
        );
    }

    // =========================================================
    // BUILD FILE RESPONSE
    // =========================================================

    private ResponseEntity<Resource> buildFileResponse(
            String storedPath,
            String fileDescription
    ) {

        try {

            Path filePath =
                    resolveStoredFilePath(storedPath);

            // =====================================================
            // SECURITY CHECK
            // =====================================================

            if (!filePath.startsWith(uploadDirectory)) {

                throw new RuntimeException(
                        "Invalid file path"
                );
            }

            // =====================================================
            // FILE EXISTENCE
            // =====================================================

            if (!Files.exists(filePath)) {

                throw new RuntimeException(
                        fileDescription +
                                " file could not be found"
                );
            }

            if (!Files.isRegularFile(filePath)) {

                throw new RuntimeException(
                        fileDescription +
                                " is not a valid file"
                );
            }

            Resource resource =
                    new FileSystemResource(filePath);

            String contentType =
                    Files.probeContentType(filePath);

            MediaType mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;

            if (contentType != null) {

                try {

                    mediaType =
                            MediaType.parseMediaType(
                                    contentType
                            );

                } catch (Exception ignored) {

                    mediaType =
                            MediaType.APPLICATION_OCTET_STREAM;
                }
            }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                                    filePath.getFileName() +
                                    "\""
                    )
                    .body(resource);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to read " +
                            fileDescription.toLowerCase(),
                    e
            );
        }
    }

    // =========================================================
    // RESOLVE STORED FILE PATH
    // =========================================================

    private Path resolveStoredFilePath(
            String storedPath
    ) {

        Path path =
                Paths.get(storedPath);

        /*
         * If the database contains:
         *
         * uploads/kyc/application_12_xxx.pdf
         *
         * we need:
         *
         * <project>/uploads/kyc/application_12_xxx.pdf
         *
         * NOT:
         *
         * <project>/uploads/uploads/kyc/application_12_xxx.pdf
         */
        if (!path.isAbsolute()) {

            String normalizedStoredPath =
                    storedPath
                            .replace("\\", "/")
                            .replaceFirst(
                                    "^uploads/",
                                    ""
                            );

            path =
                    uploadDirectory
                            .resolve(normalizedStoredPath)
                            .normalize();

        } else {

            path =
                    path
                            .toAbsolutePath()
                            .normalize();
        }

        return path;
    }
}