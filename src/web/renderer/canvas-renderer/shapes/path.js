export function render(path, { g, doStroke }) {
  const commands = path.d.match(/[a-z][^a-z]*/ig);
  let prevPoint;
  let points = [];
  g.beginPath();
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i][0];
    const params = commands[i].substr(1).trim().split(' ').map(p => parseFloat(p));
    switch (command) {
      case 'M':
        prevPoint = { x: params[0], y: params[1] };
        g.moveTo(prevPoint.x, prevPoint.y);
        break;
      case 'L':
        prevPoint = { x: params[0], y: params[1] };
        g.lineTo(prevPoint.x, prevPoint.y);
        break;
      case 'm':
        prevPoint = { x: prevPoint.x + params[0], y: prevPoint.y + params[1] };
        g.moveTo(prevPoint.x, prevPoint.y);
        break;
      case 'l':
        prevPoint = { x: prevPoint.x + params[0], y: prevPoint.y + params[1] };
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
