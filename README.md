# Voyage — 3D Travel & Hotel Booking Platform

Full-stack, monetized travel platform: 3D auto-rotating globe hero, Leaflet-based city maps with sponsored listings, Supabase backend, and an Express payments service for Click / Payme / Stripe.

## Folder Structure

```
voyage-platform/
├── app/                          # Next.js App Router
│   ├── layout.jsx                 # Fonts, global CSS, LanguageProvider
│   ├── page.jsx                   # Home page — loads GlobeHero (no SSR)
│   ├── globals.css
│   └── city/[citySlug]/page.jsx   # Map + filters + hotel drawer for one city
├── components/
│   ├── GlobeHero.jsx               # 3D globe, glass search bar, fly-to zoom
│   ├── LanguageSwitcher.jsx        # Corner language picker (flag + code)
│   ├── MapComponent.jsx            # Leaflet map, price markers, featured styling
│   ├── FilterSidebar.jsx           # Price / rating / amenity filters
│   └── HotelDrawer.jsx             # Detail panel, gallery, reviews, affiliate CTA
├── lib/
│   ├── i18n.js                     # Lightweight translation context (EN/UZ/RU)
│   └── supabaseClient.js           # Public (anon) Supabase client
├── data/
│   └── mockHotels.js               # Fallback data — same shape as the DB tables
├── supabase/
│   └── schema.sql                  # hotels, reviews, bookings, payments + RLS
├── server/                         # Separate Express service (deployed independently)
│   ├── server.js
│   ├── supabaseAdmin.js            # Service-role client — server-only
│   ├── routes/payments.js          # Click / Payme / Stripe webhook handlers
│   └── package.json
├── .env.example
└── package.json
```

## Why two backends (Next.js + Express)?

Next.js handles rendering and reads (public Supabase data via the anon key, protected by RLS). Payments are deliberately isolated in a **separate Express service** using the Supabase **service-role key**, which bypasses RLS — that key must never reach the browser or a Next.js API route that could be inspected client-side. Deploy `server/` on its own (Render, Railway, Fly.io, a VPS) with its own `.env`.

## Setup

### 1. Frontend

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_SUPABASE_URL / ANON_KEY
npm run dev
```

### 2. Supabase

1. Create a project at supabase.com
2. Open the SQL editor and run `supabase/schema.sql`
3. (Optional) seed the `hotels` table with the objects in `data/mockHotels.js`

### 3. Payments backend

```bash
cd server
npm install
cp ../.env.example .env      # fill in SUPABASE_SERVICE_ROLE_KEY + provider secrets
npm run dev
```

Point Click / Payme / Stripe webhook URLs to:
- `POST /api/payments/click`
- `POST /api/payments/payme`
- `POST /api/payments/stripe`

## Design tokens

| Token | Value |
|---|---|
| Background | `#0B0F17` |
| Surface | `#121826` |
| Accent (teal) | `#2DD4BF` |
| Accent (coral / price / featured) | `#FB7185` |
| Display font | Space Grotesk |
| Body font | Inter |

## Monetization model

- **Affiliate links** — every hotel row carries `affiliate_url`; the drawer's CTA opens it in a new tab with `rel="sponsored"`.
- **Featured listings** — `hotels.is_featured = true` renders a coral neon border on the map marker and a "Featured" badge in the drawer. In a real product this flag would flip after a Stripe subscription/one-time charge from the business owner.
- **Direct bookings** — `bookings` + `payments` tables support first-party checkout via Click/Payme/Stripe as an alternative revenue stream to pure affiliate traffic.

## Notes & next steps

- `GlobeHero` and `MapComponent` are loaded with `next/dynamic({ ssr: false })` because both `react-globe.gl` (Three.js/WebGL) and `react-leaflet` touch `window`/`document`.
- The city page tries Supabase first and falls back to `data/mockHotels.js` automatically — so the demo works even before you connect a real database.
- To move from Leaflet to Mapbox GL JS (for real 3D buildings), swap `MapComponent.jsx`'s internals only — no other component needs to change, since they only pass `hotels`, `city`, and selection callbacks as props.
- Add Supabase Auth (`supabase.auth.signInWithOAuth`) to let users post reviews under their own account, matching the RLS policies already defined in `schema.sql`.
