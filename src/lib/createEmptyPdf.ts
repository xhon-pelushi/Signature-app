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
  // Extended watermark angle control (degrees)
  watermarkAngle?: number; // rotation angle in degrees for watermark text (default 45)
  // New customization options
  titleColor?: [number, number, number]; // 0..1 rgb
  bodyText?: string; // override default body text
  bodyColor?: [number, number, number]; // 0..1 rgb
  bodyLineHeight?: number; // multiplier for line height when wrapping body text
  bodyAlign?: "left" | "center"; // alignment for wrapped body text
  bodyMaxLines?: number; // maximum number of wrapped body lines to render (per page)
  bodyIndentFirstLine?: number; // points to indent the first line of each paragraph
  paragraphSpacing?: number; // extra vertical points after each paragraph (multiplicative of bodyLineHeight if < 10?)
  hyphenateLongWords?: boolean; // attempt naive hyphenation when breaking long words
  ellipsisOverflow?: boolean; // append an ellipsis character if body text is truncated by space or line cap
  debugBoundingBoxes?: boolean; // draw translucent rectangles behind each rendered body line for layout debugging
  bodyMaxParagraphs?: number; // cap the number of paragraphs processed from bodyText
  bodyLineNumbers?: boolean | { color?: [number, number, number]; align?: 'left' | 'right'; gutter?: number; fontSize?: number }; // show line numbers for body lines (debug/reading)
  titleAlign?: "left" | "center"; // alignment for the title text
  footerDateFormat?: "iso" | "locale" | "none"; // control footer date format
  footerFormat?: string; // tokenized format for footer text: {app}, {title}, {date}, {page}, {pages}, {sep}
  // Typography and page appearance
  titleFontSize?: number; // default 24
  bodyFontSize?: number; // default 12
  backgroundColor?: [number, number, number]; // 0..1 rgb, optional
  footerAlign?: "left" | "center" | "right"; // where to place footer text
  footerColor?: [number, number, number]; // footer text color (default gray)
  titleSpacing?: number; // extra vertical space after the title (points)
  subtitleSpacing?: number; // extra vertical space after the subtitle (points)
  // Layout
  margins?: number | { top: number; right: number; bottom: number; left: number }; // points
  ruleOfThirds?: boolean; // draw faint thirds grid overlay inside margins
  titleUnderline?: boolean; // draw a faint underline under the title
  contentPadding?: number; // inner padding inside content box for body text
  // Subtitle and border
  subtitleText?: string;
  subtitleColor?: [number, number, number];
  subtitleFontSize?: number; // default 14
  subtitleAlign?: "left" | "center";
  pageBorder?: { color?: [number, number, number]; width?: number; inset?: number; dashed?: boolean; dashArray?: number[] };
  // Header rule under title/subtitle
  headerRule?: { color?: [number, number, number]; width?: number; offset?: number; inset?: number };
  // Text transforms for header texts
  titleTransform?: "uppercase" | "lowercase" | "titlecase" | "none";
  subtitleTransform?: "uppercase" | "lowercase" | "titlecase" | "none";
  // Page numbers
  pageNumbers?: {
    position?: "top" | "bottom"; // default bottom
    align?: "left" | "center" | "right"; // default right
    size?: number; // default 10
    color?: [number, number, number]; // default [0.5,0.5,0.5]
    format?: string; // default "Page {page} of {pages}"
    enabled?: boolean; // default true if provided
  };
  suppressFooterOnFirstPage?: boolean; // don't draw footer on page index 0
  suppressPageNumbersOnFirstPage?: boolean; // don't draw pageNumbers for first page
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
  const { pages = 1, size = "LETTER", orientation = "portrait", footer = true, subject = "Sample PDF", author = "SignatureApp", keywords = ["SignatureApp", "Sample", "PDF"], guides = false, watermark, watermarkAngle = 45, titleColor = [0.2, 0.2, 0.2], bodyText = "This is a sample PDF generated for testing the viewer.", bodyColor = [0.3, 0.3, 0.3], bodyLineHeight = 1.4, bodyAlign = "left", bodyMaxLines, bodyIndentFirstLine, paragraphSpacing, hyphenateLongWords, ellipsisOverflow, debugBoundingBoxes, bodyLineNumbers, bodyMaxParagraphs, titleAlign = "left", footerDateFormat = "iso", footerFormat, titleFontSize = 24, bodyFontSize = 12, backgroundColor, footerAlign = "left", footerColor = [0.5, 0.5, 0.5], titleSpacing = 0, subtitleSpacing = 0, margins, contentPadding = 0, subtitleText, subtitleColor = [0.35, 0.35, 0.35], subtitleFontSize = 14, subtitleAlign = "left", pageBorder, headerRule, titleTransform = "none", subtitleTransform = "none", pageNumbers, suppressFooterOnFirstPage, suppressPageNumbersOnFirstPage } = options;

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
    // Optional page border
    if (pageBorder) {
      const inset = pageBorder.inset ?? 0;
      const rect = {
        x: inset,
        y: inset,
        width: width - inset * 2,
        height: height - inset * 2,
        borderColor: rgb(...(pageBorder.color ?? [0.8, 0.8, 0.8])),
        borderWidth: pageBorder.width ?? 1,
      } as const;
      if (pageBorder.dashed || (pageBorder.dashArray && pageBorder.dashArray.length > 0)) {
        const dash = pageBorder.dashArray ?? [6, 4];
        // Draw dashed rectangle manually using four lines
        const x0 = rect.x, y0 = rect.y, x1 = rect.x + rect.width, y1 = rect.y + rect.height;
        const color = rect.borderColor; const thickness = rect.borderWidth;
        const drawDashedLine = (sx: number, sy: number, ex: number, ey: number) => {
          const dx = ex - sx; const dy = ey - sy; const len = Math.hypot(dx, dy);
          if (len === 0) return;
          const ux = dx / len; const uy = dy / len;
          let dist = 0; let draw = true; let idx = 0; let x = sx; let y = sy;
          while (dist < len) {
            const seg = dash[idx % dash.length];
            const nx = x + ux * seg; const ny = y + uy * seg;
            const clamped = Math.min(seg, len - dist);
            const cx = x + ux * clamped; const cy = y + uy * clamped;
            if (draw) {
              page.drawLine({ start: { x, y }, end: { x: cx, y: cy }, thickness, color });
            }
            x = nx; y = ny; dist += seg; idx++; draw = !draw;
          }
        };
        drawDashedLine(x0, y0, x1, y0); // bottom
        drawDashedLine(x1, y0, x1, y1); // right
        drawDashedLine(x1, y1, x0, y1); // top
        drawDashedLine(x0, y1, x0, y0); // left
      } else {
        page.drawRectangle(rect);
      }
    }

    // Resolve margins (default 1")
    const m = typeof margins === "number"
      ? { top: margins, right: margins, bottom: margins, left: margins }
      : margins ?? { top: 72, right: 72, bottom: 72, left: 72 };
  const contentWidth = Math.max(0, width - m.left - m.right);
  const contentHeight = Math.max(0, height - m.top - m.bottom);

    // Title
    const transformText = (t: string, kind: "uppercase" | "lowercase" | "titlecase" | "none") => {
      switch (kind) {
        case "uppercase":
          return t.toUpperCase();
        case "lowercase":
          return t.toLowerCase();
        case "titlecase":
          return t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        default:
          return t;
      }
    };
    const titleText = transformText(title, titleTransform);
    const titleX = titleAlign === "center" ? (width - font.widthOfTextAtSize(titleText, titleSize)) / 2 : m.left;
    page.drawText(titleText, {
      x: titleX,
      y: height - m.top - titleSize,
      size: titleSize,
      font,
      color: rgb(titleColor[0], titleColor[1], titleColor[2]),
    });
    if (options.titleUnderline) {
      const ux = titleAlign === "center" ? (width - font.widthOfTextAtSize(titleText, titleSize)) / 2 : m.left;
      const uw = font.widthOfTextAtSize(titleText, titleSize);
      const uy = height - m.top - titleSize - 4;
      page.drawLine({ start: { x: ux, y: uy }, end: { x: ux + uw, y: uy }, thickness: 0.75, color: rgb(0.7, 0.7, 0.7), opacity: 0.8 });
    }

    // Optional subtitle
    let bodyY = height - m.top - titleSize - 36 - (titleSpacing ?? 0);
    if (subtitleText) {
      const subtitleTextTx = transformText(subtitleText, subtitleTransform);
      const subX = subtitleAlign === "center" ? (width - font.widthOfTextAtSize(subtitleTextTx, subtitleFontSize)) / 2 : m.left;
      const subY = height - m.top - titleSize - 18 - (titleSpacing ?? 0);
      page.drawText(subtitleTextTx, {
        x: subX,
        y: subY,
        size: subtitleFontSize,
        font,
        color: rgb(subtitleColor[0], subtitleColor[1], subtitleColor[2]),
      });
      bodyY = subY - 24 - (subtitleSpacing ?? 0);
    }
    // Optional header rule (drawn relative to body start)
    if (headerRule) {
      const inset = headerRule.inset ?? 0;
      const ruleY = bodyY + (headerRule.offset ?? 8);
      const x1 = m.left + inset;
      const x2 = width - m.right - inset;
      page.drawLine({
        start: { x: x1, y: ruleY },
        end: { x: x2, y: ruleY },
        thickness: headerRule.width ?? 0.75,
        color: rgb(...(headerRule.color ?? [0.85, 0.85, 0.85])),
      });
      // Add a bit more space before body if rule is present
      bodyY = ruleY - 8;
    }

    // Body text with paragraph-aware wrapping
    const wrapParagraph = (para: string, maxWidth: number): string[] => {
      const out: string[] = [];
      const words = para.split(/\s+/);
      let line = "";
      for (const word of words) {
        const candidate = line ? line + " " + word : word;
        const candidateWidth = font.widthOfTextAtSize(candidate, bodyFontSize);
        if (candidateWidth <= maxWidth) {
          line = candidate;
        } else {
          if (line) out.push(line);
          // Hard-break overlong word
          if (font.widthOfTextAtSize(word, bodyFontSize) > maxWidth) {
            if (hyphenateLongWords) {
              // naive hyphenation: break word into chunks that fit with a trailing '-'
              let remaining = word;
              while (font.widthOfTextAtSize(remaining, bodyFontSize) > maxWidth && remaining.length > 2) {
                let cut = remaining.length - 1;
                while (cut > 2 && font.widthOfTextAtSize(remaining.slice(0, cut) + '-', bodyFontSize) > maxWidth) {
                  cut--;
                }
                if (cut <= 2) break;
                out.push(remaining.slice(0, cut) + '-');
                remaining = remaining.slice(cut);
              }
              line = remaining;
            } else {
              let chunk = "";
              for (const ch of word) {
                const testChunk = chunk + ch;
                if (font.widthOfTextAtSize(testChunk, bodyFontSize) <= maxWidth) {
                  chunk = testChunk;
                } else {
                  if (chunk) out.push(chunk);
                  chunk = ch;
                }
              }
              line = chunk;
            }
          } else {
            line = word;
          }
        }
      }
      if (line) out.push(line);
      return out;
    };

    const innerLeft = m.left + contentPadding;
    const innerRight = width - m.right - contentPadding;
    const innerWidth = Math.max(0, innerRight - innerLeft);
    let paragraphs = bodyText.split(/\n/);
    if (typeof bodyMaxParagraphs === 'number' && bodyMaxParagraphs >= 0) {
      paragraphs = paragraphs.slice(0, bodyMaxParagraphs);
    }
    const bodyLines: { text: string; first: boolean }[] = [];
    for (const p of paragraphs) {
      const lines = wrapParagraph(p, innerWidth - (bodyIndentFirstLine ?? 0));
      lines.forEach((ln, idx) => bodyLines.push({ text: ln, first: idx === 0 }));
      // add blank marker for paragraph spacing if paragraphSpacing provided
      if (paragraphSpacing && paragraphSpacing > 0) {
        bodyLines.push({ text: "", first: false });
      }
    }
    let currentY = bodyY;
    const lineStep = bodyFontSize * bodyLineHeight;
    let linesDrawn = 0;
    let lastDrawnY = currentY;
    let displayLineIndex = 0;
    for (const lineObj of bodyLines) {
      const line = lineObj.text;
      if (currentY < m.bottom + lineStep) break; // stop drawing if we run out of space
      if (typeof bodyMaxLines === "number" && linesDrawn >= bodyMaxLines) break; // respect max lines cap
      if (line.trim().length === 0) {
        // paragraph spacing
        currentY -= (paragraphSpacing || 0);
      } else {
        const lineWidth = font.widthOfTextAtSize(line, bodyFontSize);
        const indentX = lineObj.first && bodyIndentFirstLine ? bodyIndentFirstLine : 0;
        const availableWidth = innerWidth - (lineObj.first && bodyIndentFirstLine ? bodyIndentFirstLine : 0);
        const lineX = bodyAlign === "center" ? innerLeft + indentX + Math.max(0, (availableWidth - lineWidth) / 2) : innerLeft + indentX;
        if (bodyLineNumbers) {
          const lnCfg = typeof bodyLineNumbers === 'object' ? bodyLineNumbers : {};
          const lnColor = lnCfg.color ?? [0.6,0.6,0.6];
          const lnAlign = lnCfg.align ?? 'left';
          const gutter = lnCfg.gutter ?? 8;
          const lnFontSize = lnCfg.fontSize ?? Math.max(8, bodyFontSize * 0.8);
          const numText = String(displayLineIndex + 1);
          const numWidth = font.widthOfTextAtSize(numText, lnFontSize);
          const numX = lnAlign === 'left' ? innerLeft - gutter - numWidth : innerRight + gutter;
          page.drawText(numText, {
            x: numX,
            y: currentY,
            size: lnFontSize,
            font,
            color: rgb(lnColor[0], lnColor[1], lnColor[2]),
          });
          displayLineIndex++;
        }
        if (debugBoundingBoxes) {
          const boxHeight = bodyFontSize * bodyLineHeight;
            page.drawRectangle({
              x: lineX - 1,
              y: currentY - bodyFontSize * 0.2,
              width: lineWidth + 2,
              height: boxHeight,
              color: rgb(1, 0, 0),
              opacity: 0.05,
              borderColor: rgb(1, 0, 0),
              borderWidth: 0.25,
            });
        }
        page.drawText(line, {
            x: lineX,
            y: currentY,
            size: bodyFontSize,
            font,
            color: rgb(bodyColor[0], bodyColor[1], bodyColor[2]),
          });
        lastDrawnY = currentY;
        currentY -= lineStep;
        linesDrawn++;
      }
    }

    if (ellipsisOverflow) {
      const totalNonBlank = bodyLines.filter(b => b.text.trim().length > 0).length;
      const wasTruncatedByLines = typeof bodyMaxLines === "number" && totalNonBlank > (bodyMaxLines ?? 0);
      const wasTruncatedBySpace = currentY < m.bottom + lineStep;
      if ((wasTruncatedByLines || wasTruncatedBySpace) && linesDrawn > 0) {
        const ellipsis = "…";
        page.drawText(ellipsis, {
          x: innerLeft + (bodyAlign === "center" ? 0 : 0) + 2,
          y: lastDrawnY,
          size: bodyFontSize,
          font,
          color: rgb(bodyColor[0], bodyColor[1], bodyColor[2]),
        });
      }
    }

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
        rotate: degrees(watermarkAngle),
        opacity,
      });
    }

    // Footer with date and page number
  if (footer && !(suppressFooterOnFirstPage && i === 0)) {
      const now = new Date();
      const date = footerDateFormat === "none" ? "" : footerDateFormat === "locale" ? now.toLocaleDateString() : now.toISOString().slice(0, 10);
      const appName = "SignatureApp";
      const defaultFooterText = `Generated by ${appName}${date ? ` • ${date}` : ""} • Page ${i + 1} of ${pages}`;
      const footerText = footerFormat
        ? footerFormat
            .replace(/\{app\}/g, appName)
            .replace(/\{title\}/g, title)
            .replace(/\{date\}/g, date)
            .replace(/\{page\}/g, String(i + 1))
            .replace(/\{pages\}/g, String(pages))
            .replace(/\{sep\}/g, date ? " • " : "")
        : defaultFooterText;
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
        color: rgb(footerColor[0], footerColor[1], footerColor[2]),
      });
    }

    // Optional page numbers separate from footer
  if (pageNumbers && (pageNumbers.enabled ?? true) && !(suppressPageNumbersOnFirstPage && i === 0)) {
      const fmt = pageNumbers.format ?? "Page {page} of {pages}";
      const text = fmt.replace("{page}", String(i + 1)).replace("{pages}", String(pages));
      const size = pageNumbers.size ?? 10;
      const colorArr = pageNumbers.color ?? [0.5, 0.5, 0.5];
      const align = pageNumbers.align ?? "right";
      const position = pageNumbers.position ?? "bottom";
      const textWidth = font.widthOfTextAtSize(text, size);
      let x = m.left;
      if (align === "center") {
        x = (width - textWidth) / 2;
      } else if (align === "right") {
        x = width - m.right - textWidth;
      }
      const topY = height - Math.max(24, m.top / 2);
      const bottomY = Math.max(24, m.bottom / 2);
      const y = position === "top" ? topY : bottomY;
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(colorArr[0], colorArr[1], colorArr[2]),
      });
    }
  }

  const bytes = await pdfDoc.save();
  // Convert to ArrayBuffer for Blob typing compatibility
  const arrayCopy = new Uint8Array(bytes.byteLength);
  arrayCopy.set(bytes);
  return new Blob([arrayCopy], { type: "application/pdf" });
}
