export function discreteDefaultSettings() {
  return {
    labels: {
      show: true,
      tiltAngle: 40,
      maxEdgeBleed: Infinity,
      fontFamily: 'Arial',
      fontSize: '12px',
      fill: '#595959',
      margin: 6,
      maxSize: 250,
      mode: 'auto',
      maxGlyphCount: NaN
    },
    line: {
      show: false,
      strokeWidth: 1,
      stroke: '#cccccc'
    },
    ticks: {
      show: false,
      margin: 0,
      tickSize: 4,
      stroke: '#cccccc',
      strokeWidth: 1
    }
  };
}

export function continuousDefaultSettings() {
  return {
    labels: {
      show: true,
      tiltAngle: 40,
      maxEdgeBleed: Infinity,
      fontFamily: 'Arial',
      fontSize: '12px',
      fill: '#595959',
      margin: 4,
      maxSize: 250,
      mode: 'horizontal'
    },
    line: {
      show: true,
      strokeWidth: 1,
      stroke: '#cccccc'
    },
    ticks: {
      show: true,
      margin: 0,
      tickSize: 8,
      stroke: '#cccccc',
      strokeWidth: 1
    },
    minorTicks: {
      show: false,
      margin: 0,
      tickSize: 3,
      stroke: '#E6E6E6',
      strokeWidth: 1
    }
  };
}
