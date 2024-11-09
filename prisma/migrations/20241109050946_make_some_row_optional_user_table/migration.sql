-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "storedData" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT
);
INSERT INTO "new_User" ("age", "createdAt", "email", "emailVerified", "fingerprintId", "fullName", "gender", "id", "password", "passwordHashed", "storedData", "updatedAt", "userPin", "username") SELECT "age", "createdAt", "email", "emailVerified", "fingerprintId", "fullName", "gender", "id", "password", "passwordHashed", "storedData", "updatedAt", "userPin", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
