import { register as registerData } from '../core/data';
import qDataset from './data/q-dataset';

import { register as registerFormatter } from '../core/formatter';
import qFormatter from './formatter';

registerData('q', qDataset);
registerFormatter('q', qFormatter);
