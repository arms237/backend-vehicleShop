-- DropForeignKey
ALTER TABLE `vehicle` DROP FOREIGN KEY `Vehicle_supplierId_fkey`;

-- DropIndex
DROP INDEX `Vehicle_supplierId_fkey` ON `vehicle`;

-- AlterTable
ALTER TABLE `vehicle` MODIFY `supplierId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
