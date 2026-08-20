package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.LoanCalculationRequest;
import com.ezfinanz.loan_platform.dto.LoanCalculationResponse;
import com.ezfinanz.loan_platform.entity.ApplicationStage;
import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.entity.LoanApplicationStatus;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.repository.LoanApplicationRepository;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoanCalculationService {

    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public LoanCalculationService(
            LoanApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LoanCalculationResponse calculate(
            Long applicationId,
            String email,
            LoanCalculationRequest request
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
                != ApplicationStage.EMI_SELECTION) {

            throw new RuntimeException(
                    "Application is not currently at EMI selection stage"
            );
        }

        // -------------------------
        // Loan amount validation
        // -------------------------

        if (application.getStatus()
                != LoanApplicationStatus.ELIGIBLE) {

            throw new RuntimeException(
                    "Loan application is not eligible for EMI calculation"
            );
        }

        if (request.loanAmount()
                > application.getRequestedAmount()) {

            throw new RuntimeException(
                    "Loan amount exceeds requested amount"
            );
        }

        // -------------------------
        // Interest rate
        // -------------------------

        double annualRate =
                application.getInterestRate();

        // Monthly interest rate
        double monthlyRate =
                annualRate / 12.0 / 100.0;

        int months =
                request.tenureMonths();

        double principal =
                request.loanAmount();

        // -------------------------
        // EMI
        // -------------------------

        double emi;

        if (monthlyRate == 0) {

            emi = principal / months;

        } else {

            double factor =
                    Math.pow(
                            1 + monthlyRate,
                            months
                    );

            emi =
                    principal
                    * monthlyRate
                    * factor
                    / (factor - 1);
        }

        emi = round(emi);

        // -------------------------
        // Total repayment
        // -------------------------

        double totalRepayment =
                emi * months;

        totalRepayment =
                round(totalRepayment);

        // -------------------------
        // Total interest
        // -------------------------

        double totalInterest =
                totalRepayment - principal;

        totalInterest =
                round(totalInterest);

        // -------------------------
        // Processing fee
        // 2% of loan amount
        // -------------------------

        double processingFee =
                principal * 0.02;

        processingFee =
                round(processingFee);

        // -------------------------
        // GST
        // 18% of processing fee
        // -------------------------

        double gst =
                processingFee * 0.18;

        gst =
                round(gst);

        // -------------------------
        // Total charges
        // -------------------------

        double totalCharges =
                processingFee + gst;

        totalCharges =
                round(totalCharges);

        // -------------------------
        // Net disbursement
        // -------------------------

        double netDisbursement =
                principal - totalCharges;

        netDisbursement =
                round(netDisbursement);

        // -------------------------
        // IRR
        // -------------------------

        double irr =
                calculateAnnualIrr(
                        netDisbursement,
                        emi,
                        months
                );

        // -------------------------
        // Save
        // -------------------------

        application.setRequestedAmount(
                principal
        );

        application.setTenure(
                months
        );

        application.setEmi(
                emi
        );

        application.setTotalInterest(
                totalInterest
        );

        application.setTotalRepayment(
                totalRepayment
        );

        application.setProcessingFee(
                processingFee
        );

        application.setGst(
                gst
        );

        application.setTotalCharges(
                totalCharges
        );

        application.setNetDisbursement(
                netDisbursement
        );

        application.setIrr(
                irr
        );

        application.setCurrentStage(
                ApplicationStage.BANK_ACCOUNT
        );

        applicationRepository.save(application);

        return new LoanCalculationResponse(
                application.getId(),
                principal,
                months,
                annualRate,
                emi,
                totalInterest,
                totalRepayment,
                processingFee,
                gst,
                totalCharges,
                netDisbursement,
                irr
        );
    }

    private double calculateAnnualIrr(
            double netDisbursement,
            double emi,
            int months
    ) {

        double low = 0.0;
        double high = 1.0;

        // Binary search for monthly IRR
        for (int i = 0; i < 100; i++) {

            double monthlyRate =
                    (low + high) / 2.0;

            double npv = 0.0;

            for (int month = 1;
                 month <= months;
                 month++) {

                npv +=
                        emi /
                        Math.pow(
                                1 + monthlyRate,
                                month
                        );
            }

            if (npv > netDisbursement) {

                low = monthlyRate;

            } else {

                high = monthlyRate;
            }
        }

        double monthlyIrr =
                (low + high) / 2.0;

        double annualIrr =
                Math.pow(
                        1 + monthlyIrr,
                        12
                ) - 1;

        return round(annualIrr * 100);
    }

    private double round(double value) {

        return Math.round(value * 100.0) / 100.0;
    }
}