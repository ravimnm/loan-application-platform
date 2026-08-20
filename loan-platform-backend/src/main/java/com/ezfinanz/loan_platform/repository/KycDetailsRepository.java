package com.ezfinanz.loan_platform.repository;

import com.ezfinanz.loan_platform.entity.KycDetails;
import com.ezfinanz.loan_platform.entity.LoanApplication;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KycDetailsRepository
        extends JpaRepository<KycDetails, Long> {

    boolean existsByApplication(LoanApplication application);

    Optional<KycDetails> findByApplication(
            LoanApplication application
    );
}