package com.ezfinanz.loan_platform.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "loan_applications")
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double monthlyIncome;

    private Double requestedAmount;

    private Integer cibilScore;

    private Double existingDebt;

    private String employerName;

    private String designation;

    private Double debtToIncomeRatio;

    private Double interestRate;

    private Double processingFee;

    private Double gst;

    private Double emi;

    private Double totalInterest;

    private Double totalRepayment;

    private Double totalCharges;

    private Double netDisbursement;

    private Double irr;

    private Integer tenure;

    private boolean declarationAccepted;

    private LocalDateTime declarationAcceptedAt;

    private String selfiePath;

    private LocalDateTime selfieUploadedAt;

    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanApplicationStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStage currentStage;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public LoanApplication() {
    }

    public LoanApplication(User user) {
        this.user = user;
        this.status = LoanApplicationStatus.DRAFT;
        this.currentStage = ApplicationStage.ELIGIBILITY;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public Double getRequestedAmount() {
        return requestedAmount;
    }

    public Integer getCibilScore() {
        return cibilScore;
    }

    public Double getExistingDebt() {
        return existingDebt;
    }

    public String getEmployerName() {
        return employerName;
    }

    public String getDesignation() {
        return designation;
    }

    public Double getDebtToIncomeRatio() {
        return debtToIncomeRatio;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public Double getProcessingFee() {
        return processingFee;
    }

    public Double getGst() {
        return gst;
    }

    public Double getEmi() {
        return emi;
    }

    public Double getTotalInterest() {
        return totalInterest;
    }

    public Double getTotalRepayment() {
        return totalRepayment;
    }

    public Double getTotalCharges() {
        return totalCharges;
    }

    public Double getNetDisbursement() {
        return netDisbursement;
    }

    public Double getIrr() {
        return irr;
    }

    public Integer getTenure() {
        return tenure;
    }

    public boolean isDeclarationAccepted() {
        return declarationAccepted;
    }

    public LocalDateTime getDeclarationAcceptedAt() {
        return declarationAcceptedAt;
    }

    public String getSelfiePath() {
        return selfiePath;
    }

    public LocalDateTime getSelfieUploadedAt() {
        return selfieUploadedAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public LoanApplicationStatus getStatus() {
        return status;
    }

    public ApplicationStage getCurrentStage() {
        return currentStage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public void setRequestedAmount(Double requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public void setCibilScore(Integer cibilScore) {
        this.cibilScore = cibilScore;
    }

    public void setExistingDebt(Double existingDebt) {
        this.existingDebt = existingDebt;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public void setDebtToIncomeRatio(Double debtToIncomeRatio) {
        this.debtToIncomeRatio = debtToIncomeRatio;
    }

    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }

    public void setProcessingFee(Double processingFee) {
        this.processingFee = processingFee;
    }

    public void setGst(Double gst) {
        this.gst = gst;
    }

    public void setEmi(Double emi) {
        this.emi = emi;
    }

    public void setTotalInterest(Double totalInterest) {
        this.totalInterest = totalInterest;
    }

    public void setTotalRepayment(Double totalRepayment) {
        this.totalRepayment = totalRepayment;
    }

    public void setTotalCharges(Double totalCharges) {
        this.totalCharges = totalCharges;
    }

    public void setNetDisbursement(Double netDisbursement) {
        this.netDisbursement = netDisbursement;
    }

    public void setIrr(Double irr) {
        this.irr = irr;
    }

    public void setTenure(Integer tenure) {
        this.tenure = tenure;
    }

    public void setDeclarationAccepted(boolean declarationAccepted) {
        this.declarationAccepted = declarationAccepted;
    }

    public void setDeclarationAcceptedAt(
            LocalDateTime declarationAcceptedAt
    ) {
        this.declarationAcceptedAt = declarationAcceptedAt;
    }

    public void setSelfiePath(String selfiePath) {
        this.selfiePath = selfiePath;
    }

    public void setSelfieUploadedAt(
            LocalDateTime selfieUploadedAt
    ) {
        this.selfieUploadedAt = selfieUploadedAt;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public void setStatus(LoanApplicationStatus status) {
        this.status = status;
    }

    public void setCurrentStage(ApplicationStage currentStage) {
        this.currentStage = currentStage;
    }
}