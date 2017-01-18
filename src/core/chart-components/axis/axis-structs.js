import extend from 'extend';

export function buildTick(tick, buildOpts) {
  const struct = {
    type: 'line',
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0
  };

  if (buildOpts.align === 'top' || buildOpts.align === 'bottom') {
    struct.x1 = struct.x2 = (tick.position * buildOpts.innerRect.width) + (buildOpts.innerRect.x - buildOpts.outerRect.x);
    struct.y1 = buildOpts.align === 'top' ? buildOpts.innerRect.height : 0;
    struct.y2 = buildOpts.align === 'top' ? struct.y1 - buildOpts.tickSize : struct.y1 + buildOpts.tickSize;
  } else {
    struct.y1 = struct.y2 = (tick.position * (buildOpts.innerRect.height)) + (buildOpts.innerRect.y - buildOpts.outerRect.y);
    struct.x1 = buildOpts.align === 'left' ? buildOpts.innerRect.width : 0;
    struct.x2 = buildOpts.align === 'left' ? struct.x1 - buildOpts.tickSize : struct.x1 + buildOpts.tickSize;
  }

  const tickApplyStyle = () => {
    extend(struct, buildOpts.style);
  };

  const tickApplyPadding = () => {
    if (buildOpts.align === 'top') {
      struct.y1 -= buildOpts.padding;
      struct.y2 -= buildOpts.padding;
    } else if (buildOpts.align === 'bottom') {
      struct.y1 += buildOpts.padding;
      struct.y2 += buildOpts.padding;
    } else if (buildOpts.align === 'left') {
      struct.x1 -= buildOpts.padding;
      struct.x2 -= buildOpts.padding;
    } else if (buildOpts.align === 'right') {
      struct.x1 += buildOpts.padding;
      struct.x2 += buildOpts.padding;
    }
  };

  const tickAdjustForEnds = () => {
    const halfWidth = struct.strokeWidth / 2;

    if (struct.x1 === buildOpts.innerRect.width) { // outer end tick
      struct.x1 -= halfWidth;
      struct.x2 -= halfWidth;
    } else if (struct.x1 === 0) { // outer start tick
      struct.x1 += halfWidth;
      struct.x2 += halfWidth;
    } else if (struct.y1 === buildOpts.innerRect.height) {
      struct.y1 -= halfWidth;
      struct.y2 -= halfWidth;
    } else if (struct.y1 === 0) {
      struct.y1 += halfWidth;
      struct.y2 += halfWidth;
    }
  };

  tickApplyStyle();
  tickApplyPadding();
  tickAdjustForEnds();
  return struct;
}

function checkText(text) {
  return typeof text === 'string' || typeof text === 'number' ? text : '-';
}

export function buildLabel(tick, buildOpts) {
  const struct = {
    type: 'text',
    text: checkText(tick.label),
    x: 0,
    y: 0,
    maxWidth: buildOpts.maxWidth,
    maxHeight: buildOpts.maxHeight
  };

  if (buildOpts.align === 'top' || buildOpts.align === 'bottom') {
    struct.x = (tick.position * buildOpts.innerRect.width) + (buildOpts.innerRect.x - buildOpts.outerRect.x);
    struct.y = buildOpts.align === 'top' ? buildOpts.innerRect.height : 0;
    struct.anchor = 'middle';
  } else {
    struct.y = ((tick.position) * buildOpts.innerRect.height) + (buildOpts.innerRect.y - buildOpts.outerRect.y);
    struct.x = buildOpts.align === 'left' ? buildOpts.innerRect.width : 0;
    struct.anchor = buildOpts.align === 'left' ? 'end' : 'start';
  }

  const labelAdjustForEnds = () => {
    const outerBoundaryMultipler = 0.75;

    if (buildOpts.tilted) {
      return;
    }

    if (buildOpts.align === 'top' || buildOpts.align === 'bottom') {
      const leftBoundary = 0;
      const rightBoundary = buildOpts.outerRect.width;
      const textWidth = Math.min((buildOpts.maxWidth * outerBoundaryMultipler) / 2, buildOpts.textRect.width / 2);
      const leftTextBoundary = struct.x - textWidth;
      const rightTextBoundary = struct.x + textWidth;
      if (leftTextBoundary < leftBoundary) {
        struct.anchor = 'left';
        struct.x = buildOpts.innerRect.x - buildOpts.outerRect.x;
        struct.maxWidth *= outerBoundaryMultipler;
      } else if (rightTextBoundary > rightBoundary) {
        struct.anchor = 'end';
        struct.x = buildOpts.innerRect.width + buildOpts.innerRect.x;
        struct.maxWidth *= outerBoundaryMultipler;
      }
    } else {
      const topBoundary = 0;
      const bottomBoundary = buildOpts.outerRect.height;
      const textHeight = buildOpts.maxHeight / 2;
      const topTextBoundary = struct.y - textHeight;
      const bottomTextBoundary = struct.y + textHeight;
      if (topTextBoundary < topBoundary) {
        struct.y = buildOpts.innerRect.y - buildOpts.outerRect.y;
        struct.dy = buildOpts.textRect.height;
      } else if (bottomTextBoundary > bottomBoundary) {
        struct.y = buildOpts.innerRect.height + (buildOpts.innerRect.y - buildOpts.outerRect.y);
        struct.dy = 0;
      } else {
        const alphabeticalBaselineDivisor = 3;
        struct.dy = buildOpts.textRect.height / alphabeticalBaselineDivisor;
      }
    }
  };

  const labelApplyPadding = () => {
    if (buildOpts.align === 'top') {
      struct.y -= buildOpts.padding;
    } else if (buildOpts.align === 'bottom') {
      struct.y += buildOpts.padding + buildOpts.maxHeight;
    } else if (buildOpts.align === 'left') {
      struct.x -= buildOpts.padding;
    } else if (buildOpts.align === 'right') {
      struct.x += buildOpts.padding;
    }
  };

  const labelApplyTilting = () => {
    if (buildOpts.tilted) {
      const r = -buildOpts.angle;
      const radians = r * (Math.PI / 180);

      if (buildOpts.align === 'bottom') {
        struct.x -= (buildOpts.maxHeight * Math.sin(radians)) / 2;
        struct.y -= buildOpts.maxHeight;
        struct.y += (buildOpts.maxHeight * Math.cos(radians)) / 2;
      } else {
        struct.x -= (buildOpts.maxHeight * Math.sin(radians)) / 3;
      }

      struct.transform = `rotate(${r}, ${struct.x}, ${struct.y})`;
      struct.anchor = (buildOpts.align === 'bottom') === (buildOpts.angle < 0) ? 'start' : 'end';
    }
  };

  const labelApplyStyle = () => {
    extend(struct, buildOpts.style);
  };

  const labelApplyCollider = () => {
    if (!buildOpts.stepSize || buildOpts.layered || buildOpts.tilted) return;

    if (buildOpts.align === 'bottom' || buildOpts.align === 'top') {
      const tickCenter = tick.position * buildOpts.innerRect.width;
      const leftBoundary = tickCenter + (buildOpts.innerRect.x - buildOpts.outerRect.x - (buildOpts.stepSize / 2));
      struct.collider = {
        type: 'rect',
        x: leftBoundary,
        y: 0,
        width: leftBoundary < 0 ? buildOpts.stepSize + leftBoundary : buildOpts.stepSize, // Adjust collider so that it doesnt extend onto neighbor collider
        height: buildOpts.innerRect.height
      };
    } else {
      const tickCenter = tick.position * buildOpts.innerRect.height;
      const topBoundary = tickCenter + (buildOpts.innerRect.y - buildOpts.outerRect.y - (buildOpts.stepSize / 2));
      struct.collider = {
        type: 'rect',
        x: 0,
        y: topBoundary,
        width: buildOpts.innerRect.width,
        height: topBoundary < 0 ? buildOpts.stepSize + topBoundary : buildOpts.stepSize // Adjust collider so that it doesnt extend onto neighbor collider
      };
    }

    // Clip edges of the collider, should not extend beyoned the outerRect
    const collider = struct.collider;
    collider.x = Math.max(collider.x, 0);
    collider.y = Math.max(collider.y, 0);
    const widthClip = (collider.x + collider.width) - (buildOpts.outerRect.x + buildOpts.outerRect.width);
    collider.width = widthClip > 0 ? collider.width - widthClip : collider.width;
    const heightClip = (collider.y + collider.height) - (buildOpts.outerRect.y + buildOpts.outerRect.height);
    collider.height = heightClip > 0 ? collider.height - heightClip : collider.height;
  };

  labelApplyStyle();
  labelAdjustForEnds();
  labelApplyPadding();
  labelApplyTilting();
  labelApplyCollider();

  return struct;
}

export function buildLine(buildOpts) {
  const struct = {
    type: 'line',
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0
  };

  if (buildOpts.align === 'top' || buildOpts.align === 'bottom') {
    struct.x1 = buildOpts.innerRect.x - buildOpts.outerRect.x;
    struct.x2 = buildOpts.innerRect.width + buildOpts.innerRect.x;
    struct.y1 = struct.y2 = buildOpts.align === 'top' ? buildOpts.innerRect.height - buildOpts.padding : buildOpts.padding;
  } else {
    struct.x1 = struct.x2 = buildOpts.align === 'left' ? buildOpts.innerRect.width - buildOpts.padding : buildOpts.padding;
    struct.y1 = buildOpts.innerRect.y - buildOpts.outerRect.y;
    struct.y2 = buildOpts.innerRect.height + buildOpts.innerRect.y;
  }

  const lineApplyStyle = () => {
    extend(struct, buildOpts.style);
    const halfWidth = struct.strokeWidth / 2;

    if (buildOpts.align === 'top') {
      struct.y1 -= halfWidth;
      struct.y2 -= halfWidth;
    } else if (buildOpts.align === 'bottom') {
      struct.y1 += halfWidth;
      struct.y2 += halfWidth;
    } else if (buildOpts.align === 'left') {
      struct.x1 -= halfWidth;
      struct.x2 -= halfWidth;
    } else if (buildOpts.align === 'right') {
      struct.x1 += halfWidth;
      struct.x2 += halfWidth;
    }
  };

  lineApplyStyle();
  return struct;
}
