# Changelog

## 2025-10-01
-
## 2025-10-02

- Docs: Improve README by adding scripts reference table and clarifying self-host steps

## 2025-10-03

- DX: Add GitHub feature request issue template to standardize incoming enhancement proposals

## 2025-10-04

- Security: Add initial SECURITY.md with vulnerability reporting process and hardening roadmap

## 2025-10-05

- Governance: Add CODE_OF_CONDUCT.md adopting Contributor Covenant v2.1

## 2025-10-06

- Docs: Add `architecture.md` outlining layers, data flow, and planned extensions

## 2025-10-08

- DX: Add GitHub Pull Request template to standardize submissions and review expectations

- Docs: Add initial `CONTRIBUTING.md` with branch strategy, commit style, testing steps, and PR guidelines
- DX: Clarified local setup flow (prisma generate, dev scripts) for new contributors

## 2025-09-06

- Docs: Add detailed JSDoc to `createEmptyPdf` for improved API clarity and DX
- Accessibility: Added keyboard nudging and ARIA roles/labels to draggable fields and PDF viewer controls

## 2025-09-25

- Introduced global `ErrorBoundary` component wrapping root layout to provide graceful UI fallback and retry on rendering errors
- Adds resilience for experimental client components & future dynamic PDF tooling
  All notable changes to this project will be documented in this file.

## 2025-09-07

- Perf: Debounce localStorage persistence for fields/signers/signature on the Sign page to reduce write churn during drag/resize and typing

## 2025-09-08

- UX: Show live signature preview inside signature fields; keyboard Delete/Backspace removes the selected field

## 2025-09-09

- UX: Inline text field label editing (double-click a text field to rename its label)

## 2025-09-10

- UX: Show today’s date as a live preview in date fields

## 2025-09-11

- Lib: Added watermark and margin guides options to `createEmptyPdf` utility for richer sample document generation

## 2025-09-12

- Lib: `createEmptyPdf` supports title alignment via `titleAlign` (left/center)

## 2025-09-13

- Lib: `createEmptyPdf` supports customizable title/body colors and body text

## 2025-09-14

- A11y: PDF viewer page indicator now uses aria-live=polite for assistive tech

## 2025-09-15

- Docs: Document sample PDF options and usage examples in README

## 2025-09-16

- Lib: `createEmptyPdf` adds LEGAL, TABLOID, A5 sizes and `footerDateFormat` (iso/locale/none)
- Lib: Support `titleFontSize`/`bodyFontSize`, optional `backgroundColor`, and `footerAlign` (left/center/right)

## 2025-09-17

- Lib: `createEmptyPdf` supports configurable `margins` (uniform or per-side) and guides now reflect margins

## 2025-09-18

- Lib: Add `ruleOfThirds` overlay option to draw faint thirds grid (for layout testing)
- Lib: Add `titleUnderline` option to draw an underline under the title
- Lib: Add `subtitle*` options (text/color/size/align) and `pageBorder` (color/width/inset)

## 2025-09-19

- Lib: `createEmptyPdf` supports `bodyLineHeight` and `bodyAlign` for wrapped body text
- Lib: `pageBorder` supports dashed borders via `{ dashed: true }` or custom `dashArray`
- Lib: Add `pageNumbers` option with position (top/bottom), align (left/center/right), size, color, and tokenized `format`

## 2025-09-20

- Lib: `createEmptyPdf` adds `footerFormat` for customizable footer text with tokens `{app}`, `{title}`, `{date}`, `{page}`, `{pages}`, and `{sep}`
- Lib: Add `bodyMaxLines` to cap wrapped body lines per page
- Lib: Add `footerColor` to customize footer text color
- Lib: Add `headerRule` to draw a subtle rule under the header
- Lib: Add `contentPadding` to introduce an inner text gutter
- Lib: Add `titleTransform`/`subtitleTransform` (uppercase/lowercase/titlecase)

## 2025-09-21

- Lib: Add `bodyIndentFirstLine` to indent the first line of each paragraph

## 2025-09-22

- Lib: Add `paragraphSpacing` for extra vertical space after paragraphs
- Lib: Add `bodyLineNumbers` option to display line numbers (left/right) for wrapped body lines (debug/reading aid)

## 2025-09-23

- Lib: Add `suppressFooterOnFirstPage` and `suppressPageNumbersOnFirstPage` to omit footer/page numbers on first page
- Lib: Add `bodyMaxParagraphs` to cap the number of paragraphs processed from `bodyText`

## 2025-09-24

- Lib: Add `watermarkAngle` to control watermark rotation (degrees)
- Lib: Add `hyphenateLongWords` to perform naive hyphenation when breaking overlong words in body text
- Lib: Add `ellipsisOverflow` to append an ellipsis when body text is truncated by space or max line constraints
- Lib: Add `debugBoundingBoxes` to visualize body line rectangles for layout debugging
- Lib: Add `titleSpacing` and `subtitleSpacing` to control extra vertical spacing after title/subtitle

## 2025-09-26

- Lib: Add `validatePdfFile` utility (MIME, size, header sniff) and integrate into Sign page upload & drag-drop

## 2025-09-27

- Setup: Introduced first-run Admin Setup wizard at `/setup` to configure organization and SMTP
- Data: Added Prisma ORM with SQLite default schema (Users, Settings, Document, Versions, SignatureRequest, SignerLink, EmailQueue)
- Infra: Added Dockerfile and docker-compose for self-hosting (SQLite or Postgres)
- Gating: Home route now redirects to `/setup` until app is initialized (server-side check)
- Env: Updated `.env.example` with DB provider and SMTP defaults

## 2025-09-05

- Lib: Enhance `createEmptyPdf` with options (pages, size, orientation, footer) and PDF metadata
- UX: Minor tuning for drag/resize performance in signing overlay

## 2025-08-30

- Add signer assignment UI with color-coding and per-document persistence
- Show alignment guides when dragging/resizing fields (page edges/centers and other fields)
- Minor UX polish

## 2025-08-31

- Documentation: Add troubleshooting guide and link docs in README.

## 2025-09-01

- UX: Add signer badges on fields and a toggle to show/hide alignment guides.

## 2025-08-27

- Integrate thumbnails sidebar with page navigation
- Add draggable overlay fields (signature/text/checkbox/date scaffolding)
- Extend PDFViewer with overlay render function and controlled page
- Documentation polish: badges in README
