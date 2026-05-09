-- Profile follow/privacy/pinned YouTube hotfix
-- Run this once after copying the code patch. It is safe to run multiple times on MySQL 8+.

SET @db_name = DATABASE();

SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db_name AND TABLE_NAME='user_profiles' AND COLUMN_NAME='public_info') = 0,
  'ALTER TABLE user_profiles ADD COLUMN public_info VARCHAR(1000) NULL AFTER bio',
  'SELECT ''user_profiles.public_info already exists'''
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db_name AND TABLE_NAME='user_profiles' AND COLUMN_NAME='bio_visibility') = 0,
  'ALTER TABLE user_profiles ADD COLUMN bio_visibility ENUM(''PUBLIC'',''FRIENDS'',''FOLLOWERS'',''PRIVATE'') NOT NULL DEFAULT ''PUBLIC'' AFTER public_info',
  'SELECT ''user_profiles.bio_visibility already exists'''
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db_name AND TABLE_NAME='user_profiles' AND COLUMN_NAME='public_info_visibility') = 0,
  'ALTER TABLE user_profiles ADD COLUMN public_info_visibility ENUM(''PUBLIC'',''FRIENDS'',''FOLLOWERS'',''PRIVATE'') NOT NULL DEFAULT ''PUBLIC'' AFTER bio_visibility',
  'SELECT ''user_profiles.public_info_visibility already exists'''
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db_name AND TABLE_NAME='user_profiles' AND COLUMN_NAME='pinned_track_visibility') = 0,
  'ALTER TABLE user_profiles ADD COLUMN pinned_track_visibility ENUM(''PUBLIC'',''FRIENDS'',''FOLLOWERS'',''PRIVATE'') NOT NULL DEFAULT ''PUBLIC'' AFTER pinned_track_id',
  'SELECT ''user_profiles.pinned_track_visibility already exists'''
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=@db_name AND TABLE_NAME='user_bookshelf_items' AND COLUMN_NAME='visibility') = 0,
  'ALTER TABLE user_bookshelf_items ADD COLUMN visibility ENUM(''PUBLIC'',''FRIENDS'',''FOLLOWERS'',''PRIVATE'') NOT NULL DEFAULT ''PUBLIC'' AFTER rating',
  'SELECT ''user_bookshelf_items.visibility already exists'''
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE user_profiles SET bio_visibility = 'PUBLIC' WHERE bio_visibility IS NULL;
UPDATE user_profiles SET public_info_visibility = 'PUBLIC' WHERE public_info_visibility IS NULL;
UPDATE user_profiles SET pinned_track_visibility = 'PUBLIC' WHERE pinned_track_visibility IS NULL;
UPDATE user_bookshelf_items SET visibility = 'PUBLIC' WHERE visibility IS NULL;
