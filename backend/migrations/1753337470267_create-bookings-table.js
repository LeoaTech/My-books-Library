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
  pgm.createTable("bookings", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    vendor_id: {
      type: "integer",
      notNull: true,
      references: "vendors(id)",
      onDelete: "CASCADE",
    },
    items: {
      type: "jsonb",
      notNull: true,
    },
    borrow_date: {
      type: "timestamp",
      default: pgm.func("now()"),
      notNull: true,
    },
    return_due: {
      type: "date",
      notNull: true,
    },
    return_date: {
      type: "date",
    },
    renew_return_date: {
      type: "date",
    },
    renewed: {
      type: "boolean",
      default: false,
      notNull: true,
    },
    booking_status: {
      type: "text",
      notNull: true,
    },
    shipping_address: {
      type: "text",
    },
    shipping_city: {
      type: "text",
    },
    shipping_country: {
      type: "text",
    },
    shipping_phone: {
      type: "text",
    },
    credits_used: {
      type: "integer",
      default: 0,
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("now()"),
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      default: pgm.func("now()"),
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
  pgm.dropTable("bookings");
};

module.exports = { up, down, shorthands };
