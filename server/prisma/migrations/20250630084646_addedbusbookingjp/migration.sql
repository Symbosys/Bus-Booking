-- AlterTable
ALTER TABLE `booking` MODIFY `status` ENUM('CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';
