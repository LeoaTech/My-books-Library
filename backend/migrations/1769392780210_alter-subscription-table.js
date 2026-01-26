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
  pgm.dropColumns("subscriptions", ["latest_invoice_id", "end_date"]);

  pgm.addColumns("subscriptions", {
    cancel_at_period_end: {
      type: "boolean",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropColumn("subscriptions", "cancel_at_period_end");

  pgm.addColumns("subscriptions", {
    latest_invoice_id: {
      type: "TEXT",
    },
    end_date: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },
  });
};

module.exports = { up, down, shorthands };
