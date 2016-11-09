import { create } from './display-objects';
import Matrix from '../math/matrix';
import { resolveTransform } from './transform-resolver';

function traverse(items, parent, matrix) {
  items.forEach((s) => {
    const obj = create(s.type, s);
    if (obj) {
      obj.set(s);
      obj.type = s.type;

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
  });
}

export function scene(items, stage) {
  if (!stage) {
    stage = create('stage');
  }

  traverse(items, stage, new Matrix());

  return stage;
}
