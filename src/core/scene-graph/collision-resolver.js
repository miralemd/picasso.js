import createCollision from './collision';
import { scalarMultiply } from '../math/vector';
import { convertLineToPoints, convertRectToPoints } from '../math/intersection';

function createNodeCollsion(node) {
  return createCollision({
    node: node.node,
    bounds: node.boundingRect ? node.boundingRect(true) : { x: 0, y: 0, width: 0, height: 0 }
  });
}

function appendParentNode(node, collision) {
  const p = node.parent;

  if (p && p.type !== 'stage') {
    collision.parent = createNodeCollsion(node);

    const pp = p.parent;
    if (pp && pp.type !== 'stage') {
      appendParentNode(pp, collision.parent);
    }
  }
}

function appendInputShape(shape, collisions) {
  collisions.forEach((c) => { c.input = shape; });
}

function resolveFrontChildCollision(node, type, input) {
  const num = node.descendants.length;

  for (let i = num - 1; i >= 0; i--) {
    const desc = node.descendants[i];
    const collider = desc._collider;

    if (collider && collider.fn[type](input)) {
      const collision = createNodeCollsion(desc);

      appendParentNode(desc, collision);

      return collision;
    }
  }
  return null;
}

function resolveBoundsCollision(node, type, input) {
  const collider = node._collider.fn;
  if (collider[type](input)) {
    const c = createNodeCollsion(node);

    appendParentNode(node, c);

    return c;
  }
  return null;
}

function resolveGeometryCollision(node, type, input) {
  let transformedInput = input;
  if (node.modelViewMatrix) {
    if (Array.isArray(input)) {
      transformedInput = node.inverseModelViewMatrix.transformPoints(input);
    } else {
      transformedInput = node.inverseModelViewMatrix.transformPoint(input);
    }
  }

  const collider = node._collider.fn;
  if (collider[type](transformedInput)) {
    const c = createNodeCollsion(node);

    appendParentNode(node, c);

    return c;
  }

  return null;
}

function resolveCollision(node, intersectionType, input) {
  const collider = node._collider;
  if (collider === null) return null;

  if (collider.type === 'frontChild') {
    return resolveFrontChildCollision(node, intersectionType, input);
  } else if (collider.type === 'bounds') {
    return resolveBoundsCollision(node, intersectionType, input);
  }

  return resolveGeometryCollision(node, intersectionType, input);
}

function findAllCollisions(nodes, intersectionType, ary, input) {
  const num = nodes.length;
  for (let i = 0; i < num; i++) {
    const node = nodes[i];

    const collision = resolveCollision(node, intersectionType, input);

    if (collision) ary.push(collision);

    // Only traverse children if no match is found on parent and it doesnt have any custom collider
    if (node.children && !collision && !node._collider) {
      findAllCollisions(node.children, intersectionType, ary, input);
    }
  }
}

function hasCollision(nodes, intersectionType, input) {
  const num = nodes.length;
  for (let i = 0; i < num; i++) {
    const node = nodes[i];

    const collision = resolveCollision(node, intersectionType, input);

    if (collision !== null) return true;

    if (node.children && !node._collider) {
      return hasCollision(node.children, intersectionType, input);
    }
  }
  return false;
}

function shapeToPoints(shape, ratio = 1) {
  const {
    x, y,
    width, height,
    x1, x2, y1, y2,
    cx, cy, r
  } = shape || {};
  let points;

  const isNumber = v => typeof v === 'number' && !isNaN(v);

  if (isNumber(cx) && isNumber(cy) && isNumber(r)) {
    return []; // Not supported
  } else if (isNumber(x1) && isNumber(x2) && isNumber(y1) && isNumber(y2)) {
    points = convertLineToPoints(shape).map(p => scalarMultiply(p, ratio));
    return ['intersectsLine', points];
  } else if (isNumber(x) && isNumber(y) && isNumber(width) && isNumber(height)) {
    points = convertRectToPoints(shape).map(p => scalarMultiply(p, ratio));
    return ['intersectsRect', points];
  } else if (isNumber(x) && isNumber(y)) {
    points = scalarMultiply(shape, ratio);
    return ['containsPoint', points];
  }
  return [];
}

export function resolveCollionsOnNode(node, shape) {
  const [intersectionType, points] = shapeToPoints(shape, node.dpi);
  const collisions = [];

  if (intersectionType) {
    findAllCollisions([node], intersectionType, collisions, points);
    appendInputShape(shape, collisions);
  }
  return collisions;
}

export function hasCollisionOnNode(node, shape) {
  const [intersectionType, points] = shapeToPoints(shape, node.dpi);

  return hasCollision([node], intersectionType, points);
}
