/** Options for client-side PDF validation. */
export interface ValidatePdfOptions {
  maxSizeBytes?: number; // default 25MB
  allowedMimeTypes?: string[]; // default ['application/pdf']
  sniffHeader?: boolean; // perform minimal magic number sniff
}

/** Result of client-side PDF validation. */
export interface PdfValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate an uploaded PDF file with size, MIME, and optional header sniffing.
 * This is a lightweight client-side guard; server-side validation still required in production.
 */
export async function validatePdfFile(
  file: File | Blob,
  opts: ValidatePdfOptions = {},
): Promise<PdfValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const {
    maxSizeBytes = 25 * 1024 * 1024,
    allowedMimeTypes = ["application/pdf"],
    sniffHeader = true,
  } = opts;

  if (!allowedMimeTypes.includes((file as File | Blob).type)) {
    const t = (file as File | Blob).type as string | undefined;
    errors.push(`Unsupported MIME type: ${t || "unknown"}`);
  }
  if (file.size > maxSizeBytes) {
    errors.push(`File exceeds maximum size of ${(maxSizeBytes / (1024 * 1024)).toFixed(1)} MB`);
  }
  if (sniffHeader) {
    try {
      const text = await (file as Blob).text();
      const header = text.slice(0, 5);
      if (!header.startsWith("%PDF-")) {
        errors.push("File does not start with %PDF- magic header");
      }
    } catch {
      warnings.push("Unable to read file header for sniffing");
    }
  }
  return { ok: errors.length === 0, errors, warnings };
}
