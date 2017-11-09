import extend from 'extend';
import bandScale from './band';

function keyGen(node, valueFn) {
  return node.ancestors()
    .map(a => valueFn(a.data))
    .reverse()
    .slice(1) // Delete root node
    .toString();
}

function flattenTree(rootNode, valueFn, labelFn) {
  const values = [];
  const labels = [];
  const items = {};
  let expando = 0;
  if (!rootNode) {
    return { values, labels, items };
  }

  rootNode.eachAfter((node) => {
    if (node.depth > 0) {
      const key = keyGen(node, valueFn);
      const leaves = node.leaves() || [node]; // If leaf node returns itself
      const value = valueFn(node.data);
      const label = labelFn(node.data);

      items[key] = {
        count: leaves.length,
        value,
        label,
        leftEdge: keyGen(leaves[0], valueFn),
        rightEdge: keyGen(leaves[Math.max(leaves.length - 1, 0)], valueFn),
        node
      };

      if (Array.isArray(node.children)) {
        values.push(`SPACER_${expando}_SPACER`);
        items[key].isLeaf = false;
        expando++;
      } else {
        items[key].isLeaf = true;
        values.push(key);
        labels.push(label);
      }
    }
  });

  const spill = rootNode.height - 1;
  if (spill > 0) {
    values.splice(-spill);
  }

  return { values, labels, items };
}

/**
 * @typedef settings
 * @property {number} [padding=0] - Exposes {@link https://github.com/d3/d3-scale#band_padding}
 * @property {boolean} [paddingOuter=0] - Exposes {@link https://github.com/d3/d3-scale#band_paddingOuter}
 * @property {number[]} [paddingInner=0] - Exposes {@link https://github.com/d3/d3-scale#band_paddingInner}
 * @property {object} [align=0.5] - Exposes {@link https://github.com/d3/d3-scale#band_align}
 * @property {boolean} [invert=false] - Invert the output range
 */

 /**
  * Hierarchical band scale, that is an augmented band scale, that takes hierarchical data as input
 * @alias scaleHierarchicalBand
 * @memberof picasso
 * @param { Object } settings
 * @param { fields[] } [fields]
 * @param { dataset } [dataset] - With a root property that is an instance of D3.js Hierarchy
 * @return { h-band }
 */

export default function scaleHierarchicalBand(settings = {}, data = {}) {
  let bandInstance = bandScale(settings);

  const valueFn = typeof settings.value === 'function' ? settings.value : d => d.value;
  const labelFn = typeof settings.label === 'function' ? settings.label : valueFn;
  const { values, labels, items } = flattenTree(data.root, valueFn, labelFn);

  /**
   * @alias h-band
   * @kind function
   * @param { Object[] } value - Array where each value is a reference to a node, going from depth 1 to n.
   * @return { number }
   */
  const hBand = function fn(val) {
    const strVal = String(val);
    const item = items[strVal];
    if (item) {
      return bandInstance(settings.invert ? item.rightEdge : item.leftEdge);
    }

    return bandInstance(strVal);
  };

  extend(true, hBand, bandInstance);

  /**
   * Wrapped {@link https://github.com/d3/d3-scale#band_bandwidth}
   * @param { Object[] } [val] - Array where each value is a reference to a node, going from depth 1 to n. If omitted, bandwidth for the leaf nodes is return.
   * @return { number }
   */
  const orgBandwidth = bandInstance.bandwidth;
  hBand.bandwidth = function bandwidth(val) {
    const item = items[String(val)];
    const bw = orgBandwidth();
    if (item && !item.isLeaf) {
      const left = hBand(item.leftEdge);
      const right = hBand(item.rightEdge);
      return Math.abs(left - right) + bw;
    }
    return bw;
  };

  /**
   * Wrapped {@link https://github.com/d3/d3-scale#band_step}
   * @param { Object[] } [val] - Array where each value is a reference to a node, going from depth 1 to n. If omitted, step size for the leaf nodes is return.
   * @return { number }
   */
  const orgStep = bandInstance.step;
  hBand.step = function step(val) {
    const item = items[String(val)];
    const leafCount = item ? item.count : 1;
    let stepSize = orgStep();
    stepSize *= leafCount;
    return stepSize;
  };

  /**
   * @return { dataset }
   */
  hBand.data = () => data;

  /**
   * Return datum for a given node
   * @param { Object[] } val - Array where each value is a reference to a node, going from depth 1 to n.
   * @return { Object } The datum
   */
  hBand.datum = (val) => {
    const item = items[String(val)];
    if (item) {
      return item.node.data;
    }
    return null;
  };

  hBand.copy = () => scaleHierarchicalBand(settings, data);

  /**
   * @return { Object[] } Labels for each leaf node
   */
  hBand.labels = () => labels;

  /**
   * Generate discrete ticks
   * @return { Object[] } Ticks for each leaf node
   */
  hBand.ticks = (input = {}) => {
    const ticks = [];
    const depth = input.depth;

    Object.keys(items).forEach((k) => {
      const item = items[k];
      if (item.node.depth === depth || (item.isLeaf && typeof depth === 'undefined')) {
        const start = hBand(k);
        const bandwidth = hBand.bandwidth(k);
        ticks.push({
          position: start + (bandwidth / 2),
          label: item.label,
          data: item.node.data,
          start,
          end: start + bandwidth
        });
      }
    });

    return ticks;
  };

  // const stgns = generateSettings(settings || {}, data.root); // TODO look into supporting setting functions

  const orgPxScale = bandInstance.pxScale;
  hBand.pxScale = function pxScale(size) { // TODO support pxScaling
    bandInstance = orgPxScale(size);
    return hBand;
  };

  hBand.domain(values);

  return hBand;
}

