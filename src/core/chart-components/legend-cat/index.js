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
 * @property {object} [items] - Items settings
 * @property {string} [items.fontSize='12px'] - Font size of label items
 * @property {string} [items.fontFamily='Arial'] - Font family of label items
 * @property {string} [items.fill='#595959'] - Font color of label items
 * @property {object} [items.padding] - Padding settings
 * @property {number} [items.padding.top=0] - Top padding
 * @property {number} [items.padding.right=5] - Right padding
 * @property {number} [items.padding.bottom=5] - Bottom padding
 * @property {number} [items.padding.left=5] - Left padding
 * @property {object} [title] - Title settings
 * @property {boolean} [title.show=true] - Show the title
 * @property {string} [title.fontSize='12px'] - Font size of title
 * @property {string} [title.fontFamily='Arial'] - Font family of title
 * @property {string} [title.fill='#595959'] - Font color of title
 * @property {string} [title.text=undefined] - Override title text. Defaults to the title of the data field
 * @property {object} [title.padding] - Padding settings
 * @property {number} [title.padding.top=0] - Top padding
 * @property {number} [title.padding.right=5] - Right padding
 * @property {number} [title.padding.bottom=5] - Bottom padding
 * @property {number} [title.padding.left=5] - Left padding
 */
