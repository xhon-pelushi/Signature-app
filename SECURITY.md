# Security Policy

## Supported Versions
The project is pre-1.0; all releases on `main` are maintained on a best-effort basis.

## Reporting a Vulnerability
Please open a **private** security advisory via GitHub Security Advisories (DO NOT create a public issue for undisclosed vulnerabilities).

Include:
- Description & potential impact
- Steps to reproduce / PoC if available
- Affected components (paths, modules)
- Suggested mitigation (if known)

## Handling
We aim to respond within 5 business days. Critical issues may trigger an out-of-band patch release.

## Guidelines for Contributors
- Never commit secrets (API keys, credentials, tokens)
- Validate & sanitize user input (file uploads, form fields)
- Avoid logging sensitive data (emails, tokens)
- Use dependency upgrades via PRs; avoid direct pushes of large lockfile changes

## Cryptographic Signatures / Integrity
To be defined before 1.0 (planned: signed release artifacts and checksum manifest).

## Hardening Roadmap
- [ ] Strict Content Security Policy headers
- [ ] Signature hashing & tamper-evident metadata
- [ ] Rate limiting for auth & upload routes
- [ ] Audit trail integrity chain
