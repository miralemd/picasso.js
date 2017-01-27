import extend from 'extend';

function checkText(text) {
  return typeof text === 'string' || typeof text === 'number' ? text : '-';
}

function appendStyle(struct, buildOpts) {
  extend(struct, buildOpts.style);
}

function adjustForEnds(struct, buildOpts) {
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
      struct.anchor = 'start';
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
}

function appendPadding(struct, buildOpts) {
  if (buildOpts.align === 'top') {
    struct.y -= buildOpts.padding;
  } else if (buildOpts.align === 'bottom') {
    struct.y += buildOpts.padding + buildOpts.maxHeight;
  } else if (buildOpts.align === 'left') {
    struct.x -= buildOpts.padding;
  } else if (buildOpts.align === 'right') {
    struct.x += buildOpts.padding;
  }
}

function appendTilting(struct, buildOpts) {
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
}

function appendCollider(tick, struct, buildOpts) {
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
}

function appendBounds(struct, buildOpts) {
  const width = Math.min(struct.maxWidth, buildOpts.maxWidth, buildOpts.textRect.width);
  const height = Math.min(struct.maxHeight, buildOpts.maxHeight, buildOpts.textRect.height);
  const dx = struct.dx || 0;
  const dy = struct.dy || 0;

  struct.boundingRect = {
    x: 0,
    y: (struct.y + dy) - height,
    width,
    height
  };

  if (struct.anchor === 'middle') {
    struct.boundingRect.x = (struct.x + dx) - (width / 2);
  } else if (struct.anchor === 'end') {
    struct.boundingRect.x = (struct.x + dx) - width;
  } else {
    struct.boundingRect.x = struct.x + dx;
  }
}

export default function buildNode(tick, buildOpts) {
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

  appendStyle(struct, buildOpts);
  adjustForEnds(struct, buildOpts);
  appendPadding(struct, buildOpts);
  appendTilting(struct, buildOpts);
  appendCollider(tick, struct, buildOpts);
  appendBounds(struct, buildOpts);

  return struct;
}
