package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.entity.ApplicationStage;
import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.entity.LoanApplicationStatus;
import com.ezfinanz.loan_platform.entity.User;

import com.ezfinanz.loan_platform.repository.LoanApplicationRepository;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanApplicationService {
	
	private static final List<LoanApplicationStatus> ACTIVE_STATUSES =
	        List.of(
	                LoanApplicationStatus.DRAFT,
	                LoanApplicationStatus.ELIGIBLE,
	                LoanApplicationStatus.PARTIALLY_ELIGIBLE,
	                LoanApplicationStatus.SELFIE_PENDING,
	                LoanApplicationStatus.WAITING_FOR_ADMIN_REVIEW,
	                LoanApplicationStatus.APPROVED
	        );

    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public LoanApplicationService(
            LoanApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public LoanApplication createApplication(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );
        if (!user.isEmailVerified() && !user.isPhoneVerified()) {
            throw new RuntimeException(
                "Please verify your email and phone before starting a loan application"
            );
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException(
                "Please verify your email before starting a loan application"
            );
        }

        if (!user.isPhoneVerified()) {
            throw new RuntimeException(
                "Please verify your phone before starting a loan application"
            );
        }


        if (applicationRepository
                .existsByUserAndStatusIn(user, ACTIVE_STATUSES)) {

            throw new RuntimeException(
                    "You already have an active loan application"
            );
        }

        LoanApplication application =
                new LoanApplication(user);

        application.setCurrentStage(
                ApplicationStage.KYC
        );

        application.setStatus(
                LoanApplicationStatus.DRAFT
        );

        return applicationRepository.save(application);
    }
    
    public List<LoanApplication> getApplications(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return applicationRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    public LoanApplication getCurrentApplication(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        

        return applicationRepository
                .findFirstByUserAndStatusInOrderByCreatedAtDesc(
                        user,
                        ACTIVE_STATUSES
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "No active loan application found"
                        )
                );
    }
    
    public LoanApplication getApplication(
            Long applicationId,
            String email
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

        if (!application.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not allowed to view this application"
            );
        }

        return application;
    }
    
    public LoanApplication withdrawApplication(
            Long applicationId,
            String email
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

        if (!application.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You do not own this application"
            );
        }

        List<LoanApplicationStatus> withdrawableStatuses =
                List.of(
                        LoanApplicationStatus.DRAFT,
                        LoanApplicationStatus.ELIGIBLE,
                        LoanApplicationStatus.PARTIALLY_ELIGIBLE,
                        LoanApplicationStatus.SELFIE_PENDING
                );

        if (!withdrawableStatuses.contains(application.getStatus())) {
            throw new RuntimeException(
                    "This application cannot be withdrawn"
            );
        }

        application.setStatus(
                LoanApplicationStatus.WITHDRAWN
        );

        return applicationRepository.save(application);
    }
    
}