# SignatureApp - Digital Document Signing Platform

![Status](https://img.shields.io/badge/status-WIP-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38B2AC)
![License](https://img.shields.io/badge/license-MIT-green)

A modern digital signature application built with Next.js 15, TypeScript, and Tailwind CSS. Create, sign, and manage document signing workflows similar to DocuSign.

## 🚀 Features

### Core Functionality

- **PDF Upload & Viewer**: Drag & drop PDF upload with preview
- **Digital Signatures**: Draw, type, or upload signature images
- **Document Editing**: Place signatures and form fields anywhere on PDFs
- **Multi-signer Workflow**: Send documents to multiple signers in order
- **Real-time Tracking**: Monitor signature status and progress

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Intuitive Interface**: Clean, modern UI built with Tailwind CSS
- **Accessibility**: WCAG compliant with keyboard navigation
- **Fast Performance**: Optimized with Next.js 15 and Turbopack

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Handling**: pdf-lib, react-pdf, pdfjs-dist
- **Forms**: react-hook-form with Zod validation
- **Icons**: Lucide React
- **Canvas/Drawing**: html2canvas, jspdf
- **PDF Generation**: @react-pdf/renderer

## 🚀 Getting Started

### Prerequisites


### Installation
## Self-hosting

1) Copy env template and adjust secrets

  cp .env.example .env

2) Use SQLite (default) or Postgres


3) Initialize Prisma and run the app

  npm run prisma:generate
  npm run dev

4) First-run setup

Open http://localhost:3000 and you’ll be redirected to /setup. Provide organization and SMTP details to enable sending emails and mark the app initialized.

See also: docs/SETUP.md for the Admin Setup guide.

1. Clone the repository:

```bash
git clone https://github.com/yourusername/signature-app.git
cd signature-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── sign/              # Document signing interface
│   ├── create/            # Document creation workflow
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── signature/        # Signature-related components
│   └── pdf/              # PDF handling components
├── lib/                   # Utility functions
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🎯 Current Status

### ✅ Completed

- [x] Project setup with Next.js 15 + TypeScript
- [x] Tailwind CSS configuration
- [x] Home page with modern landing design
- [x] Sign page with PDF upload interface
- [x] Create page with signer management
- [x] Basic signature creation UI
- [x] Responsive design foundation

### 🚧 In Progress

- [ ] PDF viewer implementation with react-pdf
- [ ] Signature canvas with drawing functionality
- [ ] Drag & drop signature placement
- [ ] Form field creation and positioning

### 📋 Planned Features

- [ ] User authentication
- [ ] Document templates
- [ ] Email notifications
- [ ] Signature verification
- [ ] Audit trail
- [ ] API integration
- [ ] Database integration
- [ ] File storage (AWS S3/CloudFlare R2)
- [ ] Advanced PDF editing tools

## 📚 Documentation

- See docs/roadmap.md for upcoming features and milestones.
- See docs/changelog.md for a list of changes.
- See docs/troubleshooting.md for common issues and fixes.

### Sample PDF generation (dev aid)

Use the `createEmptyPdf` helper to quickly generate PDFs for testing:

```ts
import { createEmptyPdf } from "@/lib/createEmptyPdf";

// Minimal
const blob = await createEmptyPdf();

// With options: A4, landscape, guides, watermark, and custom colors/text
const blob2 = await createEmptyPdf("Demo", {
  pages: 2,
  size: "A4",
  orientation: "landscape",
  guides: true,
  watermark: { text: "DRAFT" },
  titleColor: [0.1, 0.1, 0.5],
  bodyText: "Hello from SignatureApp",
  bodyColor: [0.2, 0.2, 0.2],
});
```

## 🎨 Design System

The application follows a consistent design system:

- **Primary Colors**: Blue (#2563eb), White (#ffffff)
- **Secondary Colors**: Gray shades for text and backgrounds
- **Typography**: Default system fonts with clear hierarchy
- **Spacing**: Consistent padding and margins using Tailwind's scale
- **Components**: Reusable UI components with hover states

## 🧪 Development

### Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run typecheck` | TypeScript type checking only |
| `npm run lint` | ESLint (includes Prettier compatibility) |
| `npm test` | Run Jest test suites (jsdom) |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Dev migration (SQLite by default) |

### Self-host Quick Reference (SQLite)

```bash
cp .env.example .env
npm ci
npm run prisma:generate
npm run dev
```

Navigate to `http://localhost:3000` and complete the `/setup` wizard.

### Code Style

- Use TypeScript for all components
- Follow functional component patterns
- Implement proper error handling
- Use Tailwind for all styling
- Maintain accessibility standards

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the FAQ section

## 🚀 Deployment

The application can be deployed on:

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Docker containers

### Environment Variables

Create a `.env.local` file with:

```env
# Add your environment variables here
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

---

**Note**: This is an early-stage project focused on generating GitHub contribution activity. The core functionality is being actively developed. Contributions and feedback are welcome!
