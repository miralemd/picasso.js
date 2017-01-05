import snabbdom from 'snabbdom';
import snabbdomProps from 'snabbdom/modules/props';
import snabbdomClass from 'snabbdom/modules/class';
import snabbdomStyle from 'snabbdom/modules/style';
import snabbdomEventlisteners from 'snabbdom/modules/eventlisteners';
import h from 'snabbdom/h';

const patch = snabbdom.init([
  snabbdomProps,
  snabbdomClass,
  snabbdomStyle,
  snabbdomEventlisteners
]);

export {
  h,
  patch
};
