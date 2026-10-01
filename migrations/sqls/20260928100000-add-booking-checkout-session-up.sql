ALTER TABLE booking
ADD COLUMN stripe_checkout_session_id VARCHAR(255);

CREATE UNIQUE INDEX booking_stripe_checkout_session_unique
ON booking (stripe_checkout_session_id)
WHERE stripe_checkout_session_id IS NOT NULL;