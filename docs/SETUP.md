# Admin Setup Guide

This app includes a first-run wizard at `/setup` to configure your organization and SMTP so you can send signature requests.

## Prerequisites
- Node 18+ (Node 20 recommended) or Docker
- Copy env: `cp .env.example .env`

## Database
- Default is SQLite with `DATABASE_URL=file:./prisma/dev.db`
- To use Postgres, set `DATABASE_URL` accordingly and adjust the Prisma provider in `prisma/schema.prisma`.
- The `/api/health` endpoint will report `db.ok: false` if `DATABASE_URL` is missing or the DB is offline, so keep the URL valid even in local dev for uptime monitors.

Initialize Prisma:
- `npm run prisma:generate`
- `npm run prisma:migrate`

## Run locally
- `npm run dev`
- Open `http://localhost:3000` — you’ll be redirected to `/setup`.

Provide:
- Organization name
- From email (shown in outgoing emails)
- SMTP host/port
- Optional SMTP user/pass (if your SMTP requires auth)

After saving, you’ll be redirected to the home page and the app is considered initialized.

## Docker
Build and run with Docker:
- `docker build -t signature-app .`
- `docker run -p 3000:3000 --env-file .env signature-app`

Or use Postgres via docker-compose:
- `docker-compose up --build`

Ensure `NEXTAUTH_SECRET` and SMTP values are set in `.env`.

## Next steps
- Create authentication flows for user signup/login
- Add email queue processing
- Add signature request creation and recipient signing page

---
If you run into issues, see `docs/troubleshooting.md`.
