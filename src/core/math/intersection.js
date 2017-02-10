import { add, sub, projectOnto, distanceX, distanceY, dot3, crossProduct, sqrDistance } from './vector';

const EPSILON = 1e-12;

export function closestPointToLine(start, end, p) {
  const startToPoint = sub(p, start);
  const startToEnd = sub(end, start);
  const pointOnLine = add(projectOnto(startToPoint, startToEnd), start);
  return pointOnLine;
}

export function isPointOnLine(start, end, p) {
  const c = crossProduct(start, end, p);
  if (Math.abs(c) > EPSILON) {
    return false;
  }

  const d = dot3(start, end, p);
  if (d < 0) {
    return false;
  }

  const sqrDist = sqrDistance(start, end);
  if (d > sqrDist) {
    return false;
  }

  return true;
}

export function rectContainsPoint(rectVertices, point) {
  return rectVertices[0].x !== rectVertices[2].x && // Zero size rect
    rectVertices[0].y !== rectVertices[2].y && // Zero size rect
    point.x >= rectVertices[0].x &&
    point.x <= rectVertices[2].x &&
    point.y >= rectVertices[0].y &&
    point.y <= rectVertices[2].y;
}

export function circleContainsPoint(circle, point) {
  if (circle.r === 0) {
    return false;
  }

  const circleVector = { x: circle.cx, y: circle.cy };
  const sqrDist = sqrDistance(point, circleVector);

  if (sqrDist <= Math.pow(circle.r, 2)) {
    return true;
  }
  return false;
}

export function isLineIntersectingLine(p1, p2, p3, p4) {
  let dx1 = distanceX(p2, p1);
  let dy1 = distanceY(p2, p1);
  let dx2 = distanceX(p4, p3);
  let dy2 = distanceY(p4, p3);
  let dx3 = distanceX(p1, p3);
  let dy3 = distanceY(p1, p3);
  let ub = (dy2 * dx1) - (dx2 * dy1);
  let uat = (dx2 * dy3) - (dy2 * dx3);
  let ubt = (dx1 * dy3) - (dy1 * dx3);
  let t1;
  let t2;

  if (dx1 === 0 && dy1 === 0) { // Line segment has no length
    return false;
  }

  if (dx2 === 0 && dy2 === 0) { // Line segment has no length
    return false;
  }

  if (ub === 0) {
    if (uat === 0 && ubt === 0) { // COINCIDENT;
      if (dx1 === 0) {
        if (dy1 === 0) { // p1 = p2
          return p1.x === p2.x && p1.y === p2.y;
        }
        t1 = distanceY(p3, p1) / dy1;
        t2 = distanceY(p4, p1) / dy1;
      } else {
        t1 = (p3.x - p1.x) / dx1;
        t2 = (p4.x - p1.x) / dx1;
      }
      if ((t1 < 0 && t2 < 0) || (t1 > 1 && t2 > 1)) {
        return false;
      }
      return true;
    }
    return false; // PARALLEL;
  }
  let ua = uat / ub;
  ub = ubt / ub;
  if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
    return true;
  }
  return false;
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

export function isCircleIntersectingLineSegment(circle, lineVectors) {
  if (circleContainsPoint(circle, lineVectors[0]) || circleContainsPoint(circle, lineVectors[1])) {
    return true;
  }

  const circleVector = { x: circle.cx, y: circle.cy };
  const pointOnLine = closestPointToLine(lineVectors[0], lineVectors[1], circleVector);
  const dist = sqrDistance(pointOnLine, circleVector);

  return dist <= Math.pow(circle.r, 2) && isPointOnLine(lineVectors[0], lineVectors[1], pointOnLine) && circle.r > 0;
}

export function isLineSegmentIntersectingRect(lineVectors, rectVertices) {
  if (rectContainsPoint(rectVertices, lineVectors[0]) || rectContainsPoint(rectVertices, lineVectors[1])) {
    return true;
  }

  const num = rectVertices.length;
  for (let i = 0; i < num - 1; i++) {
    const v0 = rectVertices[i];
    const v1 = rectVertices[i + 1];
    if (isLineIntersectingLine(lineVectors[0], lineVectors[1], v0, v1)) {
      return true;
    }
  }

  return false;
}

export function getLineVectors(line) {
  const x1 = line.x1 || 0;
  const y1 = line.y1 || 0;
  const x2 = line.x2 || 0;
  const y2 = line.y2 || 0;
  return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
}

export function getRectVertices(rect) {
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
  getRectVertices,
  getLineVectors
};
