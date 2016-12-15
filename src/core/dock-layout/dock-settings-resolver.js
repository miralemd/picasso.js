import extend from 'extend';

function roundRect(rect) {
  rect.x = Math.ceil(rect.x);
  rect.y = Math.ceil(rect.y);
  rect.width = Math.ceil(rect.width);
  rect.height = Math.ceil(rect.height);
}

function getRect(container, settings) {
  const containerRect = { x: 0, y: 0, width: 0, height: 0 };
  const logicalContainerRect = { x: 0, y: 0, width: 0, height: 0 };

  // Check input object for size
  if (typeof container.getBoundingClientRect === 'function') {
    const boundingRect = container.getBoundingClientRect();
    containerRect.width = boundingRect.width;
    containerRect.height = boundingRect.height;
  } else {
    containerRect.width = container.width || 0;
    containerRect.height = container.height || 0;
  }

  // Check settings defintion for size
  if (typeof settings.size !== 'undefined') {
    containerRect.width = isNaN(settings.size.width) ? containerRect.width : settings.size.width;
    containerRect.height = isNaN(settings.size.height) ? containerRect.height : settings.size.height;
  }

  if (typeof settings.logicalSize !== 'undefined') {
    logicalContainerRect.width = isNaN(settings.logicalSize.width) ? containerRect.width : settings.logicalSize.width;
    logicalContainerRect.height = isNaN(settings.logicalSize.height) ? containerRect.height : settings.logicalSize.height;
    logicalContainerRect.preserveAspectRatio = settings.logicalSize.preserveAspectRatio;
  } else {
    logicalContainerRect.width = containerRect.width;
    logicalContainerRect.height = containerRect.height;
    logicalContainerRect.preserveAspectRatio = false;
  }

  roundRect(logicalContainerRect);
  roundRect(containerRect);

  return [logicalContainerRect, containerRect];
}

export default function resolveLayout(container, settings) {
  return getRect(container, settings);
}

export function resolveSettings(s) {
  const settings = {
    logicalSize: {
      preserveAspectRatio: false
    }
  };

  extend(true, settings, s);
  return settings;
}
