import {
  chart,
  renderer,
  data,
  formatter,
  brush,
  component
} from './core';
import q from './q';
import './web';

// import chartComponent from './core/charts';
import boxMarkerComponent from './core/chart-components/markers/box';
import pointMarkerComponent from './core/chart-components/markers/point';
import gridLineComponent from './core/chart-components/grid';
import axisComponent from './core/chart-components/axis';
import textComponent from './core/chart-components/text';
import scrollbarComponent from './core/chart-components/scrollbar';

// Plugin API
function use(plugin, options = {}) {
  plugin({
    chart,
    renderer,
    brush,
    data,
    formatter,
    component,
    q
  }, options);
}

// Register components
// use(chartComponent);
use(textComponent);
use(axisComponent);
use(boxMarkerComponent);
use(pointMarkerComponent);
use(gridLineComponent);
use(scrollbarComponent);

// Register q
use(q);

/**
 * The mother of all namespaces
 * @namespace picasso
 */
export {
  chart,
  renderer,
  data,
  formatter,
  brush,
  use,
  component
};
