import registry from '../utils/registry';
import dataset from './dataset';

const dataRegistry = registry();

dataRegistry.default('default');

dataRegistry('default', dataset);

export {
  dataRegistry as default
};
