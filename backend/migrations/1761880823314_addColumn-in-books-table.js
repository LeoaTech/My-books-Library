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
  pgm.dropColumn("books", "edition");
  pgm.addColumns("books", {
    edition: {
      type: "text",
      notNull: false,
      default: null,
    },
    quantity: {
      type: "integer",
      notNull: false,
      default: 1,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropColumn("books", ["edition","quantity"]);
};

module.exports = { up, down, shorthands };
