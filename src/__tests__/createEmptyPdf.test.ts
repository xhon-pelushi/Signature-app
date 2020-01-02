import { createEmptyPdfBytes } from "@/lib/createEmptyPdf";

// Polyfill TextDecoder for older Node test environments if missing
if (typeof TextDecoder === "undefined") {
  // Use dynamic import to avoid require and typing issues
  (async () => {
    const util = await import("util");
    (globalThis as unknown as { TextDecoder?: unknown }).TextDecoder = util.TextDecoder as unknown;
  })();
}

// Note: Helper conversions removed; tests rely on createEmptyPdfBytes for simplicity.

function bytesToString(ab: ArrayBuffer): string {
  const arr = new Uint8Array(ab).slice(0, 4000); // sample initial bytes
  return new TextDecoder().decode(arr);
}

describe("createEmptyPdf", () => {
  it("generates a basic single-page PDF", async () => {
    const bytes = await createEmptyPdfBytes("TestDoc");
    expect(bytes.byteLength).toBeGreaterThan(800);
    const head = bytesToString(bytes.buffer);
    expect(head).toContain("%PDF");
  });

  it("applies hyphenation when enabled for long words", async () => {
    const longWord = "SupercalifragilisticexpialidociousMegaWordSequenceThatShouldWrap";
    const bytes = await createEmptyPdfBytes("HyphenTest", {
      bodyText: longWord,
      bodyMaxLines: 10,
      hyphenateLongWords: true,
    });
    expect(bytes.byteLength).toBeGreaterThan(800);
    const head = bytesToString(bytes.buffer);
    expect(head).toContain("%PDF");
  });

  it("adds ellipsis when truncated by bodyMaxLines with ellipsisOverflow", async () => {
    const text = Array.from(
      { length: 40 },
      (_, i) => `Paragraph ${i + 1} lorem ipsum dolor sit amet.`,
    ).join("\n");
    const bytes = await createEmptyPdfBytes("EllipsisTest", {
      bodyText: text,
      bodyMaxLines: 3,
      ellipsisOverflow: true,
    });
    expect(bytes.byteLength).toBeGreaterThan(800);
    const head = bytesToString(bytes.buffer);
    expect(head).toContain("%PDF");
  });
});
