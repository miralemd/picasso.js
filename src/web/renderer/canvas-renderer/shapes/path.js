export default function render(path, { g, doStroke, doFill }) {
  const commands = path.d.match(/[a-z][^a-z]*/ig);

  let prevPoint;
  const points = [];
  g.beginPath();
  for (let i = 0; i < commands.length; i++) {
    const params = commands[i].match(/([mlz])\s?(\S+)?(?:\s|,)?(\S+)?/i);
    const command = params[1];
    const x = +params[2];
    const y = +params[3];
    switch (command) {
      case 'M':
        prevPoint = { x, y };
        g.moveTo(prevPoint.x, prevPoint.y);
        break;
      case 'L':
        prevPoint = { x, y };
        g.lineTo(prevPoint.x, prevPoint.y);
        break;
      case 'm':
        prevPoint = { x: prevPoint.x + x, y: prevPoint.y + y };
        g.moveTo(prevPoint.x, prevPoint.y);
        break;
      case 'l':
        prevPoint = { x: prevPoint.x + x, y: prevPoint.y + y };
        g.lineTo(prevPoint.x, prevPoint.y);
        break;
      case 'Z':
      case 'z':
        g.closePath();
        break;
      default:
        break;
    }
    points.push(prevPoint);
  }
  if (doFill) {
    g.fill();
  }
  if (doStroke) {
    g.stroke();
  }
}
