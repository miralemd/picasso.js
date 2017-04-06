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
import brushRangeComponent from './core/chart-components/brush-range';
import rangeComponent from './core/chart-components/range';
import interactionComponent from './core/chart-components/interaction';

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
use(brushRangeComponent);
use(rangeComponent);
use(interactionComponent);

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
