import extend from 'extend';

function directionTriangle(x, y, r, d = 'bottom') {
  if (d === 'left' || d === 'right') {
    let right = d === 'right';
    x += (right ? -r : r);
    return `
      M ${x} ${y - r}
      L ${x} ${y + r}
      L ${right ? x + (r * 1.5) : x - (r * 1.5)} ${y} Z
    `;
  }
  let bottom = d === 'down';
  y += (bottom ? -r : r);
  return `
    M ${x - r} ${y}
    L ${x + r} ${y}
    L ${x} ${bottom ? y + (r * 1.5) : y - (r * 1.5)} Z
  `;
}

export default function createButton({ x, y, width, height, direction, data, rect, symbol }) {
  const buttonRect = extend({
    type: 'rect',
    x,
    y,
    width,
    height,
    fill: 'transparent',
    stroke: 'grey',
    strokeWidth: 1,
    opacity: 1
  }, rect);

  const r = Math.min(width / 2, height / 2) * 0.6;
  const symX = x + (width / 2);
  const symY = y + (height / 2);

  const buttonSymbol = extend({}, symbol, {
    type: 'path',
    d: directionTriangle(symX, symY, r, direction)
  });

  const container = {
    type: 'container',
    x,
    y,
    width,
    height
  };

  container.collider = extend({}, container, { type: 'rect' });
  container.children = [buttonRect, buttonSymbol];
  container.data = data;

  return container;
}
