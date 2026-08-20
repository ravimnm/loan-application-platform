package com.ezfinanz.loan_platform.repository;

import com.ezfinanz.loan_platform.entity.*;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification>
    findTopByUserAndTypeOrderByIdDesc(
            User user,
            VerificationType type
    );
}