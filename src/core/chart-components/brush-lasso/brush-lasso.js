import { sqrDistance } from '../../math/vector';

function getPoint(renderer, event) {
  const bounds = renderer.element().getBoundingClientRect();
  return {
    x: Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width),
    y: Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height)
  };
}

function withinThreshold(p, state, settings) {
  const startPoint = state.points[0];
  const sqrDist = sqrDistance(p, startPoint);
  return sqrDist < Math.pow(settings.settings.snapIndicator.threshold, 2);
}

function appendToPath(state, p) {
  if (state.path.d == null) {
    state.path.d = `M${p.x} ${p.y} `;
  } else {
    state.path.d += `L${p.x} ${p.y} `;
  }
  state.points.push(p);
}

function render(state, renderer, close) {
  if (close) {
    state.path.d += 'Z';
  }

  const nodes = [
    state.startPoint,
    state.path,
    state.snapIndicator
  ].filter(node => node.visible);

  renderer.render(nodes);
}

function setSnapIndictor({ state, start = null, end = null }) {
  if (start !== null) {
    state.snapIndicator.x1 = start.x;
    state.snapIndicator.y1 = start.y;
  }
  if (end !== null) {
    state.snapIndicator.x2 = end.x;
    state.snapIndicator.y2 = end.y;
  }
}

function showSnapIndicator(state, show) {
  state.snapIndicator.visible = show;
}

function setStartPoint(state, p) {
  state.startPoint.cx = p.x;
  state.startPoint.cy = p.y;
}

function initPath(stgns) {
  return {
    visible: true,
    type: 'path',
    d: null,
    fill: stgns.fill,
    stroke: stgns.stroke,
    strokeWidth: stgns.strokeWidth,
    opacity: stgns.opacity,
    collider: {
      type: null
    }
  };
}

function initSnapIndicator(stgns) {
  return {
    visible: false,
    type: 'line',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    strokeDasharray: stgns.strokeDasharray,
    stroke: stgns.stroke,
    strokeWidth: stgns.strokeWidth,
    opacity: stgns.opacity,
    collider: {
      type: null
    }
  };
}

function initStartPoint(stgns) {
  return {
    visible: true,
    type: 'circle',
    cx: 0,
    cy: 0,
    r: stgns.r,
    fill: stgns.fill,
    opacity: stgns.opacity,
    stroke: stgns.stroke,
    strokeWidth: stgns.strokeWidth,
    collider: {
      type: null
    }
  };
}

function resetState() {
  return {
    points: [],
    active: false,
    path: null,
    snapIndicator: null,
    startPoint: null
  };
}

/**
 * @typedef settings
 * @type {object}
 * @property {object} [lasso] - Lasso style settings
 * @property {string} [lasso.fill='transparent']
 * @property {string} [lasso.stroke='black']
 * @property {number} [lasso.strokeWidth=2]
 * @property {number} [lasso.opacity=0.7]
 * @property {object} [snapIndicator] - Snap indicator settings
 * @property {number} [snapIndicator.threshold=75] - The distance in pixel to show the snap indicator, if less then threshold the indicator is dispalyed
 * @property {string} [snapIndicator.strokeDasharray='5, 5']
 * @property {string} [snapIndicator.stroke='black']
 * @property {number} [snapIndicator.strokeWidth=2]
 * @property {number} [snapIndicator.opacity=0.5]
 * @property {object} [startPoint] - Start point style settings
 * @property {number} [startPoint.r=10] - Circle radius
 * @property {string} [startPoint.stroke='green']
 * @property {number} [startPoint.strokeWidth=1]
 * @property {number} [startPoint.opacity=1]
 */

const brushLassoComponent = {
  require: ['renderer', 'settings'],
  defaultSettings: {
    displayOrder: 0,
    settings: {
      snapIndicator: {
        threshold: 75,
        strokeDasharray: '5, 5',
        stroke: 'black',
        strokeWidth: 2,
        opacity: 0.5
      },
      lasso: {
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
        opacity: 0.7
      },
      startPoint: {
        r: 10,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 1,
        opacity: 1
      }
    }
  },
  created() {
    this.state = resetState();
  },
  start(e) {
    this.state.path = initPath(this.settings.settings.lasso);
    this.state.snapIndicator = initSnapIndicator(this.settings.settings.snapIndicator);
    this.state.startPoint = initStartPoint(this.settings.settings.startPoint);
    this.state.active = true;

    const p = getPoint(this.renderer, e);

    appendToPath(this.state, p);
    setSnapIndictor({ state: this.state, start: p });
    setStartPoint(this.state, p);
  },
  move(e) {
    if (!this.state.active) {
      return;
    }

    const p = getPoint(this.renderer, e);

    if (withinThreshold(p, this.state, this.settings)) {
      showSnapIndicator(this.state, true);
    } else {
      showSnapIndicator(this.state, false);
    }

    appendToPath(this.state, p);
    setSnapIndictor({ state: this.state, end: p });
    render(this.state, this.renderer, false);
  },
  end(e) {
    if (this.state.active) {
      showSnapIndicator(this.state, false);
      const p = getPoint(this.renderer, e);
      render(this.state, this.renderer, withinThreshold(p, this.state, this.settings));
    }

    this.state = resetState();
  },
  render() {
    // Do nothing
  }
  // on: {
  //   mousedown(e) {
  //     this.start(e);
  //   },
  //   mouseup(e) {
  //     this.end(e);
  //   },
  //   mousemove(e) {
  //     this.move(e);
  //   }
  // },
};

export default brushLassoComponent;
