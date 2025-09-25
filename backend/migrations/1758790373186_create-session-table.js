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
  // Create session table
  pgm.createTable("session", {
    sid: {
      type: "varchar",
      notNull: true,
      primaryKey: true,
    },
    sess: {
      type: "json",
      notNull: true,
    },
    expire: {
      type: "timestamp(6)",
      notNull: true,
    },
  });

  // Create index on expire
  pgm.createIndex("session", "expire", {
    name: "IDX_session_expire",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("session");
};


module.exports={up,down,shorthands}