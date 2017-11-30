import extend from 'extend';
import triangle from '../../symbols/triangle';

export default function createButton({ x, y, width, height, direction, action, rect, symbol }) {
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

  const r = Math.min(width, height) * Math.max(0, Math.min(symbol.size || 0.5, 1));
  const symX = x + (width / 2);
  const symY = y + (height / 2);

  const buttonSymbol = triangle({
    x: symX,
    y: symY,
    size: r,
    direction
  });

  buttonSymbol.fill = symbol.fill;
  buttonSymbol.stroke = symbol.stroke;
  buttonSymbol.strokeWidth = symbol.strokeWidth;

  const container = {
    type: 'container',
    x,
    y,
    width,
    height
  };

  container.collider = extend({}, container, { type: 'rect' });
  container.children = [buttonRect, buttonSymbol];
  container.desc = { action };
  container.tag = 'scroll-button';

  return container;
}
