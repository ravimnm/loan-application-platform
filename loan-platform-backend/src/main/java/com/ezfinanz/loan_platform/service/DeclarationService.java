package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.DeclarationRequest;
import com.ezfinanz.loan_platform.entity.*;
import com.ezfinanz.loan_platform.repository.LoanApplicationRepository;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DeclarationService {

    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public DeclarationService(
            LoanApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public LoanApplication acceptDeclaration(
            Long applicationId,
            String email,
            DeclarationRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        LoanApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        if (!application.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You do not own this application"
            );
        }

        if (application.getCurrentStage()
                != ApplicationStage.DECLARATION) {

            throw new RuntimeException(
                    "Application is not currently at declaration stage"
            );
        }

        if (!request.accepted()) {
            throw new RuntimeException(
                    "Declaration must be accepted"
            );
        }

        application.setDeclarationAccepted(true);

        application.setDeclarationAcceptedAt(
                LocalDateTime.now()
        );

        application.setCurrentStage(
                ApplicationStage.SELFIE
        );

        return applicationRepository.save(
                application
        );
    }
}