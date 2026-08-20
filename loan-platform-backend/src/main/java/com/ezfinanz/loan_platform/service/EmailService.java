package com.ezfinanz.loan_platform.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String recipient, String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom("manemravisankar28@gmail.com");
        message.setTo(recipient);
        message.setSubject(
                "Ezfinanz - Email Verification OTP"
        );

        message.setText(
                "Hello,\n\n" +
                "Your Ezfinanz verification OTP is: " +
                otp +
                "\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "Do not share this OTP with anyone.\n\n" +
                "Regards,\n" +
                "Ezfinanz Team"
        );

        mailSender.send(message);
    }
}