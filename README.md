# Ezfinanz — Loan Processing Platform

Ezfinanz is a full-stack digital loan processing platform that manages the complete loan application lifecycle — from customer registration and KYC verification to eligibility evaluation, EMI calculation, bank-account verification, declaration, selfie verification, administrative review, approval, and disbursement.

The project is designed around a role-based workflow with separate capabilities for customers, administrators, and super administrators.

---

## Features

### Customer

- Account registration and email verification
- Secure login using JWT authentication
- Create and manage loan applications
- KYC document submission
- KYC verification workflow
- Financial and employment information submission
- CIBIL-based eligibility evaluation
- Debt-to-income ratio calculation
- Loan amount eligibility calculation
- EMI calculation
- Interest and repayment calculation
- Processing fee and GST calculation
- Bank account submission
- Declaration acceptance
- Selfie submission
- Application status tracking
- Application withdrawal
- View previous applications

### Administrator

- Secure admin authentication
- View customer loan applications
- View complete application details
- Review customer KYC information
- View KYC documents and selfies
- Verify KYC
- Reject KYC with a rejection reason
- Approve loan applications
- Reject loan applications with a reason
- Disburse approved applications
- View application status and workflow stage
- View customer financial and employment information

### Super Administrator

- Secure super-admin authentication
- Create administrator accounts
- Bulk-create administrator accounts
- View administrator accounts
- Enable administrator accounts
- Disable administrator accounts
- Manage the administrative access layer

---

## Application Workflow

```text
Customer Registration
        |
        v
Email Verification
        |
        v
Login
        |
        v
Create Loan Application
        |
        v
KYC Submission
        |
        v
Eligibility Evaluation
        |
        +----------------------+
        |                      |
        v                      v
    Eligible              Not Eligible
        |                      |
        v                      v
   EMI Selection         Application Ends
        |
        v
Bank Account
        |
        v
Declaration
        |
        v
Selfie Verification
        |
        v
Admin Review
        |
        +----------------------+
        |                      |
        v                      v
    Approved               Rejected
        |
        v
Disbursement
        |
        v
    Completed
```

---

## Eligibility Engine

The platform evaluates loan eligibility using multiple financial parameters.

### CIBIL Score

The current eligibility rules require:

```text
CIBIL >= 700
```

Interest rates are assigned according to the customer's CIBIL score:

| CIBIL Score | Interest Rate |
| ----------- | ------------- |
| 800+        | 10%           |
| 750–799     | 11%           |
| 700–749     | 12%           |
| Below 700   | 14%           |

### Minimum Income

```text
Monthly income >= ₹25,000
```

### Debt-to-Income Ratio

The system calculates:

```text
DTI = (Existing Debt / Monthly Income) × 100
```

The normal eligibility threshold is:

```text
DTI <= 50%
```

A weaker financial profile can be partially eligible when:

```text
DTI <= 60%
```

### Loan Amount Eligibility

The maximum full eligibility amount is currently calculated as:

```text
Maximum Eligible Amount = Monthly Income × 20
```

The partial eligibility limit is:

```text
Maximum Partial Amount = Monthly Income × 12
```

The backend returns the eligibility status and the maximum eligible amount when applicable.

Possible results include:

```text
ELIGIBLE
PARTIALLY_ELIGIBLE
NOT_ELIGIBLE
```

---

## EMI Calculation

Once an application passes eligibility, the customer can select:

- Loan amount
- Tenure

The backend calculates:

- Monthly EMI
- Interest rate
- Total interest
- Total repayment
- Processing fee
- GST
- Total charges
- Net disbursement
- Annualized IRR

### EMI Formula

For a non-zero monthly interest rate:

```text
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
```

Where:

```text
P = Principal loan amount
r = Monthly interest rate
n = Number of months
```

The platform currently applies:

```text
Processing Fee = 2% of loan amount

GST = 18% of processing fee
```

---

## Role-Based Access

The application uses three primary roles.

### CUSTOMER

Customers can:

```text
Register
Login
Create applications
Submit KYC
Check eligibility
Calculate EMI
Submit bank details
Accept declarations
Upload selfie
Track applications
Withdraw applications
```

### ADMIN

Administrators can:

```text
View applications
Review applications
Review KYC
Verify KYC
Reject KYC
Approve applications
Reject applications
Disburse loans
```

### SUPER_ADMIN

Super administrators can:

```text
Create administrators
Bulk-create administrators
Enable administrators
Disable administrators
View administrator accounts
```

Administrators and super administrators cannot create customer loan applications.

---

## Architecture

The project follows a layered architecture.

```text
Frontend
   |
   | REST API
   v
Spring Boot Backend
   |
   +-------------------+
   |                   |
   v                   v
Services            Security
   |                   |
   v                   v
Repositories        JWT
   |
   v
PostgreSQL
```

### Backend Layers

```text
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Database
```

Controllers expose REST APIs.

Services contain business logic.

Repositories handle database access.

Entities represent persistent database objects.

DTOs define request and response structures.

---

## Backend Technology

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven
- Jakarta Validation

---

## Frontend Technology

- React
- TypeScript
- React Router
- Axios
- CSS

The frontend communicates with the backend through REST APIs.

---

## Main Backend Components

```text
src/main/java/com/ezfinanz/loan_platform/

├── config/
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── SuperAdminBootstrap.java
│
├── controller/
│   ├── AdminController.java
│   ├── AuthController.java
│   ├── BankAccountController.java
│   ├── DeclarationController.java
│   ├── EligibilityController.java
│   ├── KycController.java
│   ├── LoanApplicationController.java
│   ├── LoanCalculationController.java
│   ├── SelfieController.java
│   └── SuperAdminController.java
│
├── dto/
│   ├── EligibilityRequest.java
│   ├── EligibilityResponse.java
│   ├── LoanCalculationRequest.java
│   ├── LoanCalculationResponse.java
│   └── ...
│
├── entity/
│   ├── LoanApplication.java
│   ├── User.java
│   ├── KycDetails.java
│   ├── BankAccount.java
│   ├── ApplicationStage.java
│   ├── LoanApplicationStatus.java
│   └── Role.java
│
├── repository/
│   ├── LoanApplicationRepository.java
│   ├── UserRepository.java
│   ├── KycDetailsRepository.java
│   └── BankAccountRepository.java
│
├── security/
│   ├── JwtAuthenticationFilter.java
│   └── JwtService.java
│
└── service/
    ├── AuthService.java
    ├── AdminService.java
    ├── EligibilityService.java
    ├── KycService.java
    ├── LoanApplicationService.java
    ├── LoanCalculationService.java
    ├── BankAccountService.java
    ├── DeclarationService.java
    ├── SelfieService.java
    └── SuperAdminService.java
```

---

## Application Stages

The loan application progresses through the following stages:

```text
KYC
ELIGIBILITY
EMI_SELECTION
BANK_ACCOUNT
DECLARATION
SELFIE
ADMIN_REVIEW
DISBURSEMENT
COMPLETED
```

The backend validates the current stage before allowing stage-specific operations.

For example:

```text
Eligibility
    |
    v
EMI_SELECTION
```

A customer cannot directly call the EMI calculation endpoint while the application is still at KYC or eligibility stage.

---

## Application Statuses

The system supports the following statuses:

```text
DRAFT
IN_PROGRESS
ELIGIBLE
PARTIALLY_ELIGIBLE
NOT_ELIGIBLE
SELFIE_PENDING
WAITING_FOR_ADMIN_REVIEW
APPROVED
REJECTED
DISBURSED
WITHDRAWN
```

---

## Security

The backend uses JWT-based authentication.

Authentication flow:

```text
Login
  |
  v
Credentials validated
  |
  v
JWT generated
  |
  v
Frontend stores authentication state
  |
  v
JWT sent with API requests
  |
  v
JwtAuthenticationFilter
  |
  v
Authenticated request
```

Role-based authorization prevents users from accessing endpoints outside their responsibilities.

Examples:

```text
CUSTOMER → Customer APIs
ADMIN → Administrative APIs
SUPER_ADMIN → Super-admin APIs
```

Administrative endpoints are protected using Spring Security authorization.

---

## Database

The main database is PostgreSQL.

Core entities include:

```text
users
loan_applications
kyc_details
bank_accounts
otp_verifications
```

A loan application belongs to a customer:

```text
User
  |
  +---- LoanApplication
             |
             +---- KYC Details
             |
             +---- Bank Account
```

---

## KYC

Customers provide:

- Full name
- Date of birth
- Gender
- Address
- Identification type
- Identification number
- KYC document

Supported identification types include:

```text
PAN
AADHAAR
DRIVING_LICENSE
PASSPORT
VOTER_ID
```

Administrators can:

```text
View KYC
View uploaded document
Verify KYC
Reject KYC
Provide rejection reason
```

---

## Administrative Review

Applications requiring manual review are exposed through the admin dashboard.

Administrators can view:

```text
Application ID
Customer name
Customer email
Phone
Requested amount
Application stage
Application status
Financial information
Employment information
KYC information
KYC document
Selfie
```

The admin can then:

```text
Verify KYC
Reject KYC
Approve application
Reject application
Disburse approved application
```

Rejection reasons are retained with the application.

---

## Performance Testing

The backend was load tested using **k6** with up to **1,000 concurrent virtual users**.

### Load Test Configuration

```text
Maximum VUs: 1000
Test duration: 3 minutes 30 seconds
Tool: k6
```

### Results

```text
Total requests:       62,647
Request rate:         ~298 requests/sec

HTTP failures:        0.00%
Successful checks:    100%

Average latency:      1.85 s
Median latency:       1.70 s
P90 latency:          3.73 s
P95 latency:          4.12 s
Maximum latency:      12.29 s
```

### Important Result

The system successfully handled the load without HTTP failures:

```text
http_req_failed = 0.00%
```

However, the P95 latency was:

```text
4.12 seconds
```

against the configured threshold of:

```text
< 1 second
```

Therefore, the load test demonstrates good request reliability under load, but also identifies **latency and scalability as an area for further optimization**.

---

## Performance Optimization Opportunities

Potential future improvements include:

- Database query optimization
- Connection pool tuning
- Index optimization
- Reducing unnecessary database queries
- Eliminating N+1 queries
- Redis caching
- Asynchronous processing for non-critical operations
- API response optimization
- JVM tuning
- Horizontal scaling
- Load balancing
- Containerized deployment

---

## Running the Backend

### Requirements

Install:

```text
Java 21+
Maven
PostgreSQL
```

### Configure Database

Update:

```text
src/main/resources/application.properties
```

with your PostgreSQL configuration.

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ezfinanz
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### Run

Windows:

```powershell
.\mvnw spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

The backend will start on the configured Spring Boot port.

---

## Running the Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the URL displayed by Vite.

---

## API Structure

The main API groups include:

```text
/api/auth
/api/applications
/api/admin
/api/super-admin
```

### Customer Application APIs

```text
POST   /api/applications
GET    /api/applications
GET    /api/applications/current
GET    /api/applications/{id}

POST   /api/applications/{id}/kyc
POST   /api/applications/{id}/eligibility
POST   /api/applications/{id}/calculate
POST   /api/applications/{id}/bank-account
POST   /api/applications/{id}/declaration
POST   /api/applications/{id}/selfie

POST   /api/applications/{id}/withdraw
```

### Admin APIs

```text
GET    /api/admin/applications
GET    /api/admin/applications/{id}

POST   /api/admin/applications/{id}/approve
POST   /api/admin/applications/{id}/reject
POST   /api/admin/applications/{id}/disburse

GET    /api/admin/applications/{id}/kyc-document
GET    /api/admin/applications/{id}/selfie

POST   /api/admin/applications/{id}/kyc/verify
POST   /api/admin/applications/{id}/kyc/reject
```

### Super Admin APIs

```text
GET    /api/super-admin/admins
POST   /api/super-admin/admins
POST   /api/super-admin/admins/bulk

POST   /api/super-admin/admins/{id}/enable
POST   /api/super-admin/admins/{id}/disable
```

---

## Error Handling

The frontend provides user-facing error messages for common API failures including:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

The backend also validates:

- Request parameters
- Application ownership
- Application stage
- User roles
- Loan amounts
- Loan tenure
- Eligibility criteria

---

## Project Structure

```text
loan-platform/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ezfinanz/loan_platform/
│   │   └── resources/
│   │
│   └── test/
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── styles/
│       ├── types/
│       └── utils/
│
├── uploads/
├── admin-load-test.js
├── concurrent-approve-test.js
├── user-load-test.js
├── pom.xml
└── README.md
```

---

## Testing

The project includes load-testing scripts using k6.

Example:

```powershell
k6 run .\admin-load-test.js
```

Other available tests include:

```text
admin-load-test.js
concurrent-approve-test.js
user-load-test.js
```

---

## Current Limitations

The current implementation is primarily a functional loan-processing platform.

Potential future improvements include:

- Production-grade observability
- Distributed caching
- Background job processing
- Advanced fraud detection
- Automated KYC verification
- Credit bureau integration
- Document OCR
- Notification service
- Audit logging
- Rate limiting
- API versioning
- Containerized deployment
- CI/CD pipeline
- Cloud deployment
- Automated integration and end-to-end tests

---

## Future Roadmap

### Phase 1 — Core Platform

- [x] Authentication
- [x] Role-based authorization
- [x] Customer registration
- [x] Loan application workflow
- [x] KYC submission
- [x] Eligibility evaluation
- [x] EMI calculation
- [x] Bank account submission
- [x] Declaration
- [x] Selfie verification
- [x] Admin review
- [x] Loan approval
- [x] Loan disbursement

### Phase 2 — Platform Hardening

- [x] Application-stage validation
- [x] Admin KYC rejection reasons
- [x] Admin account management
- [x] Load testing
- [x] Customer/admin role isolation
- [ ] Advanced audit logging
- [ ] Rate limiting
- [ ] Improved database indexing
- [ ] Performance optimization

### Phase 3 — Production Improvements

- [ ] Docker deployment
- [ ] CI/CD
- [ ] Redis caching
- [ ] Monitoring
- [ ] Distributed tracing
- [ ] Cloud deployment
- [ ] Automated integration tests
- [ ] Automated end-to-end tests

---

## License

This project is intended for educational, portfolio, and demonstration purposes.
