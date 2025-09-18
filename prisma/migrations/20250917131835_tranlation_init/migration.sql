/*
  Warnings:

  - You are about to drop the column `name` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `category` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `name` on the `supplier` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `vehicle` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - A unique constraint covering the columns `[slug]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,vehicleId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicleId,transactionId]` on the table `VehicleTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `Favorite_userId_fkey`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `Favorite_vehicleId_fkey`;

-- DropForeignKey
ALTER TABLE `vehicleimage` DROP FOREIGN KEY `VehicleImage_vehicleId_fkey`;

-- DropForeignKey
ALTER TABLE `vehicletransaction` DROP FOREIGN KEY `VehicleTransaction_transactionId_fkey`;

-- DropIndex
DROP INDEX `Favorite_userId_fkey` ON `favorite`;

-- DropIndex
DROP INDEX `Favorite_vehicleId_fkey` ON `favorite`;

-- DropIndex
DROP INDEX `VehicleImage_vehicleId_fkey` ON `vehicleimage`;

-- DropIndex
DROP INDEX `VehicleTransaction_transactionId_fkey` ON `vehicletransaction`;

-- AlterTable
ALTER TABLE `brand` DROP COLUMN `name`,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `description`,
    DROP COLUMN `name`,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `role` MODIFY `name` ENUM('client', 'admin', 'seller') NOT NULL;

-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `name`,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `totalAmount` DECIMAL(10, 2) NULL,
    MODIFY `status` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `preferredLanguage` VARCHAR(191) NOT NULL DEFAULT 'fr',
    ADD COLUMN `verificationToken` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `status` ENUM('available', 'sold', 'rented', 'maintenance') NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE `vehicleimage` ADD COLUMN `alt` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Language` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category_Translation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `languageId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_Translation_categoryId_languageId_key`(`categoryId`, `languageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand_Translation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `brandId` VARCHAR(191) NOT NULL,
    `languageId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Brand_Translation_brandId_languageId_key`(`brandId`, `languageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier_Translation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `languageId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Supplier_Translation_supplierId_languageId_key`(`supplierId`, `languageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle_Translation` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `languageId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Vehicle_Translation_vehicleId_languageId_key`(`vehicleId`, `languageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Brand_slug_key` ON `Brand`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_slug_key` ON `Category`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Favorite_userId_vehicleId_key` ON `Favorite`(`userId`, `vehicleId`);

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_slug_key` ON `Supplier`(`slug`);

-- CreateIndex
CREATE INDEX `Transaction_status_idx` ON `Transaction`(`status`);

-- CreateIndex
CREATE INDEX `Transaction_createdAt_idx` ON `Transaction`(`createdAt`);

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_reference_key` ON `Vehicle`(`reference`);

-- CreateIndex
CREATE INDEX `Vehicle_status_idx` ON `Vehicle`(`status`);

-- CreateIndex
CREATE INDEX `Vehicle_createdAt_idx` ON `Vehicle`(`createdAt`);

-- CreateIndex
CREATE UNIQUE INDEX `VehicleTransaction_vehicleId_transactionId_key` ON `VehicleTransaction`(`vehicleId`, `transactionId`);

-- AddForeignKey
ALTER TABLE `Category_Translation` ADD CONSTRAINT `Category_Translation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category_Translation` ADD CONSTRAINT `Category_Translation_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `Language`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Brand_Translation` ADD CONSTRAINT `Brand_Translation_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Brand_Translation` ADD CONSTRAINT `Brand_Translation_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `Language`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier_Translation` ADD CONSTRAINT `Supplier_Translation_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier_Translation` ADD CONSTRAINT `Supplier_Translation_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `Language`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle_Translation` ADD CONSTRAINT `Vehicle_Translation_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle_Translation` ADD CONSTRAINT `Vehicle_Translation_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `Language`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleImage` ADD CONSTRAINT `VehicleImage_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleTransaction` ADD CONSTRAINT `VehicleTransaction_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `transaction` RENAME INDEX `Transaction_userId_fkey` TO `Transaction_userId_idx`;

-- RenameIndex
ALTER TABLE `vehicle` RENAME INDEX `Vehicle_brandId_fkey` TO `Vehicle_brandId_idx`;

-- RenameIndex
ALTER TABLE `vehicle` RENAME INDEX `Vehicle_categoryId_fkey` TO `Vehicle_categoryId_idx`;
