package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.BankAccountRequest;
import com.ezfinanz.loan_platform.entity.*;
import com.ezfinanz.loan_platform.repository.BankAccountRepository;
import com.ezfinanz.loan_platform.repository.LoanApplicationRepository;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class BankAccountService {

    private final BankAccountRepository bankRepository;
    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public BankAccountService(
            BankAccountRepository bankRepository,
            LoanApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.bankRepository = bankRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public BankAccount submitBankAccount(
            Long applicationId,
            String email,
            BankAccountRequest request
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
                != ApplicationStage.BANK_ACCOUNT) {

            throw new RuntimeException(
                    "Application is not currently at bank account stage"
            );
        }

        if (bankRepository.existsByApplication(application)) {

            throw new RuntimeException(
                    "Bank account already submitted"
            );
        }

        BankAccount account =
                new BankAccount(
                        application,
                        request.accountHolderName(),
                        request.accountNumber(),
                        request.ifsc(),
                        request.bankName()
                );

        BankAccount saved =
                bankRepository.save(account);

        application.setCurrentStage(
                ApplicationStage.DECLARATION
        );

        applicationRepository.save(application);

        return saved;
    }
}