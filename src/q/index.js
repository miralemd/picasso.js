import qDataset from './data/q-dataset';
import qFormatter from './formatter';
import qBrush from './brush/q-brush';

export default function (picasso) {
  picasso.data('q', qDataset);
  picasso.formatter('q', qFormatter);
  picasso.brush('q', qBrush);
}
