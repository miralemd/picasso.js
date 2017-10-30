import {
  area,
  curveLinear,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  curveBasis,
  curveCardinal,
  curveCatmullRom,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural
} from 'd3-shape';
import { normalizeSettings, resolveForItem } from '../property-resolver';

const CURVES = {
  step: curveStep,
  stepAfter: curveStepAfter,
  stepBefore: curveStepBefore,
  linear: curveLinear,
  basis: curveBasis,
  cardinal: curveCardinal.tension(0),
  catmullRom: curveCatmullRom,
  monotonex: curveMonotoneX,
  monotoney: curveMonotoneY,
  natural: curveNatural
};

/**
 * @typedef {object} components.line
 * @experimental
 */

/**
 * @typedef {object} components.line.settings
 */

const SETTINGS = {
  /**
   * Coordinates
   * @memberof components.line.settings
   */
  coordinates: {
    /**
     * @type {number} */
    minor: 0.5,
    /**
     * @type {number} */
    major: 0.5,
    /**
     * @type {number} */
    layerId: 0
  },
  /**
   * @memberof components.line.settings
   * @type {string} */
  orientation: 'horizontal',
  /**
   * @memberof components.line.settings
   * @type {object} */
  layers: {
    /**
     * @type {string} */
    curve: 'linear',
    /**
     * @type {boolean} */
    show: true,
    /**
     * @type {object} */
    line: {
      /**
       * @type {string} */
      stroke: '#ccc',
      /**
       * @type {number} */
      strokeWidth: 1,
      /**
       * @type {number} */
      opacity: 1,
      /**
       * @type {boolean} */
      show: true
    },
    area: {
      /**
       * @type {string} */
      fill: '#ccc',
      /**
       * @type {number} */
      opacity: 0.8,
      /**
       * @type {boolean} */
      show: true
    }
  }
};

const lineMarkerComponent = {
  require: ['chart'],
  created() {
    this.stngs = this.settings.settings || {};
  },
  beforeRender({ size }) {
    this.rect = size;
    // return inner;
  },
  render({ data }) {
    const { width, height } = this.rect;

    // massage settings
    const orientation = this.stngs.orientation || 'horizontal';
    const pointSettings = normalizeSettings(this.stngs.coordinates, SETTINGS.coordinates, this.chart);
    const lineSettings = normalizeSettings(this.stngs.layers.line, SETTINGS.layers.line, this.chart);
    const areaSettings = normalizeSettings(this.stngs.layers.area, SETTINGS.layers.area, this.chart);
    const layerSettings = normalizeSettings({
      curve: this.stngs.layers.curve,
      show: this.stngs.layers.show
    }, { curve: SETTINGS.layers.curve, show: SETTINGS.layers.show }, this.chart);

    const missingMinor0 = typeof this.stngs.coordinates.minor0 === 'undefined';

    // collect points into layers
    const layerIds = {};
    let numLines = 0;
    for (let i = 0; i < data.items.length; i++) {
      let p = data.items[i];
      let lid = resolveForItem(p, { layerId: pointSettings.layerId }).layerId;
      layerIds[lid] = layerIds[lid] || { order: numLines++, id: lid, items: [], firstPoint: p };
      layerIds[lid].items.push(p);
    }

    const layerData = Object.keys(layerIds).map(lid => layerIds[lid].firstPoint);

    // massage layers
    const layers = Object.keys(layerIds).map((lid) => {
      const layer = layerIds[lid];
      const layerObj = resolveForItem(layer.firstPoint, layerSettings, layerData);
      if (layerObj && layerObj.show === false) {
        return null;
      }

      const lineObj = resolveForItem(layer.firstPoint, lineSettings, layerData);
      const areaObj = resolveForItem(layer.firstPoint, areaSettings, layerData);

      const values = [];
      const points = [];
      const items = layer.items.slice();
      let point;
      let pData;
      for (let i = 0; i < layer.items.length; i++) {
        pData = layer.items[i];
        point = resolveForItem(pData, pointSettings, items);
        if (isNaN(point.major)) {
          continue;
        }
        if (missingMinor0) {
          point.minor0 = pointSettings.minor.scale ? pointSettings.minor.scale(pData.minor0 ? pData.minor0.value : 0) : 0;
        }
        values.push(point.minor);
        points.push(point);
      }

      const median = values.sort((a, b) => a - b)[Math.floor((values.length - 1) / 2)];

      return {
        layerObj,
        lineObj,
        areaObj,
        median,
        points,
        firstPoint: layer.firstPoint
      };
    });

    layers.sort((a, b) => a.median - b.median);

    // generate visuals
    let nodes = [];
    layers.forEach((layer) => {
      const { lineObj, layerObj, areaObj, points } = layer;

      const areaGenerator = area();
      let lineGenerator;
      let secondaryLineGenerator;
      if (orientation === 'vertical') {
        areaGenerator
          .y(d => d.major * height)
          .x1(d => d.minor * width)
          .x0(d => (d.minor0) * width)
          .defined(d => typeof d.minor === 'number' && !isNaN(d.minor))
          .curve(CURVES[layerObj.curve === 'monotone' ? 'monotoney' : layerObj.curve]);

        lineGenerator = areaGenerator.lineX1();
        secondaryLineGenerator = areaGenerator.lineX0();
      } else {
        areaGenerator
          .x(d => d.major * width)
          .y1(d => d.minor * height)
          .y0(d => d.minor0 * height)
          .defined(d => typeof d.minor === 'number' && !isNaN(d.minor))
          .curve(CURVES[layerObj.curve === 'monotone' ? 'monotonex' : layerObj.curve]);
        lineGenerator = areaGenerator.lineY1();
        secondaryLineGenerator = areaGenerator.lineY0();
      }

      // area layer
      if (this.stngs.layers.area && areaObj.show !== false) {
        const areaPath = areaGenerator(points);
        nodes.push({
          type: 'path',
          d: areaPath,
          opacity: areaObj.opacity,
          stroke: areaObj.stroke,
          strokeWidth: areaObj.strokeWidth,
          fill: areaObj.fill,
          data: layer.firstPoint
        });
      }

      // main line layer
      if (lineObj && lineObj.show !== false) {
        let linePath = lineGenerator(points);
        nodes.push({
          type: 'path',
          d: linePath,
          opacity: lineObj.opacity,
          stroke: lineObj.stroke,
          strokeWidth: lineObj.strokeWidth,
          fill: 'none',
          data: layer.firstPoint
        });

        // secondary line layer, used only when rendering area
        if (!missingMinor0 && this.stngs.layers.area && areaObj.show !== false) {
          linePath = secondaryLineGenerator(points);
          nodes.push({
            type: 'path',
            d: linePath,
            opacity: lineObj.opacity,
            stroke: lineObj.stroke,
            strokeWidth: lineObj.strokeWidth,
            fill: 'none',
            data: layer.firstPoint
          });
        }
      }
    });
    return nodes;
  }
};

export default lineMarkerComponent;