/*
  Warnings:

  - A unique constraint covering the columns `[id_order]` on the table `transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction` ALTER COLUMN `id_order` DROP DEFAULT;

-- AlterTable
ALTER TABLE `transaction_cart` ADD COLUMN `paid` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `payment_type` VARCHAR(191) NOT NULL DEFAULT 'cash';

-- CreateIndex
CREATE UNIQUE INDEX `transaction_id_order_key` ON `transaction`(`id_order`);
