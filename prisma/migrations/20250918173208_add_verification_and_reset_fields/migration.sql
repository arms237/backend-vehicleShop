-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetPasswordExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL,
    ADD COLUMN `verificationExpiresAt` DATETIME(3) NULL;
