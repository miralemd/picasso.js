import {
  chart,
  renderer,
  data,
  formatter,
  dataset,
  field,
  table,
  component
} from './core';
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
    data,
    dataset,
    field,
    table,
    formatter,
    component
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

/**
 * The mother of all namespaces
 * @namespace picasso
 */
export {
  chart,
  renderer,
  data,
  formatter,
  dataset,
  field,
  table,
  use,
  component
};
