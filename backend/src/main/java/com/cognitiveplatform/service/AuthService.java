package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.entity.*;
import com.cognitiveplatform.exception.BadRequestException;
import com.cognitiveplatform.exception.ConflictException;
import com.cognitiveplatform.mapper.UserMapper;
import com.cognitiveplatform.repository.ConsentRecordRepository;
import com.cognitiveplatform.repository.PatientLinkCodeRepository;
import com.cognitiveplatform.repository.PlayerProfileRepository;
import com.cognitiveplatform.repository.UserRepository;
import com.cognitiveplatform.security.JwtTokenProvider;
import com.cognitiveplatform.security.PasswordHasher;
import com.cognitiveplatform.security.TokenBlacklistService;
import com.cognitiveplatform.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    // Dummy BCrypt hash to ensure constant-time response for non-existent users
    private static final String DUMMY_HASH = "$2b$10$2yYthVClfRr2xq3qOAqaseSOJVxose2KLEe4xMe9eCYY/dpnMb3yW";

    private final UserRepository userRepository;
    private final PlayerProfileRepository playerProfileRepository;
    private final ConsentRecordRepository consentRecordRepository;
    private final PatientLinkCodeRepository patientLinkCodeRepository;
    private final PasswordHasher passwordHasher;
    private final JwtTokenProvider tokenProvider;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserMapper userMapper;

    @Value("${app.registration.enabled:true}")
    private boolean registrationEnabled;

    public AuthService(UserRepository userRepository,
                       PlayerProfileRepository playerProfileRepository,
                       ConsentRecordRepository consentRecordRepository,
                       PatientLinkCodeRepository patientLinkCodeRepository,
                       PasswordHasher passwordHasher,
                       JwtTokenProvider tokenProvider,
                       TokenBlacklistService tokenBlacklistService,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.playerProfileRepository = playerProfileRepository;
        this.consentRecordRepository = consentRecordRepository;
        this.patientLinkCodeRepository = patientLinkCodeRepository;
        this.passwordHasher = passwordHasher;
        this.tokenProvider = tokenProvider;
        this.tokenBlacklistService = tokenBlacklistService;
        this.userMapper = userMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!registrationEnabled) {
            throw new BadRequestException("New user registration is currently disabled by administrator");
        }

        String rawUsername = request.getUsername() != null ? request.getUsername().trim() : "";
        String normalizedUsername = rawUsername.toLowerCase();

        String rawEmail = request.getEmail() != null ? request.getEmail().trim() : "";
        String normalizedEmail = rawEmail.toLowerCase();

        // 1. Pre-validation checks
        if (normalizedUsername.isBlank()) {
            throw new BadRequestException("Username cannot be empty");
        }
        if (normalizedEmail.isBlank()) {
            throw new BadRequestException("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password cannot be empty");
        }
        if (request.getPassword().length() > 128) {
            throw new BadRequestException("Password cannot exceed 128 characters");
        }

        if (userRepository.existsByUsernameNormalized(normalizedUsername)) {
            throw new ConflictException("That username is already taken");
        }
        if (userRepository.existsByEmailNormalized(normalizedEmail)) {
            throw new ConflictException("That email is already registered");
        }

        String name = (request.getName() != null && !request.getName().isBlank())
                ? request.getName().trim() : rawUsername;

        User user = new User(
                name,
                rawUsername,
                rawEmail,
                passwordHasher.hash(request.getPassword()),
                Role.CAREGIVER
        );

        try {
            User savedUser = userRepository.saveAndFlush(user);

            // Atomically create PlayerProfile and ConsentRecord if patientName provided
            if (request.getPatientName() != null && !request.getPatientName().isBlank()) {
                PlayerProfile profile = new PlayerProfile();
                profile.setCaregiverId(savedUser.getId());
                profile.setPreferredName(request.getPatientName().trim());
                profile.setLanguage(request.getPatientLanguage() != null && !request.getPatientLanguage().isBlank()
                        ? request.getPatientLanguage().trim().toLowerCase() : "en");
                profile.setTextSize("LARGE");
                profile.setAudioEnabled(true);
                profile.setDifficultyMode(DifficultyMode.AUTO);
                PlayerProfile savedProfile = playerProfileRepository.saveAndFlush(profile);

                ConsentRecord consent = new ConsentRecord();
                consent.setCaregiverId(savedUser.getId());
                consent.setPlayerId(savedProfile.getId());
                consent.setConsentType("PROFILE_SETUP");
                consent.setStatus(ConsentStatus.GRANTED);
                consentRecordRepository.saveAndFlush(consent);
            }

            UserPrincipal principal = UserPrincipal.create(savedUser);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    principal, null, principal.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            UserDto userDto = userMapper.toDto(savedUser);
            return new AuthResponse(jwt, userDto);

        } catch (DataIntegrityViolationException ex) {
            log.warn("Database unique constraint violation on registration for username='{}' / email='{}': {}",
                    normalizedUsername, normalizedEmail, ex.getMessage());
            String msg = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
            if (msg.contains("username") || msg.contains("uk_users_username")) {
                throw new ConflictException("That username is already taken");
            } else if (msg.contains("email") || msg.contains("uk_users_email")) {
                throw new ConflictException("That email is already registered");
            } else {
                throw new ConflictException("An account with those details already exists");
            }
        }
    }

    @Transactional
    public AuthResponse registerPatient(PatientRegisterRequest request) {
        if (!registrationEnabled) {
            throw new BadRequestException("New user registration is currently disabled by administrator");
        }

        String rawUsername = request.getUsername() != null ? request.getUsername().trim() : "";
        String normalizedUsername = rawUsername.toLowerCase();

        String rawEmail = request.getEmail() != null ? request.getEmail().trim() : null;
        String normalizedEmail = (rawEmail != null && !rawEmail.isBlank()) ? rawEmail.toLowerCase() : null;

        String rawCode = request.getLinkCode() != null ? request.getLinkCode().trim().toUpperCase() : "";

        // 1. Validation checks
        if (normalizedUsername.isBlank()) {
            throw new BadRequestException("Username cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password cannot be empty");
        }
        if (request.getPassword().length() > 128) {
            throw new BadRequestException("Password cannot exceed 128 characters");
        }
        if (rawCode.isBlank()) {
            throw new BadRequestException("This code didn't work. Please ask your caregiver for a new one.");
        }

        // 2. Validate Link Code
        PatientLinkCode linkCode = patientLinkCodeRepository.findByCode(rawCode)
                .orElseThrow(() -> new BadRequestException("This code didn't work. Please ask your caregiver for a new one."));

        if (linkCode.isUsed() || linkCode.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("This code didn't work. Please ask your caregiver for a new one.");
        }

        // 3. Ensure profile doesn't already have a patient login
        if (userRepository.existsByPlayerProfileId(linkCode.getPlayerProfileId())) {
            throw new BadRequestException("A patient login has already been set up for this profile. Please ask your caregiver for assistance.");
        }

        // 4. Check uniqueness
        if (userRepository.existsByUsernameNormalized(normalizedUsername)) {
            throw new ConflictException("That username is already taken");
        }
        if (normalizedEmail != null && userRepository.existsByEmailNormalized(normalizedEmail)) {
            throw new ConflictException("That email is already registered");
        }

        String displayName = (request.getName() != null && !request.getName().isBlank())
                ? request.getName().trim() : rawUsername;

        User patientUser = new User(
                displayName,
                rawUsername,
                rawEmail,
                passwordHasher.hash(request.getPassword()),
                Role.PATIENT,
                linkCode.getPlayerProfileId()
        );

        try {
            User savedPatient = userRepository.saveAndFlush(patientUser);
            linkCode.setUsed(true);
            patientLinkCodeRepository.saveAndFlush(linkCode);

            UserPrincipal principal = UserPrincipal.create(savedPatient);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    principal, null, principal.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            UserDto userDto = userMapper.toDto(savedPatient);
            return new AuthResponse(jwt, userDto);

        } catch (DataIntegrityViolationException ex) {
            log.warn("Database unique constraint violation on patient registration: {}", ex.getMessage());
            String msg = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
            if (msg.contains("username") || msg.contains("uk_users_username")) {
                throw new ConflictException("That username is already taken");
            } else if (msg.contains("email") || msg.contains("uk_users_email")) {
                throw new ConflictException("That email is already registered");
            } else if (msg.contains("player_profile")) {
                throw new ConflictException("A patient login already exists for this profile");
            } else {
                throw new ConflictException("An account with those details already exists");
            }
        }
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier() != null ? request.getIdentifier().trim() : "";
        String normalizedIdentifier = identifier.toLowerCase();
        String rawPassword = request.getPassword() != null ? request.getPassword() : "";

        if (normalizedIdentifier.isBlank() || rawPassword.isBlank()) {
            passwordHasher.matches("dummy", DUMMY_HASH);
            throw new BadRequestException("The details you entered don't match. Please try again.");
        }

        Optional<User> userOpt = userRepository.findByIdentifier(normalizedIdentifier);

        // Constant-time check for unknown user
        if (userOpt.isEmpty()) {
            passwordHasher.matches(rawPassword, DUMMY_HASH);
            throw new BadRequestException("The details you entered don't match. Please try again.");
        }

        User user = userOpt.get();

        // Verify password
        if (!passwordHasher.matches(rawPassword, user.getPasswordHash())) {
            throw new BadRequestException("The details you entered don't match. Please try again.");
        }

        // Check if account enabled
        if (!user.isEnabled()) {
            throw new BadRequestException("This account is currently paused. Please ask your caregiver for assistance.");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        UserDto userDto = userMapper.toDto(user);
        return new AuthResponse(jwt, userDto);
    }

    public void logout(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            try {
                Date expiration = tokenProvider.getExpirationDateFromJWT(token);
                tokenBlacklistService.revokeToken(token, expiration.getTime());
            } catch (Exception e) {
                log.warn("Could not parse token expiration for revocation: {}", e.getMessage());
            }
        }
        SecurityContextHolder.clearContext();
    }
}
