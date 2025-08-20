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

  // Drop columns if it exists
  pgm.dropColumns("users", ["role_id", "branch_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.addColumn("users", {
    branch_id: {
      type: "integer",
      references: "branches",
      onDelete: "SET NULL",
    },
    role_id:{
        type:"integer",
        references:"roles"
    }
  });
};

module.exports= {up, down, shorthands}
