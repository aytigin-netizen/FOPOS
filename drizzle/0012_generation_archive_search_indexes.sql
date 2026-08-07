CREATE INDEX `document_generations_user_year_curriculum_cursor_idx`
ON `document_generations` (`user_id`,`academic_year`,`curriculum_id`,`generated_at`,`id`);
CREATE INDEX `document_generations_user_year_event_id_idx`
ON `document_generations` (`user_id`,`academic_year`,`id` COLLATE NOCASE,`generated_at`,`id`);
CREATE INDEX `document_generations_user_year_request_cursor_idx`
ON `document_generations` (`user_id`,`academic_year`,`request_id`,`generated_at`,`id`);
CREATE INDEX `document_generations_user_year_request_id_idx`
ON `document_generations` (`user_id`,`academic_year`,`request_id` COLLATE NOCASE,`generated_at`,`id`);
CREATE INDEX `document_generations_user_year_decision_cursor_idx`
ON `document_generations` (`user_id`,`academic_year`,`decision_id`,`generated_at`,`id`);
CREATE INDEX `document_generations_user_year_decision_id_idx`
ON `document_generations` (`user_id`,`academic_year`,`decision_id` COLLATE NOCASE,`generated_at`,`id`);
CREATE INDEX `document_generations_user_year_record_cursor_idx`
ON `document_generations` (`user_id`,`academic_year`,`record_id`,`generated_at`,`id`);
CREATE INDEX `document_generations_user_year_record_id_idx`
ON `document_generations` (`user_id`,`academic_year`,`record_id` COLLATE NOCASE,`generated_at`,`id`);
