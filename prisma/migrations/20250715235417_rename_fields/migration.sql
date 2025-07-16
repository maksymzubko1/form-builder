/*
  Warnings:

  - You are about to drop the column `viewer_email` on the `FormView` table. All the data in the column will be lost.
  - You are about to drop the column `viewer_ip` on the `FormView` table. All the data in the column will be lost.
  - Added the required column `viewerEmail` to the `FormView` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormView" DROP COLUMN "viewer_email",
DROP COLUMN "viewer_ip",
ADD COLUMN     "viewerEmail" TEXT NOT NULL,
ADD COLUMN     "viewerIp" TEXT;
