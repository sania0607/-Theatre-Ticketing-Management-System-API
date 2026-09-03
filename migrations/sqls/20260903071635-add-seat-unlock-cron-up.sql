SELECT cron.schedule(
    '* * * * *',
    $job$
    DO $do$
    BEGIN

        -- Expire bookings whose locked seats have expired
        UPDATE booking b
        SET booking_status = 'EXPIRED'
        WHERE b.booking_status = 'PENDING'
          AND EXISTS (
              SELECT 1
              FROM booking_seat bs
              JOIN show_seat ss
                ON ss.id = bs.show_seat_id
              WHERE bs.booking_id = b.id
                AND ss.status = 'LOCKED'
                AND ss.locked_until <= NOW()
          );

        -- Release expired seats
        UPDATE show_seat
        SET
            status = 'AVAILABLE',
            locked_until = NULL
        WHERE status = 'LOCKED'
          AND locked_until <= NOW();

    END
    $do$;
    $job$
);