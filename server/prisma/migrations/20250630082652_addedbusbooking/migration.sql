/*
  Warnings:

  - You are about to drop the column `NoOfSeaterSeats` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the column `NoOfSleeperSeats` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the column `acType` on the `bus` table. All the data in the column will be lost.
  - You are about to drop the column `seaterType` on the `bus` table. All the data in the column will be lost.
  - You are about to alter the column `deckType` on the `bus` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(2))`.
  - You are about to alter the column `time` on the `bus` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `bus` DROP COLUMN `NoOfSeaterSeats`,
    DROP COLUMN `NoOfSleeperSeats`,
    DROP COLUMN `acType`,
    DROP COLUMN `seaterType`,
    ADD COLUMN `TotalSleeper` INTEGER NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `seatLayout` ENUM('TWO_BY_ONE', 'TWO_BY_TWO', 'THREE_BY_TWO') NOT NULL DEFAULT 'TWO_BY_ONE',
    ADD COLUMN `seatType` ENUM('SEATER', 'SLEEPER', 'MIXED') NOT NULL DEFAULT 'SEATER',
    ADD COLUMN `totalSeaters` INTEGER NULL,
    ADD COLUMN `type` ENUM('AC', 'Non_AC') NOT NULL DEFAULT 'Non_AC',
    MODIFY `deckType` ENUM('SINGLE', 'DOUBLE', 'TRIPLE') NOT NULL DEFAULT 'SINGLE',
    MODIFY `time` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `Route` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `distance` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `busId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RouteSegment` (
    `id` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `startLocation` VARCHAR(191) NOT NULL,
    `endLocation` VARCHAR(191) NOT NULL,
    `sequence` INTEGER NOT NULL,
    `distance` INTEGER NULL,
    `duration` INTEGER NULL,
    `price` DOUBLE NULL,
    `arrivalTime` DATETIME(3) NULL,
    `departureTime` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusStoppage` (
    `id` VARCHAR(191) NOT NULL,
    `busId` VARCHAR(191) NOT NULL,
    `busStandName` VARCHAR(191) NOT NULL,
    `arrivalTime` DATETIME(3) NULL,
    `departureTime` DATETIME(3) NULL,
    `status` ENUM('SCHEDULED', 'ARRIVED', 'DEPARTED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `busId` VARCHAR(191) NOT NULL,
    `seatId` VARCHAR(191) NOT NULL,
    `passengerGender` ENUM('Male', 'Female', 'Unassigned') NOT NULL DEFAULT 'Unassigned',
    `routeId` VARCHAR(191) NOT NULL,
    `boardingSegmentId` VARCHAR(191) NULL,
    `alightingSegmentId` VARCHAR(191) NULL,
    `bookingDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `travelDate` DATETIME(3) NOT NULL,
    `price` DOUBLE NOT NULL,
    `status` ENUM('CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'CONFIRMED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Bus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteSegment` ADD CONSTRAINT `RouteSegment_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusStoppage` ADD CONSTRAINT `BusStoppage_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Bus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Bus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_seatId_fkey` FOREIGN KEY (`seatId`) REFERENCES `Seat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_boardingSegmentId_fkey` FOREIGN KEY (`boardingSegmentId`) REFERENCES `RouteSegment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_alightingSegmentId_fkey` FOREIGN KEY (`alightingSegmentId`) REFERENCES `RouteSegment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
