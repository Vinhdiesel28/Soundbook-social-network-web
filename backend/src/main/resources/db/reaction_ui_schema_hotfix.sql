-- Hotfix for expanded post reactions used by the frontend reaction picker.
-- Run this once on existing MySQL databases before using LAUGH/WOW/SAD reactions.

ALTER TABLE reactions
  MODIFY COLUMN reaction_type ENUM('LIKE','HEART','FIRE','LAUGH','WOW','SAD') NOT NULL;
