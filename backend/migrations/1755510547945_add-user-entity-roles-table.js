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
  pgm.createTable("user_entity_roles", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    entity_id: {
      type: "integer",
      notNull: true,
      references: "entity",
      onDelete: "CASCADE",
    },
    branch_id: {
      type: "integer",
      notNull: true,
      references: "branches",
      onDelete: "CASCADE",
    },
    role_id: {
      type: "integer",
      notNull: true,
      references: "roles",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("user_entity_roles", "unique_user_entity_branch_role", {
    unique: ["user_id", "entity_id", "branch_id", "role_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("user_entity_roles");
};

module.exports = { up, down, shorthands };
