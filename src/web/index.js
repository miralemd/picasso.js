import polyfillPath2D from './path2d-polyfill';

if (typeof window !== 'undefined') {
  polyfillPath2D(window);
}
