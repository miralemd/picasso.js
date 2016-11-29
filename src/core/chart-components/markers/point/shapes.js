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
    const x1 = (p.x - (p.size / 2));
    const y1 = (p.y - (p.size / 2));
    return {
      type: 'path',
      title: p.label,
      d: `M ${x1} ${y1} l ${p.size} ${p.size} M ${x1} ${y1 + p.size} l ${p.size} -${p.size}`,
      opacity: p.opacity,
      stroke: p.fill,
      strokeWidth: p.strokeWidth
    };
  }
};

export function shape(s, p) {
  return shapes[s] ? shapes[s](p) : shapes.circle(p);
}
