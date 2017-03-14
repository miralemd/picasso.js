import { registry } from '../utils/registry';

import { numberFormat as d3NumberFormatter, timeFormat as d3TimeFormatter } from './d3';

const reg = registry();

export default function formatter(type, obj) {
  if (obj) {
    reg.add(type, obj);
  }
  return reg.get(type);
}

formatter('d3-number', d3NumberFormatter);
formatter('d3-time', d3TimeFormatter);
