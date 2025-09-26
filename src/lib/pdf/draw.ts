import type { PDFPage, RGB } from "pdf-lib";

export function drawDashedLine(
  page: PDFPage,
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  options: { dash?: number[]; thickness?: number; color?: RGB } = {},
) {
  const { dash = [6, 4], thickness = 1, color } = options;
  const dx = ex - sx;
  const dy = ey - sy;
  const len = Math.hypot(dx, dy);
  if (len === 0) return;
  const ux = dx / len;
  const uy = dy / len;
  let dist = 0;
  let draw = true;
  let idx = 0;
  let x = sx;
  let y = sy;
  while (dist < len) {
    const seg = dash[idx % dash.length];
    const nx = x + ux * seg;
    const ny = y + uy * seg;
    const clamped = Math.min(seg, len - dist);
    const cx = x + ux * clamped;
    const cy = y + uy * clamped;
    if (draw) {
      page.drawLine({ start: { x, y }, end: { x: cx, y: cy }, thickness, color });
    }
    x = nx;
    y = ny;
    dist += seg;
    idx++;
    draw = !draw;
  }
}
