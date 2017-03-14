import init, { qDataset } from './q';
import { numberFormat as qNumberFormatter, timeFormat as qTimeFormatter } from './formatter';
import qBrushHelper from './brush/q-brush';

export {
  qBrushHelper
};

export default function initialize(picasso) {
  init(picasso);
  picasso.data('q', qDataset);
  picasso.formatter('q-number', qNumberFormatter);
  picasso.formatter('q-time', qTimeFormatter);
}
