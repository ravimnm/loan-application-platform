package com.ezfinanz.loan_platform.config;

import com.ezfinanz.loan_platform.security.JwtAuthenticationFilter;
import com.ezfinanz.loan_platform.service.CustomUserDetailsService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService userDetailsService
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> {})

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                    // =========================
                    // PUBLIC
                    // =========================

                    .requestMatchers(
                            "/api/auth/register",
                            "/api/auth/login",
                            "/api/auth/verify-email",
                            "/api/auth/verify-phone"
                    ).permitAll()

                    .requestMatchers(
                            "/api/test/**"
                    ).permitAll()

                    // =========================
                    // SUPER ADMIN ONLY
                    // =========================

                    .requestMatchers(
                            "/api/super-admin/**"
                    ).hasRole("SUPER_ADMIN")

                    // =========================
                    // ADMIN + SUPER ADMIN
                    // =========================

                    .requestMatchers(
                            "/api/admin/**"
                    ).hasAnyRole(
                            "ADMIN"
                    )

                    // =========================
                    // CUSTOMER
                    // =========================

                    .requestMatchers(
                            "/api/customer/**"
                    ).hasRole("CUSTOMER")

                    // =========================
                    // EVERYTHING ELSE
                    // =========================

                    .anyRequest().authenticated()
            )

            .authenticationProvider(
                    authenticationProvider()
            )

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}