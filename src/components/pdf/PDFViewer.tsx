"use client";

import { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// Configure pdf.js worker to match the exact API version react-pdf is using
// This avoids "API version X does not match Worker version Y" errors.
// React-pdf's bundled API currently reports 5.3.31 in your environment; pin worker to match.
// If this changes in the future, we can switch back to deriving from pdfjs.version reliably.
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs?v=5.3.31";

type PDFViewerProps = {
  file: File | string | ArrayBuffer;
  initialScale?: number; // 1.0 = 100%
  fitToWidth?: boolean;
  className?: string;
};

export default function PDFViewer({
  file,
  initialScale = 1.0,
  fitToWidth = true,
  className,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(initialScale);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
    setPageNumber(1);
  };

  // Fit-to-width adjustment using a rough heuristic based on container width
  useEffect(() => {
    const el = document.getElementById("pdf-container");
    if (!el) return;
    const resize = () => {
      const width = el.clientWidth;
      setContainerWidth(width);
      if (fitToWidth && width) {
        // width is passed to <Page /> below
      }
    };
    resize();
    const obs = new ResizeObserver(resize);
    obs.observe(el);
    return () => obs.disconnect();
  }, [fitToWidth]);

  const pageWidth = useMemo(() => {
    if (!containerWidth) return undefined;
    // Leave some padding for the container
    return Math.max(320, Math.floor(containerWidth - 32));
  }, [containerWidth]);

  const canPrev = pageNumber > 1;
  const canNext = pageNumber < numPages;

  // Normalize file prop for react-pdf to reduce warnings
  const fileProp = useMemo(() => {
    if (typeof file === "string") return { url: file };
    return file;
  }, [file]);

  // Memoize options so <Document /> doesn't think options changed every render
  const docOptions = useMemo(() => ({ cMapPacked: true as const }), []);

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
            aria-label="Previous page"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-700">
            Page {pageNumber} / {numPages || "-"}
          </span>
          <button
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={!canNext}
            aria-label="Next page"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setScale((s) => Math.max(0.25, parseFloat((s - 0.1).toFixed(2))))}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-16 text-center text-sm text-gray-700">{Math.round(scale * 100)}%</span>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setScale((s) => Math.min(3, parseFloat((s + 0.1).toFixed(2))))}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            className="ml-2 p-2 rounded hover:bg-gray-100"
            onClick={() => setScale(1)}
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div id="pdf-container" className="relative bg-gray-100 h-[600px] overflow-auto rounded-b-lg">
        <div className="flex justify-center p-4">
          <Document
            file={fileProp}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(e) => {
              const msg = (e as any)?.message ?? "Failed to load PDF";
              // eslint-disable-next-line no-console
              console.error("PDF load error:", e);
              setError(msg);
            }}
            loading={<div className="text-gray-600">Loading PDF…</div>}
            error={
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" /> Error loading PDF
              </div>
            }
            options={docOptions}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer
            />
          </Document>
        </div>
        {error && (
          <div className="absolute inset-x-0 bottom-0 m-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
