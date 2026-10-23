-- ====================================================================
-- Schema Migration V1: Core Tables for Cognitive Platform
-- Designed for supportive memory engagement and cognitive training
-- ====================================================================

-- 1. Users (Caregivers & Administrators)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'CAREGIVER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Player Profiles (Loved ones / Participants receiving care)
CREATE TABLE player_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    caregiver_id BIGINT NOT NULL,
    preferred_name VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    text_size VARCHAR(20) NOT NULL DEFAULT 'REGULAR',
    audio_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    support_notes TEXT,
    difficulty_mode VARCHAR(20) NOT NULL DEFAULT 'AUTO',
    manual_difficulty VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_profiles_caregiver FOREIGN KEY (caregiver_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_profiles_caregiver ON player_profiles (caregiver_id);

-- 3. Memory Items (Photos, Stories, Places, Audio clips)
CREATE TABLE memory_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    media_url VARCHAR(500),
    storage_key VARCHAR(255),
    transcript TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_memories_player FOREIGN KEY (player_id) REFERENCES player_profiles (id) ON DELETE CASCADE
);
CREATE INDEX idx_memories_player ON memory_items (player_id);

-- 4. Games Catalog
CREATE TABLE games (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_key VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. Game Sessions (Engagement activity records)
CREATE TABLE game_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    game_key VARCHAR(50) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    metrics_json TEXT,
    CONSTRAINT fk_sessions_player FOREIGN KEY (player_id) REFERENCES player_profiles (id) ON DELETE CASCADE
);
CREATE INDEX idx_sessions_player ON game_sessions (player_id);
CREATE INDEX idx_sessions_started ON game_sessions (started_at);
CREATE INDEX idx_sessions_game_key ON game_sessions (game_key);

-- 6. Garden State (Peaceful virtual garden representation)
CREATE TABLE garden_states (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL UNIQUE,
    plants_json TEXT NOT NULL,
    items_json TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_garden_player FOREIGN KEY (player_id) REFERENCES player_profiles (id) ON DELETE CASCADE
);

-- 7. Reminders (Daily support routines)
CREATE TABLE reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'ACTIVITY',
    scheduled_at TIMESTAMP NOT NULL,
    recurrence VARCHAR(50) NOT NULL DEFAULT 'NONE',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reminders_player FOREIGN KEY (player_id) REFERENCES player_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_reminders_creator FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_reminders_player ON reminders (player_id);

-- 8. Caregiver Observations (Support notes and observations)
CREATE TABLE caregiver_observations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    session_id BIGINT NULL,
    mood_note VARCHAR(500),
    assistance_note VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    CONSTRAINT fk_observations_player FOREIGN KEY (player_id) REFERENCES player_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_observations_session FOREIGN KEY (session_id) REFERENCES game_sessions (id) ON DELETE SET NULL,
    CONSTRAINT fk_observations_creator FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_observations_player ON caregiver_observations (player_id);

-- 9. Consent Records (Caregiver-approved consent records)
CREATE TABLE consent_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    caregiver_id BIGINT NOT NULL,
    consent_type VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'GRANTED',
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consents_player FOREIGN KEY (player_id) REFERENCES player_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_consents_caregiver FOREIGN KEY (caregiver_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_consent_player ON consent_records (player_id);
CREATE INDEX idx_consent_caregiver ON consent_records (caregiver_id);

-- 10. Frontend Companion: User Settings
CREATE TABLE user_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
    high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'EN',
    drill_difficulty VARCHAR(30) NOT NULL DEFAULT 'Standard'
);

-- 11. Frontend Companion: Telemetry State
CREATE TABLE telemetry_state (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recall_balance DOUBLE NOT NULL DEFAULT 9.16,
    per_second_gain DOUBLE NOT NULL DEFAULT 214.1,
    velocity VARCHAR(50) NOT NULL DEFAULT '154.3M/SEC',
    error_drift_index VARCHAR(50) NOT NULL DEFAULT '0.384 [-1.2%]',
    daily_focus_fee INT NOT NULL DEFAULT 124,
    focus_tax INT NOT NULL DEFAULT 15,
    daily_model_ramp INT NOT NULL DEFAULT 85,
    xp_per_min INT NOT NULL DEFAULT 3450,
    streak DOUBLE NOT NULL DEFAULT 7.2,
    drift_reduction INT NOT NULL DEFAULT 78,
    rat_value DOUBLE NOT NULL DEFAULT 21.43,
    node_id VARCHAR(50) NOT NULL DEFAULT '08/A',
    protocol_status VARCHAR(100) NOT NULL DEFAULT 'EXTENDED DRILL V2.3',
    is_escalating BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Frontend Companion: Radar Agents
CREATE TABLE radar_agents (
    id BIGINT PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    x INT NOT NULL,
    y INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    speech VARCHAR(255) NOT NULL,
    decay_time INT NOT NULL
);
