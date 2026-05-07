CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`stripeSessionId` varchar(255) NOT NULL,
	`productKey` varchar(100) NOT NULL,
	`amountCents` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	`emailD0Sent` timestamp,
	`emailD3Sent` timestamp,
	`emailD5Sent` timestamp,
	`emailD8Sent` timestamp,
	`tagSettimanaZeroApplied` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
