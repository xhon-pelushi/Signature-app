"use client";

import { useRef, useState } from "react";
import type { Field } from "@/types/fields";

type Props = {
  field: Field;
  pageWidth: number;
  pageHeight: number;
  onChange: (f: Field) => void;
  onDelete?: (id: string) => void;
};

export function DraggableField({ field, pageWidth, pageHeight, onChange, onDelete }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [startField, setStartField] = useState<Field | null>(null);

  const px = (v: number) => Math.round(v * 1000) / 1000;

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setStartField({ ...field });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !start || !startField) return;
    const dx = (e.clientX - start.x) / pageWidth;
    const dy = (e.clientY - start.y) / pageHeight;
    const nx = Math.min(1 - startField.w, Math.max(0, startField.x + dx));
    const ny = Math.min(1 - startField.h, Math.max(0, startField.y + dy));
    onChange({ ...startField, x: px(nx), y: px(ny) });
  };

  const onMouseUp = () => setDragging(false);

  const style = {
    left: field.x * pageWidth,
    top: field.y * pageHeight,
    width: field.w * pageWidth,
    height: field.h * pageHeight,
  } as const;

  return (
    <div
      ref={elRef}
      className={`absolute border-2 ${dragging ? "border-blue-600" : "border-blue-400"} bg-blue-50/30 rounded-sm cursor-move select-none`}
      style={style}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div className="flex items-center justify-between text-[10px] text-blue-700 px-1 py-0.5 bg-blue-50/70">
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
    </div>
  );
}
