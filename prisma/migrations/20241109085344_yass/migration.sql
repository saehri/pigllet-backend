/*
  Warnings:

  - You are about to drop the column `verificationLink` on the `EmailVerification` table. All the data in the column will be lost.
  - You are about to drop the column `storedData` on the `User` table. All the data in the column will be lost.
  - Added the required column `verificationId` to the `EmailVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `StoredData` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "verificationId" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "EmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmailVerification" ("createdAt", "id", "userId") SELECT "createdAt", "id", "userId" FROM "EmailVerification";
DROP TABLE "EmailVerification";
ALTER TABLE "new_EmailVerification" RENAME TO "EmailVerification";
CREATE UNIQUE INDEX "EmailVerification_userId_key" ON "EmailVerification"("userId");
CREATE UNIQUE INDEX "EmailVerification_verificationId_key" ON "EmailVerification"("verificationId");
CREATE TABLE "new_StoredData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    CONSTRAINT "StoredData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StoredData" ("id", "userId") SELECT "id", "userId" FROM "StoredData";
DROP TABLE "StoredData";
ALTER TABLE "new_StoredData" RENAME TO "StoredData";
CREATE UNIQUE INDEX "StoredData_userId_key" ON "StoredData"("userId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "passwordHashed" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "userPin" TEXT,
    "fingerprintId" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT
);
INSERT INTO "new_User" ("age", "createdAt", "email", "emailVerified", "fingerprintId", "fullName", "gender", "id", "password", "passwordHashed", "updatedAt", "userPin", "username") SELECT "age", "createdAt", "email", "emailVerified", "fingerprintId", "fullName", "gender", "id", "password", "passwordHashed", "updatedAt", "userPin", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
