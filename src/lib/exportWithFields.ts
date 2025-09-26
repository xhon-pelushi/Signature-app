import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { PDFImage } from "pdf-lib";
import type { Field } from "@/types/fields";

export type FieldsByPage = Record<number, Field[]>; // 1-based page index

export async function exportWithFields(
  input: File | Blob | ArrayBuffer,
  fields: FieldsByPage,
  opts?: { signatureDataUrl?: string },
): Promise<Blob> {
  const bytes = input instanceof ArrayBuffer ? input : await input.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let signatureImage: PDFImage | undefined;
  if (opts?.signatureDataUrl) {
    try {
      signatureImage = await pdfDoc.embedPng(opts.signatureDataUrl);
    } catch {
      signatureImage = undefined;
    }
  }

  for (let i = 0; i < pages.length; i++) {
    const pageIndex = i + 1; // 1-based
    const page = pages[i];
    const pageW = page.getWidth();
    const pageH = page.getHeight();
    const pageFields = fields[pageIndex] || [];

    for (const f of pageFields) {
      // Convert normalized coords (x,y,w,h) with top-left origin to PDF coords (bottom-left)
      const x = f.x * pageW;
      const h = f.h * pageH;
      const yTop = f.y * pageH;
      const y = pageH - yTop - h;
      const w = f.w * pageW;

      switch (f.type) {
        case "signature": {
          if (signatureImage) {
            // Draw the signature image proportionally inside the box
            const imgW = signatureImage.width;
            const imgH = signatureImage.height;
            const scale = Math.min(w / imgW, h / imgH);
            const dw = imgW * scale;
            const dh = imgH * scale;
            const cx = x + (w - dw) / 2;
            const cy = y + (h - dh) / 2;
            page.drawImage(signatureImage, { x: cx, y: cy, width: dw, height: dh });
            page.drawRectangle({
              x,
              y,
              width: w,
              height: h,
              borderColor: rgb(0.16, 0.4, 0.8),
              borderWidth: 0.5,
            });
          } else {
            page.drawRectangle({
              x,
              y,
              width: w,
              height: h,
              borderColor: rgb(0.16, 0.4, 0.8),
              borderWidth: 1,
            });
            page.drawText("Sign here", {
              x: x + 4,
              y: y + h / 2 - 5,
              size: Math.max(8, Math.min(14, h * 0.4)),
              font,
              color: rgb(0.16, 0.4, 0.8),
            });
          }
          break;
        }
        case "text": {
          page.drawRectangle({
            x,
            y,
            width: w,
            height: h,
            borderColor: rgb(0.2, 0.2, 0.2),
            borderWidth: 1,
          });
          page.drawText(f.label ?? "Text", {
            x: x + 4,
            y: y + h / 2 - 5,
            size: Math.max(8, Math.min(12, h * 0.4)),
            font,
            color: rgb(0.2, 0.2, 0.2),
          });
          break;
        }
        case "checkbox": {
          const size = Math.min(w, h);
          page.drawRectangle({
            x,
            y,
            width: size,
            height: size,
            borderColor: rgb(0.4, 0, 0.6),
            borderWidth: 1,
          });
          break;
        }
        case "date": {
          page.drawRectangle({
            x,
            y,
            width: w,
            height: h,
            borderColor: rgb(1, 0.5, 0),
            borderWidth: 1,
          });
          page.drawText("Date", {
            x: x + 4,
            y: y + h / 2 - 5,
            size: Math.max(8, Math.min(12, h * 0.4)),
            font,
            color: rgb(1, 0.5, 0),
          });
          break;
        }
        default:
          break;
      }
    }
  }

  const out = await pdfDoc.save({ updateFieldAppearances: false });
  const ab = out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) as ArrayBuffer;
  return new Blob([ab as ArrayBuffer], { type: "application/pdf" });
}
