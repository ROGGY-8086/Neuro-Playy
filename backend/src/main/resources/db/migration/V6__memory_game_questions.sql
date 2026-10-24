-- ====================================================================
-- Migration V6: Memory Game Questions Configuration
-- ====================================================================

CREATE TABLE memory_game_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_profile_id BIGINT NOT NULL,
    caregiver_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    image_url TEXT NULL,
    correct_answer TEXT NOT NULL,
    options_json TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_mem_questions_profile FOREIGN KEY (player_profile_id) REFERENCES player_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_mem_questions_caregiver FOREIGN KEY (caregiver_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_mem_questions_profile ON memory_game_questions (player_profile_id);
CREATE INDEX idx_mem_questions_caregiver ON memory_game_questions (caregiver_id);
