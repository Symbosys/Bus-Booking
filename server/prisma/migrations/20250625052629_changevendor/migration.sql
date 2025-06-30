/*
  Warnings:

  - You are about to drop the `verdor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `verdor`;

-- CreateTable
CREATE TABLE `vendor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `number` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `pan_number` VARCHAR(191) NULL,
    `panotp` VARCHAR(191) NULL,
    `addharotp` VARCHAR(191) NULL,
    `addhar_number` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vendor_email_key`(`email`),
    UNIQUE INDEX `vendor_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
