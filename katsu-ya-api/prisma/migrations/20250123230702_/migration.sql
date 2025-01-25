/*
  Warnings:

  - You are about to drop the column `bayar` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `bayar`,
    ADD COLUMN `paid` INTEGER NOT NULL DEFAULT 0;
