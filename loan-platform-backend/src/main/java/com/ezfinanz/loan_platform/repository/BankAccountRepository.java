package com.ezfinanz.loan_platform.repository;

import com.ezfinanz.loan_platform.entity.BankAccount;
import com.ezfinanz.loan_platform.entity.LoanApplication;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankAccountRepository
        extends JpaRepository<BankAccount, Long> {

    boolean existsByApplication(LoanApplication application);

    Optional<BankAccount> findByApplication(
            LoanApplication application
    );
}