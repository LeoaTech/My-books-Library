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
  // Drop columns
  pgm.dropColumns("orders", [
    "name",
    "address",
    "city",
    "country",
    "phone",
    "email",
    "order_by",
    "payment_id",
    "tracking_id",
    "mode_of_payment",
  ]);

  //   Add user ID reference
  pgm.addColumn("orders", {
    user_id: {
      type: "integer",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  //add colums 
  pgm.addColumns("orders", {
    order_status: { type: "text", notNull: false },
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
    // Drop newly added columns
  pgm.dropColumns('orders', ['user_id', 'order_status', 'created_at', 'updated_at']);

  // Re-add dropped columns
  pgm.addColumns('orders', {
    name: { type: 'text' },
    address: { type: 'text' },
    city: { type: 'text' },
    country: { type: 'text' },
    phone: { type: 'text' },
    email: { type: 'text' },
    order_by: { type: 'text', notNull: true },
    payment_id: { type: 'text' },
    tracking_id: {
      type: 'text',
      notNull: true,
      references: 'tracking(tracking_id)',
    },
    mode_of_payment: { type: 'text' },
  });
};


module.exports ={up,down ,shorthands}