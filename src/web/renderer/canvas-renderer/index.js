import { renderer, register } from './canvas-renderer';
import { render as rect } from './shapes/rect';
import { render as circle } from './shapes/circle';
import { render as line } from './shapes/line';
import { render as text } from './shapes/text';

register('rect', rect);
register('circle', circle);
register('line', line);
register('text', text);

export {
  renderer
};
