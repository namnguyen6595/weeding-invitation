CREATE TABLE `wedding_configs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`family` text NOT NULL,
	`venue_name` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`map_url` text DEFAULT '' NOT NULL,
	`event_date` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wedding_configs_family_unique` ON `wedding_configs` (`family`);