ALTER TABLE `pedagogical_records` ADD `academic_year` text;--> statement-breakpoint
UPDATE `pedagogical_records`
SET `academic_year` = (
	SELECT `academic_year`
	FROM `teacher_profiles`
	WHERE `teacher_profiles`.`user_id` = `pedagogical_records`.`user_id`
);--> statement-breakpoint
CREATE INDEX `pedagogical_records_user_year_updated_idx` ON `pedagogical_records` (`user_id`,`academic_year`,`updated_at`);
