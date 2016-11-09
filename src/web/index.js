import { renderer } from '../core';
import { renderer as svg } from './renderer/svg-renderer/svg-renderer';
import { renderer as canvas } from './renderer/canvas-renderer';

renderer.register('svg', svg);
renderer.register('canvas', canvas);
