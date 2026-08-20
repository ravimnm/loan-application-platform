package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.AdminCreateRequest;
import com.ezfinanz.loan_platform.dto.AdminResponse;
import com.ezfinanz.loan_platform.entity.Role;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SuperAdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SuperAdminService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // CREATE ADMIN
    // =========================

    public AdminResponse createAdmin(
            AdminCreateRequest request
    ) {

        if (userRepository.existsByEmail(
                request.email()
        )) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        if (userRepository.existsByPhone(
                request.phone()
        )) {

            throw new RuntimeException(
                    "Phone already registered"
            );
        }

        User admin =
                new User(
                        request.email(),
                        request.phone(),
                        passwordEncoder.encode(
                                request.password()
                        ),
                        Role.ADMIN,
                        true,
                        true,
                        true
                );

        User saved =
                userRepository.save(admin);

        return toResponse(saved);
    }

    // =========================
    // LIST ADMINS
    // =========================

    public List<AdminResponse> getAdmins() {

        return userRepository
                .findByRole(Role.ADMIN)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // DISABLE ADMIN
    // =========================

    public AdminResponse disableAdmin(
            Long id
    ) {

        User admin =
                getAdmin(id);

        admin.setEnabled(false);

        return toResponse(
                userRepository.save(admin)
        );
    }

    // =========================
    // ENABLE ADMIN
    // =========================

    public AdminResponse enableAdmin(
            Long id
    ) {

        User admin =
                getAdmin(id);

        admin.setEnabled(true);

        return toResponse(
                userRepository.save(admin)
        );
    }

    // =========================
    // FIND ADMIN
    // =========================

    private User getAdmin(Long id) {

        return userRepository
                .findByIdAndRole(
                        id,
                        Role.ADMIN
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Admin not found"
                        )
                );
    }
    
    @Transactional
    public List<AdminResponse> createAdmins(
            List<AdminCreateRequest> requests
    ) {

        return requests.stream()
                .map(this::createAdmin)
                .toList();
    }

    // =========================
    // DTO MAPPING
    // =========================

    private AdminResponse toResponse(
            User user
    ) {

        return new AdminResponse(
                user.getId(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}