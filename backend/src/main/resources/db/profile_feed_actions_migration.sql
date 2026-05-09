-- Profile/feed action hotfix: run once after the previous Taste DNA/feed migrations.
SET @db_name = DATABASE();

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE posts ADD COLUMN comments_enabled TINYINT(1) NOT NULL DEFAULT 1 AFTER mood_tag',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'posts' AND COLUMN_NAME = 'comments_enabled'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE posts ADD COLUMN share_count BIGINT NOT NULL DEFAULT 0 AFTER comments_enabled',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'posts' AND COLUMN_NAME = 'share_count'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE posts SET comments_enabled = 1 WHERE comments_enabled IS NULL;
UPDATE posts SET share_count = 0 WHERE share_count IS NULL;
