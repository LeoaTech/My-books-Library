/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
  // Insert default permissions
  const resources = [
    "BOOK",
    "AUTHOR",
    "PUBLISHER",
    "CATEGORY",
    "CONDITION",
    "COVER",
    "TRACKING",
    "ORDER",
    "RETURN",
    "SHIPPING",
    "QUALITY-CONTROL",
    "BOOKING",
    "SETTING",
    "BRANCH",
    "VENDOR",
    "ACCOUNT",
    "NOTIFICATION",
    "ROLE",
    "PERMISSION",
    "USER",
  ];

  const operations = ["CREATE", "READ", "EDIT", "DELETE"];

  const values = resources.flatMap((resource) =>
    operations.map((op) => `('${op} ${resource}', true)`)
  );

  // Constraint: permission names must be unique
  pgm.addConstraint("permissions", "permissions_name_unique", {
    unique: ["name"],
  });
  pgm.sql(`
    INSERT INTO permissions (name, is_default)
    VALUES ${values.join(", ")}
    ON CONFLICT (name) DO NOTHING;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropConstraint("permissions", "permissions_name_unique");

  const resources = [
    "BOOK",
    "AUTHOR",
    "PUBLISHER",
    "CATEGORY",
    "CONDITION",
    "COVER",
    "TRACKING",
    "ORDER",
    "RETURN",
    "SHIPPING",
    "QUALITY-CONTROL",
    "BOOKING",
    "SETTING",
    "BRANCH",
    "VENDOR",
    "ACCOUNT",
    "NOTIFICATION",
    "ROLE",
    "PERMISSION",
    "USER",
  ];

  const operations = ["CREATE", "READ", "EDIT", "DELETE"];

  const names = resources.flatMap((resource) =>
    operations.map((op) => `'${op} ${resource}'`)
  );

  pgm.sql(`
    DELETE FROM permissions
    WHERE name IN (${names.join(", ")})
    AND is_default = true;
  `);
};

module.exports = { shorthands, up, down };
