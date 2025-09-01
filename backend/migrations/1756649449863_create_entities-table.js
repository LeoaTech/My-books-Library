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
  // Libraries
  pgm.createTable("entities", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: { type: "text", notNull: true },
    type_of_books: { type: "text" },
    multiple_branches: { type: "boolean" },
    deliver_inter_city: { type: "boolean" },
    city: { type: "text" },
    country: { type: "text" },
    phone: { type: "text" },
    address: { type: "text" },
    description: { type: "text" },
    subdomain: { type: "text", notNull: true, unique: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: { type: "timestamp without time zone" },
  });

  /* Branches  */

  pgm.createTable("branches", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    name: { type: "text", notNull: true },
    city: { type: "text" },
    country: { type: "text" },
    phone: { type: "text" },
    address: { type: "text" },
    is_default: { type: "boolean", default: false },
    entity_id:{ 
      type: "integer",
      references: "entities",
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: { type: "timestamp without time zone" },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropTable("branches");
    pgm.dropTable("entities");
};



module.exports ={up,down, shorthands}