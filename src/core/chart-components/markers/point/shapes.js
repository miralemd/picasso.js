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
  })
};

export default function shape(s, p) {
  return shapes[s] ? shapes[s](p) : shapes.circle(p);
}
