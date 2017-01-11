import createCollision from './collision';
import { scalarMultiply } from '../math/vector';
import { convertLineToPoints, convertRectToPoints } from '../math/intersection';

function appendParentNode(node, collision) {
  const p = node.parent;

  if (p && p.type !== 'stage') {
    collision.parent = createCollision({
      node: p.node,
      bounds: p.boundingRect(true)
    });

    const pp = p.parent;
    if (pp && pp.type !== 'stage') {
      appendParentNode(pp, collision.parent);
    }
  }
}

function appendInputShape(shape, collisions) {
  collisions.forEach((c) => { c.input = shape; });
}

// TODO Actually care about the order of the children to ensure FRONT
function resolveFrontChildCollision(node, type, input) {
  const num = node.children.length;

  for (let i = num - 1; i > 0; i--) {
    const child = node.children[i];

    if (child[type](input)) {
      const collision = createCollision({
        node: child.node,
        bounds: child.boundingRect(true)
      });

      appendParentNode(child, collision);

      return collision;
    }
  }
  return null;
}

function resolveChildrenCollisions(o, type, input) {
  const num = o.children.length;
  const collisions = [];

  for (let i = 0; i < num; i++) {
    const child = o.children[i];

    if (child[type](input)) {
      const collision = createCollision({
        node: child.node,
        bounds: child.boundingRect(true)
      });

      appendParentNode(child, collision);

      collisions.push(collision);
    }
  }
  return collisions;
}

function resolveBoundsCollision(o, type, input) {
  const collider = o._collider.fn;
  if (collider[type](input)) {
    const c = createCollision({
      node: o.node,
      bounds: o.boundingRect(true)
    });

    appendParentNode(o, c);

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
    const c = createCollision({
      node: node.node,
      bounds: node.boundingRect(true)
    });

    appendParentNode(node, c);

    return c;
  }

  return null;
}

export default function resolveCollision(node, intersectionType, input) {
  const collider = node._collider;
  if (collider === null) return null;

  if (collider.type === 'children') {
    return resolveChildrenCollisions(node, intersectionType, input);
  } else if (collider.type === 'frontChild') {
    return resolveFrontChildCollision(node, intersectionType, input);
  } else if (collider.type === 'bounds') {
    return resolveBoundsCollision(node, intersectionType, input);
  }

  return resolveGeometryCollision(node, intersectionType, input);
}

function traverseNodes(nodes, intersectionType, ary, input) {
  const num = nodes.length;
  for (let i = 0; i < num; i++) {
    const node = nodes[i];

    const collision = resolveCollision(node, intersectionType, input);

    if (collision && Array.isArray(collision)) ary.push(...collision);
    else if (collision) ary.push(collision);

    if (node.children && (collision === null || collision.length > 0)) { // Only traverse children if no match is found on parent
      traverseNodes(node.children, intersectionType, ary, input);
    }
  }
}

function shapeToPoints(shape, ratio = 1) {
  const {
    x, y,
    width, height,
    x1, x2, y1, y2,
    cx, cy, r
  } = shape;
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

export function resolveCollionsOnNodes(parentNode, shape) {
  const [intersectionType, points] = shapeToPoints(shape, parentNode.dpi);
  const collisions = [];

  if (intersectionType) {
    traverseNodes(parentNode.children, intersectionType, collisions, points);
    appendInputShape(shape, collisions);
  }
  return collisions;
}
