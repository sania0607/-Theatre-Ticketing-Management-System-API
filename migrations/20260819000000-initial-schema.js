'use strict';

exports.up = function (db) {
  return db.runSql(`
    -- Theatre
    CREATE SEQUENCE theatre_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE theatre (
      id integer NOT NULL DEFAULT nextval('theatre_id_seq'::regclass),
      name varchar(100) NOT NULL,
      address text,
      city varchar(50),
      state varchar(50),
      contact_number varchar(15),
      CONSTRAINT theatre_pkey PRIMARY KEY (id)
    );

    ALTER SEQUENCE theatre_id_seq OWNED BY theatre.id;


    -- Movie
    CREATE SEQUENCE movie_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE movie (
      id integer NOT NULL DEFAULT nextval('movie_id_seq'::regclass),
      title varchar(150) NOT NULL,
      genre varchar(50),
      language varchar(50),
      duration integer,
      release_date date,
      CONSTRAINT movie_pkey PRIMARY KEY (id)
    );

    ALTER SEQUENCE movie_id_seq OWNED BY movie.id;


    -- Staff
    CREATE SEQUENCE staff_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE staff (
      id integer NOT NULL DEFAULT nextval('staff_id_seq'::regclass),
      username varchar(100) NOT NULL,
      password varchar(255) NOT NULL,
      CONSTRAINT staff_pkey PRIMARY KEY (id),
      CONSTRAINT staff_username_key UNIQUE (username)
    );

    ALTER SEQUENCE staff_id_seq OWNED BY staff.id;


    -- Client
    CREATE SEQUENCE client_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE client (
      id integer NOT NULL DEFAULT nextval('client_id_seq'::regclass),
      client_code varchar(50) NOT NULL,
      client_name varchar(100) NOT NULL,
      public_key text NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
      access text,
      CONSTRAINT client_pkey PRIMARY KEY (id),
      CONSTRAINT client_client_code_key UNIQUE (client_code)
    );

    ALTER SEQUENCE client_id_seq OWNED BY client.id;


    -- Screen
    CREATE SEQUENCE screen_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE screen (
      id integer NOT NULL DEFAULT nextval('screen_id_seq'::regclass),
      theatre_id integer NOT NULL,
      name varchar(50) NOT NULL,
      capacity integer NOT NULL,
      CONSTRAINT screen_pkey PRIMARY KEY (id),
      CONSTRAINT screen_theatre_id_fkey
        FOREIGN KEY (theatre_id) REFERENCES theatre(id)
    );

    ALTER SEQUENCE screen_id_seq OWNED BY screen.id;


    -- Seat
    CREATE SEQUENCE seat_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE seat (
      id integer NOT NULL DEFAULT nextval('seat_id_seq'::regclass),
      screen_id integer NOT NULL,
      seat_number varchar(10) NOT NULL,
      row_name varchar(10) NOT NULL,
      CONSTRAINT seat_pkey PRIMARY KEY (id),
      CONSTRAINT seat_screen_id_fkey
        FOREIGN KEY (screen_id) REFERENCES screen(id)
    );

    ALTER SEQUENCE seat_id_seq OWNED BY seat.id;


    -- Show
    CREATE SEQUENCE show_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE show (
      id integer NOT NULL DEFAULT nextval('show_id_seq'::regclass),
      movie_id integer NOT NULL,
      screen_id integer NOT NULL,
      show_date date NOT NULL,
      start_time timestamp without time zone NOT NULL,
      end_time timestamp without time zone NOT NULL,
      ticket_price numeric(10,2) NOT NULL,
      CONSTRAINT show_pkey PRIMARY KEY (id),
      CONSTRAINT show_movie_id_fkey
        FOREIGN KEY (movie_id) REFERENCES movie(id),
      CONSTRAINT show_screen_id_fkey
        FOREIGN KEY (screen_id) REFERENCES screen(id)
    );

    ALTER SEQUENCE show_id_seq OWNED BY show.id;


    -- Show Seat
    CREATE SEQUENCE show_seat_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE show_seat (
      id integer NOT NULL DEFAULT nextval('show_seat_id_seq'::regclass),
      show_id integer NOT NULL,
      seat_id integer NOT NULL,
      status varchar(20) DEFAULT 'AVAILABLE',
      locked_until timestamp without time zone,
      CONSTRAINT show_seat_pkey PRIMARY KEY (id),
      CONSTRAINT show_seat_seat_id_fkey
        FOREIGN KEY (seat_id) REFERENCES seat(id),
      CONSTRAINT show_seat_show_id_fkey
        FOREIGN KEY (show_id) REFERENCES show(id)
    );

    ALTER SEQUENCE show_seat_id_seq OWNED BY show_seat.id;


    -- Booking
    CREATE SEQUENCE booking_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE booking (
      id integer NOT NULL DEFAULT nextval('booking_id_seq'::regclass),
      show_id integer NOT NULL,
      aggregator_name varchar(100),
      booking_reference varchar(100),
      booking_status varchar(20) DEFAULT 'PENDING',
      total_amount numeric(10,2),
      booked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT booking_pkey PRIMARY KEY (id),
      CONSTRAINT booking_booking_reference_key UNIQUE (booking_reference),
      CONSTRAINT booking_show_id_fkey
        FOREIGN KEY (show_id) REFERENCES show(id)
    );

    ALTER SEQUENCE booking_id_seq OWNED BY booking.id;


    -- Booking Seat
    CREATE SEQUENCE booking_seat_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

    CREATE TABLE booking_seat (
      id integer NOT NULL DEFAULT nextval('booking_seat_id_seq'::regclass),
      booking_id integer NOT NULL,
      show_seat_id integer NOT NULL,
      CONSTRAINT booking_seat_pkey PRIMARY KEY (id),
      CONSTRAINT booking_seat_booking_id_fkey
        FOREIGN KEY (booking_id) REFERENCES booking(id),
      CONSTRAINT booking_seat_show_seat_id_fkey
        FOREIGN KEY (show_seat_id) REFERENCES show_seat(id)
    );

    ALTER SEQUENCE booking_seat_id_seq OWNED BY booking_seat.id;
  `);
};

exports.down = function (db) {
  return db.runSql(`
    DROP TABLE IF EXISTS booking_seat;
    DROP TABLE IF EXISTS booking;
    DROP TABLE IF EXISTS show_seat;
    DROP TABLE IF EXISTS show;
    DROP TABLE IF EXISTS seat;
    DROP TABLE IF EXISTS screen;
    DROP TABLE IF EXISTS client;
    DROP TABLE IF EXISTS staff;
    DROP TABLE IF EXISTS movie;
    DROP TABLE IF EXISTS theatre;

    DROP SEQUENCE IF EXISTS booking_seat_id_seq;
    DROP SEQUENCE IF EXISTS booking_id_seq;
    DROP SEQUENCE IF EXISTS show_seat_id_seq;
    DROP SEQUENCE IF EXISTS show_id_seq;
    DROP SEQUENCE IF EXISTS seat_id_seq;
    DROP SEQUENCE IF EXISTS screen_id_seq;
    DROP SEQUENCE IF EXISTS client_id_seq;
    DROP SEQUENCE IF EXISTS staff_id_seq;
    DROP SEQUENCE IF EXISTS movie_id_seq;
    DROP SEQUENCE IF EXISTS theatre_id_seq;
  `);
};

exports._meta = {
  version: 1
};