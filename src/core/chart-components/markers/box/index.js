import boxMarkerComponent from './box';

export default function boxMarker(picasso) {
  picasso.component('box-marker', boxMarkerComponent);
}

/**
 * @typedef settings
 * @type {object}
 * @property {object} major
 * @property {string} major.scale - The scale to use along the major axis
 * @property {string|object} [major.ref='self'] - Reference to the data property along the major axis
 * @property {string} major.ref.start - Reference to the data property of the start value along the major axis
 * @property {string} major.ref.end - Reference to the data property of the end value along the major axis
 * @property {object} minor
 * @property {string} minor.scale - The scale to use along the minor axis
 * @property {string} [orientation='vertical']
 * @property {object} [box]
 * @property {boolean} [box.show=true]
 * @property {string} [box.fill='#fff']
 * @property {string} [box.stroke='#000']
 * @property {number} [box.strokeWidth=1]
 * @property {number} [box.width=1]
 * @property {number} [box.maxWidth=100]
 * @property {number} [box.minWidth=5]
 * @property {object} [line]
 * @property {boolean} [line.show=true]
 * @property {string} [stroke='#000']
 * @property {number} [strokeWidth=1]
 * @property {object} [whisker]
 * @property {boolean} [whisker.show=true]
 * @property {string} [whisker.stroke='#000']
 * @property {number} [whisker.strokeWidth=1]
 * @property {number} [whisker.width=1]
 * @property {object} [median]
 * @property {number} [median.show=true]
 * @property {number} [median.stroke='#000']
 * @property {number} [median.strokeWidth=1]
 */

/**
 * @typedef box-marker
 * @property {string} type - "box"
 * @property {marker-box-data} data - Box data
 * @property {marker-box-settings} settings - Box marker settings
 * @example
 * {
 *   type: "box",
 *   data: {
 *    mapTo: {
 *      min: { source: "/qHyperCube/qMeasureInfo/0" },
 *      start: { source: "/qHyperCube/qMeasureInfo/1" },
 *      med: { source: "/qHyperCube/qMeasureInfo/2" },
 *      end: { source: "/qHyperCube/qMeasureInfo/3" },
 *      max: { source: "/qHyperCube/qMeasureInfo/4" },
 *    },
 *    groupBy: {
 *      source: "/qHyperCube/qDimensionInfo/0"
 *    }
 *  },
 *  settings: {
 *    major: {
 *      scale: { source: "/qHyperCube/qDimensionInfo/0" }
 *    },
 *    minor: {
 *      scale: { source: ["/qHyperCube/qMeasureInfo/0",
 *               "/qHyperCube/qMeasureInfo/1",
 *               "/qHyperCube/qMeasureInfo/2",
 *               "/qHyperCube/qMeasureInfo/3",
 *               "/qHyperCube/qMeasureInfo/4"] }
 *    }
 *  }
 * }
 */

/**
 * @typedef data
 * @type {object}
 * @property {number} [min] - min
 * @property {number} [max] - max
 * @property {number} [start] - start
 * @property {number} [end] - end
 * @property {number} [med] - med
 */
