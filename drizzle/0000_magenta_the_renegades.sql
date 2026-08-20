CREATE TABLE `teacher_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`display_name` text NOT NULL,
	`branch` text DEFAULT 'Felsefe' NOT NULL,
	`school_name` text NOT NULL,
	`academic_year` text NOT NULL,
	`locale` text DEFAULT 'tr-TR' NOT NULL,
	`schema_version` text DEFAULT '47.0.0' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_profiles_user_id_idx` ON `teacher_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email_normalized` text NOT NULL,
	`created_at` text NOT NULL,
	`last_seen_at` text NOT NULL,
	`disabled_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_normalized_idx` ON `users` (`email_normalized`);