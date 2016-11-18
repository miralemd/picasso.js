import { default as extend } from 'extend';

const DISCRETE_DEFAULT_STYLE = {
  labels: {
    show: true,
    tilted: false,
    fontFamily: 'Arial',
    fontSize: '13px',
    fill: '#999',
    padding: 6,
    layered: false // TODO support auto, true and false?
  },
  line: {
    show: true,
    strokeWidth: 1,
    stroke: '#999'
  },
  ticks: {
    show: true,
    padding: 0,
    tickSize: 4,
    stroke: '#999',
    strokeWidth: 1
  }
};

const CONTINOUS_DEFAULT_STYLE = {
  labels: {
    show: true,
    tilted: false,
    fontFamily: 'Arial',
    fontSize: '13px',
    fill: '#999',
    padding: 4,
    layered: false
  },
  line: {
    show: true,
    strokeWidth: 1,
    stroke: '#999'
  },
  ticks: {
    show: true,
    padding: 0,
    tickSize: 8,
    tight: false,
    forceBounds: false,
    stroke: '#999',
    strokeWidth: 1
  },
  minorTicks: {
    show: false,
    padding: 0,
    tickSize: 3,
    stroke: '#999',
    strokeWidth: 1,
    count: 3
  }
};

export function discreteDefaultSettings() {
  return [
    {
      dock: 'bottom',
      displayOrder: 0,
      prioOrder: 0
    },
    extend(true, {}, DISCRETE_DEFAULT_STYLE)
  ];
}

export function continuousDefaultSettings() {
  return [
    {
      dock: 'left',
      displayOrder: 0,
      prioOrder: 0
    },
    extend(true, {}, CONTINOUS_DEFAULT_STYLE)
  ];
}
