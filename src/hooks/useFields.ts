"use client";

import { useCallback, useMemo, useState } from "react";
import type { Field, FieldType } from "@/types/fields";

export type FieldsByPage = Record<number, Field[]>;

export function useFields() {
  const [fields, setFields] = useState<FieldsByPage>({});
  const [history, setHistory] = useState<FieldsByPage[]>([]);
  const [redoStack, setRedoStack] = useState<FieldsByPage[]>([]);

  const snapshot = useCallback((src: FieldsByPage): FieldsByPage => JSON.parse(JSON.stringify(src)), []);
  const commit = useCallback((next: FieldsByPage) => {
    setHistory((h) => [...h, snapshot(fields)]);
    setRedoStack([]);
    setFields(next);
  }, [fields, snapshot]);

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
      commit(next);
      return next;
    });
  }, [commit]);

  const updateField = useCallback((page: number, id: string, patch: Partial<Field>) => {
    setFields((prev) => {
      const next: FieldsByPage = { ...prev };
      const list = (next[page] || []).map((f) => (f.id === id ? { ...f, ...patch } : f));
      next[page] = list;
      commit(next);
      return next;
    });
  }, [commit]);

  const removeField = useCallback((page: number, id: string) => {
    setFields((prev) => {
      const next: FieldsByPage = { ...prev };
      const list = (next[page] || []).filter((f) => f.id !== id);
      next[page] = list;
      commit(next);
      return next;
    });
  }, [commit]);

  const clear = useCallback(() => { setHistory((h) => [...h, snapshot(fields)]); setRedoStack([]); setFields({}); }, [fields, snapshot]);
  const setAll = useCallback((all: FieldsByPage) => { setHistory((h) => [...h, snapshot(fields)]); setRedoStack([]); setFields(all); }, [fields, snapshot]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setRedoStack((r) => [...r, snapshot(fields)]);
      setFields(prev);
      return h.slice(0, -1);
    });
  }, [fields, snapshot]);

  const redo = useCallback(() => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const next = r[r.length - 1];
      setHistory((h) => [...h, snapshot(fields)]);
      setFields(next);
      return r.slice(0, -1);
    });
  }, [fields, snapshot]);

  const canUndo = history.length > 0;
  const canRedo = redoStack.length > 0;

  const allFields = useMemo(() => fields, [fields]);

  return { fields: allFields, addField, updateField, removeField, clear, setAll, undo, redo, canUndo, canRedo };
}
