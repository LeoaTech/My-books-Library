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
  // Create Tables

  pgm.sql(`


    CREATE TABLE public.roles (
      role_id serial PRIMARY KEY,
      name text NOT NULL,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

     CREATE TABLE public.permissions (
      permission_id serial PRIMARY KEY,
      name text NOT NULL,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.entity (
      id serial PRIMARY KEY,
      name text NOT NULL,
      type_of_books text,
      multiple_branches boolean,
      deliver_inner_city boolean,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

     CREATE TABLE public.authors (
      id serial PRIMARY KEY,
      name text NOT NULL,
      description text,
      links text,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.categories (
      id serial PRIMARY KEY,
      name text NOT NULL,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.covers (
      id serial PRIMARY KEY,
      name text NOT NULL,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.conditions (
      id serial PRIMARY KEY,
      name text NOT NULL,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE public.publishers (
      id serial PRIMARY KEY,
      name text NOT NULL,
      description text,
      links text,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );

     CREATE TABLE public.tracking (
      id serial PRIMARY KEY,
      tracking_id text NOT NULL UNIQUE,
      last_updated_status text,
      current_status text
    );
  `);

  pgm.sql(`

    CREATE TABLE public.users (
      id serial PRIMARY KEY,
      name text NOT NULL,
      email character varying(255) NOT NULL,
      password text NOT NULL,
      role_id integer REFERENCES public.roles(role_id),
      reset_password_token text,
      img_url text,
      address JSONB,
      phone text,
      created_at timestamp without time zone DEFAULT now() NOT NULL,
      updated_at timestamp without time zone
    );

     CREATE TABLE public.tokens (
      id serial PRIMARY KEY,
      user_id integer REFERENCES public.users(id),
      token text,
      created_at timestamp without time zone DEFAULT now() NOT NULL,
      expired_at timestamp without time zone
    );

     CREATE TABLE public.role_permissions (
      role_id integer NOT NULL REFERENCES public.roles(role_id),
      permission_id integer NOT NULL REFERENCES public.permissions(permission_id),
      CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id)
    );

    CREATE TABLE public.vendors (
      id serial PRIMARY KEY,
      name text NOT NULL,
      role_id integer REFERENCES public.roles(role_id),
      last_login date,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );


     CREATE TABLE public.branches (
      id serial PRIMARY KEY,
      name text NOT NULL,
      exact_location text,
      entity_id integer REFERENCES public.entity(id),
      country text,
      city text,
      address text,
      phone text,
      created_at timestamp without time zone DEFAULT now() NOT NULL
    );


    CREATE TABLE public.books (
      id serial PRIMARY KEY,
      title text NOT NULL,
      summary text,
      rental_price text,
      purchase_price text,
      discount_percentage text NOT NULL,
      vendor_id integer REFERENCES public.vendors(id),
      author integer REFERENCES public.authors(id),
      category integer REFERENCES public.categories(id),
      cover integer REFERENCES public.covers(id),
      condition integer REFERENCES public.conditions(id),
      branch_id integer REFERENCES public.branches(id),
      is_available boolean,
      added_by integer REFERENCES public.roles(role_id),
      isbn text NOT NULL,
      cover_img_url jsonb,
      publisher integer REFERENCES public.publishers(id),
      comments text,
      publish_year text,
      credit integer,
      created_at timestamp without time zone DEFAULT now() NOT NULL,
      updated_at timestamp without time zone DEFAULT now()
    );

     CREATE TABLE public.ratings (
      id serial PRIMARY KEY,
      rating integer,
      comments text,
      rated_by text NOT NULL,
      rated_on timestamp without time zone DEFAULT now() NOT NULL,
      book_id integer REFERENCES public.books(id)
    );

  CREATE TABLE public.orders (
      id serial PRIMARY KEY,
      name text,
      address text,
      city text,
      country text,
      phone text,
      email text,
      mode_of_payment text,
      shipping_address text,
      shipping_city text,
      shipping_country text,
      shipping_phone text,
      payment_id text,
      discount_code text,
      discount_value integer,
      items jsonb,
      tracking_id text NOT NULL REFERENCES public.tracking(tracking_id),
      order_by text NOT NULL,
      order_on timestamp without time zone DEFAULT now() NOT NULL
    );


    CREATE TABLE public.logistics (
      id serial PRIMARY KEY,
      logistic_partner_name text,
      status text,
      status_date date,
      tracking_id text REFERENCES public.tracking(tracking_id),
      order_id integer REFERENCES public.orders(id)
    );

    CREATE TABLE public.return_item (
      id serial PRIMARY KEY,
      book_id integer REFERENCES public.books(id)
    );

    `);

  // Set ownership
  pgm.sql(`
    ALTER TABLE public.users OWNER TO postgres;
    ALTER TABLE public.tokens OWNER TO postgres;
    ALTER TABLE public.permissions OWNER TO postgres;
    ALTER TABLE public.roles OWNER TO postgres;
    ALTER TABLE public.role_permissions OWNER TO postgres;
    ALTER TABLE public.books OWNER TO postgres;
    ALTER TABLE public.authors OWNER TO postgres;
    ALTER TABLE public.covers OWNER TO postgres;
    ALTER TABLE public.categories OWNER TO postgres;
    ALTER TABLE public.conditions OWNER TO postgres;
    ALTER TABLE public.publishers OWNER TO postgres;
    ALTER TABLE public.entity OWNER TO postgres;
    ALTER TABLE public.branches OWNER TO postgres;
    ALTER TABLE public.ratings OWNER TO postgres;
    ALTER TABLE public.orders OWNER TO postgres;
    ALTER TABLE public.tracking OWNER TO postgres;
    ALTER TABLE public.logistics OWNER TO postgres;
    ALTER TABLE public.return_item OWNER TO postgres;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  // Drop tables in reverse order (tables with foreign keys first)
  pgm.sql(`
    DROP TABLE IF EXISTS public.return_item;
    DROP TABLE IF EXISTS public.logistics;
    DROP TABLE IF EXISTS public.orders;
    DROP TABLE IF EXISTS public.ratings;
    DROP TABLE IF EXISTS public.books;
    DROP TABLE IF EXISTS public.role_permissions;
    DROP TABLE IF EXISTS public.tokens;
    DROP TABLE IF EXISTS public.users;
    DROP TABLE IF EXISTS public.vendors;
    DROP TABLE IF EXISTS public.branches;
    
    DROP TABLE IF EXISTS public.tracking;
    DROP TABLE IF EXISTS public.publishers;
    DROP TABLE IF EXISTS public.conditions;
    DROP TABLE IF EXISTS public.covers;
    DROP TABLE IF EXISTS public.categories;
    DROP TABLE IF EXISTS public.authors;
    DROP TABLE IF EXISTS public.entity;
    DROP TABLE IF EXISTS public.permissions;
    DROP TABLE IF EXISTS public.roles;
  `);
};


module.exports={up, down, shorthands}