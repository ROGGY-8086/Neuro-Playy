package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.entity.ConsentStatus;
import com.cognitiveplatform.entity.Role;
import com.cognitiveplatform.entity.User;
import com.cognitiveplatform.repository.ConsentRecordRepository;
import com.cognitiveplatform.repository.PatientLinkCodeRepository;
import com.cognitiveplatform.repository.PlayerProfileRepository;
import com.cognitiveplatform.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class PatientAndCaregiverAuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlayerProfileRepository profileRepository;

    @Autowired
    private ConsentRecordRepository consentRepository;

    @Autowired
    private PatientLinkCodeRepository linkCodeRepository;

    @Test
    @DisplayName("Caregiver signup creates caregiver user, patient profile, and consent record in one atomic transaction")
    void testCaregiverSignupWithPatientProfile() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("Dr. Marcus Higgins");
        req.setUsername("marcus_care");
        req.setEmail("marcus@memorycare.org");
        req.setPassword("PeacefulP@ssword2026");
        req.setPatientName("Robert Higgins");
        req.setPatientLanguage("en");
        req.setConsentAuthorized(true);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.username").value("marcus_care"))
                .andExpect(jsonPath("$.user.role").value("CAREGIVER"))
                .andReturn();

        // Verify caregiver user created with password hashed
        Optional<User> userOpt = userRepository.findByUsernameNormalized("marcus_care");
        assertTrue(userOpt.isPresent());
        User caregiver = userOpt.get();
        assertNotEquals("PeacefulP@ssword2026", caregiver.getPasswordHash());
        assertTrue(caregiver.getPasswordHash().startsWith("$2"));

        // Verify patient profile created with preferredName = Robert Higgins
        var profiles = profileRepository.findAllByCaregiverId(caregiver.getId());
        assertEquals(1, profiles.size());
        assertEquals("Robert Higgins", profiles.get(0).getPreferredName());

        // Verify consent record created
        var consents = consentRepository.findAllByPlayerId(profiles.get(0).getId());
        assertEquals(1, consents.size());
        assertEquals(ConsentStatus.GRANTED, consents.get(0).getStatus());
        assertEquals(caregiver.getId(), consents.get(0).getCaregiverId());
    }

    @Test
    @DisplayName("Link code generation: only owner caregiver can generate link codes; non-owners get 403")
    void testLinkCodeGenerationAndAuthorization() throws Exception {
        // 1. Create Caregiver A
        RegisterRequest cgA = new RegisterRequest();
        cgA.setUsername("caregiver_a");
        cgA.setEmail("caregiver_a@example.com");
        cgA.setPassword("SecretPass123");
        cgA.setPatientName("Arthur Dent");
        String tokenA = registerAndGetToken(cgA);

        // 2. Create Caregiver B
        RegisterRequest cgB = new RegisterRequest();
        cgB.setUsername("caregiver_b");
        cgB.setEmail("caregiver_b@example.com");
        cgB.setPassword("SecretPass456");
        cgB.setPatientName("Ford Prefect");
        String tokenB = registerAndGetToken(cgB);

        Long profileAId = profileRepository.findAllByCaregiverId(
                userRepository.findByUsernameNormalized("caregiver_a").get().getId()
        ).get(0).getId();

        // 3. Caregiver A generates link code for profile A -> 201 Created
        MvcResult linkRes = mockMvc.perform(post("/api/profiles/" + profileAId + "/link-codes")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").isNotEmpty())
                .andExpect(jsonPath("$.profileId").value(profileAId))
                .andReturn();

        LinkCodeResponse codeDto = objectMapper.readValue(linkRes.getResponse().getContentAsString(), LinkCodeResponse.class);
        assertNotNull(codeDto.getCode());
        assertEquals(6, codeDto.getCode().length());

        // 4. Caregiver B attempts to generate link code for profile A -> 403 Forbidden
        mockMvc.perform(post("/api/profiles/" + profileAId + "/link-codes")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Patient signup: succeeds with valid link code, rejects invalid/used code, rejects duplicate signup")
    void testPatientSignupWithLinkCodeLifecycle() throws Exception {
        // Setup Caregiver & Profile
        RegisterRequest cg = new RegisterRequest();
        cg.setUsername("sarah_connor");
        cg.setEmail("sarah@resistance.org");
        cg.setPassword("Passphrase123");
        cg.setPatientName("John Connor");
        String cgToken = registerAndGetToken(cg);

        Long profileId = profileRepository.findAllByCaregiverId(
                userRepository.findByUsernameNormalized("sarah_connor").get().getId()
        ).get(0).getId();

        // Generate Code
        MvcResult linkRes = mockMvc.perform(post("/api/profiles/" + profileId + "/link-codes")
                        .header("Authorization", "Bearer " + cgToken))
                .andExpect(status().isCreated())
                .andReturn();
        LinkCodeResponse codeDto = objectMapper.readValue(linkRes.getResponse().getContentAsString(), LinkCodeResponse.class);
        String code = codeDto.getCode();

        // 1. Invalid link code -> 400 Bad Request
        PatientRegisterRequest badCodeReq = new PatientRegisterRequest("John", "johnny", null, "SimplePass", "INVALID99");
        mockMvc.perform(post("/api/auth/patient/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badCodeReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("This code didn't work. Please ask your caregiver for a new one."));

        // 2. Valid link code -> 201 Created
        PatientRegisterRequest validReq = new PatientRegisterRequest("John Connor", "john_patient", "john@skynet.org", "MyCalmPass", code);
        MvcResult patientRes = mockMvc.perform(post("/api/auth/patient/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.username").value("john_patient"))
                .andExpect(jsonPath("$.user.role").value("PATIENT"))
                .andExpect(jsonPath("$.user.playerProfileId").value(profileId))
                .andReturn();

        AuthResponse patientAuth = objectMapper.readValue(patientRes.getResponse().getContentAsString(), AuthResponse.class);
        assertNotNull(patientAuth.getToken());

        // 3. Re-using the same link code -> 400 Bad Request
        PatientRegisterRequest reuseReq = new PatientRegisterRequest("Impostor", "johnny2", null, "SimplePass", code);
        mockMvc.perform(post("/api/auth/patient/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reuseReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("This code didn't work. Please ask your caregiver for a new one."));

        // 4. If caregiver generates a new code for the same profile, patient signup is rejected because account already exists
        MvcResult linkRes2 = mockMvc.perform(post("/api/profiles/" + profileId + "/link-codes")
                        .header("Authorization", "Bearer " + cgToken))
                .andExpect(status().isBadRequest()) // Profile already has patient login
                .andReturn();
    }

    @Test
    @DisplayName("Role-based authorization: Patient CANNOT access caregiver endpoints, other profiles, observations, or summaries")
    void testPatientRoleAccessBoundaries() throws Exception {
        // Setup Caregiver and Patient
        RegisterRequest cg = new RegisterRequest();
        cg.setUsername("caregiver_elena");
        cg.setEmail("elena@villa.com");
        cg.setPassword("ElenaPass123");
        cg.setPatientName("Matteo");
        String cgToken = registerAndGetToken(cg);

        Long profileId = profileRepository.findAllByCaregiverId(
                userRepository.findByUsernameNormalized("caregiver_elena").get().getId()
        ).get(0).getId();

        // Create link code and patient
        MvcResult linkRes = mockMvc.perform(post("/api/profiles/" + profileId + "/link-codes")
                        .header("Authorization", "Bearer " + cgToken))
                .andExpect(status().isCreated())
                .andReturn();
        String code = objectMapper.readValue(linkRes.getResponse().getContentAsString(), LinkCodeResponse.class).getCode();

        PatientRegisterRequest pReq = new PatientRegisterRequest("Matteo", "matteo_player", null, "Matteo123", code);
        MvcResult pAuthRes = mockMvc.perform(post("/api/auth/patient/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pReq)))
                .andExpect(status().isCreated())
                .andReturn();
        String patientToken = objectMapper.readValue(pAuthRes.getResponse().getContentAsString(), AuthResponse.class).getToken();

        // 1. Patient CAN read own profile
        mockMvc.perform(get("/api/profiles/" + profileId)
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preferredName").value("Matteo"));

        // 2. Patient CAN read own memories
        mockMvc.perform(get("/api/profiles/" + profileId + "/memories")
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isOk());

        // 3. Patient CAN read own reminders
        mockMvc.perform(get("/api/profiles/" + profileId + "/reminders")
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isOk());

        // 4. Patient CAN read own garden
        mockMvc.perform(get("/api/profiles/" + profileId + "/garden")
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isOk());

        // 5. Patient CANNOT access Caregiver Observations -> 403
        mockMvc.perform(get("/api/profiles/" + profileId + "/observations")
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isForbidden());

        // 6. Patient CANNOT access Caregiver Consents -> 403
        mockMvc.perform(get("/api/profiles/" + profileId + "/consents")
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isForbidden());

        // 7. Patient CANNOT access Caregiver Summary -> 403
        mockMvc.perform(get("/api/profiles/" + profileId + "/summary")
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isForbidden());

        // 8. Patient CANNOT access Link Code endpoint -> 403
        mockMvc.perform(post("/api/profiles/" + profileId + "/link-codes")
                        .header("Authorization", "Bearer " + patientToken))
                .andExpect(status().isForbidden());

        // 9. Patient CANNOT create new player profiles -> 403
        CreateProfileRequest createReq = new CreateProfileRequest();
        createReq.setPreferredName("Another Patient");
        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + patientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Caregiver management: Caregiver can inspect, reset password, and toggle enabled state of patient login")
    void testCaregiverManagingPatientAccount() throws Exception {
        RegisterRequest cg = new RegisterRequest();
        cg.setUsername("caregiver_helen");
        cg.setEmail("helen@care.org");
        cg.setPassword("HelenPass123");
        cg.setPatientName("Grandma Rose");
        String cgToken = registerAndGetToken(cg);

        Long profileId = profileRepository.findAllByCaregiverId(
                userRepository.findByUsernameNormalized("caregiver_helen").get().getId()
        ).get(0).getId();

        // 1. Initial state before patient registration -> hasLogin = false
        mockMvc.perform(get("/api/profiles/" + profileId + "/patient-login")
                        .header("Authorization", "Bearer " + cgToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasLogin").value(false));

        // Generate code and register patient
        MvcResult codeRes = mockMvc.perform(post("/api/profiles/" + profileId + "/link-codes")
                        .header("Authorization", "Bearer " + cgToken))
                .andExpect(status().isCreated())
                .andReturn();
        String code = objectMapper.readValue(codeRes.getResponse().getContentAsString(), LinkCodeResponse.class).getCode();

        PatientRegisterRequest pReq = new PatientRegisterRequest("Rose", "grandma_rose", null, "InitialPass99", code);
        mockMvc.perform(post("/api/auth/patient/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pReq)))
                .andExpect(status().isCreated());

        // 2. Check patient login status from caregiver dashboard -> hasLogin = true
        mockMvc.perform(get("/api/profiles/" + profileId + "/patient-login")
                        .header("Authorization", "Bearer " + cgToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasLogin").value(true))
                .andExpect(jsonPath("$.username").value("grandma_rose"))
                .andExpect(jsonPath("$.enabled").value(true));

        // 3. Reset patient password by caregiver
        ResetPatientPasswordRequest resetReq = new ResetPatientPasswordRequest("NewGentlePassword123");
        mockMvc.perform(post("/api/profiles/" + profileId + "/patient-login/reset-password")
                        .header("Authorization", "Bearer " + cgToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isOk());

        // Verify patient can now log in with new password
        LoginRequest loginWithNewPass = new LoginRequest("grandma_rose", "NewGentlePassword123");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginWithNewPass)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value("grandma_rose"));

        // 4. Caregiver disables patient login
        UpdatePatientStatusRequest disableReq = new UpdatePatientStatusRequest(false);
        mockMvc.perform(patch("/api/profiles/" + profileId + "/patient-login/enabled")
                        .header("Authorization", "Bearer " + cgToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(disableReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false));

        // Patient login attempt while disabled -> 400 Bad Request
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginWithNewPass)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("paused")));
    }

    private String registerAndGetToken(RegisterRequest request) throws Exception {
        MvcResult res = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        AuthResponse auth = objectMapper.readValue(res.getResponse().getContentAsString(), AuthResponse.class);
        return auth.getToken();
    }
}
