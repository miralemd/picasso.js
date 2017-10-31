import {
  bars
} from './strategies';

/**
 * @typedef settings
 * @type {object}
 * @property {object} sources
 * @property {string} sources.component
 * @property {string} sources.selector
 * @property {label-strategy} sources.strategy
 */

const labelsComponent = {
  require: ['chart', 'renderer', 'settings'],
  defaultSettings: {
    settings: {}
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
  },
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render() {
    const stngs = this.settings.settings;
    const labels = [];
    let nodes = [];
    let comp;
    let nodeData;

    (stngs.sources || []).forEach((source) => {
      if (source.strategy && source.strategy.type === 'bar' && source.component) {
        comp = this.chart.component(source.component);
        if (comp) {
          nodes = this.chart.findShapes(source.selector).filter(n => n.key === source.component);
          nodeData = comp.data;
        }

        labels.push(...bars({
          settings: source.strategy.settings,
          chart: this.chart,
          nodes,
          rect: {
            x: 0,
            y: 0,
            width: this.rect.width,
            height: this.rect.height
          },
          data: nodeData,
          renderer: this.renderer,
          context: this
        }));
      }
    });

    return labels;
  }
};

export default labelsComponent;
