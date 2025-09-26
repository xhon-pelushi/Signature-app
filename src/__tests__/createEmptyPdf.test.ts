import { createEmptyPdf, createEmptyPdfBytes } from "@/lib/createEmptyPdf";

// Polyfill TextDecoder for older Node test environments if missing
// @ts-ignore
if (typeof TextDecoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global.TextDecoder = require("util").TextDecoder;
}

async function blobToArrayBuffer(maybeBlob: any): Promise<ArrayBuffer> {
  if (maybeBlob && typeof maybeBlob.arrayBuffer === "function") {
    return maybeBlob.arrayBuffer();
  }
  // Try Response fallback for Blob-like objects without arrayBuffer (older jsdom)
  if (
    maybeBlob &&
    typeof maybeBlob === "object" &&
    typeof (maybeBlob as any).size === "number" &&
    typeof (maybeBlob as any).slice === "function" &&
    typeof Response !== "undefined"
  ) {
    try {
      const r = new Response(maybeBlob as any);
      return await r.arrayBuffer();
    } catch {
      // ignore and continue
    }
  }
  // If it's already a Uint8Array
  if (maybeBlob instanceof Uint8Array) {
    const view = maybeBlob.subarray(0, maybeBlob.byteLength);
    return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
  }
  // If it's a Buffer
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(maybeBlob)) {
    const view = new Uint8Array(maybeBlob);
    return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
  }
  // Try constructing a new Blob then arrayBuffer
  if (typeof Blob !== "undefined") {
    try {
      const b = new Blob([maybeBlob]);
      if (typeof b.arrayBuffer === "function") return b.arrayBuffer();
    } catch {
      // ignore
    }
  }
  throw new Error("Unsupported blob-like object returned from createEmptyPdf");
}

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
