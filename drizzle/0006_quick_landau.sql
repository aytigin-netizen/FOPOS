DROP INDEX `class_workspaces_user_year_grade_branch_idx`;--> statement-breakpoint
ALTER TABLE `class_workspaces` ADD `subject_code` text DEFAULT 'philosophy' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `class_workspaces_user_year_subject_grade_branch_idx` ON `class_workspaces` (`user_id`,`academic_year`,`subject_code`,`grade`,`branch_code`);