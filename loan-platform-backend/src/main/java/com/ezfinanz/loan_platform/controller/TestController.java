package com.ezfinanz.loan_platform.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
public class TestController {

    @GetMapping("/hello")
    public String hello(Authentication authentication) {

        return "Hello " + authentication.getName();
    }
}