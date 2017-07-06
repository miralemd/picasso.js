import categoricalLegendComponent from './legend-cat';

export default function categoricalLegend(picasso) {
  picasso.component('legend-cat', categoricalLegendComponent);
}

/**
 * @typedef component
 * @experimental
 * @type {object}
 * @property {scale} type='legend-cat' - Required
 * @property {scale} scale='A_scale' - A scale. Required
 * @property {string} [dock='center'] - Docking of the component, top, right, bottom or left
 * @property {string} [align='left'] - Alignment of items in the component, left or right
 * @property {string} [direction='vertical'] - Direction of rendering, 'horizontal' or 'vertical'.
 * @property {object} [item] - Items settings
 * @property {string} [item.maxWidthPx=150] - Maximum width of each item in px
 * @property {string} [item.fontSize='12px'] - Font size of label items
 * @property {string} [item.fontFamily='Arial'] - Font family of label items
 * @property {string} [item.fill='#595959'] - Font color of label items
 * @property {object} [item.margin] - Margin settings
 * @property {number} [item.margin.top=0] - Top margin
 * @property {number} [item.margin.right=5] - Right margin
 * @property {number} [item.margin.bottom=5] - Bottom margin
 * @property {number} [item.margin.left=5] - Left margin
 * @property {object} [title] - Title settings
 * @property {boolean} [title.show=true] - Show the title
 * @property {string} [title.maxWidthPx=200] - Maximum width of the title item
 * @property {string} [title.fontSize='12px'] - Font size of title
 * @property {string} [title.fontFamily='Arial'] - Font family of title
 * @property {string} [title.fill='#595959'] - Font color of title
 * @property {string} [title.text=undefined] - Override title text. Defaults to the title of the data field
 * @property {object} [title.margin] - Margin settings
 * @property {number} [title.margin.top=0] - Top margin
 * @property {number} [title.margin.right=5] - Right margin
 * @property {number} [title.margin.bottom=5] - Bottom margin
 * @property {number} [title.margin.left=5] - Left margin
 */
