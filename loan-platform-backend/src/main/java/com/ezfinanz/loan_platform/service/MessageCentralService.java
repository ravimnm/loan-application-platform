package com.ezfinanz.loan_platform.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.ezfinanz.loan_platform.dto.MessageCentralSendResponse;
import com.ezfinanz.loan_platform.dto.MessageCentralTokenResponse;
import com.ezfinanz.loan_platform.dto.MessageCentralValidateResponse;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class MessageCentralService {

    private final RestClient restClient;

    @Value("${messagecentral.customer-id}")
    private String customerId;

    @Value("${messagecentral.email}")
    private String email;

    @Value("${messagecentral.password}")
    private String password;

    public MessageCentralService() {

        this.restClient = RestClient.builder()
                .baseUrl("https://cpaas.messagecentral.com")
                .build();
    }

    public String generateAuthToken() {

        String encodedPassword =
                Base64.getEncoder()
                        .encodeToString(
                                password.getBytes(
                                        StandardCharsets.UTF_8
                                )
                        );

        MessageCentralTokenResponse response =
                restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path(
                                    "/auth/v1/authentication/token"
                                )
                                .queryParam(
                                    "customerId",
                                    customerId
                                )
                                .queryParam(
                                    "key",
                                    encodedPassword
                                )
                                .queryParam(
                                    "scope",
                                    "NEW"
                                )
                                .queryParam(
                                    "country",
                                    "91"
                                )
                                .queryParam(
                                    "email",
                                    email
                                )
                                .build())
                        .retrieve()
                        .body(
                            MessageCentralTokenResponse.class
                        );

        if (response == null
                || response.token() == null
                || response.token().isBlank()) {

            throw new RuntimeException(
                    "Failed to generate MessageCentral auth token"
            );
        }

        return response.token();
    }
    
    public String sendOtp(String mobileNumber) {

        String authToken = generateAuthToken();

        MessageCentralSendResponse response =
                restClient.post()
                        .uri(uriBuilder -> uriBuilder
                                .path("/verification/v3/send")
                                .queryParam("customerId", customerId)
                                .queryParam("otpLength", 6)
                                .queryParam("mobileNumber", mobileNumber)
                                .queryParam("countryCode", "91")
                                .queryParam("flowType", "SMS")
                                .build())
                        .header("authToken", authToken)
                        .retrieve()
                        .body(MessageCentralSendResponse.class);

        if (response == null
                || response.data() == null
                || response.data().verificationId() == null) {

            throw new RuntimeException(
                    "Failed to send OTP"
            );
        }

        return response.data().verificationId();
    }
    
    public boolean verifyOtp(
            String verificationId,
            String otp
    ) {

        String authToken = generateAuthToken();

        MessageCentralValidateResponse response =
                restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path(
                                    "/verification/v3/validateOtp/"
                                )
                                .queryParam(
                                    "verificationId",
                                    verificationId
                                )
                                .queryParam(
                                    "code",
                                    otp
                                )
                                .build())
                        .header(
                                "authToken",
                                authToken
                        )
                        .retrieve()
                        .body(
                                MessageCentralValidateResponse.class
                        );

        return response != null
                && response.data() != null
                && "VERIFICATION_COMPLETED".equals(
                        response.data()
                                .verificationStatus()
                );
    }
    
}