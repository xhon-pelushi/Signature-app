"use client";

import { useRef, useState } from "react";
import type { Field } from "@/types/fields";

type Props = {
  field: Field;
  pageWidth: number;
  pageHeight: number;
  onChange: (f: Field) => void;
  onDelete?: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

type Corner = "nw" | "ne" | "sw" | "se";

export function DraggableField({ field, pageWidth, pageHeight, onChange, onDelete, selected, onSelect }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [startField, setStartField] = useState<Field | null>(null);
  const [resizing, setResizing] = useState<Corner | null>(null);

  const px = (v: number) => Math.round(v * 1000) / 1000;
  const snap = (v: number, step = 0.005) => Math.round(v / step) * step;
  const clamp = (nf: Field) => {
    const minW = 0.04;
    const minH = 0.02;
    let x = snap(Math.max(0, Math.min(1 - nf.w, nf.x)));
    let y = snap(Math.max(0, Math.min(1 - nf.h, nf.y)));
    let w = snap(Math.max(minW, Math.min(1 - x, nf.w)));
    let h = snap(Math.max(minH, Math.min(1 - y, nf.h)));
    return { ...nf, x: px(x), y: px(y), w: px(w), h: px(h) } as Field;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setStartField({ ...field });
    onSelect?.(field.id);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!start || !startField) return;
    const dx = (e.clientX - start.x) / pageWidth;
    const dy = (e.clientY - start.y) / pageHeight;

    if (resizing) {
      let nf: Field = { ...startField };
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
      onChange(clamp(nf));
      return;
    }

    if (dragging) {
      const nx = Math.min(1 - startField.w, Math.max(0, startField.x + dx));
      const ny = Math.min(1 - startField.h, Math.max(0, startField.y + dy));
      onChange({ ...startField, x: px(nx), y: px(ny) });
    }
  };

  const onMouseUp = () => { setDragging(false); setResizing(null); };

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
  } as const;

  return (
    <div
      ref={elRef}
      className={`absolute border-2 ${selected ? "border-blue-600" : dragging ? "border-blue-500" : "border-blue-400"} bg-blue-50/30 rounded-sm cursor-move select-none`}
      style={style}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div className="flex items-center justify-between text-[10px] text-blue-700 px-1 py-0.5 bg-blue-50/70" onMouseDown={(e) => { e.stopPropagation(); onSelect?.(field.id); }}>
        <span>{field.type}</span>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}
            className="ml-2 text-red-600 hover:text-red-700"
            aria-label="Remove field"
            title="Remove field"
          >
            ×
          </button>
        )}
      </div>
      {selected && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded shadow">
          {Math.round(field.w * pageWidth)}×{Math.round(field.h * pageHeight)}
        </div>
      )}
      {selected && (
        <>
          {/* Resize handles */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm cursor-nw-resize" onMouseDown={onResizeStart("nw")} />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm cursor-ne-resize" onMouseDown={onResizeStart("ne")} />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm cursor-sw-resize" onMouseDown={onResizeStart("sw")} />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm cursor-se-resize" onMouseDown={onResizeStart("se")} />
        </>
      )}
    </div>
  );
}
