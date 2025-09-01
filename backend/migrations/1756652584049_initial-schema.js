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

    CREATE TABLE public.roles (
      role_id serial PRIMARY KEY,
      name text NOT NULL,
      entity_id integer REFERENCES public.entities(id),
      is_default boolean,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

     CREATE TABLE public.permissions (
      permission_id serial PRIMARY KEY,
      name text NOT NULL,
      is_default BOOLEAN,
      entity_id integer REFERENCES public.entities(id),
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

     CREATE TABLE public.authors (
      id serial PRIMARY KEY,
      name text NOT NULL,
      description text,
      links text,
      entity_id integer REFERENCES public.entities(id),
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.categories (
      id serial PRIMARY KEY,
      name text NOT NULL,
      entity_id integer REFERENCES public.entities(id),
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.covers (
      id serial PRIMARY KEY,
      name text NOT NULL,
      entity_id integer REFERENCES public.entities(id),
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.conditions (
      id serial PRIMARY KEY,
      name text NOT NULL,
      entity_id integer REFERENCES public.entities(id),
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.publishers (
      id serial PRIMARY KEY,
      name text NOT NULL,
      description text,
      links text,
      entity_id integer REFERENCES public.entities(id),
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

     CREATE TABLE public.tracking (
      id serial PRIMARY KEY,
      tracking_id text NOT NULL UNIQUE,
      last_updated_status text,
      current_status text,
      entity_id integer REFERENCES public.entities(id)
    );
  `);

  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    name: { type: "text", notNull: true },
    email: { type: "text", notNull: true },
    password: { type: "text" },
    city: { type: "text" },
    country: { type: "text" },
    phone: { type: "text" },
    address: { type: "text" },
    reset_password_token: { type: "text" },
    img_url: { type: "text" },
    user_details: { type: "json" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: { type: "timestamp without time zone" },
  });

  // User Entity Roles Table
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
      references: "entities",
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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS public.publishers;
    DROP TABLE IF EXISTS public.conditions;
    DROP TABLE IF EXISTS public.covers;
    DROP TABLE IF EXISTS public.categories;
    DROP TABLE IF EXISTS public.authors;
    DROP TABLE IF EXISTS public.permissions;
    DROP TABLE IF EXISTS public.tracking;
    DROP TABLE IF EXISTS public.user_entity_roles;
    DROP TABLE IF EXISTS public.users;
    DROP TABLE IF EXISTS public.vendors;
    DROP TABLE IF EXISTS public.roles;

    `);
};

module.exports = { up, down, shorthands };
