import renderer from '../../renderer';
import { registry } from '../../utils/registry';
import { axis } from './axis';

const reg = registry();

reg.register('axis', axis);

export default function axisFactory(axes, composer) {
  return axes.map((axisConfig) => {
    const rend = renderer();
    rend.appendTo(composer.container());
    return reg.registry.axis(axisConfig, composer, rend);
  });
}
