import data from './data';
import qBrushHelper from './brush/q-brush';

export default function initialize(picasso) {
  data.normalizeProperties = picasso.data('default').normalizeProperties;
  picasso.data('q', data);
}

initialize.qBrushHelper = qBrushHelper;
