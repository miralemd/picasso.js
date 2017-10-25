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
 * @property {string} [anchor='left'] - Is used to align items in the component, left or right
 * @property {string} [direction='vertical'] - Direction of rendering, 'horizontal' or 'vertical'.
 * @property {object} [settings]
 * @property {string} [settings.anchor='left'] - Is used to align items in the component, left or right
 * @property {string} [settings.direction='vertical'] - Direction of rendering, 'horizontal' or 'vertical'.
 * @property {object} [settings.layout] - Layout setting for the items
 * @property {object} [settings.layout.mode='stack'] - Use `stack` to let each item only take as much space a required or else each item will take a fixed amount of space to give each item equal distance between each other
 * @property {object} [settings.item] - Items settings
 * @property {object} [settings.item.label] - Label settings, the value is derived from the scale
 * @property {string} [settings.item.label.maxWidth=136] - Maximum width of each label in px
 * @property {string} [settings.item.label.fontSize='12px'] - Font size of label items
 * @property {string} [settings.item.label.fontFamily='Arial'] - Font family of label items
 * @property {string} [settings.item.label.fill='#595959'] - Font color of label items
 * @property {string} [settings.item.label.breakWord='none'] - Word break rule, how to apply line break if label text overflow it's maxWidth prop. Either `break-word` or `break-all`
 * @property {number} [settings.item.label.maxLines=2] - Max number of lines allowed if label is broken into multiple lines (only applicable with wordBreak)
 * @property {string} [settings.item.label.hyphens='auto'] - How words should be hyphenated when text wraps across multiple lines (only applicable with wordBreak)
 * @property {number} [settings.item.label.lineHeight=1.2] - A multiplier defining the distance between lines (only applicable with wordBreak)
 * @property {object} [settings.item.margin] - Margin settings
 * @property {number} [settings.item.margin.top=0] - Top margin
 * @property {number} [settings.item.margin.right=5] - Right margin
 * @property {number} [settings.item.margin.bottom=5] - Bottom margin
 * @property {number} [settings.item.margin.left=5] - Left margin
 * @property {object|string} [settings.item.shape] - Shape definition or shape type. Each shape may have their own unique properties that can also be set as part of the shape object.
 * @property {string} [settings.item.shape.type='square'] Shape type
 * @property {string} [settings.item.shape.fill] Fill of shape. Defaults to scale color if avaiable.
 * @property {string} [settings.item.shape.stroke] Stroke of shape. Defaults to scale color if avaiable.
 * @property {string} [settings.item.shape.strokeWidth=1] Stroke width of shape.
 * @property {function|boolean} [settings.item.show=true] - Set to 'false' to hide the current item
 * @property {object} [settings.title] - Title settings
 * @property {string} [settings.title.maxWidth=156] - Maximum width of each label in px
 * @property {string} [settings.title.fontSize='12px'] - Font size of label items
 * @property {string} [settings.title.fontFamily='Arial'] - Font family of label items
 * @property {string} [settings.title.fill='#595959'] - Font color of label items
 * @property {string} [settings.title.breakWord='none'] - Word break rule, how to apply line break if label text overflow it's maxWidth prop. Either `break-word` or `break-all`
 * @property {number} [settings.title.maxLines=2] - Max number of lines allowed if label is broken into multiple lines (only applicable with wordBreak)
 * @property {string} [settings.title.hyphens='auto'] - How words should be hyphenated when text wraps across multiple lines (only applicable with wordBreak)
 * @property {number} [settings.title.lineHeight=1.2] - A multiplier defining the distance between lines (only applicable with wordBreak)
 * @property {string} [settings.title.text=undefined] - Override title text. Defaults to the title of the data field
 * @property {object} [settings.title.margin] - Margin settings
 * @property {number} [settings.title.margin.top=0] - Top margin
 * @property {number} [settings.title.margin.right=5] - Right margin
 * @property {number} [settings.title.margin.bottom=5] - Bottom margin
 * @property {number} [settings.title.margin.left=5] - Left margin
 * @property {object} [settings.buttons] - Button settings
 * @property {boolean} [settings.buttons.show=true] - Show the scroll/paging buttons (will still auto hide when not needed)
 * @property {object} [settings.buttons.rect] - Settings for the rect of the buttons
 * @property {string} [settings.buttons.rect.fill='transparent'] - Fill color
 * @property {string} [settings.buttons.rect.stroke='grey'] - Stroke color
 * @property {number} [settings.buttons.rect.strokeWidth=0] - Stroke width in pixels
 * @property {object} [settings.buttons.symbol] - Settings for the symbol of the buttons
 * @property {string} [settings.buttons.symbol.fill='grey'] - Symbol fill color
 * @property {string} [settings.buttons.symbol.stroke='grey'] - Stroke color
 * @property {number} [settings.buttons.symbol.strokeWidth=2] - Stroke width in pixels
 * @property {object} [settings.buttons.'rect:disabled'] - Settings for the disabled rect of the buttons
 * @property {string} [settings.buttons.'rect:disabled'.fill='transparent'] - Fill color
 * @property {string} [settings.buttons.'rect:disabled'.stroke='lightgrey'] - Stroke color
 * @property {number} [settings.buttons.'rect:disabled'.strokeWidth=0] - Stroke width in pixels
 * @property {object} [settings.buttons.'symbol:disabled'] - Settings for the disabled symbol of the buttons
 * @property {string} [settings.buttons.'symbol:disabled'.fill='lightgrey'] - Symbol fill color
 * @property {string} [settings.buttons.'symbol:disabled'.stroke='grey'] - Stroke color
 * @property {number} [settings.buttons.'symbol:disabled'.strokeWidth=2] - Stroke width in pixels
 */
