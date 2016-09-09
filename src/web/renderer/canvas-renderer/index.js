import { renderer, register } from "./canvas-renderer";

register( "rect", ( rect, g ) => {
	g.fillRect( rect.x, rect.y, rect.width, rect.height );
} );

register( "circle", ( circle, g ) => {
	g.beginPath();
	g.moveTo( circle.cx + circle.radius, circle.cy );
	g.arc( circle.cx, circle.cy, circle.radius, 0, Math.PI * 2, false );
	g.fill();
} );

export {
	renderer
};
