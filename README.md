# Theatre Ticketing Management System API

Backend REST API for managing theatres, movies, shows, seats, and bookings, with support for third-party ticketing aggregators.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Sequelize
- JWT
- Google SSO
- RSA-based client authentication
- pg_cron
- db-migrate

## Features

- Theatre, movie and show management
- Seat availability management
- Seat locking with automatic expiry
- Booking creation and confirmation
- Automatic release of expired seat locks using `pg_cron`
- Staff authentication using JWT
- Google SSO
- RSA-based client authentication