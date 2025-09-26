"use client";

import { useEffect, useRef, useState } from "react";
import type { Field } from "@/types/fields";

type Props = {
  field: Field;
  pageWidth: number;
  pageHeight: number;
  onChange: (f: Field) => void;
  onDelete?: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
  color?: string; // border color based on signer
  signerName?: string; // optional signer label
  showGuides?: boolean; // global guides toggle
  signaturePreviewUrl?: string; // optional dataURL for signature preview content
};

type Corner = "nw" | "ne" | "sw" | "se";

export function DraggableField({
  field,
  pageWidth,
  pageHeight,
  onChange,
  onDelete,
  selected,
  onSelect,
  color,
  signerName,
  showGuides = true,
  signaturePreviewUrl,
}: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [startField, setStartField] = useState<Field | null>(null);
  const [resizing, setResizing] = useState<Corner | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingRef = useRef<Field | null>(null);

  const px = (v: number) => Math.round(v * 1000) / 1000;
  const snap = (v: number, step = 0.005) => Math.round(v / step) * step;
  const clamp = (nf: Field) => {
    const minW = 0.04;
    const minH = 0.02;
    const x = snap(Math.max(0, Math.min(1 - nf.w, nf.x)));
    const y = snap(Math.max(0, Math.min(1 - nf.h, nf.y)));
    const w = snap(Math.max(minW, Math.min(1 - x, nf.w)));
    const h = snap(Math.max(minH, Math.min(1 - y, nf.h)));
    return { ...nf, x: px(x), y: px(y), w: px(w), h: px(h) } as Field;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setStartField({ ...field });
    onSelect?.(field.id);
    // Capture pointer so drag doesn't get interrupted by iframes/canvas
    (e.currentTarget as HTMLElement).setPointerCapture?.(
      (e as unknown as PointerEvent).pointerId ?? 1,
    );
  };

  // rAF-throttle onChange to ~60fps to reduce re-renders during drag
  const scheduleChange = (nf: Field) => {
    pendingRef.current = nf;
    if (rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const next = pendingRef.current;
        if (next) onChange(clamp(next));
      });
    }
  };

  useEffect(() => {
    if (!dragging && !resizing) return;
    const onMove = (e: MouseEvent) => {
      if (!start || !startField) return;
      const dx = (e.clientX - start.x) / pageWidth;
      const dy = (e.clientY - start.y) / pageHeight;
      if (resizing) {
        const nf: Field = { ...startField };
        if (resizing === "nw") {
          nf.x = startField.x + dx;
          nf.y = startField.y + dy;
          nf.w = startField.w - dx;
          nf.h = startField.h - dy;
        } else if (resizing === "ne") {
          nf.y = startField.y + dy;
          nf.w = startField.w + dx;
          nf.h = startField.h - dy;
        } else if (resizing === "sw") {
          nf.x = startField.x + dx;
          nf.w = startField.w - dx;
          nf.h = startField.h + dy;
        } else if (resizing === "se") {
          nf.w = startField.w + dx;
          nf.h = startField.h + dy;
        }
        scheduleChange(nf);
        return;
      }
      if (dragging) {
        const nx = Math.min(1 - startField.w, Math.max(0, startField.x + dx));
        const ny = Math.min(1 - startField.h, Math.max(0, startField.y + dy));
        scheduleChange({ ...startField, x: px(nx), y: px(ny) });
      }
    };
    const onUp = () => {
      setDragging(false);
      setResizing(null);
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [dragging, resizing, start, startField, pageWidth, pageHeight, onChange]);

  const onResizeStart = (corner: Corner) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(corner);
    setStart({ x: e.clientX, y: e.clientY });
    setStartField({ ...field });
    onSelect?.(field.id);
  };

  const style = {
    left: field.x * pageWidth,
    top: field.y * pageHeight,
    width: field.w * pageWidth,
    height: field.h * pageHeight,
    touchAction: "none" as const,
  } as const;

  const borderColor =
    color || (selected ? "border-blue-600" : dragging ? "border-blue-500" : "border-blue-400");
  const nearCenterX = Math.abs(field.x + field.w / 2 - 0.5) < 0.01;
  const nearCenterY = Math.abs(field.y + field.h / 2 - 0.5) < 0.01;

  return (
    <div
      ref={elRef}
      className={`absolute border-2 ${borderColor} bg-blue-50/30 rounded-sm cursor-move select-none`}
      style={style}
      onMouseDown={onMouseDown}
      onDoubleClick={() => {
        if (field.type === "text") {
          const next = prompt("Text field label:", field.label || "");
          if (next !== null) {
            onChange({ ...field, label: next.trim() || undefined });
          }
        }
      }}
    >
      <div
        className="flex items-center justify-between text-[10px] text-blue-700 px-1 py-0.5 bg-blue-50/70"
        onMouseDown={() => {
          onSelect?.(field.id);
        }}
      >
        <span className="flex items-center gap-1">
          <span>{field.type}</span>
          {signerName && (
            <span className="ml-1 inline-flex items-center gap-1 px-1 py-0.5 rounded bg-white/70 text-[9px] text-gray-800 border border-gray-200">
              <span className="i-mdi-account text-[10px]" aria-hidden="true" />
              {signerName}
            </span>
          )}
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.id);
            }}
            className="ml-2 text-red-600 hover:text-red-700"
            aria-label="Remove field"
            title="Remove field"
          >
            ×
          </button>
        )}
      </div>
      {/* Field content preview */}
      <div className="absolute inset-0 p-1 overflow-hidden pointer-events-none">
        {field.type === "signature" ? (
          signaturePreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={signaturePreviewUrl}
              alt="Signature"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[11px] text-blue-700/80">
              Sign
            </div>
          )
        ) : field.type === "text" ? (
          <div className="w-full h-full flex items-center px-2 text-[11px] text-gray-700/90 truncate">
            {field.label ?? "Text"}
          </div>
        ) : field.type === "date" ? (
          <div className="w-full h-full flex items-center justify-center text-[11px] text-orange-700/90">
            {new Date().toISOString().slice(0, 10)}
          </div>
        ) : null}
      </div>
      {selected && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded shadow">
          {Math.round(field.w * pageWidth)}×{Math.round(field.h * pageHeight)}
        </div>
      )}
      {selected && (
        <>
          {/* Resize handles */}
          <div
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm cursor-nw-resize"
            onMouseDown={onResizeStart("nw")}
          />
          <div
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm cursor-ne-resize"
            onMouseDown={onResizeStart("ne")}
          />
          <div
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm cursor-sw-resize"
            onMouseDown={onResizeStart("sw")}
          />
          <div
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm cursor-se-resize"
            onMouseDown={onResizeStart("se")}
          />
          {/* Internal guide markers when near page center */}
          {showGuides && nearCenterX && (
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-pink-500/70 pointer-events-none" />
          )}
          {showGuides && nearCenterY && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-pink-500/70 pointer-events-none" />
          )}
        </>
      )}
    </div>
  );
}
