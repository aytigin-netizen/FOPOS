CREATE TABLE `teacher_discipline_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`discipline_code` text NOT NULL,
	`is_default` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_discipline_assignments_user_code_idx` ON `teacher_discipline_assignments` (`user_id`,`discipline_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_discipline_assignments_user_default_idx` ON `teacher_discipline_assignments` (`user_id`) WHERE `is_default` = 1;--> statement-breakpoint
INSERT INTO `teacher_discipline_assignments` (
	`id`, `user_id`, `discipline_code`, `is_default`, `created_at`, `updated_at`
)
SELECT
	lower(hex(randomblob(16))),
	`user_id`,
	'philosophy',
	1,
	`created_at`,
	`updated_at`
FROM `teacher_profiles`;
