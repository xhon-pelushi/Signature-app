export type FieldType = 'signature' | 'text' | 'checkbox' | 'date';

export interface Field {
  id: string;
  page: number; // 1-based page index
  x: number; // left, 0..1 relative to page width
  y: number; // top, 0..1 relative to page height
  w: number; // width, 0..1
  h: number; // height, 0..1
  type: FieldType;
  label?: string;
  signerId?: string;
}
