ALTER TABLE packages
ADD COLUMN condition_definition TEXT,
ADD COLUMN condition_operator TEXT,
ADD COLUMN condition_value JSONB;