import { create } from './display-objects';
import Matrix from '../math/matrix';
import resolveTransform from './transform-resolver';
import contextFactory from './context';

const styleContext = contextFactory(
  [
    'stroke',
    'fill',
    'strokeWidth',
    'opacity',
    'fontFamily',
    'fontSize',
    'baseline'
  ]
);

function traverse(items, parent, matrix) {
  items.forEach((s) => {
    // Save the current style context to be able to inherit styles
    s = styleContext.save(s);

    const obj = create(s.type, s);
    if (obj) {
      if (s.transform) {
        matrix.save();
        resolveTransform(s.transform, matrix);
      }

      if (!matrix.isIdentity()) {
        obj.modelViewMatrix = matrix.clone();
      }

      parent.addChild(obj);
      if (s.children) {
        traverse(s.children, obj, matrix);
      }

      if (s.transform) {
        matrix.restore();
      }
    }

    // Revert to previous style context
    styleContext.restore();
  });
}

export default function scene({ items, stage, dpi }) {
  if (!stage) {
    stage = create('stage', dpi);
  }

  traverse(items, stage, new Matrix());

  return stage;
}
