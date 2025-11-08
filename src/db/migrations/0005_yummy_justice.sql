PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `__new_garbage_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`garbage_category` integer NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`garbage_category`) REFERENCES `garbage_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_garbage_items` SELECT * FROM `garbage_Items`;
--> statement-breakpoint
DROP TABLE `garbage_Items`;
--> statement-breakpoint
ALTER TABLE `__new_garbage_items` RENAME TO `garbage_items`;
--> statement-breakpoint
PRAGMA foreign_keys=ON;