"use client";

type SpinnerProps = {
  size?: number;
  className?: string;
};

export function Spinner({ size = 20, className = "" }: SpinnerProps) {
  const s = `${size}px`;
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 ${className}`}
      style={{ width: s, height: s }}
      aria-label="Loading"
    />
  );
}
