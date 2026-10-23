-- ====================================================================
-- Migration V4: Add Patient Role Support, Link Codes, and Patient Profile Linking
-- ====================================================================

-- 1. Allow optional emails for patient accounts while maintaining unique constraint on non-null values
ALTER TABLE users MODIFY email VARCHAR(150) NULL;
ALTER TABLE users MODIFY email_normalized VARCHAR(150) NULL;

-- 2. Add player_profile_id and enabled flag to users
ALTER TABLE users ADD COLUMN player_profile_id BIGINT NULL AFTER role;
ALTER TABLE users ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE AFTER player_profile_id;

-- 3. Link patient user to exactly one player profile with foreign key and unique constraint
ALTER TABLE users ADD CONSTRAINT fk_users_player_profile FOREIGN KEY (player_profile_id) REFERENCES player_profiles (id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT uk_users_player_profile UNIQUE (player_profile_id);

-- 4. Create patient link codes table for secure caregiver-initiated patient onboarding
CREATE TABLE patient_link_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_profile_id BIGINT NOT NULL,
    code VARCHAR(32) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    CONSTRAINT fk_linkcodes_profile FOREIGN KEY (player_profile_id) REFERENCES player_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_linkcodes_creator FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_linkcodes_code ON patient_link_codes (code);
CREATE INDEX idx_linkcodes_profile ON patient_link_codes (player_profile_id);
