# Happy Teeth

Website and booking dashboard for a dental clinic. Next.js 15 (App Router), Tailwind, Framer Motion, MongoDB.

- **Public site**: home, about, services explorer, online booking with an interactive tooth chart, FAQ, contact footer.
- **Staff dashboard** (`/admin`): overview, appointment management (search, filter, sort, confirm/decline/reopen, delete, CSV export), team access.

## Run it

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev
```

| Variable | What it is |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | 32+ random characters (`openssl rand -base64 48`) |
| `ADMIN_SETUP_KEY` | Lets you create the first admin from `/admin/create` in production |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for SEO |

### Create the first admin

Either open `/admin/create` (in production this needs `ADMIN_SETUP_KEY`), or from a terminal:

```bash
npm run seed:admin -- you@clinic.com "a-long-password"
```

After that, admins add colleagues from **Dashboard → Team**. The setup page closes itself once an admin exists.

## Languages (English, French, Arabic)

- A language switcher (EN / FR / ع) sits in the navbar, footer, login page and admin sidebar. The choice is saved in a cookie.
- First-time visitors get their browser language when it is English, French or Arabic, otherwise English.
- Arabic switches the whole page to right-to-left: layout, drawers, arrows and animations are mirrored, and an Arabic font (Cairo) replaces the Latin ones. Phone numbers, emails and times stay left-to-right inside Arabic text.
- All wording lives in `lib/i18n/en.ts`, `fr.ts` and `ar.ts`. To add a language: add it to `lib/i18n/config.ts`, create a file typed as `Dict`, and register it in `lib/i18n/dictionaries.ts`. TypeScript reports any missing key.
- Tooth names are stored in English in the database (so records stay consistent) and shown translated everywhere.
- Error messages from the server are translated in the browser through the `api` table in each dictionary.

## Rebrand for a new clinic

Contact details live in **`constants/site.ts`** (name, phone, email, address). Visible wording (headlines, services, FAQ, opening hours, booking steps) lives in `lib/i18n/*.ts`, one file per language. Colours are in `tailwind.config.ts` (`spruce`, `brand`, `enamel`) and `app/globals.css`. Replace `public/hero.jpg`, `public/lab.jpg`, `public/login.jpeg` and `app/favicon.ico` with the clinic's own images.

> The contact details in `constants/site.ts` and the opening hours in `lib/i18n/*.ts` are placeholders. Replace them before launch.

## What changed from v0

**Security** (the original left these open to anyone)
- `GET /api/bookings` returned every patient's name, phone and email without login. Now admin-only.
- `PATCH /api/bookings/:id` and `POST /api/create` could be called by anyone. Now require a session; admin creation is locked down after setup.
- Login moved from a token in `localStorage` to a signed, `httpOnly`, `SameSite` cookie, verified on the server for pages (middleware) and on every API route.
- Login no longer reveals whether an email exists, is rate-limited, and uses bcrypt cost 12.
- Booking endpoint validates input server-side (zod), has rate limiting, a honeypot and a same-origin check, and no longer leaks internal error messages.
- Upgraded Next.js to a patched release (15.1.7 had a known middleware auth-bypass).

**Reliability**
- Cached MongoDB connection (no reconnect per request, no `process.exit`), env vars read lazily so builds don't crash.
- Dates stored as ISO `YYYY-MM-DD`; old `DD/MM/YYYY` records still display correctly.
- Strict TypeScript and ESLint are back on in builds.

**Design and motion** (guided by *design-motion-principles* and *genjutsu*)
- Marketing site weighted Jakub (polish) + Jhey (delight), forms/nav weighted Emil (restraint). Admin weighted Emil + Jakub.
- One orchestrated hero entrance, quiet single reveals on section headings, springs with no bounce, exits subtler than enters, only `transform`/`opacity`/`filter` animated, nothing loops except loading skeletons.
- `prefers-reduced-motion` respected globally (`MotionConfig reducedMotion="user"` + CSS).
- Accessible by default: keyboard-operable tooth chart, labelled form errors, tab patterns with arrow keys, focus rings, status never conveyed by colour alone.

## Before you sell it

1. Replace placeholder contact info, images and copy.
2. Set a strong `JWT_SECRET` and `ADMIN_SETUP_KEY` on the host.
3. The rate limiter is in-memory; on multi-instance or serverless hosting swap `lib/rate-limit.ts` for Redis/Upstash.
4. Consider adding email/SMS notifications when a request arrives or is confirmed (not included).
