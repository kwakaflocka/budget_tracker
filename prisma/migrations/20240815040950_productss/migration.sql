/*
  Warnings:

  - The primary key for the `MonthHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order` on the `Product` table. All the data in the column will be lost.
  - Added the required column `import` to the `MonthHistory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonthHistory" (
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "import" REAL NOT NULL,
    "order" REAL NOT NULL,
    "returns" REAL NOT NULL,

    PRIMARY KEY ("userId", "day", "month", "year")
);
INSERT INTO "new_MonthHistory" ("day", "month", "order", "returns", "userId", "year") SELECT "day", "month", "order", "returns", "userId", "year" FROM "MonthHistory";
DROP TABLE "MonthHistory";
ALTER TABLE "new_MonthHistory" RENAME TO "MonthHistory";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'import',
    "category" TEXT NOT NULL,
    "categoryIcon" TEXT NOT NULL,
    "income" REAL
);
INSERT INTO "new_Product" ("amount", "category", "categoryIcon", "createdAt", "date", "description", "id", "income", "type", "updateAt", "userId") SELECT "amount", "category", "categoryIcon", "createdAt", "date", "description", "id", "income", "type", "updateAt", "userId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
