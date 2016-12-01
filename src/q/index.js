import { register as registerData } from '../core/data';
import { qTable } from './data/q-table';

import { register as registerFormatter } from '../core/formatter';
import qFormatter from './formatter';

registerData('q', qTable);
registerFormatter('q', qFormatter);
