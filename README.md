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
- Stripe Checkout payment integration with webhook-based booking confirmation
- Automatic release of expired seat locks using `pg_cron`
- Staff authentication using JWT
- Google SSO
- RSA-based client authentication

## Stripe setup

Add these values to the root `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

Start the Stripe CLI webhook forwarder while developing:

```bash
stripe listen --events checkout.session.completed --forward-to localhost:4000/aggregator/stripe/webhook
```

The seat-lock endpoint creates a Stripe Checkout Session. The booking is confirmed only after the signed `checkout.session.completed` webhook is received.