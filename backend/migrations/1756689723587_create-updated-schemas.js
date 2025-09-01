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
  //   Bookings
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
    entity_id: {
      type: "integer",
      notNull: true,
      references: "entities",
      onDelete: "CASCADE",
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

  //   Orders
  pgm.createTable("orders", {
    id: { type: "serial", primaryKey: true, notNull: true },
    shipping_address: { type: "text" },
    shipping_city: { type: "text" },
    shipping_country: { type: "text" },
    shipping_phone: { type: "text" },
    discount_code: { type: "text" },
    discount_value: { type: "integer" },
    items: { type: "jsonb" },
    entity_id: {
      type: "integer",
      references: "entities",
      notNull: true,
      onDelete: "CASCADE",
    },
    order_on: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    user_id: { type: "integer", notNull: true },
    order_status: { type: "text" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: { type: "timestamp", default: pgm.func("now()") },
  });

  pgm.addConstraint("orders", "orders_user_id_fkey", {
    foreignKeys: {
      columns: ["user_id"],
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  //   Not modified Tables
  pgm.sql(`
      CREATE TABLE public.role_permissions (
      role_id integer NOT NULL REFERENCES public.roles(role_id),
      permission_id integer NOT NULL REFERENCES public.permissions(permission_id),
      CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id)
    );
    
    CREATE TABLE public.ratings (
      id serial PRIMARY KEY,
      rating integer,
      comments text,
      rated_by text NOT NULL,
      entity_id integer REFERENCES public.entities(id),
      rated_on timestamp without time zone DEFAULT now() NOT NULL,
      book_id integer REFERENCES public.books(id)
    );

      CREATE TABLE public.logistics (
      id serial PRIMARY KEY,
      logistic_partner_name text,
      status text,
      status_date date,
      entity_id integer REFERENCES public.entities(id),
      tracking_id text REFERENCES public.tracking(tracking_id),
      order_id integer REFERENCES public.orders(id)
    );

    CREATE TABLE public.return_item (
      id serial PRIMARY KEY,
      entity_id integer REFERENCES public.entities(id),
      book_id integer REFERENCES public.books(id)
    );
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.sql(`
        DROP TABLE IF EXISTS public.role_permissions;
        DROP TABLE IF EXISTS public.bookings;
        DROP TABLE IF EXISTS public.ratings;
        
        DROP TABLE IF EXISTS public.logistics;
        DROP TABLE IF EXISTS public.return_item;
        DROP TABLE IF EXISTS public.orders;
       
        `);
  pgm.dropTable("vendors");
};

module.exports = { up, down, shorthands };
