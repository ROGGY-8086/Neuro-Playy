package com.cognitiveplatform.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Lightweight health check and database inspection/maintenance endpoint")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    @Operation(summary = "Check service health and warm up container")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "service", "neuro-playy-backend"
        ));
    }

    @GetMapping("/inspect")
    @Operation(summary = "Inspect existing user accounts and database record counts")
    public ResponseEntity<Map<String, Object>> inspectDatabase() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("timestamp", Instant.now().toString());

        // Count users by role
        Long totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Long.class);
        Long caregivers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE role = 'CAREGIVER'", Long.class);
        Long patients = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE role = 'PATIENT'", Long.class);
        List<Map<String, Object>> userList = jdbcTemplate.queryForList(
                "SELECT id, name, username, email, role, player_profile_id, enabled, created_at FROM users ORDER BY id ASC"
        );

        Map<String, Object> usersSection = new LinkedHashMap<>();
        usersSection.put("totalUsers", totalUsers);
        usersSection.put("caregiversCount", caregivers);
        usersSection.put("patientsCount", patients);
        usersSection.put("users", userList);
        report.put("usersTable", usersSection);

        // Count player profiles
        Long playerProfiles = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM player_profiles", Long.class);
        List<Map<String, Object>> playerProfileList = jdbcTemplate.queryForList(
                "SELECT id, caregiver_id, preferred_name, language, difficulty_mode, created_at FROM player_profiles ORDER BY id ASC"
        );
        Map<String, Object> profilesSection = new LinkedHashMap<>();
        profilesSection.put("totalProfiles", playerProfiles);
        profilesSection.put("profiles", playerProfileList);
        report.put("playerProfilesTable", profilesSection);

        // Count all dependent tables
        Map<String, Long> dependentTables = new LinkedHashMap<>();
        String[] tables = {
                "user_profiles", "relatives", "life_events", "personal_questions",
                "memory_game_questions",
                "daily_game_sessions", "daily_scores", "memory_items", "game_sessions",
                "garden_states", "reminders", "caregiver_observations", "consent_records",
                "patient_link_codes", "user_settings"
        };
        for (String tbl : tables) {
            try {
                Long cnt = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tbl, Long.class);
                dependentTables.put(tbl, cnt);
            } catch (Exception e) {
                dependentTables.put(tbl, -1L);
            }
        }
        report.put("dependentTables", dependentTables);

        // Preserved catalog & system tables
        Map<String, Long> systemTables = new LinkedHashMap<>();
        for (String tbl : new String[]{"games", "telemetry_state", "radar_agents", "flyway_schema_history"}) {
            try {
                Long cnt = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tbl, Long.class);
                systemTables.put(tbl, cnt);
            } catch (Exception e) {
                systemTables.put(tbl, -1L);
            }
        }
        report.put("systemCatalogTables", systemTables);

        return ResponseEntity.ok(report);
    }

    @Transactional
    @PostMapping("/purge-all-users")
    @Operation(summary = "Safely delete all existing user accounts in strict foreign key order within a transaction")
    public ResponseEntity<Map<String, Object>> purgeAllUsers(
            @RequestHeader(value = "X-Admin-Action", required = false) String adminAction) {
        if (!"PURGE_ALL_USERS_CONFIRMED".equals(adminAction)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing or invalid confirmation header 'X-Admin-Action: PURGE_ALL_USERS_CONFIRMED'"
            ));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("startTime", Instant.now().toString());

        // Step 1: Sever circular reference between users and player_profiles
        int unlinkedPatients = jdbcTemplate.update("UPDATE users SET player_profile_id = NULL");
        result.put("unlinkedPatientProfiles", unlinkedPatients);

        // Step 2: Delete child records referencing player_profiles and users
        int memQuestionsDeleted = jdbcTemplate.update("DELETE FROM memory_game_questions");
        int observationsDeleted = jdbcTemplate.update("DELETE FROM caregiver_observations");
        int consentRecordsDeleted = jdbcTemplate.update("DELETE FROM consent_records");
        int linkCodesDeleted = jdbcTemplate.update("DELETE FROM patient_link_codes");
        int remindersDeleted = jdbcTemplate.update("DELETE FROM reminders");
        int memoriesDeleted = jdbcTemplate.update("DELETE FROM memory_items");
        int sessionsDeleted = jdbcTemplate.update("DELETE FROM game_sessions");
        int gardenStatesDeleted = jdbcTemplate.update("DELETE FROM garden_states");

        // Step 3: Delete guardian profile and daily game child records referencing users
        int dailyScoresDeleted = jdbcTemplate.update("DELETE FROM daily_scores");
        int dailyGameSessionsDeleted = jdbcTemplate.update("DELETE FROM daily_game_sessions");
        int personalQuestionsDeleted = jdbcTemplate.update("DELETE FROM personal_questions");
        int lifeEventsDeleted = jdbcTemplate.update("DELETE FROM life_events");
        int relativesDeleted = jdbcTemplate.update("DELETE FROM relatives");
        int userProfilesDeleted = jdbcTemplate.update("DELETE FROM user_profiles");

        // Step 4: Clear user_settings referencing users
        int userSettingsCleared = jdbcTemplate.update("DELETE FROM user_settings WHERE user_id IS NOT NULL");

        // Step 5: Delete player profiles
        int playerProfilesDeleted = jdbcTemplate.update("DELETE FROM player_profiles");

        // Step 6: Delete all user records from users table (both Caregivers and Patients)
        int usersDeleted = jdbcTemplate.update("DELETE FROM users");

        // Verification counts inside the transaction
        Long remainingUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Long.class);
        Long remainingProfiles = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM player_profiles", Long.class);

        Map<String, Object> deletedMap = new LinkedHashMap<>();
        deletedMap.put("caregiverObservations", observationsDeleted);
        deletedMap.put("consentRecords", consentRecordsDeleted);
        deletedMap.put("patientLinkCodes", linkCodesDeleted);
        deletedMap.put("reminders", remindersDeleted);
        deletedMap.put("memoryItems", memoriesDeleted);
        deletedMap.put("gameSessions", sessionsDeleted);
        deletedMap.put("gardenStates", gardenStatesDeleted);
        deletedMap.put("dailyScores", dailyScoresDeleted);
        deletedMap.put("dailyGameSessions", dailyGameSessionsDeleted);
        deletedMap.put("personalQuestions", personalQuestionsDeleted);
        deletedMap.put("lifeEvents", lifeEventsDeleted);
        deletedMap.put("relatives", relativesDeleted);
        deletedMap.put("userProfiles", userProfilesDeleted);
        deletedMap.put("userSettings", userSettingsCleared);
        deletedMap.put("playerProfiles", playerProfilesDeleted);
        deletedMap.put("users", usersDeleted);

        result.put("deletedCounts", deletedMap);

        result.put("verification", Map.of(
                "usersCountAfter", remainingUsers,
                "playerProfilesCountAfter", remainingProfiles,
                "success", (remainingUsers != null && remainingUsers == 0L && remainingProfiles != null && remainingProfiles == 0L)
        ));
        result.put("completedTime", Instant.now().toString());

        return ResponseEntity.ok(result);
    }
}
