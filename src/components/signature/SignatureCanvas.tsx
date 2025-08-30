"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  strokeWidth?: number;
  strokeColor?: string;
  onChange?: (dataUrl: string) => void;
};

export function SignatureCanvas({ strokeWidth = 2, strokeColor = "#000", onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      const parent = c.parentElement;
      if (!parent) return;
      const w = parent.clientWidth - 2;
      const h = Math.max(120, Math.floor(parent.clientWidth / 3));
      c.width = w * devicePixelRatio;
      c.height = h * devicePixelRatio;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      setSize({ w, h });
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.scale(devicePixelRatio, devicePixelRatio);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c.parentElement!);
    return () => ro.disconnect();
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const clientX = ("touches" in e && e.touches[0]) ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = ("touches" in e && e.touches[0]) ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrawing(true);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, strokeWidth, 0, Math.PI * 2);
    ctx.fill();
  };

  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    const c = canvasRef.current!;
    onChange?.(c.toDataURL("image/png"));
  };

  const clear = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    onChange?.(c.toDataURL("image/png"));
  };

  return (
    <div className="w-full">
      <div className="border rounded bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          className="block w-full h-auto cursor-crosshair"
        />
      </div>
      <div className="mt-2 text-right">
        <button className="text-sm text-gray-600 hover:text-gray-800" onClick={clear}>Clear</button>
      </div>
    </div>
  );
}
