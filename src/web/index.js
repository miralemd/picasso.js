import { renderer } from '../core';
import svgRenderer from './renderer/svg-renderer/svg-renderer';
import canvasRenderer from './renderer/canvas-renderer';
import domRenderer from './renderer/dom-renderer';

renderer.register('svg', svgRenderer);
renderer.register('canvas', canvasRenderer);
renderer.register('dom', domRenderer);
