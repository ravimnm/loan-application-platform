package com.ezfinanz.loan_platform.service;

import com.ezfinanz.loan_platform.dto.AuthResponse;
import com.ezfinanz.loan_platform.dto.LoginRequest;
import com.ezfinanz.loan_platform.dto.RegisterRequest;
import com.ezfinanz.loan_platform.dto.RegistrationResponse;
import com.ezfinanz.loan_platform.entity.OtpVerification;
import com.ezfinanz.loan_platform.entity.Role;
import com.ezfinanz.loan_platform.entity.User;
import com.ezfinanz.loan_platform.entity.VerificationType;
import com.ezfinanz.loan_platform.repository.OtpVerificationRepository;
import com.ezfinanz.loan_platform.repository.UserRepository;
import com.ezfinanz.loan_platform.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final CustomUserDetailsService userDetailsService;
	private final JwtService jwtService;
	private final OtpVerificationRepository otpRepository;
	private final EmailService emailService;
	private final MessageCentralService messageCentralService;
	
	public AuthService(
	        UserRepository userRepository,
	        PasswordEncoder passwordEncoder,
	        AuthenticationManager authenticationManager,
	        CustomUserDetailsService userDetailsService,
	        JwtService jwtService,
	        OtpVerificationRepository otpRepository,
	        EmailService emailService,
	        MessageCentralService messageCentralService
	) {
	    this.userRepository = userRepository;
	    this.passwordEncoder = passwordEncoder;
	    this.authenticationManager = authenticationManager;
	    this.userDetailsService = userDetailsService;
	    this.jwtService = jwtService;
	    this.otpRepository = otpRepository;
	    this.emailService = emailService;
	    this.messageCentralService = messageCentralService;
	}

	public RegistrationResponse register(RegisterRequest request) {

		System.out.println(
		    "REGISTER EMAIL RECEIVED: [" + request.email() + "]"
		);
		
		System.out.println(
		    "EMAIL EXISTS: " +
		    userRepository.existsByEmail(request.email())
		);

	    if (userRepository.existsByEmail(request.email())) {
	        throw new RuntimeException(
	                "Email already registered"
	        );
	    }

	    if (userRepository.existsByPhone(request.phone())) {
	        throw new RuntimeException(
	                "Phone already registered"
	        );
	    }

	    // =========================
	    // CREATE USER
	    // =========================

	    User user =
	            new User(
	                    request.email(),
	                    request.phone(),
	                    passwordEncoder.encode(
	                            request.password()
	                    ),
	                    Role.CUSTOMER,
	                    false,
	                    false,true
	            );

	    userRepository.save(user);

	    // =========================
	    // EMAIL OTP
	    // =========================

	    String emailOtp =
	            generateOtp();

	    OtpVerification emailVerification =
	            new OtpVerification(
	                    user,
	                    VerificationType.EMAIL,
	                    emailOtp,
	                    LocalDateTime.now()
	                            .plusMinutes(5)
	            );

	    otpRepository.save(emailVerification);
		
				
		System.out.println("========================================");
		System.out.println("EMAIL OTP");
		System.out.println("Email: " + user.getEmail());
		System.out.println("OTP: " + emailOtp);
		System.out.println("Expires in: 5 minutes");
		System.out.println("========================================");

	    // emailService.sendOtp(
	    //         user.getEmail(),
	    //         emailOtp
	    // );

	    // =========================
	    // PHONE OTP -- Temporarily Disabled
	    // =========================

//	    String verificationId =
//	            messageCentralService.sendOtp(
//	                    user.getPhone()
//	            );
//
//	    OtpVerification phoneVerification =
//	            new OtpVerification(
//	                    user,
//	                    VerificationType.PHONE,
//	                    "PROVIDER_MANAGED",
//	                    LocalDateTime.now()
//	                            .plusMinutes(5)
//	            );
//
//	    phoneVerification.setProviderVerificationId(
//	            verificationId
//	    );
//
//	    otpRepository.save(phoneVerification);

	    
	    String phoneOtp = generateOtp();

	    OtpVerification phoneVerification =
	            new OtpVerification(
	                    user,
	                    VerificationType.PHONE,
	                    phoneOtp,
	                    LocalDateTime.now().plusMinutes(5)
	            );

	    otpRepository.save(phoneVerification);

	    System.out.println("========================================");
	    System.out.println("PHONE OTP");
	    System.out.println("Phone: " + user.getPhone());
	    System.out.println("OTP: " + phoneOtp);
	    System.out.println("Expires in: 5 minutes");
	    System.out.println("========================================");
	    
	    // =========================
	    // RETURN REGISTRATION RESULT
	    // =========================

	    return new RegistrationResponse(
	            user.getId(),
	            user.getEmail(),
	            user.getPhone(),
	            "Registration successful. Please verify your email and phone."
	    );
	}
	
	public AuthResponse getCurrentUser(String email) {

	    User user =
	            userRepository
	                    .findByEmail(email)
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "User not found"
	                            )
	                    );

	    return new AuthResponse(
	            null,
	            user.getId(),
	            user.getEmail(),
	            user.getRole().name()
	    );
	}

	public AuthResponse login(LoginRequest request) {

	    authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(
	                    request.email(),
	                    request.password()
	            )
	    );

	    User user =
	            userRepository
	                    .findByEmail(request.email())
	                    .orElseThrow();

//	    if (!user.isEmailVerified()
//	            || !user.isPhoneVerified()) {
//
//	        throw new RuntimeException(
//	                "Please verify your email and phone before logging in"
//	        );
//	    }
	    

	    UserDetails userDetails =
	            userDetailsService
	                    .loadUserByUsername(
	                            user.getEmail()
	                    );

	    String token =
	            jwtService.generateToken(
	                    userDetails
	            );

	    return new AuthResponse(
	            token,
	            user.getId(),
	            user.getEmail(),
	            user.getRole().name()
	    );
	}
	
	public String resendEmailOtp(String email) {

	    User user =
	            userRepository
	                    .findByEmail(email)
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "User not found"
	                            )
	                    );

	    if (user.isEmailVerified()) {

	        throw new RuntimeException(
	                "Email is already verified"
	        );
	    }

	    String emailOtp = generateOtp();

	    OtpVerification emailVerification =
	            new OtpVerification(
	                    user,
	                    VerificationType.EMAIL,
	                    emailOtp,
	                    LocalDateTime.now()
	                            .plusMinutes(5)
	            );

	    otpRepository.save(emailVerification);
		
		System.out.println("========================================");
		System.out.println("EMAIL OTP RESENT");
		System.out.println("Email: " + user.getEmail());
		System.out.println("OTP: " + emailOtp);
		System.out.println("Expires in: 5 minutes");
		System.out.println("========================================");
				
	    // emailService.sendOtp(
	    //         user.getEmail(),
	    //         emailOtp
	    // );

	    return "A new verification OTP has been sent to your email";
	}
	
	public String verifyOtp(
	        String email,
	        VerificationType type,
	        String otp
	) {

	    User user =
	            userRepository
	                    .findByEmail(email)
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "User not found"
	                            )
	                    );

	    OtpVerification verification =
	            otpRepository
	                    .findTopByUserAndTypeOrderByIdDesc(
	                            user,
	                            type
	                    )
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "OTP not found"
	                            )
	                    );

	    if (verification.isVerified()) {
	        throw new RuntimeException(
	                "OTP already verified"
	        );
	    }

	    if (verification.getExpiresAt()
	            .isBefore(LocalDateTime.now())) {

	        throw new RuntimeException(
	                "OTP expired"
	        );
	    }

	    // =========================
	    // EMAIL
	    // =========================

	    if (type == VerificationType.EMAIL) {

	        if (!verification
	                .getOtp()
	                .equals(otp)) {

	            throw new RuntimeException(
	                    "Invalid email OTP"
	            );
	        }
	    }

	    // =========================
	    // PHONE
	    // =========================

//	    else {
//
//	        String verificationId =
//	                verification
//	                        .getProviderVerificationId();
//
//	        if (verificationId == null) {
//
//	            throw new RuntimeException(
//	                    "Phone verification ID not found"
//	            );
//	        }
//
//	        boolean valid =
//	        		messageCentralService.verifyOtp(
//	                        verificationId,
//	                        otp
//	                );
//
//	        if (!valid) {
//
//	            throw new RuntimeException(
//	                    "Invalid phone OTP"
//	            );
//	        }
//	    }
	    
	 // =========================
	 // PHONE
	 // =========================

	 else {

	     if (!verification
	             .getOtp()
	             .equals(otp)) {

	         throw new RuntimeException(
	                 "Invalid phone OTP"
	         );
	     }
	 }

	    // =========================
	    // MARK VERIFIED
	    // =========================

	    verification.setVerified(true);

	    otpRepository.save(
	            verification
	    );

	    if (type == VerificationType.EMAIL) {

	        user.setEmailVerified(true);

	    } else {

	        user.setPhoneVerified(true);
	    }

	    userRepository.save(user);

	    return type +
	            " verification successful";
	}
	
	public String resendPhoneOtp(String email) {

	    User user =
	            userRepository
	                    .findByEmail(email)
	                    .orElseThrow(() ->
	                            new RuntimeException(
	                                    "User not found"
	                            )
	                    );

	    if (user.isPhoneVerified()) {
	        throw new RuntimeException(
	                "Phone is already verified"
	        );
	    }

	    String phoneOtp = generateOtp();

	    OtpVerification phoneVerification =
	            new OtpVerification(
	                    user,
	                    VerificationType.PHONE,
	                    phoneOtp,
	                    LocalDateTime.now().plusMinutes(5)
	            );

	    otpRepository.save(phoneVerification);

	    // Development-only OTP output
	    System.out.println("========================================");
	    System.out.println("PHONE OTP RESENT");
	    System.out.println("Phone: " + user.getPhone());
	    System.out.println("OTP: " + phoneOtp);
	    System.out.println("Expires in: 5 minutes");
	    System.out.println("========================================");

	    return "A new verification OTP has been generated for your phone";
	}
	
	private String generateOtp() {

	    Random random = new Random();

	    return String.format(
	            "%06d",
	            random.nextInt(1_000_000)
	    );
	}
}
