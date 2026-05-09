USE soundbook_db;

-- Module 1: Manual Taste DNA migration
-- Run this once if your database was created before the Taste DNA update.
-- If a column already exists, skip the corresponding ALTER TABLE statement.

ALTER TABLE user_music_dna
  MODIFY COLUMN built_from ENUM('MANUAL','SPOTIFY','MIXED') NOT NULL DEFAULT 'MANUAL',
  MODIFY COLUMN prefs_json JSON NOT NULL,
  MODIFY COLUMN vector_json JSON NOT NULL;

ALTER TABLE user_book_dna
  MODIFY COLUMN prefs_json JSON NOT NULL,
  MODIFY COLUMN vector_json JSON NOT NULL;

ALTER TABLE user_taste_dna
  MODIFY COLUMN music_vector_json JSON NOT NULL,
  MODIFY COLUMN book_vector_json JSON NOT NULL;

ALTER TABLE user_music_dna
  ADD COLUMN confidence DECIMAL(3,2) NOT NULL DEFAULT 0.55 AFTER vector_json;

ALTER TABLE user_book_dna
  ADD COLUMN confidence DECIMAL(3,2) NOT NULL DEFAULT 0.55 AFTER vector_json;

ALTER TABLE user_taste_dna
  ADD COLUMN music_confidence DECIMAL(3,2) NOT NULL DEFAULT 0.55 AFTER book_vector_json,
  ADD COLUMN book_confidence DECIMAL(3,2) NOT NULL DEFAULT 0.55 AFTER music_confidence;

  
SET SQL_SAFE_UPDATES = 0;

UPDATE user_onboarding
SET music_connected = 0
WHERE music_connected IS NULL OR music_connected = 1;

SET SQL_SAFE_UPDATES = 1;
