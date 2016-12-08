import { createInstance } from './chart-instance';

/**
 * Chart render function
 * @memberof picasso
 * @alias render
 * @param  {DOMElement} element - Element to draw the chart in
 * @param  {Chart} chart - The chart definition
 * @return {ChartInstance} A chart instance
 * @example
 * picasso.render(element, chart);
 */
export default function render(element, chart) {
  const chartInstance = createInstance(chart);
  chartInstance.mount(element);
  return chartInstance;
}
