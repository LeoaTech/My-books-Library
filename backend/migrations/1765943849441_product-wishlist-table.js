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
  pgm.sql(`
    CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL REFERENCES public.entities(id),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notified BOOLEAN DEFAULT FALSE, 
    UNIQUE(entity_id, user_id, book_id)  );
`);

  pgm.sql(`
    CREATE INDEX idx_wishlist_book_notified ON wishlist(book_id, notified) WHERE notified = FALSE;
    CREATE INDEX idx_wishlist_entity_book ON wishlist(entity_id, book_id);`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("wishlist");
  pgm.dropIndex("wishlist", "idx_wishlist_book_notified", {
    ifExists: true,
  });

  pgm.dropIndex("wishlist", "idx_wishlist_entity_book", {
    ifExists: true,
  });
};
module.exports ={up,down, shorthands}