# The 3 Stripes Suites Website

Luxury marketing website for Kortenberg (live) and Oudenaarde (coming soon), built with React + Vite.

## Smoobu calendar sync

The site includes a live availability section that reads Smoobu availability through iCal.

### 1) Add your Smoobu iCal settings

1. Copy `.env.example` to `.env`
2. Set `SMOOBU_PROPERTY_ID` and `SMOOBU_ICAL_TOKEN` (or provide `SMOOBU_ICAL_URL`)

Smoobu iCal format:

`https://login.smoobu.com/ical/detail/{property_id}.ics?s={room_code}`

### 2) Run website + API together

```bash
npm install
npm run dev:full
```

- Frontend: `http://localhost:5173`
- Availability API: `http://localhost:8787/api/availability`

The frontend auto-refreshes availability every 5 minutes.

## Enterprise contact form email

The website includes an enterprise/business rental form that sends requests to
`bookings@the3stripes.be` through SMTP.

Add these variables to your `.env`:

```bash
CONTACT_TO_EMAIL=bookings@the3stripes.be
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=bookings@the3stripes.be
```

Without SMTP values, contact form submissions will fail with a configuration message.

## Other scripts

```bash
npm run dev       # frontend only
npm run server    # API only
npm run build     # production build
npm run preview   # preview build
```
