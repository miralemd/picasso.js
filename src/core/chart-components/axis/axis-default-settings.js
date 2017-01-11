export function discreteDefaultSettings() {
  return {
    labels: {
      show: true,
      tilted: false,
      tiltAngle: 45,
      fontFamily: 'Arial',
      fontSize: '12px',
      fill: '#595959',
      margin: 6,
      layered: false, // TODO support auto, true and false?
      maxSize: 250
    },
    line: {
      show: true,
      strokeWidth: 1,
      stroke: '#cccccc'
    },
    ticks: {
      show: true,
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
      tilted: false,
      tiltAngle: 45,
      fontFamily: 'Arial',
      fontSize: '12px',
      fill: '#595959',
      margin: 4,
      layered: false,
      maxSize: 250
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
      tight: false,
      forceBounds: false,
      stroke: '#cccccc',
      strokeWidth: 1
    },
    minorTicks: {
      show: false,
      margin: 0,
      tickSize: 3,
      stroke: '#E6E6E6',
      strokeWidth: 1,
      count: 3
    }
  };
}
