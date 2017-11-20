const palettes = [
  {
    key: 'categorical',
    colors: [
      ['#a54343', '#d76c6c', '#ec983d', '#ecc43d', '#f9ec86', '#cbe989', '#70ba6e', '#578b60', '#79d69f', '#26a0a7', '#138185', '#65d3da'] // breeze colors
    ]
  },
  {
    key: 'diverging',
    colors: [
      ['#3d52a1', '#3a89c9', '#77b7e5', '#b4ddf7', '#e6f5fe', '#ffe3aa', '#f9bd7e', '#ed875e', '#d24d3e', '#ae1c3e']
    ]
  },
  {
    key: 'sequential',
    colors: [
      ['rgb(180,221,212)', 'rgb(34, 83, 90)']
    ]
  }
];

/* eslint quote-props: 0 */
const style = {
  // FONTS
  '$font-family': 'Arial',
  '$font-size-m': '12px',
  '$line-height-m': '16px',

  // COLORS
  '$primary': 'steelblue',

  // MIXINS
  '$shape': {
    fill: '$primary',
    strokeWidth: 0,
    stroke: '#ccc'
  },

  '$label': {
    fontSize: '$font-size-m',
    fontFamily: '$font-family',
    fill: '#333'
  }
};

export {
  style,
  palettes
};
