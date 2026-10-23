-- ====================================================================
-- Migration V5: Guardian Profile & Personalized Daily Memory Game
-- ====================================================================

-- 1. User Profiles (Basic Personal Information provided by Guardian)
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    nickname VARCHAR(100) NULL,
    date_of_birth DATE NULL,
    place_of_birth VARCHAR(150) NULL,
    hometown VARCHAR(150) NULL,
    preferred_language VARCHAR(50) NULL DEFAULT 'en',
    setup_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_user_profiles_user ON user_profiles (user_id);

-- 2. Relatives (Family Members & Relatives)
CREATE TABLE relatives (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    date_of_birth DATE NULL,
    important_details TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_relatives_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_relatives_user ON relatives (user_id);

-- 3. Life Events (Important Life Events & Meaningful Memories)
CREATE TABLE life_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    event_date DATE NULL,
    approximate_year INT NULL,
    event_place VARCHAR(200) NULL,
    people_involved TEXT NULL,
    event_description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_life_events_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_life_events_user ON life_events (user_id);

-- 4. Personal Questions (Custom Question-Answer Pairs derived from Guardian Info)
CREATE TABLE personal_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    alternative_answers TEXT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NULL,
    source_type VARCHAR(50) NULL DEFAULT 'CUSTOM',
    source_id VARCHAR(100) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_personal_questions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_personal_questions_user ON personal_questions (user_id);

-- 5. Daily Game Sessions (Operational Active Game State)
CREATE TABLE daily_game_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_date DATE NOT NULL,
    question_set TEXT NOT NULL,
    answer_state TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_daily_sessions_user_date UNIQUE (user_id, game_date),
    CONSTRAINT fk_daily_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_daily_sessions_user ON daily_game_sessions (user_id);

-- 6. Daily Scores (Permanent Minimal Score History Table)
-- STRICT: Only id, user_id, score, game_date
CREATE TABLE daily_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    score INT NOT NULL,
    game_date DATE NOT NULL,
    CONSTRAINT uk_daily_scores_user_date UNIQUE (user_id, game_date),
    CONSTRAINT fk_daily_scores_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_daily_scores_user_date ON daily_scores (user_id, game_date);
