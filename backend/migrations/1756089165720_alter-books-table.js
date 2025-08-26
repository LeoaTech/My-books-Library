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
  pgm.alterColumn("books", "vendor_id", {
    notNull: false,
  });
  pgm.renameColumn("books", "rental_price", "member_price");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.alterColumn("books", "vendor_id", {
    notNull: true,
  });
  pgm.renameColumn("books", "member_price", "rental_price");
};

module.exports={up,down,shorthands}
