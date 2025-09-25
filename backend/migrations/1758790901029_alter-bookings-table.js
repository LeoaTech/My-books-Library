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
  pgm.alterColumn("bookings", "vendor_id", {
    notNull: false,
  });

  // Add available_renewals column
  pgm.addColumn("bookings", {
    available_renewals: {
      type: "integer",
      default:0,
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropColumn("bookings", "available_renewals");

  // change vendor_id back to required (not null)
  pgm.alterColumn("bookings", "vendor_id", {
    notNull: true,
  });
};

module.exports = { up, down, shorthands };
