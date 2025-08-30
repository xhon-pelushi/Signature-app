"use client";

import { useCallback, useMemo, useState } from "react";
import type { Field, FieldType } from "@/types/fields";

export type FieldsByPage = Record<number, Field[]>;

export function useFields() {
  const [fields, setFields] = useState<FieldsByPage>({});

  const addField = useCallback((page: number, type: FieldType, init?: Partial<Field>) => {
    setFields((prev) => {
      const next: FieldsByPage = { ...prev };
      const list = next[page] ? [...next[page]] : [];
      const field: Field = {
        id: crypto.randomUUID(),
        type,
        page,
        x: 0.1,
        y: 0.1,
        w: type === "signature" ? 0.25 : 0.18,
        h: type === "signature" ? 0.08 : 0.06,
        ...init,
      } as Field;
      list.push(field);
      next[page] = list;
      return next;
    });
  }, []);

  const updateField = useCallback((page: number, id: string, patch: Partial<Field>) => {
    setFields((prev) => {
      const next: FieldsByPage = { ...prev };
      const list = (next[page] || []).map((f) => (f.id === id ? { ...f, ...patch } : f));
      next[page] = list;
      return next;
    });
  }, []);

  const removeField = useCallback((page: number, id: string) => {
    setFields((prev) => {
      const next: FieldsByPage = { ...prev };
      const list = (next[page] || []).filter((f) => f.id !== id);
      next[page] = list;
      return next;
    });
  }, []);

  const clear = useCallback(() => setFields({}), []);
  const setAll = useCallback((all: FieldsByPage) => setFields(all), []);

  const allFields = useMemo(() => fields, [fields]);

  return { fields: allFields, addField, updateField, removeField, clear, setAll };
}
