import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function createEmptyPdf(title = "Sample Document") {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 24;

  page.drawText(title, {
    x: 72,
    y: height - 72 - fontSize,
    size: fontSize,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText("This is a sample PDF generated for testing the viewer.", {
    x: 72,
    y: height - 120,
    size: 12,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const bytes = await pdfDoc.save();
  // Convert to ArrayBuffer for Blob typing compatibility
  const arrayCopy = new Uint8Array(bytes.byteLength);
  arrayCopy.set(bytes);
  return new Blob([arrayCopy], { type: "application/pdf" });
}
