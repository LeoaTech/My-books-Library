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
    
  pgm.createTable("vendors", {
    id: { type: "serial", notNull: true, primaryKey: true },
    name: { type: "text", notNull: true },
    role_id: { type: "integer", references: "roles",onDelete:"CASCADE" },
    last_login: { type: "date" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createTable("books", {
    id: { type: "serial", notNull: true, primaryKey: true },
    title: { type: "text", notNull: true },
    summary: { type: "text", notNull: true },
    member_price: { type: "text" },
    purchase_price: { type: "text" },
    discount_percentage: { type: "text" },
    is_available: { type: "boolean" },
    comments: { type: "text" },
    publish_year: { type: "text" },
    cover_img_url: { type: "jsonb" },
    isbn: { type: "text" },
    credit: { type: "integer" },
    added_by: { type: "integer" },
    vendor_id: { type: "integer" },
    author: { type: "integer", notNull: true },
    category: { type: "integer", notNull: true },
    cover: { type: "integer", notNull: true },
    condition: { type: "integer", notNull: true },
    publisher: { type: "integer", notNull: true },
    branch_id: { type: "integer", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: { type: "timestamp", default: pgm.func("now()") },
  });

  pgm.addConstraint("books", "books_added_by_fkey", {
    foreignKeys: {
      columns: ["added_by"],
      references: "roles(role_id)",
    },
  });
  pgm.addConstraint("books", "books_author_fkey", {
    foreignKeys: {
      columns: ["author"],
      references: "authors(id)",
    },
  });
  pgm.addConstraint("books", "books_branch_id_fkey", {
    foreignKeys: {
      columns: ["branch_id"],
      references: "branches(id)",
    },
  });
  pgm.addConstraint("books", "books_category_fkey", {
    foreignKeys: {
      columns: ["category"],
      references: "categories(id)",
    },
  });
  pgm.addConstraint("books", "books_condition_fkey", {
    foreignKeys: {
      columns: ["condition"],
      references: "conditions(id)",
    },
  });

  
  pgm.addConstraint("books", "books_cover_fkey", {
    foreignKeys: {
      columns: ["cover"],
      references: "covers(id)",
    },
  });
  pgm.addConstraint("books", "books_publisher_fkey", {
    foreignKeys: {
      columns: ["publisher"],
      references: "publishers(id)",
    },
  });
  pgm.addConstraint("books", "books_vendor_id_fkey", {
    foreignKeys: {
      columns: ["vendor_id"],
      references: "vendors(id)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("vendors");
  pgm.dropConstraint("books", "books_vendor_id_fkey");
  pgm.dropConstraint("books", "books_publisher_fkey");
  pgm.dropConstraint("books", "books_cover_fkey");
  pgm.dropConstraint("books", "books_condition_fkey");
  pgm.dropConstraint("books", "books_category_fkey");
  pgm.dropConstraint("books", "books_branch_id_fkey");
  pgm.dropConstraint("books", "books_author_fkey");
  pgm.dropConstraint("books", "books_added_by_fkey");
  pgm.dropConstraint("books", "books_pkey");
  pgm.dropTable("books");
};

module.exports = { up, down, shorthands };
