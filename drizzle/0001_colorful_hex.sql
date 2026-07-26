CREATE TABLE `pedagogical_records` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`record_id` text NOT NULL,
	`revision` integer NOT NULL,
	`status` text NOT NULL,
	`immutable_fingerprint` text NOT NULL,
	`payload_json` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pedagogical_records_user_record_revision_idx` ON `pedagogical_records` (`user_id`,`record_id`,`revision`);--> statement-breakpoint
CREATE INDEX `pedagogical_records_user_updated_idx` ON `pedagogical_records` (`user_id`,`updated_at`);