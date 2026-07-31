CREATE TABLE `document_generations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`request_id` text NOT NULL,
	`decision_id` text NOT NULL,
	`record_id` text NOT NULL,
	`revision` integer NOT NULL,
	`document_type` text NOT NULL,
	`contract_version` text NOT NULL,
	`approved_at` text NOT NULL,
	`generated_at` text NOT NULL,
	`curriculum_id` text NOT NULL,
	`curriculum_dataset_version` text NOT NULL,
	`curriculum_outcome_code` text NOT NULL,
	`curriculum_json` text NOT NULL,
	`academic_year` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `document_generations_user_request_idx` ON `document_generations` (`user_id`,`request_id`);--> statement-breakpoint
CREATE INDEX `document_generations_user_year_generated_idx` ON `document_generations` (`user_id`,`academic_year`,`generated_at`);--> statement-breakpoint
CREATE INDEX `document_generations_user_record_revision_idx` ON `document_generations` (`user_id`,`record_id`,`revision`);