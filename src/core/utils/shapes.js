function isNumber(v) {
  return typeof v === 'number' && !isNaN(v);
}

export function getShapeType(shape) {
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

export function pointsToPath(points, close = true) {
  let d = '';

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (i === 0) {
      d += `M${p.x} ${p.y}`;
    } else {
      d += `L${p.x} ${p.y}`;
    }

    d += ' ';
  }

  if (close) {
    d += 'Z';
  }

  return d;
}
