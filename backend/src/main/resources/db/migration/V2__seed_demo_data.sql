-- ====================================================================
-- Seed Migration V2: Demo Caregiver, Player Profile & Initial Data
-- ====================================================================

-- Demo Caregiver: caregiver@example.com / Caregiver123!
INSERT INTO users (id, name, email, password_hash, role, created_at)
VALUES (
    1,
    'Eleanor Vance',
    'caregiver@example.com',
    '$2b$10$2yYthVClfRr2xq3qOAqaseSOJVxose2KLEe4xMe9eCYY/dpnMb3yW',
    'CAREGIVER',
    CURRENT_TIMESTAMP
);

-- Demo Player Profile: Margaret
INSERT INTO player_profiles (
    id, caregiver_id, preferred_name, language, text_size, audio_enabled, support_notes, difficulty_mode, manual_difficulty, created_at
) VALUES (
    1,
    1,
    'Margaret',
    'en',
    'LARGE',
    TRUE,
    'Enjoys morning gardening, family photo reminiscence, and gentle acoustic melodies.',
    'AUTO',
    'STANDARD',
    CURRENT_TIMESTAMP
);

-- Games Catalog
INSERT INTO games (id, game_key, title, category, enabled) VALUES
(1, 'memory-match', 'Memory Match', 'Visual Recall', TRUE),
(2, 'my-life-story', 'My Life Story', 'Narrative Reminiscence', TRUE),
(3, 'picture-recognition', 'Picture Recognition', 'Visual Familiarity', TRUE),
(4, 'virtual-garden', 'Virtual Garden', 'Calm Creativity', TRUE),
(5, 'dual-n-back', 'Dual N-Back Span', 'Working Memory', TRUE),
(6, 'inhibitory', 'Inhibitory Control', 'Focus & Suppression', TRUE),
(7, 'facial-associator', 'Facial Associator', 'Social Recognition', TRUE),
(8, 'synaptic-velocity', 'Synaptic Velocity', 'Response Speed', TRUE);

-- Sample Memories
INSERT INTO memory_items (id, player_id, type, title, description, media_url, storage_key, transcript, sort_order, created_at) VALUES
(1, 1, 'PHOTO', 'Spring Rose Garden', 'Our family visit to the botanical conservatory yellow roses.', NULL, NULL, NULL, 1, CURRENT_TIMESTAMP),
(2, 1, 'STORY', 'The 1968 Coast Drive', 'Driving the coastal road with the windows rolled down on a sunny afternoon.', NULL, NULL, 'We drove from Monterey down through Big Sur, singing along to the radio with the windows wide open.', 2, CURRENT_TIMESTAMP),
(3, 1, 'PLACE', 'Maple Street Bakery', 'The cozy neighborhood bakery where we picked up cinnamon bread on Saturdays.', NULL, NULL, NULL, 3, CURRENT_TIMESTAMP),
(4, 1, 'AUDIO', 'Evening Relaxation Melody', 'Gentle acoustic piano and strings recorded for peaceful wind-down.', NULL, NULL, 'Gentle melodic harmony with soothing ocean waves in the background.', 4, CURRENT_TIMESTAMP);

-- Sample Game Sessions (Engagement Records)
INSERT INTO game_sessions (id, player_id, game_key, started_at, ended_at, difficulty, completed, metrics_json) VALUES
(1, 1, 'memory-match', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY), 'STANDARD', TRUE, '{"pairsMatched":6,"hintsUsed":1,"durationSeconds":95}'),
(2, 1, 'memory-match', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY), 'STANDARD', TRUE, '{"pairsMatched":6,"hintsUsed":0,"durationSeconds":82}'),
(3, 1, 'memory-match', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'STANDARD', TRUE, '{"pairsMatched":6,"hintsUsed":0,"durationSeconds":78}'),
(4, 1, 'memory-match', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY), 'STANDARD', TRUE, '{"pairsMatched":6,"hintsUsed":1,"durationSeconds":88}'),
(5, 1, 'memory-match', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'STANDARD', TRUE, '{"pairsMatched":6,"hintsUsed":0,"durationSeconds":75}'),
(6, 1, 'virtual-garden', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'STANDARD', TRUE, '{"plantsNurtured":3,"peaceMinutes":12}');

-- Sample Garden State
INSERT INTO garden_states (id, player_id, plants_json, items_json, updated_at) VALUES
(1, 1, '[{"id":"plant-1","name":"Golden Marigold","stage":"blooming","x":25,"y":35},{"id":"plant-2","name":"English Lavender","stage":"fragrant","x":65,"y":40}]', '[{"id":"item-1","name":"Stone Birdbath","x":50,"y":50},{"id":"item-2","name":"Wooden Park Bench","x":20,"y":70}]', CURRENT_TIMESTAMP);

-- Sample Reminders
INSERT INTO reminders (id, player_id, title, type, scheduled_at, recurrence, enabled, status, created_by, created_at) VALUES
(1, 1, 'Morning Garden Walk & Sunshine', 'ACTIVITY', DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 HOUR), 'DAILY', TRUE, 'PENDING', 1, CURRENT_TIMESTAMP),
(2, 1, 'Cool Fresh Water Hydration', 'HYDRATION', DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 HOUR), 'DAILY', TRUE, 'PENDING', 1, CURRENT_TIMESTAMP),
(3, 1, 'Nutritious Homemade Soup & Bread', 'MEAL', DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 HOUR), 'DAILY', TRUE, 'PENDING', 1, CURRENT_TIMESTAMP);

-- Sample Caregiver Observation
INSERT INTO caregiver_observations (id, player_id, session_id, mood_note, assistance_note, created_at, created_by) VALUES
(1, 1, 1, 'Margaret was cheerful, smiled at the floral cards, and reminisced about her rose bushes.', 'Offered one encouraging verbal reminder on the matching card pair.', CURRENT_TIMESTAMP, 1);

-- Sample Consent Record
INSERT INTO consent_records (id, player_id, caregiver_id, consent_type, status, recorded_at) VALUES
(1, 1, 1, 'MEDIA_AND_ENGAGEMENT_STORAGE', 'GRANTED', CURRENT_TIMESTAMP);

-- Frontend Companion Seed Data
INSERT INTO user_settings (id, user_id, sound_enabled, reduced_motion, high_contrast, preferred_language, drill_difficulty) VALUES
(1, 1, TRUE, FALSE, FALSE, 'EN', 'Standard');

INSERT INTO telemetry_state (
    id, recall_balance, per_second_gain, velocity, error_drift_index, daily_focus_fee, focus_tax, daily_model_ramp, xp_per_min, streak, drift_reduction, rat_value, node_id, protocol_status, is_escalating, updated_at
) VALUES (
    1, 9.16, 214.1, '154.3M/SEC', '0.384 [-1.2%]', 124, 15, 85, 3450, 7.2, 78, 21.43, '08/A', 'EXTENDED DRILL V2.3', TRUE, CURRENT_TIMESTAMP
);

INSERT INTO radar_agents (id, label, x, y, status, speech, decay_time) VALUES
(1, 'AGENT 01', 22, 36, 'threat', 'Unread Notification Ping [ATTENTION]', 12),
(2, 'AGENT 02', 35, 28, 'active', 'Background Multitasking Load', 18),
(3, 'AGENT 03', 48, 20, 'active', 'Pending Calendar Alert', 9),
(4, 'AGENT 04', 68, 40, 'threat', 'High Contrast Visual Flashing', 14),
(5, 'AGENT 05', 75, 56, 'active', 'Unsorted Task Inflow', 22),
(6, 'AGENT 06', 32, 72, 'threat', 'Sudden Device Vibration', 10),
(7, 'AGENT 07', 44, 65, 'active', 'Peripheral Screen Glare', 16);
