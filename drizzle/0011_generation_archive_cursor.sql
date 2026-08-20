CREATE INDEX `document_generations_user_year_cursor_idx`
ON `document_generations` (`user_id`,`academic_year`,`generated_at`,`id`);--> statement-breakpoint
CREATE INDEX `document_generations_user_year_type_cursor_idx`
ON `document_generations` (`user_id`,`academic_year`,`document_type`,`generated_at`,`id`);
