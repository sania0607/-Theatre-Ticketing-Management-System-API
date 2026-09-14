'use strict';

exports.up = function (db) {
  return db.runSql(`
    -- Theatre
    CREATE TABLE theatre (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name varchar(100) NOT NULL,
      address text,
      city varchar(50),
      state varchar(50),
      contact_number varchar(15)
    );

    -- Movie
    CREATE TABLE movie (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      title varchar(150) NOT NULL,
      genre varchar(50),
      language varchar(50),
      duration integer,
      release_date date
    );

    -- Staff
    CREATE TABLE staff (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      username varchar(100) NOT NULL UNIQUE,
      password varchar(255) NOT NULL
    );

    -- Client
    CREATE TABLE client (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      client_code varchar(50) NOT NULL,
      client_name varchar(100) NOT NULL,
      public_key text NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
      access TEXT
    );

    -- Screen
    CREATE TABLE screen (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      theatre_id integer NOT NULL,
      name varchar(50) NOT NULL,
      capacity integer NOT NULL,
      FOREIGN KEY (theatre_id) REFERENCES theatre(id)
    );

    -- Seat
    CREATE TABLE seat (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      screen_id integer NOT NULL,
      seat_number varchar(10) NOT NULL,
      row_name varchar(10) NOT NULL,
      FOREIGN KEY (screen_id) REFERENCES screen(id)
    );

    -- Show
    CREATE TABLE show (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      movie_id integer NOT NULL,
      screen_id integer NOT NULL,
      show_date date NOT NULL,
      start_time timestamp without time zone NOT NULL,
      end_time timestamp without time zone NOT NULL,
      ticket_price numeric(10,2) NOT NULL,
      FOREIGN KEY (movie_id) REFERENCES movie(id),
      FOREIGN KEY (screen_id) REFERENCES screen(id)
    );

    -- Show Seat
    CREATE TABLE show_seat (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      show_id integer NOT NULL,
      seat_id integer NOT NULL,
      status varchar(20) DEFAULT 'AVAILABLE',
      locked_until timestamp without time zone,
      FOREIGN KEY (seat_id) REFERENCES seat(id),
      FOREIGN KEY (show_id) REFERENCES show(id)
    );

    -- Booking
    CREATE TABLE booking (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      show_id integer NOT NULL,
      aggregator_name varchar(100),
      booking_reference varchar(100),
      booking_status varchar(20) DEFAULT 'PENDING',
      total_amount numeric(10,2),
      booked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (show_id) REFERENCES show(id)
    );

    -- Booking Seat
    CREATE TABLE booking_seat (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      booking_id integer NOT NULL,
      show_seat_id integer NOT NULL,
      FOREIGN KEY (booking_id) REFERENCES booking(id),
      FOREIGN KEY (show_seat_id) REFERENCES show_seat(id)
    );
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
  `);
};

exports._meta = {
  version: 1
};