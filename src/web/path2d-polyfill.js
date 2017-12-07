/**
 * Work around for https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8438884/
 * @ignore
 */
function supportsSvgPathArgument(window) {
  const canvas = window.document.createElement('canvas');
  const g = canvas.getContext('2d');
  const p = new window.Path2D('M0 0 L1 1');
  g.strokeStyle = 'red';
  g.lineWidth = 1;
  g.stroke(p);
  const imgData = g.getImageData(0, 0, 1, 1);
  return imgData.data[0] === 255; // Check if pixel is red
}

function polyFillPath2D(window) {
  if (!window) {
    return;
  }
  if (window.Path2D && supportsSvgPathArgument(window)) {
    return;
  }

  /**
   * expected argument lengths
   * @type {Object}
   * @ignore
   */
  let argLength = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };

  /**
   * segment pattern
   * @type {RegExp}
   * @ignore
   */
  let segmentPattern = /([astvzqmhlc])([^astvzqmhlc]*)/ig;

  let number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;

  function parseValues(args) {
    let numbers = args.match(number);
    return numbers ? numbers.map(Number) : [];
  }

  /**
   * parse an svg path data string. Generates an Array
   * of commands where each command is an Array of the
   * form `[command, arg1, arg2, ...]`
   * @ignore
   *
   * @param {String} path
   * @return {Array}
   */
  function parse(path) {
    let data = [];
    path.replace(segmentPattern, (_, command, args) => {
      let type = command.toLowerCase();
      args = parseValues(args);

          // overloaded moveTo
      if (type === 'm' && args.length > 2) {
        data.push([command].concat(args.splice(0, 2)));
        type = 'l';
        command = command === 'm' ? 'l' : 'L';
      }

      while (args.length !== argLength[type]) {
        if (args.length < argLength[type]) {
          throw new Error('malformed path data');
        }
        data.push([command].concat(args.splice(0, argLength[type])));
      }
      args.unshift(command);
      return data.push(args);
    });
    return data;
  }

  /**
   * Crates a Path2D polyfill object
   * @constructor
   * @ignore
   * @param {String} path
   */
  function Path2D(path) {
    this.segments = [];
    if (path) {
      this.segments = parse(path);
    }
  }
  Path2D.prototype.moveTo = function moveTo(x, y) {
    this.segments.push(['M', x, y]);
  };
  Path2D.prototype.lineTo = function lineTo(x, y) {
    this.segments.push(['L', x, y]);
  };
  Path2D.prototype.arc = function arc(x, y, r, start, end, ccw) {
    this.segments.push(['AC', x, y, r, start, end, !!ccw]);
  };
  Path2D.prototype.closePath = function closePath() {
    this.segments.push(['Z']);
  };

  let _fill = window.CanvasRenderingContext2D.prototype.fill;
  let _stroke = window.CanvasRenderingContext2D.prototype.stroke;

  function rotatePoint(point, angle) {
    let nx = (point.x * Math.cos(angle)) - (point.y * Math.sin(angle));
    let ny = (point.y * Math.cos(angle)) + (point.x * Math.sin(angle));
    point.x = nx;
    point.y = ny;
  }

  function translatePoint(point, dx, dy) {
    point.x += dx;
    point.y += dy;
  }

  function buildPath(canvas, segments) {
    let endAngle,
      startAngle,
      largeArcFlag,
      sweepFlag,
      endPoint,
      angle,
      x,
      y,
      r,
      b,
      pathType,
      centerPoint,
      currentPoint = { x: 0, y: 0 };

    canvas.beginPath();
    for (let i = 0; i < segments.length; ++i) {
      let s = segments[i];
      pathType = s[0];
      switch (pathType) {
        case 'm':
        case 'M':
          if (pathType === 'm') {
            x = currentPoint.x + s[1];
            y = currentPoint.y + s[2];
          } else {
            x = s[1];
            y = s[2];
          }
          canvas.moveTo(x, y);
          currentPoint.x = x;
          currentPoint.y = y;
          break;
        case 'l':
        case 'L':
          if (pathType === 'l') {
            x = currentPoint.x + s[1];
            y = currentPoint.y + s[2];
          } else {
            x = s[1];
            y = s[2];
          }
          canvas.lineTo(x, y);
          currentPoint.x = x;
          currentPoint.y = y;
          break;
        case 'a':
        case 'A':
          if (pathType === 'a') {
            x = currentPoint.x + s[6];
            y = currentPoint.y + s[7];
          } else {
            x = s[6];
            y = s[7];
          }
          r = s[1];
            // s[2] = 2nd radius in ellipse, ignore
            // s[3] = rotation of ellipse, ignore
          largeArcFlag = s[4];
          sweepFlag = s[5];
          endPoint = { x, y };
            // translate all points so that currentPoint is origin
          translatePoint(endPoint, -currentPoint.x, -currentPoint.y);

            // angle to destination
          angle = Math.atan2(endPoint.y, endPoint.x);

            // rotate points so that angle is 0
          rotatePoint(endPoint, -angle);

          b = endPoint.x / 2;
            // var sweepAngle = Math.asin(b / r);

          centerPoint = { x: 0, y: 0 };
          centerPoint.x = endPoint.x / 2;
          if ((sweepFlag && !largeArcFlag) || (!sweepFlag && largeArcFlag)) {
            centerPoint.y = Math.sqrt((r * r) - (b * b));
          } else {
            centerPoint.y = -Math.sqrt((r * r) - (b * b));
          }
          startAngle = Math.atan2(-centerPoint.y, -centerPoint.x);
          endAngle = Math.atan2(endPoint.y - centerPoint.y, endPoint.x - centerPoint.x);

            // rotate back
          startAngle += angle;
          endAngle += angle;
          rotatePoint(endPoint, angle);
          rotatePoint(centerPoint, angle);

            // translate points
          translatePoint(endPoint, currentPoint.x, currentPoint.y);
          translatePoint(centerPoint, currentPoint.x, currentPoint.y);

          canvas.arc(centerPoint.x, centerPoint.y, r, startAngle, endAngle, !sweepFlag);

          currentPoint.x = x;
          currentPoint.y = y;
          break;
        case 'z':
        case 'Z':
          canvas.closePath();
          break;
        default:
          throw new Error(`${pathType} is not implemented`);
      }
    }
  }

  window.CanvasRenderingContext2D.prototype.fill = function fill(...args) {
    let fillRule = 'nonzero';
    if (args.length === 0 || (args.length === 1 && typeof args[0] === 'string')) {
      _fill.apply(this, args);
      return;
    }
    if (arguments.length === 2) {
      fillRule = args[1];
    }
    let path = args[0];
    buildPath(this, path.segments);
    _fill.call(this, fillRule);
  };

  window.CanvasRenderingContext2D.prototype.stroke = function stroke(path) {
    if (!path) {
      _stroke.call(this);
      return;
    }
    buildPath(this, path.segments);
    _stroke.call(this);
  };
  window.Path2D = Path2D;
}

export default polyFillPath2D;
