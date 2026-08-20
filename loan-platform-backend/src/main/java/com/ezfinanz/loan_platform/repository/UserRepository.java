package com.ezfinanz.loan_platform.repository;

import com.ezfinanz.loan_platform.entity.Role;
import com.ezfinanz.loan_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
    List<User> findByRole(Role role);
    Optional<User> findByIdAndRole(
            Long id,
            Role role
    );
}