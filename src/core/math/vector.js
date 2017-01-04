export function add(v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y
  };
}

export function sub(v1, v2) {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y
  };
}

export function scalarMultiply(v, s) {
  return {
    x: v.x * s,
    y: v.y * s
  };
}

export function sqrMagnitude(v) {
  return Math.pow(v.x, 2) + Math.pow(v.y, 2);
}

export function magnitude(v) {
  return Math.sqrt(sqrMagnitude(v));
}

export function distanceX(v1, v2) {
  return v1.x - v2.x;
}

export function distanceY(v1, v2) {
  return v1.y - v2.y;
}

export function sqrDistance(v1, v2) {
  return Math.pow(distanceX(v1, v2), 2) + Math.pow(distanceY(v1, v2), 2);
}

export function distance(v1, v2) {
  return Math.sqrt(sqrDistance(v1, v2));
}

export function determinant(v1, v2) {
  return (v1.x * v2.y) - (v2.x * v1.y);
}

export function dot(v1, v2) {
  return (v1.x * v2.x) + (v1.y * v2.y);
}

export function projectOnto(v1, v2) {
  const m = dot(v1, v2) / dot(v2, v2) || 1;
  return {
    x: v2.x * m,
    y: v2.y * m
  };
}