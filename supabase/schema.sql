-- =========================================================
-- Voyage Platform — Supabase / PostgreSQL schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------- HOTELS ----------
create table if not exists hotels (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city_slug text not null,
  lat double precision not null,
  lng double precision not null,
  price numeric(10, 2) not null,
  currency text not null default '$',
  rating numeric(2, 1) default 0,
  is_featured boolean not null default false,   -- sponsored / paid placement
  wifi boolean default false,
  pool boolean default false,
  bar boolean default false,
  description text,
  images text[] default '{}',
  affiliate_url text,                            -- Booking.com referral link
  owner_id uuid references auth.users(id),        -- business owner, for featured listings
  created_at timestamptz default now()
);

create index if not exists idx_hotels_city_slug on hotels(city_slug);
create index if not exists idx_hotels_featured on hotels(is_featured);

-- ---------- REVIEWS ----------
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  user_id uuid references auth.users(id),
  author_name text not null,
  rating numeric(2, 1) not null check (rating >= 1 and rating <= 5),
  text text,
  image_url text,
  created_at timestamptz default now()
);

create index if not exists idx_reviews_hotel_id on reviews(hotel_id);

-- ---------- BOOKINGS ----------
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  user_id uuid references auth.users(id),
  guest_name text not null,
  guest_email text not null,
  check_in date not null,
  check_out date not null,
  total_price numeric(10, 2) not null,
  status text not null default 'pending'          -- pending | confirmed | cancelled
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now()
);

create index if not exists idx_bookings_hotel_id on bookings(hotel_id);
create index if not exists idx_bookings_user_id on bookings(user_id);

-- ---------- PAYMENTS ----------
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  provider text not null check (provider in ('click', 'payme', 'stripe')),
  provider_transaction_id text,
  amount numeric(10, 2) not null,
  currency text not null default 'UZS',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  raw_payload jsonb,                                -- full webhook payload, for auditing
  created_at timestamptz default now()
);

create index if not exists idx_payments_booking_id on payments(booking_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table hotels enable row level security;
alter table reviews enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;

-- HOTELS: anyone can read; only the owning business (or service role) can write
create policy "Hotels are publicly readable"
  on hotels for select
  using (true);

create policy "Owners can update their own hotel"
  on hotels for update
  using (auth.uid() = owner_id);

create policy "Authenticated users can insert a hotel listing"
  on hotels for insert
  with check (auth.uid() = owner_id);

-- REVIEWS: anyone can read; only logged-in users can post, and only as themselves
create policy "Reviews are publicly readable"
  on reviews for select
  using (true);

create policy "Authenticated users can add a review"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own review"
  on reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own review"
  on reviews for delete
  using (auth.uid() = user_id);

-- BOOKINGS: a user can only see and create their own bookings
create policy "Users can view their own bookings"
  on bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own booking"
  on bookings for insert
  with check (auth.uid() = user_id);

-- PAYMENTS: never readable/writable directly from the frontend.
-- All payment rows are created/updated exclusively by the Express backend
-- using the service_role key, which bypasses RLS. No client policy is
-- defined here on purpose — this table is effectively locked from the
-- anon/public role.
