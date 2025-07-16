-- AlterTable
ALTER TABLE `Menu` ADD COLUMN `idCategory` INTEGER NULL;

-- CreateTable
CREATE TABLE `menu_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `menu_category_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Menu_idCategory_idx` ON `Menu`(`idCategory`);

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_idCategory_fkey` FOREIGN KEY (`idCategory`) REFERENCES `menu_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
