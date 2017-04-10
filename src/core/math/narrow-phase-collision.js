import {
  sqrDistance,
  distanceX,
  distanceY
} from './vector';
import {
  closestPointToLine,
  isPointOnLine,
  getMinMax,
  pointsToLine,
  pointsToRect,
  getLineVectors,
  getRectVertices
} from './intersection';

function lineHasNoLength(line) {
  return line.x1 === line.x2 && line.y1 === line.y2;
}

function rectHasNoSize(rect) {
  return rect.width <= 0 || rect.height <= 0;
}

function circleHasNoSize(circle) {
  return circle.r <= 0;
}

export default class NarrowPhaseCollision {
  static testCirclePoint(circle, point) {
    if (circleHasNoSize(circle)) {
      return false;
    }

    const center = { x: circle.cx, y: circle.cy };
    const sqrDist = sqrDistance(center, point);

    if (sqrDist <= Math.pow(circle.r, 2)) {
      return true;
    }
    return false;
  }

  static testCircleRect(circle, rect) {
    if (rectHasNoSize(rect) || circleHasNoSize(circle)) {
      return false;
    }
    const rX = rect.width / 2;
    const rY = rect.height / 2;
    const rcX = rect.x + rX;
    const rcY = rect.y + rY;
    const r = circle.r;
    const cx = circle.cx;
    const cy = circle.cy;
    const dX = Math.abs(cx - rcX);
    const dY = Math.abs(cy - rcY);

    if (dX > rX + r || dY > rY + r) { return false; }

    if (dX <= rX || dY <= rY) { return true; }

    const sqrDist = Math.pow(dX - rX, 2) + Math.pow(dY - rY, 2);

    return sqrDist <= Math.pow(r, 2);
  }

  static testCircleLine(circle, line) {
    if (circleHasNoSize(circle) || lineHasNoLength(line)) {
      return false;
    }

    const [p1, p2] = getLineVectors(line);
    if (NarrowPhaseCollision.testCirclePoint(circle, p1) || NarrowPhaseCollision.testCirclePoint(circle, p2)) {
      return true;
    }

    const center = { x: circle.cx, y: circle.cy };
    const pointOnLine = closestPointToLine(p1, p2, center);
    const dist = sqrDistance(pointOnLine, center);

    return dist <= Math.pow(circle.r, 2) && isPointOnLine(p1, p2, pointOnLine) && circle.r > 0;
  }

  static testCircleCircle(circle1, circle2) {
    if (circleHasNoSize(circle1) || circleHasNoSize(circle2)) { return false; }

    const dx = circle1.cx - circle2.cx;
    const dy = circle1.cy - circle2.cy;
    const sqrDist = Math.pow(dx, 2) + Math.pow(dy, 2);

    if (sqrDist <= Math.pow(circle1.r + circle2.r, 2)) {
      return true;
    }
    return false;
  }

  static testCirclePolygon(circle, polygon) {
    // TODO handle polygon that is a straight line, current impl will interrept it is a true, if radius is extended onto any of the edges
    if (polygon.vertices.length < 2 || circleHasNoSize(circle)) {
      return false;
    }

    const center = { x: circle.cx, y: circle.cy };
    if (NarrowPhaseCollision.testPolygonPoint(polygon, center)) {
      return true;
    }

    const num = polygon.edges.length;
    for (let i = 0; i < num; i++) {
      const edge = pointsToLine(polygon.edges[i]);
      if (NarrowPhaseCollision.testCircleLine(circle, edge)) {
        return true;
      }
    }
    return false;
  }

  static testPolygonPoint(polygon, point) {
    // TODO handle polygon that is a straight line, current impl gives a non-deterministic output, that is depending on number of vertices
    if (polygon.vertices.length < 2 || !NarrowPhaseCollision.testRectPoint(pointsToRect(polygon.bounds()), point)) {
      return false;
    }

    let even = true;
    const num = polygon.vertices.length;
    const [xMin] = getMinMax(polygon.vertices);
    const rayStart = { x: xMin - 1, y: point.y };

    for (let i = 0; i < num - 1; i++) {
      const edge = pointsToLine(polygon.edges[i]);
      if (!(edge.y1 < point.y && edge.y2 < point.y) && !(edge.y1 > point.y && edge.y2 > point.y)) { // filterout any edges that does not cross the ray
        even = NarrowPhaseCollision.testLineLine(edge, pointsToLine([rayStart, point])) ? !even : even;
      }
    }
    return !even;
  }

  static testRectRect(rect1, rect2) {
    if (rectHasNoSize(rect1) || rectHasNoSize(rect2)) {
      return false;
    }

    return rect1.x <= rect2.x + rect2.width &&
      rect2.x <= rect1.x + rect1.width &&
      rect1.y <= rect2.y + rect2.height &&
      rect2.y <= rect1.y + rect1.height;
  }

  static testRectPoint(rect, point) {
    if (rectHasNoSize(rect)) { return false; }

    return point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height;
  }

  static testRectLine(rect, line) {
    if (lineHasNoLength(line) || rect.width <= 0 || rect.height <= 0) { return false; }

    const [p1, p2] = getLineVectors(line);

    if (NarrowPhaseCollision.testRectPoint(rect, p1) || NarrowPhaseCollision.testRectPoint(rect, p2)) {
      return true;
    }

    const rectEdges = getRectVertices(rect);
    let num = rectEdges.length;
    for (let i = 0; i < num; i++) {
      const edge = pointsToLine([rectEdges[i], rectEdges[i !== 3 ? i + 1 : 0]]);
      if (NarrowPhaseCollision.testLineLine(edge, line)) {
        return true;
      }
    }
    return false;
  }

  static testLineLine(line1, line2) {
    const [p1, p2] = getLineVectors(line1);
    const [p3, p4] = getLineVectors(line2);
    const dx1 = distanceX(p2, p1);
    const dy1 = distanceY(p2, p1);
    const dx2 = distanceX(p4, p3);
    const dy2 = distanceY(p4, p3);
    const dx3 = distanceX(p1, p3);
    const dy3 = distanceY(p1, p3);
    let ub = (dy2 * dx1) - (dx2 * dy1);
    const uat = (dx2 * dy3) - (dy2 * dx3);
    const ubt = (dx1 * dy3) - (dy1 * dx3);
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
    const ua = uat / ub;
    ub = ubt / ub;
    if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
      return true;
    }
    return false;
  }

  static testLinePoint(line, point) {
    if (lineHasNoLength(line)) {
      return false;
    }

    const [p1, p2] = getLineVectors(line);
    return isPointOnLine(p1, p2, point);
  }
}
