export const ACCENT_STROKE_DURATION_MS = 900;
export const ACCENT_STROKE_PATH = "M2 8 C 28 2, 76 14, 118 6";
export const ACCENT_STROKE_VIEWBOX = "0 0 120 12";
export const ACCENT_STROKE_THRESHOLD = 0.4;

export function getAccentPathLength(path: SVGPathElement): number {
  if (typeof path.getTotalLength !== "function") {
    return 0;
  }

  return path.getTotalLength();
}

export function prepareAccentPath(path: SVGPathElement): number {
  const length = getAccentPathLength(path);
  path.setAttribute("stroke-dasharray", String(length));
  path.setAttribute("stroke-dashoffset", String(length));
  return length;
}

export function revealAccentPath(path: SVGPathElement): void {
  path.setAttribute("stroke-dashoffset", "0");
}
