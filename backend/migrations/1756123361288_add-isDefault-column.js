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
  // add identifier is_default for permissions
  pgm.addColumn("permissions", {
    is_default: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });

  pgm.addColumn("roles", {
    is_default: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });

  pgm.addColumn("branches", {
    is_default: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropColumn("permissions", "is_default");
  pgm.dropColumn("branches", "is_default");

  pgm.dropColumn("roles", "is_default");
};


module.exports={up,down,shorthands}