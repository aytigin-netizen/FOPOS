CREATE TABLE `exam_generation_history` (
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `subject` text NOT NULL,
  `dataset` text NOT NULL,
  `rounds_json` text NOT NULL DEFAULT '{}',
  `updated_at` text NOT NULL,
  PRIMARY KEY (`user_id`,`subject`,`dataset`)
);
