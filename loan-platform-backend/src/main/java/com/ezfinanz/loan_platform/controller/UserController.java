package com.ezfinanz.loan_platform.controller;

import com.ezfinanz.loan_platform.dto.UserProfileResponse;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(
            Authentication authentication
    ) {

        User user =
                userRepository
                        .findByEmail(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        UserProfileResponse response =
                new UserProfileResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole(),
                        user.isEmailVerified(),
                        user.isPhoneVerified(),
                        user.getCreatedAt()
                );

        return ResponseEntity.ok(response);
    }
}