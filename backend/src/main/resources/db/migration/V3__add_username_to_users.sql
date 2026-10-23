-- ====================================================================
-- Migration V3: Add username and case-insensitive normalized columns to users
-- ====================================================================

ALTER TABLE users ADD COLUMN username VARCHAR(100) NULL AFTER name;
ALTER TABLE users ADD COLUMN username_normalized VARCHAR(100) NULL AFTER username;
ALTER TABLE users ADD COLUMN email_normalized VARCHAR(150) NULL AFTER email;

-- Backfill existing users safely deriving username from email prefix
UPDATE users SET
    username = LOWER(SUBSTRING_INDEX(email, '@', 1)),
    username_normalized = LOWER(SUBSTRING_INDEX(email, '@', 1)),
    email_normalized = LOWER(email);

ALTER TABLE users MODIFY username VARCHAR(100) NOT NULL;
ALTER TABLE users MODIFY username_normalized VARCHAR(100) NOT NULL;
ALTER TABLE users MODIFY email_normalized VARCHAR(150) NOT NULL;

ALTER TABLE users ADD CONSTRAINT uk_users_username UNIQUE (username);
ALTER TABLE users ADD CONSTRAINT uk_users_username_normalized UNIQUE (username_normalized);
ALTER TABLE users ADD CONSTRAINT uk_users_email_normalized UNIQUE (email_normalized);
