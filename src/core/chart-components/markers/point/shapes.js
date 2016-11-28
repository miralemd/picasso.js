const shapes = {
  circle: p => ({
    type: 'circle',
    title: p.label,
    cx: p.x,
    cy: p.y,
    r: p.size / 2,
    opacity: p.opacity,
    fill: p.fill,
    stroke: p.stroke,
    strokeWidth: p.strokeWidth
  }),
  rect: p => ({
    type: 'rect',
    title: p.label,
    x: p.x - (p.size / 2),
    y: p.y - (p.size / 2),
    width: p.size,
    height: p.size,
    opacity: p.opacity,
    fill: p.fill,
    stroke: p.stroke,
    strokeWidth: p.strokeWidth
  }),
  saltire: (p) => {
    const x1 = (p.x - (10 / 2));
    const y1 = (p.y - (10 / 2));
    return {
      type: 'path',
      title: p.label,
      d: `M ${x1} ${y1} l 10 10 M ${x1} ${y1 + 10} l 10 -10`,
      opacity: p.opacity,
      stroke: p.fill,
      strokeWidth: 2
    };
  }
};

export function shape(s, p) {
  if (!p.size && shapes[s]) {
    return shapes.saltire(p);
  } else {
    return shapes[s] ? shapes[s](p) : shapes.circle(p);
  }
}
