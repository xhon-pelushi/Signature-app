import type { Field } from "@/types/fields";

export type Rect = { x: number; y: number; width: number; height: number };

export function toPixels(f: Field, pageW: number, pageH: number): Rect {
  return {
    x: f.x * pageW,
    y: f.y * pageH,
    width: f.w * pageW,
    height: f.h * pageH,
  };
}

export function clampNormalized(rect: Rect): Rect {
  const x = Math.min(Math.max(rect.x, 0), 1);
  const y = Math.min(Math.max(rect.y, 0), 1);
  const width = Math.min(Math.max(rect.width, 0.01), 1);
  const height = Math.min(Math.max(rect.height, 0.01), 1);
  return { x, y, width, height };
}
