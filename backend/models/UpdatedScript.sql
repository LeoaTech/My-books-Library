-- Create Database
CREATE DATABASE Library_app;

-- Connect to Database
\c Library_app;

-- TABLE: USERS
CREATE TABLE public.users (
    id serial PRIMARY KEY,
    name text NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    role_id integer REFERENCES public.roles(role_id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    reset_password_token text,
    img_url text,
    address JSONB,
    phone text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);

-- TABLE: TOKENS
CREATE TABLE public.tokens (
    id serial PRIMARY KEY,
    user_id integer REFERENCES public.users(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    token text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    expired_at timestamp without time zone,
);

-- TABLE: ROLES
CREATE TABLE public.roles (
    role_id serial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: PERMISSIONS
CREATE TABLE public.permissions (
    permission_id serial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: ROLE_PERMISSIONS
CREATE TABLE public.role_permissions (
    role_id int4 NOT NULL,
    permission_id int4 NOT NULL,
    CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id)
);

-- TABLE: ENTITY [shop || store]
CREATE TABLE public.entity (
    id serial PRIMARY KEY,
    name text NOT NULL,
    type_of_books text,
    multiple_branches boolean,
    deliver_inner_city boolean,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: VENDORS
CREATE TABLE public.vendors (
    id serial PRIMARY KEY,
    name text NOT NULL,
    role_id integer REFERENCES public.roles(role_id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    last_login date,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: BRANCHES
CREATE TABLE public.branches (
    id serial PRIMARY KEY,
    name text NOT NULL,
    exact_location text,
    entity_id integer REFERENCES public.entity(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    country text,
    city text,
    address text,
    phone text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: BOOKS
CREATE TABLE public.books (
    id serial PRIMARY KEY,
    title text NOT NULL,
    summary text,
    rental_price text,
    purchase_price text,
    discount_percentage text NOT NULL,
    vendor_id integer REFERENCES public.vendors(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    author integer REFERENCES public.authors(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    category integer REFERENCES public.categories(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    cover integer REFERENCES public.covers(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    condition integer REFERENCES public.conditions(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    branch_id integer REFERENCES public.branches(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    is_available boolean,
    added_by integer REFERENCES public.roles(role_id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    isbn text NOT NULL,
    cover_img_url jsonb,
    publisher integer REFERENCES public.publishers(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    comments text,
    publish_year text,
    credit integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);

-- TABLE: AUTHORS
CREATE TABLE public.authors (
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text,
    links text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: CATEGORIES
CREATE TABLE public.categories (
    id serial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: COVERS
CREATE TABLE public.covers (
    id serial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: CONDITIONS
CREATE TABLE public.conditions (
    id serial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: PUBLISHERS
CREATE TABLE public.publishers (
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text,
    links text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: RATINGS    
CREATE TABLE public.ratings (
    id serial PRIMARY KEY,
    rating integer,
    comments text,
    rated_by text NOT NULL,
    rated_on timestamp without time zone DEFAULT now() NOT NULL,
    book_id integer REFERENCES public.books(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- TABLE: ORDERS
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
    tracking_id text NOT NULL REFERENCES public.tracking(tracking_id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    order_by text NOT NULL,
    order_on timestamp without time zone DEFAULT now() NOT NULL
);

-- TABLE: TRACKING
CREATE TABLE public.tracking (
    id serial PRIMARY KEY,
    tracking_id text NOT NULL UNIQUE,
    last_updated_status text,
    current_status text
);

-- TABLE: LOGISTICS
CREATE TABLE public.logistics (
    id serial PRIMARY KEY,
    logistic_partner_name text,
    status text,
    status_date date,
    tracking_id text REFERENCES public.tracking(tracking_id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    order_id integer REFERENCES public.orders(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- TABLE: RETURNS
CREATE TABLE public.return_item (
    id serial PRIMARY KEY,
    book_id integer REFERENCES public.books(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Set Ownership
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



   

-- Inserting roles
INSERT INTO public.roles (name) VALUES
    ('admin'),
    ('member'),
    ('vendor');

-- Inserting permissions
INSERT INTO public.permissions (name) VALUES
    ('EDIT BOOK'),
    ('READ BOOK'),
    ('DELETE BOOK'),
    ('CREATE BOOK');

INSERT INTO public.permissions (name) VALUES
    ('EDIT USER'),
    ('READ USER'),
    ('DELETE USER'),
    ('CREATE USER');
   
   
INSERT INTO public.permissions (name) VALUES
    ('EDIT ORDER'),
    ('READ ORDER'),
    ('DELETE ORDER'),
    ('CREATE ORDER');
   
-- Inserting role_permissions
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
    (1, 1),  -- Admin(role_id=1) has 'EDIT' permission
    (1, 2),  -- Admin has 'READ' permission
    (1, 3),  -- Admin has 'DELETE' permission
    (1, 4),  -- Admin has 'CREATE' permission
    (2, 5),  -- Member (role_id=2) has 'READ' permission
    (3, 6),  -- Vendor has "EDIT" permission
    (3, 7),
    (3, 8);
   

   


