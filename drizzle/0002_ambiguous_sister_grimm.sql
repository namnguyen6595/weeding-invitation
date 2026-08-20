CREATE TABLE `wedding_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`music_url` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `wedding_settings` (`id`, `music_url`)
VALUES (1, 'https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/Kai%20%C4%90inh%20x%20ERIK%20%E2%80%98Va%CC%81y%20Cu%CC%9Bo%CC%9B%CC%81i%E2%80%99%20Lyrics%20Video%20From%20the%20Wedding%20of%20Ms.%20Vien%20Vibi%20and%20Mr.Linh.mp3');
