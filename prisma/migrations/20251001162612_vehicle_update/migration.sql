/*
  Warnings:

  - You are about to drop the column `reference` on the `vehicle` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Vehicle_reference_key` ON `vehicle`;

-- AlterTable
ALTER TABLE `vehicle` DROP COLUMN `reference`;
