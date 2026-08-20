package com.ezfinanz.loan_platform.repository;

import com.ezfinanz.loan_platform.entity.LoanApplication;
import com.ezfinanz.loan_platform.entity.LoanApplicationStatus;
import com.ezfinanz.loan_platform.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface LoanApplicationRepository
        extends JpaRepository<LoanApplication, Long> {

    List<LoanApplication> findByUserOrderByCreatedAtDesc(
            User user
    );

    boolean existsByUserAndStatusIn(
            User user,
            Collection<LoanApplicationStatus> statuses
    );

    Optional<LoanApplication>
    findFirstByUserAndStatusInOrderByCreatedAtDesc(
            User user,
            Collection<LoanApplicationStatus> statuses
    );
}