import polyfillPath2D from './path2d-polyfill';
import { renderer } from '../core';
import svgRenderer from './renderer/svg-renderer/svg-renderer';
import canvasRenderer from './renderer/canvas-renderer';
import domRenderer from './renderer/dom-renderer';

if (typeof window !== 'undefined') {
  polyfillPath2D(window);
}

renderer.register('svg', svgRenderer);
renderer.register('canvas', canvasRenderer);
renderer.register('dom', domRenderer);
