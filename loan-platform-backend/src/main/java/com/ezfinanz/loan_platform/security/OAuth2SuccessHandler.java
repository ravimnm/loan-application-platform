package com.ezfinanz.loan_platform.security;

import com.ezfinanz.loan_platform.entity.Role;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public OAuth2SuccessHandler(
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email =
                oauthUser.getAttribute("email");

        String name =
                oauthUser.getAttribute("name");

        if (email == null || email.isBlank()) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Google account email was not provided"
            );
            return;
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseGet(() -> {

                            User newUser =
                                    new User(
                                            email,
                                            null,
                                            null,
                                            Role.CUSTOMER,
                                            true,
                                            false,
                                            true
                                    );

                            newUser.setFullName(name);

                            return userRepository.save(newUser);
                        });

        // Update Google user's name if available
        if (name != null && !name.isBlank()) {
            user.setFullName(name);
            userRepository.save(user);
        }

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(
                                user.getPassword() == null
                                        ? ""
                                        : user.getPassword()
                        )
                        .roles(user.getRole().name())
                        .build();

        String token =
                jwtService.generateToken(userDetails);

        String redirectUrl =
                frontendUrl +
                "/oauth2/callback" +
                "?token=" + token +
                "&userId=" + user.getId() +
                "&email=" + user.getEmail() +
                "&role=" + user.getRole().name();

        getRedirectStrategy()
                .sendRedirect(
                        request,
                        response,
                        redirectUrl
                );
    }
}
