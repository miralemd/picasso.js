function isNumber(v) {
  return typeof v === 'number' && !isNaN(v);
}

export default function deduceShapeType(shape) {
  const {
    x, y, // Point
    width, height, // Rect
    x1, x2, y1, y2, // Line
    cx, cy, r, // Circle
    vertices // Polygon
  } = shape || {};

  if (isNumber(cx) && isNumber(cy) && isNumber(r)) {
    return 'circle';
  } else if (isNumber(x1) && isNumber(x2) && isNumber(y1) && isNumber(y2)) {
    return 'line';
  } else if (isNumber(x) && isNumber(y) && isNumber(width) && isNumber(height)) {
    return 'rect';
  } else if (isNumber(x) && isNumber(y)) {
    return 'point';
  } else if (Array.isArray(vertices)) {
    return 'polygon';
  }
  return null;
}
