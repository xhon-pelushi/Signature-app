"use client";

import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Spinner } from "@/components/ui/Spinner";

type Props = {
  file: File | string | ArrayBuffer;
  onSelect: (page: number) => void; // 1-based
  currentPage: number;
};

export default function ThumbnailsRail({ file, onSelect, currentPage }: Props) {
  // Ensure worker is configured here too, as this component may render before PDFViewer.
  try {
    const v = (pdfjs as unknown as { version?: string }).version || "5.4.54";
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${v}/build/pdf.worker.min.mjs`;
  } catch {
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.54/build/pdf.worker.min.mjs";
  }
  const [numPages, setNumPages] = useState(0);
  const fileProp = useMemo(() => (typeof file === "string" ? { url: file } : file), [file]);

  return (
    <div className="w-32 bg-white border rounded-lg overflow-auto" style={{ maxHeight: 600 }}>
      <Document
        file={fileProp}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="p-3 text-gray-600 flex items-center gap-2">
            <Spinner />
            <span>Loading…</span>
          </div>
        }
      >
        <div className="p-2 space-y-2">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`block w-full border rounded hover:border-blue-500 ${p === currentPage ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => onSelect(p)}
            >
              <Page
                pageNumber={p}
                width={112}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              <div className="text-[11px] text-gray-600 py-1">Page {p}</div>
            </button>
          ))}
        </div>
      </Document>
    </div>
  );
}
