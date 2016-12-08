import composer from './composer';

/**
 * Chart instance class
 */
export default class ChartInstance {
  /**
   * @param {Chart} chart - Chart definition
   */
  constructor(chart) {
    this.chart = chart;

    // Do a shallow extend
    this.data = Object.assign({}, chart.data);
    this.settings = Object.assign({}, chart.settings);
  }

  /**
   * Mount the chart instance into an element.
   * @param {HTMLElement} element - The element to render the chart to.
   */
  mount(element) {
    if(this.element) {
      throw new Error('Chart instance already mounted');
    }

    const {
      data,
      settings,
      mounted,
      on
    } = this.chart;

    this.element = element;
    element.innerHTML = '';

    const comp = composer();
    comp.build(element, data, settings);

    if (typeof on === 'object') {
      Object.keys(on).forEach((key) => {
        const listener = on[key].bind(this);
        element.addEventListener(key, listener);
      });
    }

    if (typeof mounted === 'function') {
      mounted.call(this, element);
    }
  }

  /**
   * Update the chart with new settings and / or data
   * @param {} chart - Chart definition
   */
  update(newProps) {
    if (newProps.data) {
      this.data = newProps.data;
    }
    if (newProps.settings) {
      this.settings = newProps.settings;
    }

    // TODO shouldn't rebuild the chart from scratch
    this.element.innerHTML = '';

    const comp = composer();
    comp.build(this.element, this.data, this.settings);

    if (typeof this.chart.updated === 'function') {
      this.chart.updated.call(this);
    }
  }
}

/**
 * Chart instance factory function
 * @param {Chart} chart - Chart definition
 * @returns {ChartInstance} An instance of the chart
 */
export function createInstance(chart) {
  return new ChartInstance(chart);
}
