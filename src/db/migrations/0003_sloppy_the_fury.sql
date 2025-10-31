PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_garbage_categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_garbage_categories`("id", "name", "created_at", "updated_at") SELECT "id", "name", "created_at", "updated_at" FROM `garbage_categories`;--> statement-breakpoint
DROP TABLE `garbage_categories`;--> statement-breakpoint
ALTER TABLE `__new_garbage_categories` RENAME TO `garbage_categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_garbage_Items` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`garbage_category` text NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`garbage_category`) REFERENCES `garbage_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_garbage_Items`("id", "name", "garbage_category", "note", "created_at", "updated_at") SELECT "id", "name", "garbage_category", "note", "created_at", "updated_at" FROM `garbage_Items`;--> statement-breakpoint
DROP TABLE `garbage_Items`;--> statement-breakpoint
ALTER TABLE `__new_garbage_Items` RENAME TO `garbage_Items`;