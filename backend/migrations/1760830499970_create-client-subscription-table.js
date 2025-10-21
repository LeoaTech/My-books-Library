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
  pgm.createTable("client_subscription", {
    id: {
      type: "SERIAL",
      primaryKey: true,
      notNull: true,
    },
    user_id: {
      type: "INTEGER",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    stripe_price_id: { type: "TEXT", notNull: false },
    stripe_product_id: { type: "TEXT", notNull: false },
    subscription_id: {
      type: "TEXT",
      notNull: false,
    },
    current_period_end: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },
    subscription_valid_until: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },
    latest_invoice_id: {
      type: "TEXT",
    },
    status: {
      type: "TEXT",
      notNull: true, //active, cancelled,
    },
    start_date: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
      notNull: true,
    },
    end_date: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },
    auto_renew: {
      type: "BOOLEAN",
      notNull: true,
      default: true,
    },
    created_at: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("client_subscription");
};

module.exports = { up, down, shorthands };
