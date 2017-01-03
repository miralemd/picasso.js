import { add, sub, projectOnto, distance, distanceX, distanceY, determinant } from './vector';

const EPSILON = 1e-12;

export function closestPointToLine(start, end, p) {
  const startToPoint = sub(p, start);
  const startToEnd = sub(end, start);
  const pointOnLine = add(projectOnto(startToPoint, startToEnd), start);
  return pointOnLine;
}

export function isPointOnLine(start, end, p) {
  const dist = (distance(start, p) + distance(end, p)) - distance(start, end);
  return dist >= -EPSILON && dist <= EPSILON;
}

export function isLineIntersectingLine(lineStart, lineEnd, targetLineStart, targetLineEnd) {
  const dXline = distanceX(lineStart, lineEnd);
  const dYline = distanceY(lineStart, lineEnd);
  const dXtarget = distanceX(targetLineStart, targetLineEnd);
  const dYTarget = distanceY(targetLineStart, targetLineEnd);
  const dom = (dXline * dYTarget) - (dYline * dXtarget);

  if (dom === 0) return false; // Lines are parrallel or coincident

  const dLine = determinant(lineStart, lineEnd);
  const dTarget = determinant(targetLineStart, targetLineEnd);

  const pX = ((dLine * dXtarget) - (dTarget * dXline)) / dom;
  const pY = ((dLine * dYTarget) - (dTarget * dYline)) / dom;

  const p = { x: pX, y: pY };

  return isPointOnLine(lineStart, lineEnd, p) && isPointOnLine(targetLineStart, targetLineEnd, p);
}

export function convertLineToPoints(line) {
  const x1 = line.x1 || 0;
  const y1 = line.y1 || 0;
  const x2 = line.x2 || 0;
  const y2 = line.y2 || 0;
  return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
}

export function convertRectToPoints(rect) {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height }
  ];
}

export default {
  closestPointToLine,
  isPointOnLine,
  convertRectToPoints,
  convertLineToPoints
};
