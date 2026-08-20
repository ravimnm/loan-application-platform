package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.EligibilityRequest;
import com.ezfinanz.loan_platform.dto.EligibilityResponse;
import com.ezfinanz.loan_platform.entity.ApplicationStage;
import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.entity.LoanApplicationStatus;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.repository.LoanApplicationRepository;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EligibilityService {

    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public EligibilityService(
            LoanApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EligibilityResponse evaluate(
            Long applicationId,
            String email,
            EligibilityRequest request
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

        // -------------------------
        // Authorization
        // -------------------------

        if (!application.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You do not own this application"
            );
        }

        // -------------------------
        // Stage validation
        // -------------------------

        if (application.getCurrentStage()
                != ApplicationStage.ELIGIBILITY) {

            throw new RuntimeException(
                    "Application is not currently at eligibility stage"
            );
        }

        // -------------------------
        // Calculate DTI
        // -------------------------

        double dti =
                (request.existingDebt()
                        / request.monthlyIncome()) * 100.0;

        dti = Math.round(dti * 100.0) / 100.0;

        // -------------------------
        // Basic eligibility rules
        // -------------------------

        boolean cibilGood =
                request.cibilScore() >= 700;

        boolean incomeGood =
                request.monthlyIncome() >= 25000;

        boolean dtiGood =
                dti <= 50;

        // -------------------------
        // Maximum eligible amount
        // -------------------------

        double maximumEligibleAmount =
                request.monthlyIncome() * 20;

        // -------------------------
        // Determine eligibility
        // -------------------------

        LoanApplicationStatus status;

        boolean eligible;

        String message;

        if (!cibilGood) {

            status = LoanApplicationStatus.NOT_ELIGIBLE;
            eligible = false;

            message =
                    "Your CIBIL score does not meet the minimum requirement of 700.";

        } else if (!incomeGood) {

            status = LoanApplicationStatus.NOT_ELIGIBLE;
            eligible = false;

            message =
                    "Your monthly income does not meet the minimum requirement of ₹25,000.";

        } else if (!dtiGood) {

            status = LoanApplicationStatus.NOT_ELIGIBLE;
            eligible = false;

            message =
                    "Your existing debt is too high relative to your monthly income. " +
                    "The maximum allowed debt-to-income ratio is 50%.";

        } else if (request.requestedAmount()
                > maximumEligibleAmount) {

            status = LoanApplicationStatus.NOT_ELIGIBLE;
            eligible = false;

            message =
                    "The requested loan amount is too high for your declared income. " +
                    "Based on your monthly income of ₹"
                    + String.format("%.0f", request.monthlyIncome())
                    + ", the maximum eligible loan amount is ₹"
                    + String.format("%.0f", maximumEligibleAmount)
                    + ".";

        } else {

            status = LoanApplicationStatus.ELIGIBLE;
            eligible = true;

            message =
                    "You are eligible for the requested loan amount of ₹"
                    + String.format("%.0f", request.requestedAmount())
                    + ".";
        }

        // -------------------------
        // Interest rate
        // -------------------------

        double interestRate;

        if (request.cibilScore() >= 800) {

            interestRate = 10.0;

        } else if (request.cibilScore() >= 750) {

            interestRate = 11.0;

        } else if (request.cibilScore() >= 700) {

            interestRate = 12.0;

        } else {

            interestRate = 14.0;
        }

        // -------------------------
        // Save application details
        // -------------------------

        application.setMonthlyIncome(
                request.monthlyIncome()
        );

        application.setRequestedAmount(
                request.requestedAmount()
        );

        application.setCibilScore(
                request.cibilScore()
        );

        application.setExistingDebt(
                request.existingDebt()
        );

        application.setEmployerName(
                request.employerName()
        );

        application.setDesignation(
                request.designation()
        );

        application.setDebtToIncomeRatio(
                dti
        );

        application.setInterestRate(
                interestRate
        );

        application.setStatus(status);

        // IMPORTANT:
        // Only genuinely eligible applications
        // can proceed to EMI selection.

        if (eligible) {

            application.setCurrentStage(
                    ApplicationStage.EMI_SELECTION
            );

        } else {

            // Keep the application at eligibility.
            application.setCurrentStage(
                    ApplicationStage.ELIGIBILITY
            );
        }

        applicationRepository.save(application);

        return new EligibilityResponse(
                application.getId(),
                status.name(),
                dti,
                interestRate,
                eligible
                        ? request.requestedAmount()
                        : maximumEligibleAmount,
                eligible,
                message
        );
    }
}