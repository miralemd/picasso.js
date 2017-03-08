export default function render(path, { g, doStroke }) {
  const commands = path.d.match(/[a-z][^a-z]*/ig);

  let prevPoint;
  const points = [];
  g.beginPath();
  for (let i = 0; i < commands.length; i++) {
    const params = commands[i].match(/([ml])\s?(\S+)(?:\s|,)(\S+)/i);
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
      default:
        break;
    }
    points.push(prevPoint);
  }
  if (doStroke) {
    g.stroke();
  }
}
