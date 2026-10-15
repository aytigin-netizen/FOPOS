CREATE TABLE `teaching_timetables` (
	`user_id` text NOT NULL,
	`academic_year` text NOT NULL,
	`timetable_json` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `academic_year`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
