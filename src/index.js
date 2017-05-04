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
import refLineComponent from './core/chart-components/ref-line';
import axisComponent from './core/chart-components/axis';
import textComponent from './core/chart-components/text';
import scrollbarComponent from './core/chart-components/scrollbar';
import brushRangeComponent from './web/components/brush-range';
import rangeComponent from './core/chart-components/range';
import brushLassoComponent from './core/chart-components/brush-lasso';
import interactionComponent from './web/components/interaction';
import labelsComponent from './core/chart-components/labels';

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
use(refLineComponent);
use(scrollbarComponent);
use(brushRangeComponent);
use(rangeComponent);
use(brushLassoComponent);
use(interactionComponent);
use(labelsComponent);

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
