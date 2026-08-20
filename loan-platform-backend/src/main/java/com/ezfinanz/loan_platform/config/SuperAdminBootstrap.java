package com.ezfinanz.loan_platform.config;

import com.ezfinanz.loan_platform.entity.Role;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SuperAdminBootstrap
        implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${superadmin.email}")
    private String email;

    @Value("${superadmin.password}")
    private String password;

    public SuperAdminBootstrap(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.existsByEmail(email)) {

            System.out.println(
                    "Super Admin already exists: "
                            + email
            );

            return;
        }

        User superAdmin =
                new User(
                        email,
                        "9999999999",
                        passwordEncoder.encode(password),
                        Role.SUPER_ADMIN,
                        true,
                        true,
                        true
                );

        userRepository.save(superAdmin);

        System.out.println(
                "===================================="
        );

        System.out.println(
                "SUPER ADMIN CREATED"
        );

        System.out.println(
                "Email: " + email
        );

        System.out.println(
                "===================================="
        );
    }
}