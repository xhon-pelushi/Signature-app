export type PageSizeName = "LETTER" | "A4" | "LEGAL" | "TABLOID" | "A5";
export type PageSize = PageSizeName | [number, number];

const PAGE_SIZES: Record<PageSizeName, [number, number]> = {
  LETTER: [612, 792],
  A4: [595.28, 841.89],
  LEGAL: [612, 1008],
  TABLOID: [792, 1224],
  A5: [419.53, 595.28],
};

export function resolveSize(
  size: PageSize = "LETTER",
  orientation: "portrait" | "landscape" = "portrait",
): [number, number] {
  const base = Array.isArray(size) ? size : PAGE_SIZES[size] ?? PAGE_SIZES.LETTER;
  if (orientation === "landscape") {
    return [base[1], base[0]];
  }
  return [base[0], base[1]];
}
