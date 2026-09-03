SELECT cron.unschedule(
    (
        SELECT jobid
        FROM cron.job
        WHERE schedule = '* * * * *'
          AND command LIKE '%Expire bookings%'
        LIMIT 1
    )
);