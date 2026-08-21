ALTER TABLE staff
ADD COLUMN email VARCHAR(255);

CREATE UNIQUE INDEX staff_email_unique
ON staff(email);