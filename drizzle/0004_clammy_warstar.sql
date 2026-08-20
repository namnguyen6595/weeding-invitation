ALTER TABLE `wedding_configs` ADD `cover_image_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `wedding_configs` ADD `families_image_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `wedding_configs` ADD `story_image_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `wedding_configs` ADD `timeline_image_url` text DEFAULT '' NOT NULL;
--> statement-breakpoint
UPDATE `wedding_configs`
SET
  `cover_image_url` = CASE `family`
    WHEN 'groom' THEN 'https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-006.webp'
    WHEN 'bride' THEN 'https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-019.webp'
    ELSE ''
  END,
  `families_image_url` = CASE `family`
    WHEN 'groom' THEN 'https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-009.webp'
    WHEN 'bride' THEN 'https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-008.webp'
    ELSE ''
  END,
  `story_image_url` = CASE `family`
    WHEN 'groom' THEN 'https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-004.webp'
    WHEN 'bride' THEN 'https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-021.webp'
    ELSE ''
  END,
  `timeline_image_url` = 'https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-005.webp';
