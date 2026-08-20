package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.entity.ApplicationStage;
import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.entity.LoanApplicationStatus;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.repository.LoanApplicationRepository;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

@Service
public class SelfieService {

    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/selfies")
                    .toAbsolutePath()
                    .normalize();

    public SelfieService(
            LoanApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create upload directory",
                    e
            );
        }
    }

    public LoanApplication uploadSelfie(
            Long applicationId,
            String email,
            MultipartFile file
    ) {

        // =========================
        // FIND USER
        // =========================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        // =========================
        // FIND APPLICATION
        // =========================

        LoanApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        // =========================
        // AUTHORIZATION
        // =========================

        if (!application.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You do not own this application"
            );
        }

        // =========================
        // STAGE VALIDATION
        // =========================

        if (application.getCurrentStage()
                != ApplicationStage.SELFIE) {

            throw new RuntimeException(
                    "Application is not currently at selfie stage"
            );
        }

        // =========================
        // FILE VALIDATION
        // =========================

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Selfie file is required"
            );
        }

        // 5 MB limit
        if (file.getSize() > 5 * 1024 * 1024) {

            throw new RuntimeException(
                    "Selfie must be smaller than 5 MB"
            );
        }

        String originalFilename =
                file.getOriginalFilename();

        if (originalFilename == null
                || originalFilename.isBlank()) {

            throw new RuntimeException(
                    "File name is required"
            );
        }

        String lowerFilename =
                originalFilename.toLowerCase();

        // =========================
        // ALLOWED IMAGE TYPES
        // =========================

        String extension;

        if (lowerFilename.endsWith(".png")) {

            extension = ".png";

        } else if (lowerFilename.endsWith(".jpg")
                || lowerFilename.endsWith(".jpeg")) {

            extension = ".jpg";

        } else if (lowerFilename.endsWith(".webp")) {

            extension = ".webp";

        } else {

            throw new RuntimeException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
            );
        }

        // =========================
        // CONTENT TYPE
        // =========================

        String contentType =
                file.getContentType();

        System.out.println(
                "Uploaded filename: "
                        + originalFilename
        );

        System.out.println(
                "Uploaded content type: "
                        + contentType
        );

        System.out.println(
                "Uploaded size: "
                        + file.getSize()
        );

        /*
         * Postman may send some files as
         * application/octet-stream.
         *
         * Therefore we use the filename extension
         * as a fallback instead of rejecting the file.
         */

        if (contentType != null
                && !contentType.startsWith("image/")
                && !contentType.equals(
                        "application/octet-stream"
                )) {

            throw new RuntimeException(
                    "Only image files are allowed"
            );
        }

        // =========================
        // GENERATE SAFE FILENAME
        // =========================

        String filename =
                "application_"
                        + applicationId
                        + "_"
                        + System.currentTimeMillis()
                        + extension;

        Path target =
                uploadDirectory
                        .resolve(filename)
                        .normalize();

        // =========================
        // PATH TRAVERSAL PROTECTION
        // =========================

        if (!target.startsWith(uploadDirectory)) {

            throw new RuntimeException(
                    "Invalid file path"
            );
        }

        // =========================
        // SAVE FILE
        // =========================

        try {

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save selfie",
                    e
            );
        }

        // =========================
        // UPDATE APPLICATION
        // =========================

        application.setSelfiePath(
                target.toString()
        );

        application.setSelfieUploadedAt(
                LocalDateTime.now()
        );

        application.setCurrentStage(
                ApplicationStage.ADMIN_REVIEW
        );

        application.setStatus(
                LoanApplicationStatus.WAITING_FOR_ADMIN_REVIEW
        );

        return applicationRepository.save(
                application
        );
    }
}