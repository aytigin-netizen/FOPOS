CREATE TABLE `teacher_profile_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`revision` integer NOT NULL,
	`display_name` text NOT NULL,
	`school_name` text NOT NULL,
	`academic_year` text NOT NULL,
	`changed_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_profile_revisions_user_revision_idx` ON `teacher_profile_revisions` (`user_id`,`revision`);--> statement-breakpoint
CREATE INDEX `teacher_profile_revisions_user_changed_idx` ON `teacher_profile_revisions` (`user_id`,`changed_at`);--> statement-breakpoint
INSERT INTO `teacher_profile_revisions` (
	`id`, `user_id`, `revision`, `display_name`, `school_name`, `academic_year`, `changed_at`
)
SELECT
	lower(hex(randomblob(16))),
	`user_id`,
	`revision`,
	`display_name`,
	`school_name`,
	`academic_year`,
	`updated_at`
FROM `teacher_profiles`;
