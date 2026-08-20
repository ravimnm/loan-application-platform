package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.MessageCentralSendResponse;
import com.ezfinanz.loan_platform.dto.MessageCentralTokenResponse;
import com.ezfinanz.loan_platform.dto.MessageCentralValidateResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class SmsService {

    private final RestClient restClient;

    @Value("${messagecentral.customer-id}")
    private String customerId;

    @Value("${messagecentral.email}")
    private String email;

    @Value("${messagecentral.password}")
    private String password;

    public SmsService() {

        this.restClient = RestClient.builder()
                .baseUrl("https://cpaas.messagecentral.com")
                .build();
    }

    /**
     * Generate MessageCentral authentication token.
     */
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

    /**
     * Send OTP through MessageCentral.
     *
     * MessageCentral generates the OTP.
     *
     * @return verificationId
     */
    public String sendOtp(String phoneNumber) {

        String authToken =
                generateAuthToken();

        MessageCentralSendResponse response =
                restClient.post()
                        .uri(uriBuilder -> uriBuilder
                                .path(
                                    "/verification/v3/send"
                                )
                                .queryParam(
                                    "customerId",
                                    customerId
                                )
                                .queryParam(
                                    "countryCode",
                                    "91"
                                )
                                .queryParam(
                                    "otpLength",
                                    6
                                )
                                .queryParam(
                                    "mobileNumber",
                                    phoneNumber
                                )
                                .queryParam(
                                    "flowType",
                                    "SMS"
                                )
                                .build())
                        .header(
                            "authToken",
                            authToken
                        )
                        .retrieve()
                        .body(
                            MessageCentralSendResponse.class
                        );

        if (response == null
                || response.data() == null
                || response.data().verificationId() == null) {

            throw new RuntimeException(
                    "Failed to send MessageCentral OTP"
            );
        }

        return response.data().verificationId();
    }

    /**
     * Verify OTP through MessageCentral.
     */
    public boolean verifyOtp(
            String verificationId,
            String otp
    ) {

        String authToken =
                generateAuthToken();

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
                && "VERIFICATION_COMPLETED"
                    .equals(
                        response.data()
                                .verificationStatus()
                    );
    }
}