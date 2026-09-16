/*
  Warnings:

  - You are about to drop the column `createAt` on the `FavoriteRecipe` table. All the data in the column will be lost.
  - Added the required column `recipeImage` to the `FavoriteRecipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeName` to the `FavoriteRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FavoriteRecipe" DROP CONSTRAINT "FavoriteRecipe_userId_fkey";

-- AlterTable
ALTER TABLE "FavoriteRecipe" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recipeImage" TEXT NOT NULL,
ADD COLUMN     "recipeName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FavoriteRecipe" ADD CONSTRAINT "FavoriteRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
