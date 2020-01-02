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

/**
 * Clamp a normalized rectangle into [0,1] space with a minimum size.
 * Ensures width/height do not overflow past the right/bottom edges.
 */
export function clampNormalized(rect: Rect): Rect {
  // First clamp origin
  const x = Math.min(Math.max(rect.x, 0), 1);
  const y = Math.min(Math.max(rect.y, 0), 1);
  // Then clamp size relative to remaining space
  const maxW = Math.max(0, 1 - x);
  const maxH = Math.max(0, 1 - y);
  const width = Math.min(Math.max(rect.width, 0.01), maxW);
  const height = Math.min(Math.max(rect.height, 0.01), maxH);
  return { x, y, width, height };
}
