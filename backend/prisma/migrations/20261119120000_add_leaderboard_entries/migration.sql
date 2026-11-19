-- CreateTable
CREATE TABLE `leaderboard_entries` (
    `id` VARCHAR(191) NOT NULL,
    `minecraftName` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `note` VARCHAR(200) NULL,
    `donatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `leaderboard_entries_minecraftName_idx`(`minecraftName`),
    INDEX `leaderboard_entries_donatedAt_idx`(`donatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
