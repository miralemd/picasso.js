import snabbdom from 'snabbdom';
import snabbdomAttributes from 'snabbdom/modules/attributes';
import snabbdomEventlisteners from 'snabbdom/modules/eventlisteners';
import h from 'snabbdom/h';

const patch = snabbdom.init([
  snabbdomAttributes,
  snabbdomEventlisteners
]);

export {
  h,
  patch
};
