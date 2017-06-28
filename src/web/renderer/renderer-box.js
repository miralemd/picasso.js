/**
   * Create the renderer box
   * @param {object} [opts]
   * @param {number} [opts.x] - x-coordinate
   * @param {number} [opts.y] - y-coordinate
   * @param {number} [opts.width] - Width
   * @param {number} [opts.height] - Height
   * @param {object} [opts.scaleRatio]
   * @param {number} [opts.scaleRatio.x] - Scale ratio on x-axis
   * @param {number} [opts.scaleRatio.y] - Scale ratio on y-axis
   * @param {object} [opts.margin]
   * @param {number} [opts.margin.left] - Left margin
   * @param {number} [opts.margin.top] - Top margin
   * @return {object} Renderer box
   */
export default function createRendererBox({ x, y, width, height, scaleRatio, margin } = {}) {
  const box = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    scaleRatio: {
      x: 1,
      y: 1
    },
    margin: {
      left: 0,
      top: 0
    }
  };

  box.x = isNaN(x) ? box.x : x;
  box.y = isNaN(y) ? box.y : y;
  box.width = isNaN(width) ? box.width : width;
  box.height = isNaN(height) ? box.height : height;
  if (typeof scaleRatio !== 'undefined') {
    box.scaleRatio.x = isNaN(scaleRatio.x) ? box.scaleRatio.x : scaleRatio.x;
    box.scaleRatio.y = isNaN(scaleRatio.y) ? box.scaleRatio.y : scaleRatio.y;
  }
  if (typeof margin !== 'undefined') {
    box.margin.left = isNaN(margin.left) ? 0 : margin.left;
    box.margin.top = isNaN(margin.top) ? 0 : margin.top;
  }

  return box;
}
