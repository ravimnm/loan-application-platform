package com.ezfinanz.loan_platform.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private LoanApplication application;

    @Column(nullable = false)
    private String accountHolderName;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String ifsc;

    @Column(nullable = false)
    private String bankName;

    private LocalDateTime createdAt;

    public BankAccount() {
    }

    public BankAccount(
            LoanApplication application,
            String accountHolderName,
            String accountNumber,
            String ifsc,
            String bankName
    ) {
        this.application = application;
        this.accountHolderName = accountHolderName;
        this.accountNumber = accountNumber;
        this.ifsc = ifsc;
        this.bankName = bankName;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public LoanApplication getApplication() {
        return application;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getIfsc() {
        return ifsc;
    }

    public String getBankName() {
        return bankName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}