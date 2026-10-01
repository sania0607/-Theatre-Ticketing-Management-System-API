DROP INDEX IF EXISTS booking_stripe_checkout_session_unique;

ALTER TABLE booking
DROP COLUMN IF EXISTS stripe_checkout_session_id;