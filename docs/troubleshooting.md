# Troubleshooting

This page lists quick fixes for common issues when running the Signature App locally.

## PDF worker / version mismatch

- Symptom: Blank PDF viewer, console errors like "Worker was not loaded" or version mismatch.
- Fix: The app pins the pdf.js worker to the `react-pdf` API version (e.g., 5.3.x). Ensure the workerSrc is set, which is wired in our PDF components. If you update `react-pdf`/`pdfjs-dist`, update the worker version too.

## Node.js engine warnings

- Symptom: npm warns that `pdfjs-dist` expects a newer Node version.
- Fix: It's safe to continue on Node 18 for dev. For best results, use Node 20 LTS.

## Port already in use

- Symptom: Dev server fails to start on 3000.
- Fix: Start the server on an alternate port (e.g., 3001) or stop the process using 3000.

## Local document state

- Symptom: Old fields/signers/signature appear after reloading a document.
- Fix: We persist by document name in localStorage. Clear the `sigapp:<filename>` key to reset.

## SSR/DOM errors in viewer

- Symptom: Errors mentioning DOM APIs during build/SSR.
- Fix: PDF viewer and thumbnails are client-only to avoid SSR issues. If you add DOM code, guard it behind client components.

## Health check shows db.ok: false

- Symptom: `/api/health` responds with `{ ok: true, db: { ok: false, message: "..." } }`.
- Fix: The health endpoint performs a lightweight `SELECT 1` via Prisma. Ensure your database is reachable and `DATABASE_URL` is set. In local dev, you can bring up the dev DB with `docker-compose up -d` (see `docker-compose.yml`). If you don't need DB for a quick smoke test, the app still reports `ok: true` while `db.ok` informs connectivity.
