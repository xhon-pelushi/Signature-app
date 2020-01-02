# Contributing Guide

Thank you for your interest in improving **SignatureApp**.

## Quick Start

1. Fork the repository
2. Clone your fork & install dependencies: `npm ci`
3. Generate Prisma client (first time): `npm run prisma:generate`
4. Run dev server: `npm run dev`
5. Run tests & lint before pushing:
   - `npm run typecheck`
   - `npm run lint`
   - `npm test`

## Branch Naming
Use a short, descriptive prefix:

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<slug>` | `feat/email-queue` |
| Fix | `fix/<slug>` | `fix/sign-loop` |
| Docs | `docs/<slug>` | `docs/architecture` |
| Test | `test/<slug>` | `test/pdf-utils` |

## Commit Messages
Conventional style (not strictly enforced but encouraged):

```
feat(sign): add date field rendering
fix(pdf): handle empty body text edge case
docs: expand setup instructions
```

## Code Style
- TypeScript everywhere
- Functional React components
- Tailwind for styling (no custom CSS files unless absolutely necessary)
- Keep utilities pure & side-effects isolated
- Guard async operations with try/catch + user-friendly errors

## Testing
- Unit tests with Jest + Testing Library
- Put tests in `src/__tests__` or `*.test.ts(x)` near the code
- Prefer small, focused tests

## Performance & Accessibility
- Avoid unnecessary re-renders (memoize where it counts)
- Keyboard and screen reader accessible interactions by default

## Pull Requests
- Reference related issues (e.g., `Closes #42`)
- Include before/after notes or screenshots for UI changes
- Keep PRs small & incremental

## Security / Privacy
- Do not commit secrets
- Validate and sanitize any user-controlled input

## Roadmap Alignment
If you’re unsure whether a feature fits the roadmap, open an issue first.

## Questions?
Open a discussion thread or ask in the related issue.

Happy signing! ✍️
