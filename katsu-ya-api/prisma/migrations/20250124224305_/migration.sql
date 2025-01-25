/*
  Warnings:

  - You are about to drop the column `status` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `transaction_cart` ADD COLUMN `status` TINYINT NOT NULL DEFAULT 0;
