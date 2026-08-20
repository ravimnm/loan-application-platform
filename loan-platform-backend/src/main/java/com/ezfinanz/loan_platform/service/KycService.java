package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.KycRequest;
import com.ezfinanz.loan_platform.entity.ApplicationStage;
import com.ezfinanz.loan_platform.entity.KycDetails;
import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.repository.KycDetailsRepository;
import com.ezfinanz.loan_platform.repository.LoanApplicationRepository;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class KycService {

    private final LoanApplicationRepository applicationRepository;
    private final KycDetailsRepository kycRepository;
    private final UserRepository userRepository;

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    public KycService(
            LoanApplicationRepository applicationRepository,
            KycDetailsRepository kycRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.kycRepository = kycRepository;
        this.userRepository = userRepository;
    }

    public KycDetails submitKyc(
            Long applicationId,
            String email,
            KycRequest request,
            MultipartFile document
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        LoanApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        /*
         * Object-level authorization.
         *
         * A customer can only modify their own application.
         */
        if (!application.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "You do not own this application"
            );
        }

        /*
         * KYC must be the current application stage.
         */
        if (application.getCurrentStage()
                != ApplicationStage.KYC) {

            throw new RuntimeException(
                    "Application is not currently at KYC stage"
            );
        }

        /*
         * Prevent duplicate KYC submissions.
         */
        if (kycRepository.existsByApplication(application)) {

            throw new RuntimeException(
                    "KYC already submitted"
            );
        }

        /*
         * Validate uploaded document.
         */
        validateDocument(document);

        /*
         * Store document.
         */
        String documentPath =
                storeDocument(
                        applicationId,
                        request.idType().name(),
                        document
                );

        LocalDateTime uploadedAt =
                LocalDateTime.now();

        /*
         * Create KYC record.
         */
        KycDetails kyc = new KycDetails(
                application,
                request.fullName(),
                request.dateOfBirth(),
                request.gender(),
                request.address(),
                request.idType(),
                request.idNumber(),
                documentPath,
                uploadedAt
        );

        KycDetails saved =
                kycRepository.save(kyc);

        /*
         * Move application to next stage.
         */
        application.setCurrentStage(
                ApplicationStage.ELIGIBILITY
        );

        applicationRepository.save(application);

        return saved;
    }

    private void validateDocument(
            MultipartFile document
    ) {

        if (document == null ||
                document.isEmpty()) {

            throw new RuntimeException(
                    "KYC document is required"
            );
        }

        /*
         * Maximum size: 5 MB.
         */
        long maxSize =
                5 * 1024 * 1024;

        if (document.getSize() > maxSize) {

            throw new RuntimeException(
                    "KYC document must not exceed 5 MB"
            );
        }

        String contentType =
                document.getContentType();

        if (contentType == null ||
                !isAllowedContentType(contentType)) {

            throw new RuntimeException(
                    "Only PDF, JPG, JPEG and PNG documents are allowed"
            );
        }
    }

    private boolean isAllowedContentType(
            String contentType
    ) {

        return contentType.equals(
                    "application/pdf"
                )
                || contentType.equals(
                    "image/jpeg"
                )
                || contentType.equals(
                    "image/png"
                );
    }

    private String storeDocument(
            Long applicationId,
            String documentType,
            MultipartFile document
    ) {

        try {

            Path directory =
                    Paths.get(
                            uploadDir,
                            "kyc"
                    );

            Files.createDirectories(directory);

            String originalName =
                    document.getOriginalFilename();

            String extension =
                    getExtension(originalName);

            String filename =
                    "application_"
                    + applicationId
                    + "_"
                    + documentType.toLowerCase()
                    + "_"
                    + UUID.randomUUID()
                    + extension;

            Path destination =
                    directory.resolve(filename);

            Files.copy(
                    document.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return destination
                    .toString()
                    .replace("\\", "/");

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to store KYC document",
                    e
            );
        }
    }

    private String getExtension(
            String filename
    ) {

        if (filename == null ||
                !filename.contains(".")) {

            return "";
        }

        return filename.substring(
                filename.lastIndexOf(".")
        ).toLowerCase();
    }
}