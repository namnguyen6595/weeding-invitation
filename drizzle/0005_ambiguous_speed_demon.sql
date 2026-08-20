ALTER TABLE `wedding_configs` ADD `families_groom_image_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `wedding_configs` ADD `families_bride_image_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE `wedding_configs`
SET
  `families_groom_image_url` = COALESCE(
    (SELECT `families_image_url` FROM `wedding_configs` WHERE `family` = 'groom'),
    ''
  ),
  `families_bride_image_url` = COALESCE(
    (SELECT `families_image_url` FROM `wedding_configs` WHERE `family` = 'bride'),
    ''
  );
