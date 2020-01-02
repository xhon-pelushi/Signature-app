"use client";

import { useCallback, useState } from "react";

export function useSignature() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const setFromDataUrl = useCallback((url: string) => setDataUrl(url), []);
  const clear = useCallback(() => setDataUrl(null), []);

  return { signatureDataUrl: dataUrl, setFromDataUrl, clear };
}
