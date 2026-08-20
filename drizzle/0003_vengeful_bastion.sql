ALTER TABLE `wedding_configs` ADD `music_url` text DEFAULT '' NOT NULL;
--> statement-breakpoint
UPDATE `wedding_configs`
SET `music_url` = COALESCE((SELECT `music_url` FROM `wedding_settings` WHERE `id` = 1), '');
