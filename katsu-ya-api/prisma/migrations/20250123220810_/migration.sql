/*
  Warnings:

  - You are about to drop the column `isUsage` on the `ingredient_transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ingredient_transaction` DROP COLUMN `isUsage`,
    ADD COLUMN `is_usage` TINYINT NOT NULL DEFAULT 0;
