import data from './data/dataset';
import qBrushHelper from './brush/q-brush';

export default function initialize(picasso) {
  data.util = picasso.data('default').util;
  picasso.data('q', data);
}

initialize.qBrushHelper = qBrushHelper;
