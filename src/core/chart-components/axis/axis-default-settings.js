export function discreteDefaultSettings() {
  return [
    {
      dock: 'bottom',
      displayOrder: 0,
      prioOrder: 0
    },
    {
      labels: {
        show: true,
        tilted: false,
        fontFamily: 'Arial',
        fontSize: '12px',
        fill: '#595959',
        padding: 6,
        layered: false // TODO support auto, true and false?
      },
      line: {
        show: true,
        strokeWidth: 1,
        stroke: '#cccccc'
      },
      ticks: {
        show: true,
        padding: 0,
        tickSize: 4,
        stroke: '#cccccc',
        strokeWidth: 1
      }
    }
  ];
}

export function continuousDefaultSettings() {
  return [
    {
      dock: 'left',
      displayOrder: 0,
      prioOrder: 0
    },
    {
      labels: {
        show: true,
        tilted: false,
        fontFamily: 'Arial',
        fontSize: '12px',
        fill: '#595959',
        padding: 4,
        layered: false
      },
      line: {
        show: true,
        strokeWidth: 1,
        stroke: '#cccccc'
      },
      ticks: {
        show: true,
        padding: 0,
        tickSize: 8,
        tight: false,
        forceBounds: false,
        stroke: '#cccccc',
        strokeWidth: 1
      },
      minorTicks: {
        show: false,
        padding: 0,
        tickSize: 3,
        stroke: '#E6E6E6',
        strokeWidth: 1,
        count: 3
      }
    }
  ];
}
