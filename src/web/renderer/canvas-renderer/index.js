import { renderer, register } from './canvas-renderer';
import rect from './shapes/rect';
import circle from './shapes/circle';
import line from './shapes/line';
import text from './shapes/text';

register('rect', rect);
register('circle', circle);
register('line', line);
register('text', text);

export default renderer;
