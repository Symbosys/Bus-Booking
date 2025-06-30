/*
  Warnings:

  - Added the required column `seats` to the `Bus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bus` ADD COLUMN `NoOfSeaterSeats` INTEGER NULL,
    ADD COLUMN `NoOfSleeperSeats` INTEGER NULL,
    ADD COLUMN `seats` INTEGER NOT NULL,
    MODIFY `acType` ENUM('AC', 'Non_AC') NOT NULL DEFAULT 'Non_AC',
    MODIFY `seaterType` ENUM('sleeper', 'seater') NOT NULL DEFAULT 'seater',
    MODIFY `deckType` ENUM('lower', 'upper') NOT NULL DEFAULT 'lower';

-- CreateTable
CREATE TABLE `Seat` (
    `id` VARCHAR(191) NOT NULL,
    `busId` VARCHAR(191) NOT NULL,
    `seatNumber` VARCHAR(191) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Unassigned') NOT NULL DEFAULT 'Unassigned',
    `isBooked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Seat` ADD CONSTRAINT `Seat_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Bus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
