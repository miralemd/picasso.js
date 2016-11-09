import { renderer } from '../../renderer';
import { text } from './text';
import { registry } from '../../utils/registry';

const reg = registry();
reg.register('text', text);

export function textFactory(texts, composer) {
  return texts.map((config) => {
    const rend = renderer();
    rend.appendTo(composer.container());

    return reg.registry.text(config, composer, rend);
  });
}
