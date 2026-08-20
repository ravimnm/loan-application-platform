package com.ezfinanz.loan_platform.dto;

import com.ezfinanz.loan_platform.entity.Role;

import java.time.LocalDateTime;

public record AdminResponse(

        Long id,

        String email,

        String phone,

        Role role,

        boolean enabled,

        LocalDateTime createdAt
) {
}