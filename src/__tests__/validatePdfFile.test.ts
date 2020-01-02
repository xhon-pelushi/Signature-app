import { validatePdfFile } from "@/lib/validatePdfFile";

describe("validatePdfFile", () => {
  function makePdfFile({
    name = "sample.pdf",
    mime = "application/pdf",
    sizeBytes,
    header = "%PDF-1.7\n%…\n",
  }: Partial<{ name: string; mime: string; sizeBytes: number; header: string }> = {}) {
    const body = header + "fake-pdf-body";
    const blob = new Blob([body], { type: mime });
    // pad to sizeBytes if requested
    if (sizeBytes && sizeBytes > blob.size) {
      const pad = new Uint8Array(sizeBytes - blob.size);
      return new File([blob, pad], name, { type: mime });
    }
    return new File([blob], name, { type: mime });
  }

  it("accepts a valid small PDF", async () => {
    const f = makePdfFile({});
    const res = await validatePdfFile(f, { maxSizeBytes: 5 * 1024 * 1024 });
    expect(res.ok).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("rejects wrong MIME type", async () => {
    const f = makePdfFile({ name: "not.pdf", mime: "text/plain" });
    const res = await validatePdfFile(f);
    expect(res.ok).toBe(false);
    expect(res.errors.join(" ")).toMatch(/Unsupported MIME/);
  });

  it("rejects oversize file", async () => {
    const f = makePdfFile({ sizeBytes: 30 * 1024 * 1024 });
    const res = await validatePdfFile(f, { maxSizeBytes: 10 * 1024 * 1024 });
    expect(res.ok).toBe(false);
    expect(res.errors.join(" ")).toMatch(/exceeds maximum allowed size/);
  });

  // Header sniffing can be environment-dependent in jsdom; we exercise it indirectly elsewhere.

  it("can skip header sniffing when disabled", async () => {
    const f = makePdfFile({ mime: "application/pdf", header: "BOGUS" });
    const res = await validatePdfFile(f, { sniffHeader: false });
    // With sniffing disabled, only MIME/size are checked
    expect(res.ok).toBe(true);
  });
});
