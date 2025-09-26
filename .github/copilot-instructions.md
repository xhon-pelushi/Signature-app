# Signature App - GitHub Copilot Instructions

## Project Overview

This is a digital signature application similar to DocuSign, built with Next.js 15, TypeScript, and Tailwind CSS. The app allows users to upload PDFs, place signatures, and manage document signing workflows.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Handling**: pdf-lib, react-pdf, pdfjs-dist
- **Forms**: react-hook-form with zod validation
- **Icons**: Lucide React
- **Canvas/Drawing**: html2canvas, jspdf
- **PDF Generation**: @react-pdf/renderer

## Key Features to Implement

1. **PDF Upload & Viewer**
   - Drag & drop PDF upload
   - PDF preview with zoom/pan controls
   - Multi-page document support

2. **Signature Creation**
   - Draw signature with mouse/touch
   - Type signature with font selection
   - Upload signature image
   - Save signature for reuse

3. **Document Editing**
   - Place signatures anywhere on PDF
   - Add text fields, checkboxes, dates
   - Resize and move elements
   - Undo/redo functionality

4. **Workflow Management**
   - Send documents for signing
   - Track signature status
   - Email notifications
   - Signing order management

## Code Style Guidelines

- Use functional components with TypeScript
- Implement proper error handling with try-catch
- Use Tailwind for all styling (no custom CSS)
- Follow Next.js App Router conventions
- Use server components where possible
- Implement proper loading states
- Use zod for form validation
- Create reusable components in `/components`

## File Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── signature/        # Signature-related components
│   └── pdf/              # PDF handling components
├── lib/                   # Utility functions
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## Component Naming

- Use PascalCase for components
- Use descriptive names (e.g., `SignaturePad`, `PDFViewer`)
- Include component type in name (e.g., `SignatureModal`, `PDFUploadDialog`)

## State Management

- Use React hooks for local state
- Consider Zustand for global state if needed
- Use React Query for server state

## Performance Considerations

- Lazy load PDF pages for large documents
- Optimize signature canvas rendering
- Use Next.js Image component for images
- Implement proper caching strategies

## Accessibility

- Add proper ARIA labels
- Ensure keyboard navigation
- Provide alt text for images
- Use semantic HTML elements

## Error Handling

- Display user-friendly error messages
- Log errors for debugging
- Implement fallback UI for failed states
- Validate all user inputs

## Security

- Validate file types on upload
- Sanitize user inputs
- Implement proper authentication
- Secure API endpoints

When generating code, prioritize:

1. TypeScript type safety
2. Responsive design with Tailwind
3. Accessibility best practices
4. Performance optimization
5. Error boundary implementation
6. Clean, readable code structure
