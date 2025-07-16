/*
  Warnings:

  - You are about to drop the column `detail` on the `menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Menu` DROP COLUMN `detail`,
    ADD COLUMN `desc` TEXT NOT NULL;
