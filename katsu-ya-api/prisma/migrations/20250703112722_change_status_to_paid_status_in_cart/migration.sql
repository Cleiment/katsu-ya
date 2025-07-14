/*
  Warnings:

  - You are about to drop the column `status` on the `transaction_cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaction_cart` DROP COLUMN `status`,
    ADD COLUMN `paidStatus` TINYINT NOT NULL DEFAULT 0;
