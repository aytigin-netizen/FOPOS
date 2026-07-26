CREATE TABLE `class_workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`academic_year` text NOT NULL,
	`grade` integer NOT NULL,
	`branch_code` text NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `class_workspaces_user_year_grade_branch_idx` ON `class_workspaces` (`user_id`,`academic_year`,`grade`,`branch_code`);--> statement-breakpoint
CREATE INDEX `class_workspaces_user_year_idx` ON `class_workspaces` (`user_id`,`academic_year`);