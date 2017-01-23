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
    collision.parent = createNodeCollsion(p);

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
      transformedInput.r = input.r;
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

function resolveShape(shape, ratio = 1) {
  const {
    x, y,
    width, height,
    x1, x2, y1, y2,
    cx, cy, r
  } = shape || {};
  let _shape;

  const isNumber = v => typeof v === 'number' && !isNaN(v);

  if (isNumber(cx) && isNumber(cy) && isNumber(r)) {
    _shape.x = cx * ratio;
    _shape.y = cy * ratio;
    _shape.r = r;
    return ['intersectsCircle', _shape];
  } else if (isNumber(x1) && isNumber(x2) && isNumber(y1) && isNumber(y2)) {
    _shape = convertLineToPoints(shape).map(p => scalarMultiply(p, ratio));
    return ['intersectsLine', _shape];
  } else if (isNumber(x) && isNumber(y) && isNumber(width) && isNumber(height)) {
    _shape = convertRectToPoints(shape).map(p => scalarMultiply(p, ratio));
    return ['intersectsRect', _shape];
  } else if (isNumber(x) && isNumber(y)) {
    _shape = scalarMultiply(shape, ratio);
    return ['containsPoint', _shape];
  }
  return [];
}

export function resolveCollionsOnNode(node, shape) {
  const [intersectionType, _shape] = resolveShape(shape, node.dpi);
  const collisions = [];

  if (intersectionType) {
    findAllCollisions([node], intersectionType, collisions, _shape);
    appendInputShape(shape, collisions);
  }
  return collisions;
}

export function hasCollisionOnNode(node, shape) {
  const [intersectionType, _shape] = resolveShape(shape, node.dpi);

  return hasCollision([node], intersectionType, _shape);
}