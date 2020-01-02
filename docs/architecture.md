# Architecture Overview

## High-Level Components

| Layer | Purpose |
|-------|---------|
| App Router (Next.js) | Server + client components, routing, setup gating |
| Components | Reusable UI (signature, PDF, system) |
| Hooks | Encapsulate stateful logic (fields, signature, auth) |
| Lib Utilities | PDF generation, validation, email, settings, DB access |
| Prisma ORM | Data layer (Users, Settings, Documents, Requests, EmailQueue) |
| Email Subsystem | SMTP sending + templates (future: queue processor) |

## Data Flow (Signing)
1. User uploads PDF → object URL for react-pdf viewer
2. Overlay fields managed via `useFields` with undo/redo
3. Signature captured (draw/type/upload) and stored as data URL
4. Export uses `exportWithFields` + `pdf-lib` to flatten into final PDF

## Planned Extensions
- Email queue processor worker route
- Signature request tokens & recipient signing page
- Audit trail hashing chain
- Storage abstraction (local vs S3)

## Performance Considerations
- Debounced local persistence
- rAF throttled drag updates
- Potential future virtualization for large multi-page PDFs

## Operational Visibility
- Lightweight `/api/health` endpoint exposes runtime version, commit SHA, and DB connectivity
- Responses are marked `Cache-Control: no-store` so monitors always receive fresh data
- Future work: stream metrics to an external monitor (e.g., healthchecks.io) once background jobs exist
