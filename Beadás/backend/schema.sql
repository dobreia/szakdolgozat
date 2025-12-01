-- Ajánlott: psql -d beauty_salon -f schema.sql

-- UUID generáláshoz:
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Időintervallum-ütközéshez:
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  price_cents INT NOT NULL CHECK (price_cents >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  employee_id INT NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time   TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

-- Ütközés-ellenőrzés: ugyanarra az alkalmazottra ne lehessen átfedő foglalás
-- (pending/confirmed állapotok számítanak ütközésnek)
ALTER TABLE bookings
ADD CONSTRAINT booking_no_overlap
EXCLUDE USING gist (
  employee_id WITH =,
  tstzrange(start_time, end_time, '[]') WITH &&
)
WHERE (status IN ('pending','confirmed'));
