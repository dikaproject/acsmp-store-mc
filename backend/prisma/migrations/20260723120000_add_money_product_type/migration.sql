-- AlterTable
ALTER TABLE `products`
    MODIFY `type` ENUM('COIN', 'MONEY', 'RANK', 'FEATURE', 'BATTLEPASS') NOT NULL;