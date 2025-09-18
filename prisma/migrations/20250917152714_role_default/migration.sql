-- AlterTable
ALTER TABLE `role` MODIFY `name` ENUM('client', 'admin', 'seller') NOT NULL DEFAULT 'client';
