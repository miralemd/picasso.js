import data from './data';
import qBrushHelper from './brush/q-brush';

export default function initialize(picasso) {
  picasso.data('q', data);
}

initialize.qBrushHelper = qBrushHelper;
