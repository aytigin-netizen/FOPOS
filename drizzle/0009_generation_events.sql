DROP INDEX `document_generations_user_request_idx`;--> statement-breakpoint
CREATE INDEX `document_generations_user_request_idx` ON `document_generations` (`user_id`,`request_id`);
