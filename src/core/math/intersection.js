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

  if (dom === 0) { return false; } // Lines are parrallel or coincident

  const dLine = determinant(lineStart, lineEnd);
  const dTarget = determinant(targetLineStart, targetLineEnd);

  const pX = ((dLine * dXtarget) - (dTarget * dXline)) / dom;
  const pY = ((dLine * dYTarget) - (dTarget * dYline)) / dom;

  const p = { x: pX, y: pY };

  return isPointOnLine(lineStart, lineEnd, p) && isPointOnLine(targetLineStart, targetLineEnd, p);
}

export function isCircleIntersectingRect(cx, cy, r, rectCenterX, rectCenterY, width, height) {
  const rX = (width / 2);
  const rY = (height / 2);
  const dX = Math.abs(cx - rectCenterX);
  const dY = Math.abs(cy - rectCenterY);

  if (dX > rX + r || dY > rY + r) { return false; }

  if (dX <= rX || dY <= rY) { return true; }

  const sqrDist = Math.pow(dX - rX, 2) + Math.pow(dY - rY, 2);

  return sqrDist <= Math.pow(r, 2);
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

export function getMinMax(points) {
  const num = points.length;
  let xMin = NaN;
  let xMax = NaN;
  let yMin = NaN;
  let yMax = NaN;

  for (let i = 0; i < num; i++) {
    xMin = isNaN(xMin) ? points[i].x : Math.min(xMin, points[i].x);
    xMax = isNaN(xMax) ? points[i].x : Math.max(xMax, points[i].x);
    yMin = isNaN(yMin) ? points[i].y : Math.min(yMin, points[i].y);
    yMax = isNaN(yMax) ? points[i].y : Math.max(yMax, points[i].y);
  }
  return [xMin, yMin, xMax, yMax];
}

export default {
  closestPointToLine,
  isPointOnLine,
  convertRectToPoints,
  convertLineToPoints
};
