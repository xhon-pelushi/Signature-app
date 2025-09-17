import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

type PageSizeName = "LETTER" | "A4" | "LEGAL" | "TABLOID" | "A5";
type PageSize = PageSizeName | [number, number];

export type CreateEmptyPdfOptions = {
  pages?: number; // number of pages to generate
  size?: PageSize; // page size name or [width,height]
  orientation?: "portrait" | "landscape";
  footer?: boolean; // draw a footer with date/app name
  subject?: string;
  author?: string;
  keywords?: string[];
  guides?: boolean; // draw faint 1" margin guides
  watermark?: { text: string; opacity?: number; size?: number }; // optional diagonal watermark
  // New customization options
  titleColor?: [number, number, number]; // 0..1 rgb
  bodyText?: string; // override default body text
  bodyColor?: [number, number, number]; // 0..1 rgb
  titleAlign?: "left" | "center"; // alignment for the title text
  footerDateFormat?: "iso" | "locale" | "none"; // control footer date format
  // Typography and page appearance
  titleFontSize?: number; // default 24
  bodyFontSize?: number; // default 12
  backgroundColor?: [number, number, number]; // 0..1 rgb, optional
  footerAlign?: "left" | "center" | "right"; // where to place footer text
  // Layout
  margins?: number | { top: number; right: number; bottom: number; left: number }; // points
  ruleOfThirds?: boolean; // draw faint thirds grid overlay inside margins
};

const PAGE_SIZES: Record<PageSizeName, [number, number]> = {
  LETTER: [612, 792],
  A4: [595.28, 841.89],
  LEGAL: [612, 1008],
  TABLOID: [792, 1224],
  A5: [419.53, 595.28],
};

function resolveSize(size: PageSize = "LETTER", orientation: "portrait" | "landscape" = "portrait"): [number, number] {
  const base = Array.isArray(size) ? size : PAGE_SIZES[size] ?? PAGE_SIZES.LETTER;
  if (orientation === "landscape") {
    return [base[1], base[0]];
  }
  return [base[0], base[1]];
}

/**
 * Generate a sample PDF for testing the viewer and signature workflow.
 *
 * @param title - The document title (drawn on each page and set as PDF metadata)
 * @param options - PDF generation options:
 *   - pages: number of pages (default 1)
 *   - size: page size ("LETTER", "A4", or [width, height])
 *   - orientation: "portrait" or "landscape"
 *   - footer: whether to draw a footer with date/app name (default true)
 *   - subject, author, keywords: PDF metadata
 * @returns Blob of the generated PDF (application/pdf)
 *
 * Example:
 *   const blob = await createEmptyPdf("Demo", { pages: 2, size: "A4", orientation: "landscape" });
 */
export async function createEmptyPdf(title = "Sample Document", options: CreateEmptyPdfOptions = {}) {
  const { pages = 1, size = "LETTER", orientation = "portrait", footer = true, subject = "Sample PDF", author = "SignatureApp", keywords = ["SignatureApp", "Sample", "PDF"], guides = false, watermark, titleColor = [0.2, 0.2, 0.2], bodyText = "This is a sample PDF generated for testing the viewer.", bodyColor = [0.3, 0.3, 0.3], titleAlign = "left", footerDateFormat = "iso", titleFontSize = 24, bodyFontSize = 12, backgroundColor, footerAlign = "left", margins } = options;

  const pdfDoc = await PDFDocument.create();

  // Document metadata
  try {
    pdfDoc.setTitle(title);
    pdfDoc.setAuthor(author);
    pdfDoc.setSubject(subject);
    pdfDoc.setKeywords(keywords);
    pdfDoc.setProducer("SignatureApp PDF Generator");
    pdfDoc.setCreationDate(new Date());
  } catch {
    // ignore metadata errors on older readers
  }

  const [w, h] = resolveSize(size, orientation);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const titleSize = titleFontSize;

  for (let i = 0; i < pages; i++) {
    const page = pdfDoc.addPage([w, h]);
    const { width, height } = page.getSize();

    // Optional page background fill
    if (backgroundColor) {
      page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(backgroundColor[0], backgroundColor[1], backgroundColor[2]) });
    }

    // Resolve margins (default 1")
    const m = typeof margins === "number"
      ? { top: margins, right: margins, bottom: margins, left: margins }
      : margins ?? { top: 72, right: 72, bottom: 72, left: 72 };
    const contentWidth = Math.max(0, width - m.left - m.right);
    const contentHeight = Math.max(0, height - m.top - m.bottom);

    // Title
    const titleX = titleAlign === "center" ? (width - font.widthOfTextAtSize(title, titleSize)) / 2 : m.left;
    page.drawText(title, {
      x: titleX,
      y: height - m.top - titleSize,
      size: titleSize,
      font,
      color: rgb(titleColor[0], titleColor[1], titleColor[2]),
    });

    // Body text
    page.drawText(bodyText, {
      x: m.left,
      y: height - m.top - titleSize - 36,
      size: bodyFontSize,
      font,
      color: rgb(bodyColor[0], bodyColor[1], bodyColor[2]),
    });

    if (guides) {
      page.drawRectangle({
        x: m.left,
        y: m.bottom,
        width: contentWidth,
        height: contentHeight,
        borderColor: rgb(0.85, 0.85, 0.85),
        borderWidth: 0.5,
        opacity: 0.6,
      });
    }

    if (options.ruleOfThirds) {
      const lineColor = rgb(0.85, 0.85, 0.85);
      const lw = 0.5;
      const x1 = m.left + contentWidth / 3;
      const x2 = m.left + (contentWidth * 2) / 3;
      const y1 = m.bottom + contentHeight / 3;
      const y2 = m.bottom + (contentHeight * 2) / 3;
      // verticals
      page.drawLine({ start: { x: x1, y: m.bottom }, end: { x: x1, y: m.bottom + contentHeight }, thickness: lw, color: lineColor, opacity: 0.5 });
      page.drawLine({ start: { x: x2, y: m.bottom }, end: { x: x2, y: m.bottom + contentHeight }, thickness: lw, color: lineColor, opacity: 0.5 });
      // horizontals
      page.drawLine({ start: { x: m.left, y: y1 }, end: { x: m.left + contentWidth, y: y1 }, thickness: lw, color: lineColor, opacity: 0.5 });
      page.drawLine({ start: { x: m.left, y: y2 }, end: { x: m.left + contentWidth, y: y2 }, thickness: lw, color: lineColor, opacity: 0.5 });
    }

    if (watermark?.text) {
      const text = watermark.text;
      const size = watermark.size ?? Math.min(width, height) / 5;
      const opacity = watermark.opacity ?? 0.08;
      const textWidth = font.widthOfTextAtSize(text, size);
      const textHeight = size;
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: (height - textHeight) / 2,
        size,
        font,
        color: rgb(0.2, 0.2, 0.2),
        rotate: degrees(45),
        opacity,
      });
    }

    // Footer with date and page number
    if (footer) {
      const now = new Date();
      const date = footerDateFormat === "none" ? "" : footerDateFormat === "locale" ? now.toLocaleDateString() : now.toISOString().slice(0, 10);
      const footerText = `Generated by SignatureApp${date ? ` • ${date}` : ""} • Page ${i + 1} of ${pages}`;
      let x = m.left;
      const footerSize = 10;
      if (footerAlign === "center") {
        x = (width - font.widthOfTextAtSize(footerText, footerSize)) / 2;
      } else if (footerAlign === "right") {
        x = width - m.right - font.widthOfTextAtSize(footerText, footerSize);
      }
      page.drawText(footerText, {
        x,
        y: Math.max(24, m.bottom / 2),
        size: footerSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }
  }

  const bytes = await pdfDoc.save();
  // Convert to ArrayBuffer for Blob typing compatibility
  const arrayCopy = new Uint8Array(bytes.byteLength);
  arrayCopy.set(bytes);
  return new Blob([arrayCopy], { type: "application/pdf" });
}
