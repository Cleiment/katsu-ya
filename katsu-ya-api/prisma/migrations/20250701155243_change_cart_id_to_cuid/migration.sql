/*
  Warnings:

  - The primary key for the `transaction_cart` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `transaction_cart_detail` DROP FOREIGN KEY `transaction_cart_detail_id_transaction_cart_fkey`;

-- AlterTable
ALTER TABLE `transaction_cart` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `transaction_cart_detail` MODIFY `id_transaction_cart` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `transaction_cart_detail` ADD CONSTRAINT `transaction_cart_detail_id_transaction_cart_fkey` FOREIGN KEY (`id_transaction_cart`) REFERENCES `transaction_cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
