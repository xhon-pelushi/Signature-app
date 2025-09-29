import { toPixels, clampNormalized } from "@/lib/fieldUtils";

describe("fieldUtils", () => {
  it("toPixels converts normalized field to pixel rect", () => {
    const rect = toPixels({ x: 0.25, y: 0.5, w: 0.2, h: 0.1 } as any, 1000, 800);
    expect(rect).toEqual({ x: 250, y: 400, width: 200, height: 80 });
  });

  it("clampNormalized keeps values within [0,1] with minimum size", () => {
    // Use a y inside the page so there is space to enforce min height
    const clamped = clampNormalized({ x: -0.5, y: 0.9, width: 0, height: 0.005 });
    expect(clamped.x).toBe(0);
    expect(clamped.y).toBe(0.9);
    expect(clamped.width).toBeGreaterThanOrEqual(0.01);
    expect(clamped.height).toBeGreaterThanOrEqual(0.01);
    // And ensure it doesn't overflow the bottom edge
    expect(clamped.y + clamped.height).toBeLessThanOrEqual(1);
  });
});
