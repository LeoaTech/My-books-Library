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
  // Add branch_id column as foreign key to branches(id)
  pgm.addColumn("users", {
    branch_id: {
      type: "integer",
      references: "branches",
      onDelete: "SET NULL",
    },
  });

  // Drop exact_location column if it exists
  pgm.dropColumn("branches", "exact_location");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  // Re-add exact_location column
  pgm.addColumn("branches", {
    exact_location: { type: "text" }, // Change type if different
  });

  // Drop branch_id column
  pgm.dropColumn("users", "branch_id");
};


module.exports = {up,down,shorthands}