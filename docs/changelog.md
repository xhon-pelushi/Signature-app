# Changelog


## 2025-09-06
- Docs: Add detailed JSDoc to `createEmptyPdf` for improved API clarity and DX

All notable changes to this project will be documented in this file.
 
## 2025-09-07
- Perf: Debounce localStorage persistence for fields/signers/signature on the Sign page to reduce write churn during drag/resize and typing

## 2025-09-08
- UX: Show live signature preview inside signature fields; keyboard Delete/Backspace removes the selected field

## 2025-09-09
- UX: Inline text field label editing (double-click a text field to rename its label)

## 2025-09-10
- UX: Show today’s date as a live preview in date fields

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
