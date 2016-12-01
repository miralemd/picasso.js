import { measureText } from '../../text-metrics';
import { ellipsText } from '../../text-manipulation';

function convertBaseline(baseline) {
  if (baseline === 'central') {
    return 'middle';
  } else if (baseline === 'text-before-edge') {
    return 'top';
  } else if (baseline === 'text-after-edge') {
    return 'bottom';
  }

  return baseline;
}

export default function render(t, { g }) {
  const text = ellipsText(t, measureText);

  g.font = `${t['font-size']} ${t['font-family']}`;
  g.textAlign = t['text-anchor'] === 'middle' ? 'center' : t['text-anchor'];
  g.textBaseline = convertBaseline(t['dominant-baseline']);
  g.fillText(text, t.x + t.dx, t.y + t.dy);
}
