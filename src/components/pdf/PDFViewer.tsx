"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

// Configure pdf.js worker to match the exact API version react-pdf is using
// This avoids "API version X does not match Worker version Y" errors.
// Pick the worker version dynamically to avoid mismatches between API and worker.
// Fallback to the installed pdfjs-dist version when unavailable.
try {
  const v = (pdfjs as unknown as { version?: string }).version || "5.4.54";
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${v}/build/pdf.worker.min.mjs`;
} catch {
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.54/build/pdf.worker.min.mjs";
}

type PDFViewerProps = {
  file: File | string | ArrayBuffer;
  initialScale?: number; // 1.0 = 100%
  fitToWidth?: boolean;
  className?: string;
  page?: number; // controlled current page
  onPageChange?: (p: number) => void;
  overlay?: React.ReactNode | ((info: { width: number; height: number; page: number; scale: number }) => React.ReactNode); // overlay for current page
};

export default function PDFViewer({
  file,
  initialScale = 1.0,
  fitToWidth = true,
  className,
  page,
  onPageChange,
  overlay,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(page ?? 1);
  const [scale, setScale] = useState<number>(initialScale);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const pageWrapperRef = useRef<HTMLDivElement | null>(null);

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
    setPageNumber(page ?? 1);
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

  // Keyboard shortcuts: ←/→ for prev/next page, Ctrl/Cmd + +/- for zoom, Ctrl/Cmd + 0 to reset
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs or editable elements
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPageNumber((p) => (p > 1 ? p - 1 : p));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPageNumber((p) => (p < numPages ? p + 1 : p));
      } else if (ctrlOrMeta && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        setScale((s) => Math.min(3, parseFloat((s + 0.1).toFixed(2))));
      } else if (ctrlOrMeta && (e.key === "-" || e.key === "_")) {
        e.preventDefault();
        setScale((s) => Math.max(0.25, parseFloat((s - 0.1).toFixed(2))));
      } else if (ctrlOrMeta && (e.key === "0")) {
        e.preventDefault();
        setScale(1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [numPages]);

  // Sync with controlled page prop
  useEffect(() => {
    if (typeof page === "number" && page > 0 && page !== pageNumber) {
      setPageNumber(page);
    }
  }, [page]);

  // Observe rendered page size for overlay
  useEffect(() => {
    const el = pageWrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setPageSize({ width: el.clientWidth, height: el.clientHeight });
    });
    setPageSize({ width: el.clientWidth, height: el.clientHeight });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageNumber, scale, pageWidth]);

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            onClick={() => {
              const next = Math.max(1, pageNumber - 1);
              setPageNumber(next);
              onPageChange?.(next);
            }}
            disabled={!canPrev}
            aria-label="Previous page"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-700">Page {pageNumber} / {numPages || "-"}</span>
          <button
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            onClick={() => {
              const next = Math.min(numPages, pageNumber + 1);
              setPageNumber(next);
              onPageChange?.(next);
            }}
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
        <div className="flex justify-center p-4 relative">
          <Document
            file={fileProp}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(e: unknown) => {
              const msg = e && typeof e === "object" && "message" in (e as Record<string, unknown>)
                ? String((e as { message?: unknown }).message)
                : "Failed to load PDF";
              console.error("PDF load error:", e);
              setError(msg);
            }}
            loading={
              <div className="flex items-center gap-2 text-gray-600">
                <Spinner /> <span>Loading PDF…</span>
              </div>
            }
            error={
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" /> Error loading PDF
              </div>
            }
            options={docOptions}
          >
            <div className="relative">
              <div ref={pageWrapperRef} className="relative">
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                {/* Overlay area positioned on top of the page */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="relative w-full h-full pointer-events-auto">
                    {typeof overlay === "function"
                      ? overlay({ width: pageSize.width, height: pageSize.height, page: pageNumber, scale })
                      : overlay}
                  </div>
                </div>
              </div>
            </div>
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
