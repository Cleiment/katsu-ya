/*
  Warnings:

  - You are about to drop the column `order_id` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `order_id`,
    ADD COLUMN `id_order` VARCHAR(191) NOT NULL DEFAULT '';
