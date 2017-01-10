import { register as registerData } from '../core/data';
import qDataset from './data/q-dataset';

import { register as registerFormatter } from '../core/formatter';
import qFormatter from './formatter';

import qBrush from './brush/q-brush';

registerData('q', qDataset);
registerFormatter('q', qFormatter);

const q = {
  brush: qBrush
};

export default q;
