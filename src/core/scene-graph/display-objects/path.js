import DisplayObject from './display-object';
import { getMinMax } from '../../math/intersection';

function pathToPoints(path) {
  if (typeof path !== 'string') {
    return [];
  }
  const commands = path.match(/[a-z][^a-z]*/ig);

  let prevPoint;
  const points = [];
  for (let i = 0; i < commands.length; i++) {
    const params = commands[i].match(/([mlz])\s?(\S+)?(?:\s|,)?(\S+)?/i);
    if (!Array.isArray(params) || isNaN(params[2]) || isNaN(params[3])) {
      continue;
    }
    const command = params[1];
    const x = +params[2];
    const y = +params[3];
    switch (command) {
      case 'M':
        prevPoint = { x, y };
        break;
      case 'L':
        prevPoint = { x, y };
        break;
      case 'm':
        prevPoint = { x: prevPoint.x + x, y: prevPoint.y + y };
        break;
      case 'l':
        prevPoint = { x: prevPoint.x + x, y: prevPoint.y + y };
        break;
      default:
        continue;
    }
    points.push(prevPoint);
  }

  return points;
}

export default class Path extends DisplayObject {
  constructor(...s) {
    super('path');
    this.set(...s);
  }

  set(v = {}) {
    super.set(v);
    this.attrs.d = v.d;
    super.collider(v.collider);
    this.points = null;
  }

  boundingRect(includeTransform = false) {
    this.points = this.points ? this.points : pathToPoints(this.attrs.d);
    const pt = includeTransform && this.modelViewMatrix ? this.modelViewMatrix.transformPoints(this.points) : this.points;
    const [xMin, yMin, xMax, yMax] = getMinMax(pt);

    return {
      x: xMin || 0,
      y: yMin || 0,
      width: (xMax - xMin) || 0,
      height: (yMax - yMin) || 0
    };
  }

  bounds(includeTransform = false) {
    const rect = this.boundingRect(includeTransform);

    return [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height }
    ];
  }
}

export function create(...s) {
  return new Path(...s);
}
