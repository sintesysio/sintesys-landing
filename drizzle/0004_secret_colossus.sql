ALTER TABLE `qualified_leads` ADD `cashFlowChallenge` varchar(500);--> statement-breakpoint
ALTER TABLE `qualified_leads` ADD `delegationChallenge` varchar(500);--> statement-breakpoint
ALTER TABLE `qualified_leads` ADD `shadowAIConcern` varchar(500);--> statement-breakpoint
ALTER TABLE `qualified_leads` ADD `successionConcern` varchar(500);--> statement-breakpoint
ALTER TABLE `qualified_leads` DROP COLUMN `manualHoursPerWeek`;