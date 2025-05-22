CREATE TABLE "RolePageAccess" (
  "roleId" INTEGER NOT NULL,
  "page" VARCHAR(100) NOT NULL,
  "allowed" BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY ("roleId", "page"),
  FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE CASCADE
);

-- Начальные права (пример)
-- Admin: доступ ко всему
INSERT INTO "RolePageAccess" ("roleId", "page", "allowed") VALUES
  (16, 'Admin', TRUE),
  (16, 'Manager', TRUE),
  (16, 'EditUserGroups', TRUE),
  (16, 'EditUsers', TRUE),
  (16, 'EditDatabase', TRUE),
  (16, 'photostudioRequests', TRUE),
  (16, 'printinghouseRequests', TRUE),
  (16, 'PhoneRequests', TRUE);

-- Manager: только к нужным страницам
INSERT INTO "RolePageAccess" ("roleId", "page", "allowed") VALUES
  (17, 'Manager', TRUE),
  (17, 'photostudioRequests', TRUE),
  (17, 'printinghouseRequests', TRUE),
  (17, 'PhoneRequests', TRUE);

-- User: нет доступа к этим страницам
